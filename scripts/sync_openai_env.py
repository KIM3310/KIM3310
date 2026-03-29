from __future__ import annotations

import argparse
import os
import subprocess
from pathlib import Path


HOME = Path.home()
OPENAI_ENV_PATH = HOME / ".openai.local.env"
STREAMLIT_SECRET_PATH = HOME / ".openai.streamlit.secrets.toml"
WORKSPACE_ROOT = Path(
    os.environ.get("PORTFOLIO_WORKSPACE_ROOT", str(Path(__file__).resolve().parents[2]))
)

STREAMLIT_REPOS = (
    "ops-reliability-workbench",
    "memory-test-master-change-gate",
)

DOTENV_REPOS = (
    "AegisOps",
)


def write_openai_env(api_key: str) -> None:
    OPENAI_ENV_PATH.write_text(
        "\n".join(
            [
                f"OPENAI_API_KEY={api_key}",
                f"LLM_OPENAI_API_KEY={api_key}",
                "OPENAI_MODEL=gpt-4o-mini",
                "OPENAI_MODEL_PUBLIC=gpt-4.1-mini",
                "OPENAI_MODEL_REFRESH=gpt-4o",
                "LLM_PROVIDER=openai",
                "",
            ]
        ),
        encoding="utf-8",
    )
    os.chmod(OPENAI_ENV_PATH, 0o600)


def write_streamlit_secrets(api_key: str) -> None:
    STREAMLIT_SECRET_PATH.write_text(
        "\n".join(
            [
                f'OPENAI_API_KEY = "{api_key}"',
                'OPENAI_MODEL = "gpt-4o-mini"',
                "",
            ]
        ),
        encoding="utf-8",
    )
    os.chmod(STREAMLIT_SECRET_PATH, 0o600)


def set_launchctl_env(api_key: str) -> None:
    env_pairs = {
        "OPENAI_API_KEY": api_key,
        "LLM_OPENAI_API_KEY": api_key,
        "OPENAI_MODEL": "gpt-4o-mini",
        "OPENAI_MODEL_PUBLIC": "gpt-4.1-mini",
        "OPENAI_MODEL_REFRESH": "gpt-4o",
        "LLM_PROVIDER": "openai",
    }
    for key, value in env_pairs.items():
        subprocess.run(["launchctl", "setenv", key, value], check=False)


def link_streamlit_secrets() -> None:
    for repo in STREAMLIT_REPOS:
        repo_path = WORKSPACE_ROOT / repo
        secrets_dir = repo_path / ".streamlit"
        secrets_dir.mkdir(parents=True, exist_ok=True)
        link_path = secrets_dir / "secrets.toml"
        _replace_with_symlink(link_path, STREAMLIT_SECRET_PATH)
        _ensure_excluded(repo_path, ".streamlit/secrets.toml")


def link_dotenv() -> None:
    for repo in DOTENV_REPOS:
        repo_path = WORKSPACE_ROOT / repo
        link_path = repo_path / ".env"
        _replace_with_symlink(link_path, OPENAI_ENV_PATH)
        _ensure_excluded(repo_path, ".env")


def _replace_with_symlink(link_path: Path, target: Path) -> None:
    if link_path.is_symlink() or link_path.exists():
        if link_path.is_symlink() and link_path.resolve() == target.resolve():
            return
        if link_path.is_dir():
            raise RuntimeError(f"Refusing to replace directory: {link_path}")
        link_path.unlink()
    link_path.symlink_to(target)


def _ensure_excluded(repo_path: Path, relative_path: str) -> None:
    exclude_path = repo_path / ".git" / "info" / "exclude"
    existing = exclude_path.read_text(encoding="utf-8") if exclude_path.exists() else ""
    entry = f"{relative_path}\n"
    if entry not in existing:
        exclude_path.write_text(existing + entry, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Configure local-only OpenAI credentials across the portfolio.")
    parser.add_argument("--api-key", required=True, help="OpenAI API key to store locally")
    args = parser.parse_args()

    write_openai_env(args.api_key)
    write_streamlit_secrets(args.api_key)
    set_launchctl_env(args.api_key)
    link_streamlit_secrets()
    link_dotenv()
    print(f"openai-local-env-ready ({WORKSPACE_ROOT})")


if __name__ == "__main__":
    main()
