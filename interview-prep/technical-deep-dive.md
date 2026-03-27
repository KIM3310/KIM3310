# Technical Deep Dive Preparation -- Doeon Kim

Preparation for the "walk me through the architecture" portion of technical interviews.
Each section includes: the 5-minute explanation, architecture walkthrough, and anticipated follow-up questions with answers.

---

## Deep Dive 1: Stage-Pilot -- Reliable Tool-Calling Middleware

### The 5-Minute Explanation

"Stage-pilot is a middleware layer that sits between an LLM and external tools, improving tool-calling reliability from 25% to 90%. Let me walk you through the problem, the architecture, and the key insights.

**The problem**: When LLMs try to invoke tools -- calling an API, running a SQL query, executing code -- they need to output structured data: a function name, parameter names, and values in the right types. Native tool-calling had a 25% success rate. Three out of four calls would fail: malformed JSON, wrong types, hallucinated function names, missing required fields.

**The architecture has four stages**:

```
LLM Output -> Schema Compiler -> Output Parser -> Validation
                                                       |
                                            [valid?]---+---[invalid?]
                                              |                |
                                         Execute         Auto-Repair
                                                               |
                                                      [fixed?]-+--[not fixed?]
                                                        |              |
                                                   Execute        Retry with
                                                              structured error
                                                              feedback to LLM
```

1. **Schema Compiler**: Before the LLM ever generates output, we optimize how tool definitions are presented. Different models respond better to different formats. We also prune irrelevant tools based on context -- if the user is asking about weather, don't include the database tools in the prompt. This reduces confusion and improves first-attempt accuracy.

2. **Output Parser**: The LLM output is messy. Sometimes it's valid JSON. Sometimes it's JSON wrapped in markdown code blocks. Sometimes it's partial JSON that got cut off. The parser uses a cascade of extraction strategies: native function-call parsing, regex extraction from markdown, JSON recovery heuristics (fixing unmatched braces, trailing commas, unquoted keys). This stage turns messy output into a candidate structured call.

3. **Validation Engine**: The candidate call is validated against the tool schema. Type checking, required field validation, enum value checking, string pattern matching, numeric range validation. If everything passes, execute. If not, produce a structured error report with field-level details.

4. **Auto-Repair Engine**: This is the key innovation. Most failures are predictable and fixable without re-querying the LLM:
   - Type coercion: string '42' becomes int 42
   - Default injection: missing optional fields get their schema defaults
   - Fuzzy enum matching: 'newyork' matches to 'new_york' using edit distance
   - JSON structural repair: unmatched braces, trailing commas

   The auto-repair engine alone recovers about 40% of initially invalid calls at zero additional LLM cost.

5. **Retry Controller**: When auto-repair can't fix the issue, we retry with the LLM. But the critical insight is that the error message matters enormously. A generic 'invalid tool call, try again' yields ~30% success on retry. A specific 'field temperature expects float, you provided string celsius; field location is required but missing' yields ~75% success on retry. We cap at 3 retries with exponential backoff.

**The result**: 90% reliability. Breakdown: ~55% succeed on first attempt (up from 25%, thanks to schema compiler), ~35% are recovered by auto-repair or one retry, and ~10% fail after 3 retries."

### Architecture Details for Whiteboard

