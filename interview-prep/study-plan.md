# 2-Week Interview Study Plan -- Doeon Kim

Target: AI Engineer / Solutions Architect at Snowflake, Databricks, Palantir, Big Tech Korea
Start date: Adjust as needed. Each day assumes 6-8 hours of focused study.

---

## Week 1: Foundations + Data Platform Deep Dives

### Day 1 (Monday): System Design Fundamentals I

**Morning (3 hours): Networking and Load Balancing**
- Review TCP/IP, HTTP/2, gRPC fundamentals
- Load balancing strategies: round-robin, least connections, consistent hashing
- Layer 4 vs. Layer 7 load balancing
- DNS-based load balancing and global traffic management
- CDN architecture and edge caching
- Practice: Draw the architecture for a globally distributed API service

**Afternoon (3 hours): Caching**
- Cache strategies: write-through, write-back, write-around, cache-aside
- Cache invalidation: TTL, event-driven, versioned keys
- Distributed caching: Redis Cluster, Memcached
- Cache stampede prevention: locking, probabilistic early expiration
- Multi-tier caching: L1 (in-process), L2 (distributed), L3 (CDN)
- Practice: Design a caching layer for a high-traffic analytics dashboard

**Resources**:
- "Designing Data-Intensive Applications" by Martin Kleppmann, Chapters 1-2
- ByteByteGo System Design Interview guide, Caching chapter
- Redis documentation on cluster architecture

---

### Day 2 (Tuesday): System Design Fundamentals II

**Morning (3 hours): Databases and Storage**
- SQL vs. NoSQL trade-offs (CAP theorem, ACID vs. BASE)
- Database indexing: B-tree, LSM-tree, hash indexes
- Partitioning strategies: range, hash, composite
- Replication: leader-follower, multi-leader, leaderless
- Column-oriented storage (Parquet, ORC) vs. row-oriented
- Time-series databases (InfluxDB, TimescaleDB)
- Practice: Choose and justify a database architecture for a multi-tenant analytics platform

**Afternoon (3 hours): Message Queues and Stream Processing**
- Message queue patterns: point-to-point, pub/sub, competing consumers
- Apache Kafka architecture: partitions, consumer groups, exactly-once semantics
- Stream processing: Kafka Streams, Flink, Spark Structured Streaming
- Event sourcing and CQRS patterns
- Dead letter queues and retry strategies
- Exactly-once vs. at-least-once vs. at-most-once delivery
- Practice: Design a real-time event pipeline for an e-commerce platform

**Resources**:
- "Designing Data-Intensive Applications", Chapters 3-6
- Kafka documentation on exactly-once semantics
- Flink documentation on state management

---

### Day 3 (Wednesday): Snowflake Architecture Deep Dive

**Morning (3 hours): Core Architecture**
- Three-layer architecture: storage, compute, cloud services
- Micro-partitions: columnar storage, automatic clustering, pruning
- Virtual warehouses: T-shirt sizing, auto-suspend, auto-resume, multi-cluster warehouses
- Query processing: metadata-based pruning, result caching, remote disk caching, local disk caching
- Time Travel and Fail-safe: retention periods, storage costs, UNDROP
- Review the cheat-sheets/snowflake-architecture.md file in this prep folder

**Afternoon (3 hours): Advanced Snowflake**
- Data sharing: secure views, reader accounts, data marketplace
- Snowpark: DataFrame API, UDFs, stored procedures in Python/Java/Scala
- Snowflake Cortex: LLM functions (COMPLETE, EXTRACT, SENTIMENT), vector search
- Row-level security, column-level masking, data governance features
- Cost optimization: warehouse sizing, clustering keys, materialized views
- Practice: Design a governed multi-tenant analytics platform on Snowflake (reference system-design-questions.md Q1)

**Resources**:
- Snowflake documentation: Architecture overview, Micro-partitions, Virtual Warehouses
- SnowPro Core study guide
- Snowflake engineering blog posts on query optimization

---

### Day 4 (Thursday): Databricks Architecture Deep Dive

**Morning (3 hours): Core Architecture**
- Lakehouse architecture: combining data lake flexibility with warehouse reliability
- Delta Lake internals: transaction log, ACID transactions, schema enforcement/evolution
- Unity Catalog: three-level namespace, data lineage, access control
- Photon engine: vectorized query engine, columnar processing
- Databricks SQL Warehouses: serverless, pro, classic
- Review the cheat-sheets/databricks-architecture.md file in this prep folder

