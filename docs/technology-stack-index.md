# Technology Stack Index

This index groups the portfolio by implementation stack and system architecture surface.

The main signal is the pattern that repeats across repositories: define a bounded operator problem, build a working surface, document the runtime and data boundary, and keep the architecture attachment close to the code.

## Stack Lanes

| Stack lane | System pattern | Start with |
|---|---|---|
| TypeScript / React / Vite / Next.js | Public product surfaces, operations consoles, dashboard flows, and edge-ready UIs. | `aix-pilot`, `stage-pilot`, `AegisOps`, `twincity-ui` |
| Python / FastAPI / data tooling | Governance APIs, controlled automation, analytics workflows, evaluation harnesses, and report generation. | `enterprise-llm-adoption-kit`, `Nexus-Hive`, `lakehouse-contract-lab` |
| Go runtime | Compact agent runtime with typed tools, provider adapters, retries, and traceable execution. | `agent-runtime-go` |
| Data / SQL / Spark / Snowflake | Contracted data flows, governed query paths, rejected-row review, feature marts, and public-data rollout maps. | `lakehouse-contract-lab`, `districtpilot-ai`, `Nexus-Hive` |
| Terraform / Docker / local compose | Deployment boundaries, local repeatability, infrastructure modules, and environment-controlled services. | `llm-onprem-deployment-kit`, `enterprise-llm-adoption-kit`, `stage-pilot` |
| SwiftUI / Unity / local-first surfaces | Native, mobile, game, accessibility, and local runtime proof surfaces. | `SteadyTap`, `kbbq-idle-unity`, `secure-xl2hwp-local` |
| Applied ML / vision / explainability | Model-serving boundaries, validation notes, explainability artifacts, and human-reviewed outputs. | `weld-defect-vision`, `retina-scan-ai`, `fab-ops-yield-control-tower` |

## Architecture Attachments

Every active public repository has a `docs/system-architecture.md` attachment that points to the repository-local service architecture, cloud/AI architecture, architecture manifest, operating model, and quality gate.

| Repository | Primary stack | Architecture attachment |
|---|---|---|
| `stage-pilot` | TypeScript, package runtime, Terraform, Docker | [system architecture](https://github.com/KIM3310/stage-pilot/blob/main/docs/system-architecture.md) |
| `enterprise-llm-adoption-kit` | Python, FastAPI, Docker, Terraform | [system architecture](https://github.com/KIM3310/enterprise-llm-adoption-kit/blob/main/docs/system-architecture.md) |
| `AegisOps` | React, TypeScript, incident workflow UI | [system architecture](https://github.com/KIM3310/AegisOps/blob/main/docs/system-architecture.md) |
| `agent-runtime-go` | Go runtime | [system architecture](https://github.com/KIM3310/agent-runtime-go/blob/main/docs/system-architecture.md) |
| `aix-pilot` | React, Vite, TypeScript, evaluation UI | [system architecture](https://github.com/KIM3310/aix-pilot/blob/main/docs/system-architecture.md) |
| `Nexus-Hive` | Python, governed analytics, adapters | [system architecture](https://github.com/KIM3310/Nexus-Hive/blob/main/docs/system-architecture.md) |
| `lakehouse-contract-lab` | Python, Spark, data contracts | [system architecture](https://github.com/KIM3310/lakehouse-contract-lab/blob/main/docs/system-architecture.md) |
| `twincity-ui` | Next.js, TypeScript, operations UI | [system architecture](https://github.com/KIM3310/twincity-ui/blob/main/docs/system-architecture.md) |

## Reading Order By Stack

1. Frontend/runtime surfaces: `doeon-kim-portfolio`, `aix-pilot`, `stage-pilot`, `twincity-ui`.
2. Backend/governance surfaces: `enterprise-llm-adoption-kit`, `Nexus-Hive`, `secure-xl2hwp-local`.
3. Data systems: `lakehouse-contract-lab`, `districtpilot-ai`, `fab-ops-yield-control-tower`.
4. Infrastructure and controlled deployment: `llm-onprem-deployment-kit`, `stage-pilot`, `enterprise-llm-adoption-kit`.
5. Local, native, and applied ML surfaces: `SteadyTap`, `kbbq-idle-unity`, `weld-defect-vision`, `retina-scan-ai`.