```
+-----------------------------------------------------+
|                  STAGE-PILOT MIDDLEWARE               |
|                                                      |
|  +------------------------------------------------+  |
|  |  SCHEMA COMPILER                               |  |
|  |                                                |  |
|  |  Tool Registry ──> Context-Aware Pruning       |  |
|  |       │                    │                   |  |
|  |       v                    v                   |  |
|  |  Schema Optimizer ──> Model-Specific Format    |  |
|  |  (examples, constraints,  (OpenAI func fmt,   |  |
|  |   type hints)              Claude XML fmt,     |  |
|  |                            open-source JSON)   |  |
|  +------------------------------------------------+  |
|                       │                              |
|                       v                              |
|  +------------------------------------------------+  |
|  |  OUTPUT PARSER                                 |  |
|  |                                                |  |
|  |  Raw LLM Output ──> Strategy Cascade:          |  |
|  |       │              1. Native func call       |  |
|  |       │              2. JSON from markdown      |  |
|  |       │              3. Regex extraction        |  |
|  |       │              4. JSON recovery           |  |
|  |       v              (fix braces, commas)      |  |
|  |  Candidate Tool Call (name + params dict)      |  |
|  +------------------------------------------------+  |
|                       │                              |
|                       v                              |
|  +------------------------------------------------+  |
|  |  VALIDATION ENGINE                             |  |
|  |                                                |  |
|  |  Schema ──> Validate:                          |  |
|  |    │   - Required fields present?              |  |
|  |    │   - Types correct?                        |  |
|  |    │   - Enum values valid?                    |  |
|  |    │   - String patterns match?                |  |
|  |    │   - Numeric ranges respected?             |  |
|  |    v                                           |  |
|  |  ValidationResult: PASS or [FieldError, ...]   |  |
|  +------------------------------------------------+  |
|          │ PASS                    │ FAIL             |
|          v                        v                  |
|     +---------+     +---------------------------+    |
|     | EXECUTE |     |  AUTO-REPAIR ENGINE       |    |
|     +---------+     |                           |    |
|                     |  For each FieldError:     |    |
|                     |  - Type coercion          |    |
|                     |  - Default injection      |    |
|                     |  - Fuzzy enum match       |    |
|                     |  - JSON structural fix    |    |
|                     |                           |    |
|                     |  Re-validate repaired call|    |
|                     +---------------------------+    |
|                      │ PASS            │ FAIL        |
|                      v                 v             |
|                 +---------+  +------------------+    |
|                 | EXECUTE |  | RETRY CONTROLLER |    |
|                 +---------+  | (structured err  |    |
|                              |  feedback to LLM,|    |
|                              |  max 3 retries)  |    |
|                              +------------------+    |
+-----------------------------------------------------+
```

### Common Follow-Up Questions

**Q: Why not just fine-tune the model to produce better tool calls?**
A: Fine-tuning and middleware are complementary, not competing. Fine-tuning improves first-attempt accuracy but doesn't eliminate errors entirely -- even fine-tuned models hallucinate parameter values or make type errors. The middleware is a safety net that catches and repairs whatever the model gets wrong. In fact, I built tool-call-finetune-lab specifically to explore the fine-tuning side. The best approach is both: fine-tune for higher first-attempt accuracy, and use middleware for reliable recovery.

**Q: What is the latency overhead of the middleware?**
A: The parser, validation, and auto-repair together add less than 50ms -- they are in-memory string and schema operations. The only significant latency comes from retries, which require an additional LLM round-trip (~1-2 seconds). Since 90% of calls succeed without a retry (first attempt + auto-repair), the average latency overhead is approximately 50ms + (0.08 * 1500ms) = ~170ms. This is negligible compared to the LLM inference time itself.

**Q: How do you handle tools with very complex schemas (deeply nested objects, arrays of objects)?**
A: Complex schemas are where the auto-repair engine earns its keep. For nested objects, the validation engine produces field-path errors (e.g., "params.address.zip_code: expected string, got int"). The auto-repair engine applies the same coercion rules recursively. For arrays, we validate each element against the item schema. The schema compiler also helps: for complex tools, we inject examples showing the expected structure, which dramatically improves first-attempt accuracy on nested schemas.

**Q: How do you decide which tools to include in the prompt?**
A: The schema compiler uses context-aware pruning. Given the user's current message and conversation history, we compute semantic similarity between the message and each tool's description. Tools below a relevance threshold are excluded. For a typical agent with 20-30 tools, we usually include 5-8 relevant tools per turn. This reduces prompt size and, critically, reduces the LLM's confusion from irrelevant options. In experiments, pruning from 30 to 8 tools improved first-attempt accuracy by ~15 percentage points.

**Q: What happens when the auto-repair makes the wrong fix?**
A: This is a real risk. For example, fuzzy enum matching might match "new_jersey" to "new_york" if the edit distance threshold is too lenient. We mitigate this with conservative thresholds: fuzzy matching only triggers if the edit distance is <= 2 and the match is unambiguous (only one candidate within the threshold). Type coercion follows strict rules (string-to-int only if the string is purely numeric). When in doubt, the repair engine does not repair -- it defers to the retry controller, which gives the LLM a specific error message and asks it to correct the issue. Safety over cleverness.

**Q: How do you monitor and improve the system over time?**
A: Every tool call is logged with: raw LLM output, parsed result, validation errors, repair actions, retry count, and final outcome. This gives us a dashboard showing per-tool success rates, common failure modes, and model-specific patterns. When we see a tool with a consistently low success rate, we investigate: is the schema description ambiguous? Are the examples insufficient? Do we need a new auto-repair heuristic? This feedback loop has been the primary driver of ongoing improvement.

