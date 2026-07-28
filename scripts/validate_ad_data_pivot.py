#!/usr/bin/env python3
"""Validate the central ad and anonymous aggregate-data pivot manifest."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, NoReturn, cast

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "docs" / "ad-data-pivot-manifest.json"
DOC = ROOT / "docs" / "ad-data-pivot-architecture.md"
CATALOG = ROOT / "docs" / "monetization-operating-system-2026-07-26.json"
GENERATOR = ROOT / "scripts" / "generate_ad_data_pivot.mjs"
README = ROOT / "README.md"

EXPECTED_COUNT = 35
EXCLUDED_REPO = "jalhae"
REQUIRED_ENTRY_FIELDS = {
    "repo",
    "positioning",
    "audience",
    "ad_placement_boundary",
    "allowed_aggregate_event_set",
    "data_asset",
    "prohibited_fields",
    "sensitivity_class",
    "live_demo_url",
    "central_resource_url",
    "public_surface_path",
}
MAX_EVENTS = {
    "resource_view",
    "resource_cta_click",
    "architecture_doc_open",
    "privacy_support_open",
}
REQUIRED_PROHIBITED = {
    "raw_input",
    "url",
    "referrer",
    "title",
    "user_id",
    "session_id",
    "ip_address",
    "payment_detail",
}


def fail(message: str) -> NoReturn:
    raise SystemExit(f"ad data pivot validation failed: {message}")


def load_json(path: Path) -> dict[str, Any]:
    if not path.is_file():
        fail(f"missing {path.relative_to(ROOT)}")
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        fail(f"{path.relative_to(ROOT)} must contain a JSON object")
    return cast(dict[str, Any], data)


def require_text(value: Any, label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        fail(f"{label} must be a non-empty string")
    return value


def require_string_list(value: Any, label: str, minimum: int = 1) -> list[str]:
    if (
        not isinstance(value, list)
        or len(value) < minimum
        or not all(isinstance(item, str) and item.strip() for item in value)
    ):
        fail(f"{label} must be a non-empty string list")
    return cast(list[str], value)


def main() -> None:
    manifest = load_json(MANIFEST)
    catalog = load_json(CATALOG)
    entries = manifest.get("repositories")
    if not isinstance(entries, list):
        fail("repositories must be a list")
    if manifest.get("repository_count") != EXPECTED_COUNT or len(entries) != EXPECTED_COUNT:
        fail("manifest must cover exactly 35 active repositories")

    excluded = manifest.get("excluded_repositories")
    if not isinstance(excluded, list) or EXCLUDED_REPO not in {item.get("repo") for item in excluded if isinstance(item, dict)}:
        fail("jalhae must be explicitly excluded")

    names = [entry.get("repo") for entry in entries if isinstance(entry, dict)]
    if len(set(names)) != len(names):
        fail("repository entries must be unique")
    if EXCLUDED_REPO in names:
        fail("jalhae must not appear in repositories")

    catalog_names = {entry["repo"] for entry in catalog.get("repositories", [])}
    if set(names) != catalog_names:
        fail(f"manifest repositories must match monetization catalog exactly; missing={sorted(catalog_names - set(names))}, extra={sorted(set(names) - catalog_names)}")

    policy = manifest.get("global_policy")
    if not isinstance(policy, dict):
        fail("global_policy must be an object")
    if policy.get("all_repositories_participate_in_ad_supported_revenue") is not True:
        fail("all repositories must participate in ad-supported revenue")
    policy_text = json.dumps(policy, sort_keys=True).lower()
    for token in (
        "policy-eligible public resource",
        "ad-free",
        "google-certified consent",
        "fail-closed",
        "consented anonymous aggregate",
        "forbid sale",
    ):
        if token not in policy_text:
            fail(f"global policy missing {token!r}")
    if policy.get("consent_default") != "off":
        fail("global policy consent_default must be off")
    if set(policy.get("max_allowlisted_events", [])) != MAX_EVENTS:
        fail("global max allowlisted events must match the approved set")

    firebase = manifest.get("firebase")
    if not isinstance(firebase, dict):
        fail("firebase must be an object")
    if firebase.get("project_id") != "kim3310-free-tools":
        fail("firebase project must be kim3310-free-tools")
    if "all client writes denied" not in str(firebase.get("client_access", "")).lower():
        fail("firebase client access must deny all writes")

    resource_urls = set()
    positionings = set()
    for entry in entries:
        if not isinstance(entry, dict):
            fail("each repository entry must be an object")
        missing = REQUIRED_ENTRY_FIELDS - set(entry)
        if missing:
            fail(f"{entry.get('repo', '<unknown>')} missing fields: {', '.join(sorted(missing))}")
        repo = require_text(entry["repo"], "repo")
        positioning = require_text(entry["positioning"], f"{repo} positioning")
        if positioning in positionings:
            fail(f"{repo} positioning must be unique")
        positionings.add(positioning)
        require_text(entry["audience"], f"{repo} audience")
        boundary = require_text(entry["ad_placement_boundary"], f"{repo} ad placement boundary").lower()
        if "public" not in boundary or "ad-free" not in boundary:
            fail(f"{repo} ad placement boundary must name public ad surface and ad-free sensitive surfaces")
        events = set(require_string_list(entry["allowed_aggregate_event_set"], f"{repo} allowed events"))
        if not events or not events.issubset(MAX_EVENTS):
            fail(f"{repo} allowed events must be a non-empty subset of the global allowlist")
        require_text(entry["data_asset"], f"{repo} data asset")
        prohibited = set(require_string_list(entry["prohibited_fields"], f"{repo} prohibited fields", minimum=8))
        if not REQUIRED_PROHIBITED.issubset(prohibited):
            fail(f"{repo} prohibited fields must include {sorted(REQUIRED_PROHIBITED)}")
        require_text(entry["sensitivity_class"], f"{repo} sensitivity class")
        live_demo_url = require_text(entry["live_demo_url"], f"{repo} live demo URL")
        central_resource_url = require_text(entry["central_resource_url"], f"{repo} central resource URL")
        if not live_demo_url.startswith("https://"):
            fail(f"{repo} live demo URL must be HTTPS")
        expected_resource = f"{manifest['central_resource_base_url']}/{repo}/"
        if central_resource_url != expected_resource:
            fail(f"{repo} central resource URL must be {expected_resource}")
        if central_resource_url in resource_urls:
            fail(f"{repo} central resource URL must be unique")
        resource_urls.add(central_resource_url)
        require_text(entry["public_surface_path"], f"{repo} public surface path")

    for path in (DOC, README, GENERATOR):
        if not path.is_file():
            fail(f"missing {path.relative_to(ROOT)}")

    doc_text = DOC.read_text(encoding="utf-8")
    for token in (
        "consent is off",
        "Global Privacy Control",
        "POST",
        "/api/events",
        "without executing the generator",
    ):
        if token not in doc_text:
            fail(f"architecture doc missing {token!r}")

    readme = README.read_text(encoding="utf-8")
    for rel in (
        "docs/ad-data-pivot-manifest.json",
        "docs/ad-data-pivot-architecture.md",
    ):
        if rel not in readme:
            fail(f"README must link {rel}")

    generator = GENERATOR.read_text(encoding="utf-8")
    for token in (
        "checkMode",
        "--write",
        "navigator.globalPrivacyControl",
        "navigator.doNotTrack",
        "window.Kim3310AdDataRuntime",
        "function setConsent(value)",
        "fetch(config.endpoint",
        "consentVersion: config.consentVersion",
        "pagead2.googlesyndication.com",
        "data-readiness-check",
        "data-benchmark",
    ):
        if token not in generator:
            fail(f"generator missing runtime/check token {token!r}")
    for forbidden in ("document.referrer", "location.href", "document.title", "sessionStorage"):
        if forbidden in generator:
            fail(f"generator must not emit or read {forbidden}")

    print("ad data pivot validation ok: repositories=35 excluded=jalhae events=4")


if __name__ == "__main__":
    main()
