"""Validate focused selected-work navigation and private-source boundaries."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORDER = ['AegisOps', 'idlemesh', 'memoryflow-lab', 'Nexus-Hive', 'stage-pilot', 'twincity-ui', 'lakehouse-contract-lab', 'SteadyTap', 'memory-test-master-change-gate', 'secure-xl2hwp-local', 'tool-call-finetune-lab', 'llm-onprem-deployment-kit', 'kbbq-idle-unity']
PRIVATE = {"idlemesh", "memory-test-master-change-gate"}


def main() -> None:
    text = (ROOT / "README.md").read_text(encoding="utf-8")
    assert "## Selected work" in text
    rows = [line for line in text.splitlines() if line.startswith("| **[")]
    assert len(rows) == len(ORDER), "selection table must have one row per selected project"
    for repo, row in zip(ORDER, rows):
        if repo in PRIVATE:
            assert "#project-" + repo + ")" in row
            assert "Private source" in row
            assert "github.com/KIM3310/" + repo not in row
        else:
            assert "github.com/KIM3310/" + repo + ")" in row
    assert "upstream Apache-2.0" in text, "retain StagePilot attribution"
    assert "historical 2026-02-20" in text, "identify the Unity build date"
    assert "synthetic inference" in text, "identify the cluster fixture boundary"
    print("portfolio frontdoor validation ok: 13 projects, private source boundaries preserved")


if __name__ == "__main__":
    main()
