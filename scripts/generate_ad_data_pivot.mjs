#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const kimRoot = path.join(root, "KIM3310");
const manifestPath = path.join(kimRoot, "docs/ad-data-pivot-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const checkMode = !process.argv.includes("--write");

const markerStart = "<!-- KIM3310:AD-DATA-PIVOT:START -->";
const markerEnd = "<!-- KIM3310:AD-DATA-PIVOT:END -->";
const adsensePublisherId = "ca-pub-4973160293737562";
const portfolioBaseUrl = "https://kim3310-doeon-kim-portfolio.pages.dev";

const evidenceByRepo = {
  AegisOps: "/evidence/live/preview/aegisops.webp",
  "Nexus-Hive": "/evidence/live/preview/nexus-hive.webp",
  SteadyTap: "/evidence/live/preview/steadytap.webp",
  "Upstage-DocuAgent": "/evidence/live/preview/upstage-docuagent.webp",
  "agent-runtime-go": "/evidence/agent-runtime-trace.svg",
  "ai-agent-production-lab": "/evidence/ai-agent-production-report.svg",
  "aix-pilot": "/evidence/live/preview/aix-pilot.webp",
  "districtpilot-ai": "/evidence/districtpilot-public-api-readiness.svg",
  "enterprise-llm-adoption-kit": "/evidence/live/preview/enterprise-llm-adoption-kit.webp",
  "fab-ops-yield-control-tower": "/evidence/live/preview/fab-ops-yield-control-tower.webp",
  "kbbq-idle-unity": "/evidence/live/preview/kbbq-idle-unity.webp",
  "lakehouse-contract-lab": "/evidence/lakehouse-contract-board.svg",
  "nw-service-assurance-workbench": "/evidence/live/preview/nw-service-assurance-workbench.webp",
  "regulated-case-workbench": "/evidence/live/preview/regulated-case-workbench.webp",
  "retina-scan-ai": "/evidence/retina-scan-ai-research.svg",
  "secure-xl2hwp-local": "/evidence/live/preview/secure-xl2hwp-local.webp",
  "security-threat-response-workbench": "/evidence/live/preview/security-threat-response-workbench.webp",
  "smallbiz-ops-copilot": "/evidence/live/preview/smallbiz-ops-copilot.webp",
  "stage-pilot": "/evidence/live/preview/stage-pilot.webp",
  "twincity-ui": "/evidence/live/preview/twincity-ui.webp",
  "weld-defect-vision": "/evidence/weld-defect-vision-board.svg",
};

function prettyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function plannedFile(file, content) {
  return { file, content };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeUrl(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

function runtimeConfig(entry) {
  return {
    repo: entry.repo,
    endpoint: manifest.central_event_endpoint,
    benchmarkEndpoint: manifest.central_benchmark_endpoint,
    consentVersion: manifest.consent_version,
    consentStorageKey: ["kim3310", "aggregate", "consent"].join("-"),
    consentDefault: false,
    dntGpcFailClosed: true,
    allowedEvents: entry.allowed_aggregate_event_set,
    dataAsset: entry.data_asset,
    adPlacementBoundary: entry.ad_placement_boundary,
  };
}

function runtimeJs() {
  return `(() => {
  "use strict";

  const script = document.currentScript;
  const configUrl = script?.dataset?.config || "./ad-data-config.json";
  let config = null;
  let consent = false;
  let resourceViewSent = false;

  function privacySignalBlocksCollection() {
    return navigator.globalPrivacyControl === true ||
      navigator.doNotTrack === "1" ||
      window.doNotTrack === "1";
  }

  function readStoredConsent() {
    if (!config || privacySignalBlocksCollection()) return false;
    try {
      return window.localStorage.getItem(config.consentStorageKey) === "granted";
    } catch {
      return false;
    }
  }

  function writeStoredConsent(value) {
    try {
      window.localStorage.setItem(config.consentStorageKey, value ? "granted" : "denied");
      return true;
    } catch {
      return false;
    }
  }

  function updateConsentPanel() {
    const panel = document.querySelector("[data-consent-panel]");
    if (!panel) return;
    const status = panel.querySelector("[data-consent-status]");
    const allow = panel.querySelector("[data-consent-allow]");
    const deny = panel.querySelector("[data-consent-deny]");
    if (status) {
      status.textContent = privacySignalBlocksCollection()
        ? "Privacy signal detected. Aggregate measurement is off."
        : consent
          ? "Anonymous aggregate measurement is on."
          : "Anonymous aggregate measurement is off.";
    }
    allow?.setAttribute("aria-pressed", String(consent));
    deny?.setAttribute("aria-pressed", String(!consent));
    if (privacySignalBlocksCollection()) {
      allow?.setAttribute("disabled", "");
    }
  }

  function eventPayload(event) {
    if (!config || !config.allowedEvents.includes(event)) return null;
    return {
      repo: config.repo,
      event,
      surface: "central_resource",
      consentVersion: config.consentVersion,
    };
  }

  async function track(event) {
    if (!config || !consent || privacySignalBlocksCollection()) return false;
    const payload = eventPayload(event);
    if (!payload) return false;
    try {
      const response = await fetch(config.endpoint, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  function trackResourceViewOnce() {
    if (resourceViewSent) return;
    resourceViewSent = true;
    void track("resource_view");
  }

  function setConsent(value) {
    consent = value === true && !privacySignalBlocksCollection();
    if (!writeStoredConsent(consent)) consent = false;
    updateConsentPanel();
    if (consent) trackResourceViewOnce();
    return consent;
  }

  async function loadBenchmark() {
    const root = document.querySelector("[data-benchmark]");
    if (!root || !config) return;
    try {
      const url = new URL(config.benchmarkEndpoint);
      url.searchParams.set("repo", config.repo);
      const response = await fetch(url, {
        credentials: "omit",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("benchmark unavailable");
      const data = await response.json();
      root.querySelector("[data-benchmark-total]").textContent =
        Number(data.totals?.allTime || 0).toLocaleString();
      root.querySelector("[data-benchmark-today]").textContent =
        Number(data.totals?.today || 0).toLocaleString();
      root.dataset.state = "ready";
    } catch {
      root.dataset.state = "unavailable";
    }
  }

  async function loadConfig() {
    const response = await fetch(configUrl, { credentials: "omit", cache: "no-store" });
    if (!response.ok) throw new Error("runtime config unavailable");
    config = await response.json();
    consent = readStoredConsent();
    updateConsentPanel();
    if (consent) trackResourceViewOnce();
    void loadBenchmark();
  }

  document.addEventListener("click", event => {
    const target = event.target instanceof Element
      ? event.target.closest("[data-track-event]")
      : null;
    const eventName = target?.getAttribute("data-track-event");
    if (eventName) void track(eventName);
  });

  document.querySelector("[data-consent-allow]")?.addEventListener("click", () => setConsent(true));
  document.querySelector("[data-consent-deny]")?.addEventListener("click", () => setConsent(false));

  window.Kim3310AdDataRuntime = { setConsent, track };
  loadConfig().catch(() => updateConsentPanel());
})();\n`;
}

function markdownToPlainText(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/gu, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/<[^>]+>/gu, " ")
    .replace(/[`*_>#]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function truncateAtWord(value, maxLength = 280) {
  if (value.length <= maxLength) return value;
  const truncated = value.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, boundary > 180 ? boundary : maxLength).trim()}...`;
}

function architectureSections(repoRoot) {
  const architecturePath = path.join(repoRoot, "docs/system-architecture.md");
  const fallback = [
    {
      title: "Confirm the public user and decision",
      summary: "Identify the exact decision this resource helps a visitor make before evaluating implementation details.",
    },
    {
      title: "Trace inputs through the core runtime",
      summary: "Follow data and control flow from the public entry point through validation, processing, and output boundaries.",
    },
    {
      title: "Check storage, privacy, and retention boundaries",
      summary: "Verify which data is stored, which data remains local, and which sensitive fields are explicitly rejected.",
    },
    {
      title: "Review failure handling and recovery",
      summary: "Inspect timeout, retry, rollback, and human-review paths before treating the system as production-ready.",
    },
    {
      title: "Verify deployment and observability",
      summary: "Confirm the deployment target, health checks, logs, metrics, cost controls, and rollback ownership.",
    },
  ];
  if (!fs.existsSync(architecturePath)) return fallback;
  const sections = [];
  let current = null;
  let inCodeBlock = false;

  for (const line of fs.readFileSync(architecturePath, "utf8").split(/\r?\n/)) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const heading = line.match(/^#{2,3}\s+(.+)$/u);
    if (heading) {
      if (current?.content.length > 0) sections.push(current);
      current = {
        title: markdownToPlainText(heading[1]),
        content: [],
      };
      continue;
    }
    if (
      current &&
      line.trim() &&
      !line.trim().startsWith("|") &&
      !/^[-:|\s]+$/u.test(line.trim())
    ) {
      current.content.push(markdownToPlainText(line.replace(/^\s*[-*]\s+/u, "")));
    }
  }
  if (current?.content.length > 0) sections.push(current);

  const usable = sections
    .filter(section => !/table of contents|references|appendix/i.test(section.title))
    .map(section => ({
      title: section.title,
      summary: truncateAtWord(section.content.filter(Boolean).join(" ")),
    }))
    .filter(section => section.title && section.summary)
    .slice(0, 5);
  return usable.length >= 3 ? usable : fallback;
}

function architectureDoc(entry, sections) {
  return `# Ad-Supported Resource and Aggregate Data Architecture

Repository: \`${entry.repo}\`

## Public Resource Model

${entry.positioning}

- Audience: ${entry.audience}
- Central resource: ${entry.central_resource_url}
- Live system: ${entry.live_demo_url}
- Advertising boundary: ${entry.ad_placement_boundary}
- Current ad state: code-ready on the central resource; serving depends on Google AdSense site approval and consent policy.

## Readiness Utility

The central resource turns the repository architecture into a practical review checklist:

${sections.map(section => `- **${section.title}:** ${section.summary}`).join("\n")}

The checklist state remains in the visitor's browser and is not transmitted.

## Aggregate Data Boundary

- Data asset: ${entry.data_asset}
- Sensitivity class: ${entry.sensitivity_class}
- Allowed events: ${entry.allowed_aggregate_event_set.map(event => `\`${event}\``).join(", ")}
- Prohibited fields: ${entry.prohibited_fields.map(field => `\`${field}\``).join(", ")}
- Consent defaults to off.
- DNT and Global Privacy Control fail closed.
- Events are reduced to repository, allowlisted event, public surface, and consent-policy version.
- Personal, sensitive, raw, event-level, or re-identifiable data is never offered for sale.

## Storage Path

\`\`\`text
Public resource
  -> consent and privacy-signal gate
  -> Cloudflare Pages event API
  -> rate-limited daily aggregate counter
  -> public benchmark response
  -> Firebase public aggregate data mart
\`\`\`

Cloudflare D1 holds operational counters. Firestore project \`${manifest.firebase.project_id}\` is the deny-by-default public aggregate data mart. Private inquiries remain isolated from telemetry.
`;
}

function repoManifest(entry, sections) {
  return {
    generated_at: manifest.generated_at,
    owner: manifest.owner,
    repo: entry.repo,
    positioning: entry.positioning,
    audience: entry.audience,
    public_resource: {
      url: entry.central_resource_url,
      live_demo: entry.live_demo_url,
      readiness_checklist: sections.map(section => section.title),
    },
    ad_supported_revenue: {
      participates: true,
      delivery_surface: "central policy-eligible public resource page",
      boundary: entry.ad_placement_boundary,
      provider: "google-adsense",
      publisher_id: adsensePublisherId,
      status: "code-ready-site-review-dependent",
    },
    aggregate_data: {
      data_asset: entry.data_asset,
      sensitivity_class: entry.sensitivity_class,
      allowed_events: entry.allowed_aggregate_event_set,
      prohibited_fields: entry.prohibited_fields,
      consent_default: manifest.global_policy.consent_default,
      dnt_gpc: manifest.global_policy.dnt_gpc,
      sale_boundary: manifest.global_policy.forbidden_data_sale,
      event_store: "Cloudflare D1 daily aggregate counters",
      public_data_mart: `Firebase Firestore ${manifest.firebase.project_id}`,
    },
  };
}

function existingServiceOfferPaths(repoRoot) {
  const candidates = [
    "service-offer.json",
    "docs/service-offer.json",
    "public/service-offer.json",
    "site/service-offer.json",
    "frontend/service-offer.json",
    "pages-proxy/service-offer.json",
    "pages-redirect/service-offer.json",
  ];
  return candidates
    .map(candidate => path.join(repoRoot, candidate))
    .filter(candidate => fs.existsSync(candidate));
}

function serviceOfferFor(entry, source) {
  const original = JSON.parse(fs.readFileSync(source, "utf8"));
  return {
    ...original,
    monetization_strategy: {
      primary_model: "free-public-resource-with-contextual-advertising",
      public_resource_url: entry.central_resource_url,
      advertising_provider: "google-adsense",
      advertising_status: "code-ready-site-review-dependent",
      aggregate_data_value: entry.data_asset,
      aggregate_insight_use: [
        "publish privacy-safe benchmark summaries",
        "prioritize useful public resources",
        "improve search content from aggregate topic demand",
      ],
      data_sale_boundary: manifest.global_policy.forbidden_data_sale,
      sensitive_flow_boundary: entry.ad_placement_boundary,
    },
    commerce: {
      ...(original.commerce || {}),
      advertising: {
        provider: "google-adsense",
        eligible: true,
        delivery_surface: entry.central_resource_url,
        status: "central-resource-site-review-dependent",
      },
    },
  };
}

function readmeBlock(entry) {
  return `${markerStart}
## Free Resource, Advertising, and Aggregate Data

- [Public utility and architecture checklist](${entry.central_resource_url})
- Revenue model: contextual advertising on the policy-eligible central resource page.
- Aggregate value: ${entry.data_asset}
- Boundary: ${entry.ad_placement_boundary}
- Consent defaults off, DNT/GPC fail closed, and personal or sensitive data is never sold.
${markerEnd}
`;
}

function applyReadmeMarker(existing, entry) {
  const block = readmeBlock(entry);
  if (!existing) return `# ${entry.repo}\n\n${block}`;
  const start = existing.indexOf(markerStart);
  const end = existing.indexOf(markerEnd);
  if (start !== -1 && end !== -1 && end > start) {
    const before = existing.slice(0, start).trimEnd();
    const after = existing.slice(end + markerEnd.length).trimStart();
    return `${before}\n\n${block}${after ? `\n${after}` : ""}`;
  }
  return `${existing.replace(/\s*$/, "")}\n\n${block}`;
}

function evidenceUrl(entry) {
  return evidenceByRepo[entry.repo] || "/evidence/portfolio-reel/systems-gallery.png";
}

function resourceHtml(entry, sections) {
  const repo = escapeHtml(entry.repo);
  const positioning = escapeHtml(entry.positioning);
  const audience = escapeHtml(entry.audience);
  const boundary = escapeHtml(entry.ad_placement_boundary);
  const dataAsset = escapeHtml(entry.data_asset);
  const canonical = normalizeUrl(entry.central_resource_url);
  const repositoryUrl = `https://github.com/KIM3310/${encodeURIComponent(entry.repo)}`;
  const architectureUrl = `${repositoryUrl}/blob/main/docs/system-architecture.md`;
  const checklist = sections.map((section, index) => `
          <label class="check-item">
            <input type="checkbox" data-readiness-check="${index}">
            <span>${escapeHtml(section.title)}</span>
          </label>`).join("");
  const systemMap = sections.map((section, index) => `
          <article class="map-row">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>${escapeHtml(section.title)}</h3>
              <p>${escapeHtml(section.summary)}</p>
            </div>
          </article>`).join("");
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${entry.repo} Architecture Readiness Check`,
    description: entry.positioning,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: canonical,
    isAccessibleForFree: true,
    codeRepository: repositoryUrl,
    creator: {
      "@type": "Person",
      name: "KIM3310",
      url: "https://github.com/KIM3310",
    },
  };

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${repo} Architecture Readiness Check | KIM3310</title>
  <meta name="description" content="${positioning}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="google-adsense-account" content="${adsensePublisherId}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${repo} Architecture Readiness Check">
  <meta property="og:description" content="${positioning}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${portfolioBaseUrl}${evidenceUrl(entry)}">
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}" crossorigin="anonymous"></script>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f6f4; color: #17201f; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f5f6f4; }
    a { color: inherit; }
    .shell { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
    header { border-bottom: 1px solid #cbd2ce; background: rgba(245,246,244,.96); position: sticky; top: 0; z-index: 5; }
    nav { min-height: 58px; display: flex; align-items: center; justify-content: space-between; gap: 18px; }
    nav strong { font-size: .9rem; }
    nav div { display: flex; gap: 16px; font-size: .84rem; }
    .hero { min-height: 68vh; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(300px, .95fr); gap: clamp(28px, 5vw, 70px); align-items: center; padding: 64px 0 48px; }
    .eyebrow { color: #126455; font-size: .78rem; font-weight: 800; letter-spacing: 0; text-transform: uppercase; }
    h1 { margin: 12px 0 18px; font-size: clamp(2.5rem, 7vw, 5.4rem); line-height: .98; letter-spacing: 0; max-width: 12ch; }
    .lede { font-size: clamp(1rem, 2.2vw, 1.26rem); line-height: 1.65; color: #43504d; max-width: 62ch; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
    .button { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; padding: 0 18px; border: 1px solid #17201f; text-decoration: none; font-weight: 750; font-size: .9rem; }
    .button.primary { background: #17201f; color: white; }
    .visual { aspect-ratio: 4 / 3; display: block; width: 100%; height: auto; object-fit: cover; border: 1px solid #aeb8b3; box-shadow: 12px 12px 0 #d9dfdc; background: #e8ecea; }
    section.band { border-top: 1px solid #cbd2ce; padding: 58px 0; }
    .section-grid { display: grid; grid-template-columns: minmax(220px, .35fr) minmax(0, .65fr); gap: clamp(28px, 6vw, 80px); }
    h2 { margin: 0; font-size: clamp(1.5rem, 3vw, 2.4rem); letter-spacing: 0; }
    .muted { color: #5a6663; line-height: 1.65; }
    .utility { border: 1px solid #aeb8b3; background: white; padding: clamp(20px, 4vw, 34px); }
    .progress-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
    progress { width: 58%; height: 10px; accent-color: #d94f38; }
    .check-list { display: grid; gap: 8px; }
    .check-item { display: grid; grid-template-columns: 24px 1fr; align-items: start; gap: 10px; padding: 13px 0; border-top: 1px solid #e1e5e2; line-height: 1.45; }
    .check-item input { width: 18px; height: 18px; accent-color: #126455; }
    .map-list { border-top: 1px solid #aeb8b3; }
    .map-row { display: grid; grid-template-columns: 42px 1fr; gap: 18px; padding: 22px 0; border-bottom: 1px solid #cbd2ce; }
    .map-row > span { color: #d94f38; font-weight: 800; }
    .map-row h3 { margin: 0 0 8px; font-size: 1.06rem; letter-spacing: 0; }
    .map-row p { margin: 0; color: #52605d; line-height: 1.65; }
    .metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .metric { border-left: 4px solid #e8b238; background: #fff; padding: 22px; }
    .metric strong { display: block; font-size: 2rem; margin-top: 6px; }
    .boundary { background: #17201f; color: #f8faf8; }
    .boundary .muted { color: #c7d0cd; }
    footer { padding: 34px 0 110px; color: #5a6663; font-size: .85rem; }
    .consent { position: fixed; z-index: 10; right: 18px; bottom: 18px; width: min(410px, calc(100% - 36px)); border: 1px solid #17201f; background: white; padding: 16px; box-shadow: 8px 8px 0 rgba(23,32,31,.18); }
    .consent p { margin: 0 0 12px; font-size: .82rem; line-height: 1.45; }
    .consent-actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .consent button { min-height: 38px; border: 1px solid #17201f; background: #fff; padding: 0 13px; font-weight: 750; cursor: pointer; }
    .consent button[aria-pressed="true"] { background: #17201f; color: #fff; }
    .consent button:disabled { cursor: not-allowed; opacity: .45; }
    @media (max-width: 760px) {
      .hero, .section-grid { grid-template-columns: 1fr; }
      .hero { min-height: auto; padding: 36px 0 40px; }
      h1 { font-size: clamp(2.35rem, 14vw, 4rem); }
      .visual { box-shadow: 8px 8px 0 #d9dfdc; }
      .metric-grid { grid-template-columns: 1fr; }
      footer { padding-bottom: 34px; }
      .consent { position: static; width: min(100% - 32px, 410px); margin: 0 auto 28px; box-shadow: none; }
    }
  </style>
</head>
<body>
  <header>
    <nav class="shell" aria-label="Primary">
      <strong>KIM3310 Resource Atlas</strong>
      <div>
        <a href="/">All systems</a>
        <a href="/privacy">Privacy</a>
      </div>
    </nav>
  </header>
  <main>
    <div class="shell hero">
      <div>
        <div class="eyebrow">Free architecture utility</div>
        <h1>${repo}</h1>
        <p class="lede">${positioning}</p>
        <p class="muted">Built for ${audience}. Use the readiness check below, inspect the implementation, and compare public aggregate demand without submitting project data.</p>
        <div class="actions">
          <a class="button primary" href="${escapeHtml(entry.live_demo_url)}" rel="noopener" data-track-event="resource_cta_click">Open live system</a>
          <a class="button" href="${architectureUrl}" rel="noopener" data-track-event="architecture_doc_open">Read architecture</a>
        </div>
      </div>
      <img class="visual" src="${evidenceUrl(entry)}" alt="${repo} system evidence preview" width="1200" height="900">
    </div>

    <section class="band">
      <div class="shell section-grid">
        <div>
          <div class="eyebrow">01 / Review</div>
          <h2>Architecture readiness check</h2>
          <p class="muted">Your selections stay in this browser. Nothing entered here is uploaded.</p>
        </div>
        <div class="utility" data-readiness>
          <div class="progress-row">
            <strong><span data-progress-count>0</span> of ${sections.length} reviewed</strong>
            <progress data-progress max="${sections.length}" value="0">${sections.length}</progress>
          </div>
          <div class="check-list">${checklist}
          </div>
        </div>
      </div>
    </section>

    <section class="band">
      <div class="shell section-grid">
        <div>
          <div class="eyebrow">02 / System map</div>
          <h2>What the architecture proves</h2>
          <p class="muted">These notes are derived from this repository's checked-in system architecture, not generic product copy.</p>
        </div>
        <div class="map-list">${systemMap}
        </div>
      </div>
    </section>

    <section class="band">
      <div class="shell section-grid">
        <div>
          <div class="eyebrow">03 / Aggregate</div>
          <h2>Public interest pulse</h2>
          <p class="muted">${dataAsset}</p>
        </div>
        <div class="metric-grid" data-benchmark data-state="loading">
          <div class="metric"><span>All-time consented events</span><strong data-benchmark-total>0</strong></div>
          <div class="metric"><span>Today's consented events</span><strong data-benchmark-today>0</strong></div>
        </div>
      </div>
    </section>

    <section class="band boundary">
      <div class="shell section-grid">
        <div>
          <div class="eyebrow">04 / Boundary</div>
          <h2>Useful data, narrow collection</h2>
        </div>
        <div>
          <p class="muted">${boundary}</p>
          <p class="muted">Only four coarse fields are accepted after consent: repository, allowlisted event, public surface, and consent-policy version. Raw inputs, URLs, referrers, identities, files, prompts, and sensitive details are rejected.</p>
          <div class="actions">
            <a class="button" href="/privacy-support/ad-data.html" data-track-event="privacy_support_open">Data policy</a>
            <a class="button" href="${repositoryUrl}" rel="noopener">Source repository</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="shell">
    <p>Free public resource by KIM3310. Advertising is limited to this policy-eligible public page and depends on Google site approval and regional consent.</p>
  </footer>

  <aside class="consent" data-consent-panel aria-label="Aggregate measurement consent">
    <p data-consent-status>Anonymous aggregate measurement is off.</p>
    <div class="consent-actions">
      <button type="button" data-consent-allow aria-pressed="false">Allow aggregate counts</button>
      <button type="button" data-consent-deny aria-pressed="true">Keep off</button>
    </div>
  </aside>

  <script>
    (() => {
      const storageKey = "kim3310-readiness:${entry.repo}";
      const checks = [...document.querySelectorAll("[data-readiness-check]")];
      const count = document.querySelector("[data-progress-count]");
      const progress = document.querySelector("[data-progress]");
      let saved = [];
      try { saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch {}
      checks.forEach((check, index) => {
        check.checked = saved.includes(index);
        check.addEventListener("change", () => {
          const selected = checks.flatMap((item, itemIndex) => item.checked ? [itemIndex] : []);
          try { localStorage.setItem(storageKey, JSON.stringify(selected)); } catch {}
          count.textContent = String(selected.length);
          progress.value = selected.length;
        });
      });
      const initial = checks.filter(check => check.checked).length;
      count.textContent = String(initial);
      progress.value = initial;
    })();
  </script>
  <script src="./ad-data-runtime.js" data-config="./ad-data-config.json" defer></script>
</body>
</html>
`;
}

function privacySupportHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Advertising and Aggregate Data Policy | KIM3310</title>
  <meta name="description" content="Advertising, consent, storage, retention, and data-sale boundaries for KIM3310 public resources.">
  <link rel="canonical" href="${portfolioBaseUrl}/privacy-support/ad-data.html">
  <style>
    body { margin: 0; font: 17px/1.7 system-ui, sans-serif; color: #17201f; background: #f5f6f4; }
    main { width: min(780px, calc(100% - 32px)); margin: 0 auto; padding: 64px 0; }
    h1 { font-size: clamp(2.2rem, 7vw, 4.8rem); line-height: 1; letter-spacing: 0; }
    h2 { margin-top: 42px; letter-spacing: 0; }
    a { color: #126455; }
  </style>
</head>
<body>
  <main>
    <p><a href="/">KIM3310 Resource Atlas</a></p>
    <h1>Advertising and aggregate data policy</h1>
    <p>Advertising is limited to policy-eligible public resource pages. App, upload, result, account, inquiry, payment, dashboard, admin, medical, incident, security, and private workflow surfaces remain ad-free.</p>
    <h2>Consent and privacy signals</h2>
    <p>First-party aggregate measurement is off by default. A browser DNT or Global Privacy Control signal always keeps it off. Google advertising consent is handled through the Google-certified consent platform configured for the publisher account.</p>
    <h2>What the event API accepts</h2>
    <p>The API accepts only repository, allowlisted event, public surface, and consent-policy version. It rejects extra fields. A short-lived, date-scoped salted network fingerprint is used only for abuse limiting and is not joined to aggregate reports.</p>
    <h2>What is never sold</h2>
    <p>Personal, sensitive, raw, event-level, and re-identifiable data is not sold. Aggregate counts are used to publish benchmark summaries, improve free resources, and prioritize useful content.</p>
    <h2>Storage</h2>
    <p>Cloudflare D1 stores daily aggregate counters and expiring abuse-control counters. Firebase Firestore stores only curated public aggregate snapshots under deny-by-default rules. Private inquiries are isolated from telemetry.</p>
    <h2>Controls</h2>
    <p>Use the measurement control on any resource page to grant or withdraw first-party aggregate consent. Clearing site storage also removes the browser-local preference and readiness checklist state.</p>
  </main>
</body>
</html>
`;
}

function sitemapXml(entries) {
  const urls = entries
    .map(entry => `  <url><loc>${escapeHtml(entry.central_resource_url)}</loc><lastmod>${manifest.generated_at}</lastmod></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function plannedFiles() {
  const files = [];
  for (const entry of manifest.repositories) {
    const repoRoot = path.join(root, entry.repo);
    const readmePath = path.join(repoRoot, "README.md");
    const existingReadme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "";
    const sections = architectureSections(repoRoot);

    files.push(plannedFile(
      path.join(repoRoot, "docs/ad-data-manifest.json"),
      prettyJson(repoManifest(entry, sections)),
    ));
    files.push(plannedFile(
      path.join(repoRoot, "docs/ad-data-architecture.md"),
      architectureDoc(entry, sections),
    ));
    files.push(plannedFile(readmePath, applyReadmeMarker(existingReadme, entry)));

    for (const offerPath of existingServiceOfferPaths(repoRoot)) {
      files.push(plannedFile(offerPath, prettyJson(serviceOfferFor(entry, offerPath))));
    }

    const centralRoot = path.join(root, manifest.central_portfolio_repo, "public/resources", entry.repo);
    const offerSource = path.join(repoRoot, "docs/service-offer.json");
    files.push(plannedFile(path.join(centralRoot, "index.html"), resourceHtml(entry, sections)));
    files.push(plannedFile(path.join(centralRoot, "service-offer.json"), prettyJson(serviceOfferFor(entry, offerSource))));
    files.push(plannedFile(path.join(centralRoot, "ad-data-runtime.js"), runtimeJs()));
    files.push(plannedFile(path.join(centralRoot, "ad-data-config.json"), prettyJson(runtimeConfig(entry))));
  }

  const portfolioPublic = path.join(root, manifest.central_portfolio_repo, "public");
  files.push(plannedFile(
    path.join(portfolioPublic, "resources/ad-data-sitemap.xml"),
    sitemapXml(manifest.repositories),
  ));
  files.push(plannedFile(
    path.join(portfolioPublic, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${portfolioBaseUrl}/sitemap.xml\nSitemap: ${portfolioBaseUrl}/resources/ad-data-sitemap.xml\n`,
  ));
  files.push(plannedFile(
    path.join(portfolioPublic, "ads.txt"),
    "google.com, pub-4973160293737562, DIRECT, f08c47fec0942fa0\n",
  ));
  files.push(plannedFile(
    path.join(portfolioPublic, "privacy-support/ad-data.html"),
    privacySupportHtml(),
  ));
  files.push(plannedFile(
    path.join(portfolioPublic, "privacy-support/ad-data.json"),
    prettyJson({
      generated_at: manifest.generated_at,
      consent_version: manifest.consent_version,
      policy: manifest.global_policy,
      firebase: manifest.firebase,
      repositories: manifest.repositories.map(entry => ({
        repo: entry.repo,
        central_resource_url: entry.central_resource_url,
        data_asset: entry.data_asset,
        sensitivity_class: entry.sensitivity_class,
      })),
    }),
  ));
  return files;
}

function main() {
  const files = plannedFiles();
  const duplicatePaths = files
    .map(file => file.file)
    .filter((file, index, all) => all.indexOf(file) !== index);
  if (duplicatePaths.length > 0) {
    throw new Error(`duplicate generated paths: ${duplicatePaths.join(", ")}`);
  }

  const drift = [];
  for (const file of files) {
    const exists = fs.existsSync(file.file);
    const current = exists ? fs.readFileSync(file.file, "utf8") : null;
    if (current !== file.content) {
      drift.push(file.file);
      if (!checkMode) {
        fs.mkdirSync(path.dirname(file.file), { recursive: true });
        fs.writeFileSync(file.file, file.content);
      }
    }
  }

  if (checkMode && drift.length > 0) {
    console.error(`ad data pivot check failed: ${drift.length} files would change`);
    for (const file of drift) console.error(path.relative(root, file));
    process.exit(1);
  }
  console.log(`ad data pivot ${checkMode ? "check" : "write"} ok: files=${files.length} changed=${drift.length}`);
}

main();
