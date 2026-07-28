#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const kimRoot = path.join(workspaceRoot, "KIM3310");
const ledger = JSON.parse(
  fs.readFileSync(
    path.join(
      kimRoot,
      "docs/monetization-operating-system-2026-07-26.json",
    ),
    "utf8",
  ),
);
const pivot = JSON.parse(
  fs.readFileSync(
    path.join(kimRoot, "docs/ad-data-pivot-manifest.json"),
    "utf8",
  ),
);
const checkOnly = !process.argv.includes("--write");
const reviewedDate = "2026-07-28";
const publisherId = "ca-pub-4973160293737562";
const adsenseLoader =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
const centralPortfolio =
  "https://kim3310-doeon-kim-portfolio.pages.dev";
const navigationStart = "<!-- adsense-publication-nav:start -->";
const navigationEnd = "<!-- adsense-publication-nav:end -->";
const privacyStart = "<!-- adsense-privacy-disclosure:start -->";
const privacyEnd = "<!-- adsense-privacy-disclosure:end -->";
const llmsStart = "# ADSENSE-PUBLICATION:START";
const llmsEnd = "# ADSENSE-PUBLICATION:END";
const headersStart = "# ADSENSE-PUBLICATION-CSP:START";
const headersEnd = "# ADSENSE-PUBLICATION-CSP:END";

const surfaces = {
  AegisOps: {
    publicRoot: "public",
    entryFile: "index.html",
    privacyFile: "public/privacy.html",
    termsFile: "public/terms.html",
  },
  "Nexus-Hive": {
    publicRoot: "frontend",
    entryFile: "frontend/index.html",
    privacyFile: "frontend/privacy/index.html",
    termsFile: "frontend/terms/index.html",
  },
  SteadyTap: {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy/index.html",
    termsFile: "site/terms/index.html",
  },
  "Upstage-DocuAgent": {
    publicRoot: ".",
    entryFile: "index.html",
    privacyFile: "privacy.html",
    termsFile: "terms.html",
  },
  "agent-orchestration-benchmark": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy/index.html",
    termsFile: "site/terms/index.html",
  },
  "agent-runtime-go": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy/index.html",
    termsFile: "site/terms/index.html",
  },
  "ai-agent-production-lab": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "ai-security-redteam-lab": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "aix-pilot": {
    publicRoot: "public",
    entryFile: "index.html",
    privacyFile: "public/privacy.html",
    termsFile: "public/terms.html",
  },
  "beaver-study-orchestrator": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "districtpilot-ai": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "doeon-kim-portfolio": {
    publicRoot: "public",
    entryFile: "index.html",
    privacyFile: "public/privacy.html",
    termsFile: "public/terms.html",
  },
  "dream-interpretation-pages": {
    publicRoot: "public",
    entryFile: "index.html",
    privacyFile: "privacy.html",
    termsFile: "public/terms.html",
    adFreeFiles: ["about.html", "symbols.html"],
  },
  "enterprise-llm-adoption-kit": {
    publicRoot: "app/frontend/public",
    entryFile: "app/frontend/index.html",
    privacyFile: "app/frontend/public/privacy.html",
    termsFile: "app/frontend/public/terms.html",
  },
  "fab-ops-yield-control-tower": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  honeypot: {
    publicRoot: "frontend/public",
    entryFile: "frontend/index.html",
    privacyFile: "frontend/public/privacy.html",
    termsFile: "frontend/public/terms.html",
  },
  "kbbq-idle-unity": {
    publicRoot: "docs",
    entryFile: "docs/index.html",
    privacyFile: "docs/privacy.html",
    termsFile: "docs/terms.html",
  },
  "lakehouse-contract-lab": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "llm-onprem-deployment-kit": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "memory-test-master-change-gate": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "multi-cli-pilot": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "nw-service-assurance-workbench": {
    publicRoot: "public",
    entryFile: "index.html",
    privacyFile: "public/privacy.html",
    termsFile: "public/terms.html",
  },
  "ops-reliability-workbench": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "quantum-workbench": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "regulated-case-workbench": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "retina-scan-ai": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
    disclaimer:
      "This material describes a synthetic research prototype. It is not medical advice, a diagnosis, a screening service, or a substitute for review by qualified clinicians.",
  },
  "secure-xl2hwp-local": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "security-threat-response-workbench": {
    publicRoot: "public",
    entryFile: "index.html",
    privacyFile: "public/privacy.html",
    termsFile: "public/terms.html",
    guideFile: "resources.html",
    disclaimer:
      "This material is defensive tabletop guidance for synthetic scenarios. It does not accept incident data, credentials, indicators, or operational secrets.",
  },
  "smallbiz-ops-copilot": {
    publicRoot: "public",
    entryFile: "public/index.html",
    privacyFile: "public/privacy.html",
    termsFile: "public/terms.html",
    guideFile: "resources.html",
  },
  "stage-pilot": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "the-savior": {
    publicRoot: "public",
    entryFile: "public/index.html",
    privacyFile: "public/privacy.html",
    termsFile: "public/terms.html",
  },
  "tool-call-finetune-lab": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
  },
  "twincity-ui": {
    publicRoot: "pages-redirect",
    entryFile: "pages-redirect/index.html",
    privacyFile: "pages-redirect/privacy/index.html",
    termsFile: "pages-redirect/terms/index.html",
    adFreeFiles: ["src/app/layout.tsx"],
  },
  "weld-defect-vision": {
    publicRoot: "site",
    entryFile: "site/index.html",
    privacyFile: "site/privacy.html",
    termsFile: "site/terms.html",
    disclaimer:
      "This material uses synthetic examples for model-validation education. It is not a production inspection result, release decision, or substitute for qualified engineering review.",
  },
};

