import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const owner = "KIM3310";
const indexPath = path.join(root, "doeon-kim-portfolio/docs/revenue-architecture-index.md");
const constantsPath = path.join(root, "doeon-kim-portfolio/constants.ts");

const htmlTargets = [
  ["AegisOps", "index.html", "app"],
  ["Nexus-Hive", "frontend/index.html", "static"],
  ["SteadyTap", "site/index.html", "static"],
  ["agent-orchestration-benchmark", "site/index.html", "static"],
  ["agent-runtime-go", "site/index.html", "static"],
  ["ai-agent-production-lab", "site/index.html", "static"],
  ["ai-security-redteam-lab", "site/index.html", "static"],
  ["aix-pilot", "index.html", "app"],
  ["beaver-study-orchestrator", "site/index.html", "static"],
  ["districtpilot-ai", "site/index.html", "static"],
  ["doeon-kim-portfolio", "index.html", "app"],
  ["dream-interpretation-pages", "index.html", "app"],
  ["dream-interpretation-pages", "site/index.html", "static"],
  ["fab-ops-yield-control-tower", "site/index.html", "static"],
  ["kbbq-idle-unity", "docs/index.html", "static"],
  ["lakehouse-contract-lab", "site/index.html", "static"],
  ["llm-onprem-deployment-kit", "site/index.html", "static"],
  ["multi-cli-pilot", "site/index.html", "static"],
  ["nw-service-assurance-workbench", "index.html", "app"],
  ["quantum-workbench", "site/index.html", "static"],
  ["retina-scan-ai", "site/index.html", "static"],
  ["secure-xl2hwp-local", "site/index.html", "static"],
  ["security-threat-response-workbench", "index.html", "app"],
  ["stage-pilot", "site/index.html", "static"],
  ["the-savior", "public/index.html", "static"],
  ["the-savior", "site/index.html", "static"],
  ["tool-call-finetune-lab", "site/index.html", "static"],
  ["twincity-ui", "pages-redirect/index.html", "app"],
  ["weld-defect-vision", "site/index.html", "static"],
];

const publicAssetDirs = new Map([
  ["AegisOps", "public"],
  ["aix-pilot", "public"],
  ["doeon-kim-portfolio", "public"],
  ["dream-interpretation-pages", "public"],
  ["nw-service-assurance-workbench", "public"],
  ["security-threat-response-workbench", "public"],
  ["the-savior", "public"],
  ["twincity-ui", "public"],
]);

const staticAssetDirs = new Map([
  ["Nexus-Hive", "frontend"],
  ["SteadyTap", "site"],
  ["agent-orchestration-benchmark", "site"],
  ["agent-runtime-go", "site"],
  ["ai-agent-production-lab", "site"],
  ["ai-security-redteam-lab", "site"],
  ["beaver-study-orchestrator", "site"],
  ["districtpilot-ai", "site"],
  ["fab-ops-yield-control-tower", "site"],
  ["kbbq-idle-unity", "docs"],
  ["lakehouse-contract-lab", "site"],
  ["llm-onprem-deployment-kit", "site"],
  ["multi-cli-pilot", "site"],
  ["quantum-workbench", "site"],
  ["retina-scan-ai", "site"],
  ["secure-xl2hwp-local", "site"],
  ["stage-pilot", "site"],
  ["tool-call-finetune-lab", "site"],
  ["weld-defect-vision", "site"],
]);

