# KIM3310

Operations-first AI systems portfolio for infrastructure operations, security monitoring, network assurance, governed analytics, agent runtimes, and secure automation.

I build reviewable systems around operational discipline: incident confirmation, access and security monitoring, network/service visibility, workflow automation, data-quality checks, and AI runtime governance.

## Start Here

| Proof area | Flagship repository | What it proves | Verification signal |
|---|---|---|---|
| Incident operations | [AegisOps](https://github.com/KIM3310/AegisOps) | multimodal incident analysis, replay evals, operator handoff | runtime exercise scripts, review pack, CI |
| Tool-call reliability | [stage-pilot](https://github.com/KIM3310/stage-pilot) | parser recovery, deterministic fixtures, published package surface | tests, typecheck, build, benchmark docs |
| Agent runtime | [agent-runtime-go](https://github.com/KIM3310/agent-runtime-go) | minimal Go runtime with deterministic tools, retries, providers | Go tests, CI, compact runtime surface |
| Enterprise AI governance | [enterprise-llm-adoption-kit](https://github.com/KIM3310/enterprise-llm-adoption-kit) | RBAC, audit logging, policy gates, evals, rollout controls | governance docs, tests, CI, security templates |
| Governed analytics | [Nexus-Hive](https://github.com/KIM3310/Nexus-Hive) | NL-to-SQL workbench with policy checks, audit trails, warehouse adapters | tests, Secret Manager pattern, review pack |
| Data contracts | [lakehouse-contract-lab](https://github.com/KIM3310/lakehouse-contract-lab) | Spark/Delta medallion pipeline, quality gates, contract checks | pytest, ruff, pipeline fixtures |
| Public gallery | [doeon-kim-portfolio](https://github.com/KIM3310/doeon-kim-portfolio) | compact public map of systems, runtimes, and operations proof | GitHub Pages, tests, content verification |
| On-prem LLM ops | [llm-onprem-deployment-kit](https://github.com/KIM3310/llm-onprem-deployment-kit) | Terraform, Helm, compliance runbooks, air-gapped operating notes | infra docs, issue queue, CI |

## Current Role

**IT Infrastructure Operations Manager, InterX**<br>
**Apr 2026 - Present, Seoul**

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
| LLM governance | `enterprise-llm-adoption-kit`, `tool-call-finetune-lab`, `llm-onprem-deployment-kit` | policy gates, redaction, evals, audit logging, routing boundaries, private deployment patterns |
| Data / BI governance | `lakehouse-contract-lab`, `Nexus-Hive`, `districtpilot-ai` | quality gates, governed analytics, partner/channel-style reporting, local fixtures, export boundaries |
| Manufacturing and field operations | `fab-ops-yield-control-tower`, `weld-defect-vision` | incident queues, shift evidence, model serving, validation notes |
| Medical-image workflow | `retina-scan-ai` | model card, explainability, risk notes, validation templates |
| Compact experiments | `SteadyTap`, `multi-cli-pilot`, `qwen-pilot`, `beaver-study-orchestrator`, `ecotide`, `dream-interpretation-pages` | CLI adapters, deterministic fixtures, mobile surfaces, small product experiments |

## Role-Aligned Evidence

| Review signal | Evidence in background | Repositories to inspect |
|---|---|---|
| Data center and security operations | InterX data center/IDC support; military server-room, communications-room, access, CCTV/VMS/NVR, intrusion-alert, fire-response, and standby experience | `AegisOps`, `security-threat-response-workbench`, `nw-service-assurance-workbench`, `llm-onprem-deployment-kit` |
| Security device and monitoring workflow | UTM, IPsec VPN, DRM, DLP, NAC, firewall monitoring, access log review, CCTV fault response, and escalation discipline | `security-threat-response-workbench`, `secure-xl2hwp-local`, `enterprise-llm-adoption-kit` |
| Operational reporting and process improvement | Jira automation rules, recurring reports, vendor coordination, handoff notes, incident follow-up, and service-desk controls | `AegisOps`, `nw-service-assurance-workbench`, `lakehouse-contract-lab`, `Nexus-Hive` |
| Data analysis and governance | Data-quality gates, governed analytics, audit trails, warehouse adapters, rejected-row review, and export boundaries | `Nexus-Hive`, `lakehouse-contract-lab`, `districtpilot-ai` |
| AI runtime reliability | Deterministic fixtures, parser recovery, retry behavior, eval assertions, cost traces, and security red-team checks | `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark`, `ai-agent-production-lab`, `ai-security-redteam-lab` |

## Suggested Reading Order

1. `stage-pilot` - TypeScript tool-call reliability package and runtime.
2. `agent-runtime-go` - Minimal Go runtime for deterministic tool execution.
3. `AegisOps` - Incident operations surface with replay and handoff contracts.
4. `enterprise-llm-adoption-kit` - Governance and evaluation surface for LLM workflows.
5. `Nexus-Hive` and `lakehouse-contract-lab` - Governed analytics, SQL, and data-quality proof.
6. `secure-xl2hwp-local` - Local-first document automation with signed evidence.
7. `nw-service-assurance-workbench` and `security-threat-response-workbench` - Network/security operations simulations.
8. `fab-ops-yield-control-tower`, `weld-defect-vision`, and `retina-scan-ai` - Applied ML and operations workflows with validation notes.

## Maintenance Snapshot

The active repositories use a common maintenance baseline:

- GitHub Actions for CI and repository health checks.
- Secret scanning configuration and local false-positive reduction.
- Dependency review or audit gates where supported by the stack.
- `.editorconfig` and `.gitattributes` for consistent diffs.
- Contributing, security, issue, and pull-request templates.
- Technical review packs, architecture notes, runtime exercises, validation hooks, and audit evidence where relevant.

Current portfolio audit: [Repository Portfolio Audit - 2026-05-23](docs/repository-audit-2026-05-23.md)

## Cloud + AI Architecture

This repository includes a neutral cloud and AI engineering blueprint that maps the current proof surface to runtime boundaries, data contracts, model-risk controls, deployment posture, and validation hooks.

- [Cloud + AI architecture blueprint](docs/cloud-ai-architecture.md)
- [Machine-readable architecture manifest](docs/architecture/blueprint.json)
- Validation command: `python3 scripts/validate_architecture_blueprint.py`
