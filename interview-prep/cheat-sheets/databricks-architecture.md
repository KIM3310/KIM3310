# Databricks Architecture Cheat Sheet

Quick reference for system design interviews and Solutions Architect roles.

---

## Lakehouse Architecture

The Lakehouse combines the best of data lakes (cheap storage, open formats, ML support) with data warehouses (ACID transactions, schema enforcement, governance).

```
┌───────────────────────────────────────────────────────┐
│                   APPLICATIONS                         │
│                                                       │
│  BI/SQL Analytics    ML/AI Workloads   Streaming      │
│  (Databricks SQL,   (MLflow, Mosaic   (Structured     │
│   BI tools via       AI, Notebooks)    Streaming,     │
│   JDBC/ODBC)                           Auto Loader)   │
└──────────────────────┬────────────────────────────────┘
                       │
┌──────────────────────┴────────────────────────────────┐
│              UNITY CATALOG                             │
│  (Unified governance: access control, lineage,        │
│   data discovery, audit)                              │
└──────────────────────┬────────────────────────────────┘
                       │
┌──────────────────────┴────────────────────────────────┐
│              COMPUTE ENGINES                           │
│                                                       │
│  ┌─────────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ Photon      │  │ Spark    │  │ Databricks SQL  │ │
│  │ (Vectorized │  │ (General │  │ Warehouses      │ │
│  │  C++ engine)│  │  purpose)│  │ (Serverless)    │ │
│  └─────────────┘  └──────────┘  └─────────────────┘ │
└──────────────────────┬────────────────────────────────┘
                       │
┌──────────────────────┴────────────────────────────────┐
│              DELTA LAKE (Storage Layer)                │
│                                                       │
│  ACID Transactions | Schema Enforcement | Time Travel │
│  Z-Ordering | Liquid Clustering | Change Data Capture │
│                                                       │
│  Stored as Parquet + Transaction Log on:              │
│  S3 / ADLS / GCS                                     │
└───────────────────────────────────────────────────────┘
```

**Why this matters for interviews**: The Lakehouse thesis is that you don't need separate data lakes and data warehouses. Delta Lake provides warehouse-like reliability (ACID, schema enforcement) on top of data lake storage (cloud object storage, open Parquet format). This eliminates data copying between systems and reduces cost and complexity.

---

## Delta Lake Internals

Delta Lake is the storage format that makes the Lakehouse possible.

### Transaction Log (_delta_log)

Every Delta table has a `_delta_log/` directory containing JSON files that record every transaction:

```
my_table/
├── _delta_log/
│   ├── 00000000000000000000.json   (version 0: table creation)
│   ├── 00000000000000000001.json   (version 1: first insert)
│   ├── 00000000000000000002.json   (version 2: update)
│   ├── ...
│   └── 00000000000000000010.checkpoint.parquet  (checkpoint every 10 versions)
├── part-00000-xxxx.parquet
├── part-00001-xxxx.parquet
└── ...
```

**Each transaction log entry contains**:
- `add`: files added to the table (new Parquet files)
- `remove`: files logically removed (old Parquet files marked for deletion)
- `metaData`: schema changes, partition changes
- `commitInfo`: timestamp, operation type, user

**Checkpoint files**: Every 10 transactions, Delta writes a Parquet-format checkpoint that summarizes the current state (all active `add` entries). This speeds up reads because the reader doesn't need to replay all historical log entries.

**ACID guarantees**:
- **Atomicity**: Each commit is atomic. Either all file additions/removals succeed, or none do.
- **Consistency**: Schema is enforced on write. Invalid data is rejected.
- **Isolation**: Snapshot isolation via optimistic concurrency. Readers see a consistent snapshot.
- **Durability**: Data is stored on cloud object storage (S3/ADLS/GCS) with their durability guarantees.

**Optimistic concurrency control**:
- Writers read the current version, compute their changes, and attempt to commit.
- If another writer committed in the meantime, the second writer checks for conflicts.
- Conflict resolution: if the two transactions touched disjoint files, both succeed. If they touched the same files, the later one retries.

