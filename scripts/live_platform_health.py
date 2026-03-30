#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import ssl
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


DEFAULT_ENV_FILE = Path(__file__).resolve().parents[1] / ".env.live-platform"


def _load_env_file(path: Path) -> bool:
    if not path.exists():
        return False
    for raw_line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        if key and value and key not in os.environ:
            os.environ[key] = value
    return True


def _mask(value: str | None, keep: int = 4) -> str:
    text = (value or "").strip()
    if not text:
        return ""
    if len(text) <= keep:
        return "*" * len(text)
    return f"{text[:keep]}{'*' * max(4, len(text) - keep)}"


def _env_first(*keys: str) -> str:
    for key in keys:
        value = os.getenv(key, "").strip()
        if value:
            return value
    return ""



def _snowflake_health() -> dict[str, Any]:
    required = ["SNOWFLAKE_ACCOUNT", "SNOWFLAKE_USER", "SNOWFLAKE_PASSWORD", "SNOWFLAKE_DATABASE"]
    missing = [key for key in required if not os.getenv(key, "").strip()]
    result: dict[str, Any] = {
        "platform": "snowflake",
        "configured": not missing,
        "missing": missing,
        "account": os.getenv("SNOWFLAKE_ACCOUNT", "").strip(),
        "database": os.getenv("SNOWFLAKE_DATABASE", "").strip(),
        "schema": os.getenv("SNOWFLAKE_SCHEMA", "PUBLIC").strip(),
        "warehouse": os.getenv("SNOWFLAKE_WAREHOUSE", "COMPUTE_WH").strip(),
    }
    if missing:
        result["status"] = "unconfigured"
        return result

    try:
        import snowflake.connector  # type: ignore[import-untyped]
    except ImportError as exc:
        result["status"] = "dependency_missing"
        result["error"] = str(exc)
        return result

    conn = None
    try:
        conn = snowflake.connector.connect(
            account=os.environ["SNOWFLAKE_ACCOUNT"].strip(),
            user=os.environ["SNOWFLAKE_USER"].strip(),
            password=os.environ["SNOWFLAKE_PASSWORD"].strip(),
            database=os.environ["SNOWFLAKE_DATABASE"].strip(),
            schema=os.getenv("SNOWFLAKE_SCHEMA", "PUBLIC").strip(),
            warehouse=os.getenv("SNOWFLAKE_WAREHOUSE", "COMPUTE_WH").strip(),
            role=os.getenv("SNOWFLAKE_ROLE", "").strip() or None,
            login_timeout=20,
            network_timeout=20,
            client_session_keep_alive=False,
        )
        cur = conn.cursor()
        cur.execute(
            "SELECT CURRENT_ACCOUNT(), CURRENT_DATABASE(), CURRENT_SCHEMA(), "
            "CURRENT_WAREHOUSE(), CURRENT_ROLE(), CURRENT_VERSION()"
        )
        row = cur.fetchone()
        cur.close()
        result["status"] = "ok"
        result["live"] = {
            "current_account": row[0],
            "current_database": row[1],
            "current_schema": row[2],
            "current_warehouse": row[3],
            "current_role": row[4],
            "version": row[5],
        }
        return result
    except Exception as exc:  # noqa: BLE001
        result["status"] = "error"
        result["error"] = str(exc)
        return result
    finally:
        if conn is not None:
            try:
                conn.close()
            except Exception:
                pass