**Afternoon (3 hours): Advanced Databricks**
- MLflow: experiment tracking, model registry, model serving
- Mosaic AI: Model serving, AI Gateway, Vector Search, Agent Framework
- Delta Live Tables: declarative pipelines, expectations (quality gates), auto-scaling
- Structured Streaming: triggers, watermarks, state management
- Cost optimization: spot instances, auto-scaling policies, photon acceleration
- Practice: Design a lakehouse with quality guarantees on Databricks (reference system-design-questions.md Q2)

**Resources**:
- Databricks documentation: Lakehouse architecture, Delta Lake internals, Unity Catalog
- Databricks Platform Architect certification study guide
- Delta Lake VLDB paper (Armbrust et al.)

---

### Day 5 (Friday): LLM Systems Fundamentals

**Morning (3 hours): LLM Inference and Serving**
- Transformer architecture refresher: attention mechanism, KV cache
- Inference optimization: quantization (INT8, INT4, GPTQ, AWQ), KV cache optimization
- Serving systems: vLLM (PagedAttention), TGI, TensorRT-LLM
- Batching strategies: continuous batching, dynamic batching
- Multi-GPU serving: tensor parallelism, pipeline parallelism
- Latency vs. throughput trade-offs in LLM serving
- Practice: Design an LLM serving infrastructure for 1000 concurrent users

**Afternoon (3 hours): RAG Patterns**
- Chunking strategies: fixed-size, semantic, recursive character splitting
- Embedding models: OpenAI ada, Cohere embed, open-source (BGE, E5)
- Vector databases: Pinecone, Qdrant, pgvector, Chroma
- Retrieval strategies: dense retrieval, sparse (BM25), hybrid (reciprocal rank fusion)
- Reranking: cross-encoder reranking, Cohere rerank
- Advanced RAG: query rewriting, HyDE, self-RAG, multi-hop retrieval
- Practice: Design an enterprise RAG system (reference system-design-questions.md Q7)

**Resources**:
- vLLM paper: "Efficient Memory Management for Large Language Model Serving with PagedAttention"
- LangChain documentation on RAG patterns
- MTEB leaderboard for embedding model comparison

---

### Day 6 (Saturday): LLM Application Patterns

**Morning (3 hours): Agents and Tool Calling**
- Agent architectures: ReAct, Plan-and-Execute, LATS
- Tool calling: function calling APIs (OpenAI, Claude), structured output
- Multi-agent systems: LangGraph, AutoGen, CrewAI
- State management in agent systems
- Error handling and reliability (directly from your stage-pilot experience)
- Practice: Walk through stage-pilot architecture (reference technical-deep-dive.md)

**Afternoon (3 hours): LLM Evaluation and Governance**
- Evaluation frameworks: LM Eval Harness, HELM, custom eval suites
- Metrics: accuracy, hallucination rate, toxicity, latency, cost
- Benchmark suites: MMLU, HumanEval, BFCL (you have experience here)
- LLM governance: input/output guardrails, PII detection, prompt injection defense
- Red teaming and adversarial testing
- Practice: Walk through enterprise-llm-adoption-kit architecture (reference technical-deep-dive.md)

**Resources**:
- BFCL paper and leaderboard (directly relevant to your tool-call-finetune-lab)
- NeMo Guardrails documentation
- Anthropic's Constitutional AI paper

---

### Day 7 (Sunday): Practice Day I -- System Design Mock

**Morning (3 hours): Mock Interview Practice**
- Pick 3 questions from system-design-questions.md
- For each, set a 35-minute timer and practice the full flow:
  - 3 min: requirements gathering (talk out loud)
  - 2 min: API/interface definition
  - 5 min: draw high-level architecture (use paper or whiteboard app)
  - 15 min: deep dive on 2-3 components
  - 5 min: scale and trade-offs
  - 2 min: connect to your project experience
  - 3 min: self-evaluation (what went well, what was unclear)

**Afternoon (3 hours): Review and Fill Gaps**
- Review notes from the week
- Identify topics where you felt uncertain during mock practice
- Deep-read documentation for those specific topics
- Update your answers in system-design-questions.md if you find better approaches

