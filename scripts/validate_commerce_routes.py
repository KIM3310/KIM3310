#!/usr/bin/env python3
"""Validate repository-local commerce routes against the central catalog."""

from __future__ import annotations

import json
from pathlib import Path
import re
import subprocess
from typing import NoReturn
from urllib.parse import quote

PROFILE_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = PROFILE_ROOT.parent
CATALOG = json.loads(
    (
        PROFILE_ROOT
        / "docs/monetization-operating-system-2026-07-26.json"
    ).read_text()
)


def fail(message: str) -> NoReturn:
    raise SystemExit(f"commerce route validation failed: {message}")


def expected_url(repo: str) -> str:
    return CATALOG["gateway"]["offer_url_template"].replace(
        "{repo}", quote(repo, safe="")
    )

def expected_inquiry_url(repo: str, lane: str) -> str:
    return (
        CATALOG["gateway"]["inquiry_url_template"]
        .replace("{repo}", quote(repo, safe=""))
        .replace("{lane}", quote(lane, safe=""))
    )


def is_free_structured_offer(offer: dict) -> bool:
    price = offer.get("price")
    if price is None or price == "":
        return False
    try:
        return float(price) == 0
    except (TypeError, ValueError):
        return False


def validate_structured_offers(
    manifest: dict, repo: str, expected_inquiry: str
) -> None:
    offers = manifest.get("structured_data", {}).get("offers", [])
    if not isinstance(offers, list):
        fail(f"{repo} structured offers must be a list")
    for offer in offers:
        if not isinstance(offer, dict) or is_free_structured_offer(offer):
            continue
        if offer.get("url") != expected_inquiry:
            fail(f"{repo} paid structured offer must use the private inquiry route")


def walk_json(value: object) -> list[dict]:
    objects: list[dict] = []
    if isinstance(value, dict):
        objects.append(value)
        for nested in value.values():
            objects.extend(walk_json(nested))
    elif isinstance(value, list):
        for nested in value:
            objects.extend(walk_json(nested))
    return objects


