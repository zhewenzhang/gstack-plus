# gstack-plus

> Multi-tier AI workflow orchestration. Add a model dispatch layer on top of role-based skill libraries like gstack and superpowers.

> **Status**: 🚧 Early planning / learning phase. Not ready for use.

---

## 中文簡介

gstack-plus 是 **AI 工作流多層調度框架**。

**核心思想**：在 gstack 的「角色分工」（誰做什麼）基礎上，加入「模型分工」（誰來做這個角色），讓高端模型負責戰略決策，性價比模型負責執行，中等模型負責複雜檢查。

**目標**：在保持質量的前提下，把 AI 工作流的成本降低 60%。

---

## English Intro

gstack-plus is a **multi-tier AI workflow orchestration framework**.

**Core idea**: On top of gstack's role-based skill division (who does what), add a model-tier dispatch layer (who plays each role) so that:

- **Tier-A** (high-end models like Claude Opus) handles strategic decisions
- **Tier-Mid** (mid models like Claude Sonnet) handles complex verification
- **Tier-Exec** (cost-effective models like Qwen) handles execution

**Goal**: Reduce AI workflow cost by 60% while maintaining quality.

---

## 📂 Project Structure

```
gstack-plus/
├── PROJECT_ROADMAP.md         # 完整項目規劃
├── LEARNING_PLAN.md           # Phase 0 深度學習計劃
├── YC_BLINDSPOTS.md           # YC 式盲點清單
├── docs/
│   ├── learning-notes/        # gstack/superpowers 學習筆記
│   ├── case-studies/          # 真實案例（如 Louise）
│   └── tutorials/             # 使用教程
├── classifier/                # 任務分類器
├── router/                    # 模型路由器
├── handoff/templates/         # 移交模板
├── verification/              # 驗證機制
├── experiments/               # 對比實驗
├── examples/                  # 實例代碼
└── blog/                      # 博客文章
```

---

## 🗺️ Roadmap

| Phase | 階段 | 時長 | 狀態 |
|-------|------|------|------|
| 0 | 深度學習 | 1-2 週 | 🚧 進行中 |
| 1 | 基礎框架 | 2 週 | ⏳ 待開始 |
| 2 | 失敗回流 | 2 週 | ⏳ 待開始 |
| 3 | 對比實驗 | 1-2 週 | ⏳ 待開始 |
| 4 | 開源發布 | 2 週 | ⏳ 待開始 |

詳見 [PROJECT_ROADMAP.md](PROJECT_ROADMAP.md)

---

## 🌱 Origins

This project is inspired by:

- [gstack](https://github.com/garrytan/gstack) by Garry Tan — role-based skill library
- [Anthropic Skills (superpowers)](https://github.com/anthropics) — disciplined development practices
- The [Louise project](#) — real-world case study where this methodology was first validated

---

## 📜 License

TBD (likely MIT)

---

## 🤝 Contact

Author: davezhangus@gmail.com
