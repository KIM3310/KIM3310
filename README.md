# KIM3310

Operations-first AI systems portfolio for infrastructure operations, security monitoring, network assurance, governed analytics, agent runtimes, and secure automation.

I build reviewable systems around operational discipline: incident confirmation, access and security monitoring, network/service visibility, workflow automation, data-quality checks, and AI runtime governance.

## Product and Review Surface

A portfolio front door that turns many repositories into one coherent operations, AI governance, and runtime reliability story.

| Lens | Definition |
|---|---|
| Audience | Engineering reviewers, technical founders, enterprise AI leaders, and infrastructure operations teams. |
| Review path | Start from the portfolio gallery, then open repository-local stack notes and system architecture attachments. |
| Architecture signal | A live gallery, repository-local system architecture docs, stack lanes, and runtime/data boundary notes. |
| Safety boundary | Public repositories show reusable proof; private repositories stay framed as case studies without exposing sensitive project material. |

## Three-Minute Proof

1. Start with `stage-pilot` for tool-call reliability and published package proof.
2. Move to `enterprise-llm-adoption-kit` for governance, RBAC, redaction, audit, and eval gates.
3. Inspect `AegisOps` for incident replay, structured reports, and operator handoff.
4. Check `agent-runtime-go` for the compact Go runtime version of the reliability story.
5. Open `doeon-kim-portfolio` for the visual gallery that ties the systems together.
6. Use `aix-pilot` as the product-console proof for enterprise GenAI operations.

## Reviewer Fast Path

- **First minute:** Start with the portfolio gallery, then read the repository review map for the lane-by-lane story.
- **Flagship route:** Review `stage-pilot`, `enterprise-llm-adoption-kit`, `AegisOps`, `agent-runtime-go`, and `doeon-kim-portfolio` first; use `aix-pilot` as the flagship product-console proof.
- **Verification:** Check each flagship README for its `Product and Review Surface`, `Reviewer Fast Path`, and CI/QA command.

## Technology Stack Index

- [Technology stack index](docs/technology-stack-index.md) maps the portfolio by TypeScript, Python/FastAPI, Go, data, infrastructure, local-first, and applied ML surfaces.
- The main technical signal is not the number of repositories; it is the repeated habit of defining an operator problem, documenting the runtime/data boundary, and attaching system architecture close to the code.

## Latest Service Polish

- `twincity-ui` now exposes Korean public API readiness through `/api/public-apis` and the runtime scorecard path.
- `smallbiz-ops-copilot` now exposes `/integrations/public-apis` for merchant and operating-risk enrichment readiness.
- `districtpilot-ai` now includes `15_public_api_integration_readiness.sql` to map public-data rollout candidates into Snowflake-native review views.
- These updates use provider metadata aligned with `public-apis-4Kr` and keep secret values out of public repositories.

## Service Launch Playbook

- [Service launch playbook](docs/service-launch-playbook.md) maps the repository to review audiences, proof gates, launch steps, and risk boundaries.

## Portfolio Review Index

- [Portfolio review index](docs/portfolio-review-index-2026-05-30.md) maps curated active repositories to their lane, reader, review guide, and quality notes.

## Portfolio Enterprise Readiness Index

- [Portfolio enterprise readiness index](docs/portfolio-enterprise-readiness-index-2026-05-30.md) maps curated active repositories to their data, security, operations, and production-readiness review notes.

## Portfolio Archive Readiness Index

- [Portfolio archive readiness index](docs/portfolio-archive-readiness-index-2026-05-30.md) keeps archived repositories positioned as supporting proof, domain depth, and revival options.

## Portfolio Full Repository Index

- [Portfolio full repository index](docs/portfolio-full-repository-index-2026-05-30.md) maps all active and archived repositories to their lane, reader, and review notes.

## Portfolio Curation

- [Portfolio curation note](docs/portfolio-curation-2026-05-30.md) explains what stays active, what moved to archived/supporting, and why the visible story is narrower now.

