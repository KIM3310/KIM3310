# Repository Consolidation Map

This map defines the current repository shape after cleanup. It keeps active projects easy to inspect and moves duplicate or narrow proof paths toward archive status instead of leaving several overlapping stories alive at once.

Visibility note: public profile documents avoid linking private repositories as primary inspection paths. Private repositories may remain active internally, but they are labeled as private case studies where mentioned.

## Reader Path

The portfolio should read in this order:

1. **Front door**: `KIM3310` explains the profile thesis; `doeon-kim-portfolio` shows the systems gallery.
2. **Operations proof**: `nw-service-assurance-workbench`, `security-threat-response-workbench`, and `AegisOps` connect military MW communications, CCTV/VMS/NVR, access-control, intrusion-alert, and incident-response experience to current IT infrastructure operations.
3. **Infrastructure proof**: `secure-xl2hwp-local` and `llm-onprem-deployment-kit` show local-first, controlled, and auditable operating patterns.
4. **Data proof**: `Nexus-Hive`, `lakehouse-contract-lab`, and `districtpilot-ai` cover governed analytics, data-quality gates, and reporting-style outputs.
5. **AI runtime proof**: `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark`, and `ai-agent-production-lab` show deterministic execution, evals, retries, and traceability.

## Canonical Repositories

| Lane | Keep Active | Why It Stays Active |
|---|---|---|
| Infrastructure operations | `nw-service-assurance-workbench`, `security-threat-response-workbench`, `AegisOps`, `secure-xl2hwp-local` | Aligns the portfolio with current InterX infrastructure, network, security, service-desk, and workspace operations work. |
| Agent runtime reliability | `stage-pilot`, `agent-runtime-go`, `ai-agent-production-lab` | Covers package-level parsing, a minimal runtime, and deterministic production tests. |
| Agent evaluation and orchestration | `agent-orchestration-benchmark`, `tool-call-finetune-lab`, `multi-cli-pilot`, `qwen-pilot` | Keeps benchmarks, model-tuning experiments, and CLI orchestration separated by execution mode. |
| Governance and secure automation | `enterprise-llm-adoption-kit`, `secure-xl2hwp-local` plus private case studies | Keeps policy gates, local document conversion, redaction, and signed evidence in focused surfaces without exposing private repository links. |
| Operations workbenches | `AegisOps`, `security-threat-response-workbench`, `nw-service-assurance-workbench`, `ai-security-redteam-lab` plus private reliability cases | Keeps incident operations, reliability workflows, network assurance, security triage, and red-team testing as the main operations lane. |
| Data contracts | `lakehouse-contract-lab`, `Nexus-Hive` | Keeps contract-first pipelines and governed analytics as the main data lane. |
| Applied ML | `fab-ops-yield-control-tower`, `weld-defect-vision`, `retina-scan-ai` | Keeps industrial and medical-image workflows where model behavior is paired with validation notes. |
| Compact product experiments | `SteadyTap`, `beaver-study-orchestrator`, `dream-interpretation-pages`, `the-savior`, `crypto-signal-ai`, `quantum-workbench`, `districtpilot-ai`, `ecotide`, `kbbq-idle-unity` plus private product cases | Kept as smaller product or domain experiments unless their functionality is later merged into a flagship lane. |
| Technical indexes | `KIM3310`, `doeon-kim-portfolio` | Keeps the GitHub profile map and standalone systems gallery separate from project code. |

## Public Pin Strategy

| Target story | Suggested pins | Why |
|---|---|---|
| Data center security / infrastructure operations | `doeon-kim-portfolio`, `nw-service-assurance-workbench`, `security-threat-response-workbench`, `AegisOps`, `secure-xl2hwp-local`, `llm-onprem-deployment-kit` | Best match for access/security monitoring, network operations, incident handoff, and controlled local operations. |
| Data operations / BI analyst | `KIM3310`, `Nexus-Hive`, `lakehouse-contract-lab`, `districtpilot-ai`, `enterprise-llm-adoption-kit`, `doeon-kim-portfolio` | Best match for data validation, governed reporting, analytics workflows, and business-facing outputs. |
| AI runtime / LLM systems | `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark`, `ai-agent-production-lab`, `tool-call-finetune-lab`, `enterprise-llm-adoption-kit` | Best match for tool-call reliability, deterministic runtime behavior, evals, traces, and governance. |

## Consolidated Material

| Source Area | Canonical Destination | Current Action |
|---|---|---|
| Provider-specific agent cookbooks | `ai-agent-production-lab/docs/provider-neutral-agent-patterns.md` | Rewritten as provider-neutral runtime and eval patterns. |
| Provider-scale operating notes | `ai-agent-production-lab/docs/provider-neutral-agent-patterns.md` | Folded into budgets, fallbacks, traces, and evaluation gates. |
| Data demo packs and rollout playbooks | `lakehouse-contract-lab/docs/data-platform-operating-patterns.md` | Folded into contract-first pipeline and rollout checklists. |
| Legacy incident and logistics proof paths | `AegisOps`, `lakehouse-contract-lab`, private reliability case studies | Kept discoverable through archive notes or private case-study references. |
| Legacy gallery material | `doeon-kim-portfolio` | Rebuilt as a neutral systems gallery with role-specific packets removed. |

## Archive Status

Twelve repositories have the GitHub archived flag after their reusable ideas were consolidated into active lanes. One additional repository, `twincity-ui`, remains active by GitHub flag but is described as consolidated into active operator-surface repositories. Together these are tracked as thirteen consolidated lanes.

Archived groups:

- legacy incident, logistics, and spatial-ops proofs
- provider-specific agent cookbooks and operating notes
- data-platform demo and rollout notes
- legacy field-playbook material

## Removal Policy

Permanent deletion requires an explicit repository slug list. Until then, archive is the default cleanup action because it is reversible, preserves history, and removes duplicate projects from the active set.

## Public Metadata Policy

- Active public repositories should have a concise GitHub description, 5-8 focused topics, and a README with purpose, run path, verification path, and operating boundaries.
- Archived repositories should start their description with `ARCHIVED:` and should either be archived on GitHub or intentionally kept active for a stated reason.
- Profile-facing descriptions should avoid unsupported claims. Current excluded wording: direct cloud account/resource management that has not been confirmed.
- Military experience should be described as MW communications, squad leadership, CCTV/VMS/NVR operation, access-control records, intrusion-alert monitoring, incident handling, server-room fire response, and standby/shift handoff.

## Verification Checklist

- Local git tree is clean before and after each repository batch.
- Active repositories stay on `main`.
- New consolidation docs avoid external credential requirements.
- Syntax and structured-data checks pass across the workspace.
- GitHub Actions are checked after pushes finish.
