# Service Consolidation and Pivot Plan - 2026-06-25

This is the money-focused operating map after granting permission to pivot, rename, hide, delete, or consolidate services. The implementation chooses **commercial aliases and buyer-lane consolidation first** instead of hard-deleting repositories, because link equity, audit history, and existing PRs are more valuable than destructive cleanup.

## Policy

- Rename policy: Use commercial aliases in README/portfolio/CTAs first. Do not rename GitHub repositories while open PRs and inbound links depend on current URLs; revisit physical renames after lanes convert.
- Deletion policy: Do not hard-delete code. Remove low-ROI repos from buyer paths, keep archives read-only, and use guarded parked states for consumer/finance/medical risks.
- Public front doors should show the commercial lane name, not a flat list of experiments.

## Commercial operating lanes

| Lane | Buyer | Primary repos | Supporting repos | Paid motion |
|---|---|---|---|---|
| **AIX Governance Sprint** | enterprise AI leader, CTO, platform/security lead | `aix-pilot`, `enterprise-llm-adoption-kit`, `llm-onprem-deployment-kit` | `ai-security-redteam-lab`, `ai-agent-production-lab`, `tool-call-finetune-lab`, `claude-production-patterns`, `m365-copilot-adoption-command-center` | fixed-scope governance sprint, adoption evidence bundle, private deployment add-on |
| **StagePilot Reliability Lab** | AI product team, agent platform engineer, developer tools founder | `stage-pilot`, `agent-runtime-go`, `agent-orchestration-benchmark` | `multi-cli-pilot`, `qwen-pilot`, `claude-agent-cookbook`, `cohere-agent-cookbook` | private benchmark scenario pack, hosted regression dashboard, adapter implementation support |
| **AegisOps Response Room** | SOC/NOC/IDC/IT operations manager, MSP, infrastructure lead | `AegisOps`, `security-threat-response-workbench`, `nw-service-assurance-workbench` | `ops-reliability-workbench`, `honeypot`, `Aegis-Air`, `the-logistics-prophet` | tabletop scenario workspace, incident replay pack, recurring service assurance report |
| **Nexus Data Contract Lab** | data platform lead, analytics engineering lead, operations BI owner | `Nexus-Hive`, `lakehouse-contract-lab`, `secure-xl2hwp-local` | `districtpilot-ai`, `snowflake-demo-pack`, `snowflake-customer-onboarding-90day-playbook`, `fde-engagement-playbook` | connector pack, data-quality migration sprint, audit/report export bundle |
| **SmallBiz Checkout Ops Pilot** | owner-operated shop, agency ops lead, Korean SMB support team | `smallbiz-ops-copilot` | `regulated-case-workbench`, `Upstage-DocuAgent`, `memory-test-master-change-gate` | single-vertical setup package with approval-safe inbox, public-data enrichment, and checkout readiness |
| **Industrial Validation Pack** | manufacturing operations, factory analytics, industrial AI validation lead | `fab-ops-yield-control-tower`, `weld-defect-vision` | `memory-test-master-change-gate`, `dv-regression-lab` | synthetic control tower workshop, private dataset evaluation, model-card/report package |

## Repository exposure decisions