---

## Deep Dive 2: Nexus-Hive -- Multi-Agent NL-to-SQL with Governance

### The 5-Minute Explanation

"Nexus-Hive is a multi-agent system that translates natural-language questions into governed SQL queries across multiple data warehouses. Let me walk you through why multi-agent, the pipeline, and the governance layer.

**Why multi-agent instead of a single LLM call?** A monolithic approach -- one massive prompt with schema, governance rules, SQL examples, and formatting instructions -- achieves about 62% accuracy and 45% governance compliance in my testing. The prompt gets too long, and the LLM 'forgets' rules. A multi-agent approach decomposes the problem into specialized steps, each with a focused prompt, achieving 88% accuracy and 94% governance compliance.

**The pipeline has five agents orchestrated by LangGraph**:

```
User Question
     │
     v
+─────────────────+
│  ORCHESTRATOR    │  Intent classification + session management
│  (LangGraph)     │  Routes: ANALYTICAL / METADATA / UNSUPPORTED
+─────────────────+
     │ ANALYTICAL
     v
+─────────────────+
│  SCHEMA AGENT    │  Resolves business terms to physical columns
│                  │  "revenue" → fact_sales.total_revenue
│                  │  Uses embedding similarity + curated catalog
+─────────────────+
     │
     v
+─────────────────+
│  SQL AGENT       │  Generates SQL using resolved schema + intent
│                  │  Warehouse-specific dialect (Snowflake/BQ/DuckDB)
│                  │  Few-shot prompting with validated examples
+─────────────────+
     │
     v
+─────────────────+
│  GOVERNANCE      │  Enforces RBAC before execution
│  AGENT           │  Column-level access: redact restricted cols
│                  │  Row-level access: inject WHERE filters
│                  │  Policy violations: rewrite or reject
+─────────────────+
     │
     v
+─────────────────+
│  EXECUTION       │  Multi-warehouse adapter
│  ENGINE          │  SQL dry-run validation, then execute
│                  │  Connection pool + timeout + cost control
+─────────────────+
     │
     v
  Results + Audit Log
```

**The Schema Agent** is critical. Business users say 'revenue' but the table has `fact_sales.total_revenue`, `fact_sales.net_revenue`, and `dim_products.listed_price`. The schema agent uses a hybrid approach: a curated mapping table for exact matches (fast, deterministic), and an embedding index over the full schema catalog for fuzzy matches. Each match includes a confidence score. Low-confidence matches trigger a clarification question back to the user.

**The Governance Agent** enforces access policies by construction, not by post-validation. When the SQL Agent generates a query that references a restricted column, the governance agent does not reject the query -- it rewrites it to exclude the restricted column or replace it with a masked version. This means the user gets a partial but correct answer rather than an error. Row-level filters are injected as WHERE clauses (e.g., a regional sales manager only sees data for their region).

**The Execution Engine** is a multi-warehouse adapter. Snowflake, BigQuery, and DuckDB each have different SQL dialects, connection methods, and cost models. The adapter layer translates the governed SQL to the target dialect, manages connection pools, enforces query timeouts, and tracks compute cost per query.

**Audit logging** captures every step: the original question, schema resolution decisions, generated SQL, governance modifications, and execution results. This is required for compliance and is also invaluable for debugging accuracy issues."

### Architecture Details for Whiteboard

