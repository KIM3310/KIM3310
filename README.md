# Doeon Kim

I build reviewable software for AI memory-system co-design and operational decision-making: memory placement experiments, manufacturing control towers, incident response, governed AI workflows, and reliable data/tool pipelines.

My strongest work combines an operator-facing interface with explicit data boundaries, failure handling, tests, and a reproducible review path. Public demos use synthetic or fixture data unless stated otherwise.

## System Overview

| Engineering lane | What I focus on | Best evidence |
|---|---|---|
| AI memory systems | KV-cache placement, HBM/remote-memory trade-offs, falsifiable architecture experiments | `memoryflow-lab` |
| Manufacturing operations | shift handoff, yield excursions, release gates, evidence capture | `fab-ops-yield-control-tower` |
| Incident operations | multimodal triage, replay evaluation, structured reports, operator handoff | `AegisOps` |
| AI governance | RBAC, redaction, audit logs, evaluation gates, rollout controls | `enterprise-llm-adoption-kit` |
| Tool reliability | parser recovery, deterministic mutation tests, retry orchestration | `stage-pilot` |
| Data quality | contracts, rejected-row review, medallion flows, governed exports | `lakehouse-contract-lab` |
| Product delivery | clear workflows, decision states, measurable readiness views | `aix-pilot` |

## Three-Minute Proof

