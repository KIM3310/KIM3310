# Repository Consolidation Map

This map defines the current repository shape after cleanup. It keeps active projects easy to inspect and moves duplicate or narrow proof paths toward archive status instead of leaving several overlapping stories alive at once.

## Canonical Repositories

| Lane | Keep Active | Why It Stays Active |
|---|---|---|
| Agent runtime reliability | `stage-pilot`, `agent-runtime-go`, `ai-agent-production-lab` | Covers package-level parsing, a minimal runtime, and deterministic production tests. |
| Agent evaluation and orchestration | `agent-orchestration-benchmark`, `tool-call-finetune-lab`, `multi-cli-pilot`, `qwen-pilot` | Keeps benchmarks, model-tuning experiments, and CLI orchestration separated by execution mode. |
| Governance and secure automation | `enterprise-llm-adoption-kit`, `secure-xl2hwp-local`, `regulated-case-workbench` | Keeps policy gates, local document conversion, redaction, and signed evidence in focused surfaces. |
| Operations workbenches | `AegisOps`, `ops-reliability-workbench`, `security-threat-response-workbench`, `ai-security-redteam-lab` | Keeps incident operations, reliability workflows, security triage, and red-team testing as the main operations lane. |
| Data contracts | `lakehouse-contract-lab`, `Nexus-Hive` | Keeps contract-first pipelines and governed analytics as the main data lane. |
| Applied ML | `fab-ops-yield-control-tower`, `weld-defect-vision`, `retina-scan-ai` | Keeps industrial and medical-image workflows where model behavior is paired with validation notes. |
| Compact product experiments | `SteadyTap`, `smallbiz-ops-copilot`, `beaver-study-orchestrator`, `dream-interpretation-pages`, `the-savior`, `crypto-signal-ai`, `quantum-workbench`, `districtpilot-ai`, `ecotide`, `kbbq-idle-unity` | Kept as smaller product or domain experiments unless their functionality is later merged into a flagship lane. |

## Consolidated Material

| Source Area | Canonical Destination | Current Action |
|---|---|---|
| Provider-specific agent cookbooks | `ai-agent-production-lab/docs/provider-neutral-agent-patterns.md` | Rewritten as provider-neutral runtime and eval patterns. |
| Provider-scale operating notes | `ai-agent-production-lab/docs/provider-neutral-agent-patterns.md` | Folded into budgets, fallbacks, traces, and evaluation gates. |
| Data demo packs and rollout playbooks | `lakehouse-contract-lab/docs/data-platform-operating-patterns.md` | Folded into contract-first pipeline and rollout checklists. |
| Legacy incident and logistics proof paths | `AegisOps`, `ops-reliability-workbench`, `lakehouse-contract-lab` | Kept discoverable only through archive notes. |
| Personal site index | `KIM3310/README.md` | Replaced by a neutral technical project index. |

## Archive Queue

These repositories are safe archive candidates because their main ideas now point to stronger active repositories:

| Repository | Replacement |
|---|---|
| `Aegis-Air` | `AegisOps`, `ops-reliability-workbench` |
| `dv-regression-lab` | `stage-pilot` |
| `ogx` | `stage-pilot`, `multi-cli-pilot` |
| `signal-risk-lab` | `Nexus-Hive`, `regulated-case-workbench` |
| `the-logistics-prophet` | `ops-reliability-workbench`, `lakehouse-contract-lab` |
| `twincity-ui` | `AegisOps`, `ops-reliability-workbench` |
| `claude-agent-cookbook` | `ai-agent-production-lab` |
| `claude-production-patterns` | `ai-agent-production-lab` |
| `cohere-agent-cookbook` | `ai-agent-production-lab` |
| `snowflake-demo-pack` | `lakehouse-contract-lab` |
| `snowflake-customer-onboarding-90day-playbook` | `lakehouse-contract-lab` |
| `m365-copilot-adoption-command-center` | `enterprise-llm-adoption-kit` |
| `doeon-kim-portfolio` | `KIM3310` |
| `fde-engagement-playbook` | `enterprise-llm-adoption-kit` |

## Removal Policy

Permanent deletion requires an explicit repository slug list. Until then, archive is the default cleanup action because it is reversible, preserves history, and removes duplicate projects from the active set.

## Verification Checklist

- Local git tree is clean before and after each repository batch.
- Active repositories stay on `main`.
- New consolidation docs avoid external credential requirements.
- Syntax and structured-data checks pass across the workspace.
- GitHub Actions are checked after pushes finish.
