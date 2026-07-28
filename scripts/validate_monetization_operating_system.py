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
EXPECTED_ADSENSE_SUBMITTED_SITES = 34


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
        expected_deployment_repository = (
            "doeon-kim-portfolio"
            if entry["repo"] == "KIM3310"
            else entry["repo"]
        )
        if entry.get("deployment_repository") != expected_deployment_repository:
            fail(f"unexpected deployment repository for {entry['repo']}")
        if not re.fullmatch(r"[0-9a-f]{40}", entry.get("deployment_sha", "")):
            fail(f"invalid deployment SHA for {entry['repo']}")
        if entry.get("production_url") != f"https://{entry.get('ad_domain')}/":
            fail(f"production URL must match the ad domain for {entry['repo']}")
        expected_statuses = {
            "cloudflare_status": "deployed-and-http-verified",
            "adsense_status": "site-review-pending",
            "ownership_status": "verified",
            "ads_txt_status": "approved",
        }
        for field, expected in expected_statuses.items():
            if entry.get(field) != expected:
                fail(f"{entry['repo']} {field} must be {expected}")

    ad_eligible = {
        entry["repo"] for entry in repositories if entry.get("ad_eligible") is True
    }
    if ad_eligible != catalog_names:
        fail("every active repository must have an approved public ad surface")
    if set(catalog["advertising"]["eligible_repositories"]) != ad_eligible:
        fail("advertising eligibility must match repository entries")

    direct_entries = [entry for entry in repositories if entry["repo"] != "KIM3310"]
    if len(direct_entries) != EXPECTED_ADSENSE_SUBMITTED_SITES:
        fail("exactly 34 repositories must have direct AdSense domains")
    direct_domains = {entry.get("ad_domain") for entry in direct_entries}
    if len(direct_domains) != EXPECTED_ADSENSE_SUBMITTED_SITES:
        fail("direct AdSense domains must be unique")
    if any(not domain or not domain.endswith(".pages.dev") for domain in direct_domains):
        fail("every direct AdSense domain must use a Cloudflare Pages origin")
    central_entry = next(entry for entry in repositories if entry["repo"] == "KIM3310")
    if central_entry.get("ad_surface") != "central-resource-page":
        fail("KIM3310 advertising must remain on its central resource page")
    if central_entry.get("ad_domain") != "kim3310-doeon-kim-portfolio.pages.dev":
        fail("KIM3310 must use the central portfolio AdSense domain")

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
    if len(submitted_sites) != EXPECTED_ADSENSE_SUBMITTED_SITES:
        fail("AdSense submitted-site ledger must contain 34 verified domains")
    submitted_by_repo = {
        site.get("repository"): site
        for site in submitted_sites
    }
    expected_direct_repositories = {entry["repo"] for entry in direct_entries}
    if set(submitted_by_repo) != expected_direct_repositories:
        fail("submitted-site repositories must match direct AdSense repositories")
    if {
        site.get("domain") for site in submitted_sites
    } != direct_domains:
        fail("submitted-site domains must match repository ad domains")
    for entry in direct_entries:
        if submitted_by_repo[entry["repo"]].get("domain") != entry["ad_domain"]:
            fail(f"submitted domain mismatch for {entry['repo']}")
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
    if advertising.get("direct_submitted_site_count") != (
        EXPECTED_ADSENSE_SUBMITTED_SITES
    ):
        fail("direct submitted-site count must be 34")
    if advertising.get("direct_submitted_site_status") != "site-review-pending":
        fail("direct submitted sites must remain review-pending until approved")
    if advertising.get("deployment_verification_status") != (
        "34/34-public-origins-verified"
    ):
        fail("all 34 public origins must remain deployment-verified")
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
        "34 domains are connected to AdSense",
        "34/34 public origins",
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
        "repositories=35 lanes=7 ad_eligible=35 "
        "central_resources=35 submitted_sites=34"
    )


if __name__ == "__main__":
    main()