const categoryByRepo = {
  AegisOps: "BusinessApplication",
  KIM3310: "DeveloperApplication",
  "Nexus-Hive": "BusinessApplication",
  SteadyTap: "HealthApplication",
  "agent-orchestration-benchmark": "DeveloperApplication",
  "agent-runtime-go": "DeveloperApplication",
  "ai-agent-production-lab": "DeveloperApplication",
  "ai-security-redteam-lab": "SecurityApplication",
  "aix-pilot": "BusinessApplication",
  "beaver-study-orchestrator": "EducationalApplication",
  "districtpilot-ai": "BusinessApplication",
  "doeon-kim-portfolio": "DeveloperApplication",
  "dream-interpretation-pages": "LifestyleApplication",
  "enterprise-llm-adoption-kit": "BusinessApplication",
  "fab-ops-yield-control-tower": "BusinessApplication",
  "kbbq-idle-unity": "GameApplication",
  "lakehouse-contract-lab": "DeveloperApplication",
  "llm-onprem-deployment-kit": "DeveloperApplication",
  "multi-cli-pilot": "DeveloperApplication",
  "nw-service-assurance-workbench": "BusinessApplication",
  "quantum-workbench": "EducationalApplication",
  "retina-scan-ai": "EducationalApplication",
  "secure-xl2hwp-local": "BusinessApplication",
  "security-threat-response-workbench": "SecurityApplication",
  "stage-pilot": "DeveloperApplication",
  "the-savior": "LifestyleApplication",
  "tool-call-finetune-lab": "DeveloperApplication",
  "twincity-ui": "BusinessApplication",
  "weld-defect-vision": "BusinessApplication",
};

const displayNameByRepo = {
  "aix-pilot": "AIX Pilot",
  "dream-interpretation-pages": "Dream Interpretation Pages",
  "doeon-kim-portfolio": "KIM3310 Systems Gallery",
  "kbbq-idle-unity": "KBBQ Idle Unity",
  "llm-onprem-deployment-kit": "LLM On-Prem Deployment Kit",
  "multi-cli-pilot": "Multi-CLI Pilot",
  "nw-service-assurance-workbench": "NW Service Assurance Workbench",
  "secure-xl2hwp-local": "Secure XL2HWP Local",
  "security-threat-response-workbench": "Security Threat Response Workbench",
  "stage-pilot": "StagePilot",
  "the-savior": "The Savior",
  "tool-call-finetune-lab": "Tool-Call Fine-Tune Lab",
  "twincity-ui": "TwinCity UI",
};

const stopWords = new Set([
  "and",
  "the",
  "for",
  "with",
  "that",
  "this",
  "from",
  "into",
  "plus",
  "paid",
  "free",
  "team",
  "private",
  "public",
  "service",
  "workspace",
  "report",
  "reports",
  "demo",
]);

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function text(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function sentence(value, max = 158) {
  const cleaned = text(value);
  if (cleaned.length <= max) return cleaned;
  const cut = cleaned.lastIndexOf(" ", max - 1);
  const boundary = cut > Math.floor(max * 0.6) ? cut : max - 1;
  return `${cleaned.slice(0, boundary).replace(/[,:;-]$/, "").trim()}.`;
}

function titleCase(repo) {
  if (displayNameByRepo[repo]) return displayNameByRepo[repo];
  return repo
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bAi\b/g, "AI")
    .replace(/\bLlm\b/g, "LLM")
    .replace(/\bUi\b/g, "UI")
    .replace(/\bNw\b/g, "NW")
    .replace(/\bGo\b/g, "Go");
}

function capitalize(value) {
  const cleaned = text(value);
  return cleaned ? `${cleaned[0].toUpperCase()}${cleaned.slice(1)}` : cleaned;
}

function parseRevenueRows() {
  const markdown = read(indexPath);
  const rows = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith("| `")) continue;
    const cols = line
      .slice(1, -1)
      .split("|")
      .map((col) => col.trim());
    if (cols.length < 5) continue;
    const repo = cols[0].replaceAll("`", "");
    rows.push({
      repo,
      offer: cols[1],
      sku: cols[2],
      leadMagnet: cols[3],
      revenueDocUrl: `https://github.com/${owner}/${repo}/blob/main/docs/revenue-architecture.md`,
      architectureDocUrl: `https://github.com/${owner}/${repo}/blob/main/docs/system-architecture.md`,
      repositoryUrl: `https://github.com/${owner}/${repo}`,
    });
  }
  return rows;
}

