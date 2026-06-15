# Technical Review Brief

This portfolio is meant to be reviewed as an operations-first engineering body of work, not as a pile of demos.

The main signal is the pattern that repeats across repositories: define a bounded operator problem, build a working surface, add verification gates, document the trust boundary, and leave a reviewer a short path to inspect the decision.

## Role Directions

| Direction | Why this portfolio fits | Start with |
|---|---|---|
| AI platform / agent reliability engineer | Tool-call parsing, deterministic fixtures, benchmark traces, provider boundaries, and runtime failure handling. | `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark` |
| Enterprise AI / LLMOps engineer | RBAC concepts, audit logs, redaction, eval gates, private deployment notes, and adoption controls. | `enterprise-llm-adoption-kit`, `aix-pilot`, `llm-onprem-deployment-kit` |
| Infrastructure / security operations engineer | Incident triage, handoff discipline, network/service assurance, access/security context, and controlled automation. | `AegisOps`, `security-threat-response-workbench`, `nw-service-assurance-workbench` |
| Data / analytics platform engineer | Quality gates, governed analytics, rejected-row review, policy-checked queries, and warehouse-style operating notes. | `Nexus-Hive`, `lakehouse-contract-lab`, `districtpilot-ai` |
| Applied ML / industrial workflow engineer | Model boundaries, validation notes, operator review surfaces, and manufacturing or inspection context. | `fab-ops-yield-control-tower`, `weld-defect-vision`, `retina-scan-ai` |

## Ten-Minute Review Path

1. Read the profile README through `Three-Minute Proof`.
2. Open `stage-pilot` and check the verification surface, benchmark notes, and package/runtime story.
3. Open `enterprise-llm-adoption-kit` and inspect governance, redaction, eval, and audit-log boundaries.
4. Open `AegisOps` and read the incident replay and operator handoff flow.
5. Open `agent-runtime-go` to confirm the same reliability ideas exist in a compact Go runtime.
6. Use `doeon-kim-portfolio` only after the technical shape is clear; it is the gallery, not the evidence source.

## Reviewer Questions

| Topic | Useful question | Evidence |
|---|---|---|
| Failure handling | What happens when a model returns malformed tool calls or partial JSON? | `stage-pilot`, `agent-runtime-go` |
| Operational trust | How do you keep an AI incident assistant from becoming an opaque recommendation box? | `AegisOps`, `enterprise-llm-adoption-kit` |
| Security boundaries | Where do secrets, customer data, and production claims stop in these public repos? | `SECURITY.md`, `docs/enterprise-readiness.md`, redaction tests |
| Data quality | How are bad rows, schema drift, and governed queries handled before a dashboard trusts them? | `lakehouse-contract-lab`, `Nexus-Hive` |
| Deployment realism | Which parts are runnable locally, which are CI-verified, and which are architecture-ready but not production claims? | `docs/quality-gate.md`, service architecture docs |

## Authorship Signals Reviewers Should Notice

- The repos avoid pretending public fixtures are production tenant data.
- Most projects include a review map, quality gate, enterprise-readiness note, product operating model, and service architecture note.
- The strongest projects have a repeatable verification command instead of relying on screenshots.
- The portfolio is intentionally operations-heavy because my background is infrastructure, communications-room monitoring, access/security workflows, incident handoff, and IT operations support.
- The docs call out limitations where production work would require identity, authorization, audit storage, validation plans, or customer-specific acceptance criteria.

## What I Would Improve Next

- Reduce the active public surface further if a target direction needs a narrower story.
- Add short recorded walkthroughs for the top five repositories.
- Convert selected proof surfaces into one deployable, monitored reference environment.
- Add more issue-driven commit history around design tradeoffs, not just final-state polish.
