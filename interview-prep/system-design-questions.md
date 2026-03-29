# System Design Interview Questions -- Doeon Kim

Target roles: AI Engineer, Solutions Architect
Target companies: Snowflake, Databricks, Palantir, Big Tech Korea (Google, Microsoft, Amazon, Naver, Kakao)

---

## Question 1: Design a Governed Analytics Platform

**Scenario**: A Fortune 500 company wants a natural-language analytics platform where business users can ask questions in plain English and get SQL-backed answers from their data warehouse -- but with strict governance over who can see what data.

### Requirements Gathering Questions to Ask

- How many concurrent users do we expect? (100s of analysts vs. 10,000+ self-serve users)
- What databases/warehouses are currently in use? (Snowflake, BigQuery, Redshift, multi-warehouse?)
- What existing RBAC/governance frameworks are in place? (Row-level security, column masking, data classification?)
- What is the acceptable latency for a natural-language query response? (< 5s interactive, or async batch?)
- Do we need audit trails for compliance (SOX, GDPR, HIPAA)?
- Should the system support follow-up questions (conversational context)?
- What are the data sensitivity tiers? (Public, internal, confidential, restricted?)

### High-Level Architecture

```
                         +------------------+
                         |   Web / Chat UI  |
                         +--------+---------+
                                  |
                         +--------v---------+
                         |   API Gateway    |
                         |  (Auth + Rate    |
                         |   Limiting)      |
                         +--------+---------+
                                  |
                  +---------------v----------------+
                  |       Orchestrator Agent        |
                  |  (Intent Classification,        |
                  |   Session Mgmt, Routing)        |
                  +---+--------+--------+----------+
                      |        |        |
            +---------v--+ +---v-----+ +v-----------+
            |  Schema    | | SQL     | | Governance |
            |  Agent     | | Gen     | | Agent      |
            | (Metadata  | | Agent   | | (RBAC,     |
            |  Catalog)  | | (NL2SQL)| |  Filtering)|
            +-----+------+ +---+----+ +-----+------+
                  |             |             |
                  +------+------+------+------+
                         |             |
                  +------v------+ +---v-----------+
                  | Execution   | | Audit Logger  |
                  | Engine      | | (Query Log,   |
                  | (Warehouse  | |  Lineage)     |
                  |  Adapter)   | +---------------+
                  +------+------+
                         |
            +------------+------------+
            |            |            |
       +----v----+ +----v----+ +----v----+
       |Snowflake| |BigQuery | |Redshift |
       +---------+ +---------+ +---------+
```

### Key Components and Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **Orchestrator Agent** | Routes user intent, manages multi-turn conversations, coordinates sub-agents. Maintains a state machine: CLASSIFY -> RESOLVE_SCHEMA -> GENERATE_SQL -> GOVERN -> EXECUTE -> PRESENT. |
| **Schema Agent** | Resolves ambiguous entity references ("revenue" -> `fact_sales.total_revenue`). Maintains a semantic layer mapping business terms to physical columns. Uses embedding similarity for fuzzy matching. |
| **SQL Generation Agent** | Translates the disambiguated intent + schema context into executable SQL. Uses few-shot prompting with warehouse-specific SQL dialects. Validates generated SQL via dry-run / EXPLAIN before execution. |
| **Governance Agent** | Enforces column-level and row-level access policies. Injects WHERE clauses for row-level security. Masks or redacts restricted columns. Rejects queries that violate data classification policies. |
| **Execution Engine** | Multi-warehouse adapter layer. Translates the governed SQL to warehouse-specific dialect. Manages connection pools, query timeouts, and cost controls. |
| **Audit Logger** | Logs every query: who asked, what SQL was generated, what governance rules were applied, what data was returned. Enables compliance reporting and anomaly detection. |

### Data Flow

1. User submits natural-language question via UI.
2. API Gateway authenticates the user, extracts their role/group membership, forwards to Orchestrator.
3. Orchestrator classifies intent (analytical query, metadata question, or unsupported).
4. Schema Agent resolves entity references against the metadata catalog.
5. SQL Generation Agent produces candidate SQL using resolved schema + user intent.
6. Governance Agent checks the user's RBAC profile against data classification tags on every referenced table/column. Injects row filters. Rejects or rewrites if the user lacks access.
7. Execution Engine runs the governed SQL against the target warehouse.
8. Results are formatted and returned to the user. The full pipeline is logged for audit.

### Scale Considerations

- **Caching**: Cache SQL generation results keyed on (intent_hash, schema_version, user_role). Cache query results with TTL based on data freshness requirements. A governance-aware cache invalidates when RBAC policies change.
- **Connection pooling**: Maintain per-warehouse connection pools. Use Snowflake's multi-cluster warehouses or BigQuery slots for elasticity.
- **Rate limiting**: Per-user and per-department rate limits to control warehouse compute costs.
- **Latency budget**: Target < 3s total. Schema resolution < 200ms (pre-indexed embeddings), SQL generation < 1.5s (streaming LLM), governance check < 100ms (in-memory policy engine), execution varies by query complexity.
- **Horizontal scaling**: Orchestrator is stateless (session state in Redis). Scale agents independently behind a message queue for bursty workloads.

### How Doeon's Experience Maps

**Nexus-Hive** is a direct implementation of this architecture:
- Built the multi-agent pipeline (Orchestrator -> Schema Resolver -> SQL Generator -> Governance Enforcer -> Executor) with LangGraph.
- Implemented the Governance Agent with RBAC checks against a policy store, injecting row-level filters and column masking before execution.
- Designed the multi-warehouse adapter pattern supporting Snowflake, BigQuery, and DuckDB with a unified interface.
- Achieved governed NL-to-SQL with full audit logging and lineage tracking.

**Stage-pilot** informs the reliability layer:
- The tool-calling middleware that took LLM tool invocation from 25% to 90% reliability is directly applicable to the SQL generation agent's function-calling reliability.
- Schema-aware validation and retry logic with structured error feedback.

---

## Question 2: Design a Data Lakehouse with Quality Guarantees

**Scenario**: A mid-size company is migrating from a traditional data warehouse to a lakehouse architecture. They need data quality guarantees at each processing stage, automated testing, and the ability to roll back bad data.

