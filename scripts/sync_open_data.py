from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import zipfile
from dataclasses import dataclass
from pathlib import Path
from shutil import which


@dataclass(frozen=True)
class DatasetFile:
    dataset: str
    remote_path: str
    cache_group: str

    @property
    def local_name(self) -> str:
        return Path(self.remote_path).name


@dataclass(frozen=True)
class RepoLink:
    repo: str
    target_dir: str
    cache_group: str
    files: tuple[str, ...]


WORKSPACE_ROOT = Path(
    os.environ.get("PORTFOLIO_WORKSPACE_ROOT", str(Path(__file__).resolve().parents[2]))
)
CACHE_ROOT = WORKSPACE_ROOT / ".open-data-cache"


def _detect_kaggle_bin() -> Path:
    resolved = which("kaggle")
    if resolved:
        return Path(resolved)
    return Path.home() / "Library" / "Python" / "3.12" / "bin" / "kaggle"


KAGGLE_BIN = _detect_kaggle_bin()

DATASET_FILES: tuple[DatasetFile, ...] = (
    DatasetFile("andrewmvd/retinal-disease-classification", "Evaluation_Set/Evaluation_Set/RFMiD_Validation_Labels.csv", "retina"),
    DatasetFile("andrewmvd/retinal-disease-classification", "Evaluation_Set/Evaluation_Set/Validation/1.png", "retina"),
    DatasetFile("andrewmvd/retinal-disease-classification", "Evaluation_Set/Evaluation_Set/Validation/10.png", "retina"),
    DatasetFile("andrewmvd/retinal-disease-classification", "Evaluation_Set/Evaluation_Set/Validation/100.png", "retina"),
    DatasetFile("sukmaadhiwijaya/welding-defect-object-detection", "The Welding Defect Dataset - v2/The Welding Defect Dataset - v2/data.yaml", "weld"),
    DatasetFile("sukmaadhiwijaya/welding-defect-object-detection", "The Welding Defect Dataset - v2/The Welding Defect Dataset - v2/test/images/02fd0af7-51ab46bb-c13_jpg.rf.7de08cd3b264d9098d09f5fe6d21c959.jpg", "weld"),
    DatasetFile("sukmaadhiwijaya/welding-defect-object-detection", "The Welding Defect Dataset - v2/The Welding Defect Dataset - v2/test/images/Good-Welding-images_11_jpeg.rf.4807e1282a383cba87b1e2e3c77ca9ce.jpg", "weld"),
    DatasetFile("sukmaadhiwijaya/welding-defect-object-detection", "The Welding Defect Dataset - v2/The Welding Defect Dataset - v2/test/images/SampleV2_1_mp4-60_jpg.rf.40f4a4094130e65b1a801b49fefc5d01.jpg", "weld"),
    DatasetFile("paresh2047/uci-semcom", "uci-secom.csv", "manufacturing"),
    DatasetFile("olistbr/brazilian-ecommerce", "olist_customers_dataset.csv", "analytics"),
    DatasetFile("olistbr/brazilian-ecommerce", "olist_order_items_dataset.csv", "analytics"),
    DatasetFile("olistbr/brazilian-ecommerce", "olist_order_payments_dataset.csv", "analytics"),
    DatasetFile("olistbr/brazilian-ecommerce", "olist_orders_dataset.csv", "analytics"),
    DatasetFile("olistbr/brazilian-ecommerce", "olist_products_dataset.csv", "analytics"),
    DatasetFile("olistbr/brazilian-ecommerce", "product_category_name_translation.csv", "analytics"),
    DatasetFile("javierspdatabase/global-online-orders", "Global Online Orders/Amazon.sql", "nexus"),
    DatasetFile("javierspdatabase/global-online-orders", "Global Online Orders/orders_frostonline.xlsx", "nexus"),
    DatasetFile("suraj520/customer-support-ticket-dataset", "customer_support_tickets.csv", "enterprise"),
    DatasetFile("sanketgadekar/legal-indian-contract-clauses-dataset", "legal_contract_clauses.csv", "regulated"),
    DatasetFile("anshankul/ibm-amlsim-example-dataset", "accounts.csv", "regulated"),
    DatasetFile("anshankul/ibm-amlsim-example-dataset", "alerts.csv", "regulated"),
    DatasetFile("vipulshinde/incident-response-log", "Incident_response.txt", "ops"),
    DatasetFile("vipulshinde/incident-response-log", "incident_event_log.csv", "ops"),
)

