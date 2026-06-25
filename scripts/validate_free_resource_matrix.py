#!/usr/bin/env python3
"""Validate the free API/resource and monetization matrix.

The check is intentionally dependency-free. It proves the portfolio-wide matrix
covers every triaged repository, keeps payment wiring as secret-name placeholders,
and preserves payout/account-linking boundaries.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, NoReturn, cast

ROOT = Path(__file__).resolve().parents[1]
TRIAGE = ROOT / "docs" / "revenue-triage-2026-06-25.json"
MATRIX = ROOT / "docs" / "free-api-resource-service-matrix-2026-06-25.json"
DOC = ROOT / "docs" / "free-api-resource-service-matrix-2026-06-25.md"
README = ROOT / "README.md"

REQUIRED_TOP_LEVEL = {
    "generated_at",
    "owner",
    "scope",
    "non_goal",
    "sources",
    "guardrails",
    "payment_connectors",
    "deployment_targets",
    "repositories",
}

REQUIRED_ENTRY_FIELDS = {
    "rank",
    "repo",
    "visibility",
    "status",
    "priority",
    "lane",
    "api_candidates",
    "free_resource_stack",
    "deployment_path",
    "monetization_path",
    "payment_account_wiring",
    "source_alignment",
    "guardrail",
}

# Catch common accidental secret values while allowing secret *names* such as
# STRIPE_SECRET_KEY or TOSS_PAYMENTS_SECRET_KEY.
SECRET_VALUE_PATTERNS = [
    re.compile(r"sk_(?:live|test)_[A-Za-z0-9]{12,}"),
    re.compile(r"whsec_[A-Za-z0-9]{12,}"),
    re.compile(r"live_sk_[A-Za-z0-9]{12,}"),
    re.compile(r"test_sk_[A-Za-z0-9]{12,}"),
    re.compile(r"secret\s*[:=]\s*['\"][^'\"]{16,}", re.IGNORECASE),
]


def fail(message: str) -> NoReturn:
    raise SystemExit(f"free resource matrix validation failed: {message}")


def load_json(path: Path) -> dict[str, Any]:
    if not path.is_file():
        fail(f"missing {path.relative_to(ROOT)}")
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        fail(f"{path.relative_to(ROOT)} root must be an object")
    return cast(dict[str, Any], data)


def require_string_list(value: Any, label: str, minimum: int = 1) -> list[str]:
    if not isinstance(value, list) or len(value) < minimum or not all(isinstance(item, str) and item for item in value):
        fail(f"{label} must be a non-empty string list")
    return cast(list[str], value)


def main() -> None:
    triage = load_json(TRIAGE)
    matrix = load_json(MATRIX)
    missing = REQUIRED_TOP_LEVEL - set(matrix)
    if missing:
        fail(f"missing top-level keys: {', '.join(sorted(missing))}")

    if matrix.get("scope") != "all-50-including-archived":
        fail("scope must stay all-50-including-archived")
    if matrix.get("non_goal") != "avoid-low-roi-polish":
        fail("non_goal must stay avoid-low-roi-polish")

    triage_repos = [item["repo"] for item in triage.get("repositories", [])]
    entries = matrix.get("repositories")
    if not isinstance(entries, list):
        fail("repositories must be a list")
    matrix_repos = [entry.get("repo") for entry in entries if isinstance(entry, dict)]
    if len(entries) != 50:
        fail(f"expected 50 matrix entries, found {len(entries)}")
    if len(set(matrix_repos)) != len(matrix_repos):
        fail("matrix contains duplicate repositories")
    if matrix_repos != triage_repos:
        fail("matrix repository order must match revenue triage order")

    guardrails = require_string_list(matrix.get("guardrails"), "guardrails", minimum=5)
    joined_guardrails = "\n".join(guardrails).lower()
    for token in ("no secrets", "real payout", "archived", "no revenue guarantee"):
        if token not in joined_guardrails:
            fail(f"guardrails must mention {token!r}")

    for source_key in ("free_ai_resource_catalog", "korean_public_api_catalog"):
        if source_key not in matrix["sources"]:
            fail(f"sources missing {source_key}")

    payment_connectors = matrix.get("payment_connectors")
    if not isinstance(payment_connectors, list) or len(payment_connectors) < 3:
        fail("expected at least Toss, PortOne, and Stripe payment connectors")
    provider_names = {item.get("provider") for item in payment_connectors if isinstance(item, dict)}
    for provider in ("Toss Payments", "PortOne V2", "Stripe Checkout / Payment Links"):
        if provider not in provider_names:
            fail(f"missing payment connector: {provider}")

    for entry in entries:
        if not isinstance(entry, dict):
            fail("each repository entry must be an object")
        missing_fields = REQUIRED_ENTRY_FIELDS - set(entry)
        if missing_fields:
            fail(f"{entry.get('repo', '<unknown>')} missing fields: {', '.join(sorted(missing_fields))}")
        require_string_list(entry.get("api_candidates"), f"{entry['repo']} api_candidates", minimum=2)
        require_string_list(entry.get("free_resource_stack"), f"{entry['repo']} free_resource_stack", minimum=2)
        require_string_list(entry.get("source_alignment"), f"{entry['repo']} source_alignment", minimum=2)
        wiring = entry.get("payment_account_wiring")
        if not isinstance(wiring, dict):
            fail(f"{entry['repo']} payment_account_wiring must be an object")
        require_string_list(wiring.get("env_slots_to_create"), f"{entry['repo']} env slots", minimum=1)
        require_string_list(wiring.get("manual_steps_required"), f"{entry['repo']} manual steps", minimum=3)
        if "automation_limit" not in wiring or "bank" not in str(wiring["automation_limit"]).lower():
            fail(f"{entry['repo']} must state bank/payout automation limit")
        if entry.get("status") == "archived" and "Do not unarchive" not in entry.get("guardrail", ""):
            fail(f"archived repo {entry['repo']} must keep explicit unarchive guardrail")

    for path in (MATRIX, DOC):
        text = path.read_text(encoding="utf-8")
        for pattern in SECRET_VALUE_PATTERNS:
            if pattern.search(text):
                fail(f"possible committed secret value in {path.relative_to(ROOT)}")

    if not DOC.is_file():
        fail(f"missing {DOC.relative_to(ROOT)}")
    doc_text = DOC.read_text(encoding="utf-8")
    for token in ("DaesikPage", "yybmion/public-apis-4Kr", "Payment and payout wiring", "All-repository application matrix"):
        if token not in doc_text:
            fail(f"matrix doc missing {token!r}")

    readme = README.read_text(encoding="utf-8")
    for rel in (str(DOC.relative_to(ROOT)), str(MATRIX.relative_to(ROOT))):
        if rel not in readme:
            fail(f"README must link {rel}")

    print("free resource matrix validation ok")


if __name__ == "__main__":
    main()
