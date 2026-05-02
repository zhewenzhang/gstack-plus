# Qwen Code Phase 2 任務：失敗回流機制

> **給 Qwen Code 的工作指令**
> 工作目錄：`D:\gstack-plus`
> **執行前提**：Phase 1 的 9 個文件必須全部存在，再開始本文件的任務。

---

## 第零步：Phase 1 自我驗收（必做，不可跳過）

在開始任何 Phase 2 任務之前，先用以下測試確認 Phase 1 成果可用。

### 測試 A：移交模板可用性測試

**目的**：確認 `plan-to-exec.md` 模板可以用於真實任務。

**方法**：用以下虛構任務填寫一份完整的移交單：

```
任務描述：在 src/utils/formatter.ts 中新增一個函數 formatCurrency(amount: number, currency: string)，
         將數字格式化為帶貨幣符號的字符串（例如 1234.5 → "¥1,234.50"）。
項目：gstack-plus
```

**驗收標準**：
- 填完後，一個不了解這個項目的開發者能直接執行嗎？
- 成功標準一欄有可用命令驗證的條件嗎（例如「運行 npm test src/utils/ 全部通過」）？
- Scope Lock 裡有明確的文件列表嗎？

**如果模板填寫困難**：找出哪個字段設計不清晰，先修正 `plan-to-exec.md`，再繼續。

### 測試 B：分類器一致性測試

**目的**：確認 `classifier/scoring-guide.md` 的評分標準足夠清晰。

**方法**：取 `classifier/test-tasks.md` 的第 1、5、10、15、20 號任務，對每個任務：
1. 不看「正確路由」欄位
2. 只用 `scoring-guide.md` 的維度定義評分
3. 套用 `routing-rules.md` 的路由邏輯
4. 對比預期路由

**驗收標準**：5 個任務中至少 4 個路由結果與預期一致。

**如果一致率 < 80%**：在繼續前修正評分指南中不清晰的維度定義。

---

## Phase 2 交付物一覽

```
verification/
├── pre-flight-checklist.md      # Task 1
├── failure-catalog.md           # Task 2
└── failure-routing.md           # Task 3

docs/
└── superpowers-integration.md   # Task 4

experiments/
└── failure-scenarios.md         # Task 5（Phase 2 確認節點）
```

---

## Task 1：`verification/pre-flight-checklist.md`

**用途**：Tier-A（Claude）把任務移交給 Tier-Exec 之前，必須過的「發射前檢查清單」。  
**設計來源**：PROJECT_ROADMAP.md Task 2.1 + superpowers `verification-before-completion` 的精神（在聲稱「準備好了」之前強制驗證）。

**文件結構（必須包含以下所有部分）**：

---

### Part 1：文件格式說明

說明這個清單的使用方式：
- 什麼時候用：Plan-to-exec 移交單填完後、正式派發前
- 誰來填：Tier-A（Claude Architect）
- 怎麼填：逐項核對，有任何一項 ❌ 則不能派發，必須先修正
- 記錄方式：把通過的清單附在 plan-to-exec.md 的末尾

---

### Part 2：Section A — 任務描述清晰度（6 項）

```markdown
## Section A：任務描述清晰度

- [ ] A1. 任務描述中有具體的文件路徑（例如 src/xxx.ts 第 N 行）
- [ ] A2. 任務描述中沒有禁用詞（見 handoff/templates/shared/forbidden-words.md）
- [ ] A3. 成功標準至少有 2 條可用命令驗證的條件（非主觀判斷）
- [ ] A4. 明確列出了「不允許修改」的文件或目錄（Scope Lock 已定義）
- [ ] A5. 邊界條件已考慮（null、空值、最大值、錯誤輸入的處理方式已說明）
- [ ] A6. 任務不依賴「尚未完成的其他任務」（若有依賴，先完成依賴再派發）
```

---

### Part 3：Section B — Tier 分配合理性（3 項）

```markdown
## Section B：Tier 分配合理性

- [ ] B1. 已用 classifier/scoring-guide.md 對本任務評分
- [ ] B2. 評分結果支持路由到 Tier-Exec（判斷 ≤ 2 AND 上下文 ≤ 2 AND 可驗 ≥ 4）
      （如果不符合，重新路由到正確 Tier）
- [ ] B3. 沒有「看起來簡單但其實是 Tier-A 的」隱藏決策
      （自問：如果 Exec 遇到未預期情況，需要架構判斷嗎？）
```

---

### Part 4：Section C — 失敗回流準備（3 項）

