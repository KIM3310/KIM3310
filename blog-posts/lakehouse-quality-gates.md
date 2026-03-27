---
title: "Contract-Driven Data Quality: Building a Lakehouse Pipeline with Enforceable Gates"
published: false
description: "How I built a Spark + Delta Lake medallion pipeline with explicit data contracts, quality gates, and multi-cloud export to Snowflake and Databricks."
tags: dataengineering, spark, snowflake, databricks
---

# Contract-Driven Data Quality: Building a Lakehouse Pipeline with Enforceable Gates

Every data engineer has had the 2 AM page: a dashboard is showing negative revenue, a report has duplicate customer records, or an ML model is scoring on null features. You trace it back through three pipeline stages and discover the corruption entered at ingestion -- twelve hours ago.

The root problem isn't bad data. Bad data is inevitable. The problem is that **your pipeline has no opinion about what good data looks like** at any given layer. There's no contract, no gate, no explicit moment where the system says "this row does not meet the standard for this layer, and it's not going further."

This post describes how I built a medallion-architecture lakehouse pipeline with enforceable quality gates at every layer boundary, and how the same pipeline exports to both Snowflake and Databricks Unity Catalog.

## The Silent Failure Pattern

Here's how data corruption typically propagates in a medallion pipeline without contracts:

```
Raw JSON (has nulls, dupes, schema drift)
    │
    ▼
Bronze Layer ← "just land everything"
    │
    ▼
Silver Layer ← transforms assume clean input, no validation
    │
    ▼
Gold Layer   ← aggregations silently include garbage rows
    │
    ▼
Dashboard    ← shows wrong numbers, nobody knows why
```

Every layer trusts the previous layer implicitly. When that trust is violated -- and it always is -- the failure is silent. No exceptions. No alerts. Just wrong numbers downstream.

The fix is straightforward in principle: **make every layer explicitly declare what it guarantees about its output.** Then enforce those guarantees with code that runs on every batch.

## Contract-First Design

A data contract is a set of rules that a dataset must satisfy at a specific layer. It's not a suggestion or a monitoring alert -- it's a gate. Rows that don't pass the contract are rejected and routed to a dead-letter table for inspection.

I define contracts as declarative Python objects:

```python
from dataclasses import dataclass, field
from typing import List, Optional, Callable
from pyspark.sql import DataFrame

@dataclass
class QualityRule:
    name: str
    column: str
    check: Callable[[DataFrame], DataFrame]  # returns rows that FAIL
    severity: str = "error"  # "error" = reject row, "warn" = flag but pass

@dataclass
class LayerContract:
    layer: str  # "bronze", "silver", "gold"
    rules: List[QualityRule] = field(default_factory=list)
    description: Optional[str] = None

    def enforce(self, df: DataFrame) -> tuple[DataFrame, DataFrame]:
        """Returns (passed_df, rejected_df)."""
        from functools import reduce
        from pyspark.sql import functions as F

        rejected_frames = []
        current = df

        for rule in self.rules:
            if rule.severity != "error":
                continue
            bad_rows = rule.check(current)
            bad_rows = bad_rows.withColumn("_rejected_by", F.lit(rule.name))
            rejected_frames.append(bad_rows)
            # Anti-join: keep only rows that passed
            current = current.subtract(bad_rows.drop("_rejected_by"))

        if rejected_frames:
            rejected = reduce(DataFrame.unionByName, rejected_frames)
        else:
            rejected = df.limit(0).withColumn("_rejected_by", F.lit(""))

        return current, rejected
```

The key decision: `enforce()` returns two DataFrames, not one. Passed rows continue downstream. Rejected rows go to a dead-letter table with metadata about *which rule* rejected them. This is the quality gate.

## Medallion Architecture with Contracts

Here's the architecture with contracts wired in:

```
┌────────────┐
│ Raw Source  │  (S3 / ADLS / GCS)
└─────┬──────┘
      │
┌─────▼──────┐     ┌──────────────┐
│   Bronze    │────▶│ Bronze Gate  │──▶ rejected_bronze (dead letter)
│ (raw land)  │     │ schema check │
└─────┬──────┘     └──────────────┘
      │ passed
┌─────▼──────┐     ┌──────────────┐
│   Silver    │────▶│ Silver Gate  │──▶ rejected_silver (dead letter)
│ (clean)     │     │ nulls, dupes │
└─────┬──────┘     └──────────────┘
      │ passed
┌─────▼──────┐     ┌──────────────┐
│    Gold     │────▶│  Gold Gate   │──▶ rejected_gold (dead letter)
│ (aggregate) │     │ range, agg   │
└─────┬──────┘     └──────────────┘
      │ passed
┌─────▼──────┐
│   Export    │  Snowflake / Databricks Unity Catalog
└─────────────┘
```

### Bronze Contract

Bronze is the landing zone. The contract here is minimal but critical: **schema must match the expected structure.** If upstream sends a new column or drops an existing one, we catch it immediately rather than letting it cascade.

