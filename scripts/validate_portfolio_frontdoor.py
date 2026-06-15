"""Validate the public portfolio front door stays focused and reviewable."""

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README.md"

FLAGSHIP_ORDER = [
    "stage-pilot",
    "enterprise-llm-adoption-kit",
    "AegisOps",
    "agent-runtime-go",
    "doeon-kim-portfolio",
    "aix-pilot",
]

REQUIRED_DOCS = [
    "docs/portfolio-architecture-index-2026-05-30.md",
    "docs/architecture-evidence-map.md",
    "docs/quality-gate.md",
]

REQUIRED_SECTIONS = [
    "## Product and System Surface",
    "## Three-Minute Proof",
    "## System Fast Path",
    "## Start Here",
]


def fail(message: str) -> None:
    raise SystemExit(f"portfolio frontdoor validation failed: {message}")


def assert_in_order(text: str, labels: list[str]) -> None:
    last_index = -1
    for label in labels:
        index = text.find(label)
        if index == -1:
            fail(f"missing flagship reference: {label}")
        if index < last_index:
            fail(f"flagship reference out of order: {label}")
        last_index = index


def main() -> None:
    text = README.read_text(encoding="utf-8")

    for section in REQUIRED_SECTIONS:
        if section not in text:
            fail(f"missing README section: {section}")

    for doc in REQUIRED_DOCS:
        if not (ROOT / doc).is_file():
            fail(f"missing required review document: {doc}")
        if doc not in text:
            fail(f"README does not link required document: {doc}")

    start_here = text.split("## Start Here", 1)[1]
    assert_in_order(start_here, FLAGSHIP_ORDER)

    proof = text.split("## Three-Minute Proof", 1)[1].split("## System Fast Path", 1)[0]
    for label in FLAGSHIP_ORDER[:5]:
        if label not in proof:
            fail(f"three-minute proof omits flagship: {label}")

    print("portfolio frontdoor validation ok")


if __name__ == "__main__":
    main()
