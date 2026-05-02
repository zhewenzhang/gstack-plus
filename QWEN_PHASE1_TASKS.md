# Qwen Code Phase 1 任務：基礎框架構建

> **給 Qwen Code 的工作指令**
> 工作目錄：`D:\gstack-plus`
> Phase 0（學習階段）已 100% 完成。現在進入 **Phase 1：基礎框架構建**。
> 本階段全部交付物是 **Markdown 文件**，不涉及代碼。先設計，再實現。

---

## 背景：你需要理解的上下文

**gstack-plus 是什麼**：一個多 Tier 模型協作框架。
- **Tier-A**（Claude Opus）：架構決策、複雜規劃
- **Tier-Mid**（Claude Sonnet）：代碼審查、邏輯驗證
- **Tier-Exec**（Qwen Code）：代碼實現、格式重構、文檔更新

**核心問題**：現在所有工作都用 Tier-A 做，太貴太慢。gstack-plus 要讓簡單任務自動路由到 Tier-Exec，只有真正需要判斷的任務才用 Tier-A。

**必讀文件（開始前先讀）**：
1. `docs/learning-notes/key-insights.md` — 核心設計啟發（特別是「Handoff 標準格式」部分）
2. `docs/learning-notes/gstack-vs-superpowers.md` — evidence 字段格式已定義
3. `PROJECT_ROADMAP.md` 的 Phase 1 章節（第 93-176 行）— 確認節點定義

---

## Phase 1 交付物一覽

```
handoff/
└── templates/
    ├── plan-to-exec.md           # Task 1（最高優先）
    ├── exec-to-check.md          # Task 2
    ├── check-to-plan.md          # Task 3
    └── shared/
        ├── evidence-format.md    # Task 4
        └── forbidden-words.md    # Task 5

classifier/
    ├── scoring-guide.md          # Task 6
    ├── routing-rules.md          # Task 7
    └── test-tasks.md             # Task 8

docs/
└── architecture.md               # Task 9（最後完成）
```

---

## Task 1：`handoff/templates/plan-to-exec.md`

**這是最重要的文件。** 它定義了 Tier-A（Claude）把任務交給 Tier-Exec（Qwen）時的標準格式。

**設計原則**（來自學習筆記）：
- No Placeholders：禁用「適當的」「合理的」「如果需要」等模糊詞
- Spec-first：必須有可驗證的成功標準
- Scope Lock：必須明確允許修改的文件範圍
- Evidence Required：Qwen 必須填寫執行後的 evidence 字段

**文件格式（必須嚴格遵循此結構）**：

```markdown
# Exec 任務移交單

## 基本信息
- **任務 ID**：[唯一標識，格式 EXEC-YYYYMMDD-NNN]
- **項目**：[項目名稱]
- **發起 Tier**：Tier-A
- **執行 Tier**：Tier-Exec
- **預估複雜度**：[低/中，如果是高請重新評估是否應該 Tier-Exec]

---

## 任務描述

[具體描述，必須包含：文件路徑、行號（如適用）、要做什麼、不能做什麼]

**禁止使用的表達**：「適當的」「合理的」「如果需要」「根據情況」「類似地」
（這些詞出現在描述中，視為本移交單格式不合格，Exec 有權拒絕接受）

---

## 成功標準

必須是可用命令驗證的（至少填 2 條）：
- [ ] [條件 1：例如「運行 npm test src/xxx 全部通過」]
- [ ] [條件 2：例如「git diff 只涉及以下文件」]
- [ ] [條件 3：如有]

---

## 允許修改的範圍（Scope Lock）

**允許修改的文件**：
- `[文件路徑 1]`
- `[文件路徑 2]`

**明確禁止修改的文件或目錄**：
- `[如有]`

**超出範圍的修改處理**：Exec 必須在 evidence 中說明，Tier-Mid 決定是否接受。

---

## 上下文快照

[當前相關代碼狀態、最近 3 次相關修改摘要、已知的依賴關係]

---

## 失敗升級條件

出現以下情況立即停止，回傳 exec-to-check.md（填 BLOCKED 狀態）：
- 需要修改「允許修改範圍」以外的文件才能完成任務
- 遇到需要架構判斷的問題（不確定「哪種方案更好」）
- 連續 2 次嘗試後錯誤未減少

---

## Evidence 格式要求

Exec 完成後必須填寫 `exec-to-check.md`，其中 evidence 字段格式見 `shared/evidence-format.md`。
不接受沒有 evidence 的完成聲明。
```

