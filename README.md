<div align="center">

# gstack<sup>+</sup>

**Multi-tier model orchestration for AI-augmented development.**

[![npm](https://img.shields.io/npm/v/gstack-plus?style=flat-square&color=000000&label=npm)](https://www.npmjs.com/package/gstack-plus)
[![Docs](https://img.shields.io/badge/docs-online-000000?style=flat-square)](https://zhewenzhang.github.io/gstack-plus/)
[![Playground](https://img.shields.io/badge/playground-try%20it%20live-6F6F6F?style=flat-square)](https://zhewenzhang.github.io/gstack-plus/#/playground)
[![License](https://img.shields.io/badge/license-MIT-000000?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/status-active-10b981?style=flat-square)]()

[**🎮 Try Playground**](https://zhewenzhang.github.io/gstack-plus/#/playground) &nbsp;·&nbsp;
[**📖 Read Docs**](https://zhewenzhang.github.io/gstack-plus/) &nbsp;·&nbsp;
[**🚀 Install CLI**](#try-it-the-cli)

</div>

<br/>

> **Don't let one model carry everything.** Route every task to the right tier — Opus for judgment, Sonnet for review, Exec for execution. Better decisions, lower spend.

---

## The Problem

Every AI workflow today makes the same mistake: **sending every task to the same model.**

| What happens | The cost |
|---|---|
| 🔴 **Over-spending** — Opus on `git rebase` | Wasted tokens, slower feedback |
| 🔴 **Under-thinking** — Haiku designing auth migration | Dangerous decisions, rework |

## The Solution

**gstack-plus** adds a routing layer on top of role-based skill libraries ([gstack](https://github.com/your-org/gstack), [superpowers](https://github.com/obra/superpowers)). Every task gets scored across **5 dimensions**, then dispatched to the right tier:

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
# → Tier-Exec  ✅

gstack-plus classify "Design SSO + MFA" --scores 5,4,5,2,4
# → Tier-A  🟣

# English prompts:
gstack-plus --lang en classify "Your task"

# Browse 5 built-in examples:
gstack-plus examples

# Review recent handoffs:
gstack-plus history
```

### Install

```bash
npm install -g gstack-plus
gstack-plus --version    # 0.2.1
```

---

## Documentation

Full handbook: **[https://zhewenzhang.github.io/gstack-plus/](https://zhewenzhang.github.io/gstack-plus/)**

| Section | What's inside |
|---|---|
| [🗺 Roadmap](https://zhewenzhang.github.io/gstack-plus/#/doc/roadmap) | Project phases and timeline |
| [🏗 Architecture](https://zhewenzhang.github.io/gstack-plus/#/doc/architecture) | 3-tier model design, boundaries, cost tradeoffs |
| [📊 Classifier](https://zhewenzhang.github.io/gstack-plus/#/doc/scoring-guide) | 5-dimension scoring guide + routing rules |
| [📋 Handoff Templates](https://zhewenzhang.github.io/gstack-plus/#/doc/plan-to-exec) | Plan→Exec, Exec→Check, Check→Plan formats |
| [🔧 Failure Recovery](https://zhewenzhang.github.io/gstack-plus/#/doc/failure-catalog) | Pre-flight checklist + failure routing tree |
| [🧪 Experiments](https://zhewenzhang.github.io/gstack-plus/#/doc/experiments-readme) | 3-mode × 3-task comparative study |
| [💡 Strategy](https://zhewenzhang.github.io/gstack-plus/#/doc/yc-blindspots) | YC-style blindspot analysis |

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
| Mode A/B comparative experiments | 🚧 In progress |

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