def main() -> None:
    lane_by_id = {lane["id"]: lane for lane in CATALOG["lanes"]}
    lane_by_name = {lane["name"]: lane for lane in CATALOG["lanes"]}
    validated_copies = 0

    for repository in CATALOG["repositories"]:
        repo = repository["repo"]
        repo_root = WORKSPACE_ROOT / repo
        source = repo_root / "docs/service-offer.json"
        if not source.exists():
            fail(f"{repo} is missing docs/service-offer.json")

        expected_gateway = expected_url(repo)
        expected_inquiry = expected_inquiry_url(repo, repository["lane"])
        source_manifest = json.loads(source.read_text())
        if source_manifest.get("lead_capture_url") != expected_inquiry:
            fail(f"{repo} lead capture must use the private inquiry route")
        validate_structured_offers(source_manifest, repo, expected_inquiry)
        commerce = source_manifest.get("commerce")
        if not commerce:
            fail(f"{repo} is missing commerce metadata")
        if commerce.get("gateway_url") != expected_gateway:
            fail(f"{repo} has an unexpected gateway URL")
        if commerce.get("lane_id") != repository["lane"]:
            fail(f"{repo} has an unexpected lane")

        lane = lane_by_id[repository["lane"]]
        for field in [
            "billing_mode",
            "price_unit",
            "fulfillment_kind",
            "risk_bucket",
        ]:
            if commerce.get(field) != lane[field]:
                fail(f"{repo} commerce field {field} does not match its lane")

        checkout = commerce.get("checkout", {})
        if checkout.get("provider") != CATALOG["gateway"]["checkout_provider"]:
            fail(f"{repo} has an unexpected checkout provider")
        if checkout.get("fallback_url") != expected_inquiry:
            fail(f"{repo} checkout fallback must use the private inquiry route")

        advertising = commerce.get("advertising", {})
        if advertising.get("eligible") is not repository["ad_eligible"]:
            fail(f"{repo} advertising eligibility mismatch")

        for relative in [
            "public/service-offer.json",
            "site/service-offer.json",
            "frontend/service-offer.json",
            "pages-proxy/service-offer.json",
            "pages-redirect/service-offer.json",
        ]:
            copy = repo_root / relative
            if not copy.exists():
                continue
            copy_manifest = json.loads(copy.read_text())
            if copy_manifest.get("lead_capture_url") != expected_inquiry:
                fail(f"{repo}/{relative} lead capture is out of sync")
            validate_structured_offers(
                copy_manifest, f"{repo}/{relative}", expected_inquiry
            )
            if copy_manifest.get("commerce") != commerce:
                fail(f"{repo}/{relative} commerce metadata is out of sync")
            validated_copies += 1

        readme = repo_root / "README.md"
        if readme.exists() and "- Lead capture:" in readme.read_text():
            if f"- Lead capture: {expected_inquiry}" not in readme.read_text():
                fail(f"{repo} README is missing its private inquiry route")
            if f"- Commercial route: {expected_gateway}" not in readme.read_text():
                fail(f"{repo} README is missing its commercial route")

        search_doc = repo_root / "docs/search-growth-implementation.md"
        if search_doc.exists():
            search_text = search_doc.read_text()
            expected_lead_row = f"| Lead capture URL | {expected_inquiry} |"
            if expected_lead_row not in search_text:
                fail(f"{repo} search-growth document is missing its private inquiry route")
            expected_row = f"| Commercial route | {expected_gateway} |"
            if expected_row not in search_text:
                fail(f"{repo} search-growth document is missing its commercial route")
            if re.search(r"github issue form", search_text, re.IGNORECASE):
                fail(f"{repo} search-growth document still treats GitHub issues as intake")

        revenue_doc = repo_root / "docs/revenue-architecture.md"
        if revenue_doc.exists():
            revenue_text = revenue_doc.read_text()
            if re.search(r"github issue form", revenue_text, re.IGNORECASE):
                fail(f"{repo} revenue document still treats GitHub issues as intake")
            if expected_inquiry not in revenue_text:
                fail(f"{repo} revenue document is missing its private inquiry route")

        support_doc = repo_root / "SUPPORT.md"
        if support_doc.exists():
            support_text = support_doc.read_text()
            if re.search(
                r"paid-pilot intake issue template",
                support_text,
                re.IGNORECASE,
            ):
                fail(f"{repo} SUPPORT.md still points to the removed issue intake")
            if expected_inquiry not in support_text:
                fail(f"{repo} SUPPORT.md is missing its private inquiry route")

        for relative in [
            "docs/llms.txt",
            "public/llms.txt",
            "site/llms.txt",
            "frontend/llms.txt",
            "pages-proxy/llms.txt",
            "pages-redirect/llms.txt",
        ]:
            llms_file = repo_root / relative
            if not llms_file.exists():
                continue
            llms_text = llms_file.read_text()
            if "Lead capture:" in llms_text:
                expected_lead_line = f"Lead capture: {expected_inquiry}"
                if expected_lead_line not in llms_text:
                    fail(f"{repo}/{relative} is missing its private inquiry route")
                expected_line = f"Commercial route: {expected_gateway}"
                if expected_line not in llms_text:
                    fail(f"{repo}/{relative} is missing its commercial route")

        legacy_issue_form = (
            repo_root / ".github/ISSUE_TEMPLATE/service-inquiry.yml"
        )
        if legacy_issue_form.exists():
            fail(f"{repo} still exposes commercial intake as a public issue form")

        for relative in [
            "README.md",
            "SUPPORT.md",
            "constants.ts",
            "docs/revenue-architecture.md",
            "index.html",
            "site/index.html",
            "docs/index.html",
            "frontend/index.html",
            "public/index.html",
        ]:
            html_file = repo_root / relative
            if not html_file.exists():
                continue
            html_text = html_file.read_text()
            if re.search(
                r"https://kim3310-doeon-kim-portfolio\.pages\.dev/"
                r"\?inquiry=[A-Za-z0-9._%+-]+#private-inquiry",
                html_text,
            ):
                fail(f"{repo}/{relative} contains a legacy private inquiry route")
            match = re.search(
                r"<!-- search-growth-offer:start -->([\s\S]*?)"
                r"<!-- search-growth-offer:end -->",
                html_text,
            )
            if match and expected_inquiry not in match.group(1):
                fail(f"{repo}/{relative} offer block is missing its private inquiry route")

            json_ld = re.search(
                r"<!-- search-growth-jsonld:start -->\s*"
                r"<script\b[^>]*>([\s\S]*?)</script>\s*"
                r"<!-- search-growth-jsonld:end -->",
                html_text,
            )
            if json_ld:
                try:
                    structured_data = json.loads(json_ld.group(1))
                except json.JSONDecodeError as error:
                    fail(f"{repo}/{relative} has invalid search-growth JSON-LD: {error}")
                for item in walk_json(structured_data):
                    if item.get("@type") != "Offer" or is_free_structured_offer(item):
                        continue
                    lane = lane_by_name.get(item.get("name"), lane_by_id[repository["lane"]])
                    expected_offer_url = expected_inquiry_url(repo, lane["id"])
                    if item.get("url") != expected_offer_url:
                        fail(
                            f"{repo}/{relative} paid JSON-LD offer "
                            f"{item.get('name', '<unnamed>')} has the wrong inquiry route"
                        )

        tracked_ads = subprocess.run(
            ["git", "-C", str(repo_root), "ls-files", "*ads.txt"],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.splitlines()
        if repository["ad_eligible"]:
            required_ads = {"public/ads.txt", "site/ads.txt"}
            if not required_ads.issubset(set(tracked_ads)):
                fail(f"{repo} is missing an approved tracked ads.txt surface")
        elif tracked_ads:
            fail(f"{repo} must not track advertising inventory: {tracked_ads}")

        if not repository["ad_eligible"]:
            adsense_loader = subprocess.run(
                [
                    "git",
                    "-C",
                    str(repo_root),
                    "grep",
                    "-l",
                    "pagead2.googlesyndication.com",
                    "--",
                    "*.html",
                    "*.js",
                    "*.jsx",
                    "*.ts",
                    "*.tsx",
                ],
                capture_output=True,
                text=True,
            )
            if adsense_loader.returncode not in {0, 1}:
                fail(f"{repo} AdSense source scan failed")
            if adsense_loader.stdout.strip():
                fail(f"{repo} must not load AdSense outside the approved content site")

        tracked_paths = subprocess.run(
            [
                "git",
                "-C",
                str(repo_root),
                "ls-files",
                "--cached",
                "--others",
                "--exclude-standard",
                "-z",
            ],
            check=True,
            capture_output=True,
        ).stdout.split(b"\0")
        legacy_issue_url = b"issues/new?" + b"template=service-inquiry.yml"
        for encoded_path in tracked_paths:
            if not encoded_path:
                continue
            candidate = repo_root / encoded_path.decode()
            if candidate.is_file() and legacy_issue_url in candidate.read_bytes():
                fail(f"{repo}/{candidate.relative_to(repo_root)} has a public commercial inquiry URL")

    service_offers_file = WORKSPACE_ROOT / "doeon-kim-portfolio/serviceOffers.ts"
    service_offers_text = service_offers_file.read_text()
    prefix = "export const SERVICE_OFFERS = "
    suffix = " as const;"
    start = service_offers_text.find(prefix)
    end = service_offers_text.find(suffix, start + len(prefix))
    if start < 0 or end < 0:
        fail("portfolio serviceOffers.ts has an unexpected format")
    service_offers = json.loads(
        service_offers_text[start + len(prefix) : end]
    )
    if len(service_offers) != len(CATALOG["repositories"]):
        fail("portfolio serviceOffers.ts does not cover every active repository")
    for offer in service_offers:
        repository = next(
            (
                item
                for item in CATALOG["repositories"]
                if item["repo"] == offer.get("repo")
            ),
            None,
        )
        if repository is None:
            fail(f"portfolio contains an unknown offer: {offer.get('repo')}")
        expected_inquiry = expected_inquiry_url(
            repository["repo"], repository["lane"]
        )
        if offer.get("leadCaptureUrl") != expected_inquiry:
            fail(
                f"portfolio offer {repository['repo']} has the wrong private inquiry route"
            )
        if offer.get("laneId") != repository["lane"]:
            fail(f"portfolio offer {repository['repo']} has the wrong lane")

    print(
        "commerce route validation ok: "
        f"repositories={len(CATALOG['repositories'])} "
        f"published_manifest_copies={validated_copies}"
    )


if __name__ == "__main__":
    main()
