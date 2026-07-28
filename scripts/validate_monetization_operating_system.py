#!/usr/bin/env python3
"""Validate the centralized monetization catalog and risk boundaries."""

from __future__ import annotations

import json
import re
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
EXPECTED_LANES = 7
ADSENSE_REPOSITORY = "dream-interpretation-pages"
ADSENSE_SUBMITTED_SITES = {
    "dream-interpretation-pages.pages.dev",
    "kim3310-doeon-kim-portfolio.pages.dev",
}


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
        fail(f"expected 7 lanes, found {len(lanes)}")

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
    if gateway.get("checkout_provider") is not None:
        fail("checkout provider must remain unset until provider onboarding is complete")
    if gateway.get("checkout_status") != "not-configured":
        fail("checkout status must remain honest while no hosted checkout is active")
    if gateway.get("checkout_fallback") != "cloudflare-d1-private-inquiry":
        fail("checkout fallback must use the private D1 inquiry")
    if gateway.get("open_source_support") != "github-sponsors":
        fail("GitHub Sponsors must be the open-source support rail")
    if gateway.get("advertising_provider") != "google-adsense":
        fail("Google AdSense must be the advertising rail")
    if gateway.get("adsense_publisher_id") != "pub-4973160293737562":
        fail("unexpected AdSense publisher identifier")
    submitted_sites = gateway.get("adsense_submitted_sites", [])
    submitted_domains = {site.get("domain") for site in submitted_sites}
    if submitted_domains != ADSENSE_SUBMITTED_SITES:
        fail("AdSense submitted-site ledger must contain the two verified domains")
    if any(site.get("ownership_status") != "verified" for site in submitted_sites):
        fail("every submitted AdSense site must have verified ownership")
    if any(site.get("ads_txt_status") != "approved" for site in submitted_sites):
        fail("every submitted AdSense site must have approved ads.txt")
    if any(site.get("status") != "site-review-pending" for site in submitted_sites):
        fail("every submitted AdSense site must remain review-pending until approved")
    expected_gateway_statuses = {
        "open_source_support_status": "sponsors-listing-not-configured",
        "adsense_status": "site-review-pending",
        "adsense_ads_txt_status": "approved",
        "adsense_europe_message_status": "published",
        "adsense_us_states_message_status": "published",
        "adsense_payment_method_status": "not-yet-available",
        "adsense_identity_verification_status": "not-yet-required",
    }
    for field, expected in expected_gateway_statuses.items():
        if gateway.get(field) != expected:
            fail(f"gateway status {field} must be {expected}")
    advertising = catalog.get("advertising", {})
    if advertising.get("central_resource_repository_count") != EXPECTED_ACTIVE_REPOSITORIES:
        fail("central AdSense resource coverage must include all 35 repositories")
    if advertising.get("central_resource_status") != "site-review-pending":
        fail("central AdSense resource site status must remain review-pending")
    if advertising.get("central_resource_sitemap") != (
        "https://kim3310-doeon-kim-portfolio.pages.dev/"
        "resources/ad-data-sitemap.xml"
    ):
        fail("unexpected central AdSense resource sitemap")
    if "{repo}" not in gateway.get("offer_url_template", ""):
        fail("offer URL template must preserve the repository slug")
    inquiry_template = gateway.get("inquiry_url_template", "")
    if "{repo}" not in inquiry_template or "{lane}" not in inquiry_template:
        fail("inquiry URL template must preserve repository and lane routing")

    doc = DOC.read_text()
    for token in [
        "One Commerce Plane",
        "Seven Commercial Offers",
        "Cloudflare D1",
        "Google AdSense",
        "GitHub Sponsors",
        "Two domains are connected to AdSense",
        "35 unique, crawlable repository resource pages",
        "US state opt-out message are both published",
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
    if "nine commercial lanes" in readme.lower():
        fail("README must describe the current seven-offer catalog")
    if re.search(
        r"\[(?:private|commercial)[^\]]*\]"
        r"\(https://github\.com/[^)]+/issues/new",
        readme,
        re.IGNORECASE,
    ):
        fail("README must not label a public GitHub issue as private intake")
    if "cloudflare-d1-private-inquiry" not in json.dumps(gateway):
        fail("catalog must preserve the private D1 inquiry fallback")

    print(
        "monetization operating system validation ok: "
        "repositories=35 lanes=7 direct_ad_eligible=1 "
        "central_resources=35 submitted_sites=2"
    )


if __name__ == "__main__":
    main()
