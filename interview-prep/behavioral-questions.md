# Behavioral Interview Questions -- Doeon Kim

STAR Format: Situation, Task, Action, Result
Target roles: AI Engineer, Solutions Architect
Target companies: Snowflake, Databricks, Palantir, Big Tech Korea

---

## 1. Tell me about a time you solved a difficult technical problem.

**Topic: Improving tool-calling reliability from 25% to 90% (stage-pilot)**

**Situation**: I was building an AI agent platform where LLMs needed to invoke external tools (APIs, database queries, code execution). The native tool-calling capability of the models we were using had a success rate of only about 25% -- three out of four calls would fail due to malformed JSON, wrong parameter types, hallucinated function names, or missing required fields. This made the agent platform effectively unusable for production workloads.

**Task**: I needed to design and build a middleware layer that could sit between the LLM and the tool execution layer, dramatically improving reliability without switching to a more expensive model or re-training from scratch.

**Action**: I systematically analyzed hundreds of failed tool calls to categorize the failure modes. I discovered that roughly 70% of failures fell into predictable categories: type mismatches (string where int was expected), missing required fields that had obvious defaults, hallucinated enum values that were close to valid ones, and malformed JSON that was recoverable. I built a four-stage middleware pipeline:
1. A schema compiler that transformed tool definitions into model-optimized prompt formats, reducing ambiguity.
2. A robust output parser that could extract structured data from various malformed outputs using JSON recovery heuristics.
3. An auto-repair engine that fixed common errors without re-querying the LLM -- type coercion, default injection, fuzzy enum matching.
4. A retry controller that, when auto-repair failed, sent structured error feedback back to the LLM with specific field-level error messages rather than generic "try again" prompts.

**Result**: The middleware improved tool-calling reliability from 25% to 90%. The auto-repair engine alone recovered about 40% of initially invalid calls without any additional LLM cost. The structured error feedback in the retry loop increased the success rate of retried calls from ~30% (with generic error messages) to ~75%. The system is now the reliability layer for the agent platform, handling thousands of tool calls daily.

---

## 2. Describe a project where you had to work with ambiguous requirements.

**Topic: Designing the multi-agent NL-to-SQL pipeline (Nexus-Hive)**

**Situation**: I was tasked with building a natural-language-to-SQL system for enterprise use. The initial brief was vague: "business users should be able to ask questions in English and get answers from the data warehouse." There was no specification for which warehouses to support, what governance looked like, how to handle ambiguous queries, or what accuracy standard was acceptable.

**Task**: I needed to turn this ambiguous vision into a concrete, shippable architecture that would satisfy both the business users (simplicity) and the data governance team (security and compliance).

**Action**: I started by interviewing three stakeholder groups: business analysts (to understand their pain points), the data platform team (to understand the warehouse landscape), and the compliance team (to understand governance requirements). From these conversations, I synthesized a requirements document that defined: multi-warehouse support (Snowflake, BigQuery, DuckDB), RBAC-based governance with column-level and row-level access policies, audit logging for compliance, and a target accuracy of 85% on a golden test set.

I then designed the multi-agent architecture using LangGraph: an orchestrator agent for intent classification and routing, a schema agent for resolving business terms to physical columns, a SQL generation agent, and a governance agent that enforced access policies before execution. I built iteratively, starting with a single-warehouse prototype and expanding to multi-warehouse support after validating the core pipeline.

**Result**: The system successfully supports governed NL-to-SQL across multiple warehouses. The multi-agent decomposition proved critical because it allowed each concern (schema resolution, SQL generation, governance) to be independently tested and improved. The governance agent intercepts and enforces policies on every query, giving the compliance team confidence to approve the system for production use.

---

## 3. Tell me about a time you led a team under pressure.

**Topic: Military service -- leading a network security team**

**Situation**: During my mandatory military service in South Korea, I was assigned as a team leader for a network security operations unit. We were responsible for 24/7 monitoring and defense of critical communications infrastructure. The unit was understaffed -- we had roughly 60% of the recommended headcount -- and the remaining team members had varying levels of technical skill.