**Interview talking point**: "The Delta transaction log is conceptually similar to a database's write-ahead log, but stored as files in cloud object storage. This is what enables ACID on a data lake -- the log provides atomicity and isolation, while the Parquet files provide efficient columnar storage."

---

### Data Organization

**Partitioning**:
- Physical partitioning: data is split into directories by partition column values
- Example: `year=2024/month=01/part-00000.parquet`
- Best for low-cardinality columns (date, region) with highly selective filters
- Avoid over-partitioning: too many small files degrade performance

**Z-Ordering**:
- Colocates related data within the same Parquet files using a Z-curve
- Multi-dimensional clustering: optimize for multiple columns simultaneously
- Example: `OPTIMIZE my_table ZORDER BY (customer_id, date)`
- Best for high-cardinality columns used in WHERE clauses and JOINs
- Requires running OPTIMIZE to re-organize existing data

**Liquid Clustering** (newer, recommended):
- Automatic, incremental clustering that replaces manual Z-ordering
- Define clustering keys at table creation: `CREATE TABLE ... CLUSTER BY (col1, col2)`
- Databricks automatically re-clusters data during writes and compaction
- No need to run OPTIMIZE manually
- Adaptive: adjusts clustering as data distribution changes

**File compaction (OPTIMIZE)**:
- Delta tables accumulate small files from streaming ingestion or frequent small writes
- `OPTIMIZE my_table` compacts small files into larger ones (~1GB target)
- Auto-compaction: Databricks can run this automatically after writes
- Predictive optimization: Databricks automatically identifies tables that need optimization

**Interview talking point**: "In lakehouse-contract-lab, I use Z-ordering on high-cardinality join keys in the silver and gold layers. The silver layer is partitioned by date (for time-range queries) and Z-ordered by customer_id (for point lookups and joins). This combination gives efficient pruning for both time-based and entity-based queries."

---

### Time Travel

**Access historical versions**:
```sql
-- By version number
SELECT * FROM my_table VERSION AS OF 5

-- By timestamp
SELECT * FROM my_table TIMESTAMP AS OF '2024-01-15 10:00:00'

-- Restore a table to a previous version
RESTORE TABLE my_table TO VERSION AS OF 5
```

**Retention**:
- Default: 30 days (configurable via `delta.logRetentionDuration` and `delta.deletedFileRetentionDuration`)
- VACUUM removes old files beyond the retention period
- Never run VACUUM with a retention shorter than your Time Travel window

**Change Data Feed (CDF)**:
- Records row-level changes (insert, update_preimage, update_postimage, delete)
- Enables efficient CDC downstream: consumers read only the changes since their last checkpoint
- Enable per table: `ALTER TABLE my_table SET TBLPROPERTIES (delta.enableChangeDataFeed = true)`

**Interview talking point**: "In lakehouse-contract-lab, the rollback mechanism uses RESTORE TABLE to revert to the last known good version when a quality gate fails. This is possible because Delta's immutable Parquet files and transaction log mean previous versions are always available within the retention window."

---

## Unity Catalog

Unity Catalog is the unified governance layer for the Databricks Lakehouse.

### Three-Level Namespace

```
Metastore
  └── Catalog (e.g., "production", "development")
        └── Schema (e.g., "sales", "marketing")
              └── Table / View / Function / Model / Volume
```

**Key concepts**:
- **Metastore**: Top-level container, one per Databricks account per region. Stores metadata and access policies.
- **Catalog**: Logical grouping (often maps to environment or business domain).
- **Schema**: Traditional database schema within a catalog.
- **Securables**: Tables, views, functions, ML models, volumes (for unstructured data).

### Access Control

- **Grants**: SQL-based access control. `GRANT SELECT ON TABLE catalog.schema.table TO user@email.com`
- **Inheritance**: Permissions cascade down. A GRANT on a catalog applies to all schemas and tables within it.
- **Row-level security**: Dynamic views that filter rows based on the querying user's identity.
- **Column masking**: Masking functions applied to columns based on the querying user's group.
- **Attribute-based access control**: Use tags (e.g., `PII`, `PHI`) to define policies that apply to all tagged columns across all tables.

