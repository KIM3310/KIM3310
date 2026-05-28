# Commercialization and Review Map - 2026-05-28

This map turns the repository list into a product portfolio. Each active work should be clear about buyer or user, commercial route, review signal, and proof artifact.

## North Star

The portfolio should read as one coherent operating system for enterprise AI and infrastructure work:

- prove disciplined operations through military communications, CCTV/VMS/NVR, access-control, intrusion-alert, and current IT infrastructure context
- prove technical depth through agent runtimes, evals, governance, data contracts, and deployment boundaries
- prove product judgment through calm UI, live demos, explicit buyers, and small paid wedges
- keep archived experiments clearly superseded so they do not dilute the active story

## Flagship Commercial Lanes

| Lane | Repository | Buyer or user | Commercial route | Review signal |
|---|---|---|---|---|
| Enterprise GenAI operations | `aix-pilot` | Internal knowledge, support, service-desk, and process teams | Pilot-to-subscription console, implementation setup, monthly support | RAG, Agent drafts, DLP masking, eval gates, KPI dashboard, Cloudflare deployment |
| Enterprise AI governance | `enterprise-llm-adoption-kit` | AI adoption leaders, IT governance, compliance operators | Paid adoption workshop, governance template, integration kit | RBAC, audit logs, redaction, evals, rollout controls |
| On-prem and private LLM ops | `llm-onprem-deployment-kit` | Regulated enterprises and private infrastructure teams | Private deployment runbook, Terraform/Helm setup advisory | Air-gapped notes, compliance runbooks, infra controls |
| Tool-call runtime reliability | `stage-pilot` | AI platform teams and developer-tool teams | Package support, parser audit, reliability test pack | Benchmark lift, parser recovery, deterministic fixtures, published package surface |
| Agent runtime foundation | `agent-runtime-go` | Backend teams embedding controlled agents | Embedded runtime package, adapter integration | Go runtime, retries, provider boundaries, traceable control flow |
| Incident operations | `AegisOps` | SOC, IT operations, incident response teams | Incident review cockpit, replay exercise, handoff workflow setup | Replay evals, multimodal incident analysis, operator handoff |
| Network and cloud security ops | `security-threat-response-workbench`, `nw-service-assurance-workbench` | Cloud security, telecom, IDC, managed service teams | Response desk starter, tabletop exercise, SLA visibility pack | Threat triage, runbooks, service path visibility, shift handoff |
| Governed analytics | `Nexus-Hive`, `lakehouse-contract-lab` | Data platform, analytics, BI, and quality teams | Data-contract starter, governed BI cockpit, migration advisory | Policy-checked queries, audit trails, quality gates, rejected-row review |

## Productized Active Works

