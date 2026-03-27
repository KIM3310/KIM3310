# Snowflake Architecture Cheat Sheet

Quick reference for system design interviews and Solutions Architect roles.

---

## Three-Layer Architecture

Snowflake separates storage, compute, and cloud services -- this is the foundational concept.

```
┌────────────────────────────────────────────┐
│           CLOUD SERVICES LAYER             │
│  (Authentication, Access Control, Query    │
│   Optimization, Metadata Management,       │
│   Infrastructure Management)               │
│                                            │
│  - Shared across all accounts              │
│  - Always-on (no warehouse needed)         │
│  - Query compilation and optimization      │
│  - Metadata store (micro-partition stats)  │
│  - Security: AuthN, AuthZ, encryption      │
│  - Transaction management                  │
└────────────────┬───────────────────────────┘
                 │
┌────────────────┴───────────────────────────┐
│           COMPUTE LAYER                     │
│  (Virtual Warehouses)                       │
│                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  WH: XS  │ │  WH: L   │ │  WH: 2XL │  │
│  │  (1 node)│ │  (8 nodes)│ │ (32 nodes)│  │
│  └──────────┘ └──────────┘ └──────────┘  │
│                                            │
│  - Independent, elastically scalable       │
│  - No contention between warehouses        │
│  - Can auto-suspend and auto-resume        │
│  - Billed per-second while running         │
└────────────────┬───────────────────────────┘
                 │
┌────────────────┴───────────────────────────┐
│           STORAGE LAYER                     │
│  (Cloud Object Storage: S3/Azure Blob/GCS) │
│                                            │
│  - Data stored as micro-partitions         │
│  - Compressed, columnar format             │
│  - Immutable files (copy-on-write)         │
│  - Managed entirely by Snowflake           │
│  - Billed by TB stored per month           │
└────────────────────────────────────────────┘
```

**Why this matters for interviews**: The separation means you can scale compute independently from storage. You can have 10 different warehouses all reading the same data without copying it. This is the key enabler for multi-tenant analytics and workload isolation.

---

## Micro-Partitions

Micro-partitions are Snowflake's fundamental storage unit.