1. [memoryflow-lab](https://github.com/KIM3310/memoryflow-lab): change a memory-system assumption, reproduce the evidence, and inspect 39 tests around capacity, data movement, and counterexamples.
2. [fab-ops-yield-control-tower](https://github.com/KIM3310/fab-ops-yield-control-tower): run the strict gate and inspect 117 tests around synthetic fab, shift, and release workflows.
3. [AegisOps](https://github.com/KIM3310/AegisOps): inspect the incident replay contract, operator handoff, and 172-test verification path.
4. [enterprise-llm-adoption-kit](https://github.com/KIM3310/enterprise-llm-adoption-kit): review governance controls, 257 tests, and the measured coverage gate.
5. [stage-pilot](https://github.com/KIM3310/stage-pilot): review deterministic tool-call mutations, retry behavior, provenance, and 1,726 tests.
6. [lakehouse-contract-lab](https://github.com/KIM3310/lakehouse-contract-lab): inspect contract checks, rejected-row flow, Spark/Delta artifacts, and 96 tests.

## Evaluation Path

- Start with the six systems above rather than the full repository count.
- In each repository, read `System Overview`, `Evaluation Path`, architecture notes, and the local verification command.
- Treat synthetic demos as workflow evidence, not as customer deployments or business traction.
- For implementation depth, move from the interface to tests, fixtures, policy boundaries, and failure states.

## Start Here

| Priority | Repository | Concrete proof | Verification snapshot |
|---:|---|---|---|
| 1 | [memoryflow-lab](https://github.com/KIM3310/memoryflow-lab) | LLM KV-cache co-design lab with HBM capacity gates, tiered-memory traffic, near-memory stress reversal, and reproducible evidence | Ruff, strict mypy, 39 tests, 98.25% coverage, cross-platform evidence check |
| 2 | [fab-ops-yield-control-tower](https://github.com/KIM3310/fab-ops-yield-control-tower) | Semiconductor operations workflow with shift evidence, excursion review, and release controls | Ruff, mypy, 117 tests, smoke check |
| 3 | [AegisOps](https://github.com/KIM3310/AegisOps) | Incident replay, structured evidence, escalation, and operator handoff | Typecheck, 172 tests, 32/32 replay eval, build |
| 4 | [enterprise-llm-adoption-kit](https://github.com/KIM3310/enterprise-llm-adoption-kit) | Governed LLM adoption with RBAC, redaction, audit, eval, and rollout gates | 257 tests, 84.10% coverage, frontend build, backend smoke |
| 5 | [stage-pilot](https://github.com/KIM3310/stage-pilot) | Tool-call reliability lab extending an attributed Apache-2.0 parser baseline | 1,726 tests, typecheck, build, package validation |
| 6 | [lakehouse-contract-lab](https://github.com/KIM3310/lakehouse-contract-lab) | Contracted data pipeline with quality gates and rejected-row handling | 96 tests, Ruff, API smoke; prebuilt Spark/Delta artifacts checked |

Verification snapshot: 2026-08-03 on clean default branches. Repository CI is the current source of truth after later changes.

## Why These Projects Fit Together

```text
Operational signal
      |
      v
validated data -> policy or reliability gate -> operator decision -> audit and handoff
```

The domains differ, but the engineering pattern is consistent:

- make the operational state visible;
- validate inputs before automation acts;
- separate deterministic checks from model-generated output;
- preserve evidence for review and handoff;
- fail clearly when data, policy, or runtime assumptions are missing.

## Additional Technical Evidence

| Repository | Role in the portfolio |
|---|---|
| [aix-pilot](https://github.com/KIM3310/aix-pilot) | Enterprise AI readiness console with operational decision states and a compact QA path |
| [Nexus-Hive](https://github.com/KIM3310/Nexus-Hive) | Governed NL-to-SQL workflow, warehouse adapters, audit trail, and 221 tests |
| [agent-runtime-go](https://github.com/KIM3310/agent-runtime-go) | Small Go orchestration prototype with bounded retries, schema validation, and honest extension limits |
| [doeon-kim-portfolio](https://github.com/KIM3310/doeon-kim-portfolio) | Visual project router with 89 tests and content validation |
| [districtpilot-ai](https://github.com/KIM3310/districtpilot-ai) | Snowflake-oriented analytics workflow with repository validators |
| [secure-xl2hwp-local](https://github.com/KIM3310/secure-xl2hwp-local) | Local-first document automation and signed evidence boundary |

The remaining repositories are experiments, supporting components, or archived work. They are useful for breadth, but they are not the recommended first review path.

## Background

**IT Infrastructure Operations Manager, InterX**<br>
Apr 2026 - May 2026, Seoul

- Supported data-center and IDC operations, security and network monitoring, access administration, backups, assets, licenses, onboarding, and helpdesk workflows.
- Worked with UTM, IPsec VPN, DRM, DLP, NAC, firewall monitoring, Jira, Confluence, and Google Workspace.
- Used Jira automation, recurring reports, vendor coordination, and test environments to improve routine operations.

**MW Communications Soldier / Squad Leader, ROK Defense Communication Command**<br>
Nov 2023 - May 2025, Seongnam

- Led a six-person squad supporting continuous strategic communications operations.
- Handled incident confirmation, reporting, escalation, shift handoff, CCTV/VMS/NVR checks, access records, and communications-room monitoring.
- Supported initial response for network, security, server-room, intrusion, and fire-related alerts.

## Education And Credentials

- Korea National Open University, Computer Science coursework, 2026-present.
- Microsoft AI School 8th Cohort: Azure AI, Copilot, RAG, and enterprise AI deployment training.
- AI Semiconductor Architecture Design and Performance Optimization, Seoul ICT Innovation Square / KAIT, Jul 2026.
- Microsoft Azure AI Fundamentals (AI-900).
- Additional platform coursework and credentials are documented in the individual project evidence where they materially apply.

## Engineering Boundaries

- AI coding tools are part of my workflow. Ownership is demonstrated through requirements, code review, tests, debugging, and final verification rather than keystroke count.
- Synthetic, fixture, and sample data are labeled. Public repositories do not represent customer deployments unless explicitly documented.
- A passing demo is not called production-ready without identity, secrets, monitoring, rollback, support, and environment-specific validation.
- Upstream code and package ownership are attributed; extensions are distinguished from original baselines.

## Architecture And Quality Notes

- [Portfolio architecture index](docs/portfolio-architecture-index-2026-05-30.md)
- [Architecture evidence map](docs/architecture-evidence-map.md)
- [Quality gate](docs/quality-gate.md)
- [Cloud + AI architecture](docs/cloud-ai-architecture.md)
- [Machine-readable architecture manifest](docs/architecture/blueprint.json)
- Validation command: `python3 scripts/validate_architecture_blueprint.py`

## Contact

- GitHub: [KIM3310](https://github.com/KIM3310)
- Portfolio: [kim3310-doeon-kim-portfolio.pages.dev](https://kim3310-doeon-kim-portfolio.pages.dev/)
