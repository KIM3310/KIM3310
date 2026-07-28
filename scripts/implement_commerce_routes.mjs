import fs from 'node:fs';
import path from 'node:path';

const profileRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const workspaceRoot = path.resolve(profileRoot, '..');
const catalogPath = path.join(
  profileRoot,
  'docs/monetization-operating-system-2026-07-26.json',
);
const checkOnly = process.argv.includes('--check');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const laneById = new Map(catalog.lanes.map((lane) => [lane.id, lane]));
const laneByName = new Map(catalog.lanes.map((lane) => [lane.name, lane]));
const repositoryByName = new Map(
  catalog.repositories.map((repository) => [repository.repo, repository]),
);

const manifestCopies = [
  'docs/service-offer.json',
  'public/service-offer.json',
  'site/service-offer.json',
  'frontend/service-offer.json',
  'pages-proxy/service-offer.json',
  'pages-redirect/service-offer.json',
];
const llmsCopies = [
  'docs/llms.txt',
  'public/llms.txt',
  'site/llms.txt',
  'frontend/llms.txt',
  'pages-proxy/llms.txt',
  'pages-redirect/llms.txt',
];

let changedFiles = 0;
let manifests = 0;
let readmes = 0;
let docs = 0;
let llms = 0;
let html = 0;
let removedIssueForms = 0;
let portfolioOffers = 0;

function writeIfChanged(file, content) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (current === content) return false;
  if (!checkOnly) fs.writeFileSync(file, content);
  changedFiles += 1;
  return true;
}

function removeIfPresent(file) {
  if (!fs.existsSync(file)) return false;
  if (!checkOnly) fs.rmSync(file);
  changedFiles += 1;
  return true;
}

function centralUrl(repo) {
  return catalog.gateway.offer_url_template.replace(
    '{repo}',
    encodeURIComponent(repo),
  );
}

function inquiryUrl(repo, laneId) {
  return catalog.gateway.inquiry_url_template
    .replace('{repo}', encodeURIComponent(repo))
    .replace('{lane}', encodeURIComponent(laneId));
}

function commerceFor(repo) {
  const repository = repositoryByName.get(repo);
  const lane = laneById.get(repository.lane);
  const url = centralUrl(repo);
  return {
    gateway_url: url,
    lane_id: lane.id,
    lane_name: lane.name,
    billing_mode: lane.billing_mode,
    price_unit: lane.price_unit,
    fulfillment_kind: lane.fulfillment_kind,
    risk_bucket: lane.risk_bucket,
    checkout: {
      provider: catalog.gateway.checkout_provider,
      status: catalog.gateway.checkout_status,
      fallback_url: inquiryUrl(repo, lane.id),
    },
    sponsorship: {
      provider: catalog.gateway.open_source_support,
      eligible:
        repository.visibility === 'public' &&
        catalog.gateway.open_source_support_status === 'active',
      status: catalog.gateway.open_source_support_status,
    },
    advertising: {
      provider: repository.ad_eligible
        ? catalog.gateway.advertising_provider
        : null,
      eligible: repository.ad_eligible,
      status: repository.ad_eligible
        ? catalog.gateway.adsense_status
        : 'not-applicable',
    },
  };
}

function isFreeStructuredOffer(offer) {
  if (offer.price === undefined || offer.price === null || offer.price === '') {
    return false;
  }
  const price = Number(offer.price);
  return Number.isFinite(price) && price === 0;
}

function updateManifest(file, repo) {
  if (!fs.existsSync(file)) return;
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  const repository = repositoryByName.get(repo);
  const privateInquiryUrl = inquiryUrl(repo, repository.lane);
  manifest.lead_capture_url = privateInquiryUrl;
  manifest.commerce = commerceFor(repo);
  const structuredOffers = manifest.structured_data?.offers;
  if (Array.isArray(structuredOffers)) {
    for (const offer of structuredOffers) {
      if (
        offer &&
        typeof offer === 'object' &&
        !isFreeStructuredOffer(offer)
      ) {
        offer.url = privateInquiryUrl;
      }
    }
  }
  if (writeIfChanged(file, `${JSON.stringify(manifest, null, 2)}\n`)) {
    manifests += 1;
  }
}