**Task**: I needed to maintain continuous 24/7 network security coverage with a skeleton crew while also training junior team members and improving our response procedures.

**Action**: I restructured the shift rotation to pair experienced operators with junior members during high-threat windows, creating a mentorship-while-operating model. I documented our incident response procedures into runbooks -- previously they existed only as tribal knowledge in senior members' heads. I automated several routine monitoring tasks using scripts, which freed up about 30% of each operator's time for proactive threat analysis rather than just reactive monitoring. When we faced a particularly intense period with elevated threat levels, I personally took double shifts for two weeks to ensure coverage while getting new team members up to speed.

**Result**: Despite being understaffed, the unit maintained zero critical security incidents during my leadership tenure. The runbooks I created became the standard operating procedure for subsequent rotations. The automation scripts reduced alert fatigue by filtering out false positives, improving our true positive detection rate. Three junior team members I mentored went on to lead their own sub-teams.

---

## 4. Tell me about a time you failed and what you learned.

**Topic: First attempt at LLM fine-tuning with limited GPU budget**

**Situation**: When I started the tool-call-finetune-lab project, I was working with a limited GPU budget and wanted to fine-tune a model to improve tool-calling capabilities. My initial approach was to do a full fine-tune on the largest model I could afford.

**Task**: Fine-tune a model to improve performance on the BFCL (Berkeley Function Calling Leaderboard) benchmark within a constrained compute budget.

**Action**: In my first attempt, I used a relatively large base model and tried to fine-tune all parameters. I burned through most of my GPU budget on a single training run that took longer than expected. The resulting model showed only marginal improvement on the BFCL benchmark -- maybe a 3-4% gain -- because the training data I had curated was not diverse enough and the hyperparameters were not well-tuned. I had spent my budget on one shot and it didn't work.

**Result of failure**: The first run was essentially wasted compute. I had to step back and rethink my approach entirely.

**What I learned and did differently**: I pivoted to a more disciplined methodology:
1. I switched to LoRA (parameter-efficient fine-tuning) which reduced compute cost by roughly 10x per experiment.
2. I invested time in data curation before training: analyzing the failure modes from stage-pilot to create a targeted training dataset focused on the specific tool-calling patterns where models struggle.
3. I ran many small experiments to tune hyperparameters before committing to a full training run.
4. I established the BFCL evaluation pipeline first, so every experiment could be quantitatively measured against the benchmark.

The revised approach yielded significantly better results at a fraction of the cost. The lesson was: when resources are constrained, invest in experiment infrastructure (fast eval loops, efficient fine-tuning) before investing in compute. This is a lesson I now apply to every ML project.

---

## 5. Describe a time you had to convince others of a technical decision.

**Topic: Advocating for the multi-agent architecture over a monolithic LLM approach**

**Situation**: When designing Nexus-Hive, there was an initial push to use a single large LLM with a complex system prompt to handle everything: schema resolution, SQL generation, governance checks, and result formatting. The argument was simplicity -- one model, one prompt, one call.

**Task**: I believed a multi-agent architecture (separate specialized agents orchestrated by LangGraph) was superior for this use case, but I needed to convince the team with evidence, not just opinion.

**Action**: I built two prototypes over a weekend. The first was the monolithic approach: a single GPT-4 call with a massive system prompt containing schema info, governance rules, few-shot examples, and output formatting instructions. The second was a minimal multi-agent pipeline: orchestrator -> schema resolver -> SQL generator -> governance checker.

I ran both against a test set of 50 natural-language queries spanning simple lookups, multi-table joins, and governance edge cases (user asks about a restricted column). I measured: correctness (does the SQL return the right answer?), governance compliance (does it respect access policies?), latency, and cost.

**Result**: The monolithic approach achieved 62% correctness and 45% governance compliance -- it frequently "forgot" governance rules when the prompt got long. The multi-agent approach achieved 81% correctness and 94% governance compliance. Latency was slightly higher (2.8s vs. 1.9s) but well within acceptable bounds. Cost per query was actually lower because the multi-agent approach used smaller, targeted prompts for each step rather than one massive prompt.

