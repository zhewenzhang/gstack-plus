# 🚀 gstack-plus 完整項目規劃

> **項目願景**：在 gstack 的「角色分工」基礎上，加入「模型分工」維度，構建多 Tier 模型協作的 AI 工作流框架。
>
> **創建日期**：2026-05-02
> **作者**：davezhangus@gmail.com
> **狀態**：規劃階段

---

## 📌 核心決策摘要

| 議題 | 決定 | 影響 |
|------|------|------|
| **三層模型** | Tier-A（高端）+ Tier-Mid（中等）+ Tier-Exec（性價比）；無中等模型時降級到 Tier-A 處理複雜檢查 | 路由器需要識別「簡單檢查 vs 複雜檢查」 |
| **失敗回流** | 引入 superpowers 的「想清楚再做」精神，減少 token 消耗 | 規劃階段加入更多驗證，執行前 ROI 分析 |
| **項目雄心** | 完整改造 gstack，深度理解後增強 | 需要先深度學習 gstack，再構建 |
| **開源計劃** | 發布到 GitHub，文檔教程都要寫 | 整個項目按開源最佳實踐 |

---

## 🎯 核心成果定義

**最終交付物：**
1. **`gstack-plus`** GitHub 開源項目（MIT License）
2. **方法論博客文章**（中英文版）
3. **使用教程**（含 Louise 真實案例）
4. **對比實驗數據**（證明方法論有效）

---

## 📚 Phase 0：深度學習階段（1-2 週）

> 在動手寫之前，先吃透 gstack 和 superpowers。
> **這是最重要的階段，不能跳過。**

### Task 0.1 — gstack 源碼研讀

**目標**：理解 gstack 的「精神層面和邏輯層面」

- [ ] 通讀 `~/.claude/skills/gstack/` 所有 SKILL.md
- [ ] 重點研究：
  - `office-hours/SKILL.md` — 怎麼引導用戶思考
  - `autoplan/SKILL.md` — 怎麼編排多個 review
  - `review/SKILL.md` — 怎麼設置質量門檻
  - `ship/SKILL.md` — 怎麼做最終把關
  - `investigate/SKILL.md` — 怎麼有紀律地找 bug
- [ ] 寫學習筆記：`docs/learning-notes/gstack-anatomy.md`
  - gstack 的設計哲學（Boil the Lake）
  - skill 之間如何協作
  - 為什麼這個結構有效
  - Brain Sync 跨會話記憶機制

**確認節點**：你能用 5 句話解釋 gstack 的核心設計理念。

---

### Task 0.2 — superpowers 源碼研讀

**目標**：理解 TDD、systematic-debugging 等 skill 的核心思想

- [ ] 通讀 superpowers 重點 skill：
  - `brainstorming` — 怎麼引導需求探索
  - `writing-plans` — 怎麼寫可執行的計劃
  - `executing-plans` — 怎麼按計劃執行
  - `verification-before-completion` — 怎麼驗證再聲明完成
  - `systematic-debugging` — 怎麼有紀律地調試
  - `subagent-driven-development` — 並行任務分發
- [ ] 寫學習筆記：`docs/learning-notes/superpowers-anatomy.md`
- [ ] 提煉「失敗減少」的核心原則 3-5 條

**確認節點**：你能解釋為什麼 superpowers 設計成「強制 invoke」風格。

---

### Task 0.3 — 對比基線實驗

**目標**：建立「對比實驗」的基線數據

- [ ] 用 **單一 Claude** 模式重做一遍 Louise v2 的優化（不用 Qwen）
- [ ] 記錄：
  - Token 消耗總量
  - 時間消耗
  - 出錯次數和回流次數
  - 最終代碼質量（用 `/review` 評分）
- [ ] 對比現在的「Claude 規劃 + Qwen 執行」模式
- [ ] 產出：`experiments/baseline-vs-hybrid.md`

**確認節點**：你有真實數據證明（或證偽）方法論的價值。

---

## 🏗️ Phase 1：基礎框架構建（2 週）

### Task 1.1 — 三層模型系統設計

**目標**：定義 Tier 體系和路由規則

```
Tier-A: 戰略決策層
├── 模型：Claude Opus, GPT-5
├── 適用：架構、安全、創意設計
└── 成本：$$$

Tier-Mid: 複雜檢查層
├── 模型：Claude Sonnet, GPT-4o
├── 適用：代碼審查、複雜驗證、邏輯校對
└── 成本：$$

Tier-Exec: 執行層
├── 模型：Qwen Code, DeepSeek
├── 適用：代碼修改、模式應用、文檔生成
└── 成本：$
```

