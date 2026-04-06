# Deployment External Resource Audit

Date: `2026-04-07`

## Scope

This audit rechecks the public hiring-facing surfaces that are expected to open in a browser today:

1. Primary portfolio and flagship demos
2. Targeted operator-facing live surfaces used in role-fit review paths
3. The exact third-party assets that those live pages currently load from public origins

Checks were repeated with browser-like headers because several Pages or Workers surfaces respond differently to bare CLI defaults than they do to real browsers.

## Current summary

- All nine primary public surfaces checked in this pass responded `200 OK`.
- Live third-party assets currently referenced from those pages were reachable at audit time, with one expected caveat: Google Identity scripts can return `403` to simplistic probes even when they load normally in browsers.
- The portfolio metadata drift found during the initial pass was corrected in source and redeployed during this hardening pass. The live title now returns `Doeon Kim | High-Trust AI Systems Portfolio`.
- No currently referenced primary demo returned `5xx` in this audit.

## Primary public deployment status

| Deployment | Public URL | HTTP | Verification note | Verdict |
|---|---|---:|---|---|
| `doeon-kim-portfolio` | `https://kim3310.github.io/doeon-kim-portfolio/` | 200 | title now returns `Doeon Kim \| High-Trust AI Systems Portfolio` after source refresh and Pages redeploy | OK |
| `stage-pilot` | `https://stage-pilot.pages.dev/` | 200 | title: `StagePilot` | OK |
| `AegisOps` | `https://aegisops-ai-incident-doctor.pages.dev/` | 200 | title: `AegisOps - Incident Review Console` | OK |
| `Nexus-Hive` | `https://nexus-hive.pages.dev/` | 200 | title: `Nexus-Hive \| Executive BI Copilot` | OK |
| `enterprise-llm-adoption-kit` | `https://enterprise-llm-kit.pages.dev/` | 200 | title: `LLM Adoption Atelier` | OK |
| `regulated-case-workbench` | `https://regulated-case-workbench.pages.dev/` | 200 | title: `Regulated Case Workbench` | OK |
| `Upstage-DocuAgent` | `https://upstage-docuagent.pages.dev/` | 200 | title: `DocFlow Agent — Document Review Pipeline` | OK |
| `nw-service-assurance-workbench` | `https://nw-service-assurance-workbench.ehdjs1351.workers.dev/` | 200 | title: `NW Service Assurance Workbench` | OK |
| `security-threat-response-workbench` | `https://security-threat-response-workbench.ehdjs1351.workers.dev/` | 200 | title: `Security Threat Response Workbench` | OK |

## Live external dependencies observed from deployed HTML

| Deployment | External source | Result | Note |
|---|---|---:|---|
| `doeon-kim-portfolio` | `https://cdn.tailwindcss.com` | 200 | Tailwind CDN reachable |
| `doeon-kim-portfolio` | `https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap` | 200 | Font CSS reachable |
| `AegisOps` | `https://accounts.google.com/gsi/client` | 403 with simple probe | Expected anti-bot / browser-sensitive behavior |
| `AegisOps` | `https://cdn.tailwindcss.com` | 200 | Tailwind CDN reachable |
| `AegisOps` | `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap` | 200 | Font CSS reachable |
| `Nexus-Hive` | `https://cdn.jsdelivr.net/npm/chart.js` | 200 | Chart.js CDN reachable |
| `Nexus-Hive` | `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap` | 200 | Font CSS reachable |
| `enterprise-llm-adoption-kit` | `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4973160293737562` | 200 | AdSense script reachable |
| `Upstage-DocuAgent` | `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4973160293737562` | 200 | AdSense script reachable |

## What changed in this hardening pass

1. Local verification was rerun across the public flagship set and selective private-depth repos used in the portfolio truth surface.
2. Python-heavy repos that were failing on stale virtual environments now self-heal missing `pip` or broken venv wrappers during `make install` / `make verify`.
3. The portfolio truth surface now links directly to this dated deployment audit so live-reachability evidence is easy to inspect.
4. The portfolio `index.html` metadata was refreshed and GitHub Pages was redeployed successfully after confirming the live site was still serving an older title/OG snapshot.
5. The GitHub Pages workflow was opted into forced Node 24 JavaScript action execution to reduce near-term risk from the Pages action deprecation notice.

## Important caveats

1. `200 OK` proves current reachability, not end-to-end success for any authenticated workflow behind the UI.
2. Browser-sensitive assets can still reject simplistic probes while working fine in a real session.
3. GitHub Pages now deploys cleanly, but `actions/configure-pages@v5` and `actions/upload-artifact@v4` still report a Node 20 deprecation notice while being forced onto Node 24. That is mitigated for now, but upstream action updates are still worth watching.

## Final verdict

The public proof surface is broadly healthy: primary demos are up, currently referenced third-party assets are reachable, the portfolio metadata mismatch has been corrected live, and the only remaining deploy note is a mitigated Pages action deprecation warning rather than a current outage.
