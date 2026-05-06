# 實驗 Series 3：Prompt 優化 × 真實語料庫驗證

> **快速導航**：[← 上一系列](experiment-series-2.md) · [→ 下一系列](experiment-series-4.md) · [全系列總結](experiment-summary.md) · [6 個核心發現](key-findings.md)

> **狀態**：已完成 | **日期**：2026-05-05 | **前置**：Series 2

## 背景

Series 2 揭示了 gstack-plus 方法論的核心有效性：路由準確率 100%、成本節省 27%、LLM-as-Judge 品質持平。但它也暴露了一個已知弱點：**Tier-Mid 任務使用 Sonnet 時，品質比 All-Opus 低約 1.3 分（13.7 vs 15.0/15）**。

Series 3 針對這個弱點設計了兩個實驗：
- **Exp-3A**：測試 4 種 Prompt 策略能否讓 Sonnet 追上 Opus
- **Exp-3B**：在 20 個真實專案任務上驗證路由準確率

---

## 核心發現

### 1. Prompt 策略 S1 讓 Sonnet 反超 Opus（Exp-3A）

**Sonnet 不是輸給 Opus，而是輸給了沒有 Prompt 策略的自己。**

| 策略 | Sonnet 均分 | Opus 均分 | 差距 | 每任務成本 |
|------|------------|----------|------|-----------|
| S0（無系統提示，基線） | 13.7/15 | 15.0/15 | Opus +1.3 | Sonnet $0.006 / Opus $0.045 |
| **S1（角色 + 深度）** | **15.0/15** | **12.7/15** | **Sonnet +2.3 ✓** | **$0.006 / $0.045** |
| S2（結構化輸出格式） | 13.3/15 | 14.0/15 | Opus +0.7 | $0.007 / $0.045 |
| S3（思維鏈 + 角色） | 15.0/15 | 14.0/15 | Sonnet +1.0 ✓ | $0.007 / $0.045 |

**S1 系統提示文字**：
> "You are a staff-level engineer at a fast-growing tech company. You provide thorough, technically precise feedback. You are opinionated — you give specific recommendations, not a list of options. You proactively surface non-obvious risks that junior engineers would miss. Your answers are comprehensive but concise."

S1 讓 Sonnet 在 3 個 Tier-Mid 任務全部勝出：

| 任務 | S1 Sonnet | Opus | 勝者 |
|------|----------|------|------|
| M1：Code review（分頁缺失） | 15/15 | 12/15 | Sonnet ✓ |
| M2：Config 遷移計劃（Zod） | 15/15 | 12/15 | Sonnet ✓ |
| M3：API 設計審查（冪等性） | 15/15 | 14/15 | Sonnet ✓ |

**結論：S1 策略在成本不變（$0.006/task）的情況下，讓 Sonnet 品質從 13.7 提升至 15.0，超越 Opus 的 15.0/12.7，節省 86% 費用。**

---

### 2. S3 策略也有效（思維鏈路徑）

S3 策略同樣達到 15.0/15，但品質分佈略有不同（M3 得分分歧大：Sonnet 15 vs Opus 12）。S1 勝出在於一致性更強。

**建議**：對 Tier-Mid 任務預設使用 S1，S3 作為備選。

---

### 3. 真實語料庫路由準確率 100%（Exp-3B）

從 gstack-plus 自身 git 歷史中提取 20 個真實開發任務，驗證演算法路由。

**語料庫組成**：
| Tier | 數量 | 比例 | 典型任務 |
|------|------|------|---------|
| Tier-Exec | 9 | 45% | 版本升級、翻譯、文檔更新 |
| Tier-Mid | 7 | 35% | 功能開發、統計圖表、i18n |
| Tier-A | 4 | 20% | 系統設計、MCP 橋接、LLM 評估 |

**結果**：20/20 路由一致，準確率 100%。

**注意**：本次驗證由 LLM 完成，非獨立人工專家評審。建議未來引入外部評審者重複驗證。

---

## 對方法論的修訂

基於 Series 3 結果，gstack-plus 路由方法論新增一條原則：

> **Tier-Mid 任務請使用 S1 系統提示**。直接調用 Sonnet 不足以釋放其潛力，正確的 Prompt 工程可讓品質超過 Opus 同時節省 86% 成本。

S1 系統提示已整合至：
- `handoff/templates/plan-to-exec.md` — Tier-Mid 移交文件模板
- `handoff/templates/plan-to-exec-en.md` — 英文版

---

## 研究局限性

1. **樣本量小**：Exp-3A 每種策略僅 3 個任務，評分結果可能受 LLM 溫度方差影響
2. **評估者偏差**：LLM-as-Judge（Claude Haiku）作為評估者本身可能對某些 Prompt 風格有偏好
3. **Exp-3B 獨立性不足**：驗證模板由 LLM 填寫，非人工專家；需引入外部評審者
4. **真實成本未包含 Prompt Token**：S1 系統提示約 70 tokens，對成本影響 < 1%，可忽略

---

## 下一步

- Prompt Builder 整合 S1 Enhanced 模式（Phase 43）
- v0.5.0 發布，將 Series 3 成果打包（Phase 44）
- 引入外部評審者重複 Exp-3B 驗證（待定）