---

## Task 2：`handoff/templates/exec-to-check.md`

**Tier-Exec 完成任務後，向 Tier-Mid 提交的標準格式。**

**文件格式**：

```markdown
# Exec 完成報告

## 基本信息
- **對應任務 ID**：[對應 plan-to-exec.md 的 EXEC-xxx]
- **完成狀態**：[DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED]
- **完成時間**：[ISO 8601]

---

## 狀態說明

**DONE**：所有成功標準已驗證通過，無超範圍修改。
**DONE_WITH_CONCERNS**：任務完成，但有值得注意的地方（見下方說明）。
**NEEDS_CONTEXT**：任務無法完成，因為缺少關鍵上下文（見說明），需要 Tier-A 補充。
**BLOCKED**：遇到需要架構判斷的問題，或連續 2 次失敗，升級到 Tier-Mid/Tier-A。

---

## Evidence（必填，不接受空字段）

```yaml
evidence:
  commands_run:
    - command: "[實際執行的命令]"
      output: "[輸出結果，如果太長貼前 5 行]"
      status: "passed / failed"
    - command: "[第二個命令]"
      output: "[輸出]"
      status: "passed"

  file_changes:
    modified: ["[實際修改的文件列表]"]
    planned: ["[移交單中允許的文件列表]"]
    out_of_scope: ["[超出範圍的文件，如有]"]

  success_criteria_check:
    - criterion: "[成功標準 1 原文]"
      verified: true / false
      evidence: "[如何驗證的]"
    - criterion: "[成功標準 2 原文]"
      verified: true / false
      evidence: "[如何驗證的]"
```

---

## Concerns（如狀態為 DONE_WITH_CONCERNS 或 BLOCKED 必填）

[說明遇到了什麼、嘗試了什麼、為什麼停下來]

---

## 給 Tier-Mid 的建議

[Exec 視角的建議——不是架構判斷，是執行過程中的觀察]
```

---

## Task 3：`handoff/templates/check-to-plan.md`

**Tier-Mid 審查後，發現問題需要回流給 Tier-A 時的格式。**

**文件格式**：

```markdown
# 失敗回流報告

## 基本信息
- **對應任務 ID**：[EXEC-xxx]
- **回流類型**：[BUILD_ERROR / LOGIC_ERROR / DESIGN_ISSUE / SCOPE_DRIFT]
- **嚴重程度**：[低（重試可解決）/ 中（需分析）/ 高（需重新規劃）]

---

## 回流類型說明

**BUILD_ERROR**：編譯/測試失敗，可能 Exec 重試 1 次可解決。
**LOGIC_ERROR**：代碼跑通了，但邏輯不符合成功標準。需 Tier-Mid 分析根因。
**DESIGN_ISSUE**：任務本身的分解有問題，Exec 無法在當前邊界內完成。需 Tier-A 重新規劃。
**SCOPE_DRIFT**：完成任務需要超出 Scope Lock 的修改。需 Tier-A 評估是否擴大範圍。

---

## 失敗 Evidence

```yaml
failure_evidence:
  attempted_at: "[時間]"
  error_type: "[BUILD_ERROR 等]"
  error_detail: "[具體錯誤信息或失敗的成功標準]"
  exec_attempts: [1 或 2]
  
  what_was_tried:
    - attempt: 1
      action: "[嘗試了什麼]"
      result: "[結果]"
    - attempt: 2
      action: "[第二次嘗試]"
      result: "[結果]"
```

---

## 根因分析（Tier-Mid 填寫）

[3-strike 思維：如果同類問題出現 3 次，說明什麼系統性問題？]

**是任務分解問題**：[ 是 / 否 ] 說明：
**是上下文不足問題**：[ 是 / 否 ] 說明：
**是 Exec 能力邊界問題**：[ 是 / 否 ] 說明：

---

## 建議行動（Tier-Mid → Tier-A）

- [ ] 讓 Exec 重試（提供更多上下文）
- [ ] Tier-Mid 直接修復
- [ ] Tier-A 重新分解任務
- [ ] 重新評估這個任務是否適合 Tier-Exec

**優先推薦**：[選一個並說明原因]
```