```
┌────────────────────────────────────────────────────┐
│                    NEXUS-HIVE                        │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  LANGGRAPH ORCHESTRATOR                       │   │
│  │                                               │   │
│  │  State Machine:                               │   │
│  │  CLASSIFY ──> RESOLVE_SCHEMA ──> GENERATE_SQL │   │
│  │      │            │                  │        │   │
│  │      │            │                  v        │   │
│  │      │            │           GOVERN ──> EXEC │   │
│  │      │            │                           │   │
│  │      v            v                           │   │
│  │  [METADATA]  [CLARIFY]   (alternate paths)    │   │
│  │  [UNSUPPORTED]                                │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ SCHEMA      │  │ SQL         │  │ GOVERNANCE   │ │
│  │ AGENT       │  │ AGENT       │  │ AGENT        │ │
│  │             │  │             │  │              │ │
│  │ Inputs:     │  │ Inputs:     │  │ Inputs:      │ │
│  │ - NL query  │  │ - Resolved  │  │ - Generated  │ │
│  │ - Schema    │  │   schema    │  │   SQL        │ │
│  │   catalog   │  │ - NL intent │  │ - User role  │ │
│  │             │  │ - Dialect   │  │ - Policy     │ │
│  │ Outputs:    │  │   target    │  │   store      │ │
│  │ - Resolved  │  │             │  │              │ │
│  │   columns   │  │ Outputs:    │  │ Outputs:     │ │
│  │ - Confidence│  │ - SQL query │  │ - Governed   │ │
│  │   scores    │  │ - Explain   │  │   SQL        │ │
│  │             │  │   plan      │  │ - Applied    │ │
│  │ Methods:    │  │             │  │   policies   │ │
│  │ 1. Exact    │  │ Methods:    │  │              │ │
│  │    match    │  │ 1. Few-shot │  │ Methods:     │ │
│  │ 2. Embedding│  │    prompt   │  │ 1. Column    │ │
│  │    search   │  │ 2. Dry-run  │  │    masking   │ │
│  │ 3. Clarify  │  │    validate │  │ 2. Row       │ │
│  │    if low   │  │ 3. Error    │  │    filter    │ │
│  │    confid.  │  │    repair   │  │ 3. Reject    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  MULTI-WAREHOUSE ADAPTER                      │   │
│  │                                               │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐     │   │
│  │  │Snowflake │ │ BigQuery │ │ DuckDB   │     │   │
│  │  │Adapter   │ │ Adapter  │ │ Adapter  │     │   │
│  │  │          │ │          │ │          │     │   │
│  │  │- Dialect │ │- Dialect │ │- Dialect │     │   │
│  │  │- ConnPool│ │- ConnPool│ │- ConnPool│     │   │
│  │  │- Cost Ctl│ │- Cost Ctl│ │- Cost Ctl│     │   │
│  │  └──────────┘ └──────────┘ └──────────┘     │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  AUDIT LOG                                    │   │
│  │  - User ID, timestamp, NL question            │   │
│  │  - Resolved schema (with confidence)          │   │
│  │  - Generated SQL (pre-governance)             │   │
│  │  - Governed SQL (post-governance)             │   │
│  │  - Applied policies                           │   │
│  │  - Execution result metadata                  │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

### Common Follow-Up Questions

**Q: How do you handle multi-table joins in the NL-to-SQL translation?**
A: The schema agent's metadata catalog includes foreign key relationships and common join patterns. When the NL query implies data from multiple tables (e.g., "show me customer names and their order totals"), the schema agent resolves both `dim_customers` and `fact_orders` and includes the join relationship (`dim_customers.customer_id = fact_orders.customer_id`) in the context passed to the SQL agent. The SQL agent's few-shot examples include multi-table join patterns, so it knows how to generate the JOIN clause. For complex queries involving 3+ tables, we use a graph-based join path finder that identifies the shortest join path between resolved tables.

**Q: What happens when the LLM generates invalid SQL?**
A: Before execution, the generated SQL goes through a dry-run validation (Snowflake EXPLAIN, BigQuery dry run). If the dry run fails, the error message is sent back to the SQL agent with the instruction to fix it. This is essentially the stage-pilot retry pattern applied to SQL: specific error feedback yields much better corrections than generic retries. We allow two correction attempts before surfacing an error to the user.

**Q: How do you handle schema changes?**
A: The schema catalog is updated via a scheduled sync job that reads the warehouse's INFORMATION_SCHEMA. When a table is added, renamed, or when columns change, the catalog is updated and the embedding index is re-built for the affected tables. The curated mapping table (exact matches) requires manual review for breaking changes. We also version the catalog, so we can diagnose whether a query failure was caused by a schema change.

**Q: How does the governance agent handle complex policies like "user can only see aggregate data, not row-level detail"?**
A: This is an aggregation-only policy. When the governance agent detects that a user has aggregation-only access to a table and the generated SQL selects row-level detail, the agent rewrites the query to add a GROUP BY clause and wrap raw columns in aggregation functions (COUNT, SUM, AVG depending on the column type and the query intent). If the rewrite is not semantically meaningful (e.g., the user explicitly asked for individual records), the agent returns a message explaining that the user only has aggregate access to this data.

**Q: Why LangGraph instead of a simpler pipeline?**
A: LangGraph provides state management, conditional branching, and cycle support that a linear pipeline doesn't. The Nexus-Hive pipeline has branches: the orchestrator may route to a clarification step (cycle back to the user), the SQL agent may need a correction cycle, the governance agent may reject and re-route. LangGraph's state machine model makes these cycles explicit and debuggable, rather than handling them with ad-hoc logic.

**Q: What is the cost per query?**
A: The typical cost breakdown for a single query: schema resolution uses embedding search (negligible cost, ~$0.0001) + a small LLM call for disambiguation (~$0.002). SQL generation is the most expensive step (~$0.01-0.03 depending on context size and model). Governance check is a rule-engine operation (no LLM cost). Total: ~$0.01-0.04 per query. For cost-sensitive deployments, we cache SQL generation results keyed on (intent_hash, schema_version, user_role) with a TTL, which reduces the average cost by ~60% for repeated query patterns.

---

## Deep Dive 3: Lakehouse Medallion Pattern with Quality Gates

### The 5-Minute Explanation

"The lakehouse-contract-lab implements a Bronze-Silver-Gold medallion architecture with automated quality gates at each layer, data contracts as code, and automatic rollback on quality failures. Let me walk through the layers, the quality gate design, and the rollback mechanism.

**The medallion architecture** separates data processing into three layers, each with a clear contract:

**Bronze (Raw Landing)**: Data arrives as-is from source systems. We store it in Delta Lake format with append-only semantics. Every record gets an `_ingested_at` timestamp and a `_source_batch_id`. The bronze layer's contract is: schema conformance (the data matches the registered schema), no duplicates on the natural key, and primary key fields are not null. Records that violate the contract are routed to a quarantine table, not dropped silently.

**Silver (Cleansed + Conformed)**: Bronze data is transformed: type casting, null handling, deduplication, and Slowly Changing Dimension Type 2 (SCD2) for dimension tables. The silver contract is stricter: referential integrity (every foreign key references a valid parent), value range validation (age between 0 and 150, dates in valid ranges), and business rule assertions (order_total equals the sum of line_items).

**Gold (Aggregated + Business-Ready)**: Silver data is aggregated and denormalized for consumption by BI dashboards and ML features. The gold contract includes: metric reconciliation (gold totals must match silver detail within a tolerance), trend anomaly detection (alert if a daily metric moves more than 3 standard deviations from the 30-day rolling average), and completeness checks (no missing date partitions).

**Quality gates are implemented as code**:

```
# Example quality gate definition (data contract)
quality_gate:
  layer: silver
  table: dim_customers
  checks:
    - type: not_null
      columns: [customer_id, email, created_at]
    - type: unique
      columns: [customer_id]
    - type: referential_integrity
      column: region_id
      references: dim_regions.region_id
    - type: value_range
      column: age
      min: 0
      max: 150
    - type: custom_sql
      query: "SELECT COUNT(*) FROM dim_customers WHERE email NOT LIKE '%@%'"
      threshold: 0  # zero records allowed
  on_failure: quarantine  # or: halt, alert