| Repository | Best product angle | Commercial wedge | Proof to keep visible |
|---|---|---|---|
| `aix-pilot` | Enterprise GenAI console for RAG, Agent, security, and KPI operations | Free pilot, paid setup, monthly governance/reporting support | Live URL, screenshot, QA command, deck/video pack |
| `stage-pilot` | Reliability package for tool-calling agents | npm package support and runtime audit | Benchmark report, package docs, test output |
| `agent-runtime-go` | Minimal deterministic agent runtime | Embedded runtime and consulting integration | Go tests, adapter examples, trace docs |
| `ai-agent-production-lab` | Agent readiness lab for production checks | CI eval pack and readiness assessment | HTML reports, traces, cost accounting, fixtures |
| `ai-security-redteam-lab` | Credential-free AI safety lab | Safety check bundle and CI gate | Prompt-injection tests, secret-leak checks, reports |
| `agent-orchestration-benchmark` | Runtime comparison harness | Benchmarking package for platform decisions | Standard fixtures and comparative reports |
| `multi-cli-pilot`, `qwen-pilot` | CLI agent orchestration experiments | Internal automation playbook | Typed tools, deterministic workflows, MCP notes |
| `enterprise-llm-adoption-kit` | Governance kit for enterprise LLM rollout | Workshop, template pack, implementation starter | RBAC, evals, audit logs, redaction |
| `llm-onprem-deployment-kit` | Private LLM deployment notes and infra templates | On-prem readiness review | Terraform, Helm, compliance runbooks |
| `tool-call-finetune-lab` | Training and evaluation lab for tool calls | Model adaptation study pack | Training notes, eval harness, serving notes |
| `AegisOps` | Incident operations surface | Incident cockpit setup | Live UI, replay evals, handoff notes |
| `security-threat-response-workbench` | Cloud threat response desk | Security tabletop and runbook pack | WAF, IDS, DDoS triage, analyst automation |
| `nw-service-assurance-workbench` | Telecom/network service assurance board | SLA and outage dashboard starter | Service paths, outage triage, domain posture |
| `secure-xl2hwp-local` | Local-first Korean document workflow automation | Offline license or per-seat internal tool | JWT, signed exports, audit logs |
| `Nexus-Hive` | Governed analytics workbench | Internal BI copilot | Policy checks, audit trails, chart output |
| `lakehouse-contract-lab` | Contract-first medallion pipeline | Data-quality starter pack | Spark/Delta-style fixtures, quality gates |
| `districtpilot-ai` | District-level forecasting and action cards | Local government or ops planning prototype | Forecasts, monitoring cards, scenario outputs |
| `fab-ops-yield-control-tower` | Manufacturing ops control surface | Factory control tower prototype | Fab monitoring, qualification, shift evidence |
| `weld-defect-vision` | Industrial inspection AI workflow | Inspection proof-of-concept package | Model card, serving notes, validation outputs |
| `retina-scan-ai` | Medical-image research workflow | Research validation template only | Risk notes, Grad-CAM, model card, non-device boundary |
| `quantum-workbench` | Quantum experiment desk | Technical research artifact | Local simulation and backend adapters |
| `SteadyTap` | Accessibility coaching app | Freemium app and team coaching plan | SwiftUI surface, accessibility UX, sync boundary |
| `the-savior`, `dream-interpretation-pages` | Lightweight AI content apps | Consumer funnel experiments | Abuse controls, deterministic fallback, hosted UI |
| `beaver-study-orchestrator` | Study planning and risk simulator | Student productivity prototype | Syllabus extraction, what-if scheduling |
| `ecotide` | SwiftUI simulation surface | Native UX craft sample | Motion telemetry, CLI fallback |
| `kbbq-idle-unity` | Playable Unity delivery surface | Game portfolio proof | WebGL preflight, playable release surface |

## Archive Rule

Archived repositories stay public only when they explain what replaced them. They should not compete with active works.

| Archived group | Repositories | Public message |
|---|---|---|
| Provider-specific cookbooks | `claude-agent-cookbook`, `claude-production-patterns`, `cohere-agent-cookbook` | Superseded by provider-neutral agent and runtime work |
| Data and rollout fragments | `snowflake-demo-pack`, `snowflake-customer-onboarding-90day-playbook`, `fde-engagement-playbook` | Superseded by contract-first data and governance kits |
| Runtime and operations fragments | `dv-regression-lab`, `ogx`, `Aegis-Air`, `the-logistics-prophet`, `signal-risk-lab` | Superseded by active runtime, incident, and governed analytics repositories |
| Adoption concepts | `m365-copilot-adoption-command-center`, `twincity-ui` | Kept as historical UI/operations experiments |

## Per-Repository Upgrade Checklist

Every active work should expose these within the first screen or first README section:

1. Buyer or user.
2. Commercial route.
3. Reviewer proof command.
4. Safety or data boundary.
5. Live demo, screenshot, report, or generated artifact.
6. "Why this matters" in one sentence.
7. Clear replacement note if the repository is superseded.

## Immediate Priority

1. Keep `aix-pilot`, `doeon-kim-portfolio`, and `KIM3310` perfectly aligned.
2. Add product-positioning blocks to `stage-pilot`, `AegisOps`, `enterprise-llm-adoption-kit`, `Nexus-Hive`, and `agent-runtime-go`.
3. Add screenshot/report evidence to network/security and governed analytics works.
4. Keep private case studies visible only as case-study cards without private repository links.
