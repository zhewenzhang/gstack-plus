# Qwen Code Phase 3 任務：對比實驗設計與執行

> **給 Qwen Code 的工作指令**
> 工作目錄：`D:\gstack-plus`
> **執行前提**：Phase 1 + Phase 2 + 兩輪優化任務全部完成。
>
> ⚠️ **Phase 3 的特殊性**：前兩個 Phase 的成果是「設計文件」。Phase 3 的成果是「實驗記錄」——你需要真正使用 Phase 1-2 創建的模板來執行任務，記錄過程和數據。不是描述「如果使用模板會怎樣」，而是**實際填寫並使用它們**。

---

## Phase 3 整體結構

```
experiments/
├── methodology.md                    # Task 1：實驗設計方法論
├── task-definitions.md               # Task 2：3 個任務的完整規格
├── runs/
│   ├── C1-simple-eslint.md           # Task 3：Mode C 執行 Task A
│   ├── C2-medium-refactor.md         # Task 4：Mode C 執行 Task B
│   ├── C3-complex-auth.md            # Task 5：Mode C 執行 Task C
│   └── recording-template.md         # Task 6：Mode A/B 數據記錄模板
└── results-report.md                 # Task 7：結果分析報告框架
```

---

## Task 1：`experiments/methodology.md` — 實驗設計方法論

**用途**：確保 3 種模式的對比是公平的。定義什麼算「同一個任務」，什麼算「成功完成」，以及如何測量。

**必須包含以下部分**：

### Part 1：3 種模式的定義

```markdown
## 3 種實驗模式

### Mode A：單一 Claude（基準線）
- **操作方式**：Claude 獨立完成全部工作（規劃 + 執行 + 驗證），不使用 gstack-plus 模板
- **不允許**：使用任何 Phase 1-2 創建的模板或分類器
- **角色**：Claude 既是 Architect 也是 Executor

### Mode B：手動 Claude + Qwen（無模板）
- **操作方式**：Claude 規劃，Qwen 執行，但溝通方式是自由文本（不用標準模板）
- **不允許**：使用 plan-to-exec.md、exec-to-check.md 等模板
- **角色**：Claude 寫任意格式的任務描述，Qwen 執行，Claude 口頭確認結果

### Mode C：gstack-plus（使用模板系統）
- **操作方式**：嚴格按照 Phase 1-2 的完整流程
  1. 用 classifier/scoring-guide.md 評分 → routing-rules.md 路由
  2. 填寫 verification/pre-flight-checklist.md
  3. 填寫 handoff/templates/plan-to-exec.md
  4. 執行（Tier-Exec）並填寫 handoff/templates/exec-to-check.md
  5. 審查 evidence，如有失敗用 verification/failure-routing.md 分類
- **不允許**：跳過任何步驟，或用口頭代替模板
```

### Part 2：5 個測量指標的定義

對每個指標，定義：**什麼算一個計量單位**、**怎麼記錄**、**怎麼對比**。

```markdown
## 測量指標定義

| 指標 | 定義 | 記錄方式 | 對比基準 |
|------|------|---------|---------|
| **Token 消耗** | 該 session 中所有模型調用的 input+output token 總和 | 從 API 賬單或 IDE 統計讀取 | Mode A 為基準，C/A 的比值 |
| **步驟數** | 完成任務需要的「輪次」數（每次人類發指令算 1 輪） | 手動計數 | Mode A 為基準 |
| **回流次數** | 因錯誤需要重做或修正的次數 | 手動記錄 | 越低越好 |
| **代碼質量** | 用 gstack 的 `/review` 命令評分（0-100） | 完成後用 `/review` 評分 | 三種模式應該接近，差距 > 10 需要說明 |
| **用戶介入次數** | 需要人類做判斷/決策的次數（不含起始指令） | 手動計數 | 越低越好 |
```

### Part 3：公平性規則

```markdown
## 公平性規則

1. **相同輸入**：3 種模式使用完全相同的任務描述（來自 task-definitions.md）
2. **相同環境**：在相同的代碼狀態下開始（從同一個 git commit 開始）
3. **成功標準統一**：只有通過 task-definitions.md 中定義的成功標準，才算「完成」
4. **記錄順序**：先跑 Mode A（建立基準），再跑 Mode B，最後 Mode C
5. **不干預**：每種模式按照它的規則走，不在執行中途切換方式

## 預期偏差和局限性

誠實說明這個實驗的局限（比較結果不能過度推廣）：
- 3 個任務樣本量小，結論是指示性的，不是統計顯著的
- Mode C 的 pre-flight 和模板填寫本身消耗時間，數字需要說明
- Qwen 執行 Mode C 的任務，可能受益於「設計這套模板的人執行它」的優勢
```