I presented these results in a 15-minute demo. The data made the decision obvious. The team adopted the multi-agent architecture, and we further improved correctness to 88% through iterative prompt engineering on individual agents.

---

## 6. Tell me about a time you shipped something quickly with high quality.

**Topic: Shipping 23 projects with CI/CD and tests**

**Situation**: Over the course of building my portfolio for AI Engineer and Solutions Architect roles, I set an ambitious goal: build and ship a comprehensive portfolio of projects covering the full stack of modern data and AI platforms -- from lakehouse pipelines to LLM fine-tuning to multi-agent systems -- all with production-quality engineering practices.

**Task**: Ship a large number of projects quickly while maintaining quality standards: every project needed CI/CD pipelines, automated tests, documentation, and reproducible environments.

**Action**: I established a personal engineering discipline:
- Every project started with a Makefile and a CI/CD pipeline (GitHub Actions) before any feature code was written.
- I used a consistent project template: pyproject.toml for dependencies, pytest for tests, ruff for linting, pre-commit hooks for code quality.
- I wrote tests alongside the feature code, not after. For data pipeline projects (lakehouse-contract-lab), tests included schema validation, data quality assertions, and pipeline integration tests. For LLM projects (stage-pilot), tests included mock LLM responses to verify middleware behavior deterministically.
- I timebox-ed each project: define the scope, build the core, test it, ship it, move on. Avoided scope creep by maintaining a strict "minimum viable demonstration" standard.

**Result**: Shipped 23 projects, all with CI/CD and test suites. This discipline paid off concretely: when I revisited stage-pilot to add new features, the existing test suite caught three regressions that would have been shipped without tests. The consistent engineering practices also made it easy for others to understand and evaluate any project -- clean READMEs, reproducible setups, and passing CI badges.

---

## 7. How do you handle disagreements with teammates?

**Topic: Schema resolution strategy debate in Nexus-Hive**

**Situation**: While building Nexus-Hive, there was a disagreement about how to resolve ambiguous business terms to physical database columns. One approach was to use a fixed mapping table (manually curated). The other approach, which I favored, was to use embedding-based semantic similarity with a curated catalog as the index.

**Task**: Resolve the disagreement in a way that produced the best technical outcome without damaging the working relationship.

**Action**: Rather than debating theoretically, I proposed we define the evaluation criteria first, then test both approaches against those criteria. We agreed on three criteria: accuracy on a set of 100 ambiguous terms, maintenance burden (how much work to keep it updated), and latency.