| # | Repo | Current status | Commercial lane | Exposure state | Action |
|---:|---|---|---|---|---|
| 1 | `KIM3310` | public / active | none | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 2 | `doeon-kim-portfolio` | public / active | none | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 3 | `aix-pilot` | public / active | aix-governance-sprint | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 4 | `enterprise-llm-adoption-kit` | public / active | aix-governance-sprint | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 5 | `stage-pilot` | public / active | stagepilot-reliability-lab | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 6 | `agent-runtime-go` | public / active | stagepilot-reliability-lab | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 7 | `agent-orchestration-benchmark` | public / active | stagepilot-reliability-lab | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 8 | `AegisOps` | public / active | aegisops-response-room | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 9 | `security-threat-response-workbench` | public / active | aegisops-response-room | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 10 | `nw-service-assurance-workbench` | public / active | aegisops-response-room | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 11 | `Nexus-Hive` | public / active | nexus-data-contract-lab | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 12 | `lakehouse-contract-lab` | public / active | nexus-data-contract-lab | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 13 | `secure-xl2hwp-local` | public / active | nexus-data-contract-lab | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 14 | `llm-onprem-deployment-kit` | public / active | aix-governance-sprint | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 15 | `Upstage-DocuAgent` | private / active | smallbiz-checkout-ops | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 16 | `honeypot` | private / active | aegisops-response-room | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 17 | `smallbiz-ops-copilot` | private / active | smallbiz-checkout-ops | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 18 | `regulated-case-workbench` | private / active | smallbiz-checkout-ops | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 19 | `ops-reliability-workbench` | private / active | aegisops-response-room | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 20 | `memory-test-master-change-gate` | private / active | smallbiz-checkout-ops | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 21 | `twincity-ui` | public / active | none | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 22 | `districtpilot-ai` | public / active | nexus-data-contract-lab | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 23 | `fab-ops-yield-control-tower` | public / active | industrial-validation-pack | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 24 | `weld-defect-vision` | public / active | industrial-validation-pack | primary-commercial | Keep public, polish deeply, and route CTAs here first. |
| 25 | `tool-call-finetune-lab` | public / active | aix-governance-sprint | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 26 | `ai-agent-production-lab` | public / active | aix-governance-sprint | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 27 | `ai-security-redteam-lab` | public / active | aix-governance-sprint | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 28 | `multi-cli-pilot` | public / active | stagepilot-reliability-lab | supporting-proof | Keep as proof/supporting asset; link only from matching commercial lane. |
| 29 | `beaver-study-orchestrator` | public / active | none | parked-low-ticket-consumer-education | Remove from primary buyer path; keep verified only when cheap. |
| 30 | `SteadyTap` | public / active | none | parked-guarded-accessibility-wellness | Remove from primary buyer path; keep verified only when cheap. |
| 31 | `dream-interpretation-pages` | public / active | none | parked-consumer-content | Remove from primary buyer path; keep verified only when cheap. |
| 32 | `kbbq-idle-unity` | public / active | none | parked-game-distribution-dependent | Remove from primary buyer path; keep verified only when cheap. |
| 33 | `the-savior` | public / active | none | parked-guarded-wellness | Remove from primary buyer path; keep verified only when cheap. |
| 34 | `quantum-workbench` | public / active | none | parked-education-research | Remove from primary buyer path; keep verified only when cheap. |
| 35 | `retina-scan-ai` | public / active | none | guarded-medical-research-only | Keep strict safety/compliance framing; do not sell outcomes or signals. |
| 36 | `the-logistics-prophet` | public / archived | aegisops-response-room | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 37 | `Aegis-Air` | public / archived | aegisops-response-room | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 38 | `ecotide` | public / archived | none | archived-parked-education-sim | Keep archived/read-only; mine patterns into active lanes only. |
| 39 | `ogx` | public / archived | none | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 40 | `signal-risk-lab` | public / archived | none | guarded-finance-archive | Keep strict safety/compliance framing; do not sell outcomes or signals. |
| 41 | `dv-regression-lab` | public / archived | industrial-validation-pack | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 42 | `m365-copilot-adoption-command-center` | public / archived | aix-governance-sprint | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 43 | `crypto-signal-ai` | public / archived | none | guarded-finance-archive | Keep strict safety/compliance framing; do not sell outcomes or signals. |
| 44 | `claude-production-patterns` | public / archived | aix-governance-sprint | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 45 | `snowflake-demo-pack` | public / archived | nexus-data-contract-lab | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 46 | `claude-agent-cookbook` | public / archived | stagepilot-reliability-lab | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 47 | `fde-engagement-playbook` | public / archived | nexus-data-contract-lab | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 48 | `cohere-agent-cookbook` | public / archived | stagepilot-reliability-lab | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 49 | `snowflake-customer-onboarding-90day-playbook` | public / archived | nexus-data-contract-lab | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |
| 50 | `qwen-pilot` | public / archived | stagepilot-reliability-lab | archived-supporting-proof | Keep archived/read-only; mine patterns into active lanes only. |

## What changed in practice

- P0/P1 repos become the only first-click buyer path.
- Consumer, game, wellness, finance-signal, and medical-adjacent projects are parked or guarded unless real demand appears.
- Archived repositories remain read-only and contribute patterns/content only through active commercial lanes.
- The portfolio storefront should lead with commercial lanes and push raw repo browsing below the fold.