---

## Task 2：`experiments/task-definitions.md` — 3 個任務完整規格

**用途**：3 種模式都用同一份任務規格，確保對比公平。

**每個任務的格式**：

```markdown
## 任務 [A/B/C]：[任務名稱]（[簡單/中等/複雜]）

### 背景
[1-2 句說明這個任務的上下文]

### 初始狀態
[任務開始前，代碼/文件的狀態。必須具體到可以用 git 描述的狀態]

### 給模型的指令（3 種模式都用這個）
[給 AI 的原始指令，不帶任何格式或模板]

### 成功標準（3 種模式統一判定）
- [ ] [標準 1：可用命令驗證的]
- [ ] [標準 2]
- [ ] [標準 3]

### 預期複雜度分析（用於 Mode C 分類）
- 判斷強度：[1-5 分及理由]
- 上下文寬度：[1-5 分及理由]
- 風險權重：[1-5 分及理由]
- 可驗證性：[1-5 分及理由]
- 創意密度：[1-5 分及理由]
- 預期路由：[Tier-A / Tier-Mid / Tier-Exec]
```

**3 個任務定義**（來自 PROJECT_ROADMAP.md，需要細化到可執行程度）：

### 任務 A（簡單）：給 gstack-plus 項目加 ESLint 規則

初始狀態：`D:\gstack-plus` 目前沒有 `package.json` 和 ESLint 配置。

任務要求：
- 初始化 `package.json`（僅包含 devDependencies）
- 安裝並配置 TypeScript ESLint（`@typescript-eslint/eslint-plugin`）
- 配置規則：禁止 `any`、強制 `===`、強制函數返回類型標注
- `.eslintrc.json` 或 `.eslintrc.js` 配置文件
- 成功標準：`npx eslint .` 能執行，無配置錯誤

### 任務 B（中等）：重構 classifier/scoring-guide.md 的評分邏輯為結構化數據

初始狀態：`classifier/scoring-guide.md` 已存在，是純文字文件。

任務要求：
- 創建 `classifier/scoring-schema.ts`（TypeScript 類型定義）
- 把 scoring-guide.md 中的 15 個例子，轉換為 TypeScript 對象數組（符合 schema）
- 創建 `classifier/scorer.ts`，實現 `scoreTask(description: string): ScoringResult` 函數（輸入任務描述，輸出 5 維度分數和路由建議）
- 成功標準：`tsc --noEmit` 無錯誤，scorer.ts 對 test-tasks.md 的前 3 個任務給出正確路由

### 任務 C（複雜）：設計 gstack-plus 的 API Key 認證方案

初始狀態：項目沒有任何認證機制。

任務要求：
- 輸出設計文件 `docs/auth-design.md`：
  - API Key 的生成、存儲、驗證方案
  - 每個 Tier 的訪問控制（Tier-A 需要高權限 key，Tier-Exec 可以用低權限 key）
  - 安全考量（key rotation、revocation、rate limiting）
  - 實施路線圖（分 3 個 sprint）
- 成功標準：設計文件覆蓋上述 4 個部分，安全考量部分有 ≥ 3 個具體的威脅場景

---

## Task 3：`experiments/runs/C1-simple-eslint.md` — Mode C 執行任務 A

**你的任務**：用 gstack-plus 完整流程執行任務 A（ESLint），並記錄全過程。

**這是真正的執行，不是描述**：
- 真正用 `classifier/scoring-guide.md` 給任務 A 評分（填寫所有 5 個維度）
- 真正填寫 `handoff/templates/pre-flight-checklist.md` 的所有 12 項
- 真正填寫一份完整的 `handoff/templates/plan-to-exec.md`
- 真正執行任務（創建 package.json、.eslintrc.json）
- 真正填寫 `handoff/templates/exec-to-check.md`（包含 evidence 字段）

**記錄文件的格式**：

