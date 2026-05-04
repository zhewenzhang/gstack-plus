<div align="center">

# gstack<sup>+</sup>

**Multi-tier model orchestration for AI-augmented development.**

[![npm](https://img.shields.io/npm/v/gstack-plus?style=flat-square&color=000000&label=npm)](https://www.npmjs.com/package/gstack-plus)
[![Docs](https://img.shields.io/badge/docs-online-000000?style=flat-square)](https://zhewenzhang.github.io/gstack-plus/)
[![Playground](https://img.shields.io/badge/playground-try%20it%20live-6F6F6F?style=flat-square)](https://zhewenzhang.github.io/gstack-plus/#/playground)
[![License](https://img.shields.io/badge/license-MIT-000000?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/status-active-10b981?style=flat-square)]()

[**English**](#) &nbsp;·&nbsp; [**中文**](./README.zh.md)

[**🎮 Try Playground**](https://zhewenzhang.github.io/gstack-plus/#/playground) &nbsp;·&nbsp;
[**📖 Read Docs**](https://zhewenzhang.github.io/gstack-plus/) &nbsp;·&nbsp;
[**🚀 Install CLI**](#try-it-the-cli)

</div>

<br/>

> **Don't let one model carry everything.** Route every task to the right tier — Opus for judgment, Sonnet for review, Exec for execution. Better decisions, lower spend.

<div align="center">

### Measured Results: 3-task Cost + Quality Benchmark

| Task | Routed To | All-Opus Cost | Routed Cost | Saved | Quality |
|---|---|---|---|---|---|
| Rename function across repo | Tier-Exec → Qwen | $0.01173 | $0.00014 | **−99%** | Opus 5/5 · Qwen 3/5 |
| Refactor to React Query v5 | Tier-Mid → Sonnet | $0.07849 | $0.01191 | **−85%** | Opus 4/5 · **Sonnet 5/5** ✓ |
| Design SSO + MFA auth | Tier-A → Opus | $0.07885 | $0.07885 | — | Both Opus |
| **Total** | | **$0.1691** | **$0.0909** | **−46%** | Quality maintained |

*Sonnet beat Opus on quality at 85% lower cost for mid-complexity tasks. → [Full report](experiments/token-comparison/RESULTS.md)*

</div>

---

## The Problem

Every AI workflow today makes the same mistake: **sending every task to the same model.**

| What happens | The cost |
|---|---|
| 🔴 **Over-spending** — Opus on `git rebase` | Wasted tokens, slower feedback |
| 🔴 **Under-thinking** — Haiku designing auth migration | Dangerous decisions, rework |

## The Solution

**gstack-plus** adds a routing layer on top of role-based skill libraries (gstack, [superpowers](https://github.com/obra/superpowers)). Every task gets scored across **5 dimensions**, then dispatched to the right tier.

In a 3-task cost + quality experiment: **routing cut cost 46%** while Tier-Mid (Sonnet) matched or exceeded Opus on output quality. → [See experiment results](experiments/token-comparison/RESULTS.md)

<div align="center">

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tier&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Model&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Job | When |
|---|---|---|---|
| **🟣 Tier-A** | Opus / GPT-5 | Judgment & architecture | Risk ≥ 4 OR Creativity ≥ 4 |
| **🔵 Tier-Mid** | Sonnet / GPT-4.1 | Review & verification | Everything in between |
| **🟢 Tier-Exec** | Qwen / DeepSeek | Scoped execution | Verifiable AND low-risk |

</div>

## How It Works

```
  Your task
      │
      ▼
 ┌─────────────┐
 │  Classifier  │  5-dimension scoring
 └──────┬──────┘
        ▼
 ┌──────────────┐
 │ Routing Rules │  judgment≥4 OR risk≥4 → Tier-A
 └──────┬───────┘  verifiable AND low-risk → Tier-Exec
        ▼           else → Tier-Mid
 ┌──────┴──────┬──────────┐
 ▼             ▼          ▼
Tier-A      Tier-Mid   Tier-Exec
(judgment)  (review)   (execution)
```

### The 5 Dimensions

| Dimension | What it measures |
|---|---|
| **Judgment** | How much human-level decision-making? |
| **Context** | How much codebase knowledge is needed? |
| **Risk** | What's the cost of getting it wrong? |
| **Verifiability** | Can success be auto-verified? |
| **Creativity** | How much novel design is required? |

---

## Try It: The CLI

No install needed — `npx` picks up the latest version:

```bash
npx gstack-plus classify "Refactor the auth middleware to support OAuth"
```

Walks you through 5 questions → routing decision → pre-filled handoff doc.

### Quick Start

```bash
# Skip prompts — pass scores directly:
gstack-plus classify "Rename getCwd" --scores 1,1,1,5,1
gstack-plus classify "Design SSO + MFA" --scores 5,4,5,2,4

# English prompts:
gstack-plus --lang en classify "Your task"

# Browse 5 built-in examples:
gstack-plus examples

# Review recent handoffs:
gstack-plus history
```

### Output Preview

```text
$ gstack-plus --lang en classify "Design SSO + MFA" --scores 5,4,5,2,4

────────────────────────────────────────────────
  Judgment    ██████████  5
  Context     ████████░░  4
  Risk        ██████████  5
  Verif.      ████░░░░░░  2
  Creativity  ████████░░  4

Routing decision: Tier-A
Reason: Tier-A triggered: judgment=5 >= 4, risk=5 >= 4, creativity=4 >= 4

✓ Handoff doc written → handoffs/handoff-2026-05-04-x7k2.md
```

> Bars for dimensions that triggered Tier-A (judgment / risk / creativity ≥ 4) are highlighted in **magenta** in your terminal.

### Install

```bash
npm install -g gstack-plus
gstack-plus --version    # 0.3.4
```

---

## Documentation

Full handbook: **[https://zhewenzhang.github.io/gstack-plus/](https://zhewenzhang.github.io/gstack-plus/)**

| Section | What's inside |
|---|---|
| [🚀 Get Started](https://zhewenzhang.github.io/gstack-plus/#/doc/getting-started) | Install CLI, first routing decision in 5 min |
| [🏗 The Framework](https://zhewenzhang.github.io/gstack-plus/#/doc/architecture) | 3-tier design, boundaries, cost tradeoffs |
| [📊 Classify & Route](https://zhewenzhang.github.io/gstack-plus/#/doc/scoring-guide) | 5-dimension scoring guide + routing rules |
| [📋 Handoff & Guardrails](https://zhewenzhang.github.io/gstack-plus/#/doc/plan-to-exec) | Plan→Exec, Exec→Check, pre-flight checklist |
| [💡 Examples](https://zhewenzhang.github.io/gstack-plus/#/doc/ex-tier-exec-eslint) | 5 fully scored real-world tasks |

---

## Project Status

**Active research project.** Published and maintained.

| Milestone | Status |
|---|---|
| Framework docs (classifier, templates, recovery) | ✅ Complete |
| CLI v0.1.0 (`classify`, `rules`, `--auto`) | ✅ [npm](https://www.npmjs.com/package/gstack-plus) |
| Documentation site + Web Playground | ✅ [Live](https://zhewenzhang.github.io/gstack-plus/) |
| i18n — 中/EN toggle | ✅ Complete |
| CLI v0.2.0 (`examples`, `--lang`) | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.2.0) |
| CLI v0.2.1 (bilingual fix, `history`) | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.2.1) |
| CLI v0.3.0 (lang-aware routing, docs site) | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.0) |
| CLI v0.3.1 (`config` command) | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.1) |
| CLI v0.3.2 (bilingual sidebar, CI workflow) | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.2) |
| CLI v0.3.3 (score bars visualization) | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.3) |
| CLI v0.3.4 (`stats`, `open` commands) | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.4) |
| Mode A/B routing experiment (cost + quality) | ✅ [Results](experiments/token-comparison/RESULTS.md) |
| Mode A/B comparative experiments (full scale) | 🚧 Planned |

---

## Repository Layout

```
classifier/      5-dimension scoring + routing rules
handoff/         Plan→Exec / Exec→Check / Check→Plan templates
verification/    Pre-flight checklist + failure catalog
experiments/     Comparative experiment specs
docs/            Architecture + learning notes
cli/             npm package source
site/            Documentation website (React + Vite)
```

## Contributing

Documentation fixes (typos, clarifications) are welcome — [CONTRIBUTING.md](./CONTRIBUTING.md). For framework changes, please open a discussion first.

## License

MIT — see [LICENSE](./LICENSE).
