<div align="center">

# gstack<sup>+</sup>

**Multi-tier model orchestration for AI-augmented development.**

[![npm](https://img.shields.io/npm/v/gstack-plus?style=flat-square&color=000000&label=npm%20v0.5.0)](https://www.npmjs.com/package/gstack-plus)
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

> **Don't let one model carry everything.** Route every task to the right tier — Opus for judgment, Sonnet for review, Exec for execution. 6 experiment series prove it: **46% cost reduction, zero quality loss, 100% routing accuracy across 70 tasks.**

<div align="center">

### 6 Key Findings — 70 Tasks, 6 Experiment Series

| Finding | Result |
|---------|--------|
| **Cost savings by tier** | Tier-Exec −99% · Tier-Mid −86% · **Overall −46%** |
| **Quality with right prompt** | Sonnet S1 **15.0/15** beats Opus 12.7/15, at **−86% cost** |
| **Routing accuracy** | **100%** across 70 tasks in 3 independent validation sets |
| **Cross-domain universality** | Zero scoring deviation across Frontend / Backend / Data / DevOps |
| **Haiku potential** | Haiku 14/15 on Exec/Mid tasks — Opus necessary only for Risk Awareness |
| **Most sensitive dimensions** | R (Risk) 33% · J (Judgment) 32% — replicated in 2 independent experiments |

→ [**Full experiment report**](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-summary) &nbsp;·&nbsp; [**6 Key Findings**](https://zhewenzhang.github.io/gstack-plus/#/doc/key-findings)

</div>

<details>
<summary><strong>Expand: Series-by-Series Results</strong></summary>

<br/>

**Series 1 — 3-task Cost + Quality Benchmark:**

| Task | Routed To | All-Opus Cost | Routed Cost | Saved | Quality |
|---|---|---|---|---|---|
| Rename function across repo | Tier-Exec → Qwen | $0.01173 | $0.00014 | **−99%** | Opus 5/5 · Qwen 3/5 |
| Refactor to React Query v5 | Tier-Mid → Sonnet | $0.07849 | $0.01191 | **−85%** | Opus 4/5 · **Sonnet 5/5** ✓ |
| Design SSO + MFA auth | Tier-A → Opus | $0.07885 | $0.07885 | — | Both Opus |
| **Total** | | **$0.1691** | **$0.0909** | **−46%** | Quality maintained |

**Series 2 — 9 tasks, 30-task routing validation:**

| Experiment | Result |
|------------|--------|
| Routing accuracy | **100%** (30/30 tasks) |
| Routing stability | **87%** avg (±1 perturbation resistance) |
| Cost saving vs All-Opus | **27%** (balanced mix) — **98%** on Tier-Exec tasks |
| Quality: All-Opus vs Routed | **14.1/15 = 14.1/15** (LLM-as-Judge, blind) |
| Most critical scoring dimension | **Judgment** (±1 changes routing 32% of the time) |

**Series 3 — Prompt optimization + real-world corpus:**

| Experiment | Result |
|------------|--------|
| Best Sonnet strategy (S1) | **15.0/15** vs Opus 12.7/15 — Sonnet **wins** with right prompt |
| Cost of S1 strategy | **$0.006/task** vs Opus $0.045 — **86% cheaper, better quality** |
| Real-world routing accuracy | **100%** (20/20 tasks from actual git history) |
| Corpus distribution | 45% Exec · 35% Mid · 20% Tier-A |

**Series 4 — Domain applicability (20 tasks × 4 domains):**

| Domain | Tasks | Routing Accuracy | Score Deviation |
|--------|-------|-----------------|----------------|
| Frontend | 5 | **100%** | Δ = 0.00 |
| Backend | 5 | **100%** | Δ = 0.00 |
| Data Engineering | 5 | **100%** | Δ = 0.00 |
| DevOps | 5 | **100%** | Δ = 0.00 |

**Series 5 — Multi-model quality matrix (3 tasks × 3 models):**

| Task Tier | Haiku 4.5 | Sonnet 4.6 | Opus 4.7 | Winner |
|-----------|-----------|------------|----------|--------|
| Tier-Exec | 14/15 | 15/15 | 15/15 | Haiku sufficient |
| Tier-Mid | **14/15** | 13/15 | 13/15 | Haiku wins |
| Tier-A | 10/15 | 12/15 | 12/15 | Opus/Sonnet needed |

**Series 6 — Scoring dimension sensitivity (10 boundary tasks × ±1 perturbation):**

| Dimension | Sensitivity | Routing Changes | Recommendation |
|-----------|-------------|-----------------|----------------|
| R (Risk Weight) | **33%** | 6/18 | Conservative routing when R = 3 |
| J (Judgment) | **32%** | 6/19 | Conservative routing when J = 3 |
| C (Context) | 16% | 3/19 | Moderate care at C = 2/3 boundary |
| Cr (Creativity) | 13% | 2/15 | Moderate care at Cr = 3/4 boundary |
| V (Verifiability) | 11% | 2/18 | Most stable — grade leniently |

</details>

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
gstack-plus --version    # 0.5.0
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
| v0.4.0 — Playground, Pentagon chart, Prompt Builder, 12 presets, bilingual docs | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.4.0) |
| Experiment Series 2 — routing stability, cost benchmark, LLM-as-Judge (9 tasks) | ✅ [Report](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-2) |
| Experiment Series 3 — S1 prompt strategy (Sonnet beats Opus), real-world corpus | ✅ [Report](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-3) |
| v0.5.0 — S1 Enhanced in Prompt Builder, boundary warnings, dark mode | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.5.0) |
| Experiment Series 4 — domain applicability test (20 tasks × 4 domains, 100%) | ✅ [Report](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-4) |
| Experiment Series 5 — multi-model quality matrix (Haiku/Sonnet/Opus × 3 tasks) | ✅ [Report](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-5) |
| Experiment Series 6 — scoring dimension sensitivity (R 33%, J 32%) | ✅ [Report](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-6) |
| 6 Key Findings + Full Experiment Summary Report | ✅ [Read](https://zhewenzhang.github.io/gstack-plus/#/doc/key-findings) |

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
