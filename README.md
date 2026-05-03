<div align="center">

# gstack<sup>+</sup>

**Multi-tier model orchestration for AI-augmented development.**

Route every task to the right model: Tier-A for judgment, Tier-Mid for review, Tier-Exec for execution.

[![Docs](https://img.shields.io/badge/docs-online-000000?style=flat-square)](https://zhewenzhang.github.io/gstack-plus/)
[![License](https://img.shields.io/badge/license-MIT-000000?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/status-experimental-6F6F6F?style=flat-square)]()

[**📖 Read the docs →**](https://zhewenzhang.github.io/gstack-plus/) &nbsp;·&nbsp;
[**🗺 Roadmap**](./PROJECT_ROADMAP.md) &nbsp;·&nbsp;
[**🧪 Experiments**](./experiments/)

</div>

---

## What is this

Most AI workflows today route every task to a single model. But not every task needs Opus-level judgment, and not every task can be safely handed to a cheap executor.

**gstack-plus** adds a routing layer on top of role-based skill libraries (like [gstack](https://github.com/your-org/gstack) and [superpowers](https://github.com/obra/superpowers)). It classifies each task across 5 dimensions, then dispatches it to the right tier:

| Tier | Model class | Job |
|------|-------------|-----|
| **Tier-A** | Opus / GPT-5 / Gemini Ultra | Architecture, judgment-heavy, high-risk decisions |
| **Tier-Mid** | Sonnet / GPT-4.1 | Review, verification, integration |
| **Tier-Exec** | Qwen / DeepSeek / Haiku | Execution within a defined scope |

The result: better decisions on the hard parts, cheaper execution on the easy parts, and a paper trail of *why each task got the model it got*.

## Why it exists

Single-model workflows fail in two predictable ways:

1. **Over-spending** — using Opus for `git rebase --autosquash` is wasteful.
2. **Under-thinking** — using Haiku to design an auth migration is dangerous.

A 5-dimension classifier (judgment / context / risk / verifiability / creativity) plus a *conservative routing* default ("when in doubt, route up") makes both failure modes much rarer.

## Architecture in 30 seconds

```
                        ┌────────────────┐
   New task  ─────────► │   Classifier   │  ── 5-dim scoring
                        └───────┬────────┘
                                ▼
                  ┌──────────────────────────┐
                  │     Routing rules        │
                  │  judg≥4 ∨ risk≥4 → A     │
                  │  judg≤2 ∧ verif≥4 → Exec │
                  │  else → Mid              │
                  └──────────┬───────────────┘
                             ▼
        ┌────────────┬───────┴──────┬────────────┐
        ▼            ▼              ▼            ▼
     Tier-A      Tier-Mid       Tier-Exec    (handoff
   (judgment)   (review)       (execution)   templates
                                              between
                                              tiers)
```

[**Read the full architecture doc →**](https://zhewenzhang.github.io/gstack-plus/#/doc/architecture)

## Documentation

The full handbook is hosted at **https://zhewenzhang.github.io/gstack-plus/**.

| 區段 | 內容 |
|---|---|
| [概覽](https://zhewenzhang.github.io/gstack-plus/#/doc/roadmap) | 路線圖、核心洞察、學習計劃 |
| [學習筆記](https://zhewenzhang.github.io/gstack-plus/#/doc/gstack-overview) | gstack & superpowers 解剖、對比 |
| [開發手冊](https://zhewenzhang.github.io/gstack-plus/#/doc/architecture) | 架構、分類器、交接模板、失敗恢復、整合 |
| [實驗記錄](https://zhewenzhang.github.io/gstack-plus/#/doc/experiments-readme) | 三層 vs 單模型對照實驗 |
| [戰略思考](https://zhewenzhang.github.io/gstack-plus/#/doc/yc-blindspots) | YC 風格盲點清單與商業化思考 |

## Try it: the CLI

```bash
npx gstack-plus classify "Refactor the auth middleware to support OAuth"
```

You'll be walked through 5 questions (judgment / context / risk / verifiability / creativity, each 1–5), then get a routing decision and a pre-filled handoff doc.

```bash
gstack-plus classify "Rename getCwd → getCurrentWorkingDirectory" --scores 1,1,1,5,1
# → Tier-Exec  (verifiable, low-risk, narrow context)

gstack-plus classify "Design new auth flow for SSO + MFA" --scores 5,4,5,2,4
# → Tier-A  (judgment + risk + creativity all trigger)
```

See [`cli/README.md`](./cli/README.md) for full usage.

## Project status

This is an **experimental research project**, not a production library yet.

- ✅ Phase 0: Learning notes — done
- ✅ Phase 1: Handoff templates + classifier — done
- ✅ Phase 2: Failure recovery — done
- 🚧 Phase 3: Comparative experiments — in progress
- ⏭ Phase 4: Open-source release — preparing

See [`PROJECT_ROADMAP.md`](./PROJECT_ROADMAP.md) for the full plan.

## Repository layout

```
classifier/      Task scoring + routing rules
handoff/         Plan→Exec / Exec→Check / Check→Plan templates
verification/    Pre-flight checklist + failure catalog + routing
experiments/     Comparative experiment specs and results
docs/            Architecture + integration guides + learning notes
site/            The documentation website (React + Vite + Tailwind)
```

## Contributing

This project is in heavy iteration; PRs that touch the framework itself are best filed as discussion issues first. Documentation fixes (typos, clarifications) are very welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
