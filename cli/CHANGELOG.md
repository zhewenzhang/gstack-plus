# Changelog

All notable changes to the `gstack-plus` CLI will be documented here.

## [0.3.2] — 2026-05-04

### Fixed (site)
- Nav "Docs" label correctly set in English mode (was "Manual")
- QuickTry "Getting Started" link now points to `/doc/getting-started` (was `/doc/cli`)

### Added (CLI)
- `gstack-plus config` — manage user preferences in `~/.gstack-plus.json`
  - `config` — list all settings
  - `config set lang en` — remember language preference
  - `config set handoffDir <path>` — remember default handoff directory
  - `config get <key>` — read one setting
  - `config reset` — clear all settings
- `classify` and `init` now auto-load saved `lang` and `handoffDir` from config

## [0.3.0] — 2026-05-04

### Added
- `gstack-plus init` — creates `./handoffs/` directory and prints a step-by-step quick-start guide
- GitHub Actions CI — build + test workflow on every push/PR

### Tests
- `route.test.ts`: 4 new tests for bilingual reason output (`lang` parameter)
- `examples-data.test.ts`: new test suite (7 tests) for EXAMPLES array and `findExample()`

### Docs
- New *Getting Started* guide on the documentation site

## [0.2.1] — 2026-05-03

### Fixed
- `--lang en` now affects routing reason output (`Tier-A triggered:` instead of `Tier-A 條件觸發：`)
- `--lang en` now shows English "Next steps" message after classify

### Added
- `gstack-plus history` — list recent handoff docs in `./handoffs/` with date, tier, and task title

## [0.2.0] — 2026-05-03

### Added
- `gstack-plus examples` — list 5 built-in routing examples
- `gstack-plus examples <name>` — show details of one example with score breakdown and link to the full analysis
- `--lang en` / `--lang zh` — switch interactive prompt language (default: zh)

### Notes
- `--lang` only affects the interactive `classify` flow. Other commands and output remain bilingual where applicable.
- Examples are bundled metadata-only; full analyses are served from the docs site.

## [0.1.0] — 2026-05-03

### Added

- `gstack-plus classify <task>` — interactive 5-dimension task scorer with routing decision
- `--scores <csv>` flag — non-interactive scoring via comma-separated values
- `--auto` flag — Claude Haiku-powered automatic scoring (requires `@anthropic-ai/sdk` + `ANTHROPIC_API_KEY`)
- `gstack-plus rules` — prints routing rules in plain text
- Handoff document generator: writes a pre-filled `handoffs/handoff-<id>.md` after each classification
- Routing engine implementing the gstack-plus rules:
  - `judgment≥4 OR risk≥4 OR creativity≥4` → Tier-A
  - `judgment≤2 AND context≤2 AND verifiability≥4` → Tier-Exec
  - else → Tier-Mid

### Notes

This is the initial release. The routing rules and dimension definitions are still being validated
through comparative experiments (see `experiments/`). Treat 0.1.x as experimental.