**簡單檢查 vs 複雜檢查**

```
簡單檢查（Tier-Exec 或自動化）：
├── npm run build 通過
├── 字符串匹配
├── 文件是否存在
└── 行數/格式檢查

複雜檢查（Tier-Mid，無則 Tier-A）：
├── 代碼邏輯正確性
├── 邊界條件覆蓋
├── 安全漏洞識別
├── 設計一致性
└── 用戶體驗判斷
```

**確認節點**：路由表能對 Louise 11 個任務做出合理分配。

---

### Task 1.2 — 任務分類器實現

**目標**：5 維度評分系統

| 維度 | 1 分 | 5 分 |
|------|------|------|
| **判斷強度** | 機械重複 | 深度推理 |
| **上下文寬度** | 單文件 | 整個系統 |
| **風險權重** | 純風格 | 安全/數據 |
| **可驗證性** | 主觀 | 客觀（build pass / fail） |
| **創意密度** | 套模板 | 開放式設計 |

**路由規則：**
```
判斷 ≥ 4 OR 風險 ≥ 4 OR 創意 ≥ 4 → Tier-A
判斷 ≤ 2 AND 上下文 ≤ 2 AND 可驗證 ≥ 4 → Tier-Exec
其他 → Tier-Mid（或 Tier-A 兜底）
```

**確認節點**：分類器對 20 個歷史任務的分類，與用戶判斷一致率 ≥ 80%。

---

### Task 1.3 — Prompt 移交模板系統

**目標**：標準化 Tier 之間的信息傳遞

```
handoff/templates/
├── plan-to-exec.md           # Tier-A → Tier-Exec
├── exec-to-check.md          # Tier-Exec → Tier-Mid
├── check-to-plan.md          # Tier-Mid → Tier-A（失敗回流）
└── shared/
    ├── phase-template.md
    ├── verification-template.md
    └── failure-report.md
```

**確認節點**：用模板重新生成 Louise v2 Prompt，質量不低於手寫版。

---

## 🔄 Phase 2：失敗回流機制（2 週）

### Task 2.1 — 預檢清單

**目標**：規劃完成後、移交執行前，做最後審查

**移交前必須確認：**
- ☐ 任務描述足夠具體（包含文件路徑、行號）
- ☐ 預期結果可驗證（有明確的成功標準）
- ☐ 邊界條件已考慮（NaN、空值、錯誤輸入）
- ☐ 依賴關係清晰（哪些 Phase 必須先完成）
- ☐ 回滾方案存在
- ☐ Tier 分配合理

借鑒 superpowers 的 `verification-before-completion`，但用在「規劃完成」這一步。

---

### Task 2.2 — 智能失敗回流

**設計：**

```
Tier-Exec 執行失敗
    ↓
失敗類型分類：
├── 構建錯誤 → Tier-Exec 自我修復（讀錯誤信息重試，最多 2 次）
├── 邏輯錯誤 → Tier-Mid 介入（分析根因）
├── 設計問題 → Tier-A 介入（重新規劃）
└── 範圍偏移 → Tier-A 介入（重新分解）
```

**減少 token 消耗的關鍵：**
- 不是所有失敗都需要 Tier-A
- Tier-Exec 自己能修的小問題，給它重試機會
- Tier-Mid 處理中等複雜度問題
- 只有真正涉及判斷的問題才升級到 Tier-A

**確認節點**：模擬 5 種失敗場景，路由邏輯正確處理 ≥ 4 種。

---

### Task 2.3 — superpowers 集成

**集成點：**
- 規劃階段強制 invoke `superpowers:writing-plans`
- 執行階段建議 `superpowers:executing-plans`
- 完成前強制 invoke `superpowers:verification-before-completion`
- 收到反饋時用 `superpowers:receiving-code-review` 處理

**確認節點**：完整跑通一個項目，所有節點都有 superpowers 介入。

---

## 🧪 Phase 3：對比實驗階段（1-2 週）

### Task 3.1 — 設計實驗矩陣

**3 種模式 × 3 類任務 = 9 個對照組**

|  | 簡單任務 | 中等任務 | 複雜任務 |
|--|---------|---------|---------|
| **單 Claude** | A1 | A2 | A3 |
| **Claude + Qwen（手動）** | B1 | B2 | B3 |
| **gstack-plus（自動）** | C1 | C2 | C3 |