function updateLegacyInquiryReferences(file, repo) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  const repository = repositoryByName.get(repo);
  const next = current.replace(
    /https:\/\/kim3310-doeon-kim-portfolio\.pages\.dev\/\?inquiry=[A-Za-z0-9._%+-]+#private-inquiry/g,
    inquiryUrl(repo, repository.lane),
  );
  if (writeIfChanged(file, next)) docs += 1;
}

function updatePrivateIntakeCopy(file, repo) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  const repository = repositoryByName.get(repo);
  const privateUrl = inquiryUrl(repo, repository.lane);
  const next = current
    .replace(
      /- The lead-capture path is a GitHub Issue Form so private workspace and paid-package requests create a trackable queue before payment infrastructure is added\./gi,
      `- The lead-capture path is the central Cloudflare D1 private inquiry form at ${privateUrl}; public GitHub issues are not used for confidential or commercial scoping.`,
    )
    .replace(
      /2\. Add a lead capture route using Workers \+ D1\/KV, Supabase, Firebase, or a GitHub issue form\./gi,
      `2. Route confidential and commercial requests through the [central Cloudflare D1 private inquiry](${privateUrl}); keep public GitHub issues limited to non-confidential product discussion.`,
    )
    .replace(
      /Use the paid-pilot intake issue template for non-sensitive scoping only\. Customer names, contracts, production data, and pricing discussions should move to an owner-approved private channel before work begins\./gi,
      `Use the [central Cloudflare D1 private inquiry](${privateUrl}) for commercial scoping. Public GitHub issues are limited to non-sensitive bugs, documentation problems, and product discussion.`,
    )
    .replace(
      /Generated: \d{4}-\d{2}-\d{2}\./gi,
      'Last reviewed: 2026-07-28.',
    );
  if (writeIfChanged(file, next)) docs += 1;
}

function updateRevenueDoc(file, repo) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  const repository = repositoryByName.get(repo);
  const row = `| Private inquiry | ${inquiryUrl(repo, repository.lane)} |`;
  let next = current;
  if (/^\| Private inquiry \|.*$/m.test(next)) {
    next = next.replace(/^\| Private inquiry \|.*$/m, row);
  } else if (/^\| Data \/ workflow moat \|.*$/m.test(next)) {
    next = next.replace(
      /^(\| Data \/ workflow moat \|.*)$/m,
      `$1\n${row}`,
    );
  }
  if (writeIfChanged(file, next)) docs += 1;
}

function upsertLineAfter(text, anchorPrefix, linePrefix, value) {
  const linePattern = new RegExp(
    `^${linePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*$`,
    'm',
  );
  if (linePattern.test(text)) return text.replace(linePattern, value);
  const anchorPattern = new RegExp(
    `^${anchorPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*$`,
    'm',
  );
  if (anchorPattern.test(text)) {
    return text.replace(anchorPattern, (anchor) => `${anchor}\n${value}`);
  }
  return text;
}

function updateReadme(file, repo) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  const repository = repositoryByName.get(repo);
  const withPrivateIntake = upsertLineAfter(
    current,
    '- Lead capture:',
    '- Lead capture:',
    `- Lead capture: ${inquiryUrl(repo, repository.lane)}`,
  );
  const next = upsertLineAfter(
    withPrivateIntake,
    '- Lead capture:',
    '- Commercial route:',
    `- Commercial route: ${centralUrl(repo)}`,
  );
  if (writeIfChanged(file, next)) readmes += 1;
}