function parseDemoUrls() {
  const source = read(constantsPath);
  const block = source.match(/export const REPOSITORY_DEMO_URLS:[\s\S]*?=\s*\{([\s\S]*?)\};/);
  const urls = new Map();
  if (!block) return urls;
  const regex = /(?:'([^']+)'|([A-Za-z0-9_-]+)):\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(block[1]))) {
    urls.set(match[1] || match[2], match[3]);
  }
  return urls;
}

function repoDirs() {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(root, name, ".git")))
    .sort();
}

function siteUrlFor(repo, demoUrls) {
  return normalizeUrl(demoUrls.get(repo) || `https://github.com/${owner}/${repo}`);
}

function normalizeUrl(url) {
  if (!url) return url;
  return url.endsWith("/") ? url : `${url}/`;
}

function keywordsFor(item) {
  const base = [
    item.repo,
    titleCase(item.repo),
    item.offer,
    item.sku,
    item.leadMagnet,
    "free tier",
    "Cloudflare Pages",
    "serverless launch",
    "system architecture",
  ];
  return Array.from(
    new Set(
      base
        .join(" ")
        .replace(/[^\w\s+-]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !stopWords.has(word.toLowerCase()))
        .slice(0, 24),
    ),
  );
}

function queryTerms(item, limit = 4) {
  return keywordsFor(item)
    .filter((word) => word.toLowerCase() !== item.repo.toLowerCase())
    .filter((word) => !titleCase(item.repo).toLowerCase().split(/\s+/).includes(word.toLowerCase()))
    .slice(0, limit)
    .join(" ");
}

function issueUrlFor(repo, title) {
  const params = new URLSearchParams({
    template: "service-inquiry.yml",
    title: `Private workspace inquiry: ${title}`,
  });
  return `https://github.com/${owner}/${repo}/issues/new?${params.toString()}`;
}

function manifestFor(item, url) {
  const title = titleCase(item.repo);
  const description = sentence(`${title}: ${item.offer}. Free entry point: ${item.leadMagnet}. Paid path: ${item.sku}.`, 220);
  const category = categoryByRepo[item.repo] || "DeveloperApplication";
  const keywords = keywordsFor(item);
  const leadCaptureUrl = issueUrlFor(item.repo, title);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    applicationCategory: category,
    operatingSystem: "Web, serverless, and local development environments",
    url,
    codeRepository: item.repositoryUrl,
    description,
    creator: {
      "@type": "Person",
      name: owner,
      url: `https://github.com/${owner}`,
    },
    offers: [
      {
        "@type": "Offer",
        name: item.leadMagnet,
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url,
      },
      {
        "@type": "Offer",
        name: item.sku,
        availability: "https://schema.org/LimitedAvailability",
        url: item.revenueDocUrl,
      },
    ],
    isAccessibleForFree: true,
    keywords: keywords.join(", "),
  };

  return {
    name: title,
    slug: item.repo,
    canonical_url: url,
    repository_url: item.repositoryUrl,
    architecture_url: item.architectureDocUrl,
    revenue_architecture_url: item.revenueDocUrl,
    lead_capture_url: leadCaptureUrl,
    productized_offer: item.offer,
    first_paid_sku: item.sku,
    free_lead_magnet: item.leadMagnet,
    search_positioning: {
      primary_query: `${title} ${queryTerms(item, 3)}`.trim(),
      secondary_queries: [
        `${title} demo`,
        `${title} system architecture`,
        `${title} ${category.replace("Application", "").toLowerCase()} tool`,
        `${item.offer} service`,
      ],
      audience_intent: "Find a runnable demo, inspect the system architecture, and decide whether a private workspace or implementation package is useful.",
    },
    monetization_boundary: {
      free: item.leadMagnet,
      paid: item.sku,
      metering_hooks: ["workspace_id", "plan", "quota_day", "export_count", "lead_source"],
      cost_guardrails: ["static first", "edge functions", "customer API keys", "cached AI outputs", "synthetic public data"],
    },
    structured_data: structuredData,
  };
}