REPO_LINKS: tuple[RepoLink, ...] = (
    RepoLink("retina-scan-ai", "data/external/rfmid_validation", "retina", ("RFMiD_Validation_Labels.csv", "1.png", "10.png", "100.png")),
    RepoLink("weld-defect-vision", "data/external/welding_defect_object_detection", "weld", ("data.yaml", "02fd0af7-51ab46bb-c13_jpg.rf.7de08cd3b264d9098d09f5fe6d21c959.jpg", "Good-Welding-images_11_jpeg.rf.4807e1282a383cba87b1e2e3c77ca9ce.jpg", "SampleV2_1_mp4-60_jpg.rf.40f4a4094130e65b1a801b49fefc5d01.jpg")),
    RepoLink("memory-test-master-change-gate", "data/external/uci_secom", "manufacturing", ("uci-secom.csv",)),
    RepoLink("fab-ops-yield-control-tower", "data/external/uci_secom", "manufacturing", ("uci-secom.csv",)),
    RepoLink("lakehouse-contract-lab", "data/external/olist", "analytics", ("olist_customers_dataset.csv", "olist_order_items_dataset.csv", "olist_order_payments_dataset.csv", "olist_orders_dataset.csv", "olist_products_dataset.csv", "product_category_name_translation.csv")),
    RepoLink("Nexus-Hive", "data/external/global_online_orders", "nexus", ("Amazon.sql", "orders_frostonline.xlsx")),
    RepoLink("enterprise-llm-adoption-kit", "app/backend/data/external/customer_support", "enterprise", ("customer_support_tickets.csv",)),
    RepoLink("regulated-case-workbench", "data/external/regulatory_review", "regulated", ("legal_contract_clauses.csv", "accounts.csv", "alerts.csv")),
    RepoLink("AegisOps", "samples/external/incident_response_log", "ops", ("Incident_response.txt", "incident_event_log.csv")),
    RepoLink("ops-reliability-workbench", "data/external/incident_response_log", "ops", ("Incident_response.txt", "incident_event_log.csv")),
    RepoLink("stage-pilot", "data/external/incident_prompt_pack", "ops", ("Incident_response.txt",)),
    RepoLink("stage-pilot", "data/external/incident_prompt_pack", "enterprise", ("customer_support_tickets.csv",)),
    RepoLink("honeypot", "data/external/customer_support", "enterprise", ("customer_support_tickets.csv",)),
    RepoLink("Upstage-DocuAgent", "data/external/legal_contracts", "regulated", ("legal_contract_clauses.csv",)),
)


def ensure_kaggle_available() -> None:
    if not KAGGLE_BIN.exists():
        raise SystemExit(f"Kaggle CLI not found: {KAGGLE_BIN}")


def download_file(item: DatasetFile) -> Path:
    group_dir = CACHE_ROOT / item.cache_group
    group_dir.mkdir(parents=True, exist_ok=True)
    final_path = group_dir / item.local_name
    if final_path.exists():
        return final_path

    cmd = [
        str(KAGGLE_BIN),
        "datasets",
        "download",
        "-d",
        item.dataset,
        "-f",
        item.remote_path,
        "-p",
        str(group_dir),
        "-q",
    ]
    subprocess.run(cmd, check=True)
    zipped = group_dir / f"{item.local_name}.zip"
    if zipped.exists():
        with zipfile.ZipFile(zipped) as archive:
            for member in archive.namelist():
                member_path = (group_dir / member).resolve()
                if not str(member_path).startswith(str(group_dir.resolve())):
                    raise ValueError(f"Zip slip attempt blocked: {member}")
            archive.extractall(group_dir)
    if not final_path.exists():
        raise FileNotFoundError(final_path)
    return final_path


def sync_repo_links() -> dict[str, dict[str, object]]:
    summary: dict[str, dict[str, object]] = {}
    for repo_link in REPO_LINKS:
        repo_root = WORKSPACE_ROOT / repo_link.repo
        target_dir = repo_root / repo_link.target_dir
        target_dir.mkdir(parents=True, exist_ok=True)
        exclude_path = repo_root / ".git" / "info" / "exclude"
        exclude_entry = f"{repo_link.target_dir}/\n"
        existing = exclude_path.read_text(encoding="utf-8") if exclude_path.exists() else ""
        if exclude_entry not in existing:
            exclude_path.write_text(existing + exclude_entry, encoding="utf-8")

        files: list[str] = []
        for file_name in repo_link.files:
            source = CACHE_ROOT / repo_link.cache_group / file_name
            if not source.exists():
                raise FileNotFoundError(source)
            link_path = target_dir / file_name
            if link_path.is_symlink() or link_path.exists():
                if link_path.is_symlink() and link_path.resolve() == source.resolve():
                    files.append(file_name)
                    continue
                if link_path.is_dir():
                    shutil.rmtree(link_path)
                else:
                    link_path.unlink()
            link_path.symlink_to(source)
            files.append(file_name)

        repo_summary = summary.setdefault(repo_link.repo, {"paths": []})
        repo_summary["paths"].append({"target": repo_link.target_dir, "files": files})

    manifest_path = CACHE_ROOT / "repo_data_map.json"
    manifest_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync public open-data cache and local repo links.")
    parser.add_argument("--skip-download", action="store_true", help="Do not call Kaggle; only verify and relink staged files.")
    args = parser.parse_args()

    ensure_kaggle_available()
    CACHE_ROOT.mkdir(parents=True, exist_ok=True)

    if not args.skip_download:
        for item in DATASET_FILES:
            download_file(item)

    summary = sync_repo_links()
    print(
        json.dumps(
            {
                "workspace_root": str(WORKSPACE_ROOT),
                "cache_root": str(CACHE_ROOT),
                "repo_count": len(summary),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