---

## Task 4：`handoff/templates/shared/evidence-format.md`

**Evidence 字段的完整規格文檔，作為所有移交模板的參考。**

文件必須包含：
1. Evidence 的設計原則（為什麼需要 evidence、它防止什麼問題）
2. 完整的字段說明（每個字段的含義、是否必填、格式要求）
3. 三個完整的範例（正常完成、帶 concern 完成、失敗回流）
4. 常見錯誤填法（反例）及正確填法對比

---

## Task 5：`handoff/templates/shared/forbidden-words.md`

**給 Tier-A 使用的禁用詞速查卡。** 在填寫 plan-to-exec.md 前必須掃描一遍。

文件必須包含：
1. 完整禁用詞清單（基於 superpowers-planning.md 的 5 個禁用詞，可擴展）
2. 每個禁用詞：問題所在 + 替換思路 + before/after 示例
3. 快速自查問題：「這個描述，一個對這個項目一無所知的開發者能直接執行嗎？」
4. 格式：適合貼在牆上的速查卡風格

---

## Task 6：`classifier/scoring-guide.md`

**5 維度評分的詳細操作指南。** 這是任務分類器的核心文件。

**必須包含的內容**：

### 每個維度的 1-5 分量規（各維度的詳細定義）

格式：

```markdown
## 維度 1：判斷強度（Judgment Strength）

**核心問題**：這個任務需要「評估哪種方案更好」的能力嗎？

| 分數 | 含義 | 判斷標準 |
|------|------|---------|
| 1 | 機械重複 | 有明確的輸入→輸出規則，照做即可 |
| 2 | 少量判斷 | 有 1-2 個小決策，但失敗代價低 |
| 3 | 中等判斷 | 有多個選項，選錯需要回溯 |
| 4 | 高度判斷 | 需要考慮多個系統的交互影響 |
| 5 | 深度推理 | 需要架構級別的取捨分析 |

**判斷訣竅**：把任務描述給一個「熟悉技術但不了解這個項目」的開發者，
他能直接執行嗎？能 → 低分；他需要大量問題才能執行 → 高分。
```

對全部 5 個維度做相同的詳細定義。

### 15 個帶完整評分的例子

要求：
- 至少 4 個 → Tier-Exec 的例子（5 維合計 ≤ 10 分，且可驗性 ≥ 4）
- 至少 4 個 → Tier-A 的例子（判斷 ≥ 4 或風險 ≥ 4 或創意 ≥ 4）
- 至少 4 個 → Tier-Mid 的例子（中間地帶）
- 至少 3 個「邊界案例」例子（容易判斷錯的）

每個例子的格式：

```markdown
### 例子 N：[任務描述]

| 維度 | 分數 | 理由 |
|------|------|------|
| 判斷強度 | X | [一句話說明] |
| 上下文寬度 | X | [一句話說明] |
| 風險權重 | X | [一句話說明] |
| 可驗證性 | X | [一句話說明] |
| 創意密度 | X | [一句話說明] |

**路由結果**：Tier-[A/Mid/Exec]
**理由**：[套用路由規則的推導]
**反直覺點**（如有）：[為什麼這個任務看起來簡單但其實需要更高 Tier？或反之？]
```

---

## Task 7：`classifier/routing-rules.md`

**路由決策樹的完整文檔。**

**必須包含**：

1. **路由規則原文**（來自 PROJECT_ROADMAP.md）：
   - 判斷 ≥ 4 OR 風險 ≥ 4 OR 創意 ≥ 4 → Tier-A
   - 判斷 ≤ 2 AND 上下文 ≤ 2 AND 可驗 ≥ 4 → Tier-Exec
   - 其他 → Tier-Mid（或 Tier-A 兜底）

2. **決策樹的 ASCII 圖**（讓路由邏輯可視化）

3. **特殊情況處理**：
   - 某個維度缺乏信息時怎麼辦（預設值：給高分，保守路由）
   - Tier-Mid 不可用時的降級方案
   - 任務描述本身有歧義時（升 Tier-A 澄清，不猜測）