```markdown
# Mode C 執行記錄：Task A — ESLint 配置

## Step 1：任務分類
[貼上實際填寫的 5 維度評分表]
[貼上路由決策]

## Step 2：Pre-flight 檢查
[貼上實際填寫的 pre-flight-checklist，A/B/C 三個 section]
[通過/不通過的決定]

## Step 3：移交單（plan-to-exec.md）
[貼上完整填寫的移交單]

## Step 4：執行
[記錄 Exec 實際做了什麼：創建了哪些文件，修改了什麼]
[如果遇到問題，用 failure-routing.md 的決策樹分類，記錄下來]

## Step 5：返回報告（exec-to-check.md）
[貼上完整填寫的返回報告，包含真實的 evidence]

## Step 6：審查（Tier-Mid 視角）
[驗證 evidence 是否支持完成聲明]
[成功標準逐項核對結果]

## 實驗數據記錄
| 指標 | 數值 | 備注 |
|------|------|------|
| 總步驟數（輪次）| | |
| 填寫模板消耗的步驟數 | | |
| 執行消耗的步驟數 | | |
| 回流次數 | 0 或 N | |
| 代碼質量（/review 分數或人工評分 0-10）| | |
| 用戶介入次數 | | |

## 執行後反思
[使用模板的感受：哪裡流暢？哪裡卡頓？有什麼意外？]
[對模板的改進建議（如有）]
```

---

## Task 4：`experiments/runs/C2-medium-refactor.md` — Mode C 執行任務 B

與 Task 3 格式相同，執行任務 B（重構 scorer.ts）。

**注意**：任務 B 是中等複雜度，預期路由 Tier-Mid 或 Tier-Exec。如果執行中遇到 LOGIC_ERROR 或 DESIGN_ISSUE，記錄回流過程（這是最有價值的數據）。

---

## Task 5：`experiments/runs/C3-complex-auth.md` — Mode C 執行任務 C

與 Task 3 格式相同，執行任務 C（認證方案設計）。

**注意**：任務 C 預期路由 Tier-A。這意味著：
- pre-flight 檢查中，B 區的 B2 項可能不通過（不應路由到 Tier-Exec）
- 任務本身由 Tier-A（Claude Architect 角色）執行，不需要 plan-to-exec 移交

記錄一個 Tier-A 任務的完整流程如何不同於 Tier-Exec 任務。

---

## Task 6：`experiments/runs/recording-template.md` — Mode A/B 數據記錄模板

**用途**：這是給**用戶（你自己）**填寫 Mode A 和 Mode B 實驗數據的模板。Qwen Code 不能替代用戶執行 Mode A（單一 Claude）和 Mode B（手動協作）。

**文件格式**：

```markdown
# Mode [A/B] 執行記錄：Task [A/B/C]

## 模式說明
- Mode A：Claude 獨立完成全部工作
- Mode B：Claude 規劃 + Qwen 執行，自由格式溝通（無模板）

## 執行過程摘要
[描述執行過程的關鍵步驟，不需要像 Mode C 那樣詳細，但要記錄：
- 遇到了什麼問題？
- 怎麼解決的？
- 有沒有需要重做的步驟？]

## 結果驗證
[成功標準逐項：通過/不通過]

## 實驗數據
| 指標 | 數值 | 備注 |
|------|------|------|
| 總步驟數（輪次）| | |
| 回流次數 | | |
| 代碼質量（0-10）| | |
| 用戶介入次數 | | |
| 主觀感受（1-5，5 最順暢）| | |
```

**重要提示（在文件頂部說明）**：

```markdown
> 注意：Mode A 和 Mode B 的實驗需要在獨立的 Claude 會話中執行，
> 使用和 Mode C 完全相同的任務描述（來自 experiments/task-definitions.md）。
> Mode C 的記錄已在 experiments/runs/C1/C2/C3 中完成。
> 請在執行 Mode A/B 後，把數據填入對應的 A1-A3、B1-B3 記錄文件。
```

---

## Task 7：`experiments/results-report.md` — 結果分析報告框架

**用途**：這是最終報告的框架。Mode C 數據由 Qwen Code 在 Task 3-5 中填入，Mode A/B 數據由用戶填入後，這個報告就能生成完整結論。

**文件結構**：

### Section 1：執行摘要

