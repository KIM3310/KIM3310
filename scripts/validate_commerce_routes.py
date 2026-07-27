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


def main() -> None:
    lane_by_id = {lane["id"]: lane for lane in CATALOG["lanes"]}
    validated_copies = 0

    for repository in CATALOG["repositories"]:
        repo = repository["repo"]
        repo_root = WORKSPACE_ROOT / repo
        source = repo_root / "docs/service-offer.json"
        if not source.exists():
            fail(f"{repo} is missing docs/service-offer.json")

        expected_gateway = expected_url(repo)
        source_manifest = json.loads(source.read_text())
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
        if checkout.get("fallback_url") != expected_gateway:
            fail(f"{repo} checkout fallback must use the central gateway")

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
            if copy_manifest.get("commerce") != commerce:
                fail(f"{repo}/{relative} commerce metadata is out of sync")
            validated_copies += 1

        readme = repo_root / "README.md"
        if readme.exists() and "- Lead capture:" in readme.read_text():
            if f"- Commercial route: {expected_gateway}" not in readme.read_text():
                fail(f"{repo} README is missing its commercial route")

        search_doc = repo_root / "docs/search-growth-implementation.md"
        if search_doc.exists():
            expected_row = f"| Commercial route | {expected_gateway} |"
            if expected_row not in search_doc.read_text():
                fail(f"{repo} search-growth document is missing its commercial route")

        for relative in [
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
                expected_line = f"Commercial route: {expected_gateway}"
                if expected_line not in llms_text:
                    fail(f"{repo}/{relative} is missing its commercial route")

        for relative in [
            "site/index.html",
            "docs/index.html",
            "frontend/index.html",
            "public/index.html",
        ]:
            html_file = repo_root / relative
            if not html_file.exists():
                continue
            html_text = html_file.read_text()
            match = re.search(
                r"<!-- search-growth-offer:start -->([\s\S]*?)"
                r"<!-- search-growth-offer:end -->",
                html_text,
            )
            if match and expected_gateway not in match.group(1):
                fail(f"{repo}/{relative} offer block is missing its commercial route")

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

    print(
        "commerce route validation ok: "
        f"repositories={len(CATALOG['repositories'])} "
        f"published_manifest_copies={validated_copies}"
    )


if __name__ == "__main__":
    main()
