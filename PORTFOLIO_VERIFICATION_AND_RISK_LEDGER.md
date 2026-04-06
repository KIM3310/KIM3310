# Portfolio Verification And Risk Ledger

Generated via `python3 scripts/build_portfolio_ledger.py`

Verified baseline date: `2026-04-07`

This ledger exists to keep the portfolio honest and interview-safe. It separates:

- **Locally verified proof:** reproducible install, test, lint, typecheck, build, or smoke paths completed on this machine
- **Env-gated proof:** integrations that are real in architecture but require credentials, cloud tenancy, or optional vendor availability
- **Bounded claims:** synthetic, demo, or reviewer-safe assets that should never be described as production customer evidence

## Public flagship verification

| Repo | Verified command | Local proof captured | Remaining boundary |
|---|---|---|---|
| `stage-pilot` | `npm run verify` | 187 test files / 1,724 tests plus package and DTS build | Provider-backed integrations remain optional and env-gated |
| `AegisOps` | `npm run verify` | 28 test files / 169 tests, 32 replay-eval checks, review-surface smoke, production build | Live cloud connectors depend on credentials and vendor uptime |
| `tool-call-finetune-lab` | `make verify` | 109 tests plus Ruff and repo-local release-status artifacts | Kaggle/Hugging Face publication still depends on valid third-party credentials and recoverable model weights |
| `Nexus-Hive` | `make verify` | clean Python 3.11 bootstrap, backend verify path, warehouse adapter tests | Live Snowflake/Databricks access still requires tenant auth |
| `enterprise-llm-adoption-kit` | `make verify` | backend tests, frontend build, smoke path, coverage | Bedrock and warehouse persistence remain credential-gated |
| `lakehouse-contract-lab` | `make verify` | self-healing Python 3.11 bootstrap, 81 tests, lint, prebuilt artifact validation, smoke path | Fresh Spark assembly and hosted warehouse export proof still depend on local Java and external tenants |

## Selective private-depth verification

| Repo | Verified command | Local proof captured | Remaining boundary |
|---|---|---|---|
| `memory-test-master-change-gate` | `make verify` | Ruff, mypy, 27 pytest cases | Foundry sync is still env-gated |
| `ops-reliability-workbench` | `make verify` | Ruff, mypy, 28 pytest cases | Optional OpenAI assist remains off by default and env-gated |
| `regulated-case-workbench` | `make verify` | 13 backend tests, frontend syntax checks, runtime scorecard validation | Cases stay synthetic and the public live lane is intentionally capped |
| `retina-scan-ai` | `make verify` | 392 pytest cases, validation artifact generation, smoke path | Synthetic engineering validation is not clinical/regulatory evidence |
| `Upstage-DocuAgent` | `make verify` | pytest, Ruff, format checks, smoke validation | Upstage/Ollama/GCP-backed paths require local provider setup |

## What changed during hardening

- Python-heavy repos now prefer explicit modern bootstraps (`python3.11` or `python3.12`) instead of silently reusing stale local virtual environments.
- Makefiles for the Python repos self-heal broken or pre-upgrade virtual environments before install, which removes a recurring false-negative setup risk on this machine.
- Repo READMEs now expose a consistent `Hiring Fit And Proof Boundary` section so reviewers can distinguish authored proof from bounded demo scaffolding.
- Verified repos now carry a `Latest Verified Snapshot` section so the strongest local proof path is easy to repeat.
- `tool-call-finetune-lab` now also carries repo-local release-status artifacts so Kaggle/Hugging Face publication blockers are explicit instead of hidden behind stale links.
- Public deployment and external-asset checks now live in a separate dated audit so browser-reachability evidence stays distinct from local verification evidence.

## Irreducible external dependencies

These are real boundaries, not failures:

1. Cloud-backed proofs still depend on credentials, tenant state, and vendor uptime.
2. Public certification badges are stable, but deep issuer verification URLs can change over time, so they are shared in application packets rather than hard-coded into every surface.
3. Private/high-trust workbenches intentionally hide tenant labels, sensitive workflows, or operational identifiers; those repos should be disclosed selectively or via public-lite versions.
4. Medical, regulated, and incident-review demos use synthetic or reviewer-safe datasets and must not be described as customer production evidence.

## Promotion map by target role

### Big tech / applied AI platform

- Lead with `stage-pilot`, `AegisOps`, and `enterprise-llm-adoption-kit`
- Support with `tool-call-finetune-lab`
- Keep the story on reliability, evals, delivery surfaces, and operator-safe runtime review

### Snowflake / Databricks

- Lead with `Nexus-Hive`, `lakehouse-contract-lab`, and `enterprise-llm-adoption-kit`
- Support with `stage-pilot` only when the role leans into agent reliability
- Keep the story on governed analytics, warehouse interoperability, contracts, and evaluable agent behavior

### Palantir / field engineering / deployment strategy

- Lead with `AegisOps`
- Selectively add `memory-test-master-change-gate`, `ops-reliability-workbench`, and `regulated-case-workbench`
- Keep the story on operator workflows, auditability, release gates, and ambiguous real-world decision support

### Applied vision / regulated AI

- Lead with `retina-scan-ai`
- Support with `regulated-case-workbench` when the role cares about high-trust workflow design
- Keep the story on engineering validation, reporting, operational monitoring, and explicit claim boundaries

## Next proof upgrades worth doing

1. Publish one public-lite version of a private operational workbench with tenant-specific labels removed.
2. Add one merged external OSS contribution that aligns with the flagship runtime/data-platform story.
3. Capture short walkthrough videos or GIFs for the highest-signal proof path in each flagship repo.
4. Keep rerunning the listed verification commands after substantial changes so the snapshot dates stay current.