```markdown
## Section C：失敗回流準備

- [ ] C1. 已定義「失敗升級條件」（plan-to-exec.md 的對應字段已填寫）
- [ ] C2. Exec 最多重試次數已明確（預設：BUILD_ERROR 可重試 1 次，其他不重試）
- [ ] C3. 如果 Exec 返回 BLOCKED，清楚誰來接手（Tier-Mid 或 Tier-A）
```

---

### Part 5：發射決策

```markdown
## 發射決策

**Section A 全部通過**：[ 是 / 否 ]
**Section B 全部通過**：[ 是 / 否 ]
**Section C 全部通過**：[ 是 / 否 ]

**決定**：
- 全部通過 → ✅ 可以派發給 Tier-Exec
- 有任何 ❌ → 🚫 修正後重新檢查，不得派發
```

---

### Part 6：快速參考卡（Speed Reference）

用一個緊湊的表格總結所有檢查項，適合貼在側邊欄或快速查閱：

```markdown
| 類別 | 關鍵問題 | 通過條件 |
|------|---------|---------|
| 描述 | 給陌生開發者能執行嗎？ | 無需猜測可直接執行 |
| 標準 | 成功用命令可以驗嗎？ | ≥ 2 個可執行命令 |
| 範圍 | 改了哪裡、不改哪裡 | 文件列表明確 |
| Tier | 評分說明可以 Exec 嗎？ | 路由規則驗證通過 |
| 回流 | 失敗時誰負責？ | 升級路徑明確 |
```

---

## Task 2：`verification/failure-catalog.md`

**用途**：失敗類型手冊。當 Tier-Exec 返回 BLOCKED 或 DONE_WITH_CONCERNS 時，Tier-Mid 查這個手冊來分類失敗並決定路由。

**文件結構（必須包含以下 4 個失敗類型的完整描述）**：

---

### 格式：每個失敗類型的標準描述

```markdown
## 失敗類型 N：[類型名稱]

**定義**：[1 句話定義這個失敗類型]

**識別信號**（出現以下任一信號即可判斷為此類型）：
- 信號 1：[具體、可觀察的信號，例如「npm test 輸出有 FAIL 字樣」]
- 信號 2：
- 信號 3：

**典型場景**：[1 個具體的例子，說明什麼情況下會出現這種失敗]

**路由決策**：
- 第 1 次發生 → [誰來處理、怎麼處理]
- 重試後仍失敗 → [升級到誰]
- 最大重試次數：[N 次]

**處理方模板**：
- Tier-Exec 自我修復（BUILD_ERROR 限定）：[具體步驟]
- Tier-Mid 分析模板：[需要回答的問題列表]
- Tier-A 重規劃觸發條件：[什麼情況下確認需要 Tier-A]

**與其他類型的區別**：
- vs [容易混淆的類型]：[區別在哪裡]
```

**四個必須定義的失敗類型**（來自 PROJECT_ROADMAP.md Task 2.2）：

1. **BUILD_ERROR**：編譯/測試失敗，表面上可自我修復
2. **LOGIC_ERROR**：代碼跑通，但邏輯不符合成功標準
3. **DESIGN_ISSUE**：任務分解有問題，Exec 無法在當前邊界內完成
4. **SCOPE_DRIFT**：完成任務需要超出 Scope Lock 的修改

---

### 失敗類型快速對照表（文件末尾）

```markdown
## 快速對照表

| 失敗類型 | 核心問題 | 第一處理方 | 最大重試 | 升級觸發 |
|---------|---------|-----------|---------|---------|
| BUILD_ERROR | 跑不起來 | Tier-Exec | 2 次 | 2 次後仍失敗 |
| LOGIC_ERROR | 跑起來但結果錯 | Tier-Mid | 1 次 | 立即分析 |
| DESIGN_ISSUE | 任務本身有問題 | Tier-A | 0 次 | 立即升級 |
| SCOPE_DRIFT | 範圍不夠用 | Tier-A | 0 次 | 立即升級 |
```

---

## Task 3：`verification/failure-routing.md`

**用途**：當收到 `exec-to-check.md` 的 BLOCKED 或 DONE_WITH_CONCERNS 狀態時，Tier-Mid 的完整決策流程。

**文件結構**：

---

### Part 1：接收失敗報告的第一步

```markdown
## 收到 Exec 失敗報告後的第一步：三個問題

在查 failure-catalog.md 之前，先問：

1. Evidence 字段填寫了嗎？
   - 沒有 → 退回給 Exec，要求補填 evidence（不是真正的失敗，是格式問題）

2. 失敗是第幾次？
   - 第 1 次 BUILD_ERROR → 允許 Exec 自我修復一次
   - 其他類型或第 2 次 → 進入分類流程

3. 失敗描述是否清晰？
   - 不清晰 → 要求 Exec 補充具體錯誤信息後再分類
```