4. **邊界案例指南**：
   - 看起來簡單但其實需要 Tier-A 的任務特徵
   - 看起來複雜但可以 Tier-Exec 的任務特徵

5. **保守路由原則**（來自學習筆記）：
   不確定時，默認路由到更高 Tier。低估任務複雜度的代價，遠大於高估。

---

## Task 8：`classifier/test-tasks.md`

**20 個測試任務，用於驗證分類器的一致性。**

> **背景**：PROJECT_ROADMAP.md 的確認節點是「對 Louise 11 個任務分類，一致率 ≥ 80%」。
> 由於 Louise 的任務列表目前未在項目中記錄，先創建一個覆蓋全路由區間的合成測試集。

**20 個任務的要求**：
- 任務 1-7：應路由到 Tier-Exec（不同類型：實現、重構、文檔）
- 任務 8-13：應路由到 Tier-Mid（代碼審查、邏輯驗證類）
- 任務 14-18：應路由到 Tier-A（架構、安全、設計類）
- 任務 19-20：邊界案例（容易判斷錯的）

每個任務的格式：

```markdown
### 任務 N：[任務名稱]

**任務描述**：[具體的任務描述，像真實項目任務一樣寫]

**正確路由**：Tier-[A/Mid/Exec]

**評分**：
| 維度 | 分數 |
|------|------|
| 判斷強度 | X |
| 上下文寬度 | X |
| 風險權重 | X |
| 可驗證性 | X |
| 創意密度 | X |

**路由推導**：[套用路由規則的推導過程]
```

---

## Task 9：`docs/architecture.md`

**Phase 1 的設計總文件。** 這是最後完成的文件，整合前 8 個任務的設計決策。

**必須包含**：

1. **三層模型架構圖**（ASCII 圖）
2. **Tier 職責邊界定義**（每個 Tier 能做什麼、不能做什麼）
3. **任務生命周期**（從 Tier-A 規劃 → Exec 執行 → 驗證 → 成功/回流 的完整流程圖）
4. **模板系統說明**（4 個模板的使用場景和關係）
5. **分類器說明**（5 維度的設計決策——為什麼是這 5 個維度？）
6. **尚未解決的設計問題**（誠實列出，來源：`key-insights.md` 的 Phase 1 問題清單）
7. **Phase 1 確認節點**（如何驗證 Phase 1 完成）

---

## 執行順序

```
Task 1 → Task 2 → Task 3 → Task 4 → Task 5
（先做移交模板，因為後面的分類器文件會引用模板格式）

Task 6 → Task 7 → Task 8
（評分指南 → 路由規則 → 測試任務，順序依賴）

Task 9
（最後，整合所有設計決策）
```

---

## 質量標準

**每個 Markdown 文件完成後自查**：

- [ ] 模板：隨機取一個真實任務，能直接用這個模板填寫嗎？如果填寫時需要「猜」格式，說明模板不夠清晰。
- [ ] 評分指南：給同一個任務重新評分，結果和第一次一樣嗎？如果不一樣，說明維度定義不夠清晰。
- [ ] 路由規則：邊界案例清單中，路由決策有解釋嗎？只有規則沒有解釋，Tier-A 無法判斷是否正確。
- [ ] 測試任務：20 個任務中，有「正確路由不明顯」的邊界案例嗎？全部都「顯然」正確的測試集沒有價值。

---

## 驗收節點

完成後，對照 PROJECT_ROADMAP.md 的 Phase 1 確認節點：

> 路由表能對 20 個測試任務做出合理分配（用 scoring-guide.md 評分 + routing-rules.md 路由，不需要「人工判斷」）

用 `classifier/test-tasks.md` 跑一遍：拿出每個任務，只看評分指南和路由規則，能得到正確結果嗎？

---

## 注意事項

1. **語言**：繁體中文（與現有文件一致）
2. **不要創建代碼文件**：Phase 1 全是設計文檔，程式碼實現在 Phase 2+
3. **「Louise 的任務列表」**：這在 PROJECT_ROADMAP.md 中作為確認節點，但目前未記錄。Task 8 用合成測試集替代，並在文件頂部加注：「待用戶提供真實 Louise 任務列表後替換」
4. **每個文件底部加**：`*Phase 1 完成 2026-05-02*`

---

*Claude 生成 2026-05-02*
