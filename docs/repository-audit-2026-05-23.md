# Repository Portfolio Audit - 2026-05-23

## Scope

- Account: `KIM3310`
- Accessible repositories: 49
- Public active repositories: 30
- Public archived repositories: 13
- Private active repositories visible through the GitHub connector: 6

This audit is intended as a portfolio maintenance map: what to polish first, what to archive cleanly, and what verification should run before deeper code upgrades.

## Executive Read

The repository set is already more organized than a typical personal GitHub profile. Most active public repositories have README files, topics, CI workflows, tests, security files, and explicit project positioning. The next upgrade is portfolio-level compression rather than basic cleanup.

The account should present a smaller number of flagship repositories as the primary proof surface, then let archived and compact experiments support that story.

## Flagship Candidates

These repositories should receive the highest polish because they best express the profile thesis:

| Repository | Why it matters |
|---|---|
| `AegisOps` | Incident analysis, multimodal ops, replay evaluation, and handoff discipline. |
| `stage-pilot` | Tool-calling reliability runtime with productizable package positioning. |
| `enterprise-llm-adoption-kit` | Enterprise AI governance, policy gates, evals, and rollout controls. |
| `Nexus-Hive` | Governed NL-to-SQL analytics with audit trails and warehouse adapters. |
| `lakehouse-contract-lab` | Data contracts, quality gates, medallion pipeline, and export boundaries. |
| `agent-orchestration-benchmark` | Benchmark surface for agent orchestration runtimes. |
| `llm-onprem-deployment-kit` | Private and hybrid LLM deployment story with Terraform/Helm/runbooks. |
| `doeon-kim-portfolio` | Public project gallery and GitHub Pages entrypoint. |

## Active Public Repositories

- `AegisOps`
- `agent-orchestration-benchmark`
- `agent-runtime-go`
- `ai-agent-production-lab`
- `ai-security-redteam-lab`
- `beaver-study-orchestrator`
- `crypto-signal-ai`
- `districtpilot-ai`
- `doeon-kim-portfolio`
- `dream-interpretation-pages`
- `ecotide`
- `enterprise-llm-adoption-kit`
- `fab-ops-yield-control-tower`
- `kbbq-idle-unity`
- `KIM3310`
- `lakehouse-contract-lab`
- `llm-onprem-deployment-kit`
- `multi-cli-pilot`
- `Nexus-Hive`
- `nw-service-assurance-workbench`
- `qwen-pilot`
- `quantum-workbench`
- `retina-scan-ai`
- `secure-xl2hwp-local`
- `security-threat-response-workbench`
- `stage-pilot`
- `SteadyTap`
- `the-savior`
- `tool-call-finetune-lab`
- `twincity-ui`
- `weld-defect-vision`

## Private Active Repositories

Metadata-visible only:

- `Upstage-DocuAgent`
- `honeypot`
- `smallbiz-ops-copilot`
- `regulated-case-workbench`
- `ops-reliability-workbench`
- `memory-test-master-change-gate`

## Archived Public Repositories

- `Aegis-Air`
- `claude-agent-cookbook`
- `claude-production-patterns`
- `cohere-agent-cookbook`
- `dv-regression-lab`
- `fde-engagement-playbook`
- `m365-copilot-adoption-command-center`
- `ogx`
- `signal-risk-lab`
- `snowflake-customer-onboarding-90day-playbook`
- `snowflake-demo-pack`
- `the-logistics-prophet`

## Main Findings

### 1. Avoid one giant cross-repo change

The portfolio is broad enough that upgrades should happen as small, reviewable PRs. One branch per repository or one branch per tightly related repository family is safer than a single sweeping rewrite.

### 2. Normalize license metadata

Public metadata suggests missing or ambiguous license state on:

- `weld-defect-vision`
- `retina-scan-ai`
- `crypto-signal-ai`
- `m365-copilot-adoption-command-center` (archived)
- `stage-pilot` (`NOASSERTION`)
- `tool-call-finetune-lab` (`NOASSERTION`)

Recommended action: add or clarify `LICENSE` files and README license notes, especially for active repositories.

### 3. Clean up archived repository issues

Archived repositories should not look operationally active unless that is intentional. Close stale issues with a short supersession note or disable issues on archived repositories.

### 4. Make the front door sharper

The profile README and portfolio site should lead with a smaller proof map:

- AI reliability and agent runtimes
- Enterprise AI governance
- Data and analytics governance
- Ops / SRE / security workbenches
- Industrial and medical AI prototypes
- Mobile / Swift experiments

### 5. Secret hygiene appears intentional, but a few filenames are noisy

Secret-related path scans found templates, secret-scan workflows, Kubernetes Secret templates, and secret manager declarations. Sampled files did not show live credentials.

Paths that may alarm reviewers unless documented:

- `Nexus-Hive/infra/k8s/secret.yaml`
- `Nexus-Hive/infra/terraform/secrets.tf`
- `enterprise-llm-adoption-kit/infra/k8s/secret.yaml.example`

## Verification Performed

- Listed accessible repositories through the GitHub connector.
- Confirmed the installed GitHub App account is `KIM3310`.
- Confirmed no organization accounts were visible through the connector.
- Pulled public repository metadata through the GitHub API.
- Inspected recursive public file trees for active public repositories.
- Checked signals for README, license files, CI workflows, SECURITY.md, package manifests, Python project files, and tests.
- Sampled secret-related files through the GitHub connector.
- Shallow-cloned a subset of active public repositories for local inspection before bulk clone transport instability interrupted the run.
- Python compile checks passed on the cloned Python subset: `beaver-study-orchestrator`, `fab-ops-yield-control-tower`, `kbbq-idle-unity`, and `lakehouse-contract-lab`.

Full JavaScript/TypeScript verification was not run because the local environment exposed `node` but not `npm`. Full GitHub Actions and dependency verification should be rerun after `gh` and `npm` are available locally.

## Recommended Execution Queue

1. Polish `KIM3310` and `doeon-kim-portfolio` as the public front door.
2. Polish `AegisOps`, `stage-pilot`, and `agent-runtime-go` as the AI/runtime/ops proof set.
3. Polish `enterprise-llm-adoption-kit`, `Nexus-Hive`, and `lakehouse-contract-lab` as the governance/data proof set.
4. Resolve or triage open issues in `llm-onprem-deployment-kit`.
5. Normalize license metadata in active repos with missing or ambiguous license signals.
6. Add clear superseded-by links to archived repositories.
7. Run full test/dependency verification per repository before deeper code upgrades.
