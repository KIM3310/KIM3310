# KIM3310

Technical project index for AI systems, agent runtimes, secure automation, operations dashboards, and applied ML pipelines.

This page is intentionally written as a neutral engineering map. It focuses on runnable projects, verification paths, architecture notes, and operational boundaries.

## Project Lanes

| Lane | Repositories | What to inspect |
|---|---|---|
| Agent reliability | `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark`, `ai-agent-production-lab` | tool-call parsing, retry behavior, deterministic tests, benchmark harnesses |
| LLM governance | `enterprise-llm-adoption-kit`, `tool-call-finetune-lab` | policy gates, redaction, evals, audit logging, routing boundaries |
| Secure document automation | `secure-xl2hwp-local` | local processing, signed audit artifacts, template drift detection |
| Operations workbenches | `AegisOps`, `ops-reliability-workbench`, `security-threat-response-workbench`, `ai-security-redteam-lab` | dashboards, handoff flows, mock/live mode separation, route contracts |
| Data contracts | `lakehouse-contract-lab`, `Nexus-Hive` | quality gates, governed analytics, local fixtures, export boundaries |
| Manufacturing and field operations | `fab-ops-yield-control-tower`, `weld-defect-vision` | incident queues, shift evidence, model serving, validation notes |
| Medical-image workflow | `retina-scan-ai` | model card, explainability, risk notes, validation templates |
| Compact experiments | `SteadyTap`, `multi-cli-pilot`, `qwen-pilot`, `smallbiz-ops-copilot` | CLI adapters, deterministic fixtures, small product surfaces |

## Suggested Reading Order

1. `stage-pilot` - TypeScript tool-call reliability package and runtime.
2. `agent-runtime-go` - Minimal Go runtime for deterministic tool execution.
3. `enterprise-llm-adoption-kit` - Governance and evaluation surface for LLM workflows.
4. `secure-xl2hwp-local` - Local-first document automation with signed evidence.
5. `AegisOps` - Incident operations surface with replay and handoff contracts.
6. `security-threat-response-workbench` - Self-contained incident-response simulation.
7. `fab-ops-yield-control-tower` - Manufacturing operations APIs and handoff evidence.
8. `weld-defect-vision` and `retina-scan-ai` - Applied ML pipelines with governance notes.

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