### Requirements Gathering Questions to Ask

- What is the current data volume and growth rate? (TB/day? PB total?)
- What are the primary data sources? (Streaming events, batch files, CDC from OLTP, third-party APIs?)
- What regulatory requirements apply? (Data retention, right-to-delete, lineage?)
- What is the acceptable data freshness for downstream consumers? (Real-time, hourly, daily?)
- How many data engineering and analytics teams will produce/consume data?
- What is the current testing and CI/CD maturity?

### High-Level Architecture

```
  +----------+   +----------+   +-----------+
  | Kafka /  |   | S3 Batch |   | CDC from  |
  | Kinesis  |   | Landing  |   | OLTP DBs  |
  +----+-----+   +----+-----+   +-----+-----+
       |              |               |
       +-------+------+-------+-------+
               |               |
        +------v------+ +-----v-------+
        | Ingestion   | | Schema      |
        | Framework   | | Registry    |
        | (Autoloader/| | (Avro/Proto |
        |  COPY INTO) | |  contracts) |
        +------+------+ +-----+-------+
               |               |
        +------v---------------v------+
        |        BRONZE LAYER         |
        |  (Raw, append-only, Delta)  |
        |  Quality Gate: schema       |
        |  conformance, dedup, not-   |
        |  null on key fields         |
        +-------------+---------------+
                      |
        +-------------v---------------+
        |        SILVER LAYER         |
        |  (Cleansed, typed, SCD2)    |
        |  Quality Gate: referential  |
        |  integrity, value ranges,   |
        |  business rule checks       |
        +-------------+---------------+
                      |
        +-------------v---------------+
        |         GOLD LAYER          |
        |  (Aggregated, denormalized) |
        |  Quality Gate: metric       |
        |  reconciliation, trend      |
        |  anomaly detection          |
        +-------------+---------------+
                      |
          +-----------+-----------+
          |           |           |
     +----v----+ +---v----+ +---v------+
     |   BI    | | ML     | | Reverse  |
     | Dashbd  | | Feature| | ETL /    |
     |         | | Store  | | Exports  |
     +---------+ +--------+ +----------+
```