def _databricks_health() -> dict[str, Any]:
    host = os.getenv("DATABRICKS_HOST", "").strip().rstrip("/")
    token = os.getenv("DATABRICKS_TOKEN", "").strip()
    client_id = os.getenv("DATABRICKS_CLIENT_ID", "").strip()
    client_secret = os.getenv("DATABRICKS_CLIENT_SECRET", "").strip()
    profile = os.getenv("DATABRICKS_CONFIG_PROFILE", "").strip()
    auth_type = os.getenv("DATABRICKS_AUTH_TYPE", "").strip()
    warehouse_id = os.getenv("DATABRICKS_WAREHOUSE_ID", "").strip()

    configured = bool(host and (token or profile or auth_type or (client_id and client_secret)))
    missing: list[str] = []
    if not host:
        missing.append("DATABRICKS_HOST")
    if not (token or profile or auth_type or (client_id and client_secret)):
        missing.append("DATABRICKS_TOKEN or profile/client credentials")

    result: dict[str, Any] = {
        "platform": "databricks",
        "configured": configured,
        "missing": missing,
        "host": host,
        "auth_mode": (
            "token"
            if token
            else "profile"
            if profile
            else "client_credentials"
            if client_id and client_secret
            else auth_type or ""
        ),
        "warehouse_id": warehouse_id,
    }
    if not configured:
        result["status"] = "unconfigured"
        return result

    try:
        from databricks.sdk import WorkspaceClient  # type: ignore[import-untyped]
    except ImportError as exc:
        result["status"] = "dependency_missing"
        result["error"] = str(exc)
        return result

    try:
        if token:
            client = WorkspaceClient(host=host, token=token)
        elif client_id and client_secret:
            client = WorkspaceClient(host=host, client_id=client_id, client_secret=client_secret)
        elif profile:
            client = WorkspaceClient(profile=profile)
        else:
            client = WorkspaceClient(host=host)

        me = client.current_user.me()
        warehouses = list(client.warehouses.list())
        running = [w for w in warehouses if getattr(w, "state", "") == "RUNNING"]
        result["status"] = "ok"
        result["live"] = {
            "user_name": getattr(me, "user_name", "") or getattr(me, "userName", ""),
            "display_name": getattr(me, "display_name", "") or getattr(me, "displayName", ""),
            "warehouse_count": len(warehouses),
            "running_warehouse_count": len(running),
            "selected_warehouse_id": warehouse_id or (getattr(running[0], "id", "") if running else ""),
        }
        return result
    except Exception as exc:  # noqa: BLE001
        result["status"] = "error"
        result["error"] = str(exc)
        return result


