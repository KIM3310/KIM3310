#!/usr/bin/env python3
"""Validate the source-backed AdSense publication surface for every site."""

from __future__ import annotations

from collections import Counter
from hashlib import sha256
from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from typing import NoReturn
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

PROFILE_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = PROFILE_ROOT.parent
LEDGER_PATH = PROFILE_ROOT / "docs/adsense-publication-ledger.json"
PUBLISHER_ID = "ca-pub-4973160293737562"
ADSENSE_LOADER = (
    "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
)
NAVIGATION_START = "<!-- adsense-publication-nav:start -->"
NAVIGATION_END = "<!-- adsense-publication-nav:end -->"
PRIVACY_START = "<!-- adsense-privacy-disclosure:start -->"
PRIVACY_END = "<!-- adsense-privacy-disclosure:end -->"
HEADERS_START = "# ADSENSE-PUBLICATION-CSP:START"
HEADERS_END = "# ADSENSE-PUBLICATION-CSP:END"
WORD_PATTERN = re.compile(r"[A-Za-z0-9][A-Za-z0-9_+.#'/-]*")
FORBIDDEN_AD_COPY = re.compile(
    r"\b(click|tap)\s+(?:on\s+)?(?:an?\s+|the\s+)?ads?\b|"
    r"\bsupport\s+(?:us|this\s+site)\s+by\s+(?:clicking|viewing)\b",
    re.IGNORECASE,
)
ARTICLE_MINIMUMS = {
    "guide": 450,
    "architecture": 180,
    "verification": 250,
    "publisher": 160,
}


def fail(message: str) -> NoReturn:
    raise SystemExit(f"AdSense publication validation failed: {message}")