### Key Components and Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **Schema Registry** | Stores Avro/Protobuf schemas for every data source. Enforces backward/forward compatibility on schema evolution. Source of truth for data contracts. |
| **Bronze Layer** | Raw data landing zone. Data is stored as-is in Delta format with `_ingested_at` timestamps. Quality gate checks: schema conformance (reject records that don't match the registered schema), deduplication on natural keys, not-null on primary key fields. Failed records are routed to a quarantine table. |
| **Silver Layer** | Cleaned and conformed data. SCD Type 2 for slowly changing dimensions. Quality gate checks: referential integrity across entities, value range validation (e.g., age between 0-150), business rule assertions (e.g., order_total = sum of line items). Implemented as dbt tests or Great Expectations suites. |
| **Gold Layer** | Business-level aggregates and denormalized tables. Quality gate checks: metric reconciliation (gold totals match silver detail), trend anomaly detection (alert if a daily metric moves > 3 standard deviations), completeness checks (no missing partitions). |
| **Quarantine + DLQ** | Bad records from any layer are routed to a quarantine table with the failure reason, timestamp, and source batch ID. Ops team reviews and reprocesses or discards. |
| **Rollback Mechanism** | Delta Lake Time Travel enables point-in-time rollback. Each pipeline run is tagged with a batch_id. If a gold-layer quality gate fails, the pipeline automatically rolls back the silver and gold layers to the previous batch_id using `RESTORE TABLE ... TO VERSION AS OF`. |

### Data Flow

1. Raw data arrives via streaming (Kafka/Kinesis) or batch (S3 landing zone, CDC).
2. Ingestion framework (Databricks Autoloader or Snowflake COPY INTO) writes to Bronze as Delta tables. Schema is validated against the registry.
3. Bronze-to-Silver transformation runs on a schedule (or trigger). It applies deduplication, type casting, SCD2 merges, and the silver quality gate. Records failing validation go to quarantine.
4. Silver-to-Gold transformation runs after silver is committed. It builds aggregates, denormalized views, and feature store tables. The gold quality gate runs metric reconciliation.
5. If gold quality gate fails, an alert fires. The pipeline can auto-rollback gold and silver to the prior committed version, or pause and await human review depending on severity.
6. Downstream consumers (BI, ML, reverse ETL) read only from the gold layer (or silver for advanced analysts with appropriate access).

### Scale Considerations

- **Partitioning strategy**: Partition by date for time-series data, Z-order on high-cardinality join keys. Use liquid clustering (Databricks) for adaptive partitioning.
- **Compaction**: Schedule OPTIMIZE to compact small files. Use auto-compaction where available.
- **Cost control**: Use spot instances for silver/gold transformations. Implement per-pipeline cost budgets with query tagging.
- **Freshness SLAs**: Bronze: < 5 min from event time. Silver: < 30 min. Gold: < 1 hour. Monitor with a freshness dashboard that alerts on SLA breach.
- **Testing in CI/CD**: Every pipeline change runs against a dev lakehouse with synthetic data. Quality gate thresholds are stored as code in the repo.

### How Doeon's Experience Maps

**Lakehouse-contract-lab** is a direct implementation:
- Built the Bronze -> Silver -> Gold medallion pipeline with Delta Lake.
- Implemented quality gates at each layer using Great Expectations and dbt tests, with automated quarantine routing.
- Designed data contracts as code: schema definitions, quality thresholds, and freshness SLAs all version-controlled.
- Implemented rollback using Delta Time Travel, triggered automatically on quality gate failure.
- Full CI/CD pipeline: every PR runs the quality gates against a test lakehouse before merge.

---

## Question 3: Design an Enterprise LLM Deployment with Safety Controls

**Scenario**: A large enterprise wants to roll out LLM capabilities across the organization (code generation, document summarization, internal chatbot) while maintaining strict safety, compliance, and cost controls.

### Requirements Gathering Questions to Ask

- How many users and use cases? (10 teams, 50 use cases vs. org-wide general purpose?)
- What compliance frameworks apply? (SOC2, HIPAA, FedRAMP, internal AI ethics policy?)
- What data classification levels exist? (Can confidential data flow to external APIs?)
- What is the budget? (Self-hosted models vs. API-based? GPU infrastructure?)
- Do we need to support multiple LLM providers for redundancy or best-fit selection?
- What is the approval process for new use cases?

### High-Level Architecture

```
 +----------------------------------------------------+
 |                  CONSUMERS                          |
 | +----------+ +----------+ +----------+ +----------+ |
 | | Code Gen | | Doc      | | Internal | | Custom   | |
 | | Plugin   | | Summarize| | Chatbot  | | App N    | |
 | +----+-----+ +----+-----+ +----+-----+ +----+-----+ |
 +------|------------|------------|------------|--------+
        +------+-----+-----+-----+
               |
        +------v-----------------+
        |     LLM Gateway        |
        | +--------------------+ |
        | | Auth & RBAC        | |
        | +--------------------+ |
        | | Use-Case Router    | |
        | +--------------------+ |
        | | Input Guardrails   | |
        | | (PII detect, topic | |
        | |  filter, injection | |
        | |  detection)        | |
        | +--------------------+ |
        | | Cost Controller    | |
        | | (Quotas, routing   | |
        | |  to cheaper models)| |
        | +--------------------+ |
        | | Output Guardrails  | |
        | | (Toxicity, factual | |
        | |  grounding, format)| |
        | +--------------------+ |
        | | Audit Logger       | |
        | +--------------------+ |
        +------+---------+------+
               |         |
        +------v---+ +---v---------+
        | External | | Self-Hosted |
        | LLM APIs | | Models      |
        | (OpenAI, | | (vLLM on    |
        | Claude)  | | GPU cluster)|
        +----------+ +-------------+
```

### Key Components and Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **LLM Gateway** | Central entry point for all LLM requests. Enforces authentication, authorization, guardrails, and cost controls. All LLM traffic must flow through this gateway -- no direct API calls allowed. |
| **Auth & RBAC** | Maps the requesting user/service to their allowed use cases, model tiers, and data classification levels. A "code-gen-team" role might have access to GPT-4 for code generation but not for document summarization of HR data. |
| **Use-Case Router** | Routes requests to the optimal model based on the use case. Simple classification tasks go to a fine-tuned small model; complex reasoning goes to GPT-4/Claude. Cost-optimized routing. |
| **Input Guardrails** | PII detection and redaction (using presidio or a fine-tuned NER model). Topic filtering (block requests that fall outside the approved use case). Prompt injection detection (detect and block attempts to override system prompts). |
| **Cost Controller** | Per-team and per-use-case token budgets with daily/monthly caps. Automatic downgrade to cheaper models when budget is 80% consumed. Dashboard for cost visibility by team, use case, and model. |
| **Output Guardrails** | Toxicity scoring. Factual grounding check (compare claims against a retrieval source). Format validation (ensure structured output matches the expected schema). Confidence thresholds -- low-confidence responses are flagged for human review. |
| **Audit Logger** | Logs every request/response: user, use case, model, input (with PII redacted), output, guardrail decisions, latency, cost. Stored in an immutable audit table. Powers compliance reporting and eval dashboards. |
| **Eval Framework** | Continuous evaluation pipeline. Runs nightly on a golden test set per use case. Tracks metrics: accuracy, hallucination rate, safety score, latency p50/p99. Alerts when a model update degrades performance. |

### Data Flow

1. Consumer app sends a request to the LLM Gateway with a use-case identifier and auth token.
2. Gateway authenticates the caller. RBAC checks whether this caller is authorized for this use case.
3. Input guardrails scan the prompt: PII is detected and redacted, topic is validated, injection patterns are checked.
4. Cost controller checks the caller's remaining budget. Selects the appropriate model tier.
5. Request is routed to the selected model (external API or self-hosted).
6. Model response is received. Output guardrails check for toxicity, factual grounding, and format compliance.
7. Clean response is returned to the consumer. Full pipeline is logged for audit.

### Scale Considerations

- **Multi-region**: Deploy the gateway in each region for latency. Self-hosted models in primary region; fall back to external APIs in secondary.
- **Caching**: Semantic cache (embedding similarity) for repeated or near-duplicate queries. Significant cost savings for FAQ-style use cases.
- **Rate limiting**: Token-bucket rate limiter per team at the gateway. Protects shared self-hosted GPU capacity.
- **Model versioning**: Blue-green deployment for model updates. Route 5% of traffic to the new model, compare eval metrics, then promote or rollback.
- **Disaster recovery**: If the primary LLM provider is down, the gateway automatically routes to the backup provider. Use-case-specific fallback chains.

### How Doeon's Experience Maps

**Enterprise-llm-adoption-kit** is a direct implementation:
- Built the LLM Gateway with RBAC, use-case routing, input/output guardrails, and cost controls.
- Designed the evaluation framework: golden test sets per use case, nightly automated evals, regression alerts.
- Implemented the audit logging pipeline for SOC2-style compliance.
- Created a self-service onboarding flow: teams define their use case, data classification, and model preferences, then get API credentials with the appropriate RBAC policies.

**Tool-call-finetune-lab** informs the model optimization layer:
- Built a QLoRA post-training lab with BFCL-aligned evaluation harnesses for tool-calling reliability, demonstrating model-customization literacy without overstating public benchmark proof.
- Evaluation methodology from BFCL-style metrics is directly applicable to the continuous eval framework.

---

## Question 4: Design a Reliable Tool-Calling Layer for LLM Agents

**Scenario**: Your company is building an AI agent platform where LLMs need to reliably invoke external tools (APIs, databases, code execution). Current tool-calling success rates are around 25-30%. Design a middleware layer to get reliability above 90%.

### Requirements Gathering Questions to Ask

- How many distinct tools does the agent need to call? (10s vs. 1000s?)
- What types of tools? (REST APIs, SQL queries, code execution, file I/O?)
- What is the latency budget per tool call? (Interactive chat vs. background jobs?)
- Are the tool schemas stable or frequently changing?
- What models are being used? (GPT-4, Claude, open-source?) Some have native tool calling, others don't.
- What are the failure modes we're seeing today? (Malformed JSON, wrong parameter types, hallucinated function names, missing required fields?)

### High-Level Architecture

```
  +----------------+
  |   LLM Agent    |
  |  (any model)   |
  +-------+--------+
          |
  +-------v-----------------------+
  |   Tool-Calling Middleware     |
  |                               |
  |  +-------------------------+  |
  |  | Schema Compiler         |  |
  |  | (Tool def -> optimized  |  |
  |  |  prompt format)         |  |
  |  +------------+------------+  |
  |               |               |
  |  +------------v------------+  |
  |  | Output Parser           |  |
  |  | (Extract structured     |  |
  |  |  call from LLM output)  |  |
  |  +------------+------------+  |
  |               |               |
  |  +------------v------------+  |
  |  | Validation Engine       |  |
  |  | (Type check, required   |  |
  |  |  fields, enum values,   |  |
  |  |  semantic constraints)  |  |
  |  +------------+------------+  |
  |               |               |
  |  +------------v------------+  |
  |  | Auto-Repair Engine      |  |
  |  | (Fix common errors:     |  |
  |  |  type coercion, default |  |
  |  |  fill, schema-guided    |  |
  |  |  correction)            |  |
  |  +------------+------------+  |
  |               |               |
  |  +------------v------------+  |
  |  | Retry Controller        |  |
  |  | (Structured error       |  |
  |  |  feedback to LLM,       |  |
  |  |  max 3 retries)         |  |
  |  +------------+------------+  |
  |               |               |
  +-------+-------v---------------+
          |
  +-------v--------+
  | Tool Executor   |
  | (Sandboxed      |
  |  execution env) |
  +-------+---------+
          |
  +-------v--------+
  | External Tools  |
  | (APIs, DBs,     |
  |  Code runtime)  |
  +----------------+
```

### Key Components and Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **Schema Compiler** | Takes raw tool definitions (JSON Schema, OpenAPI specs) and compiles them into model-optimized prompt formats. Different models respond better to different schema representations. Injects examples and constraints into the tool description. Prunes irrelevant tools based on context to reduce prompt size. |
| **Output Parser** | Extracts structured tool-call data from raw LLM output. Handles multiple output formats: native function calling (OpenAI/Claude), JSON in markdown blocks, free-text with embedded parameters. Uses regex patterns and JSON recovery heuristics for malformed output. |
| **Validation Engine** | Validates parsed tool calls against the schema. Checks: required fields present, types correct, enum values valid, string patterns match, numeric ranges respected. Returns structured error reports with specific field-level issues. |
| **Auto-Repair Engine** | Attempts to fix common errors without re-querying the LLM. Type coercion (string "42" -> int 42). Default value injection for missing optional fields. Fuzzy matching on enum values ("newyork" -> "new_york"). Schema-guided correction using the closest valid value. |
| **Retry Controller** | When auto-repair fails, constructs a targeted error message and re-prompts the LLM. The error message includes: what was wrong, what the schema expects, and the specific failing field. Limits to 3 retries with exponential backoff. Tracks retry patterns to identify systematic issues. |
| **Tool Executor** | Runs the validated tool call in a sandboxed environment. Timeout enforcement, error capture, and result formatting. Returns structured results back to the agent. |

### Data Flow

1. LLM agent decides to call a tool and emits raw output (JSON, text, or native function call).
2. Schema Compiler has already injected optimized tool definitions into the system prompt.
3. Output Parser extracts the intended tool name and parameters from the raw output.
4. Validation Engine checks the parsed call against the tool schema.
5. If validation fails, Auto-Repair Engine attempts to fix the issues.
6. If auto-repair succeeds, proceed to execution. If it fails, Retry Controller sends structured feedback to the LLM and re-prompts.
7. After up to 3 retries, if still failing, escalate to human or return a structured error.
8. Tool Executor runs the valid call in sandbox, returns results to the agent.

### Scale Considerations

- **Latency**: The middleware adds < 50ms for validation + auto-repair (in-memory operations). A retry adds one LLM round-trip (~1-2s). Target: 90%+ of calls succeed on first attempt, < 8% need one retry, < 2% need two retries.
- **Schema registry**: Centralized registry for all tool schemas. Versioned. When a tool schema changes, the compiler regenerates the optimized prompt format.
- **Observability**: Every tool call logged with: raw LLM output, parsed result, validation errors, repair actions, retry count, final success/failure. Dashboard showing per-tool success rates, common failure modes, model-specific patterns.
- **A/B testing**: Test different schema compilation strategies, prompt formats, and repair heuristics. Track success rate per variant.

### How Doeon's Experience Maps

**Stage-pilot** is precisely this system:
- Built the middleware that improved tool-calling reliability from 25% to 90%.
- Implemented the schema compiler, output parser, validation engine, auto-repair engine, and retry controller.
- Key insight: most failures were predictable patterns (type mismatches, missing fields, hallucinated enum values) that could be fixed without re-querying the LLM.
- The auto-repair engine alone recovered ~40% of initially invalid calls.
- Structured error feedback in the retry loop was critical -- generic "try again" messages didn't help; specific "field X expects int, got string '42'" messages did.

---

## Question 5: Design a Real-Time SQL Copilot

**Scenario**: Build a SQL copilot integrated into a data IDE (like Snowflake's Snowsight or a VS Code extension) that suggests SQL completions, explains queries, and generates queries from natural language -- all in real-time with sub-second latency.

### Requirements Gathering Questions to Ask

- What is the target latency for inline completions? (< 500ms for autocomplete, < 3s for full query generation?)
- How large is the schema? (100 tables or 10,000 tables?)
- Do users expect the copilot to learn from their query history?
- What level of personalization? (Team-level or individual-level?)
- Must it work offline or always connected?
- What data governance applies to the copilot's training data and suggestions?

### High-Level Architecture

```
  +-----------------------------------+
  |          Data IDE / Editor         |
  | +-------------------------------+ |
  | | Editor Plugin (keystrokes,    | |
  | | cursor position, active file) | |
  | +------+------------------------+ |
  +--------|---------------------------+
           |
  +--------v--------------------------+
  |        Copilot Service            |
  |                                   |
  | +--------+  +--------+  +------+ |
  | | Context|  | Comple-|  | NL2  | |
  | | Assem- |  | tion   |  | SQL  | |
  | | bler   |  | Engine |  | Eng. | |
  | +---+----+  +---+----+  +--+---+ |
  |     |           |          |      |
  | +---v-----------v----------v---+  |
  | |    Model Router              |  |
  | |  (small model for complete,  |  |
  | |   large model for NL2SQL)    |  |
  | +---+-------------------+------+  |
  +-----|-------------------|----------+
        |                   |
  +-----v------+   +-------v--------+
  | Schema     |   | Query History  |
  | Index      |   | Index          |
  | (Embedding |   | (User + team   |
  |  search)   |   |  patterns)     |
  +------------+   +----------------+
```

### Key Components

| Component | Responsibility |
|-----------|---------------|
| **Context Assembler** | Gathers context for the current suggestion: cursor position, surrounding SQL, active database/schema, user's recent queries, table DDLs for referenced tables. Keeps context window small by ranking relevance. |
| **Completion Engine** | Fast inline completions (< 500ms). Uses a small fine-tuned model (or a retrieval-based approach) for table names, column names, JOIN conditions, and WHERE clauses. Pre-fetches schema metadata for the active database. |
| **NL2SQL Engine** | Full query generation from natural language. Uses a larger model with schema context, examples, and governance rules. Validates output via dry-run before presenting. Multi-turn capable for refinement. |
| **Model Router** | Routes to small/fast model for completions, large model for NL2SQL. Can also route to a cached response if the query pattern has been seen before. |
| **Schema Index** | Embedding-based index of all table and column metadata. Enables fast retrieval of relevant schema context given a partial query or NL description. Updated incrementally as schemas change. |
| **Query History Index** | Per-user and per-team query patterns. Enables personalized suggestions ("users on this team usually join these two tables on this key"). |

### Data Flow (Inline Completion)

1. User types `SELECT * FROM orders o JOIN` and pauses.
2. Editor plugin sends the partial SQL + cursor position to the Copilot Service.
3. Context Assembler retrieves: active schema DDLs for `orders`, foreign key relationships, user's recent JOINs involving `orders`.
4. Completion Engine generates: `customers c ON o.customer_id = c.id` using the small model + schema context.
5. Suggestion appears as ghost text in < 500ms. User accepts with Tab.

### Data Flow (NL2SQL)

1. User types a natural-language comment: `-- show me top 10 customers by revenue this quarter`.
2. Plugin sends the NL query + active schema context to the NL2SQL Engine.
3. Context Assembler retrieves relevant table DDLs, example queries from history, and governance rules.
4. NL2SQL Engine generates the full SQL query via the large model.
5. Tool-calling middleware (stage-pilot-style) validates the output SQL structure.
6. Governance check ensures the user has access to referenced tables/columns.
7. Validated SQL is inserted into the editor. User can refine via follow-up comments.

### Scale Considerations

- **Latency**: Completion must be < 500ms. Pre-load schema metadata in a local cache. Use speculative execution: start generating the completion as the user types, abort if they keep typing.
- **Schema freshness**: Schema index is updated via CDC from the warehouse's information_schema. Incremental updates, not full re-index.
- **Personalization**: User and team query patterns are stored locally and synced periodically. No PII in the pattern index.
- **Cost**: Inline completions use a small self-hosted model (low cost per request). NL2SQL uses a large model but is invoked less frequently.

### How Doeon's Experience Maps

This combines **Nexus-Hive** (NL2SQL multi-agent pipeline with governance) and **stage-pilot** (reliable tool-calling for SQL validation):
- Nexus-Hive's schema resolution agent becomes the Schema Index.
- Nexus-Hive's SQL generation agent becomes the NL2SQL Engine.
- Stage-pilot's validation and auto-repair pipeline ensures generated SQL is syntactically valid before showing to the user.
- The governance layer from Nexus-Hive ensures the copilot doesn't suggest queries the user can't run.

---

## Question 6: Design a Feature Store for ML at Scale

**Scenario**: Build a feature store that serves both batch (training) and real-time (inference) use cases for a company running hundreds of ML models.

### Requirements Gathering Questions to Ask

- How many features? (1,000s? 100,000s?)
- What is the real-time serving latency requirement? (< 10ms p99?)
- What is the feature freshness requirement? (Real-time, hourly, daily?)
- How many models consume features? (10? 1000?)
- What is the training data volume? (TB? PB?)
- Do we need point-in-time correctness for training (avoid data leakage)?

### High-Level Architecture

```
  +------------------+     +------------------+
  | Batch Sources    |     | Stream Sources   |
  | (Data Warehouse, |     | (Kafka, Kinesis, |
  |  S3, Delta Lake) |     |  Change Events)  |
  +--------+---------+     +--------+---------+
           |                        |
  +--------v---------+    +--------v---------+
  | Batch Feature    |    | Stream Feature   |
  | Pipeline         |    | Pipeline         |
  | (Spark, dbt)     |    | (Flink, Spark    |
  |                  |    |  Structured      |
  |                  |    |  Streaming)      |
  +--------+---------+    +--------+---------+
           |                        |
  +--------v------------------------v--------+
  |           Feature Registry               |
  |  (Metadata: name, type, owner, SLA,     |
  |   lineage, freshness, schema version)    |
  +--------+----------------+---------------+
           |                |
  +--------v--------+ +----v--------------+
  | Offline Store   | | Online Store      |
  | (Delta Lake /   | | (Redis / DynamoDB |
  |  S3 Parquet,    | |  / Cassandra,     |
  |  point-in-time  | |  low-latency      |
  |  correct)       | |  key-value)       |
  +-----------------+ +----+--------------+
                           |
                   +-------v-------+
                   | Feature       |
                   | Serving API   |
                   | (REST/gRPC,   |
                   |  < 10ms p99)  |
                   +---------------+
```

### Key Components

| Component | Responsibility |
|-----------|---------------|
| **Feature Registry** | Central catalog of all features. Stores metadata: feature name, type, owner, SLA, lineage (which source tables feed it), schema version, and freshness guarantee. Enables discovery ("what features exist for user entities?") and governance ("who owns this feature?"). |
| **Batch Feature Pipeline** | Computes features on a schedule (hourly/daily) from warehouse data. Outputs to the Offline Store as time-partitioned Parquet/Delta. Ensures point-in-time correctness: each feature value is tagged with its event timestamp, not its computation timestamp. |
| **Stream Feature Pipeline** | Computes features in real-time from event streams. Outputs to the Online Store with minimal latency. Handles windowed aggregations (e.g., "count of transactions in last 30 minutes"). |
| **Offline Store** | Stores historical feature values for training. Supports point-in-time joins: given a list of entity IDs and timestamps, retrieve the feature values that were valid at each timestamp. This prevents data leakage in training. Backed by Delta Lake or S3 Parquet. |
| **Online Store** | Stores the latest feature values for real-time serving. Key-value store (Redis, DynamoDB) optimized for low-latency lookups. Supports batch gets (retrieve features for multiple entities in one call). |
| **Feature Serving API** | REST/gRPC API for model inference. Receives entity IDs, returns feature vectors. Must meet < 10ms p99 latency. Handles feature transformations (on-demand features computed at serving time). |

### Scale Considerations

- **Point-in-time correctness**: The offline store must support efficient time-travel queries. Partition by entity + time. Use bi-temporal modeling: event_time (when the event happened) and processing_time (when it was computed).
- **Freshness monitoring**: Each feature has an SLA. A monitoring job checks the last update timestamp and alerts on staleness.
- **Feature reuse**: The registry enables feature sharing across teams. A well-computed feature is written once and consumed by many models.
- **Online store sizing**: For 100K features, 10M entities, at ~100 bytes per feature = ~100 TB. Use tiering: hot features in Redis, warm in DynamoDB.

### How Doeon's Experience Maps

**Lakehouse-contract-lab** provides the data pipeline foundation:
- The medallion architecture directly supports the batch feature pipeline (silver layer = clean features, gold layer = aggregated features).
- Quality gates ensure feature data integrity before it reaches models.
- Delta Lake Time Travel supports the point-in-time correctness requirement.

---

## Question 7: Design a RAG (Retrieval-Augmented Generation) System at Enterprise Scale

**Scenario**: Build a RAG system that enables employees to ask questions over the company's internal knowledge base (Confluence, Notion, Sharepoint, code repos, Slack history) with high factual accuracy.

### Requirements Gathering Questions to Ask

- How much content? (10K docs? 10M docs?)
- What formats? (Wiki pages, PDFs, code, Slack messages, emails?)
- How frequently does content change? (Real-time updates needed?)
- What access controls apply? (Can everyone see everything, or per-document ACLs?)
- What is the accuracy standard? (Is a 5% hallucination rate acceptable?)
- Do users need citations in the response?

### High-Level Architecture

```
  +----------+  +----------+  +----------+  +----------+
  |Confluence|  |  Notion  |  |Sharepoint|  |  GitHub  |
  +----+-----+  +----+-----+  +-----+----+  +----+-----+
       |             |              |             |
  +----v-------------v--------------v-------------v----+
  |              Document Ingestion Pipeline            |
  |  (Crawl, Extract, Chunk, Embed, Index)             |
  +---+---------------------------------------------+--+
      |                                             |
  +---v-------------------+   +--------------------v---+
  | Vector Store          |   | Metadata Store         |
  | (Embeddings + chunks) |   | (Source, ACL, last     |
  | [Pinecone / Qdrant /  |   |  updated, doc type)    |
  |  pgvector]            |   +------------------------+
  +---+-------------------+
      |
  +---v-------------------------------------------+
  |              Query Pipeline                    |
  |  +----------+  +-----------+  +-------------+ |
  |  | Query    |  | Retriever |  | Reranker    | |
  |  | Rewriter |  | (Hybrid:  |  | (Cross-     | |
  |  | (expand  |  |  semantic |  |  encoder)   | |
  |  |  intent) |  |  + BM25)  |  |             | |
  |  +----+-----+  +-----+-----+  +------+------+ |
  |       |              |               |         |
  |  +----v--------------v---------------v------+  |
  |  | LLM Generator (with citations)           |  |
  |  +------------------------------------------+  |
  |  | ACL Filter (post-retrieval)              |  |
  |  +------------------------------------------+  |
  +------------------------------------------------+
```

### Key Components

| Component | Responsibility |
|-----------|---------------|
| **Document Ingestion Pipeline** | Crawls source systems on a schedule (or via webhooks for real-time). Extracts text from various formats (HTML, PDF, code). Chunks documents using semantic boundaries (not fixed-size). Generates embeddings. Writes to vector store and metadata store. |
| **Chunking Strategy** | Semantic chunking: split on paragraph/section boundaries, not fixed character counts. Include parent context: each chunk carries its document title, section header, and surrounding summary. Overlap chunks by ~10% to avoid losing context at boundaries. |
| **Vector Store** | Stores embeddings with chunk IDs. Supports approximate nearest neighbor search with metadata filtering. |
| **Hybrid Retrieval** | Combines semantic search (embedding similarity) with lexical search (BM25 on keywords). Fusion: reciprocal rank fusion or learned weighting. Semantic search handles paraphrased queries; BM25 handles exact terms and acronyms. |
| **Reranker** | Cross-encoder model that rescores the top-K results from retrieval. More accurate than embedding similarity alone but too slow to run on the full corpus. Typically reranks top 20-50 candidates. |
| **ACL Filter** | Post-retrieval filter that removes chunks the user doesn't have access to. Maps the user's identity to their access groups. Checks each retrieved document's ACL. This must happen before the LLM sees the content. |
| **LLM Generator** | Takes the filtered, reranked chunks as context. Generates a natural-language answer with inline citations [1], [2]. Instructed to say "I don't know" when the context doesn't contain the answer. |

### Scale Considerations

- **Freshness**: Incremental indexing via webhooks from source systems. If a Confluence page is updated, re-chunk and re-embed only that page. Maintain a versioned index to avoid stale results.
- **Chunk count**: For 10M documents at ~5 chunks each = 50M vectors. Use a scalable vector database (Pinecone, Qdrant) with appropriate sharding.
- **ACL performance**: Pre-compute ACL groups per user and cache. Filter at retrieval time using metadata filters in the vector store (faster than post-retrieval filtering).
- **Evaluation**: Build a golden QA set (question + expected answer + source). Run weekly evals measuring: answer correctness, citation accuracy, hallucination rate, retrieval recall.

### How Doeon's Experience Maps

**Nexus-Hive's** multi-agent architecture applies:
- The query rewriter agent disambiguates user intent.
- The retrieval and reranking pipeline mirrors the schema resolution step in NL2SQL.
- The governance layer (ACL filtering) is analogous to Nexus-Hive's RBAC-based governance.

**Enterprise-llm-adoption-kit** provides the safety and governance framework:
- Input/output guardrails prevent the RAG system from leaking sensitive content.
- Audit logging tracks every question, retrieved context, and generated answer.

---

## Question 8: Design a Multi-Tenant AI Platform (PaaS)

**Scenario**: Build a platform where multiple enterprise customers can deploy, manage, and monitor their own AI/ML models with strong tenant isolation.

### Requirements Gathering Questions to Ask

- How many tenants? (10s? 1000s?)
- What workloads? (Batch inference, real-time serving, training, fine-tuning?)
- What isolation level? (Shared infrastructure with logical isolation vs. dedicated compute per tenant?)
- What compliance requirements vary by tenant? (Some HIPAA, some not?)
- Do tenants bring their own models or use platform-provided models?
- SLA requirements? (99.9%? 99.99%?)

### High-Level Architecture

```
  +-------------------------------------------+
  |            Control Plane                   |
  | +----------+ +----------+ +-----------+   |
  | | Tenant   | | Billing  | | Model     |   |
  | | Manager  | | & Quota  | | Registry  |   |
  | +----------+ +----------+ +-----------+   |
  | +----------+ +----------+ +-----------+   |
  | | Auth /   | | Logging  | | Monitoring|   |
  | | IAM      | | & Audit  | | & Alert   |   |
  | +----------+ +----------+ +-----------+   |
  +-------------------+-----------------------+
                      |
  +-------------------v-----------------------+
  |            Data Plane                      |
  |                                            |
  |  Tenant A Namespace    Tenant B Namespace  |
  | +------------------+ +------------------+  |
  | | Compute Pool A   | | Compute Pool B   |  |
  | | (GPU nodes)      | | (GPU nodes)      |  |
  | +------------------+ +------------------+  |
  | | Object Store A   | | Object Store B   |  |
  | | (Models, Data)   | | (Models, Data)   |  |
  | +------------------+ +------------------+  |
  | | Serving Endpoint | | Serving Endpoint |  |
  | | (Model API)      | | (Model API)      |  |
  | +------------------+ +------------------+  |
  +--------------------------------------------+
```

### Key Design Decisions

- **Isolation**: Use Kubernetes namespaces per tenant with network policies, resource quotas, and separate service accounts. Sensitive tenants (HIPAA) get dedicated node pools.
- **Noisy neighbor prevention**: Resource quotas (CPU, GPU, memory) per tenant. Request queuing with fair scheduling. Burst capacity with preemption policies.
- **Data isolation**: Separate object storage buckets per tenant. Encryption at rest with tenant-specific keys (BYOK supported). No cross-tenant data access at the infrastructure level.
- **Model serving**: Each tenant gets their own serving endpoints (Kubernetes Deployments). Auto-scaling based on request volume. Blue-green deployment for model updates.

### How Doeon's Experience Maps

**Enterprise-llm-adoption-kit** addresses the governance layer:
- RBAC and per-tenant policies map directly to the control plane's Auth/IAM component.
- Cost controls and quota management mirror the billing and quota system.
- Audit logging provides tenant-specific compliance reporting.

---

## Question 9: Design a CI/CD Pipeline for ML Models

**Scenario**: Build a CI/CD system for ML models that handles data validation, model training, evaluation, deployment, and monitoring with automated rollback.

### Requirements Gathering Questions to Ask

- How many models in production? (10? 100?)
- What is the deployment target? (Real-time API, batch, edge?)
- What triggers retraining? (Schedule, data drift, performance degradation?)
- What is the acceptable deployment latency? (Minutes? Hours?)
- What approval process is needed before production deployment?

### High-Level Architecture

```
  +----------+     +----------+     +----------+
  |  Code    |     |  Data    |     | Schedule |
  |  Change  |     |  Change  |     | Trigger  |
  +----+-----+     +----+-----+     +----+-----+
       |                |                |
       +-------+--------+--------+-------+
               |                 |
  +------------v-----------+  +-v-----------+
  | Data Validation Stage  |  | Unit Tests  |
  | (Schema, distribution, |  | (Model code |
  |  quality checks)       |  |  tests)     |
  +------------+-----------+  +------+------+
               |                     |
  +------------v---------------------v------+
  |         Training Stage                   |
  |  (Reproducible: pinned data version,    |
  |   pinned code version, pinned deps)     |
  +-------------------+---------------------+
                      |
  +-------------------v---------------------+
  |         Evaluation Stage                 |
  |  (Compare against baseline on golden    |
  |   test set. Must beat current prod by   |
  |   X% on key metrics or reject.)         |
  +-------------------+---------------------+
                      |
  +-------------------v---------------------+
  |         Staging Deployment               |
  |  (Shadow mode: run alongside prod,      |
  |   compare outputs, no user impact)      |
  +-------------------+---------------------+
                      |
  +-------------------v---------------------+
  |         Canary / Progressive Rollout     |
  |  (5% -> 25% -> 50% -> 100%)            |
  |  (Auto-rollback if metrics degrade)     |
  +-------------------+---------------------+
                      |
  +-------------------v---------------------+
  |         Production Monitoring            |
  |  (Data drift, model drift, latency,    |
  |   error rate, business metrics)         |
  +------------------------------------------+
```

### Key Components

| Component | Responsibility |
|-----------|---------------|
| **Data Validation** | Before training, validate: schema matches expectation, feature distributions haven't shifted beyond thresholds, no missing partitions, row counts within expected range. Uses Great Expectations or custom assertions. |
| **Training Stage** | Fully reproducible: data version (Delta Lake snapshot), code version (git SHA), dependency versions (lock file), random seeds. Outputs: model artifact, training metrics, data lineage record. |
| **Evaluation Stage** | Runs the candidate model against a versioned golden test set. Compares against the current production model on key metrics (accuracy, latency, fairness). Gate: candidate must beat production by a configurable margin or the pipeline stops. |
| **Shadow Deployment** | Candidate model is deployed alongside production. Both receive the same requests. Outputs are compared but only production results are returned to users. Catches issues that test sets miss. |
| **Canary Rollout** | Gradual traffic shift: 5% -> 25% -> 50% -> 100%. At each stage, compare live metrics (latency p99, error rate, business KPIs) against baseline. Auto-rollback if any metric breaches the threshold. |
| **Production Monitoring** | Continuous: data drift (input distribution shift), model drift (prediction distribution shift), latency, error rate. Alerts trigger investigation or automatic retraining. |

### How Doeon's Experience Maps

- Shipped 23 projects with CI/CD and tests, demonstrating deep experience with automated pipelines.
- **Lakehouse-contract-lab's** quality gates map directly to the data validation stage.
- **Tool-call-finetune-lab's** BFCL evaluation methodology maps to the evaluation stage (benchmark-driven model assessment).
- **Enterprise-llm-adoption-kit's** eval framework provides the monitoring and regression detection components.

---

## Question 10: Design a Distributed Query Engine for a Data Mesh

**Scenario**: A large organization has adopted a data mesh: each domain team owns their data as a product. Design a query engine that lets analysts query across domain boundaries without centralizing all data.

### Requirements Gathering Questions to Ask

- How many domain teams / data products? (10? 100?)
- What storage formats are used across domains? (Some Snowflake, some BigQuery, some S3/Parquet?)
- What governance model? (Federated or centralized catalog?)
- What is the acceptable latency for cross-domain queries? (Interactive or batch?)
- How do domain teams define and enforce their data contracts?

### High-Level Architecture

```
  +------------------------------------------+
  |        Federated Query Interface          |
  |  (SQL editor, API, notebook integration)  |
  +-------------------+----------------------+
                      |
  +-------------------v----------------------+
  |         Federated Query Engine            |
  |  +-----------------------------------+   |
  |  | Query Parser & Planner            |   |
  |  | (Parse SQL, identify domains,     |   |
  |  |  plan distributed execution)      |   |
  |  +-----------------------------------+   |
  |  | Domain Catalog (Data Product      |   |
  |  |  Registry: schema, SLA, owner,    |   |
  |  |  access policy, endpoint)         |   |
  |  +-----------------------------------+   |
  |  | Access Policy Engine              |   |
  |  | (Cross-domain RBAC, data          |   |
  |  |  classification enforcement)      |   |
  |  +-----------------------------------+   |
  |  | Distributed Executor              |   |
  |  | (Push computation to domains,     |   |
  |  |  aggregate results centrally)     |   |
  |  +-----------------------------------+   |
  +------+----------+----------+-------------+
         |          |          |
  +------v---+ +---v------+ +-v----------+
  | Domain A | | Domain B | | Domain C   |
  | (Sales)  | | (Product)| | (Customer) |
  | Snowflake| | BigQuery | | S3/Delta   |
  +----------+ +----------+ +------------+
```

### Key Design Decisions

- **Push-down optimization**: Push filters, projections, and aggregations to domain data products. Only transfer the minimal result set across the network. Each domain exposes a query API that accepts pushed-down operations.
- **Data contracts**: Each domain publishes a data contract: schema, SLA (latency, freshness), access policy, and a health check endpoint. The federated engine only routes to healthy domains.
- **Catalog federation**: The central catalog doesn't store data, only metadata pointers. Each domain registers its data products. The catalog supports search and discovery.
- **Cross-domain joins**: The planner identifies the optimal join strategy: push-down (if both sides are in the same engine), broadcast (small table replicated to the larger side), or shuffle (both sides exchange data via an intermediate stage).

### How Doeon's Experience Maps

**Nexus-Hive** provides the multi-warehouse query layer:
- Designed the multi-warehouse adapter pattern (Snowflake, BigQuery, DuckDB) with a unified interface -- this is the core of the distributed executor.
- The governance agent enforces cross-domain access policies, analogous to the Access Policy Engine.

**Lakehouse-contract-lab** provides data contract expertise:
- Data contracts as code (schema + quality + SLA) map directly to domain data product contracts.
- Quality gates ensure data products meet their SLA before serving queries.

---

## General Tips for System Design Interviews

### Framework for Answering (Use for Every Question)

1. **Clarify requirements** (2-3 min): Ask 4-6 questions to scope the problem. Demonstrate that you think before you build.
2. **Define the API / interface** (2 min): What does the user-facing interface look like? REST API? SQL? Chat?
3. **High-level architecture** (5 min): Draw the major components and their interactions. Use the whiteboard/drawing tool.
4. **Deep dive on 2-3 components** (15 min): The interviewer will steer you. Go deep on data model, algorithms, or specific components.
5. **Scale and trade-offs** (5 min): How does it scale to 10x/100x? What are the trade-offs you made? What would you change?
6. **Connect to your experience** (2 min): Explicitly connect the design to projects you have built. This is your differentiator.

### Doeon's Unique Value Proposition in System Design Interviews

You are not a typical candidate who describes systems theoretically. You have **built** these systems:

- "I have actually built a governed NL2SQL platform (Nexus-Hive) with multi-agent orchestration and RBAC enforcement."
- "I improved tool-calling reliability from 25% to 90% in production (stage-pilot) -- here is how the auto-repair engine works."
- "I implemented a medallion lakehouse with quality gates that automatically quarantine bad data and rollback via Delta Time Travel (lakehouse-contract-lab)."
- "I designed an enterprise LLM governance framework with RBAC, evals, and audit logging (enterprise-llm-adoption-kit)."
- "I built a QLoRA fine-tuning lab and BFCL-aligned evaluation harness for tool-calling reliability (tool-call-finetune-lab)."

Always pivot from theoretical design to concrete implementation experience. Interviewers remember candidates who have done the work, not just described it.