I built the embedding-based approach; the other team member built the mapping table approach. We tested both on the same 100 terms. The mapping table was 95% accurate on known terms but 0% on new terms (it couldn't generalize). The embedding approach was 87% accurate overall but handled new/unseen terms gracefully.

**Result**: We ended up with a hybrid: the mapping table for high-confidence exact matches (fast, deterministic), with the embedding approach as a fallback for unmatched terms. This was better than either approach alone. The key lesson was that framing disagreements as testable hypotheses removes ego from the decision and often produces a superior hybrid solution.

---

## 8. Describe your approach to learning a new technology quickly.

**Topic: Earning three platform certifications (SnowPro, Databricks, Palantir Foundry)**

**Situation**: To be credible as a Solutions Architect targeting data platform companies, I needed deep knowledge of Snowflake, Databricks, and Palantir Foundry architectures -- not surface-level familiarity, but certification-level depth.

**Task**: Earn the SnowPro Core, Databricks Platform Architect, and Palantir Foundry certifications while also building portfolio projects.

**Action**: My approach for each certification followed a pattern:
1. **Read the architecture docs first**: Before touching any practice exams, I read the platform's architecture documentation end-to-end. For Snowflake, this meant understanding micro-partitions, virtual warehouses, data sharing, and the query optimization engine. For Databricks, it meant Unity Catalog, Delta Lake internals, Photon engine, and the Lakehouse architecture.
2. **Build something with it**: Theory without practice doesn't stick. For each platform, I built a real project: lakehouse-contract-lab for Databricks, Nexus-Hive's Snowflake adapter for SnowPro. Building revealed the gaps in my understanding.
3. **Teach it back**: I wrote detailed notes explaining each concept as if teaching someone else. This forced clarity. If I couldn't explain micro-partitions in simple terms, I didn't understand them yet.
4. **Practice exams last**: Only after building and teaching did I do practice exams. By that point, the pass rate was high because the knowledge was grounded in real experience.

**Result**: Passed all three certifications. More importantly, the knowledge is practical, not just theoretical -- I can discuss Snowflake's micro-partition pruning or Databricks' Z-ordering in the context of actual pipeline optimization decisions I have made.

---

## 9. Tell me about a time you had to make a trade-off between speed and quality.

**Topic: Deciding on the governance enforcement strategy for Nexus-Hive**

**Situation**: In Nexus-Hive, I faced a design decision for the governance agent. The "fast" approach was to have the LLM generate SQL and then post-validate it against access policies. The "thorough" approach was to inject governance constraints into the SQL generation process itself, so the generated SQL was always compliant by construction.

**Task**: Choose an approach that balanced development speed (we had a deadline) with governance reliability (the whole point of the system).

**Action**: I analyzed the failure modes. Post-validation was faster to build but had a critical flaw: when the LLM generated a query referencing a restricted column, post-validation would reject it entirely, leaving the user with no answer. The user experience was terrible: "sorry, you can't ask that." The by-construction approach was harder to build but would generate a query that automatically excluded restricted columns or applied row filters, giving the user a partial but correct answer.

I chose the by-construction approach despite the longer development time. I made this tractable by scoping the governance rules to the most common cases (column-level access and row-level filters) and deferring more complex rules (data masking, aggregation-only access) to a later iteration.

**Result**: The by-construction approach was worth the extra development time. Users got answers that respected their access level without being blocked entirely. The governance compliance rate was 94% (vs. an estimated 70-80% for post-validation based on my prototype testing). The deferred rules (masking, aggregation-only) were added in a subsequent iteration without redesigning the architecture.

---

## 10. How do you prioritize when you have multiple competing projects?

**Topic: Managing the portfolio build across 23 projects**

**Situation**: When building my portfolio, I had to decide the order and priority of 23 projects across several domains: data pipelines, LLM applications, fine-tuning, and governance frameworks. Each project had dependencies on others and varying levels of impact for my target roles.

**Task**: Prioritize and sequence the projects to maximize learning velocity and portfolio impact within a constrained timeline.

**Action**: I used a dependency graph and impact matrix:
1. **Dependency graph**: Some projects naturally came first. The lakehouse-contract-lab (data pipeline fundamentals) had to precede Nexus-Hive (which queries data from a lakehouse). Stage-pilot (tool-calling middleware) had to precede tool-call-finetune-lab (which fine-tunes to improve tool calling).
2. **Impact matrix**: I ranked each project on two axes: relevance to target roles (AI Engineer, Solutions Architect) and differentiation (does this project make me stand out?). High-impact, high-differentiation projects (stage-pilot, Nexus-Hive, enterprise-llm-adoption-kit) got priority.
3. **Timeboxing**: Each project got a strict timebox. If I couldn't finish the "ideal" scope in the timebox, I shipped the MVP and moved on. Better to have 23 solid projects than 10 perfect ones and 13 unfinished.

**Result**: The sequencing was effective. Early projects (lakehouse-contract-lab, stage-pilot) built foundations that later projects (Nexus-Hive, enterprise-llm-adoption-kit) leveraged directly -- both technically and narratively. The dependency graph prevented wasted work, and the timeboxing prevented scope creep. All 23 projects shipped with CI/CD and tests.

---

## 11. Tell me about a time you improved a process or system significantly.

**Topic: Automating quality gates in the lakehouse pipeline**

**Situation**: In the lakehouse-contract-lab project, the initial pipeline ran Bronze -> Silver -> Gold transformations without automated quality checks. Data quality issues in the bronze layer would propagate silently through silver and gold, only being discovered when a downstream dashboard showed incorrect numbers.

**Task**: Implement automated quality gates at each layer that would catch data issues at the earliest possible stage and prevent bad data from propagating.

**Action**: I designed a three-tier quality gate system:
- **Bronze gate**: Schema conformance (reject records that don't match the registered schema), deduplication on natural keys, not-null checks on primary key fields. Failed records routed to a quarantine table with failure reasons.
- **Silver gate**: Referential integrity checks, value range validation, business rule assertions (e.g., order total = sum of line items). Implemented as dbt tests and Great Expectations suites.
- **Gold gate**: Metric reconciliation (gold aggregates must match silver detail within a tolerance), trend anomaly detection (alert if a metric moves > 3 standard deviations), completeness checks.

I also implemented automatic rollback: if a gold gate fails, the pipeline uses Delta Lake Time Travel to restore silver and gold to the last known good version, and an alert fires for investigation.

**Result**: The quality gates caught issues at the bronze layer that previously made it all the way to gold. The quarantine table became a valuable debugging tool -- data engineers could quickly identify and fix source-system issues. The automatic rollback prevented three incidents where bad data would have reached production dashboards. The entire quality gate system runs in the CI/CD pipeline, so every code change is tested against the gates before merge.

---

## 12. Describe a technical concept you had to explain to a non-technical audience.

**Topic: Explaining LLM governance to a compliance team**

**Situation**: While designing the enterprise-llm-adoption-kit, I needed to get buy-in from the compliance and legal team for the LLM governance framework. They understood data governance in the traditional sense (access controls, audit logs) but had no mental model for how LLM-specific risks (prompt injection, hallucination, data leakage through model responses) worked.

**Task**: Explain LLM-specific risks and the governance framework in terms the compliance team could understand and evaluate.

**Action**: I used an analogy they were already familiar with: email security. I framed it as:
- "Input guardrails are like an email spam filter -- they scan what goes into the LLM and block dangerous content (PII leakage, prompt injection attempts), just like a spam filter blocks phishing emails."
- "Output guardrails are like DLP (Data Loss Prevention) on outbound email -- they scan what comes out of the LLM and block responses that contain sensitive data or harmful content."
- "The audit log is like your email archive for compliance -- every LLM interaction is logged with who asked, what was asked, and what was returned, so you can investigate and report."
- "Use-case routing is like email distribution groups -- different teams have access to different LLM capabilities based on their role and the data classification of their use case."

I prepared a one-page risk matrix mapping traditional data risks to their LLM equivalents, with our mitigation for each.

**Result**: The compliance team approved the framework within two weeks -- fast by their standards. The email analogy gave them a familiar mental model to evaluate the safeguards. They subsequently asked me to present the framework to the broader risk management committee, which led to it being adopted as the organization's standard for LLM deployments.

---

## 13. Tell me about a time you had to deal with a tight deadline.

**Topic: Building the stage-pilot middleware under production pressure**

**Situation**: The AI agent platform was in active development with a target launch date. The tool-calling reliability issue (25% success rate) was discovered late -- about three weeks before the planned launch. Without a fix, the platform could not launch because the core agent functionality was unreliable.

**Task**: Design, build, test, and deploy a tool-calling middleware that would raise reliability to at least 80% within three weeks.

**Action**: I prioritized ruthlessly:
- **Week 1**: Analyzed failure modes from existing logs. Built the output parser and validation engine (the diagnostic layer). This immediately gave us visibility into exactly why calls were failing, which guided the rest of the work.
- **Week 2**: Built the auto-repair engine targeting the top 5 failure modes (which covered ~70% of failures). This was the highest-leverage component because it fixed calls without any additional LLM cost or latency.
- **Week 3**: Built the retry controller with structured error feedback. Added comprehensive tests and monitoring. Deployed to staging and ran load tests.

I deliberately deferred the schema compiler (prompt optimization) to post-launch because it was lower-leverage for the initial reliability target.

**Result**: Hit 90% reliability -- exceeding the 80% target. The platform launched on schedule. The deferred schema compiler was added two weeks post-launch and pushed reliability to 93%. The lesson was that systematic failure analysis before building anything is the highest-leverage activity under time pressure -- it tells you what to build first.

---

## 14. How do you stay current with technology trends?

**Situation**: The AI and data platform space evolves extremely rapidly. A paper or tool that is cutting-edge today may be outdated in six months.

**Action**: I maintain a multi-layered learning system:

1. **Daily**: Skim Hacker News, arXiv (cs.CL, cs.DB), and Twitter/X for signals. Takes 15 minutes. I don't read papers in full at this stage -- I'm scanning for patterns and trends.

2. **Weekly**: Deep-read 1-2 papers or blog posts that connect to my active work. For example, when building stage-pilot, I read the BFCL benchmark paper in detail and the Gorilla LLM paper on tool calling. When building lakehouse-contract-lab, I read the Delta Lake VLDB paper.

3. **Monthly**: Build something. Reading about a technology is not the same as using it. I dedicate time to implementing a proof of concept with new tools or techniques. This is how stage-pilot, tool-call-finetune-lab, and the other portfolio projects came about.

4. **Certification-driven**: I use certifications (SnowPro, Databricks, Palantir) as forcing functions for structured learning. The certification syllabus ensures I don't skip foundational topics while chasing the latest trends.

**Result**: This system keeps me both broad (aware of the landscape) and deep (hands-on with specific technologies). The certifications provide breadth; the portfolio projects provide depth. The combination is what allows me to have credible conversations about system design, not just theoretical knowledge.

---

## 15. Why are you interested in this role / company?

**Template for Snowflake**:
"Snowflake is where the governed analytics vision I built in Nexus-Hive meets massive scale. I designed a multi-warehouse NL-to-SQL system with governance, and Snowflake's architecture -- virtual warehouses, data sharing, row-level security -- is the ideal execution layer for that vision. As a SnowPro certified architect, I understand the platform deeply, and I want to work on the problems that Snowflake's largest customers face: scaling governed analytics, integrating LLM capabilities into the data platform, and making the data cloud accessible to non-technical users."

**Template for Databricks**:
"Databricks is defining the Lakehouse paradigm, and I have been building with it. My lakehouse-contract-lab project implements the Bronze-Silver-Gold medallion pattern with quality gates on Delta Lake. I hold the Databricks Platform Architect certification. What excites me is the convergence of data engineering and AI -- Unity Catalog for governance, MLflow for model lifecycle, and Mosaic AI for LLM integration. I want to help customers architect systems that span that full stack."

**Template for Palantir**:
"Palantir's approach to ontology-driven analytics resonates with what I built in Nexus-Hive: mapping business concepts to physical data. As a Palantir Foundry certified developer, I understand the platform's unique strengths -- the ontology layer, pipeline builder, and operational applications. I want to work on the hardest customer problems: integrating LLM capabilities into Foundry workflows, building governed AI applications, and scaling the platform for the largest deployments."

**Template for Big Tech Korea (Google/Naver/Kakao)**:
"I want to bring enterprise AI governance and data platform expertise to the Korean market, where adoption of LLM-powered data platforms is accelerating. My experience spans the full stack -- from data pipelines to LLM fine-tuning to multi-agent systems -- and my certifications demonstrate platform-level depth. I am particularly interested in how Korean enterprises can adopt AI safely, with the governance and compliance frameworks I have built in enterprise-llm-adoption-kit."

---

## General Tips for Behavioral Interviews

### The STAR Method -- Applied

- **Situation**: Set the context in 2-3 sentences. Be specific about the environment, constraints, and stakes.
- **Task**: What was your specific responsibility? Use "I", not "we."
- **Action**: This is the longest section. Describe what you did, not what the team did. Be specific about technical decisions, trade-offs, and reasoning.
- **Result**: Quantify whenever possible. Numbers are memorable: "25% to 90%", "23 projects", "94% governance compliance."

### Common Follow-Up Questions and How to Handle Them

- "What would you do differently?" -- Always have a genuine answer. It shows self-awareness.
- "How did you measure success?" -- Always have metrics. If you didn't measure, acknowledge it and describe how you would measure next time.
- "What did other people think?" -- Show that you considered other perspectives, especially in disagreement stories.
- "How did this impact the business?" -- Connect technical outcomes to business outcomes (launch on time, compliance approval, cost savings).
