# 失敗路由決策樹

> 當收到 `exec-to-check.md` 的 BLOCKED 或 DONE_WITH_CONCERNS 狀態時，Tier-Mid 的完整決策流程。
>
> **使用方法**：收到 Exec 失敗報告 → 按本文件的決策樹走 → 查到 failure-catalog.md 判斷類型 → 執行對應回應。

---

## Part 1：收到 Exec 失敗報告後的第一步：三個問題

在查 failure-catalog.md 之前，先問：

### 問題 1：Evidence 字段填了嗎？

- **沒有** → 退回給 Exec，要求補填 evidence（這不是真正的失敗，是格式問題）
- **有** → 繼續問題 2

### 問題 2：失敗是第幾次？

- **第 1 次 BUILD_ERROR** → 允許 Exec 自我修復一次（跳到 BUILD_ERROR 路由）
- **第 2 次或不是 BUILD_ERROR** → 進入分類流程（繼續問題 3）

### 問題 3：失敗描述是否清晰？

- **不清晰**（如「測試失敗了」但沒有貼輸出）→ 要求 Exec 補充具體錯誤信息後再分類
- **清晰** → 進入 Part 2 決策樹

---

## Part 2：失敗分類決策樹

```
收到失敗報告
    │
    ├─ Evidence 字段存在？
    │   ├── 否 → 退回給 Exec，要求補填 evidence
    │   └── 是 ↓
    │
    ├─ 編譯/測試命令輸出有錯誤？
    │   （npm test 有 FAIL / typecheck 有 error TS / build 退出碼非 0）
    │   │
    │   ├── 是 → BUILD_ERROR
    │   │       ├── 第 1 次 → Exec 自我修復
    │   │       │              （讀錯誤 → 定位問題 → 修復 → 重跑）
    │   │       └── 第 2 次 → Tier-Mid 分析
    │   │                       （查 failure-catalog.md BUILD_ERROR 分析模板）
    │   │
    │   └── 否 ↓
    │
    ├─ 功能測試/成功標準失敗？
    │   （命令輸出了但成功標準檢查有 verified: false）
    │   │
    │   ├── 是 → LOGIC_ERROR
    │   │       └── Tier-Mid 分析根因
    │   │            （查 failure-catalog.md LOGIC_ERROR 分析步驟）
    │   │            ├── Exec 誤解任務 → 澄清後重試 1 次
    │   │            ├── 任務描述歧義 → 轉 DESIGN_ISSUE
    │   │            └── 3 次同類失敗 → 升 Tier-A
    │   │
    │   └── 否 ↓
    │
    ├─ 超出 Scope Lock？
    │   （file_changes.out_of_scope 非空，或 concerns 提到需要修改其他文件）
    │   │
    │   ├── 是 → SCOPE_DRIFT
    │   │       └── Tier-A 評估
    │   │            ├── 擴大 Scope Lock → Exec 重試
    │   │            ├── 指導換實現方式 → Exec 重試
    │   │            └── 任務重規劃 → Tier-A 重分解
    │   │
    │   └── 否 ↓
    │
    └─ 任務本身有歧義/邊界問題？
        （Exec 說 NEEDS_CONTEXT，或 concerns 提到任務描述與代碼不符）
        │
        ├── 是 → DESIGN_ISSUE
        │       └── Tier-A 重規劃
        │            （不重試，立即升級）
        │
        └── 否 → 重新確認失敗現象
                 （回到問題 1，重新讀 evidence）
```

---

## Part 3：LOGIC_ERROR 根因分析清單（Tier-Mid 專用）

收到 LOGIC_ERROR 後，Tier-Mid 需要逐項回答：

- [ ] **成功標準是否明確？**
  （模糊的標準 → 重新定義標準，不是 Exec 的錯。例如「代碼要高效」不是明確標準）

- [ ] **Exec 的實現是否與成功標準的字面意思一致？**
  （字面一致但語義不符 → DESIGN_ISSUE；字面不一致 → LOGIC_ERROR，Exec 的錯）

- [ ] **是否是邊界條件問題？**
  （null、空值、最大值沒處理。是 → 指出具體 edge case，讓 Exec 重試，但最多重試 1 次）

- [ ] **是否需要了解系統其他部分才能修正？**
  （是 → DESIGN_ISSUE，升 Tier-A。Exec 的上下文不包含必要信息）

- [ ] **3 次相同類型的 LOGIC_ERROR 出現了嗎？**
  （是 → 系統性問題，必須升 Tier-A 重新設計。不是執行問題，是任務分解問題）