function updateSearchDoc(file, repo) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  const repository = repositoryByName.get(repo);
  const leadRow = `| Lead capture URL | ${inquiryUrl(repo, repository.lane)} |`;
  const row = `| Commercial route | ${centralUrl(repo)} |`;
  let next = current;
  if (/^\| Lead capture URL \|.*$/m.test(next)) {
    next = next.replace(/^\| Lead capture URL \|.*$/m, leadRow);
  }
  if (/^\| Commercial route \|.*$/m.test(next)) {
    next = next.replace(/^\| Commercial route \|.*$/m, row);
  } else {
    next = next.replace(
      /^(\| Lead capture URL \|.*)$/m,
      `$1\n${row}`,
    );
  }
  if (writeIfChanged(file, next)) docs += 1;
}

function updateLlms(file, repo) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  const repository = repositoryByName.get(repo);
  const withPrivateIntake = upsertLineAfter(
    current,
    'Lead capture:',
    'Lead capture:',
    `Lead capture: ${inquiryUrl(repo, repository.lane)}`,
  );
  const next = upsertLineAfter(
    withPrivateIntake,
    'Lead capture:',
    'Commercial route:',
    `Commercial route: ${centralUrl(repo)}`,
  );
  if (writeIfChanged(file, next)) llms += 1;
}

function updateStaticHtml(file, repo) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  const marker =
    /<!-- search-growth-offer:start -->([\s\S]*?)<!-- search-growth-offer:end -->/;
  const match = current.match(marker);
  if (!match) return;
  const repository = repositoryByName.get(repo);
  const updatedBlock = match[1].replace(
    /<a\b[^>]*>[\s\S]*?<\/a\s*>/gi,
    (anchor) => {
      const label = anchor
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (label !== 'Private workspace' && label !== 'View paid options') {
        return anchor;
      }
      const nextAnchor = anchor.replace(
        /\bhref="[^"]*"/i,
        `href="${inquiryUrl(repo, repository.lane)}"`,
      );
      return nextAnchor.replace(
        />([\s\S]*?)(<\/a\s*>)/i,
        '>View paid options$2',
      );
    },
  );
  if (updatedBlock === match[1]) return;
  const next = current.replace(marker, `<!-- search-growth-offer:start -->${updatedBlock}<!-- search-growth-offer:end -->`);
  if (writeIfChanged(file, next)) html += 1;
}