### Data Lineage

Unity Catalog automatically tracks lineage:
- Table-to-table lineage (which tables feed which tables)
- Column-level lineage (which columns map to which columns)
- Notebook/job-to-table lineage (which pipelines produced which tables)
- Visible in the Unity Catalog UI as a lineage graph

### Data Discovery

- **Search**: Full-text search over table names, column names, descriptions, and tags.
- **AI-generated documentation**: Unity Catalog can auto-generate table and column descriptions using AI.
- **Tags and classifications**: User-defined tags for organizing and classifying data assets.

**Interview talking point**: "Unity Catalog could replace the custom governance layer I built in Nexus-Hive's governance agent. The column masking and row access policies in Unity Catalog are enforced at the engine level, which is more robust than application-level enforcement. If I were building Nexus-Hive on Databricks, I would use Unity Catalog as the policy store and enforcement engine, and Nexus-Hive's governance agent would read policies from Unity Catalog rather than a custom policy store."

---

## Photon Engine

Photon is Databricks' vectorized query engine, written in C++ for performance.

**What it does**:
- Replaces the Spark SQL execution engine for supported operations
- Processes data in columnar batches (vectorized execution) instead of row-by-row
- Uses SIMD (Single Instruction, Multiple Data) instructions for parallel processing within a CPU core
- Optimized for Delta Lake: understands partition pruning, Z-order, and file statistics

**Performance characteristics**:
- Typically 2-8x faster than Spark SQL for scan-heavy and aggregation-heavy queries
- Most beneficial for: large table scans, aggregations, joins, and string operations
- Automatically enabled on SQL Warehouses (Serverless and Pro)
- Can be enabled on All-Purpose and Jobs clusters

**When Photon helps most**:
- Large fact table scans with filters
- Aggregations (GROUP BY, COUNT, SUM)
- Joins (especially hash joins on large tables)
- String processing (LIKE, SUBSTRING, regex)

**When Photon helps less**:
- UDF-heavy workloads (Python UDFs bypass Photon)
- Very small data volumes (overhead of columnar processing not worth it)
- Complex ML training workflows (use Spark + GPU instead)

---

## Databricks SQL Warehouses

SQL Warehouses provide a dedicated SQL analytics experience on top of the Lakehouse.

**Types**:
| Type | Description | Use Case |
|------|------------|----------|
| **Serverless** | Fully managed, instant start, auto-scales. Databricks manages the compute. | BI dashboards, ad-hoc SQL, interactive analytics |
| **Pro** | Customer-managed compute with Photon. Supports all SQL features. | Production workloads needing compute control |
| **Classic** | Legacy. Uses Spark without Photon. | Not recommended for new workloads |

**Key features**:
- **Instant start**: Serverless warehouses start in seconds (no cold start problem)
- **Auto-scaling**: Scales clusters up/down based on query queue depth
- **Query queue**: Queries wait in a queue when all clusters are busy (vs. failing)
- **Query result cache**: Identical queries return cached results
- **Cost control**: Set auto-stop timeout, max clusters, and budget limits

---

## MLflow

MLflow is the open-source ML lifecycle management platform, deeply integrated with Databricks.

### Components

**Tracking**:
- Log parameters, metrics, and artifacts for every experiment run
- Compare runs side-by-side in the UI
- Automatically tracks: library versions, git commit, notebook context
- API: `mlflow.log_param()`, `mlflow.log_metric()`, `mlflow.log_artifact()`

**Model Registry**:
- Central repository for ML models
- Model versioning: every registered model has a version history
- Stage management: None -> Staging -> Production -> Archived
- Model lineage: link to the experiment run that produced the model
- Approval workflows: require approval before promoting to Production

**Model Serving**:
- Deploy models as REST API endpoints
- Auto-scaling based on request volume
- A/B testing: route traffic between model versions
- GPU support for large models
- Pay-per-request pricing (serverless)

