# Changelog

All notable changes to **gstack-plus** are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [0.5.0] — 2026-05-05

### Added — Experiments (Series 3)

- **Exp-3A Prompt Strategy Comparison**: 4 strategies × 3 Tier-Mid tasks — S1 (role + depth) lets Sonnet beat Opus (15.0 vs 12.7/15) at 14% of the cost ($0.019 vs $0.135). S3 (chain-of-thought + role) also reaches 15.0/15.
- **Exp-3B Real-world Corpus**: 20 tasks from gstack-plus git history — routing algorithm matches expected tier 20/20 (100% accuracy), with distribution 45% Exec / 35% Mid / 20% Tier-A.
- **Series 3 report** published bilingual at `/doc/experiment-series-3`

### Added — Playground

- **S1 Enhanced toggle** in Prompt Builder — prepends staff-engineer identity + proactive risk-surfacing primer. Auto-suggests when Tier-Mid is detected. Series 3 finding: enables Sonnet 15.0/15 > Opus 12.7/15.
- **Boundary case warning** — amber alert for tasks scoring near tier boundaries

### Fixed — Documentation

- Series 2 report patched: latency data table added (Tier-Exec -81%, Tier-Mid -20%), Study Limitations section added, Tier-A variance clarified
- S1 prompt strategy integrated into handoff templates (`plan-to-exec.md`)

---

## [0.4.0] — 2026-05-04

### Added — Documentation Site

- Full bilingual documentation site (Chinese + English) at [zhewenzhang.github.io/gstack-plus](https://zhewenzhang.github.io/gstack-plus/)
- **14 English translations** added: classifier examples, all handoff templates, verification guardrails, 5 worked examples
- **11 learning notes** restored to sidebar navigation (gstack anatomy + superpowers anatomy series)
- Strategy page: "Why Layered Routing?" — design motivation with cost analysis and experiment validation

### Added — Playground

- **Prompt Builder** — role selector (6 roles) × flow selector (5 flows) generates structured system prompt ready to paste into any AI assistant
- **Pentagon radar chart** — 5-dimension scoring rendered as SVG polygon, colored by tier, real-time updates
- **Dimension scoring examples** — each slider has expandable 1/3/5-point examples for calibration
- **Threshold proximity hints** — shows exactly which dimension to adjust to reach a different tier
- **12 presets** covering Tier-Exec / Tier-Mid / Tier-A and borderline cases
- Share URL preserves task + scoring state

### Added — Homepage

- Amber stats bar: 46% cost reduction · 3 model tiers · 5 scoring dimensions
- Experiment results table in README (Mode A vs Mode B, per-task cost + quality)

### Added — Tooling

- **qwen-bridge MCP server** (`D:\qwen-bridge`) — Claude can dispatch tasks directly to Qwen Code via MCP tool, zero window switching

---

## [0.3.4] — 2026-05-04

### Added
- `gstack-plus stats` command — analyzes `./handoffs/` and shows tier distribution as a bar chart with counts and percentages
- `gstack-plus open [index]` command — opens a recent handoff doc in `$EDITOR` (default: most recent; falls back to `notepad` on Windows or `vi` on Unix)

### Fixed
- CI workflow now uses the root `package-lock.json` and runs `npm ci` from the workspace root (was failing because `cli/package-lock.json` does not exist in this npm workspaces monorepo)

### Research
- Completed Mode A vs Mode B cost + quality experiment: routing cut cost **46%** (all-Opus $0.17 → routed $0.09) across 3 representative tasks; Tier-Mid (Sonnet) matched or exceeded Opus quality for implementation tasks → [`experiments/token-comparison/RESULTS.md`](experiments/token-comparison/RESULTS.md)

## [0.3.3] — 2026-05-04

### Added
- Score bars visualization in `classify` output — each of the 5 dimensions rendered as a 10-character bar
- Tier-A trigger dimensions (judgment / risk / creativity ≥ 4) highlighted in magenta + bold
- `examples <name>` detail view now uses score bars instead of raw numbers
- Auto-score (`--auto`) output path also uses score bars

## [0.3.2] — 2026-05-03

### Added
- Bilingual sidebar in documentation site (English section titles via `Section.titleEn`)
- CI workflow `.github/workflows/ci.yml` runs build + test on push and PR
- Bilingual sample outputs in QuickTry component (zh / en)

### Changed
- Nav label "Manual" → "Docs" in English mode
- QuickTry "Read more" link now points to `/doc/getting-started` instead of `/doc/cli`

## [0.3.1] — 2026-05-03

### Added
- `gstack-plus config` command for managing `~/.gstack-plus.json` preferences
- Subcommands: `config set <key> <value>`, `config get <key>`, `config list`, `config reset`
- `classify` reads `lang` and `handoffDir` from config when flags not provided
- `init` reads `lang` from config

## [0.3.0] — 2026-05-03

### Added
- GitHub Pages documentation site with playground at <https://zhewenzhang.github.io/gstack-plus/>
- Language-aware routing — `route(scoring, lang)` returns reason in zh or en
- Bilingual playground page (zh / en toggle persists in localStorage)
- HashRouter URL state encoding for shareable scoring links (`#/playground?t=...&s=...`)

## [0.2.1] — 2026-05-03

### Fixed
- Bilingual handoff template selection
- Minor `history` command output formatting

## [0.2.0] — 2026-05-03

### Added
- `gstack-plus examples [query]` — 5 built-in worked examples (eslint / rename / refactor / auth / borderline)
- `gstack-plus history` — list recent handoff docs in `./handoffs/`
- `gstack-plus init` — set up workspace + create `handoffs/` dir
- `--lang en | zh` global flag for prompts and output
- English handoff template `cli/templates/handoff-en.md`

## [0.1.0] — 2026-05-02

### Added
- Initial release
- `gstack-plus classify <task>` — 5-dimension interactive scoring + routing
- `gstack-plus rules` — print scoring guide and routing rules
- 3-tier model: Tier-A / Tier-Mid / Tier-Exec
- 5 dimensions: judgment, context, risk, verifiability, creativity
- Routing rules: judgment ≥ 4 OR risk ≥ 4 OR creativity ≥ 4 → Tier-A
- Plan-to-exec handoff template generated to `./handoffs/`
- `--scores csv` flag for non-interactive use
- `--auto` flag for Claude Haiku auto-scoring (requires `ANTHROPIC_API_KEY`)

---

[0.5.0]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.5.0
[0.4.0]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.4.0
[0.3.4]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.4
[0.3.3]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.3
[0.3.2]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.2
[0.3.1]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.1
[0.3.0]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.0
[0.2.1]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.2.1
[0.2.0]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.2.0
[0.1.0]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.1.0
