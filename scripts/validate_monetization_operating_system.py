#!/usr/bin/env python3
"""Validate the centralized monetization catalog and risk boundaries."""

from __future__ import annotations

import json
from pathlib import Path
from typing import NoReturn

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "docs/monetization-operating-system-2026-07-26.json"
DOC = ROOT / "docs/monetization-operating-system-2026-07-26.md"
TRIAGE = ROOT / "docs/revenue-triage-2026-06-25.json"
README = ROOT / "README.md"

EXPECTED_ACTIVE_REPOSITORIES = 35
EXPECTED_PUBLIC_REPOSITORIES = 29
EXPECTED_PRIVATE_REPOSITORIES = 6
EXPECTED_LANES = 9
ADSENSE_REPOSITORY = "dream-interpretation-pages"


def fail(message: str) -> NoReturn:
    raise SystemExit(f"monetization operating system validation failed: {message}")


def main() -> None:
    catalog = json.loads(CATALOG.read_text())
    triage = json.loads(TRIAGE.read_text())["repositories"]
    active = [entry for entry in triage if entry["status"] == "active"]
    repositories = catalog.get("repositories", [])
    lanes = catalog.get("lanes", [])

    if catalog.get("repository_count") != EXPECTED_ACTIVE_REPOSITORIES:
        fail("repository_count must be 35")
    if len(repositories) != EXPECTED_ACTIVE_REPOSITORIES:
        fail(f"expected 35 repository entries, found {len(repositories)}")
    if len(lanes) != EXPECTED_LANES:
        fail(f"expected 9 lanes, found {len(lanes)}")

    active_names = {entry["repo"] for entry in active}
    catalog_names = {entry["repo"] for entry in repositories}
    if catalog_names != active_names:
        missing = sorted(active_names - catalog_names)
        extra = sorted(catalog_names - active_names)
        fail(f"active repository mismatch; missing={missing}, extra={extra}")

    if len(catalog_names) != len(repositories):
        fail("repository entries must be unique")

    public_count = sum(entry["visibility"] == "public" for entry in repositories)
    private_count = sum(entry["visibility"] == "private" for entry in repositories)
    if public_count != EXPECTED_PUBLIC_REPOSITORIES:
        fail(f"expected 29 public repositories, found {public_count}")
    if private_count != EXPECTED_PRIVATE_REPOSITORIES:
        fail(f"expected 6 private repositories, found {private_count}")

    lane_ids = {lane["id"] for lane in lanes}
    assigned: list[str] = []
    for lane in lanes:
        if not lane.get("billing_mode") or not lane.get("fulfillment_kind"):
            fail(f"lane {lane['id']} is missing billing or fulfillment")
        assigned.extend(lane["repositories"])

    if len(assigned) != len(set(assigned)):
        fail("each repository must belong to exactly one lane")
    if set(assigned) != catalog_names:
        fail("lane membership must cover every active repository")

    for entry in repositories:
        if entry["lane"] not in lane_ids:
            fail(f"unknown lane {entry['lane']} for {entry['repo']}")
        if entry["repo"] not in next(
            lane["repositories"] for lane in lanes if lane["id"] == entry["lane"]
        ):
            fail(f"repository {entry['repo']} does not match its lane membership")

    ad_eligible = {
        entry["repo"] for entry in repositories if entry.get("ad_eligible") is True
    }
    if ad_eligible != {ADSENSE_REPOSITORY}:
        fail(f"only {ADSENSE_REPOSITORY} may be ad eligible")
    if set(catalog["advertising"]["eligible_repositories"]) != ad_eligible:
        fail("advertising eligibility must match repository entries")

    gateway = catalog.get("gateway", {})
    if gateway.get("checkout_provider") != "lemon-squeezy":
        fail("Lemon Squeezy must be the default hosted checkout rail")
    if gateway.get("open_source_support") != "github-sponsors":
        fail("GitHub Sponsors must be the open-source support rail")
    if gateway.get("advertising_provider") != "google-adsense":
        fail("Google AdSense must be the advertising rail")
    if gateway.get("adsense_publisher_id") != "pub-4973160293737562":
        fail("unexpected AdSense publisher identifier")
    if "{repo}" not in gateway.get("offer_url_template", ""):
        fail("offer URL template must preserve the repository slug")

    doc = DOC.read_text()
    for token in [
        "One Commerce Plane",
        "Nine Commercial Lanes",
        "Google AdSense",
        "GitHub Sponsors",
        "Lemon Squeezy",
        "Never store it",
    ]:
        if token not in doc:
            fail(f"missing documentation token: {token}")

    readme = README.read_text()
    for path in [
        "docs/monetization-operating-system-2026-07-26.md",
        "docs/monetization-operating-system-2026-07-26.json",
    ]:
        if path not in readme:
            fail(f"README must link {path}")

    print(
        "monetization operating system validation ok: "
        "repositories=35 lanes=9 ad_eligible=1"
    )


if __name__ == "__main__":
    main()