**Interview talking point**: "The CI/CD pipeline for ML models (system-design-questions.md Q9) maps directly to MLflow's capabilities. MLflow Tracking provides the experiment logging, the Model Registry provides versioning and stage management, and Model Serving provides canary deployment. The evaluation stage in my design uses MLflow's model evaluation APIs to compare candidates against production."

---

## Mosaic AI

Mosaic AI is Databricks' AI platform, built on top of the Lakehouse.

### Key Components

**AI Gateway**:
- Centralized proxy for LLM API calls (OpenAI, Anthropic, open-source)
- Rate limiting, cost tracking, and usage analytics
- Fallback routing: if one provider is down, route to another
- Governance: log all LLM interactions for audit

**Vector Search**:
- Managed vector database built into Unity Catalog
- Supports Delta Sync: automatically updates the vector index as the source Delta table changes
- Integrates with LangChain and LlamaIndex

**Model Serving with Foundation Models**:
- Serve open-source LLMs (Llama, Mixtral, DBRX) on Databricks-managed GPU infrastructure
- Provisioned throughput: guaranteed tokens/second for production workloads
- Pay-per-token for development and testing

**Agent Framework**:
- Build, deploy, and monitor AI agents on Databricks
- Integrated with MLflow for experiment tracking
- Evaluation tools for agent quality (correctness, latency, cost)

**Interview talking point**: "Mosaic AI Gateway is essentially a managed version of what I built in enterprise-llm-adoption-kit: centralized LLM access with rate limiting, cost tracking, and audit logging. The key difference is that Mosaic AI Gateway is integrated with Unity Catalog for governance, which provides row-level and column-level access control on the data used for RAG retrieval."

---

## Delta Live Tables (DLT)

DLT is a declarative framework for building data pipelines on the Lakehouse.

**Key concepts**:
- **Declarative**: You define WHAT the data should look like, not HOW to compute it. DLT handles orchestration, scheduling, and error recovery.
- **Expectations**: Quality gates built into the pipeline definition.
- **Auto-scaling**: Automatically sizes the cluster based on data volume.
- **Auto-recovery**: Retries failed steps, maintains state for streaming pipelines.

**Expectations (Quality Gates)**:

```sql
CREATE OR REFRESH LIVE TABLE silver_orders (
  CONSTRAINT valid_order_id EXPECT (order_id IS NOT NULL) ON VIOLATION DROP ROW,
  CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION FAIL UPDATE,
  CONSTRAINT valid_date EXPECT (order_date <= current_date()) ON VIOLATION DROP ROW
)
AS SELECT ...
```

- `ON VIOLATION DROP ROW`: Quarantine the bad record, continue processing
- `ON VIOLATION FAIL UPDATE`: Halt the pipeline (fail the batch)
- No violation action: Log the violation but keep the record (warn mode)

**Pipeline modes**:
- **Triggered**: Run once, process all available data, stop. Good for batch.
- **Continuous**: Run continuously, process data as it arrives. Good for streaming.

**Interview talking point**: "DLT Expectations are the managed equivalent of the quality gates I built in lakehouse-contract-lab. My approach uses Great Expectations and dbt tests for flexibility, but DLT Expectations are simpler for teams that want quality gates without managing a separate testing framework. The trade-off is customizability vs. simplicity."

---

## Structured Streaming

Databricks Structured Streaming provides near-real-time data processing.

**Key concepts**:
- **Micro-batch**: Process data in small batches (default). Latency: seconds to minutes.
- **Continuous processing**: Process each record as it arrives. Latency: milliseconds. (Experimental, limited use cases.)
- **Triggers**: `availableNow` (process all available, then stop), `processingTime` (fixed interval), `continuous`.
- **Watermarks**: Handle late-arriving data by defining how long to wait before closing a time window.
- **State management**: Stateful operations (aggregations, joins, dedup) maintain state across micro-batches. State is checkpointed to cloud storage for fault tolerance.

