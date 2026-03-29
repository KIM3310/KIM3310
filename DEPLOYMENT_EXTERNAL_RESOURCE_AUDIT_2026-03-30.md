# Deployment External Resource Audit

Date: `2026-03-30`

## Scope

This audit focuses on the public hiring-facing surfaces that are expected to open in a browser today:

1. Primary portfolio and flagship demos
2. Representative archived demos that still appear in public proof paths
3. Exact third-party assets that those pages depend on at runtime

Checks were repeated with browser-like headers because several Cloudflare-hosted pages reject bare CLI defaults with `403` even when the same page renders normally in a browser.

## Current summary

- All primary public demo surfaces checked in this pass responded `200 OK` with browser-like requests.
- Recent public-surface cleanup is reflected live:
  - private GitHub proof links were removed from public truth surfaces where needed
  - `regulated-case-workbench` now points public proof buttons at live runtime routes
  - `Upstage-DocuAgent` no longer relies on a placeholder public Formspree flow
- No currently referenced flagship deployment in this audit returned `5xx`.
- Remaining caveats are mostly expected anti-bot or auth-gated endpoints such as LinkedIn, Hugging Face, or some npm page fetches from CLI tooling.

## Primary public deployment status

| Deployment | Public URL | HTTP | Verification note | Verdict |
|---|---|---:|---|---|
| `doeon-kim-portfolio` | `https://kim3310.github.io/doeon-kim-portfolio/` | 200 | title: `Doeon Kim \| High-Trust AI Systems Portfolio` | OK |
| `stage-pilot` | `https://stage-pilot.pages.dev/` | 200 | title: `StagePilot` | OK |
| `AegisOps` | `https://aegisops-ai-incident-doctor.pages.dev/` | 200 | title: `AegisOps - Incident Review Console` | OK |
| `Nexus-Hive` | `https://nexus-hive.pages.dev/` | 200 | title: `Nexus-Hive \| Executive BI Copilot` | OK |
| `enterprise-llm-adoption-kit` | `https://enterprise-llm-kit.pages.dev/` | 200 | page content includes `Enterprise LLM Adoption Kit` | OK |
| `regulated-case-workbench` | `https://regulated-case-workbench.pages.dev/` | 200 | page content includes `Open runtime brief` | OK |
| `Upstage-DocuAgent` | `https://upstage-docuagent.pages.dev/` | 200 | page content includes `DocuAgent` | OK |
| `nw-service-assurance-workbench` | `https://nw-service-assurance-workbench.ehdjs1351.workers.dev/` | 200 | page content includes `NW Service Assurance Workbench` | OK |
| `security-threat-response-workbench` | `https://security-threat-response-workbench.ehdjs1351.workers.dev/` | 200 | page content includes `Security Threat Response Workbench` | OK |

## Additional public demo checks

| Deployment | Public URL | HTTP | Verdict |
|---|---|---:|---|
| `signal-risk-lab` | `https://signal-risk-lab.pages.dev/` | 200 | OK |
| `honeypot-3st` | `https://honeypot-3st.pages.dev/` | 200 | OK |
| `honeypot` | `https://honeypot-proto.vercel.app/` | 200 | OK |
| `the-logistics-prophet` | `https://the-logistics-prophet.pages.dev/` | 200 | OK |
| `secure-xl2hwp-local` | `https://secure-xl2hwp-local.pages.dev/` | 200 | OK |
| `SteadyTap` | `https://steadytap.pages.dev/` | 200 | OK |
| `the-savior` | `https://the-savior-9z8.pages.dev/` | 200 | OK |
| `kbbq-idle-unity` | `https://kbbq-idle-unity.pages.dev/` | 200 | OK |
| `Aegis-Air` | `https://aegis-air.pages.dev/` | 200 | OK |
| `twincity-ui` | `https://twincity-ui-app-811356341663.asia-northeast3.run.app/` | 200 | OK |

## Exact third-party asset checks

| Asset URL | Result | Note |
|---|---:|---|
| `https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap` | 200 | font CSS reachable |
| `https://www.googletagmanager.com/gtm.js?id=GTM-MHK4C4D7` | 200 | GTM asset reachable |
| `https://accounts.google.com/gsi/client` | 200 with full browser headers | simplistic CLI headers may return `403` |
| `https://cdn.tailwindcss.com` | 200 | CDN reachable |
| `https://esm.sh/react@^19.2.4` | 200 | module CDN reachable |
| `https://esm.sh/framer-motion@^12.34.0` | 200 | module CDN reachable |
| `https://cdn.jsdelivr.net/npm/chart.js` | 200 | CDN reachable |
| `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4973160293737562` | 200 | ad dependency reachable where used |
| `https://giscus.app/client.js` | 200 | discussion widget reachable |
| `https://www.clarity.ms/tag/test` | 204 | expected no-content response |
| `https://img.youtube.com/vi/FOcjPcMheIg/maxresdefault.jpg` | 200 | thumbnail reachable |

## Publicly observable backend and runtime targets

| Service | Probe | Result |
|---|---|---|
| `Nexus-Hive` API | `https://nexus-hive-api-811356341663.asia-northeast3.run.app` | 200 |
| `Nexus-Hive` API docs | `https://nexus-hive-api-811356341663.asia-northeast3.run.app/docs` | 200 |
| `twincity-ui` runtime target | `https://twincity-ui-app-811356341663.asia-northeast3.run.app` | 200 |

## Repos intentionally not treated as public web deployments

These repos exist locally and are valid portfolio proof, but they are not treated as always-on public websites in this audit:

- `memory-test-master-change-gate`
- `ops-reliability-workbench`
- other private or selective-review repos referenced only behind explicit sharing boundaries

Their absence from the public deployment table is intentional, not a current outage finding.

## Important caveats

1. `200 OK` proves a public page or asset is reachable now. It does not prove every authenticated workflow behind the UI is usable end to end.
2. Some Cloudflare-hosted surfaces return `403` to non-browser client defaults while still rendering normally in browsers. Browser-like request headers were used to avoid false negatives.
3. Some proof links outside the deployed apps are intentionally difficult to machine-verify:
   - LinkedIn may return `999`
   - Hugging Face model pages may return `401`
   - npm package pages may return bot-protection `403`
4. Several demos intentionally load external monetization or analytics assets such as AdSense, GTM, Giscus, or Clarity. Those dependencies are reachable at the time of this audit.

## Actions completed before this audit closed

1. Removed public-facing links that pointed to private GitHub repos where that would create avoidable `404` proof paths.
2. Updated `regulated-case-workbench` public buttons and metadata to use live runtime proof routes instead of private GitHub documents.
3. Redeployed `regulated-case-workbench` after the public-route cleanup and confirmed the live page now exposes the updated proof entry points.
4. Re-ran repo-level verification for the recently touched flagship repos and cleaned generated junk artifacts from tracked worktrees.

## Final verdict

The current public portfolio surface is in good shape for hiring review. Primary demos are up, the main external runtime resources are reachable, and the biggest earlier proof-surface mismatches were cleaned up. The remaining edge cases are mostly expected auth or anti-bot behaviors on third-party platforms rather than breakage in the deployed portfolio itself.