class HtmlEvidence(HTMLParser):
    """Collect the small set of HTML signals required by the validator."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.text: list[str] = []
        self.article_text: list[str] = []
        self.in_article = 0
        self.title: list[str] = []
        self.in_title = False
        self.h1_count = 0
        self.links: list[str] = []
        self.canonicals: list[str] = []
        self.descriptions: list[str] = []
        self.adsense_accounts: list[str] = []
        self.script_sources: list[str] = []
        self.body_ad_surface: str | None = None

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        attributes = {key.lower(): value or "" for key, value in attrs}
        tag = tag.lower()
        if tag in {"script", "style", "noscript", "svg"}:
            self.skip_depth += 1
        if tag == "article":
            self.in_article += 1
        if tag == "title":
            self.in_title = True
        if tag == "h1":
            self.h1_count += 1
        if tag == "a" and attributes.get("href"):
            self.links.append(attributes["href"])
        if tag == "link" and "canonical" in attributes.get("rel", "").lower():
            self.canonicals.append(attributes.get("href", ""))
        if tag == "meta":
            name = attributes.get("name", "").lower()
            if name == "description":
                self.descriptions.append(attributes.get("content", ""))
            if name == "google-adsense-account":
                self.adsense_accounts.append(attributes.get("content", ""))
        if tag == "script" and attributes.get("src"):
            self.script_sources.append(attributes["src"])
        if tag == "body":
            self.body_ad_surface = attributes.get("data-ad-surface")

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in {"script", "style", "noscript", "svg"}:
            self.skip_depth = max(0, self.skip_depth - 1)
        if tag == "article":
            self.in_article = max(0, self.in_article - 1)
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.skip_depth:
            return
        clean = " ".join(data.split())
        if not clean:
            return
        self.text.append(clean)
        if self.in_article:
            self.article_text.append(clean)
        if self.in_title:
            self.title.append(clean)


def parse_html(source: str) -> HtmlEvidence:
    parser = HtmlEvidence()
    parser.feed(source)
    return parser


def word_count(parts: list[str]) -> int:
    return len(WORD_PATTERN.findall(unescape(" ".join(parts))))


def extract_json_ld(source: str) -> list[dict]:
    blocks = re.findall(
        r"<script\b[^>]*type=[\"']application/ld\+json[\"'][^>]*>"
        r"([\s\S]*?)</script>",
        source,
        flags=re.IGNORECASE,
    )
    parsed = []
    for block in blocks:
        try:
            value = json.loads(block)
        except json.JSONDecodeError as error:
            fail(f"invalid JSON-LD: {error}")
        if isinstance(value, dict):
            parsed.append(value)
    return parsed


def normalized_article_hash(evidence: HtmlEvidence) -> str:
    normalized = re.sub(
        r"[^a-z0-9]+",
        " ",
        " ".join(evidence.article_text).lower(),
    ).strip()
    return sha256(normalized.encode()).hexdigest()


def validate_article(
    *,
    repo: str,
    page_name: str,
    file: Path,
    canonical: str,
    advertising: bool,
    titles: Counter[str],
    descriptions: Counter[str],
    article_hashes: dict[str, tuple[str, str]],
) -> tuple[int, int]:
    if not file.is_file():
        fail(f"{repo} is missing {file.relative_to(WORKSPACE_ROOT)}")
    source = file.read_text()
    evidence = parse_html(source)
    label = f"{repo}/{file.relative_to(WORKSPACE_ROOT / repo)}"

    title = " ".join(evidence.title).strip()
    if not 12 <= len(title) <= 60:
        fail(f"{label} title length is {len(title)}, expected 12-60")
    if len(evidence.descriptions) != 1:
        fail(f"{label} must contain exactly one meta description")
    description = evidence.descriptions[0].strip()
    if not 60 <= len(description) <= 155:
        fail(
            f"{label} description length is {len(description)}, expected 60-155"
        )
    titles[title.lower()] += 1
    descriptions[description.lower()] += 1

    if evidence.h1_count != 1:
        fail(f"{label} must contain exactly one h1")
    if evidence.canonicals != [canonical]:
        fail(
            f"{label} canonical mismatch: "
            f"expected={canonical} actual={evidence.canonicals}"
        )
    if evidence.adsense_accounts != [PUBLISHER_ID]:
        fail(f"{label} has an unexpected AdSense ownership declaration")

    loader_count = sum(
        ADSENSE_LOADER in source_url
        for source_url in evidence.script_sources
    )
    expected_loader_count = 1 if advertising else 0
    if loader_count != expected_loader_count:
        fail(
            f"{label} AdSense loader count is {loader_count}, "
            f"expected {expected_loader_count}"
        )
    expected_surface = "editorial" if advertising else "none"
    if evidence.body_ad_surface != expected_surface:
        fail(
            f"{label} data-ad-surface is {evidence.body_ad_surface!r}, "
            f"expected {expected_surface!r}"
        )
    if FORBIDDEN_AD_COPY.search(" ".join(evidence.text)):
        fail(f"{label} contains prohibited ad-click encouragement")

    schemas = extract_json_ld(source)
    if len(schemas) != 1:
        fail(f"{label} must contain exactly one JSON-LD object")
    expected_type = "AboutPage" if page_name == "publisher" else "TechArticle"
    schema = schemas[0]
    if schema.get("@type") != expected_type:
        fail(f"{label} schema type must be {expected_type}")
    if schema.get("url") != canonical:
        fail(f"{label} JSON-LD URL must match its canonical URL")
    publisher = schema.get("publisher", {})
    if publisher.get("@type") != "Person" or publisher.get("name") != "KIM3310":
        fail(f"{label} must identify the real individual publisher")

    required_links = {
        "/",
        "/architecture.html",
        "/verification.html",
        "/publisher.html",
    }
    if not required_links.issubset(set(evidence.links)):
        fail(f"{label} is missing primary internal navigation")
    if not any(
        link.startswith(f"https://github.com/KIM3310/{repo}/")
        for link in evidence.links
    ):
        fail(f"{label} is missing a repository evidence link")

    article_words = word_count(evidence.article_text)
    if article_words < ARTICLE_MINIMUMS[page_name]:
        fail(
            f"{label} article has {article_words} words, "
            f"minimum is {ARTICLE_MINIMUMS[page_name]}"
        )
    total_words = word_count(evidence.text)
    article_hash = normalized_article_hash(evidence)
    duplicate = article_hashes.get(article_hash)
    if duplicate:
        fail(
            f"{label} duplicates the article body in "
            f"{duplicate[0]}/{duplicate[1]}"
        )
    article_hashes[article_hash] = (
        repo,
        str(file.relative_to(WORKSPACE_ROOT / repo)),
    )
    return article_words, total_words


def validate_policy(
    repo: str,
    file: Path,
    required_id: str,
    required_copy: str,
    domain: str,
) -> str:
    if not file.is_file():
        fail(f"{repo} is missing {file.relative_to(WORKSPACE_ROOT)}")
    source = file.read_text()
    evidence = parse_html(source)
    label = f"{repo}/{file.relative_to(WORKSPACE_ROOT / repo)}"
    if ADSENSE_LOADER in source:
        fail(f"{label} must remain advertising-free")
    if source.count(PRIVACY_START) != 1 or source.count(PRIVACY_END) != 1:
        fail(f"{label} must contain one managed disclosure block")
    if f'id="{required_id}"' not in source:
        fail(f"{label} is missing #{required_id}")
    if required_copy.lower() not in " ".join(evidence.text).lower():
        fail(f"{label} is missing the required advertising disclosure")
    if evidence.adsense_accounts != [PUBLISHER_ID]:
        fail(f"{label} has an unexpected AdSense ownership declaration")
    if len(evidence.canonicals) != 1:
        fail(f"{label} must contain exactly one canonical URL")
    canonical = urlparse(evidence.canonicals[0])
    if canonical.scheme != "https" or canonical.netloc != domain:
        fail(f"{label} canonical URL must use https://{domain}")
    return canonical.path or "/"


def validate_sitemap(
    repo: str,
    file: Path,
    domain: str,
    required_routes: set[str],
) -> int:
    if not file.is_file():
        fail(f"{repo} is missing {file.relative_to(WORKSPACE_ROOT)}")
    try:
        root = ET.fromstring(file.read_text())
    except ET.ParseError as error:
        fail(f"{repo} sitemap is invalid XML: {error}")
    urls = [
        element.text.strip()
        for element in root.findall("{*}url/{*}loc")
        if element.text
    ]
    if len(urls) != len(set(urls)):
        fail(f"{repo} sitemap contains duplicate URLs")
    expected = {f"https://{domain}{route}" for route in required_routes}
    if not expected.issubset(set(urls)):
        fail(f"{repo} sitemap is missing required publication routes")
    for url in urls:
        parsed = urlparse(url)
        if parsed.scheme != "https" or parsed.netloc != domain:
            fail(f"{repo} sitemap contains a foreign URL: {url}")
        if parsed.path.endswith((".json", ".txt")):
            fail(f"{repo} sitemap contains a non-HTML route: {url}")
    return len(urls)


def main() -> None:
    if not LEDGER_PATH.is_file():
        fail("the publication ledger has not been generated")
    ledger = json.loads(LEDGER_PATH.read_text())
    repositories = ledger.get("repositories", [])
    if len(repositories) != 34:
        fail(f"expected 34 direct publications, found {len(repositories)}")
    if ledger.get("publisher_id") != PUBLISHER_ID:
        fail("publication ledger publisher ID mismatch")

    repos = [entry.get("repo") for entry in repositories]
    domains = [entry.get("domain") for entry in repositories]
    if len(repos) != len(set(repos)) or len(domains) != len(set(domains)):
        fail("publication ledger contains duplicate repositories or domains")

    titles: Counter[str] = Counter()
    descriptions: Counter[str] = Counter()
    article_hashes: dict[str, tuple[str, str]] = {}
    article_word_total = 0
    sitemap_url_total = 0

    for entry in repositories:
        repo = entry["repo"]
        domain = entry["domain"]
        repo_root = WORKSPACE_ROOT / repo
        publication_root = repo_root / entry["publication_root"]
        guide_route = entry["guide_path"]
        article_routes = {
            "guide": guide_route,
            "architecture": entry["architecture_path"],
            "verification": entry["verification_path"],
            "publisher": entry["publisher_path"],
        }
        for page_name, route in article_routes.items():
            words, _total_words = validate_article(
                repo=repo,
                page_name=page_name,
                file=publication_root / route.lstrip("/"),
                canonical=f"https://{domain}{route}",
                advertising=page_name != "publisher",
                titles=titles,
                descriptions=descriptions,
                article_hashes=article_hashes,
            )
            article_word_total += words

        entry_file = repo_root / entry["entry_file"]
        if not entry_file.is_file():
            fail(f"{repo} is missing its entry file")
        entry_source = entry_file.read_text()
        entry_evidence = parse_html(entry_source)
        if ADSENSE_LOADER in entry_source:
            fail(f"{repo} entry page must remain advertising-free")
        if (
            entry_source.count(NAVIGATION_START) != 1
            or entry_source.count(NAVIGATION_END) != 1
        ):
            fail(f"{repo} entry page must contain one publication navigation block")
        if entry_evidence.canonicals != [f"https://{domain}/"]:
            fail(f"{repo} entry page canonical URL mismatch")
        if entry_evidence.adsense_accounts != [PUBLISHER_ID]:
            fail(f"{repo} entry page AdSense ownership declaration mismatch")
        for route in article_routes.values():
            if route not in entry_evidence.links:
                fail(f"{repo} entry page does not link to {route}")
        if entry.get("entry_ad_policy") != "editorial-pages-only":
            fail(f"{repo} entry advertising policy must be editorial-pages-only")

        privacy_file = repo_root / entry["privacy_file"]
        terms_file = repo_root / entry["terms_file"]
        privacy_route = validate_policy(
            repo,
            privacy_file,
            "advertising-and-cookies",
            "Google AdSense",
            domain,
        )
        terms_route = validate_policy(
            repo,
            terms_file,
            "advertising-boundary",
            "Advertising may be served only on substantial public editorial pages",
            domain,
        )

        required_routes = {
            "/",
            *article_routes.values(),
            privacy_route,
            terms_route,
        }
        sitemap_url_total += validate_sitemap(
            repo,
            publication_root / "sitemap.xml",
            domain,
            required_routes,
        )

        headers_file = publication_root / "_headers"
        if headers_file.is_file():
            headers = headers_file.read_text()
            if re.search(
                r"^\s*Content-Security-Policy:",
                headers,
                flags=re.IGNORECASE | re.MULTILINE,
            ):
                if (
                    headers.count(HEADERS_START) != 1
                    or headers.count(HEADERS_END) != 1
                ):
                    fail(f"{repo} must contain one managed CSP exception block")
                for route in article_routes.values():
                    if route == entry["publisher_path"]:
                        continue
                    pattern = (
                        rf"(?m)^{re.escape(route)}\s*$"
                        rf"[\s\S]*?^\s+!\s+Content-Security-Policy\s*$"
                    )
                    if not re.search(pattern, headers):
                        fail(
                            f"{repo} must detach CSP for advertising route {route}"
                        )

    duplicate_titles = [title for title, count in titles.items() if count > 1]
    duplicate_descriptions = [
        description for description, count in descriptions.items() if count > 1
    ]
    if duplicate_titles:
        fail(f"duplicate page titles found: {duplicate_titles[:3]}")
    if duplicate_descriptions:
        fail(
            "duplicate meta descriptions found: "
            f"{duplicate_descriptions[:3]}"
        )

    print(
        "AdSense publication validation ok: "
        f"repositories={len(repositories)} "
        f"articles={len(article_hashes)} "
        f"article_words={article_word_total} "
        f"sitemap_urls={sitemap_url_total}"
    )


if __name__ == "__main__":
    main()
