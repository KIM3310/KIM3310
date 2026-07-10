# Archive Cleanup Plan - 2026-05-23

## Purpose

Archived repositories should support the current portfolio instead of competing with it. Each archived repository should either point to an active successor or remain clearly marked as historical material.

## Cleanup Rules

1. Keep archived repositories archived unless there is a clear reason to revive them.
2. Add a top-of-README archive banner where missing.
3. Link each archived repository to its active successor repository.
4. Close stale open issues with a short supersession note.
5. Disable issues on archived repositories if no further public discussion is expected.
6. Do not rewrite history or delete repositories during cleanup.

## Successor Map

| Archived repository | Suggested successor | Cleanup action |
|---|---|---|
| `Aegis-Air` | `AegisOps`, `security-threat-response-workbench` | Point to active incident/security operations surfaces. |
| `the-logistics-prophet` | `lakehouse-contract-lab`, `Nexus-Hive`, `fab-ops-yield-control-tower` | Point to active data-contract and operations workbench repos. |
| `ogx` | `multi-cli-pilot`, `stage-pilot`, `agent-orchestration-benchmark` | Point to active CLI/runtime orchestration repos. |
| `signal-risk-lab` | `Nexus-Hive`, `lakehouse-contract-lab` | Point to governed analytics and data-quality proof. |
| `m365-copilot-adoption-command-center` | `enterprise-llm-adoption-kit` | Point to provider-neutral enterprise AI governance kit. |
| `fde-engagement-playbook` | `enterprise-llm-adoption-kit` | Point to governance and rollout material. |
| `snowflake-demo-pack` | `lakehouse-contract-lab`, `districtpilot-ai` | Point to active Snowflake/data platform proof. |
| `snowflake-customer-onboarding-90day-playbook` | `lakehouse-contract-lab`, `enterprise-llm-adoption-kit` | Point to contract-first data and rollout governance repos. |
| `dv-regression-lab` | `agent-orchestration-benchmark`, `stage-pilot` | Point to active runtime reliability and benchmark proof. |
| `claude-agent-cookbook` | `ai-agent-production-lab`, `agent-orchestration-benchmark` | Point to provider-neutral agent production lab. |
| `claude-production-patterns` | `ai-agent-production-lab`, `enterprise-llm-adoption-kit` | Point to provider-neutral production and governance material. |
| `cohere-agent-cookbook` | `ai-agent-production-lab`, `agent-orchestration-benchmark` | Point to provider-neutral agent production lab. |

## Issue Cleanup Queue

Archived repositories with open issue counts from public metadata:

- `Aegis-Air`: 4
- `the-logistics-prophet`: 3
- `ogx`: 2
- `signal-risk-lab`: 1
- `m365-copilot-adoption-command-center`: 3

Recommended close note:

```markdown
Closing as part of archive cleanup. This repository is intentionally archived and the maintained successor is: <successor repo link>.
```

## License Cleanup Queue

Active repositories requiring explicit license review:

- `weld-defect-vision`: no GitHub license metadata observed.
- `retina-scan-ai`: no GitHub license metadata observed.
- `crypto-signal-ai`: no GitHub license metadata observed.
- `stage-pilot`: `package.json` declares `Apache-2.0`, but GitHub reports `NOASSERTION`; the `LICENSE` file should be reviewed because the copyright notice appears inconsistent with the repository owner/package metadata.
- `tool-call-finetune-lab`: `pyproject.toml` declares `Apache-2.0`, but GitHub reports `NOASSERTION`; verify whether GitHub license detection is blocked by formatting.

Do not auto-assign a license without owner confirmation. License changes are legal changes, not cosmetic cleanup.

## Verification Needed Before Merge

- Confirm README archive banners on each archived repository.
- Confirm issue cleanup targets manually before closing.
- Confirm license intent for active repositories before editing license files.
- Rerun dependency and test checks after `gh`, `npm`, and package managers are available locally.