---

## Part 4：每種失敗類型的 Tier-Mid 回應模板

### BUILD_ERROR 回應模板（Tier-Mid → Tier-A 或自行修復）

```markdown
## BUILD_ERROR 回應

**失敗任務**：EXEC-xxx
**錯誤摘要**：[一句話描述錯誤，如 "TypeError: Cannot read property 'x' of undefined at line 45"]
**第幾次 BUILD_ERROR**：[1 或 2]

**Tier-Mid 分析**：
- 錯誤是否在 Exec Scope Lock 範圍內可修復？[是/否]
- 錯誤是語法錯誤還是邏輯錯誤？[語法/邏輯]
- Tier-Mid 已嘗試的修復：[描述了什麼]

**行動**：
- [ ] Tier-Mid 直接修復（語法錯誤，Tier-Mid 可以搞定）
- [ ] 升 Tier-A（邏輯錯誤，可能是任務分解問題）
- [ ] 轉 LOGIC_ERROR（BUILD_ERROR 修復後發現功能也不對）

**建議**：[一句話說明為什麼選這個行動]
```

---

### LOGIC_ERROR 回應模板（Tier-Mid → Tier-A 或 Exec 重試）

```markdown
## LOGIC_ERROR 回應

**失敗任務**：EXEC-xxx
**失敗的成功標準**：[從 exec-to-check.md 的 success_criteria_check 中複製 verified: false 的標準]
**Exec 的實現**：[Exec 實際做了什麼，一句話描述]
**預期行為**：[成功標準要求的行為，一句話描述]
**偏差**：[兩者差在哪裡]

**Tier-Mid 根因分析**（查 LOGIC_ERROR 根因分析清單）：
- 成功標準明確嗎？[是/否，說明]
- 實現與標準字面一致嗎？[是/否，說明]
- 是邊界條件問題嗎？[是/否，說明]
- 需要系統其他部分的知識嗎？[是/否，說明]
- 這是第幾次同類 LOGIC_ERROR？[N 次]

**行動**：
- [ ] 讓 Exec 重試（補充上下文：[具體補充什麼]）
- [ ] 轉 DESIGN_ISSUE（原因：[為什麼認為是任務描述問題]）
- [ ] Tier-Mid 直接修復（原因：[為什麼 Tier-Mid 比 Exec 更適合]）
- [ ] 升 Tier-A（原因：[為什麼需要架構層面解決]）
```

---

### DESIGN_ISSUE 回應模板（Tier-Mid → Tier-A）

```markdown
## DESIGN_ISSUE 回流報告

**失敗任務**：EXEC-xxx
**回流類型**：DESIGN_ISSUE

**問題描述**：
[任務描述的什麼地方與實際代碼狀態矛盾？或缺少什麼必要信息？]

**Exec 的反饋**：
[從 exec-to-check.md 的 concerns 字段複製 Exec 的說明]

**Tier-Mid 確認**：
- [ ] 任務描述中的文件/函數存在嗎？[是/否]
- [ ] 成功標準與代碼狀態矛盾嗎？[是/否]
- [ ] Exec 需要的上下文是什麼？[描述]

**建議 Tier-A 行動**：
- [ ] 更新任務描述（修正過時的引用）
- [ ] 重新分解任務（當前邊界無法完成，需要拆分）
- [ ] 補充上下文（Exec 缺少什麼信息）
```

---

### SCOPE_DRIFT 回應模板（Tier-Mid → Tier-A）

```markdown
## SCOPE_DRIFT 評估請求

**失敗任務**：EXEC-xxx
**回流類型**：SCOPE_DRIFT

**超範圍修改**：
[從 exec-to-check.md 的 file_changes.out_of_scope 複製]

**Exec 的理由**：
[從 concerns 字段複製 Exec 為什麼需要修改這些文件]

**Tier-Mid 評估**：
- 超範圍修改是必要的嗎？[是/否，說明]
- 有其他不需要超範圍的實現方式嗎？[有/沒有，描述]
- 如果必要，擴大 Scope Lock 的風險可接受嗎？[低/中/高]

**建議 Tier-A 行動**：
- [ ] 批准擴大 Scope Lock（原因：[為什麼必要]）
- [ ] 指導 Exec 換實現方式（方式：[描述]）
- [ ] 重規劃任務（原因：[為什麼當前任務設計不可行]）
```

---

*Phase 2 完成 2026-05-02*