## Review Notes

- [Review guide](docs/reviewer-evidence-map.md) summarizes the project angle, first files to inspect, verification commands, and known boundaries.
- [Quality notes](docs/quality-gate.md) lists the local checks, CI surface, and release expectations for this repository.
- [Enterprise readiness notes](docs/enterprise-readiness.md) outlines security, data, operations, integration, and handoff expectations.

## Start Here

| Stack area | Flagship repository | What it shows | Architecture surface |
|---|---|---|---|
| TypeScript runtime | [stage-pilot](https://github.com/KIM3310/stage-pilot) | parser recovery, deterministic fixtures, package runtime | [system architecture](https://github.com/KIM3310/stage-pilot/blob/main/docs/system-architecture.md) |
| Python / FastAPI governance | [enterprise-llm-adoption-kit](https://github.com/KIM3310/enterprise-llm-adoption-kit) | RBAC, audit logging, policy gates, evals, rollout controls | [system architecture](https://github.com/KIM3310/enterprise-llm-adoption-kit/blob/main/docs/system-architecture.md) |
| React operations UI | [AegisOps](https://github.com/KIM3310/AegisOps) | multimodal incident analysis, replay evals, operator handoff | [system architecture](https://github.com/KIM3310/AegisOps/blob/main/docs/system-architecture.md) |
| Go runtime | [agent-runtime-go](https://github.com/KIM3310/agent-runtime-go) | deterministic tools, retries, providers, traceable control flow | [system architecture](https://github.com/KIM3310/agent-runtime-go/blob/main/docs/system-architecture.md) |
| Portfolio router | [doeon-kim-portfolio](https://github.com/KIM3310/doeon-kim-portfolio) | compact public map of systems, runtimes, and architecture links | [system architecture](https://github.com/KIM3310/doeon-kim-portfolio/blob/main/docs/system-architecture.md) |
| Enterprise GenAI console | [AIX Pilot](https://github.com/KIM3310/aix-pilot) | RAG, Agent, DLP, evaluation, KPI, and service model | [system architecture](https://github.com/KIM3310/aix-pilot/blob/main/docs/system-architecture.md) |
| Governed analytics | [Nexus-Hive](https://github.com/KIM3310/Nexus-Hive) | NL-to-SQL workbench with policy checks, audit trails, warehouse adapters | [system architecture](https://github.com/KIM3310/Nexus-Hive/blob/main/docs/system-architecture.md) |
| Data contracts | [lakehouse-contract-lab](https://github.com/KIM3310/lakehouse-contract-lab) | Spark/Delta medallion pipeline, quality gates, contract checks | [system architecture](https://github.com/KIM3310/lakehouse-contract-lab/blob/main/docs/system-architecture.md) |
| Private deployment kit | [llm-onprem-deployment-kit](https://github.com/KIM3310/llm-onprem-deployment-kit) | Terraform, Helm, compliance runbooks, air-gapped operating notes | [system architecture](https://github.com/KIM3310/llm-onprem-deployment-kit/blob/main/docs/system-architecture.md) |

## Portfolio Stack Map

| Stack lane | Core repositories | System architecture surface |
|---|---|---|
| TypeScript / React operations UI | `aix-pilot`, `AegisOps`, `twincity-ui`, `security-threat-response-workbench` | public UI, edge deployment, operator workflow, architecture attachments |
| TypeScript runtime reliability | `stage-pilot`, `multi-cli-pilot`, `dream-interpretation-pages` | parser recovery, adapters, state boundary, package/runtime docs |
| Python / FastAPI governance | `enterprise-llm-adoption-kit`, `Nexus-Hive`, `secure-xl2hwp-local` | API boundary, audit trails, policy gates, local and hosted deployment notes |
| Go runtime | `agent-runtime-go` | typed tools, retry boundary, provider adapters, compact runtime docs |
| Data / SQL / Spark / Snowflake | `lakehouse-contract-lab`, `districtpilot-ai`, `fab-ops-yield-control-tower` | contracted data flows, feature marts, quality gates, export boundaries |
| Infrastructure / deployment | `llm-onprem-deployment-kit`, `stage-pilot`, `enterprise-llm-adoption-kit` | Terraform, Docker, local compose, private deployment assumptions |
| Native / Unity / applied ML | `SteadyTap`, `kbbq-idle-unity`, `weld-defect-vision`, `retina-scan-ai` | native runtime, game/WebGL surface, model-serving and validation boundaries |

## Recent IT Infrastructure Role

**IT Infrastructure Operations Manager, InterX**<br>
**Apr 2026 - May 2026, Seoul**

- Data center and IDC infrastructure operations support.
- Security and network operations across UTM devices, IPsec VPN, DRM, DLP, NAC, and firewall monitoring.
- Jira, Confluence, Google Workspace, IT assets, licenses, backups, access rights, onboarding, and helpdesk workflow administration.
- Operations improvement through Jira automation rules, recurring reports, vendor coordination, and IT/SaaS test beds.

## Operations Background

**MW Communications Soldier / Squad Leader, ROK Defense Communication Command / 1st Information Communications Group**<br>
**Nov 2023 - May 2025, Seongnam**

- Led a 6-person squad in 24/7 strategic command communications operations, handling roughly 8-9 incidents or issue cases per month.
- Operated CCTV/VMS/NVR systems, including camera view adjustment, recording/status checks, abnormal-situation reporting, initial action, and CCTV fault response.
- Reviewed access logs, maintained visitor access approval records, processed access-permission registration/removal, and monitored perimeter, server-room, and communications-room intrusion or unauthorized-access alerts.
- Supported network, security, server, and communications-room monitoring with issue confirmation, reporting, escalation, shift handoff, server-room fire response, and 24-hour standby.

## Education and Certifications

- Bachelor's Degree Examination for Self-Education (BDES), Computer Science - expected Nov 2027.
- Korea National Open University - Computer Science coursework, Mar 2026 - Present.
- Microsoft AI School 8th Cohort - Azure AI, Copilot, RAG, and enterprise AI deployment training.
- Certifications include Microsoft AI-900, Snowflake SnowPro Associate, Databricks Platform Architect, Palantir Foundry, Datadog Observability, IBM AI/Cloud/Cyber Fundamentals, and SAP Cloud Platform Integration.

## Project Lanes

| Lane | Repositories | What to inspect |
|---|---|---|
| Infrastructure operations | `AegisOps`, `nw-service-assurance-workbench`, `security-threat-response-workbench`, `secure-xl2hwp-local`, `llm-onprem-deployment-kit` | network visibility, CCTV/access-control context, security response, incident handoff, local/controlled operation, signed audit evidence |
| Agent reliability | `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark`, `ai-agent-production-lab`, `ai-security-redteam-lab` | tool-call parsing, retry behavior, deterministic tests, benchmark harnesses, security checks |
| LLM governance | `aix-pilot`, `enterprise-llm-adoption-kit`, `tool-call-finetune-lab`, `llm-onprem-deployment-kit` | policy gates, redaction, evals, audit logging, routing boundaries, private deployment patterns |
| Data / BI governance | `lakehouse-contract-lab`, `Nexus-Hive`, `districtpilot-ai` | quality gates, governed analytics, partner/channel-style reporting, local fixtures, export boundaries |
| Manufacturing and field operations | `fab-ops-yield-control-tower`, `weld-defect-vision` | incident queues, shift evidence, model serving, validation notes |
| Medical-image workflow | `retina-scan-ai` | model card, explainability, risk notes, validation templates |
| Supporting / archived experiments | See the archive readiness index | Consumer tools, games, broad education, crypto research, and one-off vendor spikes are kept as optional breadth rather than the main story |

## Stack-Aligned Evidence

| Technical surface | Background evidence | Repositories to inspect |
|---|---|---|
| Data center and security operations | InterX data center/IDC support; military server-room, communications-room, access, CCTV/VMS/NVR, intrusion-alert, fire-response, and standby experience | `AegisOps`, `security-threat-response-workbench`, `nw-service-assurance-workbench`, `llm-onprem-deployment-kit` |
| Security device and monitoring workflow | UTM, IPsec VPN, DRM, DLP, NAC, firewall monitoring, access log review, CCTV fault response, and escalation discipline | `security-threat-response-workbench`, `secure-xl2hwp-local`, `enterprise-llm-adoption-kit` |
| Operational reporting and process improvement | Jira automation rules, recurring reports, vendor coordination, handoff notes, incident follow-up, and service-desk controls | `AegisOps`, `nw-service-assurance-workbench`, `lakehouse-contract-lab`, `Nexus-Hive` |
| Data analysis and governance | Data-quality gates, governed analytics, audit trails, warehouse adapters, rejected-row review, and export boundaries | `Nexus-Hive`, `lakehouse-contract-lab`, `districtpilot-ai` |
| AI runtime reliability | Deterministic fixtures, parser recovery, retry behavior, eval assertions, cost traces, and security red-team checks | `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark`, `ai-agent-production-lab`, `ai-security-redteam-lab` |

## Suggested Reading Order

1. `aix-pilot` - Enterprise GenAI pilot console with RAG, Agent, trust controls, KPI, presentation assets, and Cloudflare deployment.
2. `stage-pilot` - TypeScript tool-call reliability package and runtime.
3. `agent-runtime-go` - Minimal Go runtime for deterministic tool execution.
4. `AegisOps` - Incident operations surface with replay and handoff contracts.
5. `enterprise-llm-adoption-kit` - Governance and evaluation surface for LLM workflows.
6. `Nexus-Hive` and `lakehouse-contract-lab` - Governed analytics, SQL, and data-quality proof.
7. `secure-xl2hwp-local` - Local-first document automation with signed evidence.
8. `nw-service-assurance-workbench` and `security-threat-response-workbench` - Network/security operations simulations.
9. `fab-ops-yield-control-tower`, `weld-defect-vision`, and `retina-scan-ai` - Applied ML and operations workflows with validation notes.

## Maintenance Snapshot

The active repositories use a common maintenance baseline:

- GitHub Actions for CI and repository health checks.
- Secret scanning configuration and local false-positive reduction.
- Dependency review or audit gates where supported by the stack.
- `.editorconfig` and `.gitattributes` for consistent diffs.
- Contributing, security, issue, and pull-request templates.
- Technical review packs, architecture notes, runtime exercises, validation hooks, and audit evidence where relevant.

Current portfolio audit: [Repository Portfolio Audit - 2026-05-23](docs/repository-audit-2026-05-23.md)
Latest upgrade plan: [Portfolio Upgrade Plan - 2026-05-28](docs/portfolio-upgrade-plan-2026-05-28.md)

## Cloud + AI Architecture

This repository includes a neutral cloud and AI engineering blueprint that maps the current proof surface to runtime boundaries, data contracts, model-risk controls, deployment posture, and validation hooks.

- [Cloud + AI architecture blueprint](docs/cloud-ai-architecture.md)
- [Machine-readable architecture manifest](docs/architecture/blueprint.json)
- Validation command: `python3 scripts/validate_architecture_blueprint.py`

## Enterprise Productization

- [Product operating model](docs/product-operating-model.md) defines the reviewer, trust boundary, trust boundary, operating checks, and service path for this repository.

## System Architecture

- [System architecture](docs/system-architecture.md) maps the runtime boundary, data/control flow, cloud or local deployment surface, and operating assumptions for this repository.

## Service Architecture

- [Service architecture](docs/service-architecture.md) defines the cloud resources, account information, cost controls, and production guardrails needed to turn this repo into a scoped service without publishing public financial assumptions.