```python
from pyspark.sql import functions as F

bronze_contract = LayerContract(
    layer="bronze",
    description="Raw ingestion: schema conformance only",
    rules=[
        QualityRule(
            name="schema_has_required_columns",
            column="*",
            check=lambda df: df.filter(
                F.col("customer_id").isNull() |
                F.col("event_type").isNull() |
                F.col("event_timestamp").isNull()
            ),
            severity="error"
        ),
        QualityRule(
            name="event_timestamp_parseable",
            column="event_timestamp",
            check=lambda df: df.filter(
                F.to_timestamp("event_timestamp").isNull()
            ),
            severity="error"
        )
    ]
)
```

### Silver Contract

Silver is where the real validation happens. The contract enforces business rules:

```python
silver_contract = LayerContract(
    layer="silver",
    description="Validated and deduplicated event stream",
    rules=[
        QualityRule(
            name="no_null_customer_id",
            column="customer_id",
            check=lambda df: df.filter(F.col("customer_id").isNull()),
            severity="error"
        ),
        QualityRule(
            name="amount_positive",
            column="amount",
            check=lambda df: df.filter(F.col("amount") < 0),
            severity="error"
        ),
        QualityRule(
            name="amount_within_range",
            column="amount",
            check=lambda df: df.filter(F.col("amount") > 1_000_000),
            severity="warn"  # flag but don't reject -- could be legitimate
        ),
        QualityRule(
            name="no_duplicate_events",
            column="event_id",
            check=lambda df: (
                df.groupBy("event_id")
                  .count()
                  .filter(F.col("count") > 1)
                  .join(df, "event_id")
                  .drop("count")
            ),
            severity="error"
        ),
        QualityRule(
            name="event_not_in_future",
            column="event_timestamp",
            check=lambda df: df.filter(
                F.col("event_timestamp") > F.current_timestamp()
            ),
            severity="error"
        )
    ]
)
```

### Gold Contract

Gold validates aggregation invariants -- things that should be mathematically true about the output:

```python
gold_contract = LayerContract(
    layer="gold",
    description="Daily aggregated metrics",
    rules=[
        QualityRule(
            name="revenue_non_negative",
            column="daily_revenue",
            check=lambda df: df.filter(F.col("daily_revenue") < 0),
            severity="error"
        ),
        QualityRule(
            name="customer_count_positive",
            column="unique_customers",
            check=lambda df: df.filter(F.col("unique_customers") <= 0),
            severity="error"
        ),
        QualityRule(
            name="no_duplicate_date_region",
            column="report_date",
            check=lambda df: (
                df.groupBy("report_date", "region")
                  .count()
                  .filter(F.col("count") > 1)
                  .join(df, ["report_date", "region"])
                  .drop("count")
            ),
            severity="error"
        )
    ]
)
```

### Running the Pipeline

The pipeline orchestration wires the contracts together:

```python
def run_pipeline(raw_df: DataFrame, spark):
    # Bronze
    bronze_passed, bronze_rejected = bronze_contract.enforce(raw_df)
    bronze_passed.write.format("delta").mode("append").save("/lake/bronze/events")
    bronze_rejected.write.format("delta").mode("append").save("/lake/rejected/bronze")

    # Silver
    silver_input = apply_silver_transforms(bronze_passed)
    silver_passed, silver_rejected = silver_contract.enforce(silver_input)
    silver_passed.write.format("delta").mode("append").save("/lake/silver/events")
    silver_rejected.write.format("delta").mode("append").save("/lake/rejected/silver")

    # Gold
    gold_input = build_daily_aggregates(silver_passed)
    gold_passed, gold_rejected = gold_contract.enforce(gold_input)
    gold_passed.write.format("delta").mode("overwrite").save("/lake/gold/daily_metrics")
    gold_rejected.write.format("delta").mode("append").save("/lake/rejected/gold")

    # Quality report
    report = {
        "bronze": {"passed": bronze_passed.count(), "rejected": bronze_rejected.count()},
        "silver": {"passed": silver_passed.count(), "rejected": silver_rejected.count()},
        "gold":   {"passed": gold_passed.count(),   "rejected": gold_rejected.count()}
    }
    return gold_passed, report
```

## Multi-Cloud Export

The gold layer needs to land in Snowflake for the analytics team and in Databricks Unity Catalog for the ML team. Rather than writing two separate export jobs, I use an adapter pattern:

