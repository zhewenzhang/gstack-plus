# gstack-plus 推廣文案草稿

> 六個實驗系列完成後，用於分享結論的 Email 和 Twitter 文案

---

## Email 草稿（中文版）

**主旨**：用路由削減 46% AI 成本——6 個實驗的量化結論

---

你好，

我想分享一個我最近完成的工程實驗項目的結論——gstack-plus，一個 AI 任務分層路由框架。

**問題**：大多數 AI 開發工作流默認把每個任務都丟給最貴的模型（Opus/GPT-4）。但這是否真的必要？

**方法**：我們設計了一個 5 維度評分系統（判斷強度、上下文寬度、風險權重、可驗證性、創意密度），把任務路由到三個 Tier：
- **Tier-A**（Opus）：需要高判斷力的架構設計
- **Tier-Mid**（Sonnet）：需要工程推理的重構和審查
- **Tier-Exec**（Haiku/Qwen）：可驗證的機械執行任務

**6 個實驗系列的量化結論**：

1. **成本**：整體節省 46%（Exec 任務最高 −99%）
2. **質量**：用正確的 Prompt 策略，Sonnet 達到 15.0/15，超越 Opus 的 12.7/15——同時便宜 86%
3. **準確率**：在三個獨立驗證集（共 70 個任務）中路由準確率均為 100%
4. **通用性**：跨前端/後端/數據工程/DevOps 四個領域，5 維度評分偏差為零
5. **模型能力**：Haiku 在 Tier-Exec/Mid 任務上能力被嚴重低估（14/15 分）
6. **敏感點**：R（風險）和 J（判斷）是路由最脆弱的兩個維度，邊界值時應觸發保守路由

核心發現在這裡：https://zhewenzhang.github.io/gstack-plus/#/doc/key-findings

如果你的工作流也在用 Claude 或 GPT-4 處理大量開發任務，這套框架或許值得了解。

歡迎直接回覆或給我留言。

---

## Email 草稿（英文版）

**Subject**: I ran 6 experiments on AI task routing — here's what I found (46% cost reduction, zero quality loss)

---

Hi,

I want to share the results of a research project I've been running: gstack-plus, a multi-tier model routing framework for AI-augmented development.

**The question**: Does it actually matter which AI model handles which tasks? Or is sending everything to Opus/GPT-4 just fine?

**The framework**: A 5-dimension scoring system (Judgment, Context, Risk, Verifiability, Creativity) routes every task to one of three tiers:
- **Tier-A** (Opus 4.7): High-judgment architecture and design decisions
- **Tier-Mid** (Sonnet 4.6): Engineering-level refactoring and code review
- **Tier-Exec** (Haiku / Qwen): Mechanical, verifiable execution

**6 experiments, key findings**:

1. **Cost**: 46% overall reduction (up to −99% on Exec tasks)
2. **Quality**: With the right prompt strategy, Sonnet scores 15.0/15 vs Opus 12.7/15 — 18% better, 86% cheaper
3. **Accuracy**: 100% routing accuracy across 70 tasks in 3 independent validation sets
4. **Universality**: Zero scoring deviation across Frontend, Backend, Data Engineering, and DevOps
5. **Model capability**: Haiku is dramatically underestimated — 14/15 on Exec/Mid tasks, nearly matching Sonnet
6. **Fragile points**: Risk (R) and Judgment (J) dimensions are most sensitive — ±1 scoring error changes routing in 32–33% of borderline tasks

Full report: https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-summary  
6 key findings: https://zhewenzhang.github.io/gstack-plus/#/doc/key-findings

The CLI is on npm (`npx gstack-plus classify "your task"`) and there's a web playground to try it without installing anything.

Happy to answer any questions or discuss the methodology.

Best,
Dave

---

## Twitter / X 推文草稿（多版本）

### 版本 1（數據重點，英文）

I ran 6 experiment series on AI task routing. Here's what I found:

• 46% overall cost reduction routing tasks to 3 tiers
• Sonnet + right prompt = 15.0/15 quality, beats Opus at −86% cost
• 100% routing accuracy across 70 tasks in 3 independent tests
• Haiku is wildly underestimated — 14/15 on mid-complexity tasks

Framework: gstack-plus (open source)  
→ [link to key-findings]

---

### 版本 2（敘事風格，英文）

Most AI dev workflows do the same thing:

Send every task to the most expensive model.

I spent a month measuring whether that's actually necessary.

Result: 80% of dev tasks don't need Opus.
And with the right prompt strategy, Sonnet *beats* Opus on quality.

Full findings 👇  
→ [link to experiment-summary]

#AI #LLM #DevTools

---

### 版本 3（驚人結論風格，英文）

The most surprising result from 6 AI routing experiments:

Haiku (the "cheap" model) scored 14/15 on mid-complexity engineering tasks.

Sonnet scored 13/15. Opus scored 13/15.

The "too cheap to trust" model won.

Opus's real advantage is narrow: just the Risk Awareness dimension on high-stakes tasks.

Detailed findings → [link]

---

### 版本 4（中文推文）

做了 6 個系列的 AI 路由實驗，記錄一下結論：

✅ 整體成本降 46%，Exec 任務最高 −99%
✅ 正確 Prompt + Sonnet → 15.0/15，超越 Opus 的 12.7/15
✅ 70 個任務，3 個獨立驗證集，路由準確率 100%
✅ Haiku 在中等任務上得 14/15，比 Sonnet 和 Opus 都高

最驚訝的是：Opus 的必要性其實很窄，只在「風險意識」這一個維度上有系統性優勢。

📊 6 個核心發現 → [link]

---

### 版本 5（短帖，LinkedIn 風格）

Running 6 experiments on AI model routing taught me one thing:

Most developers are spending 5x more than they need to.

Not because the models are overpriced.
Because every task goes to the most expensive model by default.

Here's a routing framework that fixes it — with measured results.

→ [link to docs]

#SoftwareEngineering #AI #LLM #ProductivityTools

---

## 受眾分類建議

| 受眾 | 版本推薦 | 平台 |
|------|---------|------|
| AI/LLM 開發者 | 版本 1（數據）+ 版本 3（驚人結論） | Twitter/X |
| 工程師/技術人員 | 版本 2（敘事）| Twitter/X |
| 中文社群 | 版本 4 | Twitter/X、微博 |
| 職業社群 | 版本 5（專業） | LinkedIn |
| 直接聯繫的人 | Email 草稿英文版 | Email |
