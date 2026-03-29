# Deployment External Resource Audit

Date: `2026-03-29`

## Scope

This audit separates two things:

1. **Code-declared external services** found in local repo scans
2. **Page-observed external resources** found from the public deployment HTML itself

Public deployment URLs were checked with live HTTP requests. For selected third-party assets, exact asset URLs were also fetched directly.

## Local mitigations applied after the audit

- `Upstage-DocuAgent` source was updated so the public feedback button now falls back to **GitHub Issues** when no private endpoint is configured. The placeholder Formspree input was removed from local source and will disappear after redeploy.
- `doeon-kim-portfolio` source was updated to use the final `twincity-ui` Cloud Run URL directly instead of the older redirecting `pages.dev` URL.
- Internal analysis notes were updated so the broken `.lhr.life` tunnels are no longer treated as recommended demo surfaces.

## Highest-priority findings

1. `memory-test-master-change-gate` public deployment is currently **down**: `https://04bc8dd7120470.lhr.life/` returned `503 Service Unavailable`.
2. `ops-reliability-workbench` public deployment is currently **down**: `https://c2d1de755ed92b.lhr.life/` returned `503 Service Unavailable`.
3. `Upstage-DocuAgent` exposes a **Formspree placeholder**, not a configured endpoint. The page shows `placeholder="Formspree endpoint (https://formspree.io/f/...)"`, so the community/contact external resource is not fully wired by default.
4. `twincity-ui.pages.dev` currently resolves to a **Cloud Run app** at `https://twincity-ui-app-811356341663.asia-northeast3.run.app/`. That may be intentional, but it should be documented because the published demo origin is no longer the final serving origin.
5. `enterprise-llm-adoption-kit`, `Upstage-DocuAgent`, `the-logistics-prophet`, and `kbbq-idle-unity` load **Google AdSense** on the public page surface. The asset itself responded `200`, but the dependency is visible and should be treated as an external runtime dependency.

## Public deployment status and page-observed external resources

| Deployment | Public URL | HTTP | Final URL | Page-observed external origins | Verdict |
|---|---|---:|---|---|---|
| `doeon-kim-portfolio` | `https://kim3310.github.io/doeon-kim-portfolio/` | 200 | same | `esm.sh`, `fonts.googleapis.com`, `fonts.gstatic.com`, `www.googletagmanager.com` | OK |
| `stage-pilot` | `https://stage-pilot.pages.dev/` | 200 | same | `fonts.googleapis.com`, `fonts.gstatic.com`, `github.com` | OK |
| `AegisOps` | `https://aegisops-ai-incident-doctor.pages.dev/` | 200 | same | `accounts.google.com`, `cdn.tailwindcss.com`, `esm.sh`, `fonts.googleapis.com`, `img.youtube.com` | OK |
| `Nexus-Hive` | `https://nexus-hive.pages.dev/` | 200 | same | `cdn.jsdelivr.net`, `fonts.googleapis.com`, `nexus-hive-api-811356341663.asia-northeast3.run.app` | OK |
| `enterprise-llm-adoption-kit` | `https://enterprise-llm-kit.pages.dev/` | 200 | same | `pagead2.googlesyndication.com` | OK with ad dependency |
| `regulated-case-workbench` | `https://regulated-case-workbench.pages.dev/` | 200 | same | `fonts.googleapis.com`, `fonts.gstatic.com`, `github.com` | OK |
| `memory-test-master-change-gate` | `https://04bc8dd7120470.lhr.life/` | 503 | same | none observed | FAIL |
| `ops-reliability-workbench` | `https://c2d1de755ed92b.lhr.life/` | 503 | same | none observed | FAIL |
| `Upstage-DocuAgent` | `https://upstage-docuagent.pages.dev/` | 200 | same | `fonts.googleapis.com`, `formspree.io`, `github.com`, `pagead2.googlesyndication.com` | Mixed: page up, Formspree not fully configured |
| `twincity-ui` | `https://twincity-ui.pages.dev/` | 200 | `https://twincity-ui-app-811356341663.asia-northeast3.run.app/` | redirect target is external Cloud Run app | OK with redirect caveat |
| `honeypot` | `https://honeypot-proto.vercel.app/` | 200 | same | `cdnjs.cloudflare.com` | OK |
| `the-logistics-prophet` | `https://the-logistics-prophet.pages.dev/` | 200 | same | `github.com`, `pagead2.googlesyndication.com` | OK with ad dependency |
| `signal-risk-lab` | `https://kim3310.github.io/signal-risk-lab/` | 200 | same | none observed in landing HTML | OK |
| `Aegis-Air` | `https://aegis-air.pages.dev/` | 200 | same | none observed in landing HTML | OK |
| `secure-xl2hwp-local` | `https://secure-xl2hwp-local.pages.dev/` | 200 | same | `fonts.googleapis.com`, `fonts.gstatic.com`, `github.com` | OK |
| `SteadyTap` | `https://steadytap.pages.dev/` | 200 | same | `fonts.googleapis.com`, `fonts.gstatic.com`, `github.com` | OK |
| `the-savior` | `https://the-savior-9z8.pages.dev/` | 200 | same | `fonts.googleapis.com`, `fonts.gstatic.com` | OK |
| `kbbq-idle-unity` | `https://kbbq-idle-unity.pages.dev/` | 200 | same | `fonts.googleapis.com`, `fonts.gstatic.com`, `github.com`, `pagead2.googlesyndication.com` | OK with ad dependency |

