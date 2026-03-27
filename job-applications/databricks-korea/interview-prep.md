# Interview Preparation: Databricks Solutions Architect

## Interview Format Overview

Databricks SA interviews typically include:
1. **Recruiter Screen** (30 min) - Background, motivation, role understanding
2. **Hiring Manager Interview** (45-60 min) - Technical background + leadership + cultural fit
3. **Technical Deep Dive** (60 min) - Lakehouse architecture, Spark, Delta Lake, SQL
4. **Architecture Design / Whiteboard** (60 min) - Design a Lakehouse solution for a given scenario
5. **Customer Scenario / Presentation** (45-60 min) - Present or role-play a customer engagement
6. **Values Interview** (30 min) - Databricks culture and values alignment

---

## Topic 1: Lakehouse Architecture

**Common Questions:**
- What is the Lakehouse paradigm and how does it differ from data warehouses and data lakes?
- Explain the medallion architecture. When would you use it?
- How does Delta Lake solve the reliability problems of data lakes?

**Doeon's Talking Points:**
- lakehouse-contract-lab is a direct demonstration: "I built a complete medallion pipeline where Bronze ingests raw data with schema detection, Silver applies cleansing and conformity rules with data contract validation, and Gold produces business-ready aggregates. Each transition enforces a contract that checks schema compatibility and data quality thresholds before allowing data to promote."
- "Delta Lake's ACID transactions were critical in lakehouse-contract-lab. When a data contract violation occurs at the Silver stage, the transaction rolls back cleanly without corrupting downstream tables. I also used time travel to enable contract versioning, where you can query a table as it existed under a previous contract version."
- Discuss why Lakehouse matters: unifying batch and streaming, eliminating data silos, reducing data copy sprawl.

**Key Concepts to Review:**
- Delta Lake internals: transaction log, optimistic concurrency, file compaction (OPTIMIZE, ZORDER)
- Photon engine and query acceleration
- Delta Sharing for open data exchange
- Lakehouse vs. traditional warehouse vs. data lake comparison

---

## Topic 2: Unity Catalog and Data Governance

**Common Questions:**
- How does Unity Catalog provide governance across the Databricks platform?
- Explain the Unity Catalog namespace model.
- How would you design a multi-team data governance strategy?

**Doeon's Talking Points:**
- Nexus-Hive integration: "In Nexus-Hive, I programmatically navigate Unity Catalog's three-level namespace: catalog, schema, table. The system discovers available tables based on the user's permissions, which means a marketing analyst only sees marketing data when they query in natural language. This required deep integration with Unity Catalog's information schema and permission model."
- enterprise-llm-adoption-kit governance: "For the LLM adoption framework, I designed a governance model where Unity Catalog enforces data access policies. Every model training run logs which data it accessed, creating an audit trail that satisfies compliance teams."
- Discuss lineage tracking, data classification, and attribute-based access control.

**Key Concepts to Review:**
- Unity Catalog metastore, catalog, schema, table/view/function hierarchy
- External locations and storage credentials
- Data lineage and audit logging
- Row-level and column-level security
- Lakehouse Federation for querying external data sources

---

## Topic 3: MLflow and AI/ML Workflows

**Common Questions:**
- How would you design an ML pipeline on Databricks?
- What is MLflow and how does it fit into the ML lifecycle?
- How would you help a customer adopt AI/ML responsibly?

**Doeon's Talking Points:**
- enterprise-llm-adoption-kit is the primary reference: "I built an MLflow-based tracking system specifically for LLM workflows. Each experiment logs the prompt template version, model parameters (temperature, max tokens, system prompt), and evaluation metrics (accuracy, latency, cost). The model registry manages the promotion pipeline from staging to production with approval gates."
- "One challenge I solved was tracking prompt engineering iterations. Traditional MLflow is designed for numeric parameters, so I extended the logging approach to capture full prompt templates as artifacts, with semantic similarity metrics for evaluation. This gives teams a reproducible record of why one prompt version outperformed another."
- Discuss Mosaic AI, Feature Store, Model Serving, and how they connect.

**Key Concepts to Review:**
- MLflow components: Tracking, Projects, Models, Model Registry
- Databricks Model Serving endpoints
- Feature Store and feature engineering
- Mosaic AI and Foundation Model APIs
- Responsible AI practices: bias detection, model monitoring, explainability

---

## Topic 4: Architecture Design / Whiteboard

**Common Scenario Types:**
- "Design a real-time analytics platform for an e-commerce company"
- "Architect a data governance solution for a financial services firm"
- "Build an ML pipeline for a manufacturing quality prediction system"

**Doeon's Framework for Architecture Design:**

1. **Clarify Requirements** (3-5 min): Ask about data volume, velocity, variety; user personas; compliance requirements; existing infrastructure; success metrics.

2. **High-Level Architecture** (5 min): Draw the Lakehouse layers. Identify data sources, ingestion (batch vs. streaming), medallion stages, serving layer, and consumption patterns.

