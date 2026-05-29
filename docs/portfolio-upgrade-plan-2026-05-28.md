# KIM3310 Portfolio Upgrade Plan - 2026-05-28

## Snapshot

- Account: `KIM3310`
- Accessible repositories: 50
- Public repositories: 44
- Active public repositories: 32
- Private active repositories visible in metadata: 6
- Archived public repositories: 12

## Portfolio Standard

Every active public repository should answer five questions within the first screen:

1. What problem does it solve?
2. What can a reviewer run or inspect?
3. What safety, data, or operating boundary is explicit?
4. What verification command proves the core path?
5. How does it connect to the broader systems portfolio?

The commercial layer adds three more signals:

1. Who is the likely buyer or user?
2. What is the smallest paid or packaged route?
3. What proof artifact makes the repository credible in under one minute?

Detailed map: [Commercialization and Review Map - 2026-05-28](commercialization-review-map-2026-05-28.md)

## Flagship Tier

These repositories define the front-door story and get the highest polish:

| Repository | Role in portfolio | Required finish |
|---|---|---|
| `aix-pilot` | Enterprise GenAI pilot product surface | Live service, PPT/video pack, RAG/Agent/DLP/KPI tests |
| `KIM3310` | Account-level index and reading order | Curated start-here table, audit links, neutral operating narrative |
| `doeon-kim-portfolio` | Public gallery site | AIX Pilot surfaced first, verified content, GitHub Pages deploy |
| `enterprise-llm-adoption-kit` | LLM governance platform | FastAPI/React verification, security scan, technical review pack |
| `stage-pilot` | Tool-call reliability runtime | Package surface, parser benchmark, deterministic tests |
| `AegisOps` | Incident operations workbench | Replay evals, operator handoff, response workflow |
| `Nexus-Hive` | Governed analytics | Policy checks, audit trails, chart output, warehouse adapters |
| `lakehouse-contract-lab` | Data contracts | Quality gates, rejected-row review, medallion pipeline fixtures |

## Active Repository Lanes

| Lane | Repositories | Polish target |
|---|---|---|
| Enterprise GenAI and governance | `aix-pilot`, `enterprise-llm-adoption-kit`, `llm-onprem-deployment-kit`, `tool-call-finetune-lab` | Trust controls, evals, deployment boundaries, review packs |
| Agent runtime reliability | `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark`, `ai-agent-production-lab`, `ai-security-redteam-lab`, `multi-cli-pilot`, `qwen-pilot` | Deterministic fixtures, retries, trace evidence, safety checks |
| Infrastructure and security operations | `AegisOps`, `security-threat-response-workbench`, `nw-service-assurance-workbench`, `secure-xl2hwp-local` | Handoff flows, audit evidence, runbooks, local-first safety |
| Data and analytics governance | `Nexus-Hive`, `lakehouse-contract-lab`, `districtpilot-ai` | Contract checks, governed queries, export boundaries |
| Manufacturing and applied ML | `fab-ops-yield-control-tower`, `weld-defect-vision`, `retina-scan-ai`, `quantum-workbench` | Validation notes, model-risk boundaries, operator surfaces |
| Product experiments | `the-savior`, `dream-interpretation-pages`, `SteadyTap`, `ecotide`, `beaver-study-orchestrator`, `kbbq-idle-unity`, `twincity-ui` | Clear scope, demo path, archived/superseded notes when needed |

## Execution Order

1. Keep `aix-pilot`, `KIM3310`, and `doeon-kim-portfolio` aligned because they are the first impression.
2. Verify and polish flagship repositories one by one with small commits.
3. Add or refresh README first-screen proof blocks: live URL, run command, verification command, safety boundary.
4. Keep archived repositories quiet and clearly superseded instead of trying to make every old experiment look current.
5. Avoid inflated claims. Prefer concrete proof: tests, build output, live URL, generated report, audit log, or benchmark fixture.

## Verification Commands

Profile repository:

```bash
python3 scripts/validate_repository_surface.py
python3 scripts/validate_architecture_blueprint.py
```

Portfolio gallery:

```bash
npm run verify
```

AIX Pilot:

```bash
npm run qa
npm audit --omit=dev
```

## Remote Workflow Snapshot

Checked active public repositories on 2026-05-28 through GitHub Actions metadata. The latest workflow run visible for each active public repository was successful at scan time.

| Repository | Latest visible workflow |
|---|---|
| `aix-pilot` | QA - success |
| `KIM3310` | Repository Health - success |
| `doeon-kim-portfolio` | Secret Scan / Repository Surface / CI / Pages deploy - success |
| `enterprise-llm-adoption-kit` | production-smoke - success |
| `AegisOps` | production-smoke - success |
| `twincity-ui` | production-smoke - success |
| `kbbq-idle-unity` | backend-ops-monitor - success |
| `weld-defect-vision` | Export ONNX - success |
| `stage-pilot` | Dependabot Updates - success |
| Remaining active public repositories | Latest visible Secret Scan - success |

The next high-value pass is to run deeper repo-native verification on the flagship tier, then refresh each README first screen with proof blocks: live URL, verification command, safety boundary, and representative screenshot or report artifact.
