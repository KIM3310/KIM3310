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
const repositoryByName = new Map(
  catalog.repositories.map((repository) => [repository.repo, repository]),
);

const manifestCopies = [
  'docs/service-offer.json',
  'public/service-offer.json',
  'site/service-offer.json',
  'frontend/service-offer.json',
];
const llmsCopies = ['public/llms.txt', 'site/llms.txt', 'frontend/llms.txt'];

let changedFiles = 0;
let manifests = 0;
let readmes = 0;
let docs = 0;
let llms = 0;
let html = 0;

function writeIfChanged(file, content) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (current === content) return false;
  if (!checkOnly) fs.writeFileSync(file, content);
  changedFiles += 1;
  return true;
}

function centralUrl(repo) {
  return catalog.gateway.offer_url_template.replace(
    '{repo}',
    encodeURIComponent(repo),
  );
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
      fallback_url: url,
    },
    sponsorship: {
      provider: catalog.gateway.open_source_support,
      eligible: repository.visibility === 'public',
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

function updateManifest(file, repo) {
  if (!fs.existsSync(file)) return;
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.commerce = commerceFor(repo);
  if (writeIfChanged(file, `${JSON.stringify(manifest, null, 2)}\n`)) {
    manifests += 1;
  }
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
  const next = upsertLineAfter(
    current,
    '- Lead capture:',
    '- Commercial route:',
    `- Commercial route: ${centralUrl(repo)}`,
  );
  if (writeIfChanged(file, next)) readmes += 1;
}

function updateSearchDoc(file, repo) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  const row = `| Commercial route | ${centralUrl(repo)} |`;
  let next;
  if (/^\| Commercial route \|.*$/m.test(current)) {
    next = current.replace(/^\| Commercial route \|.*$/m, row);
  } else {
    next = current.replace(
      /^(\| Lead capture URL \|.*)$/m,
      `$1\n${row}`,
    );
  }
  if (writeIfChanged(file, next)) docs += 1;
}

function updateLlms(file, repo) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  const next = upsertLineAfter(
    current,
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
        `href="${centralUrl(repo)}"`,
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
  updateSearchDoc(
    path.join(repoRoot, 'docs/search-growth-implementation.md'),
    repo,
  );
  for (const relative of llmsCopies) {
    updateLlms(path.join(repoRoot, relative), repo);
  }

  const htmlTargets = [
    'site/index.html',
    'docs/index.html',
    'frontend/index.html',
    'public/index.html',
  ];
  for (const relative of htmlTargets) {
    updateStaticHtml(path.join(repoRoot, relative), repo);
  }
}

const summary = [
  `mode=${checkOnly ? 'check' : 'write'}`,
  `changedFiles=${changedFiles}`,
  `manifests=${manifests}`,
  `readmes=${readmes}`,
  `docs=${docs}`,
  `llms=${llms}`,
  `html=${html}`,
].join(' ');
console.log(`commerce routes: ${summary}`);

if (checkOnly && changedFiles > 0) process.exitCode = 1;