```markdown
## 執行摘要

**實驗目的**：驗證 gstack-plus 方法論是否能在保持代碼質量的前提下，降低 AI 工作流成本。

**實驗設計**：3 種模式（A: 單 Claude / B: 手動協作 / C: gstack-plus）× 3 種任務（簡單/中等/複雜）= 9 組對照

**關鍵發現**（完成後填寫）：
- [ ] Token 節省：Mode C vs Mode A，節省 ___%
- [ ] 質量對比：Mode C 代碼質量 ___ vs Mode A ___
- [ ] 回流次數：Mode C ___ vs Mode A ___
- [ ] 最有效的場景：____ 類型任務（簡單/中等/複雜）
- [ ] 最無效的場景：____ 類型任務
```

### Section 2：數據匯總表

```markdown
## 數據匯總

### 步驟數對比
|  | 簡單任務 | 中等任務 | 複雜任務 | 平均 |
|--|---------|---------|---------|------|
| Mode A（單 Claude）| A1 | A2 | A3 | |
| Mode B（手動協作）| B1 | B2 | B3 | |
| Mode C（gstack-plus）| C1 ✅ | C2 ✅ | C3 ✅ | |
| C vs A 比值 | | | | |

（為 Token 消耗、回流次數、代碼質量創建同樣的表格）
```

### Section 3：逐任務分析

對每個任務類型（簡單/中等/複雜）寫 1 段分析，回答：
- 在這個複雜度下，哪種模式表現最好？
- gstack-plus 的額外開銷（填模板的步驟）值得嗎？
- 有什麼意外發現？

### Section 4：結論和反例

```markdown
## 結論

**gstack-plus 最有效的場景**：
（完成後根據數據填寫）

**gstack-plus 開銷超過收益的場景**（誠實的反例）：
（完成後根據數據填寫）

**對方法論的修改建議**（基於實驗數據）：
（完成後根據數據填寫）

## YC Blindspot 對照：本實驗回答了什麼？

根據 YC_BLINDSPOTS.md 第 8 條（度量標準先定義），本實驗測量了：
- ✅ Token/成本節省（有數據）
- ✅ 代碼質量（有數據）
- ⚠️ 真實用戶感受（需要訪談，本實驗未覆蓋）
- ⚠️ 護城河驗證（工具可被複製，但方法論案例不可，需要更多案例）
```

---

## 執行順序

```
Task 1：methodology.md（設計公平的實驗規則）
  ↓
Task 2：task-definitions.md（定義 3 個具體任務）
  ↓
Task 3：C1-simple-eslint.md（真正執行 ESLint 任務）
Task 4：C2-medium-refactor.md（真正執行重構任務）
Task 5：C3-complex-auth.md（真正執行認證設計任務）
  ↓
Task 6：recording-template.md（為用戶的 Mode A/B 準備模板）
  ↓
Task 7：results-report.md（填入 Mode C 數據，為 A/B 留空）
```

---

## 質量標準

**對 methodology.md**：
- [ ] Mode A/B/C 的定義是否能讓「不了解這個項目的人」獨立運行？
- [ ] 5 個指標的測量方式是否客觀（不依賴主觀感受）？

**對 task-definitions.md**：
- [ ] 3 個任務的成功標準是否可以用命令驗證？
- [ ] 給「從未見過這個任務的人」，他能直接開始嗎？

**對 C1/C2/C3 執行記錄**：
- [ ] plan-to-exec.md 是否完整填寫（不是「示例填法」，是真實任務的填法）？
- [ ] evidence 字段是否有真實的命令輸出？
- [ ] 「執行後反思」是否誠實說明了模板哪裡好用、哪裡難用？

**對 results-report.md**：
- [ ] Mode C 的數據欄位是否都已填寫（不是空白待填）？
- [ ] 是否誠實說明了「gstack-plus 在哪些場景沒有優勢」？

---

## 注意事項

1. **語言**：繁體中文
2. **Task 3-5 是真實執行**：不要寫「如果執行會...」，要真正填寫模板、創建文件、記錄數據
3. **Mode A/B 由用戶執行**：Task 6 的 recording-template.md 只是準備框架，不要替用戶填寫
4. **誠實記錄問題**：如果執行中模板有不清楚的地方，在「執行後反思」中說明，這是改進 Phase 1-2 的機會
5. **每個文件底部加**：`*Phase 3 完成 2026-05-02*`

---

*Claude 生成 2026-05-02*