---

### Part 2：失敗分類決策樹（ASCII 圖）

必須畫出以下邏輯的 ASCII 決策樹：

```
收到失敗報告
    ↓
Evidence 字段存在？
├── 否 → 退回要求補填
└── 是 → 繼續
    ↓
編譯/測試命令輸出有錯誤？
├── 是 → BUILD_ERROR
│       ├── 第 1 次 → Exec 自我修復（讀錯誤、重試）
│       └── 第 2 次 → Tier-Mid 分析
└── 否 → 功能測試/成功標準失敗？
    ├── 是 → LOGIC_ERROR → Tier-Mid 分析根因
    └── 否 → 超出 Scope Lock？
        ├── 是 → SCOPE_DRIFT → Tier-A 評估
        └── 否 → 任務本身有歧義/邊界問題？
            ├── 是 → DESIGN_ISSUE → Tier-A 重規劃
            └── 否 → 重新確認失敗現象
```

---

### Part 3：Tier-Mid 分析清單（LOGIC_ERROR 專用）

```markdown
## LOGIC_ERROR 根因分析清單

收到 LOGIC_ERROR 後，Tier-Mid 需要回答：

- [ ] 成功標準是否明確？（模糊的標準 → 重新定義標準，不是 Exec 的錯）
- [ ] Exec 的實現是否與成功標準的字面意思一致？
      （字面一致但語義不符 → DESIGN_ISSUE）
- [ ] 是否是邊界條件問題？（null、空值、最大值）
      （是 → 修正標準後讓 Exec 重試，但最多重試 1 次）
- [ ] 是否需要了解系統其他部分才能修正？
      （是 → DESIGN_ISSUE，升 Tier-A）
- [ ] 3 次相同類型的 LOGIC_ERROR 出現了嗎？
      （是 → 系統性問題，必須升 Tier-A 重新設計）
```

---

### Part 4：每種失敗類型的標準回應模板

分別為 BUILD_ERROR、LOGIC_ERROR、DESIGN_ISSUE、SCOPE_DRIFT 各寫一個「Tier-Mid 回應模板」，說明 Tier-Mid 在處理這類失敗時應該回傳什麼給上層。

---

## Task 4：`docs/superpowers-integration.md`

**用途**：定義 superpowers skill 在 gstack-plus 工作流中的切入點。這是 PROJECT_ROADMAP.md Task 2.3 的設計文件。

**文件結構**：

---

### Part 1：整合地圖（ASCII 流程圖）

畫出 gstack-plus 完整工作流，並標注每個 superpowers 介入點：

```
[Tier-A 規劃]
├── 強制 invoke: superpowers:brainstorming（複雜任務才需要）
├── 強制 invoke: superpowers:writing-plans（所有任務）
└── 輸出 → plan-to-exec.md

[Pre-flight 檢查]
└── 使用: verification/pre-flight-checklist.md

[Tier-Exec 執行]
├── 建議 invoke: superpowers:executing-plans
└── 完成前強制 invoke: superpowers:verification-before-completion

[Tier-Mid 審查]
├── 收到 exec-to-check.md
└── 使用: verification/failure-routing.md

[Tier-A 收到 Review 反饋]
└── 強制 invoke: superpowers:receiving-code-review
```

---

### Part 2：每個切入點的詳細說明

對每個 superpowers 介入點，說明：

```markdown
### 切入點 N：[superpowers skill 名稱]

**在哪個階段**：[規劃/執行/驗證/...]
**是強制還是建議**：[強制 / 建議]
**觸發條件**：[什麼情況下觸發，不是「每次都觸發」的需要說明條件]
**跳過條件**：[什麼情況下可以不 invoke（如果是建議的話）]
**與 gstack-plus 模板的關係**：[這個 skill 的輸出怎麼影響移交模板的填寫]
**如果跳過會發生什麼**：[反例——說明不 invoke 的代價]
```

---

### Part 3：決策指南——什麼時候必須用 superpowers

一個快速查閱表：

```markdown
| 場景 | 必用的 superpowers skill | 原因 |
|------|------------------------|------|
| 複雜任務規劃前 | brainstorming | 防止跳過影響範圍分析 |
| 任何任務規劃 | writing-plans | 確保計劃無佔位符 |
| Exec 完成聲明前 | verification-before-completion | 防止「聲稱完成但未驗證」 |
| 收到 code review | receiving-code-review | 防止誤解批評、漏掉核心問題 |
```

---

## Task 5：`experiments/failure-scenarios.md`（Phase 2 確認節點）