function docsMarkdown(item, manifest) {
  return `# Search Growth Implementation - ${manifest.name}

This repository now exposes a search-readable service surface in addition to the system architecture. The implementation is designed to support organic discovery, AI answer surfaces, and a free-to-paid service path without committing to paid infrastructure first.

## Implemented Surface

| Surface | Path |
| --- | --- |
| Machine-readable offer | [docs/service-offer.json](./service-offer.json) |
| Revenue architecture | [docs/revenue-architecture.md](./revenue-architecture.md) |
| System architecture | [docs/system-architecture.md](./system-architecture.md) |
| Public canonical URL | ${manifest.canonical_url} |
| Lead capture URL | ${manifest.lead_capture_url} |

## Search Positioning

- Primary query: ${manifest.search_positioning.primary_query}
- Secondary queries: ${manifest.search_positioning.secondary_queries.join("; ")}
- Public entry point: ${manifest.free_lead_magnet}
- Paid boundary: ${manifest.first_paid_sku}

## Conversion Boundary

The public surface stays crawlable and free. Paid value starts when a visitor wants private data, saved history, branded export packs, customer-specific connectors, recurring reports, or implementation support.

## Deployment Notes

- Keep the sitemap and robots file aligned with the final production domain.
- Submit the canonical URL and sitemap in Google Search Console after the domain is connected.
- The lead-capture path is a GitHub Issue Form so private workspace and paid-package requests create a trackable queue before payment infrastructure is added.
- Keep exact free-tier quotas out of public promises because provider limits change.
`;
}

function llmsText(item, manifest) {
  return `# ${manifest.name}

Purpose: ${manifest.productized_offer}
Free entry point: ${manifest.free_lead_magnet}
Paid boundary: ${manifest.first_paid_sku}
Canonical URL: ${manifest.canonical_url}
Repository: ${manifest.repository_url}
System architecture: ${manifest.architecture_url}
Revenue architecture: ${manifest.revenue_architecture_url}
Lead capture: ${manifest.lead_capture_url}

Use this project as a runnable or inspectable reference for ${manifest.search_positioning.secondary_queries.join(", ")}.
`;
}

function robotsText(url) {
  return `User-agent: *
Allow: /

Sitemap: ${normalizeUrl(url)}sitemap.xml
`;
}