---

## Week 2: Advanced Topics + Interview Practice

### Day 8 (Monday): Distributed Systems Patterns

**Morning (3 hours): Consistency and Consensus**
- Consistency models: strong, eventual, causal, read-your-writes
- Consensus protocols: Raft, Paxos (conceptual), ZAB
- Distributed transactions: 2PC, Saga pattern, outbox pattern
- Conflict resolution: last-writer-wins, vector clocks, CRDTs
- Linearizability vs. serializability
- Practice: How would you ensure consistency in a multi-region analytics platform?

**Afternoon (3 hours): Observability and Reliability**
- Monitoring: metrics (Prometheus), logging (ELK), tracing (Jaeger, OpenTelemetry)
- SLOs, SLIs, and error budgets
- Circuit breaker pattern
- Graceful degradation strategies
- Chaos engineering principles
- Incident response and post-mortem culture
- Practice: Design an observability stack for an LLM-powered application

**Resources**:
- "Designing Data-Intensive Applications", Chapters 7-9
- Google SRE Book, Chapters on SLOs and error budgets

---

### Day 9 (Tuesday): Data Mesh and Data Governance

**Morning (3 hours): Data Mesh Architecture**
- Four principles: domain ownership, data as a product, self-serve platform, federated governance
- Data product design: input ports, output ports, discovery, observability
- Federated query engines: Trino/Presto, Dremio, Starburst
- Data contracts: schema, SLA, quality, semantics
- Practice: Design a distributed query engine for a data mesh (reference system-design-questions.md Q10)

**Afternoon (3 hours): Data Governance Patterns**
- Data classification: sensitivity tiers, automated classification
- Access control: RBAC, ABAC, row-level security, column-level masking
- Data lineage: tracking data provenance from source to consumption
- Data catalog: metadata management, search, discovery
- Compliance: GDPR (right to delete, data portability), CCPA, SOX
- Practice: How would you implement governance in Nexus-Hive for a GDPR-compliant environment?

**Resources**:
- "Data Mesh" by Zhamak Dehghani (key chapters on principles and architecture)
- Snowflake and Databricks governance documentation

---

### Day 10 (Wednesday): ML Systems and MLOps

**Morning (3 hours): Feature Engineering and Feature Stores**
- Feature store architecture: online vs. offline store
- Point-in-time correctness: preventing data leakage in training
- Feature serving: low-latency key-value lookups
- Feature monitoring: drift detection, staleness alerts
- Practice: Design a feature store (reference system-design-questions.md Q6)

**Afternoon (3 hours): ML Pipeline and Model Serving**
- Training pipelines: data validation, training, evaluation, deployment
- Model serving patterns: batch, real-time, edge
- A/B testing for ML models: canary deployments, shadow mode
- Model monitoring: data drift, concept drift, prediction drift
- Practice: Design a CI/CD pipeline for ML models (reference system-design-questions.md Q9)

**Resources**:
- "Designing Machine Learning Systems" by Chip Huyen, Chapters 7-10
- Feast (feature store) documentation
- MLflow documentation

---

### Day 11 (Thursday): Palantir Foundry + Cloud Native Patterns

**Morning (3 hours): Palantir Foundry**
- Foundry architecture: data connection, pipeline builder, ontology, applications
- Ontology: object types, properties, links, actions
- Pipeline builder: transforms, incremental computation, branching
- Data integration patterns: file-based, API-based, streaming
- AIP (Artificial Intelligence Platform): LLM integration in Foundry
- Practice: How would you build Nexus-Hive's governance layer using Foundry's ontology?

**Afternoon (3 hours): Cloud Native and Kubernetes**
- Container orchestration: Kubernetes pods, deployments, services
- Namespace-based multi-tenancy
- Resource quotas and limit ranges
- Horizontal Pod Autoscaler and Vertical Pod Autoscaler
- Service mesh: Istio, Envoy (traffic management, observability, security)
- Serverless patterns: Lambda/Cloud Functions for event-driven pipelines
- Practice: Design a multi-tenant AI platform on Kubernetes (reference system-design-questions.md Q8)

**Resources**:
- Palantir Foundry documentation and certification materials
- Kubernetes documentation on resource management and multi-tenancy