const ledgerByRepo = new Map(
  ledger.repositories.map((entry) => [entry.repo, entry]),
);
const pivotByRepo = new Map(
  pivot.repositories.map((entry) => [entry.repo, entry]),
);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function truncateAtWord(value, maxLength) {
  const clean = String(value).replace(/\s+/gu, " ").trim();
  if (clean.length <= maxLength) return clean;
  const contentLimit = maxLength - 1;
  const candidate = clean.slice(0, contentLimit + 1);
  const boundary = candidate.lastIndexOf(" ");
  return `${candidate
    .slice(
      0,
      boundary > contentLimit * 0.65 ? boundary : contentLimit,
    )
    .trim()}…`;
}

function replaceMarker(text, start, end, block) {
  const startIndex = text.indexOf(start);
  const endIndex = text.indexOf(end);
  if (startIndex !== -1 && endIndex > startIndex) {
    return `${text.slice(0, startIndex).trimEnd()}\n${block}\n${text
      .slice(endIndex + end.length)
      .trimStart()}`;
  }
  return `${text.replace(/\s*$/u, "")}\n${block}\n`;
}

function removeMarkerBlock(text, start, end) {
  const startIndex = text.indexOf(start);
  const endIndex = text.indexOf(end);
  if (startIndex === -1 || endIndex <= startIndex) return text;
  return `${text.slice(0, startIndex).trimEnd()}\n${text
    .slice(endIndex + end.length)
    .trimStart()}`;
}

function insertBeforeLastClosingTag(text, tag, block) {
  const closingTag = `</${tag}>`;
  const index = text.toLowerCase().lastIndexOf(closingTag);
  if (index === -1) {
    throw new Error(`HTML is missing ${closingTag}`);
  }
  return `${text.slice(0, index).trimEnd()}\n${block}\n${text.slice(index)}`;
}

function writeIfChanged(file, content, changes) {
  const normalized = content.replace(/[ \t]+$/gmu, "");
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (current === normalized) return;
  changes.push(file);
  if (checkOnly) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, normalized);
}