**What they are**:
- Contiguous units of storage, 50-500 MB compressed
- Columnar format (each column stored independently within the partition)
- Immutable: updates create new micro-partitions (copy-on-write)
- Automatically created and sized by Snowflake (users don't manage them directly)

**Metadata stored per micro-partition**:
- Range of values for each column (min/max)
- Number of distinct values
- NULL count
- Additional statistics for optimization

**Pruning** is the key performance mechanism:
- When a query has a WHERE clause (e.g., `WHERE date = '2024-01-15'`), Snowflake checks the metadata to identify which micro-partitions could possibly contain matching data.
- Partitions whose min/max range doesn't overlap the filter are skipped entirely.
- This is why clustering (ordering data by a key) dramatically improves performance: it reduces the number of partitions that need to be scanned.

**Clustering keys**:
- Define the order in which data is organized within micro-partitions
- Choose columns frequently used in WHERE clauses and JOIN conditions
- Automatic clustering maintains the ordering as data is loaded
- Check clustering quality with `SYSTEM$CLUSTERING_INFORMATION`
- Cost trade-off: automatic re-clustering consumes credits

**Interview talking point**: "Snowflake's micro-partition pruning is analogous to partition elimination in traditional databases, but it works automatically without the user defining partitions. The key is that the metadata-based approach means the query optimizer can skip irrelevant data without reading it at all."

---

## Virtual Warehouses

Virtual warehouses are the compute engine.

**Sizing**:
| Size | Nodes | Credits/Hour |
|------|-------|-------------|
| XS   | 1     | 1           |
| S    | 2     | 2           |
| M    | 4     | 4           |
| L    | 8     | 8           |
| XL   | 16    | 16          |
| 2XL  | 32    | 32          |
| 3XL  | 64    | 64          |
| 4XL  | 128   | 128         |

Doubling the size doubles the nodes and the cost. Performance scales roughly linearly for scan-heavy queries (because more nodes = more parallel I/O). Complex queries may not scale linearly due to data shuffling.

**Multi-cluster warehouses**:
- Scale out (add more clusters of the same size) for concurrency
- Scale up (increase warehouse size) for single-query performance
- Auto-scaling mode: Snowflake adds clusters as query demand increases
- Maximized mode: all clusters start immediately
- Scaling policy: standard (conservative, cost-optimized) or economy (aggressive scale-down)

**Auto-suspend and auto-resume**:
- Auto-suspend: warehouse goes to sleep after N minutes of inactivity (default: 10 min)
- Auto-resume: warehouse wakes up when a query arrives
- Billing is per-second with a 60-second minimum per resume
- Cost optimization: set auto-suspend to 1-5 minutes for interactive workloads

**Query caching layers**:
1. **Result cache** (cloud services layer): If the exact same query has been run before and the underlying data hasn't changed, return the cached result. Free (no warehouse needed). 24-hour TTL.
2. **Local disk cache** (compute layer): Micro-partition data cached on the warehouse's local SSD. Persists as long as the warehouse is running. This is why auto-suspend has a trade-off: suspending saves credits but clears the local cache.
3. **Remote disk cache** (storage layer): Micro-partition data cached in the remote storage layer. Slower than local but persistent.

**Interview talking point**: "The multi-cluster warehouse is Snowflake's answer to the concurrency problem. Instead of making all users share one pool of resources, you can scale out clusters independently. Combined with result caching, this means a dashboard viewed by 100 people simultaneously doesn't need 100x the compute."

---

## Time Travel and Fail-Safe

**Time Travel**:
- Access historical data as it existed at any point within the retention period
- Default retention: 1 day (Standard edition), up to 90 days (Enterprise edition)
- Syntax: `SELECT * FROM my_table AT (TIMESTAMP => '2024-01-15 10:00:00')`
- Also supports: `BEFORE (STATEMENT => 'query_id')`
- Enables: undoing accidental changes, querying historical state, reproducible analytics
- `UNDROP TABLE/SCHEMA/DATABASE`: restore dropped objects within retention

**Fail-safe**:
- 7-day recovery period AFTER Time Travel expires
- Not user-accessible: only Snowflake support can recover data from fail-safe
- Provides disaster recovery beyond Time Travel
- Incurs storage costs for the additional 7 days of data

**Storage cost implications**:
- Active data + Time Travel data + Fail-safe data all consume storage
- A table with 90-day Time Travel and frequent updates can have storage costs several times larger than the active data alone
- Use TRANSIENT tables for staging/temporary data (no fail-safe, saves storage)
- Use TEMPORARY tables for session-scoped data (no Time Travel, no fail-safe)

**Interview talking point**: "In lakehouse-contract-lab, I use Delta Lake Time Travel for rollback, which is conceptually identical to Snowflake's Time Travel. The key insight is that immutable storage (micro-partitions in Snowflake, Parquet files in Delta) makes time travel nearly free from an architecture perspective -- you're just keeping old files instead of deleting them."

---

## Data Sharing

**Secure Data Sharing**:
- Share data between Snowflake accounts without copying it
- The consumer reads directly from the provider's storage (no data movement)
- Provider controls access: can revoke at any time
- Consumer sees a read-only database in their account
- No additional storage cost for the consumer (it's reading the provider's data)

**Components**:
- **Share**: A named object containing the databases/schemas/tables being shared
- **Secure views**: Views that hide the underlying query logic from the consumer
- **Reader accounts**: Snowflake-managed accounts for consumers who don't have their own Snowflake account

**Snowflake Marketplace**:
- Public data marketplace where providers list data products
- Consumers can subscribe and access data instantly
- Monetization: providers can charge for data access

**Interview talking point**: "Data sharing without copying is a game-changer for data mesh architectures. In a traditional setup, sharing data between teams means creating ETL pipelines to copy data between warehouses. Snowflake's sharing model means the data stays in one place, governed by the provider, with zero-copy access for consumers."

---

## Security and Governance

**Authentication**:
- MFA (multi-factor authentication)
- SSO via SAML 2.0
- Key-pair authentication for programmatic access
- Network policies (IP whitelisting)

**Authorization**:
- Role-based access control (RBAC): roles own privileges, users are assigned roles
- Role hierarchy: roles can be granted to other roles
- System-defined roles: ACCOUNTADMIN, SYSADMIN, SECURITYADMIN, USERADMIN, PUBLIC
- Custom roles for granular access control
- Best practice: principle of least privilege, never use ACCOUNTADMIN for daily work

**Data governance**:
- **Column-level security**: masking policies that dynamically mask data based on the querying user's role
- **Row access policies**: filter rows based on the querying user's role (analogous to row-level security in traditional databases)
- **Object tagging**: tag tables and columns with sensitivity classifications (PII, PHI, etc.)
- **Access history**: audit log of who accessed what data
- **Data classification**: automatic detection of sensitive data (PII, payment info) using Snowflake's built-in classifiers

**Encryption**:
- All data encrypted at rest (AES-256) and in transit (TLS 1.2)
- Tri-Secret Secure: customer-managed key combined with Snowflake-managed key
- End-to-end encryption: data is never stored unencrypted

**Interview talking point**: "Nexus-Hive's governance agent implements column-level masking and row-level filtering, which maps directly to Snowflake's masking policies and row access policies. The difference is that Nexus-Hive operates at the NL-to-SQL generation layer (preventing restricted queries from being generated), while Snowflake operates at the execution layer (enforcing policies at query runtime). The ideal architecture uses both: governance in the application layer as a first line of defense, and Snowflake policies as the enforcement backstop."

---

## Snowflake Cortex (AI/LLM Features)

**LLM Functions** (SQL-callable AI):
- `SNOWFLAKE.CORTEX.COMPLETE(model, prompt)`: text generation using hosted LLMs
- `SNOWFLAKE.CORTEX.EXTRACT_ANSWER(text, question)`: extractive QA over text
- `SNOWFLAKE.CORTEX.SENTIMENT(text)`: sentiment analysis
- `SNOWFLAKE.CORTEX.SUMMARIZE(text)`: text summarization
- `SNOWFLAKE.CORTEX.TRANSLATE(text, source_lang, target_lang)`: translation

**Vector Search**:
- `VECTOR` data type for storing embeddings
- `VECTOR_COSINE_SIMILARITY`, `VECTOR_L2_DISTANCE` functions for similarity search
- Enables RAG patterns directly in SQL queries

**Cortex Search**:
- Managed hybrid search service (semantic + keyword)
- Create a search service over a table, query it with natural language
- Handles chunking, embedding, indexing, and retrieval

**Interview talking point**: "Cortex brings LLM capabilities directly into the SQL layer, which is exactly the vision I built in Nexus-Hive. The key advantage of in-warehouse AI is governance: Cortex functions respect Snowflake's RBAC, masking policies, and audit logging automatically. This solves the governance problem that plagues external LLM integrations."

---

## Cost Optimization Quick Reference

| Strategy | Impact | When to Use |
|----------|--------|-------------|
| Right-size warehouses | High | Monitor query profiles; downsize if average utilization is < 50% |
| Auto-suspend (1-5 min) | Medium | Interactive/ad-hoc workloads |
| Multi-cluster warehouses | Medium | High-concurrency workloads (prefer scale-out over scale-up) |
| Clustering keys | High | Large tables (> 1TB) with selective WHERE clauses |
| Materialized views | Medium | Expensive aggregations run frequently |
| Result cache | High (free) | Ensure queries are deterministic so they hit the cache |
| TRANSIENT/TEMPORARY tables | Low-Med | Staging tables, ETL intermediates (skip fail-safe storage) |
| Resource monitors | Safety net | Set credit quotas per warehouse and alert on threshold |
| Query tagging | Visibility | Tag queries by team/project for cost attribution |

---

## Common Interview Questions about Snowflake

**Q: How does Snowflake handle concurrent reads and writes?**
A: Snowflake uses snapshot isolation (MVCC). Reads see a consistent snapshot of the data as of the transaction start time. Writes create new micro-partitions (copy-on-write). This means readers never block writers and writers never block readers. Concurrent writes to different rows/partitions succeed in parallel; concurrent writes to the same rows use optimistic locking with retry on conflict.

**Q: How does Snowflake differ from Databricks?**
A: Snowflake is a fully managed cloud data warehouse with a proprietary storage format (micro-partitions). Databricks is a lakehouse platform built on open-source (Delta Lake, Spark, MLflow) that gives you more control over the compute layer. Snowflake excels at SQL analytics and data sharing; Databricks excels at complex data engineering and ML workloads. Snowflake is moving toward AI (Cortex); Databricks is moving toward SQL analytics (Databricks SQL). They are converging.

**Q: How would you migrate from a traditional data warehouse to Snowflake?**
A: Phase 1: Migrate the storage (COPY INTO from S3/Azure/GCS). Phase 2: Migrate the compute (rewrite stored procedures, optimize warehouse sizing). Phase 3: Migrate the governance (recreate roles, masking policies, row access policies). Phase 4: Migrate the workloads (retarget BI tools, retrain users). The key challenge is usually governance and workload migration, not the data movement itself.