function updateJsonLdOfferRoutes(file, repo) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  const marker =
    /(<!-- search-growth-jsonld:start -->\s*<script\b[^>]*>)([\s\S]*?)(<\/script>\s*<!-- search-growth-jsonld:end -->)/;
  const match = current.match(marker);
  if (!match?.[2]) return;

  let data;
  try {
    data = JSON.parse(match[2]);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid search-growth JSON-LD in ${file}: ${detail}`);
  }

  const repository = repositoryByName.get(repo);
  let changed = false;
  const visit = (value) => {
    if (Array.isArray(value)) {
      for (const entry of value) visit(entry);
      return;
    }
    if (!value || typeof value !== 'object') return;

    if (value['@type'] === 'Offer' && !isFreeStructuredOffer(value)) {
      const lane = laneByName.get(value.name) ?? laneById.get(repository.lane);
      const expected = inquiryUrl(repo, lane.id);
      if (value.url !== expected) {
        value.url = expected;
        changed = true;
      }
    }
    for (const nested of Object.values(value)) visit(nested);
  };
  visit(data);
  if (!changed) return;

  const next = current.replace(
    marker,
    `$1${JSON.stringify(data)}$3`,
  );
  if (writeIfChanged(file, next)) html += 1;
}

function updatePortfolioServiceOffers() {
  const file = path.join(workspaceRoot, 'doeon-kim-portfolio/serviceOffers.ts');
  const offers = catalog.repositories.map((repository) => {
    const manifestPath = path.join(
      workspaceRoot,
      repository.repo,
      'docs/service-offer.json',
    );
    if (!fs.existsSync(manifestPath)) {
      throw new Error(
        `service manifest is missing for portfolio offer: ${repository.repo}`,
      );
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return {
      repo: repository.repo,
      name: manifest.name,
      canonicalUrl: manifest.canonical_url,
      leadCaptureUrl: inquiryUrl(repository.repo, repository.lane),
      laneId: repository.lane,
      repositoryUrl: manifest.repository_url,
      architectureUrl: manifest.architecture_url,
      revenueUrl: manifest.revenue_architecture_url,
      offer: manifest.productized_offer,
      freeEntry: manifest.free_lead_magnet,
      paidSku: manifest.first_paid_sku,
      primaryQuery: manifest.search_positioning.primary_query,
      category:
        manifest.structured_data.applicationCategory ??
        manifest.structured_data['@type'],
    };
  });

  const next = `export const SERVICE_OFFERS = ${JSON.stringify(offers, null, 2)} as const;\n\nexport type ServiceOffer = (typeof SERVICE_OFFERS)[number];\n`;
  if (writeIfChanged(file, next)) portfolioOffers += 1;
}

for (const repository of catalog.repositories) {
  const repo = repository.repo;
  const repoRoot = path.join(workspaceRoot, repo);
  if (!fs.existsSync(path.join(repoRoot, '.git'))) {
    throw new Error(`active repository is not cloned: ${repo}`);
  }

  for (const relative of manifestCopies) {
    updateManifest(path.join(repoRoot, relative), repo);
  }
  updateReadme(path.join(repoRoot, 'README.md'), repo);
  updateLegacyInquiryReferences(path.join(repoRoot, 'README.md'), repo);
  updateLegacyInquiryReferences(path.join(repoRoot, 'SUPPORT.md'), repo);
  updatePrivateIntakeCopy(path.join(repoRoot, 'SUPPORT.md'), repo);
  updateLegacyInquiryReferences(
    path.join(repoRoot, 'docs/revenue-architecture.md'),
    repo,
  );
  updateRevenueDoc(path.join(repoRoot, 'docs/revenue-architecture.md'), repo);
  updatePrivateIntakeCopy(
    path.join(repoRoot, 'docs/revenue-architecture.md'),
    repo,
  );
  updateLegacyInquiryReferences(path.join(repoRoot, 'constants.ts'), repo);
  updateSearchDoc(
    path.join(repoRoot, 'docs/search-growth-implementation.md'),
    repo,
  );
  updatePrivateIntakeCopy(
    path.join(repoRoot, 'docs/search-growth-implementation.md'),
    repo,
  );
  for (const relative of llmsCopies) {
    updateLlms(path.join(repoRoot, relative), repo);
  }
  if (
    removeIfPresent(
      path.join(repoRoot, '.github/ISSUE_TEMPLATE/service-inquiry.yml'),
    )
  ) {
    removedIssueForms += 1;
  }

  const htmlTargets = [
    'index.html',
    'site/index.html',
    'docs/index.html',
    'frontend/index.html',
    'public/index.html',
  ];
  for (const relative of htmlTargets) {
    updateStaticHtml(path.join(repoRoot, relative), repo);
    updateJsonLdOfferRoutes(path.join(repoRoot, relative), repo);
    updateLegacyInquiryReferences(path.join(repoRoot, relative), repo);
  }
}

updatePortfolioServiceOffers();

const summary = [
  `mode=${checkOnly ? 'check' : 'write'}`,
  `changedFiles=${changedFiles}`,
  `manifests=${manifests}`,
  `readmes=${readmes}`,
  `docs=${docs}`,
  `llms=${llms}`,
  `html=${html}`,
  `removedIssueForms=${removedIssueForms}`,
  `portfolioOffers=${portfolioOffers}`,
].join(' ');
console.log(`commerce routes: ${summary}`);

if (checkOnly && changedFiles > 0) process.exitCode = 1;