function sitemapXml(url, includeDocs = false) {
  const base = normalizeUrl(url);
  const urls = [
    [base, "weekly", "1.0"],
    [`${base}service-offer.json`, "monthly", "0.7"],
    [`${base}llms.txt`, "monthly", "0.6"],
  ];
  if (includeDocs) {
    urls.push([`${base}docs/revenue-architecture.md`, "monthly", "0.5"]);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ([loc, changefreq, priority]) => `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
}

function upsertTitle(html, title) {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  }
  return html.replace(/<\/head>/i, `  <title>${esc(title)}</title>\n</head>`);
}

function upsertMetaName(html, name, content) {
  const pattern = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*>`, "i");
  const tag = `<meta name="${esc(name)}" content="${esc(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function upsertMetaProperty(html, property, content) {
  const pattern = new RegExp(`<meta\\s+[^>]*property=["']${property}["'][^>]*>`, "i");
  const tag = `<meta property="${esc(property)}" content="${esc(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function upsertCanonical(html, url) {
  const tag = `<link rel="canonical" href="${esc(url)}" />`;
  if (/<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, tag);
  }
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function upsertServiceOfferLink(html, href) {
  const tag = `<link rel="alternate" type="application/json" title="Service offer" href="${esc(href)}" />`;
  const pattern = /<link\s+[^>]*title=["']Service offer["'][^>]*>/i;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function upsertJsonLd(html, data) {
  const marker = /<!-- search-growth-jsonld:start -->[\s\S]*?<!-- search-growth-jsonld:end -->\n?/;
  const block = `<!-- search-growth-jsonld:start -->
<script type="application/ld+json">${JSON.stringify(data)}</script>
<!-- search-growth-jsonld:end -->
`;
  const cleaned = html.replace(marker, "");
  return cleaned.replace(/<\/head>/i, `${block}</head>`);
}

function growthStyle() {
  return `<style id="search-growth-offer-style">
    .search-growth-offer {
      width: min(1180px, calc(100% - 32px));
      margin: 18px auto 42px;
      padding: clamp(18px, 3vw, 28px);
      border: 1px solid rgba(28, 35, 48, 0.14);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.82);
      color: #15171c;
      box-shadow: 0 20px 54px rgba(25, 34, 51, 0.10);
    }
    .search-growth-offer p { margin: 0; color: #59616e; line-height: 1.65; }
    .search-growth-offer h2 { margin: 0 0 10px; font-size: clamp(1.35rem, 2vw, 2rem); letter-spacing: 0; }
    .search-growth-offer .offer-kicker {
      margin-bottom: 8px;
      color: #1266f1;
      font-size: 0.78rem;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .search-growth-offer .offer-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin: 18px 0;
    }
    .search-growth-offer .offer-grid div {
      min-width: 0;
      padding: 14px;
      border: 1px solid rgba(28, 35, 48, 0.12);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.72);
    }
    .search-growth-offer .offer-grid span {
      display: block;
      margin-bottom: 6px;
      color: #59616e;
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .search-growth-offer .offer-grid strong { display: block; overflow-wrap: anywhere; line-height: 1.38; }
    .search-growth-offer .offer-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
    .search-growth-offer .offer-actions a {
      min-height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(28, 35, 48, 0.14);
      border-radius: 10px;
      padding: 0 14px;
      text-decoration: none;
      font-weight: 780;
      background: #15171c;
      color: white;
    }
    .search-growth-offer .offer-actions a.secondary { background: white; color: #15171c; }
    @media (max-width: 720px) {
      .search-growth-offer .offer-grid { grid-template-columns: 1fr; }
      .search-growth-offer .offer-actions a { width: 100%; }
    }
  </style>
`;
}

function upsertGrowthStyle(html) {
  const marker = /<style id=["']search-growth-offer-style["'][\s\S]*?<\/style>\n?/i;
  const cleaned = html.replace(marker, "");
  return cleaned.replace(/<\/head>/i, `${growthStyle()}</head>`);
}

function offerSection(item, manifest) {
  return `<section class="search-growth-offer" aria-labelledby="search-growth-offer-title">
  <p class="offer-kicker">Service launch path</p>
  <h2 id="search-growth-offer-title">${esc(manifest.name)} can start free, then convert on private value.</h2>
  <p>${esc(capitalize(manifest.productized_offer))}. The free surface stays public and synthetic; paid value begins with ${esc(manifest.first_paid_sku)}.</p>
  <div class="offer-grid" aria-label="Free and paid service boundaries">
    <div><span>Free entry</span><strong>${esc(manifest.free_lead_magnet)}</strong></div>
    <div><span>Paid SKU</span><strong>${esc(manifest.first_paid_sku)}</strong></div>
    <div><span>Search intent</span><strong>${esc(manifest.search_positioning.secondary_queries.slice(0, 2).join(" / "))}</strong></div>
  </div>
  <div class="offer-actions">
    <a href="${esc(manifest.lead_capture_url)}">Private workspace</a>
    <a href="${esc(item.revenueDocUrl)}" target="_blank" rel="noopener noreferrer">Revenue architecture</a>
    <a class="secondary" href="${esc(item.repositoryUrl)}" target="_blank" rel="noopener noreferrer">Repository</a>
  </div>
</section>
`;
}

function upsertOfferSection(html, item, manifest) {
  const marker = /<!-- search-growth-offer:start -->[\s\S]*?<!-- search-growth-offer:end -->\n?/;
  const section = `<!-- search-growth-offer:start -->
${offerSection(item, manifest)}<!-- search-growth-offer:end -->
`;
  const cleaned = html.replace(marker, "");
  if (/<\/main>/i.test(cleaned)) {
    return cleaned.replace(/<\/main>/i, `${section}</main>`);
  }
  return cleaned.replace(/<\/body>/i, `${section}</body>`);
}

function updateHtml(file, item, manifest, mode) {
  if (!fs.existsSync(file)) return false;
  let html = read(file);
  const pageTitle = `${manifest.name} | ${sentence(queryTerms(item, 5) || manifest.productized_offer, 68)}`;
  html = upsertTitle(html, pageTitle);
  html = upsertMetaName(html, "description", manifest.structured_data.description);
  html = upsertMetaName(html, "robots", "index,follow,max-image-preview:large");
  html = upsertMetaName(html, "keywords", manifest.structured_data.keywords);
  html = upsertCanonical(html, manifest.canonical_url);
  html = upsertServiceOfferLink(html, mode === "static" ? "service-offer.json" : "/service-offer.json");
  html = upsertMetaProperty(html, "og:type", "website");
  html = upsertMetaProperty(html, "og:url", manifest.canonical_url);
  html = upsertMetaProperty(html, "og:title", manifest.name);
  html = upsertMetaProperty(html, "og:description", manifest.structured_data.description);
  html = upsertMetaProperty(html, "og:site_name", manifest.name);
  html = upsertMetaName(html, "twitter:card", "summary_large_image");
  html = upsertMetaName(html, "twitter:title", manifest.name);
  html = upsertMetaName(html, "twitter:description", manifest.structured_data.description);
  html = upsertJsonLd(html, manifest.structured_data);
  if (mode === "static") {
    html = upsertGrowthStyle(html);
    html = upsertOfferSection(html, item, manifest);
  }
  write(file, html);
  return true;
}

function writeAssetSurface(repo, dir, item, manifest) {
  const folder = path.join(root, repo, dir);
  if (!fs.existsSync(folder)) return false;
  write(path.join(folder, "service-offer.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  write(path.join(folder, "llms.txt"), llmsText(item, manifest));
  if (repo !== "twincity-ui") {
    write(path.join(folder, "robots.txt"), robotsText(manifest.canonical_url));
    write(path.join(folder, "sitemap.xml"), sitemapXml(manifest.canonical_url));
    return true;
  }
  return true;
}

function updateReadme(repo, manifest) {
  const file = path.join(root, repo, "README.md");
  if (!fs.existsSync(file)) return false;
  const marker = /<!-- search-growth-readme:start -->[\s\S]*?<!-- search-growth-readme:end -->\n?/;
  const block = `<!-- search-growth-readme:start -->

## Search And Service Surface

- Public entry: ${manifest.free_lead_magnet}
- Paid boundary: ${manifest.first_paid_sku}
- Canonical URL: ${manifest.canonical_url}
- Lead capture: ${manifest.lead_capture_url}
- Machine-readable offer: [docs/service-offer.json](docs/service-offer.json)
- Search growth implementation: [docs/search-growth-implementation.md](docs/search-growth-implementation.md)
- Revenue architecture: [docs/revenue-architecture.md](docs/revenue-architecture.md)

<!-- search-growth-readme:end -->
`;
  const current = read(file).replace(marker, "").trimEnd();
  write(file, `${current}\n\n${block}`);
  return true;
}

function issueFormYaml(manifest) {
  return `name: Private workspace or paid package inquiry
description: Request a private workspace, connector pack, report pack, or paid adaptation for this repository.
title: "Private workspace inquiry: "
body:
  - type: markdown
    attributes:
      value: |
        Use this form to start a concrete service conversation.

        Public entry: ${manifest.free_lead_magnet}
        Paid boundary: ${manifest.first_paid_sku}
        Canonical URL: ${manifest.canonical_url}
  - type: input
    id: organization
    attributes:
      label: Organization or project
      description: The team, company, or project this request is for.
      placeholder: Example team, company, or project name
    validations:
      required: true
  - type: dropdown
    id: package
    attributes:
      label: Interested package
      options:
        - Private workspace
        - Connector or deployment package
        - Report or export pack
        - Implementation support
        - Template or architecture adaptation
    validations:
      required: true
  - type: textarea
    id: workflow
    attributes:
      label: Workflow to support
      description: Describe the workflow, data boundary, or operating problem.
      placeholder: What should the private workspace, connector, report, or deployment help with?
    validations:
      required: true
  - type: textarea
    id: success
    attributes:
      label: Useful outcome
      description: Define what would make a small paid pilot worth continuing.
      placeholder: Faster handoff, reusable report, private connector, saved history, local deployment, recurring readiness view, etc.
    validations:
      required: true
  - type: checkboxes
    id: boundary
    attributes:
      label: Data boundary
      options:
        - label: I can start with synthetic or anonymized data.
        - label: I need a private workspace or customer-owned runtime before sharing data.
        - label: I need a local or self-hosted deployment path.
`;
}

function writeIssueForm(repo, manifest) {
  const file = path.join(root, repo, ".github/ISSUE_TEMPLATE/service-inquiry.yml");
  write(file, issueFormYaml(manifest));
  return true;
}

function cloudflarePagesWorkflow(projectName, directory) {
  return `name: pages-auto-deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

concurrency:
  group: pages-auto-deploy
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    env:
      CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
      CLOUDFLARE_ACCOUNT_ID: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      HAS_CLOUDFLARE_SECRETS: \${{ secrets.CLOUDFLARE_API_TOKEN != '' && secrets.CLOUDFLARE_ACCOUNT_ID != '' }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Skip deploy when Cloudflare secrets are missing
        if: \${{ env.HAS_CLOUDFLARE_SECRETS != 'true' }}
        run: echo "Cloudflare secrets are not configured; skipping Pages deploy."

      - name: Validate static output
        if: \${{ env.HAS_CLOUDFLARE_SECRETS == 'true' }}
        run: test -f ${directory}/index.html

      - name: Ensure Cloudflare Pages project exists
        if: \${{ env.HAS_CLOUDFLARE_SECRETS == 'true' }}
        run: |
          set -euo pipefail
          if ! npx wrangler@4 pages project create "${projectName}" --production-branch=main >/tmp/cf_pages_create.log 2>&1; then
            grep -qi "already exists" /tmp/cf_pages_create.log || (cat /tmp/cf_pages_create.log && exit 1)
          fi

      - name: Deploy to Cloudflare Pages
        if: \${{ env.HAS_CLOUDFLARE_SECRETS == 'true' }}
        run: |
          set -euo pipefail
          for attempt in 1 2 3; do
            echo "Deploy attempt $attempt/3"
            if npx wrangler@4 pages deploy "${directory}" --project-name="${projectName}" --branch=main --commit-dirty=true; then
              exit 0
            fi
            if [ "$attempt" -lt 3 ]; then sleep 15; fi
          done
          echo "Cloudflare Pages deploy failed after retries"
          exit 1
`;
}

function cloudflareWorkersWorkflow() {
  return `name: workers-auto-deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

concurrency:
  group: workers-auto-deploy
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    env:
      CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
      CLOUDFLARE_ACCOUNT_ID: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      HAS_CLOUDFLARE_SECRETS: \${{ secrets.CLOUDFLARE_API_TOKEN != '' && secrets.CLOUDFLARE_ACCOUNT_ID != '' }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Skip deploy when Cloudflare secrets are missing
        if: \${{ env.HAS_CLOUDFLARE_SECRETS != 'true' }}
        run: echo "Cloudflare secrets are not configured; skipping Workers deploy."

      - name: Setup Node
        if: \${{ env.HAS_CLOUDFLARE_SECRETS == 'true' }}
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm
          cache-dependency-path: package-lock.json

      - name: Install dependencies
        if: \${{ env.HAS_CLOUDFLARE_SECRETS == 'true' }}
        run: npm ci

      - name: Deploy Worker
        if: \${{ env.HAS_CLOUDFLARE_SECRETS == 'true' }}
        run: npm run cf:deploy
`;
}

function writeDeploymentWorkflow(repo) {
  if (repo === "Nexus-Hive") {
    write(path.join(root, repo, ".github/workflows/pages-auto-deploy.yml"), cloudflarePagesWorkflow("nexus-hive", "frontend"));
    return true;
  }
  if (repo === "nw-service-assurance-workbench" || repo === "security-threat-response-workbench") {
    write(path.join(root, repo, ".github/workflows/workers-auto-deploy.yml"), cloudflareWorkersWorkflow());
    return true;
  }
  return false;
}

function writePortfolioServiceOffers(rows, demos) {
  const offers = rows.map((item) => {
    const manifest = manifestFor(item, siteUrlFor(item.repo, demos));
    return {
      repo: item.repo,
      name: manifest.name,
      canonicalUrl: manifest.canonical_url,
      leadCaptureUrl: manifest.lead_capture_url,
      repositoryUrl: item.repositoryUrl,
      architectureUrl: item.architectureDocUrl,
      revenueUrl: item.revenueDocUrl,
      offer: item.offer,
      freeEntry: item.leadMagnet,
      paidSku: item.sku,
      primaryQuery: manifest.search_positioning.primary_query,
      category: manifest.structured_data.applicationCategory,
    };
  });
  const target = path.join(root, "doeon-kim-portfolio/serviceOffers.ts");
  write(
    target,
    `export const SERVICE_OFFERS = ${JSON.stringify(offers, null, 2)} as const;\n\nexport type ServiceOffer = (typeof SERVICE_OFFERS)[number];\n`,
  );
}

function main() {
  const rows = parseRevenueRows();
  const demos = parseDemoUrls();
  writePortfolioServiceOffers(rows, demos);
  const repos = new Set(repoDirs());
  const byRepo = new Map(rows.map((row) => [row.repo, row]));
  let docs = 0;
  let html = 0;
  let assets = 0;
  let readmes = 0;
  let issueForms = 0;
  let deployWorkflows = 0;

  for (const repo of repos) {
    const item = byRepo.get(repo);
    if (!item) continue;
    const manifest = manifestFor(item, siteUrlFor(repo, demos));
    write(path.join(root, repo, "docs/service-offer.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    write(path.join(root, repo, "docs/search-growth-implementation.md"), docsMarkdown(item, manifest));
    docs += 2;
    if (updateReadme(repo, manifest)) readmes += 1;
    if (writeIssueForm(repo, manifest)) issueForms += 1;
    if (writeDeploymentWorkflow(repo)) deployWorkflows += 1;

    const staticDir = staticAssetDirs.get(repo);
    if (staticDir && writeAssetSurface(repo, staticDir, item, manifest)) assets += 4;
    const publicDir = publicAssetDirs.get(repo);
    if (publicDir && writeAssetSurface(repo, publicDir, item, manifest)) assets += 4;
  }

  for (const [repo, relative, mode] of htmlTargets) {
    const item = byRepo.get(repo);
    if (!item) continue;
    const manifest = manifestFor(item, siteUrlFor(repo, demos));
    if (updateHtml(path.join(root, repo, relative), item, manifest, mode)) html += 1;
  }

  console.log(`search growth implemented: docs=${docs} assetFiles=${assets} html=${html} readmes=${readmes} issueForms=${issueForms} deployWorkflows=${deployWorkflows}`);
}

main();