def _palantir_health() -> dict[str, Any]:
    base_url = _env_first("FOUNDRY_BASE_URL", "PALANTIR_BASE_URL").rstrip("/")
    auth_mode = (_env_first("PALANTIR_AUTH_MODE", "FOUNDRY_AUTH_MODE") or "token").lower()
    token = _env_first("PALANTIR_TOKEN", "FOUNDRY_TOKEN")
    client_id = _env_first("PALANTIR_CLIENT_ID", "FOUNDRY_CLIENT_ID")
    client_secret = _env_first("PALANTIR_CLIENT_SECRET", "FOUNDRY_CLIENT_SECRET")
    dataset_ready = (_env_first("DATASET_READY", "FOUNDRY_DATASET_READY") or "").lower() in {"1", "true", "yes", "y", "on"}
    ontology_ready = (_env_first("ONTOLOGY_READY", "FOUNDRY_ONTOLOGY_READY") or "").lower() in {"1", "true", "yes", "y", "on"}
    space_or_project = _env_first("SPACE_OR_PROJECT_NAME", "FOUNDRY_SPACE_OR_PROJECT_NAME")
    resource_path = _env_first("PALANTIR_RESOURCE_PATH", "FOUNDRY_RESOURCE_PATH")
    parent_folder_rid = _env_first("PALANTIR_PARENT_FOLDER_RID", "FOUNDRY_PARENT_FOLDER_RID")
    ca_bundle = _env_first("PALANTIR_CA_BUNDLE", "FOUNDRY_CA_BUNDLE")
    skip_ssl_verify = (_env_first("PALANTIR_SKIP_SSL_VERIFY", "FOUNDRY_SKIP_SSL_VERIFY") or "").lower() in {"1", "true", "yes", "y", "on"}

    auth_ready = bool(token) if auth_mode != "oauth" else bool(client_id and client_secret)
    blockers = []
    if not base_url:
        blockers.append("FOUNDRY_BASE_URL/PALANTIR_BASE_URL is missing")
    if not auth_ready:
        blockers.append("Foundry auth credentials are missing for the selected auth mode")
    if not dataset_ready:
        blockers.append("DATASET_READY is false; dataset sync is intentionally disabled")
    if not (space_or_project or resource_path or parent_folder_rid):
        blockers.append("SPACE_OR_PROJECT_NAME, PALANTIR_RESOURCE_PATH, or PALANTIR_PARENT_FOLDER_RID is required")

    result: dict[str, Any] = {
        "platform": "palantir_foundry",
        "configured": bool(base_url and auth_ready),
        "status": "unconfigured" if not (base_url and auth_ready) else "ok",
        "base_url": base_url,
        "auth_mode": auth_mode,
        "sync_ready": bool(base_url and auth_ready and dataset_ready and (space_or_project or resource_path or parent_folder_rid)),
        "dataset_ready": dataset_ready,
        "ontology_ready": ontology_ready,
        "blockers": blockers,
        "token_hint": _mask(token),
    }
    if not (base_url and auth_ready):
        return result

    try:
        headers = {"Accept": "application/json"}
        if auth_mode == "oauth":
            token_body = urllib.parse.urlencode(
                {
                    "grant_type": "client_credentials",
                    "client_id": client_id,
                    "client_secret": client_secret,
                }
            ).encode("utf-8")
            token_request = urllib.request.Request(
                f"{base_url}/multipass/api/oauth2/token",
                data=token_body,
                headers={"Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"},
                method="POST",
            )
            with urllib.request.urlopen(token_request, timeout=30, context=_ssl_context(ca_bundle, skip_ssl_verify)) as response:
                payload = json.loads(response.read().decode("utf-8"))
            token = str(payload.get("access_token", "")).strip()
        headers["Authorization"] = f"Bearer {token}"
        request = urllib.request.Request(
            f"{base_url}/api/v2/filesystem/spaces?preview=true&pageSize=10",
            headers=headers,
            method="GET",
        )
        with urllib.request.urlopen(request, timeout=30, context=_ssl_context(ca_bundle, skip_ssl_verify)) as response:
            payload = json.loads(response.read().decode("utf-8"))
        spaces = payload.get("data", []) or []
        result["live"] = {
            "space_count": len(spaces),
            "first_space_path": next(
                (
                    item.get("path")
                    for item in spaces
                    if isinstance(item, dict) and item.get("path")
                ),
                "",
            ),
        }
        return result
    except Exception as exc:  # noqa: BLE001
        result["status"] = "error"
        result["error"] = str(exc)
        return result


def _ssl_context(ca_bundle: str, skip_ssl_verify: bool) -> ssl.SSLContext:
    if skip_ssl_verify:
        return ssl._create_unverified_context()
    if ca_bundle:
        return ssl.create_default_context(cafile=ca_bundle)
    return ssl.create_default_context()


def main() -> int:
    parser = argparse.ArgumentParser(description="Run live health checks for Snowflake, Databricks, and Palantir Foundry.")
    parser.add_argument("--env-file", default=str(DEFAULT_ENV_FILE), help="Optional env file to load before probing.")
    args = parser.parse_args()

    env_file = Path(args.env_file).expanduser()
    loaded = _load_env_file(env_file)

    report = {
        "env_file": str(env_file),
        "env_file_loaded": loaded,
        "platforms": [
            _snowflake_health(),
            _databricks_health(),
            _palantir_health(),
        ],
    }
    print(json.dumps(report, indent=2, ensure_ascii=True))

    failing = [
        item["platform"]
        for item in report["platforms"]
        if item.get("status") not in {"ok", "unconfigured"}
    ]
    return 1 if failing else 0


if __name__ == "__main__":
    raise SystemExit(main())