---

### Day 12 (Friday): Behavioral Interview Practice

**Morning (3 hours): Behavioral Story Rehearsal**
- Read through behavioral-questions.md
- For each of the 15 stories, practice telling it out loud in 2-3 minutes
- Time yourself. STAR stories should not exceed 3 minutes.
- Focus on: clear situation setup, specific actions YOU took, quantified results
- Practice transitions: "That reminds me of a related experience..." for follow-up questions

**Afternoon (3 hours): Company Research**
- For each target company, research:
  - Recent product announcements and strategy
  - Key technical blog posts from the engineering team
  - The company's approach to AI/LLM integration
  - Competitors and differentiation
  - For Snowflake: Cortex AI, Snowpark Container Services, Iceberg support
  - For Databricks: Mosaic AI, Unity Catalog evolution, Delta Lake UniForm
  - For Palantir: AIP, Foundry for Builders, government vs. commercial
  - For Big Tech Korea: AI initiatives, data platform investments

---

### Day 13 (Saturday): Practice Day II -- Full Mock Interviews

**Morning (3 hours): System Design Mock (45 minutes)**
- Choose a question you have NOT practiced yet from system-design-questions.md
- Full 45-minute mock:
  - Requirements (3 min)
  - API design (3 min)
  - High-level architecture (7 min)
  - Deep dive (20 min)
  - Scale + trade-offs (7 min)
  - Connect to experience (5 min)

**Midday (1.5 hours): Technical Deep Dive Mock (30 minutes)**
- Practice the 5-minute explanation of one project from technical-deep-dive.md
- Then have someone (or simulate) ask follow-up questions for 25 minutes
- Focus on going one level deeper without getting lost in implementation minutiae

**Afternoon (1.5 hours): Behavioral Mock (30 minutes)**
- Practice 5 behavioral stories from behavioral-questions.md
- Focus on: conciseness (< 3 min each), specificity (names, numbers, dates), and the "so what" (why does this story matter for this role?)

---

### Day 14 (Sunday): Final Review and Rest

**Morning (2 hours): Gap Review**
- Review all notes and identify remaining weak areas
- For each weak area, write a one-paragraph summary explaining the concept in your own words
- Review all cheat sheets one final time

**Midday (1 hour): Logistics and Mental Prep**
- Confirm interview schedule, timezone, and platform (Zoom, Google Meet, etc.)
- Test your camera, microphone, and screen sharing
- Prepare your workspace: quiet room, whiteboard or drawing tool, water
- Have copies of your resume and project descriptions accessible

**Afternoon: REST**
- Exercise, relax, sleep well
- Do not study new material the night before an interview
- Trust your preparation

---

## Daily Habits (Throughout Both Weeks)

### Morning Routine (15 minutes)
- Review one system design question from system-design-questions.md
- Sketch the architecture from memory on paper
- Check: can you explain each component's responsibility in one sentence?

### Evening Routine (15 minutes)
- Journal: what did you learn today? What was confusing?
- Update study materials with any new insights
- Review one behavioral story from behavioral-questions.md

### Ongoing Practice
- Explain concepts out loud as if to an interviewer (not just in your head)
- Draw architectures by hand -- muscle memory helps during the real interview
- When you read about a technology, always ask: "How would I explain this in an interview? How does this connect to my projects?"

---

## Key Resources Summary

### Books
- "Designing Data-Intensive Applications" by Martin Kleppmann -- the system design bible
- "Designing Machine Learning Systems" by Chip Huyen -- ML system design
- "System Design Interview" by Alex Xu (Vol 1 and 2) -- practice problems

### Papers
- Delta Lake: "Delta Lake: High-Performance ACID Table Storage over Cloud Object Stores" (VLDB 2020)
- vLLM: "Efficient Memory Management for Large Language Model Serving with PagedAttention"
- BFCL: Berkeley Function Calling Leaderboard paper

### Online
- ByteByteGo (YouTube and newsletter) -- system design patterns
- Snowflake documentation and engineering blog
- Databricks documentation and engineering blog
- Palantir Foundry documentation

### Certification Materials (Already Completed)
- SnowPro Core -- review exam topics as refresher
- Databricks Platform Architect -- review exam topics as refresher
- Palantir Foundry -- review exam topics as refresher
