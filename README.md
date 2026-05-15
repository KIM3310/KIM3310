# KIM3310

Technical project index for data-center-adjacent infrastructure operations, security monitoring, network assurance, governed analytics, agent runtimes, and secure automation.

The public surface is organized as a proof map: current IT infrastructure operations, prior 24/7 military communications operations, and runnable repositories with verification paths, architecture notes, and clear operational boundaries.

## Profile Thesis

I build reviewable systems around operations discipline: incident confirmation, access and security monitoring, network/service visibility, workflow automation, data-quality checks, and AI runtime governance.

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
- Used, operated, and managed CCTV/VMS/NVR systems, including camera view adjustment, recording/status checks, abnormal-situation reporting, initial action, and CCTV fault response.
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
| Infrastructure operations | `nw-service-assurance-workbench`, `security-threat-response-workbench`, `AegisOps`, `secure-xl2hwp-local`, `llm-onprem-deployment-kit` | network visibility, CCTV/access-control context, security response, incident handoff, local/controlled operation, signed audit evidence |
| Agent reliability | `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark`, `ai-agent-production-lab` | tool-call parsing, retry behavior, deterministic tests, benchmark harnesses |
| LLM governance | `enterprise-llm-adoption-kit`, `tool-call-finetune-lab` | policy gates, redaction, evals, audit logging, routing boundaries |
| Secure document automation | `secure-xl2hwp-local` | local processing, signed audit artifacts, template drift detection |
| Operations workbenches | `AegisOps`, `security-threat-response-workbench`, `nw-service-assurance-workbench`, `ai-security-redteam-lab` | dashboards, handoff flows, mock/live mode separation, route contracts |
| Data / BI governance | `lakehouse-contract-lab`, `Nexus-Hive`, `districtpilot-ai` | quality gates, governed analytics, partner/channel-style reporting, local fixtures, export boundaries |
| Manufacturing and field operations | `fab-ops-yield-control-tower`, `weld-defect-vision` | incident queues, shift evidence, model serving, validation notes |
| Medical-image workflow | `retina-scan-ai` | model card, explainability, risk notes, validation templates |
| Compact experiments | `SteadyTap`, `multi-cli-pilot`, `qwen-pilot`, `beaver-study-orchestrator` | CLI adapters, deterministic fixtures, small product surfaces |

## Role-Aligned Evidence

| Review signal | Evidence in background | Repositories to inspect |
|---|---|---|
| Data center and security operations | InterX data center/IDC support; military server-room, communications-room, access, CCTV/VMS/NVR, intrusion-alert, fire-response, and standby experience | `security-threat-response-workbench`, `nw-service-assurance-workbench`, `AegisOps`, `llm-onprem-deployment-kit` |
| Security device and monitoring workflow | UTM, IPsec VPN, DRM, DLP, NAC, firewall monitoring, access log review, CCTV fault response, and escalation discipline | `security-threat-response-workbench`, `secure-xl2hwp-local`, `enterprise-llm-adoption-kit` |
| Operational reporting and process improvement | Jira automation rules, recurring reports, vendor coordination, handoff notes, incident follow-up, and service-desk controls | `AegisOps`, `nw-service-assurance-workbench`, `lakehouse-contract-lab`, `Nexus-Hive` |
| Data analysis and governance | Data-quality gates, governed analytics, audit trails, warehouse adapters, rejected-row review, and export boundaries | `Nexus-Hive`, `lakehouse-contract-lab`, `districtpilot-ai` |
| AI runtime reliability | Deterministic fixtures, parser recovery, retry behavior, eval assertions, cost traces, and security red-team checks | `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark`, `ai-agent-production-lab`, `ai-security-redteam-lab` |

## Suggested Reading Order

1. `stage-pilot` - TypeScript tool-call reliability package and runtime.
2. `agent-runtime-go` - Minimal Go runtime for deterministic tool execution.
3. `enterprise-llm-adoption-kit` - Governance and evaluation surface for LLM workflows.
4. `secure-xl2hwp-local` - Local-first document automation with signed evidence.
5. `nw-service-assurance-workbench` - Network service assurance and outage triage surface.
6. `AegisOps` - Incident operations surface with replay and handoff contracts.
7. `security-threat-response-workbench` - Self-contained incident-response simulation.
8. `Nexus-Hive` and `lakehouse-contract-lab` - Governed analytics, SQL, and data-quality proof.
9. `fab-ops-yield-control-tower` - Manufacturing operations APIs and handoff evidence.
10. `weld-defect-vision` and `retina-scan-ai` - Applied ML pipelines with governance notes.

## Verification Posture

The active repositories use the same maintenance baseline:

- GitHub Actions for CI and repository health checks.
- Secret scanning configuration and local false-positive reduction.
- Dependency review or audit gates where supported by the stack.
- `.editorconfig` and `.gitattributes` for consistent diffs.
- Contributing, security, issue, and pull-request templates.

## Documentation Pattern

Flagship repositories include or are being updated with:

- `docs/technical-review-pack.md`
- [Repository consolidation map](REPOSITORY_CONSOLIDATION.md)
- architecture notes
- demo or runtime exercise paths
- validation and audit evidence
- threat model and operational boundaries

The documents avoid external credential requirements unless the repository explicitly supports optional live integrations.

## Cloud + AI Architecture

This repository includes a neutral cloud and AI engineering blueprint that maps the current proof surface to runtime boundaries, data contracts, model-risk controls, deployment posture, and validation hooks.

- [Cloud + AI architecture blueprint](docs/cloud-ai-architecture.md)
- [Machine-readable architecture manifest](docs/architecture/blueprint.json)
- Validation command: `python3 scripts/validate_architecture_blueprint.py`