## Exact third-party asset checks

These were fetched directly, not inferred from root origins:

| Asset URL | Result |
|---|---:|
| `https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap` | 200 |
| `https://www.googletagmanager.com/gtm.js?id=GTM-MHK4C4D7` | 200 |
| `https://esm.sh/react@^19.2.4` | 200 |
| `https://esm.sh/framer-motion@^12.34.0` | 200 |
| `https://cdn.jsdelivr.net/npm/chart.js` | 200 |
| `https://accounts.google.com/gsi/client` | 200 with browser-like headers |
| `https://cdn.tailwindcss.com` | 200 |
| `https://img.youtube.com/vi/FOcjPcMheIg/maxresdefault.jpg` | 200 |
| `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4973160293737562` | 200 |
| `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` | 200 |

## Publicly observable backend/API endpoints

| Service | Probe | Result |
|---|---|---|
| `Nexus-Hive` API | `https://nexus-hive-api-811356341663.asia-northeast3.run.app` | 200 |
| `Nexus-Hive` docs | `https://nexus-hive-api-811356341663.asia-northeast3.run.app/docs` | 200 and Swagger UI visible |
| `twincity-ui` runtime target | `https://twincity-ui-app-811356341663.asia-northeast3.run.app` | 200 |

## Code-declared external services found in local repo scans

This table is based on local repo content, not only what the public page HTML exposes.

| Repo | Code-scan external service signals |
|---|---|
| `doeon-kim-portfolio` | Snowflake, Databricks, AWS Bedrock, DynamoDB, SQS, BigQuery, Gemini/Google AI, Upstage, Ollama, Azure, Cloudflare, Vercel |
| `stage-pilot` | AWS S3, BigQuery, GCS, Gemini/Google AI, OpenAI, Ollama, Azure, Cloudflare, Vercel |
| `AegisOps` | AWS S3, SQS, BigQuery, GCS, Gemini/Google AI, OpenAI, Ollama, Cloudflare |
| `Nexus-Hive` | Snowflake, Databricks, BigQuery, OpenAI, Ollama, Cloudflare |
| `enterprise-llm-adoption-kit` | Snowflake, Databricks, AWS Bedrock, S3, DynamoDB, OpenAI, Ollama, Azure, Cloudflare |
| `lakehouse-contract-lab` | Snowflake, Databricks, AWS S3, OpenAI, Azure |
| `retina-scan-ai` | AWS S3 |
| `Upstage-DocuAgent` | OpenAI, Upstage, Ollama, Cloudflare |
| `regulated-case-workbench` | OpenAI, Cloudflare |
| `memory-test-master-change-gate` | no clear third-party service string found in the current local scan |
| `ops-reliability-workbench` | Cloudflare |

## Repos with no local clone available for code scan

These had public page checks only:

- `twincity-ui`
- `honeypot`
- `the-logistics-prophet`
- `signal-risk-lab`
- `Aegis-Air`
- `secure-xl2hwp-local`
- `SteadyTap`
- `the-savior`
- `kbbq-idle-unity`

## Important caveats

1. A `200` from a page or asset proves that the public resource is reachable now. It does **not** prove that every authenticated backend flow behind the UI is usable end-to-end.
2. Some integrations are injected at runtime from client code and may not appear in the first HTML response. `AegisOps` AdSense behavior is one example; local code shows it even though the landing HTML did not expose it immediately.
3. Root-origin checks can be misleading. For services like Google Fonts or GTM, the origin root may return `404` while the exact asset URL returns `200`. That is why the exact asset checks above matter more.
4. For repos without a public deployment URL in the current portfolio, only code-level external-service scanning was possible in this audit.

## Recommended fixes

1. Restore or retire the two broken `.lhr.life` deployments so the portfolio does not point to `503` pages.
2. Replace the `Upstage-DocuAgent` Formspree placeholder with a real endpoint or remove the form UI entirely.
3. Document the `twincity-ui.pages.dev -> Cloud Run` redirect explicitly, or update the canonical demo URL to the final served origin.
4. Decide intentionally whether AdSense belongs on portfolio/demo surfaces for hiring use. It is currently a real external dependency on multiple pages.
