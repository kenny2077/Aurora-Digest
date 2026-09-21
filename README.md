<div align="center">

<a href="https://kenny2077.github.io/Aurora-Newsletter/">
  <img src="docs/assets/readme/aurora-mark.png" width="148" alt="Aurora Newsletter mark" />
</a>

# Aurora Newsletter

**A self-hosted daily AI learning newsletter for builders, researchers, and students.**

Aurora finds useful tech news, active GitHub projects, and relevant research
papers, then turns them into one focused briefing for email and the web.

[![status](https://img.shields.io/badge/status-active-18c964?style=flat-square)](#)
[![python](https://img.shields.io/badge/python-3.11%2B-3776ab?style=flat-square&logo=python&logoColor=white)](pyproject.toml)
[![workflow](https://img.shields.io/github/actions/workflow/status/kenny2077/Aurora-Newsletter/aurora-newsletter.yml?branch=main&style=flat-square&label=newsletter)](.github/workflows/aurora-newsletter.yml)
[![pages](https://img.shields.io/badge/read-live%20newsletter-0ea5e9?style=flat-square)](https://kenny2077.github.io/Aurora-Newsletter/)
[![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

**[Read the newsletter](https://kenny2077.github.io/Aurora-Newsletter/)** ·
**[Quick start](#quick-start)** ·
**[Contributing](CONTRIBUTING.md)**

<br>

<a href="https://kenny2077.github.io/Aurora-Newsletter/">
  <img src="docs/assets/readme/aurora-digest-overview.png" width="94%" alt="Aurora Newsletter product overview" />
</a>

</div>

## One useful reading queue, every day

Broad feeds optimize for volume. Aurora optimizes for the smaller question:
what is worth reading, studying, or trying today?

| Signal | What Aurora selects | What reaches the newsletter |
| --- | --- | --- |
| Tech news | Timely AI and technology stories with strong source signals | Linked headline, source, and concise summary |
| GitHub projects | Active repositories with adoption and learning value | Project link, useful stats, tags, and a practical description |
| Research papers | Relevant work from configured research fields | Paper link, venue or status, and a student-friendly summary |

The default newsletter contains five news items, three repositories, and three
papers. It favors a short, high-signal briefing over exhaustive coverage.

## Quick start

You need Python 3.11+, Node.js 22.12+, and
[uv](https://docs.astral.sh/uv/getting-started/installation/).

```bash
git clone https://github.com/kenny2077/Aurora-Newsletter.git
cd Aurora-Newsletter
uv sync --dev
npm --prefix web ci
```

Validate the example configuration and run a local smoke test:

```bash
uv run aurora config validate --config data/config.example.json
uv run aurora doctor --config data/config.example.json
uv run aurora run --dry-run --mode all --output-dir /tmp/aurora-smoke
```

Generate the unified newsletter:

```bash
uv run aurora run --mode unified_digest \
  --config data/config.example.json \
  --topic agents
```

Use `--skip-llm` for a deterministic run or `--skip-delivery` to preview without
sending email.

## Publish on GitHub Actions

Aurora can run entirely from your fork and publish its archive through GitHub
Pages.

1. Fork the repository.
2. In **Settings → Pages**, publish from the `gh-pages` branch at `/`.
3. Add the secrets for the delivery channels and providers you enable.
4. Run the `aurora-newsletter` workflow once with **Run workflow**.

Email delivery requires:

| Secret | Purpose |
| --- | --- |
| `SMTP_USERNAME` | SMTP account username |
| `EMAIL_PASSWORD` | SMTP account password or app password |
| `AURORA_EMAIL_RECIPIENTS` | Comma-separated recipients |

Optional provider secrets:

| Secret | Purpose |
| --- | --- |
| `DEEPSEEK_API_KEY` | LLM ranking, summaries, and public-copy repair |
| `GH_SEARCH_TOKEN` | Higher GitHub Search API limits |
| `SEMANTIC_SCHOLAR_API_KEY` | Additional paper enrichment |

GitHub Actions supplies `GITHUB_TOKEN` automatically. The workflow tests the
project, enforces the public quality gate, builds the Astro site, publishes
`gh-pages`, and verifies the deployed URL before it reports success.

## How Aurora works

<p align="center">
  <img src="docs/assets/readme/aurora-digest-workflow.png" width="94%" alt="Aurora Newsletter workflow" />
</p>

Every mode uses the same pipeline shape:

```text
fetch → normalize → deduplicate → score → enrich → summarize → render → deliver
```

Source adapters normalize items into one model. Deterministic scoring and
optional LLM enrichment rank the candidates. A final quality gate blocks weak
or internal-looking copy before email or Pages delivery.

The public newsletter stays clean. Source health, rate limits, fallback counts,
and delivery diagnostics remain in GitHub Actions logs and `run_summary.json`.

## Focus the newsletter

Use one topic preset to keep news, repositories, and papers coherent:

| Topic | News focus | Repository interests | Research fields |
| --- | --- | --- | --- |
| `llm` | Models, inference, RAG, evaluation | LLMs, MCP, developer tools | LLMs |
| `agents` | Agents, tool use, MCP, workflows | Agents, MCP, automation | Agents |
| `robots` | Robotics, embodied AI, robot learning | Robotics | Robotics |

```bash
uv run aurora run --mode unified_digest --topic robots
```

Choose how much enrichment work Aurora performs:

| Tier | Best for | Behavior |
| --- | --- | --- |
| `lean` | Cheapest reliable run | Deterministic-first, smaller enrichment budget |
| `balanced` | Daily public newsletter | Bounded LLM ranking and copy polish |
| `thorough` | Deeper editorial pass | Broader enrichment and a larger request budget |

```bash
uv run aurora run --mode unified_digest --quality-tier balanced
```

See [interest and research presets](docs/interests.md) for the complete list.

## Run individual radars

The newsletter combines three independently runnable modes:

```bash
# Timely technology stories
uv run aurora run --mode tech_news

# GitHub projects for hands-on study
uv run aurora run --mode repo_learning --repo-interest agents

# Research papers in selected fields
uv run aurora run --mode scholar --research-field ml --research-field agents
```

The stable internal name for the combined mode remains `unified_digest`.

## Local models

Aurora supports Ollama, LM Studio, AnythingLLM, and other OpenAI-compatible
local endpoints. Local models can rank, summarize, tag, and repair public copy;
source collection, deduplication, delivery, and quality enforcement remain
deterministic.

Start with the included example:

```bash
uv run aurora config validate --config data/local-llm.config.example.json
uv run aurora doctor --config data/local-llm.config.example.json --local-llm
uv run aurora run --mode unified_digest \
  --config data/local-llm.config.example.json \
  --local-llm
```

`--free-mode` and `--local-llm` prevent Aurora from calling cloud LLM
providers. `--skip-llm` disables LLM enrichment completely.

## Web archive

The Astro frontend turns generated newsletter posts into a searchable static
archive.

```bash
npm --prefix web run dev -- --host 127.0.0.1 --port 4321
npm --prefix web run build
npm --prefix web run verify:pages
```

<p align="center">
  <img src="docs/assets/readme/aurora-digest-dashboard.png" width="94%" alt="Aurora Newsletter web surface" />
</p>

## Quality and diagnostics

Every run writes JSONL snapshots and `run_summary.json` under
`data/runs/<run_id>/<mode>/`. Use that report first when a source fails, a
section is empty, or a provider reaches its budget.

Replay saved fixtures before changing ranking or presentation logic:

```bash
uv run aurora eval replay \
  --fixture tests/fixtures/digest_quality/agents.jsonl \
  --output /tmp/aurora-agents-eval.json
```

Request and token caps are configured with `ai.max_requests_per_run` and
`ai.max_tokens_per_run`. When optional enrichment runs out of budget, Aurora
records the fallback and continues through deterministic paths unless strict
delivery requirements cannot be met.

## Project documentation

- [Configuration interests and presets](docs/interests.md)
- [Codebase navigation](docs/navigation.md)
- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md)
for environment setup, tests, and review expectations.

## License

Aurora Newsletter is released under the [MIT License](LICENSE). See
[NOTICE](NOTICE) for upstream Horizon-family attribution.