**測量指標：**
- Token 消耗（總量、Tier-A vs Tier-Exec 占比）
- 時間消耗
- 錯誤次數（執行錯、回流次數）
- 最終代碼質量（用 `/review` 評分）
- 用戶介入次數

---

### Task 3.2 — 執行實驗

**任務候選：**
1. **簡單**：給項目加 ESLint 規則（Tier-Exec 為主）
2. **中等**：重構某模塊以支持新功能（多 Tier 協作）
3. **複雜**：設計並實現用戶認證系統（Tier-A 主導）

每個任務在 3 種模式下各跑一次。

---

### Task 3.3 — 數據分析和報告

`experiments/results-report.md` 包含：
- 數據表格
- 圖表（token、時間、錯誤率對比）
- 結論：什麼場景下方法論最有效
- 反例：什麼場景下單模型反而更好

**確認節點**：有清晰的數據圖表，可以直接放進博客文章。

---

## 📦 Phase 4：開源發布準備（2 週）

### Task 4.1 — 文檔體系

```
gstack-plus/
├── README.md                  # 中英雙語
├── INSTALL.md
├── QUICKSTART.md              # 5 分鐘上手
├── docs/
│   ├── methodology.md
│   ├── first-principles.md
│   ├── architecture.md
│   ├── why-this-works.md
│   └── ...
└── LICENSE
```

---

### Task 4.2 — 博客文章

3 篇核心文章：

1. **《為什麼我用兩個模型而非一個》** — 第一性原理推導
2. **《gstack-plus：給 AI 工作流加一層調度》** — 技術介紹
3. **《Louise 項目實踐：節省 60% 成本的方法論》** — 實戰案例

---

### Task 4.3 — GitHub 發布

- [ ] 初始化 git repo
- [ ] 寫 LICENSE（MIT）
- [ ] 寫 CONTRIBUTING.md
- [ ] 配置 GitHub Actions
- [ ] 創建 issue templates
- [ ] 發布 v0.1.0
- [ ] 在 X/Twitter、HackerNews、知乎宣傳

---

## 📅 完整時間表

```
Week 1-2:  Phase 0 學習         ✓ 確認節點：理解 gstack 哲學
Week 3-4:  Phase 1 基礎框架      ✓ 確認節點：分類器準確率 ≥ 80%
Week 5-6:  Phase 2 失敗回流      ✓ 確認節點：智能路由處理 4/5 場景
Week 7-8:  Phase 3 對比實驗      ✓ 確認節點：數據圖表完成
Week 9-10: Phase 4 發布          ✓ 確認節點：GitHub v0.1.0 發布
```

**總計：10 週（約 2.5 個月）**

---

## 🎯 5 個關鍵確認節點

| # | 節點 | 通過標準 | 失敗則 |
|---|------|---------|--------|
| 1 | 學習完成 | 能口頭講解 gstack/superpowers 設計理念 | 繼續閱讀，找社區交流 |
| 2 | 框架可用 | 路由器對 Louise 11 任務分配合理 | 調整評分維度 |
| 3 | 回流機制 | 5 種失敗場景處理 ≥ 4 種 | 增加失敗模式庫 |
| 4 | 實驗完成 | 9 個對照組數據完整 | 補做缺失的對照組 |
| 5 | 發布上線 | GitHub v0.1.0 + 3 篇博客 | 推遲到質量達標 |

---

## 🔬 對比實驗的核心問題

實驗要回答 5 個問題：

1. **gstack-plus 真的省錢嗎？** 比單模型節省多少 token？
2. **質量會不會下降？** 對比 review 評分
3. **什麼時候不該用？** 找出反例
4. **路由器多智能？** 自動分配 vs 手動分配的差距
5. **失敗回流多有效？** 失敗一次的代價對比

---

## 💎 額外建議

1. **邊做邊發布** — Phase 1 完成就可以發 v0.0.1 alpha
2. **找 1-2 個 alpha 用戶** — Garry Tan 是天然目標用戶
3. **保持簡單** — gstack 之所以有效，是因為它不複雜
4. **學習就是貢獻** — 學習筆記本身就是有價值的內容

---

## 📂 相關文檔

- [LEARNING_PLAN.md](LEARNING_PLAN.md) — 詳細學習計劃
- [YC_BLINDSPOTS.md](YC_BLINDSPOTS.md) — YC 式盲點清單
- [METHODOLOGY.md](docs/methodology.md) — 完整方法論（Louise 衍生）
- [README.md](README.md) — 項目主頁
