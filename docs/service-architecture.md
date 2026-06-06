# Service Architecture - KIM3310

This document defines the deployment and resource plan for turning this repository into a buyer-reviewable service. It intentionally avoids public financial assumptions, public financial guesses, or contract assumptions.

## Commercial Role

- **Lane:** GitHub profile router
- **Primary buyer:** Technical evaluators and buyers entering through the GitHub account
- **First motion:** Use profile to route to the portfolio and top service architectures

## Recommended Architecture

README/profile-first router to portfolio, pinned repositories aligned to architecture lanes, no backend required.

~~~text
Visitor or operator
  -> public proof surface
  -> scoped app/API layer when a buyer workflow needs state
  -> managed data, object storage, queue, and observability only after scope is approved
  -> signed report, demo, export, or operating handoff
~~~

## Resource Plan

| Resource | Use | Buy timing |
| --- | --- | --- |
| Static hosting | GitHub Pages or Cloudflare Pages for a public, cacheable proof surface with custom-domain routing later. | Already sufficient for proof surfaces unless a custom domain is needed. |
| App/API runtime | Render, Fly.io, Railway, or Cloudflare Workers for a small API runtime only after a real workflow needs server state. | Buy only when a pilot needs authenticated workflows, integrations, or server-side jobs. |
| Data layer | Supabase or Neon Postgres for relational state; Cloudflare D1 only when the app is Workers-first and relational needs are small. | Buy after the workflow has real state, roles, or audit history. |
| Object storage | Cloudflare R2 or S3-compatible storage for uploads, reports, screenshots, model artifacts, or signed exports. | Buy when reports, uploads, signed exports, or model artifacts must persist. |
| Queue/cache | Upstash Redis/QStash or Cloudflare Queues for async jobs, retries, scheduled checks, and rate-limited workflows. | Buy when jobs, retries, scheduling, rate limits, or async processing appear. |
| Observability | Sentry plus privacy-safe web analytics for errors, performance, and buyer-flow learning without storing private visitor data. | Enable before external users test the service. |

## Repo-Specific Resources

- GitHub profile README
- pinned repo order
- custom-domain portfolio link

## Information Needed From Account Owner

- none

## Revenue Channel Architecture

- **Primary channel:** Proof-led portfolio and lead routing
- **Monetization route:** Profile and proof router that moves visitors toward portfolio, GitHub evidence, and private service scoping.
- **Acquisition motion:** Search, GitHub, LinkedIn, YouTube proof clips, technical reviewers, founders, and technical buyer referrals.
- **Activation path:** Keep links current, highlight the strongest proof, and route serious inquiries to a private intake flow.
- **Margin control:** Keep the public surface static and fast; add CRM, calendar, payment, and analytics only when inbound volume justifies it.
- **Public boundary:** Keep revenue, pricing, and contract assumptions in private planning; this repository publishes service structure, resource needs, and technical proof only.

## Cost and Risk Controls

- keep profile concise
- avoid public financial assumptions
- route to architecture proof instead of claims

## Production Readiness Checklist

- Public demo route or README proof link is current.
- Service boundary states what the system does and does not do.
- Data storage, retention, and deletion path are defined before private data is accepted.
- Secrets are stored in platform secret managers, never committed to the repo.
- Spend limits, usage alerts, or manual approval gates are enabled before buyer testing.
- Logs and analytics avoid private payloads.
- Rollback or disable path exists for every external integration.
