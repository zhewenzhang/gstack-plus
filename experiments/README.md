# gstack-plus 實驗索引

> 所有量化驗證實驗的導覽。實驗驗證路由方法論的成本效益、品質可靠性和適用邊界。

---

## 快速導覽

| 實驗系列 | 核心問題 | 核心發現 | 完整報告 |
|---------|---------|---------|---------|
| [Series 1](#series-1-原始成本對比) | 路由能否節省成本且維持質量？ | **−46% 成本，Sonnet 品質超越 Opus** | [RESULTS.md](token-comparison/RESULTS.md) |
| [Series 2](#series-2-多維度有效性驗證) | 路由準確嗎？規模化後成本節省多少？ | **100% 路由準確，−27% 成本，質量持平** | [文檔報告](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-2) |
| [Series 3](#series-3-prompt-優化--真實語料庫) | 能否消除 Tier-Mid 質量缺口？ | **S1 策略讓 Sonnet 15.0/15 > Opus 12.7/15** | [文檔報告](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-3) |

---

## Series 1：原始成本對比

**目錄**：`experiments/token-comparison/`

**問題**：對 3 個典型任務，All-Opus 模式 vs gstack-plus 路由模式，成本和質量有何差異？

**方法**：手動運行 3 個任務（Tier-Exec / Tier-Mid / Tier-A），記錄 token 消耗和主觀質量評分（1-5）。

**主要發現**：

| 任務 | 路由 | 成本節省 | 質量 |
|------|------|---------|------|
| 跨專案重命名函數 | Tier-Exec → Qwen | **−99%** | Opus 5/5 · Qwen 3/5 |
| 重構 React Query v5 | Tier-Mid → Sonnet | **−85%** | **Sonnet 5/5 > Opus 4/5** |
| 設計 SSO + MFA | Tier-A → Opus | 持平 | 兩版持平 |
| **合計** | | **−46%** | 質量持平或更優 |

**文件**：`token-comparison/RESULTS.md`，`token-comparison/methodology.md`

---

## Series 2：多維度有效性驗證

**目錄**：`experiments/series-2/`

**問題**：路由系統在更大規模下是否可靠？成本節省能否複製？質量能否客觀驗證？

### Exp-2A：路由穩定性（30 任務 × ±1 擾動分析）

**文件**：`series-2/routing-stability.ts`，`series-2/benchmark-outputs.json`

| 指標 | 結果 |
|------|------|
| 路由準確率 | **100%**（30/30 任務） |
| 穩定性 | **87%**（±1 偏差不改變路由） |
| 最敏感維度 | 判斷強度（±1 影響 32% 路由） |

### Exp-2B：成本基準（9 任務 × 2 模式）

**文件**：`series-2/benchmark.ts`，`series-2/benchmark-outputs.json`

| Tier | Mode A（All-Opus） | Mode B（路由） | 節省 |
|------|------------------|--------------|------|
| Tier-Exec | $0.031/任務 | $0.001/任務 | **−98%** |
| Tier-Mid | $0.038/任務 | $0.006/任務 | −85% |
| Tier-A | $0.066/任務 | $0.066/任務 | 持平 |
| 延遲 Exec | 8,778 ms | 1,708 ms | **−81%** |
| 延遲 Mid | 11,087 ms | 8,860 ms | −20% |

### Exp-2C：LLM-as-Judge 盲評（9 任務）

**文件**：`series-2/llm-judge.ts`，`series-2/judge-results.json`

| 指標 | 結果 |
|------|------|
| Mode A 均分 | 14.1 / 15 |
| Mode B 均分 | 14.1 / 15 |
| 結論 | 路由不降低整體質量 |

**完整報告**：`series-2/SERIES2-REPORT.md`，[線上版](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-2)

---

## Series 3：Prompt 優化 × 真實語料庫

**目錄**：`experiments/series-2/`（exp3a、exp3b 文件）

### Exp-3A：Tier-Mid Prompt 策略對比（4 策略 × 3 任務）

**文件**：`series-2/exp3a-prompt-optimization.ts`，`series-2/exp3a-results.json`

**問題**：4 種 System Prompt 策略，哪種讓 Sonnet 最接近甚至超越 Opus？

| 策略 | Sonnet 均分 | Opus 均分 | 每任務成本 |
|------|------------|----------|-----------|
| S0（無系統提示） | 13.7/15 | 15.0/15 | $0.006 vs $0.045 |
| **S1（角色 + 深度）** | **15.0/15** | **12.7/15** | **$0.006 vs $0.045** |
| S2（結構化輸出） | 13.3/15 | 14.0/15 | $0.007 vs $0.045 |
| S3（思維鏈 + 角色） | 15.0/15 | 14.0/15 | $0.007 vs $0.045 |

**結論**：S1 策略讓 Sonnet 以 86% 更低成本超越 Opus。已整合至 Playground S1 Enhanced 模式。

### Exp-3B：真實語料庫路由驗證（20 任務）

**文件**：`series-2/exp3b-realworld-corpus.ts`，`series-2/exp3b-results.json`，`series-2/exp3b-validation-template.md`

**問題**：演算法路由在真實 git 歷史任務上準確率多少？

| 指標 | 結果 |
|------|------|
| 任務來源 | gstack-plus git 歷史（20 個真實開發任務） |
| 準確率 | **20/20（100%）** |
| 分布 | 45% Exec · 35% Mid · 20% Tier-A |

**完整報告**：[線上版](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-3)

---

## 方法論說明

### LLM-as-Judge

Series 2 Exp-2C 和 Series 3 Exp-3A 均採用 Claude Haiku 作為盲評法官：

- A/B 排列隨機化（防止位置偏差）
- 每個維度 1-5 分（共 5 維度，滿分 15）
- 兩個回應均不標明來自哪個模型

### 局限性

- LLM judge 本身可能對某些 prompt 風格有偏好
- Exp-3B 驗證由 LLM 完成，非獨立人工專家
- 樣本量較小（Exp-3A：3 任務/策略；Exp-3B：20 任務）
