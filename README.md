# Doeon Kim

I build software around difficult constraints: uncertain model output, limited memory, sensitive data, and failures that need a clear recovery path.

[Selected work](https://kim3310.github.io/doeon-kim-portfolio/) · [LinkedIn](https://www.linkedin.com/in/doeon-kim-4742a2388)

## Selected work

| Project | What to inspect | Reproduce |
|---|---|---|
| **[AegisOps](https://github.com/KIM3310/AegisOps)** | A complete incident-review workflow: typed model output, replay evaluation, session persistence, and handoff. | `npm ci && npm run verify` |
| **[IdleMesh](https://kim3310.github.io/doeon-kim-portfolio/#project-idlemesh)** | Task scheduling, fresh attempt tokens, stale-result rejection, and local HTTP recovery with real CPU work. | Private source; 17 local tests + recovery proof |
| **[MemoryFlow Lab](https://github.com/KIM3310/memoryflow-lab)** | Page-aware KV-cache modeling, capacity constraints, sensitivity analysis, and measurement boundaries. | `make install && make verify` |
| **[Nexus-Hive](https://github.com/KIM3310/Nexus-Hive)** | SQL syntax-tree policy, warehouse adapters, and execution that stops for review or denial. | `make install && make verify` |
| **[StagePilot](https://github.com/KIM3310/stage-pilot)** | Tool-call recovery with bounded retries and per-case benchmark outcomes. An attributed extension of upstream Apache-2.0 code. | `pnpm install --frozen-lockfile && pnpm verify` |
| **[TwinCity UI](https://github.com/KIM3310/twincity-ui)** | Spatial event mapping, incident triage, transport fallback and an interactive console built from the production components. | `npm ci && npm run verify` |
| **[Lakehouse Contract Lab](https://github.com/KIM3310/lakehouse-contract-lab)** | Real Spark/Delta execution, quality gates, timezone-stable exports and independent table readback. | Java 17; `make install && .venv/bin/python -m scripts.verify_spark_runtime` |
| **[SteadyTap](https://github.com/KIM3310/SteadyTap)** | Shared Swift calibration core, native gesture flow and on-device release behavior. | `./scripts/verify_cli.sh && make verify-app-store`; native CI |
| **[Memory Change Gate](https://kim3310.github.io/doeon-kim-portfolio/#project-memory-test-master-change-gate)** | Snapshot-bound dependency checks, approval conditions, rollback, and bounded bundle verification. | Private source; 127 tests + eight synthetic scenarios |
| **[Secure XL2HWP](https://github.com/KIM3310/secure-xl2hwp-local)** | Contract-driven spreadsheet cleanup, template mapping, and repeatable local exports. | `make install && make verify` |
| **[Tool-Call Fine-Tune Lab](https://github.com/KIM3310/tool-call-finetune-lab)** | Context isolation, complete JSON scoring, grouped data splits, and source-fingerprinted evaluator contracts. | `make install && make verify && make proof` |
| **[LLM On-Prem Deployment Kit](https://github.com/KIM3310/llm-onprem-deployment-kit)** | Terraform, Helm, actual Kubernetes rollout, HTTPS routing, secret wiring and recovery. | `make verify && make validate`; Kubernetes CI |
| **[KBBQ Idle Unity](https://github.com/KIM3310/kbbq-idle-unity)** | Shared Unity/.NET economy math, bounded offline rewards and historical WebGL provenance. | `dotnet test sim/KbbqIdle.Sim.Tests && make verify` |

The thirteen projects are ordered by complementary technical capability. Public repositories link the design decisions to implementation and tests. Demo fixtures, analytical estimates, measured results, and upstream contributions are identified at their source. The two private projects expose summaries only. Fine-Tune Lab demonstrates evaluation correctness. The infrastructure smoke uses synthetic inference, and the Unity WebGL preview is the historical 2026-02-20 build. Physical-device, GPU training and model-quality gains are not claimed.

[Local performance observations](https://kim3310.github.io/doeon-kim-portfolio/evidence/local-measurements.json) record a single Mac and synthetic workloads; they are not production SLAs or LLM benchmarks.

[Architecture index](docs/portfolio-architecture-index.md) · [Cloud architecture](docs/cloud-ai-architecture.md) · [Blueprint](docs/architecture/blueprint.json) · [Blueprint validator](scripts/validate_architecture_blueprint.py)
