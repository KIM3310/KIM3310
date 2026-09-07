# Doeon Kim

I build software around difficult constraints: uncertain model output, limited memory, sensitive data, and failures that need a clear recovery path.

[Selected work](https://kim3310-doeon-kim-portfolio.pages.dev/) · [LinkedIn](https://www.linkedin.com/in/doeon-kim-4742a2388)

## Selected work

| Project | What to inspect | Reproduce |
|---|---|---|
| **[AegisOps](https://github.com/KIM3310/AegisOps)** | A complete incident-review workflow: typed model output, replay evaluation, session persistence, and handoff. | `npm ci && npm run verify` |
| **[MemoryFlow Lab](https://github.com/KIM3310/memoryflow-lab)** | Page-aware KV-cache modeling, capacity constraints, sensitivity analysis, and measurement boundaries. | `make install && make verify` |
| **[Nexus-Hive](https://github.com/KIM3310/Nexus-Hive)** | SQL syntax-tree policy, warehouse adapters, and execution that stops for review or denial. | `make install && make verify` |
| **[StagePilot](https://github.com/KIM3310/stage-pilot)** | Tool-call recovery with bounded retries and per-case benchmark outcomes. An attributed extension of upstream Apache-2.0 code. | `pnpm install --frozen-lockfile && pnpm verify` |
| **[Secure XL2HWP](https://github.com/KIM3310/secure-xl2hwp-local)** | Contract-driven spreadsheet cleanup, template mapping, and repeatable local exports. | `make install && make verify` |

Each repository links the design decisions to implementation and tests. Demo fixtures, analytical estimates, measured results, and upstream contributions are identified at their source.

More focused work: [Go agent runtime](https://github.com/KIM3310/agent-runtime-go), [data contracts](https://github.com/KIM3310/lakehouse-contract-lab), and [spatial operations](https://github.com/KIM3310/twincity-ui).

[Architecture index](docs/portfolio-architecture-index.md) · [Cloud architecture](docs/cloud-ai-architecture.md) · [Blueprint](docs/architecture/blueprint.json) · [Blueprint validator](scripts/validate_architecture_blueprint.py)