**Auto Loader**:
- File-based streaming source for cloud storage (S3, ADLS, GCS)
- Incrementally processes new files as they arrive
- Schema inference and evolution: automatically detects schema from files, handles new columns
- Uses cloud notifications (S3 SQS, ADLS Event Grid) for efficient new-file detection

```python
spark.readStream
  .format("cloudFiles")
  .option("cloudFiles.format", "json")
  .option("cloudFiles.schemaLocation", "/path/to/schema")
  .load("/path/to/raw/data")
  .writeStream
  .format("delta")
  .option("checkpointLocation", "/path/to/checkpoint")
  .toTable("bronze.raw_events")
```

**Interview talking point**: "Auto Loader is the ingestion layer for the bronze tier in lakehouse-contract-lab. It handles schema inference on arrival, which feeds into the bronze quality gate (schema conformance check). The combination of Auto Loader for ingestion + DLT Expectations for quality gates is the production-grade version of my data contract approach."

---

## Cost Optimization Quick Reference

| Strategy | Impact | When to Use |
|----------|--------|-------------|
| Serverless SQL Warehouses | High | BI and interactive SQL (instant start, pay-per-query) |
| Auto-stop on clusters | Medium | Set 10-15 min for interactive, 5 min for jobs |
| Spot instances for jobs | High | Batch ETL, training jobs (2-5x cheaper, tolerate interruption) |
| Photon | Medium-High | Scan/aggregation-heavy SQL workloads |
| Delta OPTIMIZE + Z-ORDER | Medium | Large tables with selective queries |
| Predictive optimization | Medium | Auto-OPTIMIZE and auto-VACUUM on eligible tables |
| Cluster right-sizing | High | Monitor Spark UI; reduce if CPU utilization is < 30% |
| Delta caching | Medium | Enable on compute clusters for repeated reads |
| Job clusters vs. all-purpose | High | Use job clusters for production (cheaper, auto-terminate) |
| Unity Catalog tags for cost tracking | Visibility | Tag tables/jobs by team for cost attribution |

---

## Common Interview Questions about Databricks

**Q: How does Databricks differ from Snowflake?**
A: Snowflake is a fully managed, proprietary data warehouse optimized for SQL analytics. Databricks is a Lakehouse platform built on open-source technologies (Delta Lake, Spark, MLflow) that supports SQL, data engineering, ML, and AI workloads. Snowflake gives you simplicity and separation of storage/compute; Databricks gives you flexibility and a unified platform for data + AI. Snowflake owns the storage format; Databricks uses open formats (Parquet/Delta) that you can access with any tool.

**Q: What is the difference between Delta Lake and Apache Iceberg?**
A: Both are open table formats that add ACID transactions and time travel to data lakes. Delta Lake was created by Databricks and uses a JSON-based transaction log. Iceberg was created by Netflix/Apple and uses a metadata tree structure. Delta is more tightly integrated with Databricks (optimized I/O, Photon integration). Iceberg has broader multi-engine support (Trino, Flink, Snowflake). Databricks now supports Iceberg via UniForm, which writes Delta tables that are readable as Iceberg tables, bridging the gap.

**Q: How does Unity Catalog compare to other data catalogs?**
A: Unity Catalog is unique because it is both a metadata catalog and an access control enforcement layer. Traditional catalogs (Hive Metastore, AWS Glue Catalog) store metadata but don't enforce access policies at query time. Unity Catalog enforces grants, row-level security, and column masking at the engine level, which means every query goes through access control regardless of which tool (Spark, SQL, MLflow) executes it. The lineage tracking is also automatic, not requiring manual annotation.

**Q: How would you design a medallion architecture on Databricks?**
A: This maps directly to my lakehouse-contract-lab implementation. Bronze: Auto Loader ingests raw data into Delta tables with append-only semantics. Silver: DLT or Spark jobs cleanse, deduplicate, and apply SCD2. Gold: Aggregated views and denormalized tables for BI consumption. Quality gates: DLT Expectations at each layer, or custom Great Expectations suites. Governance: Unity Catalog manages access control across all layers. Monitoring: Delta table history + DLT pipeline metrics for freshness and quality tracking.