```

These gate definitions live in the git repo alongside the pipeline code. They are executed as part of the CI/CD pipeline and as part of every production run.

**The rollback mechanism** uses Delta Lake Time Travel. Each pipeline run is tagged with a `batch_id`. If a gold-layer quality gate fails:
1. The pipeline halts downstream processing.
2. An alert fires with the specific failed checks and the batch_id.
3. For automatic rollback: the silver and gold tables are restored to the version before the failing batch using `RESTORE TABLE ... TO VERSION AS OF`.
4. For manual review: the pipeline pauses and a data engineer investigates.

The rollback granularity is configurable: some tables auto-rollback on any quality gate failure; others require manual approval for rollback (because the cost of stale data may be lower than the cost of investigation delay).

**The CI/CD integration**: Every PR that modifies a pipeline or a quality gate definition runs the full pipeline against a test lakehouse with synthetic data. The quality gates are executed as part of the test suite. A PR cannot merge if quality gates fail on the test data. This catches bugs before they reach production."

### Common Follow-Up Questions

**Q: How do you handle late-arriving data?**
A: Late-arriving data is a first-class concern. The bronze layer accepts all data regardless of event timestamp -- it is append-only. The silver layer uses the event timestamp (from the source system), not the ingestion timestamp, as the effective date for SCD2 and other temporal logic. When late data arrives, the silver transformation reprocesses the affected time window. We use Delta Lake's MERGE operation to upsert records, so late-arriving updates are applied correctly. The gold layer re-aggregates from the updated silver data.

**Q: How do you define the quarantine process?**
A: Quarantined records land in a parallel table (e.g., `bronze_quarantine.customers`) with the same schema as the source table plus three additional columns: `_quarantine_reason` (which check failed), `_quarantine_timestamp`, and `_source_batch_id`. A monitoring dashboard shows quarantine volume by source, check type, and time. Data engineers review quarantined records daily. Resolution options: fix the source (e.g., ask the upstream team to fix their schema), apply a one-time correction and re-ingest, or permanently discard if the records are truly invalid.

**Q: How do you prevent the quality gates from being too slow?**
A: Quality gates are designed to run incrementally, not on the full table. The not_null and unique checks run only on the new batch (records where `_source_batch_id = current_batch`). Referential integrity checks use a pre-computed lookup table of valid parent keys, updated once per day. The custom SQL checks are the most expensive but are also scoped to the new batch via a WHERE clause. Total quality gate execution time for a typical silver table is under 60 seconds, even on millions of records.

**Q: How does this integrate with dbt?**
A: The silver and gold transformations are implemented as dbt models. The quality gates are implemented as dbt tests (both built-in tests like `unique`, `not_null`, `relationships`, and custom tests for business rules). The dbt pipeline runs: `dbt run` (execute transformations) followed by `dbt test` (execute quality gates). If any test fails, the pipeline halts and the rollback mechanism kicks in. The dbt test results are published to a monitoring dashboard.

**Q: What is the performance impact of SCD2 on the silver layer?**
A: SCD2 adds complexity to the silver MERGE operation. For each incoming record, we need to: check if the natural key exists, compare all tracked columns, close the existing record (set `valid_to = current_timestamp`) if any tracked column changed, and insert a new record (with `valid_from = current_timestamp, valid_to = null`). We optimize this by: partitioning the silver table on the natural key's hash, using Z-ordering on the natural key for efficient lookups, and running the MERGE on only the changed records (identified by a CDC flag or by comparing bronze against the latest silver version).

**Q: How do you handle schema evolution?**
A: Schema changes are managed through the schema registry (data contracts). Adding a column is backward-compatible: the new column is nullable and the quality gate has no not-null check initially. Renaming or removing a column is a breaking change that requires a new contract version. The CI/CD pipeline tests both the old and new schema during the transition period. Delta Lake's schema evolution feature (`mergeSchema = true`) handles the physical layer, but the data contract is the source of truth for what the schema should be.

---

## General Tips for Technical Deep Dives

### Structure Your Explanation

1. **Start with the problem** (30 seconds): What problem does this system solve? Why does it matter? What was the state before?
2. **High-level architecture** (1 minute): Draw the major components and data flow. Use 5-7 boxes maximum. The interviewer should understand the system in one glance.
3. **Walk through a request** (1.5 minutes): Trace a concrete example through the system. "When a user asks 'show me revenue by region', here is what happens at each step."
4. **Key design decisions** (1.5 minutes): What were the non-obvious choices? Why multi-agent instead of monolithic? Why by-construction governance instead of post-validation? Why auto-repair instead of just retrying?
5. **Results and lessons** (30 seconds): Quantify the outcome. What would you do differently?

### Handling "Go Deeper" Requests

When the interviewer says "tell me more about X component":
- Pause. Think for 5 seconds. Do not rush into details.
- Ask: "Would you like me to go into the data model, the algorithm, or the failure modes?" This shows maturity and gives you time to organize your thoughts.
- Go one level deeper, not three levels deeper. Stay within what you can explain clearly. It is better to explain one level well than two levels confusingly.

### Handling Questions You Don't Know

- "That is a great question, and honestly I have not explored that specific aspect. Here is how I would approach investigating it: [describe your methodology]."
- Never bluff. Interviewers detect bluffing and it destroys credibility. Saying "I don't know, but here is how I'd find out" is a strength.

### Connecting to the Company's Products

- **At Snowflake**: "The multi-warehouse adapter in Nexus-Hive is essentially solving the same problem as Snowflake's data sharing and cross-cloud replication -- making data accessible across boundaries. I would love to work on making this native to the platform."
- **At Databricks**: "The medallion architecture in lakehouse-contract-lab is built on Delta Lake. Unity Catalog could replace my custom governance layer with a more robust, platform-native solution. I want to help customers adopt these patterns at scale."
- **At Palantir**: "Nexus-Hive's schema resolution agent is doing what Palantir's ontology layer does at a basic level -- mapping business concepts to physical data. The ontology approach is more powerful because it encodes relationships and actions, not just column mappings. I want to deepen that capability."