function removeAdLoader(html) {
  return html
    .replace(
      /\s*<!--\s*AdSense Auto Ads readiness:[\s\S]*?-->/giu,
      "",
    )
    .replace(
      /\s*<script\b[^>]*src=["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*["'][^>]*\/>/giu,
      "",
    )
    .replace(
      /\s*<script\b[^>]*src=["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*["'][^>]*>\s*<\/script>/giu,
      "",
    )
    .replace(
      /\s*<script\b[^>]*>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle[\s\S]*?<\/script>/giu,
      "",
    );
}

function ensureCanonical(html, canonical) {
  if (/<link\b[^>]*rel=["']canonical["'][^>]*>/iu.test(html)) {
    return html.replace(
      /<link\b[^>]*rel=["']canonical["'][^>]*>/iu,
      `<link rel="canonical" href="${canonical}" />`,
    );
  }
  return html.replace(
    /<\/head>/iu,
    `  <link rel="canonical" href="${canonical}" />\n</head>`,
  );
}

function ensurePublisherMeta(html) {
  if (/name=["']google-adsense-account["']/iu.test(html)) return html;
  return html.replace(
    /<\/head>/iu,
    `  <meta name="google-adsense-account" content="${publisherId}">\n</head>`,
  );
}

function canonicalRoute(route) {
  const withLeadingSlash = route.startsWith("/") ? route : `/${route}`;
  if (withLeadingSlash.endsWith("/index.html")) {
    return withLeadingSlash.slice(0, -"index.html".length);
  }
  if (withLeadingSlash.endsWith(".html")) {
    return withLeadingSlash.slice(0, -".html".length);
  }
  return withLeadingSlash;
}

function canonicalUrl(domain, route) {
  return `https://${domain}${canonicalRoute(route)}`;
}

function normalizeInternalHtmlLinks(html) {
  return html.replace(
    /(\bhref=["'])(\/[^"'?#]*\.html)([?#][^"']*)?(["'])/giu,
    (_match, prefix, route, suffix = "", quote) =>
      `${prefix}${canonicalRoute(route)}${suffix}${quote}`,
  );
}

function publishedFileHref(repoRoot, publicRoot, file) {
  const absolutePublic = path.resolve(repoRoot, publicRoot);
  const absoluteFile = path.resolve(repoRoot, file);
  if (!absoluteFile.startsWith(`${absolutePublic}${path.sep}`)) {
    return `/${path.basename(file)}`;
  }
  const relative = path.relative(absolutePublic, absoluteFile).split(path.sep).join("/");
  if (relative.endsWith("/index.html")) {
    return `/${relative.slice(0, -"index.html".length)}`;
  }
  return canonicalRoute(relative);
}

function publishedHref(repoRoot, publicRoot, file, domain) {
  const fallback = publishedFileHref(repoRoot, publicRoot, file);
  const absoluteFile = path.resolve(repoRoot, file);
  if (!fs.existsSync(absoluteFile)) return fallback;
  const html = fs.readFileSync(absoluteFile, "utf8");
  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/giu)].find((match) =>
    /\brel=["'][^"']*\bcanonical\b[^"']*["']/iu.test(match[0]),
  );
  const href = canonicalTag?.[0].match(/\bhref=["']([^"']+)["']/iu)?.[1];
  if (!href) return fallback;
  try {
    const canonical = new URL(href, `https://${domain}/`);
    if (canonical.protocol !== "https:" || canonical.hostname !== domain) {
      return fallback;
    }
    return `${canonicalRoute(canonical.pathname)}${canonical.search}`;
  } catch {
    return fallback;
  }
}

function stripGeneratedReadmeSections(markdown) {
  return markdown
    .replace(
      /<!-- KIM3310:AD-DATA-PIVOT:START -->[\s\S]*?<!-- KIM3310:AD-DATA-PIVOT:END -->/gu,
      "",
    )
    .replace(/<!--[\s\S]*?-->/gu, "")
    .replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*$/gmu, "")
    .replace(/^\s*\[!\[[^\]]*\][^\n]*$/gmu, "");
}

function sourceSections(markdown) {
  const sections = [];
  let current = { heading: "", level: 2, lines: [] };
  for (const line of stripGeneratedReadmeSections(markdown).split(/\r?\n/u)) {
    const heading = line.match(/^(#{1,4})\s+(.+)$/u);
    if (heading) {
      if (current.lines.some((entry) => entry.trim())) sections.push(current);
      current = {
        heading: heading[2].trim(),
        level: Math.min(4, Math.max(2, heading[1].length + 1)),
        lines: [],
      };
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.some((entry) => entry.trim())) sections.push(current);
  return sections;
}

const excludedHeadings =
  /service launch|paid|pricing|revenue|monetization|sponsor|commercial|license|support|roadmap|funding|checkout|lead capture/iu;

function selectSource(markdown, maxWords) {
  let words = 0;
  const selected = [];
  for (const section of sourceSections(markdown)) {
    if (excludedHeadings.test(section.heading)) continue;
    const sectionText = section.lines.join("\n");
    const sectionWords = sectionText
      .replace(/[`*_>#|[\]()]/gu, " ")
      .split(/\s+/u)
      .filter(Boolean).length;
    if (words > 350 && words + sectionWords > maxWords) break;
    selected.push(
      `${"#".repeat(section.level)} ${section.heading}\n${sectionText}`,
    );
    words += sectionWords;
  }
  return selected.join("\n\n");
}

function linkTarget(repo, sourceFile, href) {
  if (/^(https?:|mailto:)/iu.test(href)) return href;
  if (href.startsWith("#")) return href;
  const sourceDirectory = path.posix.dirname(sourceFile);
  const normalized = path.posix.normalize(
    path.posix.join(sourceDirectory, href),
  );
  return `https://github.com/KIM3310/${encodeURIComponent(
    repo,
  )}/blob/main/${normalized}`;
}

function inlineMarkdown(value, repo, sourceFile) {
  const links = [];
  let prepared = value.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/gu,
    (_match, label, href) => {
      const token = `KIMLINKTOKEN${links.length}END`;
      links.push({
        label,
        href: linkTarget(repo, sourceFile, href),
      });
      return token;
    },
  );
  prepared = escapeHtml(prepared)
    .replace(/`([^`]+)`/gu, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/gu, "<strong>$1</strong>")
    .replace(/__([^_]+)__/gu, "<strong>$1</strong>");
  for (const [index, link] of links.entries()) {
    prepared = prepared.replace(
      `KIMLINKTOKEN${index}END`,
      `<a href="${escapeHtml(link.href)}" rel="noopener">${escapeHtml(
        link.label,
      )}</a>`,
    );
  }
  return prepared;
}

function markdownToHtml(markdown, repo, sourceFile) {
  const lines = markdown.split(/\r?\n/u);
  const output = [];
  let paragraph = [];
  let list = null;
  let code = null;
  let table = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    output.push(
      `<p>${inlineMarkdown(paragraph.join(" "), repo, sourceFile)}</p>`,
    );
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    output.push(
      `<${list.type}>${list.items
        .map(
          (item) =>
            `<li>${inlineMarkdown(item, repo, sourceFile)}</li>`,
        )
        .join("")}</${list.type}>`,
    );
    list = null;
  };
  const flushTable = () => {
    if (table.length < 2) {
      table = [];
      return;
    }
    const rows = table
      .filter((row) => !/^\s*\|?[\s:|-]+\|?\s*$/u.test(row))
      .map((row) =>
        row
          .replace(/^\s*\||\|\s*$/gu, "")
          .split("|")
          .map((cell) => cell.trim()),
      );
    if (rows.length < 2) {
      table = [];
      return;
    }
    const [head, ...body] = rows;
    output.push(
      `<div class="table-scroll"><table><thead><tr>${head
        .map(
          (cell) =>
            `<th>${inlineMarkdown(cell, repo, sourceFile)}</th>`,
        )
        .join("")}</tr></thead><tbody>${body
        .map(
          (row) =>
            `<tr>${row
              .map(
                (cell) =>
                  `<td>${inlineMarkdown(cell, repo, sourceFile)}</td>`,
              )
              .join("")}</tr>`,
        )
        .join("")}</tbody></table></div>`,
    );
    table = [];
  };

  for (const line of lines) {
    const fence = line.match(/^```(.*)$/u);
    if (fence) {
      flushParagraph();
      flushList();
      flushTable();
      if (code) {
        output.push(
          `<pre><code>${escapeHtml(code.lines.join("\n"))}</code></pre>`,
        );
        code = null;
      } else {
        code = { language: fence[1].trim(), lines: [] };
      }
      continue;
    }
    if (code) {
      code.lines.push(line);
      continue;
    }
    if (line.includes("|") && /^\s*\|?.+\|.+\|?\s*$/u.test(line)) {
      flushParagraph();
      flushList();
      table.push(line);
      continue;
    }
    flushTable();
    const heading = line.match(/^(#{2,4})\s+(.+)$/u);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(4, heading[1].length);
      output.push(
        `<h${level}>${inlineMarkdown(
          heading[2],
          repo,
          sourceFile,
        )}</h${level}>`,
      );
      continue;
    }
    const unordered = line.match(/^\s*[-*]\s+(.+)$/u);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/u);
    if (unordered || ordered) {
      flushParagraph();
      const type = ordered ? "ol" : "ul";
      if (list && list.type !== type) flushList();
      if (!list) list = { type, items: [] };
      list.items.push((ordered || unordered)[1]);
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    if (/^\s*!\[[^\]]*\]\([^)]+\)\s*$/u.test(line)) continue;
    paragraph.push(line.replace(/^\s*>\s?/u, ""));
  }
  flushParagraph();
  flushList();
  flushTable();
  if (code) {
    output.push(
      `<pre><code>${escapeHtml(code.lines.join("\n"))}</code></pre>`,
    );
  }
  return output.join("\n");
}

function findArchitectureSource(repoRoot) {
  const candidates = [
    "docs/system-architecture.md",
    "docs/architecture.md",
    "docs/service-architecture.md",
    "docs/architecture-pack.md",
    "docs/cloud-ai-architecture.md",
  ];
  return (
    candidates.find((candidate) =>
      fs.existsSync(path.join(repoRoot, candidate)),
    ) || "README.md"
  );
}

function walkFiles(root, predicate, limit = 20) {
  const matches = [];
  const ignored = new Set([
    ".git",
    ".venv",
    "node_modules",
    "dist",
    ".pages-dist",
    ".wrangler",
    "coverage",
  ]);
  const visit = (directory) => {
    if (matches.length >= limit || !fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (matches.length >= limit || ignored.has(entry.name)) continue;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (predicate(absolute)) {
        matches.push(path.relative(root, absolute).split(path.sep).join("/"));
      }
    }
  };
  visit(root);
  return matches;
}

function verificationInventory(repoRoot) {
  const tests = walkFiles(
    repoRoot,
    (file) =>
      /(^|\/)(tests?|__tests__)\//u.test(file) ||
      /\.(test|spec)\.[cm]?[jt]sx?$/u.test(file),
  );
  const workflows = fs.existsSync(path.join(repoRoot, ".github/workflows"))
    ? fs
        .readdirSync(path.join(repoRoot, ".github/workflows"))
        .filter((name) => /\.ya?ml$/u.test(name))
        .map((name) => `.github/workflows/${name}`)
    : [];
  const commands = [];
  const packageFile = path.join(repoRoot, "package.json");
  if (fs.existsSync(packageFile)) {
    const packageJson = JSON.parse(fs.readFileSync(packageFile, "utf8"));
    for (const name of ["verify", "test", "lint", "typecheck", "build"]) {
      if (packageJson.scripts?.[name]) commands.push(`npm run ${name}`);
    }
  }
  if (fs.existsSync(path.join(repoRoot, "Makefile"))) {
    const makefile = fs.readFileSync(path.join(repoRoot, "Makefile"), "utf8");
    for (const name of ["verify", "test", "lint", "build"]) {
      if (new RegExp(`^${name}:`, "mu").test(makefile)) {
        commands.push(`make ${name}`);
      }
    }
  }
  return {
    tests,
    workflows,
    commands: [...new Set(commands)].slice(0, 8),
  };
}

function fileListHtml(items, emptyCopy) {
  if (items.length === 0) return `<p>${escapeHtml(emptyCopy)}</p>`;
  return `<ul>${items
    .map((item) => `<li><code>${escapeHtml(item)}</code></li>`)
    .join("")}</ul>`;
}

function editorialCss() {
  return `
    :root { color-scheme: light; --ink: #17201f; --muted: #52605d; --line: #cbd2ce; --paper: #ffffff; --ground: #f5f6f4; --green: #126455; --coral: #c94732; --gold: #b67a00; }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; background: var(--ground); color: var(--ink); font: 17px/1.72 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    a { color: var(--green); text-underline-offset: 3px; }
    .site-header { border-bottom: 1px solid var(--line); background: rgba(245, 246, 244, .97); }
    .site-nav, .article-shell, .site-footer-inner { width: min(920px, calc(100% - 32px)); margin: 0 auto; }
    .site-nav { min-height: 62px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
    .site-nav strong { font-size: .92rem; }
    .nav-links { display: flex; flex-wrap: wrap; gap: 14px; font-size: .84rem; }
    .article-shell { padding: 54px 0 72px; }
    .breadcrumbs { color: var(--muted); font-size: .82rem; }
    .article-intro { padding: 28px 0 36px; border-bottom: 2px solid var(--ink); }
    .kicker { color: var(--coral); font-size: .76rem; font-weight: 800; text-transform: uppercase; }
    h1 { margin: 10px 0 16px; max-width: 18ch; font-size: 3.5rem; line-height: 1.04; letter-spacing: 0; overflow-wrap: anywhere; }
    .lede { max-width: 68ch; color: var(--muted); font-size: 1.08rem; }
    .review-note { margin-top: 18px; color: var(--muted); font-size: .84rem; }
    article { padding-top: 24px; }
    article h2 { margin: 42px 0 12px; padding-top: 6px; font-size: 1.75rem; line-height: 1.2; letter-spacing: 0; }
    article h3 { margin: 30px 0 8px; font-size: 1.2rem; letter-spacing: 0; }
    article h4 { margin: 24px 0 6px; font-size: 1.02rem; letter-spacing: 0; }
    article p, article li { max-width: 76ch; }
    article li + li { margin-top: 6px; }
    pre { max-width: 100%; overflow: auto; border-left: 4px solid var(--gold); background: #1d2423; color: #f6f8f7; padding: 18px; border-radius: 4px; font-size: .86rem; }
    code { overflow-wrap: anywhere; }
    :not(pre) > code { border: 1px solid var(--line); background: var(--paper); padding: 1px 5px; border-radius: 3px; font-size: .9em; }
    .table-scroll { overflow-x: auto; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; background: var(--paper); font-size: .9rem; }
    th, td { border: 1px solid var(--line); padding: 10px; text-align: left; vertical-align: top; }
    th { background: #e9eeeb; }
    .boundary-note { margin: 30px 0 4px; border-left: 4px solid var(--coral); background: var(--paper); padding: 18px; }
    .source-basis { margin-top: 48px; border-top: 1px solid var(--line); padding-top: 22px; color: var(--muted); }
    .site-footer { border-top: 1px solid var(--line); background: var(--paper); }
    .site-footer-inner { padding: 28px 0 44px; color: var(--muted); font-size: .84rem; }
    .site-footer-links { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 12px; }
    @media (max-width: 720px) {
      .site-nav { align-items: flex-start; flex-direction: column; padding: 14px 0; }
      .article-shell { padding-top: 32px; }
      h1 { font-size: 2.35rem; }
    }
  `;
}

function navigationLinks(guidePath, privacyHref, termsHref) {
  return [
    ["/", "Home"],
    [canonicalRoute(guidePath), "Project guide"],
    [canonicalRoute("architecture.html"), "Architecture"],
    [canonicalRoute("verification.html"), "Verification"],
    [canonicalRoute("publisher.html"), "Publisher"],
    [privacyHref, "Privacy"],
    [termsHref, "Terms"],
  ];
}

function articlePage({
  repo,
  name,
  domain,
  pathName,
  pageType,
  title,
  description,
  lede,
  body,
  sourceFiles,
  guidePath,
  privacyHref,
  termsHref,
  disclaimer,
  advertising,
}) {
  const canonical = canonicalUrl(domain, pathName);
  const schema = {
    "@context": "https://schema.org",
    "@type": pageType === "Publisher" ? "AboutPage" : "TechArticle",
    headline: title,
    description,
    url: canonical,
    dateModified: reviewedDate,
    author: {
      "@type": "Person",
      name: "KIM3310",
      url: "https://github.com/KIM3310",
    },
    publisher: {
      "@type": "Person",
      name: "KIM3310",
      url: centralPortfolio,
    },
    isAccessibleForFree: true,
  };
  const sourceLinks = sourceFiles
    .map(
      (source) =>
        `<a href="https://github.com/KIM3310/${encodeURIComponent(
          repo,
        )}/blob/main/${escapeHtml(source)}" rel="noopener">${escapeHtml(
          source,
        )}</a>`,
    )
    .join(", ");
  const nav = navigationLinks(guidePath, privacyHref, termsHref)
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join("");
  const adCode = advertising
    ? `  <script async src="${adsenseLoader}?client=${publisherId}" crossorigin="anonymous"></script>\n`
    : "";
  const boundary = disclaimer
    ? `<aside class="boundary-note"><strong>Scope boundary.</strong> ${escapeHtml(
        disclaimer,
      )}</aside>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(truncateAtWord(title, 60))}</title>
  <meta name="description" content="${escapeHtml(
    truncateAtWord(description, 155),
  )}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="google-adsense-account" content="${publisherId}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(
    truncateAtWord(description, 180),
  )}">
  <meta property="og:url" content="${canonical}">
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll(
    "<",
    "\\u003c",
  )}</script>
${adCode}  <style>${editorialCss()}</style>
</head>
<body data-ad-surface="${advertising ? "editorial" : "none"}">
  <header class="site-header">
    <nav class="site-nav" aria-label="Primary">
      <strong>${escapeHtml(name)}</strong>
      <div class="nav-links">${nav}</div>
    </nav>
  </header>
  <main class="article-shell">
    <p class="breadcrumbs"><a href="/">Home</a> / ${escapeHtml(pageType)}</p>
    <header class="article-intro">
      <div class="kicker">${escapeHtml(pageType)}</div>
      <h1>${escapeHtml(title)}</h1>
      <p class="lede">${escapeHtml(lede)}</p>
      <p class="review-note">Reviewed ${reviewedDate}. This page is derived from checked-in repository evidence and links back to its source.</p>
    </header>
    ${boundary}
    <article>${body}</article>
    <aside class="source-basis">
      <strong>Source basis:</strong> ${sourceLinks}. Corrections can be proposed through the public repository without submitting private data.
    </aside>
  </main>
  <footer class="site-footer">
    <div class="site-footer-inner">
      <div class="site-footer-links">${nav}<a href="${centralPortfolio}/">Resource atlas</a></div>
      <p>${
        advertising
          ? "Advertising may appear on this public editorial page after Google approves the site. Ads are not placed inside private, transactional, diagnostic, security-response, or operational workflows."
          : "This publisher and policy page does not request an advertising placement."
      }</p>
    </div>
  </footer>
</body>
</html>
`;
}

function publisherBody(repo, domain, positioning, privacyHref) {
  return `
    <h2>Who maintains this publication</h2>
    <p>This site is maintained by KIM3310 as the public publication surface for the <code>${escapeHtml(
      repo,
    )}</code> repository. The site explains the implementation, operating boundaries, and verification evidence behind the project. The corresponding source history is available publicly on GitHub.</p>
    <h2>Editorial method</h2>
    <p>Technical statements are derived from checked-in source code, tests, architecture notes, and reproducible commands. The publication avoids invented customer results, traffic claims, revenue promises, and performance guarantees. When a statement describes a prototype or synthetic fixture, the page keeps that boundary explicit.</p>
    <p>${escapeHtml(positioning)}</p>
    <h2>Advertising boundary</h2>
    <p>Google AdSense code is limited to substantial public editorial pages. Privacy notices, terms, publisher information, private inquiries, account areas, uploads, result screens, diagnostic views, incident-response workflows, regulated decisions, and operational controls are excluded from ad placement.</p>
    <h2>Corrections and contact</h2>
    <p>Non-sensitive corrections can be proposed through <a href="https://github.com/KIM3310/${encodeURIComponent(
      repo,
    )}/issues" rel="noopener">the repository issue tracker</a>. Confidential or commercial material should not be posted publicly. The central portfolio provides a separate private inquiry path.</p>
    <h2>Privacy</h2>
    <p>The site-level advertising and cookie disclosure is published in the <a href="${privacyHref}">privacy policy</a>. The canonical origin for this publication is <code>https://${escapeHtml(
      domain,
    )}/</code>.</p>
  `;
}

function entryNavigationBlock(
  name,
  positioning,
  guidePath,
  privacyHref,
  termsHref,
) {
  const links = navigationLinks(guidePath, privacyHref, termsHref)
    .slice(1)
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join("");
  return `${navigationStart}
<style id="adsense-publication-nav-style">
  .adsense-publication-nav { margin: 0; border-top: 1px solid #cbd2ce; border-bottom: 1px solid #cbd2ce; background: #f5f6f4; color: #17201f; }
  .adsense-publication-nav__inner { width: min(920px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0; }
  .adsense-publication-nav h2 { margin: 0 0 8px; font: 750 1.55rem/1.2 system-ui, sans-serif; letter-spacing: 0; }
  .adsense-publication-nav p { max-width: 72ch; margin: 0; color: #52605d; font: 16px/1.6 system-ui, sans-serif; }
  .adsense-publication-nav nav { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
  .adsense-publication-nav a { color: #126455; font: 700 14px/1.4 system-ui, sans-serif; text-underline-offset: 3px; }
</style>
<section class="adsense-publication-nav" aria-labelledby="adsense-publication-nav-title">
  <div class="adsense-publication-nav__inner">
    <h2 id="adsense-publication-nav-title">${escapeHtml(
      name,
    )} project evidence</h2>
    <p>${escapeHtml(
      positioning,
    )} The linked guides are derived from the repository's checked-in documentation, architecture, tests, and release checks.</p>
    <nav aria-label="Project evidence and policies">${links}</nav>
  </div>
</section>
${navigationEnd}`;
}

function privacyDisclosure(repo, publisherHref) {
  return `${privacyStart}
<section id="advertising-and-cookies">
  <h2>Public-site advertising and cookies</h2>
  <p>Substantial public editorial pages on this website may load Google AdSense after site approval. Google may use cookies or similar storage to deliver, measure, and protect advertising. Advertising is excluded from privacy, terms, publisher, private inquiry, upload, result, account, diagnostic, incident-response, regulated-decision, and operational workflow pages.</p>
  <p>Where required in the EEA, the UK, or Switzerland, personalized advertising must remain disabled until a valid choice is collected through a Google-certified consent flow. Browser and regional privacy choices remain subject to the applicable Google and site controls.</p>
  <p>This disclosure concerns the public website for <code>${escapeHtml(
    repo,
  )}</code>. It does not change the separate data behavior of a native application, local tool, or self-hosted deployment. See <a href="${publisherHref}">publisher and editorial information</a>.</p>
</section>
${privacyEnd}`;
}

function updateHtmlPolicyFile(file, block, canonical, changes) {
  if (!fs.existsSync(file)) {
    throw new Error(`policy file is missing: ${file}`);
  }
  let html = fs.readFileSync(file, "utf8");
  html = removeAdLoader(html);
  html = ensurePublisherMeta(html);
  html = ensureCanonical(html, canonical);
  html = removeMarkerBlock(html, privacyStart, privacyEnd);
  const updatedWithDisclosure = /<\/main>/iu.test(html)
    ? insertBeforeLastClosingTag(html, "main", block)
    : insertBeforeLastClosingTag(html, "body", block);
  const updated = normalizeInternalHtmlLinks(updatedWithDisclosure);
  writeIfChanged(file, updated, changes);
}

function updateSitemap(
  file,
  domain,
  requiredPaths,
  changes,
  obsoletePaths = [],
) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const obsoleteUrls = new Set(
    obsoletePaths.map((route) => canonicalUrl(domain, route)),
  );
  const existing = [...current.matchAll(/<loc>([^<]+)<\/loc>/giu)]
    .map((match) => match[1].trim())
    .map((url) => {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "https:" || parsed.hostname !== domain) {
          return url;
        }
        return canonicalUrl(domain, parsed.pathname);
      } catch {
        return url;
      }
    })
    .filter(
      (url) =>
        url.startsWith(`https://${domain}/`) &&
        !/\.(json|txt)$/iu.test(new URL(url).pathname) &&
        !obsoleteUrls.has(url),
    );
  const urls = [
    `https://${domain}/`,
    ...requiredPaths.map((route) => canonicalUrl(domain, route)),
    ...existing,
  ];
  const unique = [...new Set(urls)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (url, index) => `  <url>
    <loc>${escapeHtml(url)}</loc>
    <lastmod>${reviewedDate}</lastmod>
    <changefreq>${index === 0 ? "weekly" : "monthly"}</changefreq>
    <priority>${index === 0 ? "1.0" : "0.7"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
  writeIfChanged(file, xml, changes);
}

function updateLlmsFile(file, domain, guidePath, changes) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, "utf8");
  const block = `${llmsStart}
Editorial guide: ${canonicalUrl(domain, guidePath)}
Architecture article: ${canonicalUrl(domain, "architecture.html")}
Verification article: ${canonicalUrl(domain, "verification.html")}
Publisher information: ${canonicalUrl(domain, "publisher.html")}
${llmsEnd}`;
  writeIfChanged(
    file,
    replaceMarker(current, llmsStart, llmsEnd, block),
    changes,
  );
}

function updateHeadersFile(file, guidePath, changes) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, "utf8");
  if (!/^\s*Content-Security-Policy:/imu.test(current)) return;
  const rules = [guidePath, "architecture.html", "verification.html"]
    .map(
      (route) => `${canonicalRoute(route)}
  ! Content-Security-Policy`,
    )
    .join("\n\n");
  const block = `${headersStart}
${rules}
${headersEnd}`;
  writeIfChanged(
    file,
    replaceMarker(current, headersStart, headersEnd, block),
    changes,
  );
}

function main() {
  const changes = [];
  const directRepositories = ledger.repositories.filter(
    (entry) => entry.repo !== "KIM3310",
  );
  if (directRepositories.length !== 34) {
    throw new Error("expected 34 direct AdSense repositories");
  }
  if (
    Object.keys(surfaces).sort().join("\n") !==
    directRepositories
      .map((entry) => entry.repo)
      .sort()
      .join("\n")
  ) {
    throw new Error("publication surface map does not match the direct ledger");
  }

  for (const ledgerEntry of directRepositories) {
    const repo = ledgerEntry.repo;
    const surface = surfaces[repo];
    const repoRoot = path.join(workspaceRoot, repo);
    const publicationRoot = path.join(repoRoot, surface.publicRoot);
    const entryFile = path.join(repoRoot, surface.entryFile);
    const privacyFile = path.join(repoRoot, surface.privacyFile);
    const termsFile = path.join(repoRoot, surface.termsFile);
    const serviceOffer = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "docs/service-offer.json"), "utf8"),
    );
    const pivotEntry = pivotByRepo.get(repo);
    if (!pivotEntry) throw new Error(`missing pivot entry for ${repo}`);
    const domain = ledgerEntry.ad_domain;
    const name = serviceOffer.name;
    const guidePath = surface.guideFile || "guide.html";
    const privacyHref = publishedHref(
      repoRoot,
      surface.publicRoot,
      surface.privacyFile,
      domain,
    );
    const termsHref = publishedHref(
      repoRoot,
      surface.publicRoot,
      surface.termsFile,
      domain,
    );
    const privacyFileHref = publishedFileHref(
      repoRoot,
      surface.publicRoot,
      surface.privacyFile,
    );
    const termsFileHref = publishedFileHref(
      repoRoot,
      surface.publicRoot,
      surface.termsFile,
    );
    const readmeSource = "README.md";
    const architectureSource = findArchitectureSource(repoRoot);
    const qualitySource = fs.existsSync(
      path.join(repoRoot, "docs/quality-gate.md"),
    )
      ? "docs/quality-gate.md"
      : "README.md";
    const readme = fs.readFileSync(path.join(repoRoot, readmeSource), "utf8");
    const architecture = fs.readFileSync(
      path.join(repoRoot, architectureSource),
      "utf8",
    );
    const quality = fs.readFileSync(
      path.join(repoRoot, qualitySource),
      "utf8",
    );
    const inventory = verificationInventory(repoRoot);
    const positioning = pivotEntry.positioning;
    const audience = pivotEntry.audience;

    const guideBody = markdownToHtml(
      selectSource(readme, 1_750),
      repo,
      readmeSource,
    );
    const architectureBody = markdownToHtml(
      selectSource(architecture, 1_500),
      repo,
      architectureSource,
    );
    const qualityBody = markdownToHtml(
      selectSource(quality, 1_000),
      repo,
      qualitySource,
    );
    const verificationBody = `${qualityBody}
      <h2>Checked-in evidence inventory</h2>
      <p>The following files and commands are discovered from this repository rather than inferred from a generic template. Their presence does not prove production readiness by itself; it gives reviewers a concrete path to reproduce the maintained checks.</p>
      <h3>Verification commands</h3>
      ${fileListHtml(
        inventory.commands,
        "No single aggregate verification command is declared; consult the repository documentation for component-specific checks.",
      )}
      <h3>Test files</h3>
      ${fileListHtml(
        inventory.tests,
        "No conventional test-file path was discovered by the publication generator.",
      )}
      <h3>Continuous integration workflows</h3>
      ${fileListHtml(
        inventory.workflows,
        "No GitHub Actions workflow file was discovered.",
      )}
      <h2>How to interpret the result</h2>
      <p>A passing local or CI check supports only the behavior covered by that check. It does not establish security certification, regulatory approval, clinical validity, production availability, or a customer outcome. Review the source, fixtures, environment assumptions, and failure paths before extending the result to another deployment.</p>`;

    const common = {
      repo,
      name,
      domain,
      guidePath,
      privacyHref,
      termsHref,
      disclaimer: surface.disclaimer,
    };
    writeIfChanged(
      path.join(publicationRoot, guidePath),
      articlePage({
        ...common,
        pathName: guidePath,
        pageType: "Project guide",
        title: `Project Guide | ${name}`,
        description: `${positioning} Source-backed guide for ${audience}.`,
        lede: `${positioning} This guide organizes the repository's original implementation notes for ${audience}.`,
        body: guideBody,
        sourceFiles: [readmeSource],
        advertising: true,
      }),
      changes,
    );
    writeIfChanged(
      path.join(publicationRoot, "architecture.html"),
      articlePage({
        ...common,
        pathName: "architecture.html",
        pageType: "Architecture",
        title: `Architecture | ${name}`,
        description: `Source-backed architecture, boundaries, data flow, and failure handling for ${name}.`,
        lede:
          "A repository-derived architecture review covering components, control flow, operating boundaries, and the evidence a technical reviewer should inspect.",
        body: architectureBody,
        sourceFiles: [architectureSource],
        advertising: true,
      }),
      changes,
    );
    writeIfChanged(
      path.join(publicationRoot, "verification.html"),
      articlePage({
        ...common,
        pathName: "verification.html",
        pageType: "Verification",
        title: `Verification | ${name}`,
        description: `Reproducible tests, quality gates, CI files, and evidence limits for ${name}.`,
        lede:
          "A practical reading path for the repository's test surface, release checks, and the limits of what those checks can establish.",
        body: verificationBody,
        sourceFiles: [qualitySource, readmeSource],
        advertising: true,
      }),
      changes,
    );
    writeIfChanged(
      path.join(publicationRoot, "publisher.html"),
      articlePage({
        ...common,
        pathName: "publisher.html",
        pageType: "Publisher",
        title: `Publisher | ${name}`,
        description: `Publisher identity, editorial method, corrections, privacy, and advertising boundaries for ${name}.`,
        lede:
          "Who maintains this publication, how technical claims are sourced, and where advertising, privacy, and corrections are bounded.",
        body: publisherBody(repo, domain, positioning, privacyHref),
        sourceFiles: [readmeSource, architectureSource, qualitySource],
        advertising: false,
      }),
      changes,
    );

    if (!fs.existsSync(entryFile)) {
      throw new Error(`entry file is missing for ${repo}: ${entryFile}`);
    }
    let entryHtml = fs.readFileSync(entryFile, "utf8");
    entryHtml = removeAdLoader(entryHtml);
    entryHtml = ensurePublisherMeta(entryHtml);
    entryHtml = ensureCanonical(entryHtml, `https://${domain}/`);
    entryHtml = normalizeInternalHtmlLinks(entryHtml);
    const navBlock = entryNavigationBlock(
      name,
      positioning,
      guidePath,
      privacyHref,
      termsHref,
    );
    entryHtml = removeMarkerBlock(
      entryHtml,
      navigationStart,
      navigationEnd,
    );
    entryHtml = insertBeforeLastClosingTag(entryHtml, "body", navBlock);
    writeIfChanged(entryFile, entryHtml, changes);

    updateHtmlPolicyFile(
      privacyFile,
      privacyDisclosure(repo, canonicalRoute("publisher.html")),
      `https://${domain}${privacyHref}`,
      changes,
    );
    updateHtmlPolicyFile(
      termsFile,
      `${privacyStart}
<section id="advertising-boundary">
  <h2>Advertising boundary</h2>
  <p>Advertising may be served only on substantial public editorial pages. It is excluded from this terms page and from private, transactional, diagnostic, incident-response, regulated-decision, and operational workflow surfaces.</p>
</section>
${privacyEnd}`,
      `https://${domain}${termsHref}`,
      changes,
    );
    for (const relative of surface.adFreeFiles || []) {
      const file = path.join(repoRoot, relative);
      if (!fs.existsSync(file)) {
        throw new Error(`ad-free file is missing for ${repo}: ${file}`);
      }
      writeIfChanged(
        file,
        normalizeInternalHtmlLinks(
          removeAdLoader(fs.readFileSync(file, "utf8")),
        ),
        changes,
      );
    }
    updateSitemap(
      path.join(publicationRoot, "sitemap.xml"),
      domain,
      [
        guidePath,
        "architecture.html",
        "verification.html",
        "publisher.html",
        privacyHref.replace(/^\//u, ""),
        termsHref.replace(/^\//u, ""),
      ],
      changes,
      [privacyFileHref, termsFileHref]
        .filter(
          (route, index) =>
            route !== [privacyHref, termsHref][index],
        )
        .map((route) => route.replace(/^\//u, "")),
    );
    updateLlmsFile(
      path.join(publicationRoot, "llms.txt"),
      domain,
      guidePath,
      changes,
    );
    updateHeadersFile(
      path.join(publicationRoot, "_headers"),
      guidePath,
      changes,
    );
  }

  const report = {
    generated_at: reviewedDate,
    publisher_id: publisherId,
    repositories: directRepositories.map((entry) => {
      const surface = surfaces[entry.repo];
      return {
        repo: entry.repo,
        domain: entry.ad_domain,
        guide_path: canonicalRoute(surface.guideFile || "guide.html"),
        architecture_path: canonicalRoute("architecture.html"),
        verification_path: canonicalRoute("verification.html"),
        publisher_path: canonicalRoute("publisher.html"),
        guide_file: surface.guideFile || "guide.html",
        architecture_file: "architecture.html",
        verification_file: "verification.html",
        publisher_file: "publisher.html",
        publication_root: surface.publicRoot,
        entry_file: surface.entryFile,
        privacy_file: surface.privacyFile,
        terms_file: surface.termsFile,
        entry_ad_policy: "editorial-pages-only",
      };
    }),
  };
  writeIfChanged(
    path.join(kimRoot, "docs/adsense-publication-ledger.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    changes,
  );

  if (checkOnly && changes.length > 0) {
    console.error(
      `AdSense publication check failed: ${changes.length} files would change`,
    );
    for (const file of changes) {
      console.error(path.relative(workspaceRoot, file));
    }
    process.exitCode = 1;
    return;
  }
  console.log(
    `AdSense publication ${checkOnly ? "check" : "write"} ok: repositories=34 changed=${changes.length}`,
  );
}

main();
