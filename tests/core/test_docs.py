from __future__ import annotations

from pathlib import Path


def test_readme_covers_quickstart_publishing_and_core_modes() -> None:
    readme = Path("README.md").read_text(encoding="utf-8")

    assert "# Aurora Newsletter" in readme
    assert "https://kenny2077.github.io/Aurora-Newsletter/" in readme
    assert "## Quick start" in readme
    assert "## Publish on GitHub Actions" in readme
    assert "git clone https://github.com/kenny2077/Aurora-Newsletter.git" in readme
    assert "gh-pages" in readme
    assert "run_summary.json" in readme
    assert "`SMTP_USERNAME`" in readme
    assert "`EMAIL_PASSWORD`" in readme
    assert "`AURORA_EMAIL_RECIPIENTS`" in readme
    assert "DEEPSEEK_API_KEY" in readme
    assert "GH_SEARCH_TOKEN" in readme
    assert "GITHUB_TOKEN" in readme
    assert "SEMANTIC_SCHOLAR_API_KEY" in readme
    assert "aurora run --mode repo_learning --repo-interest agents" in readme
    assert "aurora run --mode scholar --research-field ml" in readme
    assert "aurora run --mode unified_digest" in readme
    assert "tests/fixtures/digest_quality/agents.jsonl" in readme
    assert "data/local-llm.config.example.json" in readme
    assert "aurora doctor --config data/local-llm.config.example.json --local-llm" in readme


def test_interest_docs_document_migration_and_presets() -> None:
    docs = Path("docs/interests.md").read_text(encoding="utf-8")

    assert "daily learning radar" in docs
    assert "learning interests" in docs
    assert "research fields" in docs
    assert "`agents`" in docs
    assert "`cv`" in docs
    assert "`ml`" in docs
    assert "Legacy `modes.repo_learning.sources.github_search.domains` remains supported" in docs