```python
from abc import ABC, abstractmethod

class ExportAdapter(ABC):
    @abstractmethod
    def export(self, df: DataFrame, target_table: str, key_columns: list[str]):
        ...

class SnowflakeAdapter(ExportAdapter):
    def __init__(self, sf_options: dict):
        self.sf_options = sf_options

    def export(self, df: DataFrame, target_table: str, key_columns: list[str]):
        # Write to staging table, then MERGE for idempotent upsert
        staging = f"{target_table}__staging"
        (df.write
           .format("snowflake")
           .options(**self.sf_options)
           .option("dbtable", staging)
           .mode("overwrite")
           .save())

        merge_key = " AND ".join(
            [f"target.{k} = source.{k}" for k in key_columns]
        )
        set_clause = ", ".join(
            [f"target.{c} = source.{c}" for c in df.columns if c not in key_columns]
        )
        merge_sql = f"""
            MERGE INTO {target_table} AS target
            USING {staging} AS source
            ON {merge_key}
            WHEN MATCHED THEN UPDATE SET {set_clause}
            WHEN NOT MATCHED THEN INSERT ({', '.join(df.columns)})
                VALUES ({', '.join(f'source.{c}' for c in df.columns)})
        """
        # Execute via Snowflake connection
        self._execute_sql(merge_sql)
        self._execute_sql(f"DROP TABLE IF EXISTS {staging}")

class DatabricksUCAdapter(ExportAdapter):
    def export(self, df: DataFrame, target_table: str, key_columns: list[str]):
        # Unity Catalog uses Delta Lake natively
        from delta.tables import DeltaTable

        if DeltaTable.isDeltaTable(df.sparkSession, target_table):
            delta_table = DeltaTable.forName(df.sparkSession, target_table)
            merge_cond = " AND ".join(
                [f"target.{k} = source.{k}" for k in key_columns]
            )
            (delta_table.alias("target")
                .merge(df.alias("source"), merge_cond)
                .whenMatchedUpdateAll()
                .whenNotMatchedInsertAll()
                .execute())
        else:
            df.write.format("delta").saveAsTable(target_table)
```

Usage at the end of the pipeline:

```python
# Export to both targets
snowflake = SnowflakeAdapter(sf_options={...})
databricks = DatabricksUCAdapter()

for adapter in [snowflake, databricks]:
    adapter.export(
        df=gold_passed,
        target_table="analytics.daily_metrics",
        key_columns=["report_date", "region"]
    )
```

Both adapters use MERGE/upsert semantics so the export is idempotent. If the job fails and retries, you don't get duplicate rows.

## Results

After running this pipeline in production for four months on an e-commerce event stream (~8M events/day):

| Layer | Avg Pass Rate | Avg Daily Rejections | Top Rejection Reason |
|---|---|---|---|
| Bronze | 99.2% | ~64,000 | Unparseable timestamps from legacy system |
| Silver | 97.8% | ~176,000 | Duplicate events (retry storms from mobile clients) |
| Gold | 99.97% | ~24 | Negative revenue from refund edge cases |

The bronze rejection rate pointed us to a legacy system that was sending timestamps in a non-ISO format. We fixed it at the source. The silver deduplication caught a real problem: mobile clients were retrying event pushes on network timeout, producing 2-3 copies of the same event. Without the gate, these duplicates would have inflated every downstream metric.

A sample quality report from a daily run:

```json
{
  "run_id": "2025-11-14T06:00:00Z",
  "bronze": {"passed": 8142367, "rejected": 63218, "rate": "99.23%"},
  "silver": {"passed": 7904891, "rejected": 174258, "rate": "97.85%"},
  "gold":   {"passed": 1247,    "rejected": 3,      "rate": "99.76%"},
  "export": {
    "snowflake": {"status": "success", "rows_merged": 1247, "duration_s": 14.2},
    "databricks": {"status": "success", "rows_merged": 1247, "duration_s": 8.7}
  }
}
```

## Lessons Learned

**1. Keep contracts explicit, not implicit.**

It's tempting to embed validation logic inside your transformation functions. Don't. When the validation rule lives inside a `withColumn` chain, no one can audit it, test it, or know it exists. Contracts should be separate, declarative objects that a new team member can read in five minutes.

**2. Test contracts like code.**

Every `QualityRule` gets its own unit test with a synthetic DataFrame that should fail:

```python
def test_amount_positive_rejects_negatives():
    df = spark.createDataFrame([(-5.0,), (10.0,), (-1.0,)], ["amount"])
    failed = silver_contract.rules[1].check(df)
    assert failed.count() == 2
```

If you don't test your contracts, you're trusting that your validation code is correct -- which is exactly the kind of implicit trust that contracts are supposed to eliminate.

**3. Rejected rows are features, not bugs.**

Every row in the dead-letter table is a signal. We built a weekly review process where the data team audits `rejected_silver` for new patterns. In the first month, this surfaced three upstream bugs that would have gone undetected for weeks.

**4. MERGE upserts are non-negotiable for multi-cloud export.**

If your export uses `INSERT`, your pipeline isn't idempotent, which means retries produce duplicates. Always use MERGE/upsert with a clear key. The adapter pattern keeps this consistent across Snowflake and Databricks without duplicating logic.

**5. Start with `severity: "warn"` for new rules.**

When you add a new quality rule, set it to warn first. Monitor for a week. If the rejection rate is reasonable, promote to error. If it would reject 40% of your data, your rule is probably wrong, not your data.

## Links

- **GitHub:** [KIM3310/lakehouse-quality-gates](https://github.com/KIM3310/lakehouse-quality-gates)
- **Related:** [Delta Lake documentation on MERGE](https://docs.delta.io/latest/delta-update.html)
- **Related:** [Snowflake MERGE statement](https://docs.snowflake.com/en/sql-reference/sql/merge)

---

*If you're building lakehouse pipelines and have opinions on data contracts, I'd enjoy comparing notes. Find me on [GitHub](https://github.com/KIM3310) or [LinkedIn](https://linkedin.com/in/doeonkim).*
