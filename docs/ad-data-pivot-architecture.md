# Ad and Aggregate Data Pivot Architecture

This is the central source of truth for advertising boundaries and anonymous aggregate-data collection across the 35 active `KIM3310` repositories. The machine-readable contract is `docs/ad-data-pivot-manifest.json`.

## Operating Contract

- `jalhae` is explicitly excluded because it is not in the active 35-repository monetization catalog.
- Every active repository can participate in ad-supported revenue through policy-eligible public content/resource pages.
- Sensitive app, upload, result, dashboard, admin, inquiry, payment, diagnostic, incident, medical, security, and private workflow surfaces remain ad-free.
- Google advertising consent is handled by the publisher account's certified consent platform; contextual or limited ads are used where required.
- Consent defaults to off. `DNT: 1` or enabled Global Privacy Control fails closed.
- Data value is limited to consented anonymous aggregate insights.
- Sale of personal, sensitive, raw, event-level, or re-identifiable data is forbidden.

## Generator Contract

`scripts/generate_ad_data_pivot.mjs` is deterministic and dependency-free. It defaults to check mode and writes only when called with `--write`.

When run with `--write` from `KIM3310`, it creates or updates:

- Each repository: `docs/ad-data-manifest.json`, `docs/ad-data-architecture.md`, every existing source `service-offer.json` copy, and a README marker block.
- Central portfolio: one original, indexable readiness utility per repository under `doeon-kim-portfolio/public/resources/<repo>/`, the shared consent-gated runtime, aggregate benchmark panel, sitemap, `ads.txt`, and public data policy.
- Firebase control plane: deny-by-default Firestore rules and a public aggregate-only collection in project `kim3310-free-tools`.

Check mode computes the same file set and reports drift without mutating any repository.

## Runtime Contract

The generated runtime is intentionally narrow:

- consent is off until the visitor enables anonymous aggregate counts;
- `navigator.doNotTrack`, `window.doNotTrack`, `navigator.globalPrivacyControl`, or an explicit config disable stops collection;
- only four manifest-allowlisted event names are accepted;
- payloads are reduced to `{ repo, event, surface, consentVersion }`;
- no raw inputs, URLs, referrers, titles, account IDs, user IDs, session IDs, IP addresses, files, prompts, medical details, security incident details, or payment details are transmitted;
- events are sent by `POST` to the absolute central `/api/events` endpoint;
- readiness checklist selections stay in browser-local storage and never enter the event payload.

## Storage Contract

- Cloudflare D1 stores daily aggregate counters plus short-lived salted abuse-control counters.
- Firestore stores curated public aggregate snapshots only.
- Firestore client writes are denied. All unspecified documents are denied.
- Private inquiry records remain in a separate D1 table and are never joined to resource-event data.
- Firestore is on the Spark plan with no billing account linked; quotas are monitored rather than treated as unlimited.

## Revenue Contract

All 35 repositories participate through their central public resource page. This does not mean every application screen receives ads. Sensitive and task-focused application flows stay ad-free, which protects usability, security, and ad-policy compliance.

The AdSense loader and `ads.txt` are code-ready. Actual ad serving and revenue still depend on Google's site review, policy checks, traffic quality, regional consent, and advertiser demand; implementation cannot guarantee revenue.

## Validation

`scripts/validate_ad_data_pivot.py` verifies the manifest against the existing monetization catalog and the user-facing policy boundaries. It also statically checks the generator templates for the privacy runtime requirements without executing the generator.