**這是 Phase 2 的驗收測試。**  
PROJECT_ROADMAP.md 的確認節點：「模擬 5 種失敗場景，路由邏輯正確處理 ≥ 4 種。」

**你的任務**：自己創建 5 個虛構的失敗場景，然後用 Phase 2 創建的工具（pre-flight-checklist.md、failure-catalog.md、failure-routing.md）走完整個流程。

---

### 每個場景的格式

```markdown
## 場景 N：[場景名稱]

### 背景
[任務是什麼，計劃的 plan-to-exec.md 內容摘要]

### 失敗發生
[Exec 返回了什麼，exec-to-check.md 的 evidence 字段摘要]

### Tier-Mid 分類（用 failure-catalog.md）
- 失敗類型：[BUILD_ERROR / LOGIC_ERROR / DESIGN_ISSUE / SCOPE_DRIFT]
- 識別根據：[引用 failure-catalog.md 的哪個識別信號]

### 路由決策（用 failure-routing.md）
- 決策樹路徑：[走了哪條分支]
- 路由到：[Tier-Exec 重試 / Tier-Mid 分析 / Tier-A 重規劃]

### 解決過程
[處理方怎麼解決的，最終結果是什麼]

### 驗證
- [ ] 路由決策是否正確？（對照預期答案）
- [ ] 使用的工具文件是否足夠清晰？（填寫時有沒有「猜」的地方）
- [ ] 如果有「猜」的地方，記錄下來作為改進點
```

---

### 5 個場景必須覆蓋

1. **場景 1**：BUILD_ERROR → Exec 自我修復成功
2. **場景 2**：BUILD_ERROR → Exec 重試後仍失敗 → Tier-Mid 介入
3. **場景 3**：LOGIC_ERROR → Tier-Mid 分析，追加上下文後 Exec 重試解決
4. **場景 4**：DESIGN_ISSUE → Tier-A 重新分解任務
5. **場景 5**：SCOPE_DRIFT → Tier-A 評估是否擴大範圍（任選：批准或拒絕）

---

### 場景文件末尾：工具有效性評估

```markdown
## Phase 2 工具有效性評估

完成 5 個場景後，填寫：

| 工具文件 | 在場景中使用順暢嗎？ | 需要改進的地方 |
|---------|-------------------|--------------|
| pre-flight-checklist.md | [ 是 / 需要改進 ] | |
| failure-catalog.md | [ 是 / 需要改進 ] | |
| failure-routing.md | [ 是 / 需要改進 ] | |
| superpowers-integration.md | [ 是 / 需要改進 ] | |

**Phase 2 確認節點結果**：
- 5 個場景中正確路由的數量：[N]/5
- 是否達到確認節點標準（≥ 4/5）：[ 是 / 否 ]
- 如果否：哪個場景出了問題，需要修正哪個工具文件
```

---

## 執行順序

```
第零步：Phase 1 自我驗收（測試 A + 測試 B）
  ↓
Task 1：pre-flight-checklist.md
  ↓
Task 2：failure-catalog.md
  ↓
Task 3：failure-routing.md
  ↓
Task 4：superpowers-integration.md
  ↓
Task 5：failure-scenarios.md（用前 4 個工具做驗收測試）
```

**注意**：Task 5 中如果發現工具文件有問題，回去修正對應文件，然後繼續。

---

## 質量標準

每個文件完成後自查：

**對於所有文件**：
- [ ] 文件裡沒有「視情況而定」「請參考實際情況」等佔位符表達
- [ ] 所有的「應該」都有對應的「怎麼做」（規則必須有操作步驟）

**對於 pre-flight-checklist.md**：
- [ ] 用測試 A 的虛構任務填寫清單，能在 5 分鐘內走完嗎？

**對於 failure-catalog.md**：
- [ ] 給一個真實的錯誤信息（例如 `TypeError: Cannot read property 'x' of undefined`），能在 30 秒內判斷失敗類型嗎？

**對於 failure-routing.md**：
- [ ] ASCII 決策樹裡，所有分支都有終點嗎？沒有「懸空」的分支。

**對於 failure-scenarios.md**：
- [ ] 5 個場景用的是不同的失敗類型（不要 5 個都是 BUILD_ERROR）

---

## 注意事項

1. **語言**：繁體中文
2. **不寫代碼**：Phase 2 全是設計文件，程式碼實現在之後
3. **自我修正優先**：Task 5 發現問題時，先修正相關文件，再完成場景
4. **每個文件底部加**：`*Phase 2 完成 2026-05-02*`

---

*Claude 生成 2026-05-02*