3. **Deep Dive on Key Components** (10-15 min):
   - Delta Lake for storage with ACID guarantees
   - Unity Catalog for governance
   - Databricks SQL for BI workloads
   - MLflow for ML workloads
   - Delta Sharing for external data exchange

4. **Governance and Security** (5 min): Unity Catalog access policies, network security, encryption, audit logging.

5. **Operationalization** (5 min): Monitoring (Datadog integration, a personal strength), alerting, SLA management, cost optimization.

**Practice Scenario: Financial Services Data Platform**
- Ingest transaction data (streaming via Kafka), customer data (batch), market data (API)
- Bronze: raw ingestion with schema detection
- Silver: cleansed transactions, PII masking via Unity Catalog column-level security
- Gold: risk aggregates, customer 360, regulatory reports
- ML layer: fraud detection model trained and served via MLflow
- Governance: Unity Catalog for access control, lineage for regulatory audit

---

## Topic 5: Customer Engagement Scenarios

**Common Questions:**
- How would you handle a customer evaluating Databricks against Snowflake?
- A customer's Spark jobs are running slowly. How do you approach this?
- How would you guide a customer through their first Unity Catalog deployment?

**Doeon's Talking Points:**
- Competitive positioning: "I hold certifications in both Databricks and Snowflake and have built projects on both platforms. This gives me genuine perspective on each platform's strengths. Databricks excels in unified analytics, where a single platform handles ETL, SQL analytics, ML, and real-time processing. I would focus on the use cases where this unification creates value rather than disparaging the alternative."
- Performance troubleshooting: "My Datadog Observability certification and the monitoring layer in enterprise-llm-adoption-kit give me a systematic approach to performance diagnosis. I would start with the Spark UI to identify skew, spill, or shuffle bottlenecks, then check cluster sizing, and review query plans."
- Unity Catalog migration: "In Nexus-Hive, I designed the Unity Catalog integration from scratch. I would walk the customer through a phased approach: start with a single catalog for a pilot team, establish naming conventions and access policies, then expand."

---

## Topic 6: Databricks Ecosystem and Market Position

**Key Topics to Discuss:**
- Data Intelligence Platform vision
- Mosaic AI and foundation models
- Delta Sharing as an open protocol
- Databricks Marketplace
- Lakehouse Federation
- Open source commitment (Delta Lake, MLflow, Apache Spark)
- Korean market: manufacturing (Samsung, LG, Hyundai), financial services, telecom

**Doeon's Angle:**
- "Databricks' commitment to open source resonates with me. I published stage-pilot as open-source software because I believe in building on open standards. Delta Lake, MLflow, and Spark being open source is a genuine competitive advantage."
- "Korean enterprises, especially in manufacturing and financial services, need a platform that handles both massive-scale ETL and advanced ML. The Lakehouse architecture is uniquely positioned for this because it eliminates the need to move data between a lake and a warehouse."

---

## Behavioral Interview (STAR Format Preparation)

### Situation: Solving a cross-platform challenge
- **S:** Building Nexus-Hive to support both Snowflake and Databricks
- **T:** Needed to generate correct, optimized SQL for two fundamentally different platforms
- **A:** Studied both platforms deeply (earning certifications), designed an adapter pattern that abstracts platform differences, built comprehensive test suites for each dialect
- **R:** Working dual-platform support; the architecture is extensible to additional platforms

### Situation: Driving adoption of a new approach
- **S:** enterprise-llm-adoption-kit: many teams wanted to use LLMs but lacked governance
- **T:** Create a framework that enables AI adoption without compromising security
- **A:** Designed MLflow-based experiment tracking, Unity Catalog governance, and clear deployment gates
- **R:** Framework provides a repeatable playbook for enterprise AI adoption

### Situation: Leading through ambiguity
- **S:** Network security team lead, first month on the job
- **T:** Inherited a team with no documented procedures and inconsistent practices
- **A:** Created standardized incident response playbooks, established daily briefing cadence, built a knowledge base
- **R:** Team response time improved; procedures adopted as the unit standard

### Situation: Rapid learning in unfamiliar environment
- **S:** Starting internship at ATOM TECH SOLUTIONS in Berkeley
- **T:** Needed to contribute meaningfully in a foreign work environment and unfamiliar codebase
- **A:** Proactively sought code reviews, asked clarifying questions, shipped stage-pilot as a contribution beyond assigned tasks
- **R:** Published npm package during internship; established credibility for increasingly complex assignments

---

## Questions to Ask the Interviewer

1. "What does the typical customer engagement lifecycle look like for an SA at Databricks Korea? How much of the role is pre-sales architecture design versus post-sales enablement?"
2. "Which industries are driving the most Databricks adoption in Korea right now? Are there specific verticals where the Korea team is focusing?"
3. "How does Databricks Korea collaborate with the global SA community? Is there a structured knowledge-sharing process?"
4. "With Mosaic AI and the Data Intelligence Platform direction, how is the SA role evolving to support AI-centric customer conversations?"
5. "What does the onboarding and enablement path look like for a new SA? Is there a formal certification or training program?"
6. "How does Databricks differentiate in the Korean market specifically? Are there local partnerships or ecosystem plays that are unique to Korea?"
