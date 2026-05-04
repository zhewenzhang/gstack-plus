# Changelog

All notable changes to **gstack-plus** are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [0.3.4] — 2026-05-04

### Added
- `gstack-plus stats` command — analyzes `./handoffs/` and shows tier distribution as a bar chart with counts and percentages
- `gstack-plus open [index]` command — opens a recent handoff doc in `$EDITOR` (default: most recent; falls back to `notepad` on Windows or `vi` on Unix)

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

[0.3.4]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.4
[0.3.3]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.3
[0.3.2]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.2
[0.3.1]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.1
[0.3.0]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.0
[0.2.1]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.2.1
[0.2.0]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.2.0
[0.1.0]: https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.1.0
