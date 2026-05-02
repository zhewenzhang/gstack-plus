# 失敗類型手冊

> 當 Tier-Exec 返回 BLOCKED 或 DONE_WITH_CONCERNS 時，Tier-Mid 查這個手冊來分類失敗並決定路由。
>
> **使用方法**：讀取 exec-to-check.md 的 evidence 字段 → 對照本手冊的識別信號 → 判斷失敗類型 → 查 failure-routing.md 走路由決策。

---

## 失敗類型 1：BUILD_ERROR

**定義**：編譯/測試命令輸出顯示錯誤，代碼無法運行。

**識別信號**（出現以下任一信號即可判斷）：
- `npm test` 輸出包含 `FAIL` 或 `✕` 字樣
- `npm run typecheck` 輸出包含 `error TS` 開頭的行
- `npm run build` 退出碼非 0
- 編譯器輸出包含 `SyntaxError`、`TypeError`、`Cannot find module`
- Linter 輸出 `error`（不是 `warning`）

**典型場景**：
Exec 修改了 `src/auth/login.ts` 中某個函數的參數列表，但忘記同步更新調用處。測試運行時，調用處傳入舊參數數量，導致 `TypeError: expected 3 arguments but got 2`。

**路由決策**：
- 第 1 次發生 → 允許 Tier-Exec 自我修復 1 次（讀錯誤信息、定位問題、修復、重跑）
- 重試後仍失敗 → Tier-Mid 介入分析
- 最大重試次數：**2 次**

**處理方模板**：

**Tier-Exec 自我修復步驟**：
1. 讀取錯誤信息的完整輸出
2. 定位錯誤發生的文件和行號
3. 檢查是否屬於 Scope Lock 範圍內可以修復的問題
4. 如果是（如拼寫錯誤、參數不匹配、忘記 import）→ 修復
5. 重跑驗證命令
6. 如果通過 → 填 exec-to-check.md 返回 DONE
7. 如果仍失敗 → 填 BLOCKED，升級到 Tier-Mid

**Tier-Mid 分析模板**（BUILD_ERROR 第 2 次仍失敗）：
- 錯誤是否在 Exec 的 Scope Lock 範圍內？
  - 否 → 轉 SCOPE_DRIFT 類型
  - 是 → 繼續
- 錯誤是因為代碼邏輯錯誤還是語法錯誤？
  - 語法錯誤 → Exec 應該能修，但可能漏了什麼 → Tier-Mid 直接修復
  - 邏輯錯誤 → 可能是 LOGIC_ERROR，轉 LOGIC_ERROR 類型

**Tier-A 重規劃觸發條件**：
- BUILD_ERROR 連續 3 次（Exec 1 次 + Tier-Mid 2 次）仍無法修復 → 可能是任務分解本身有問題 → Tier-A 重規劃

**與其他類型的區別**：
- vs LOGIC_ERROR：BUILD_ERROR 是「跑不起來」，LOGIC_ERROR 是「跑起來但結果錯」
- vs SCOPE_DRIFT：如果修復 BUILD_ERROR 需要改 Scope Lock 以外的文件 → 轉 SCOPE_DRIFT

---

## 失敗類型 2：LOGIC_ERROR

**定義**：代碼可以運行（編譯/測試命令沒有報錯），但功能不符合成功標準。

**識別信號**（出現以下任一信號即可判斷）：
- 測試通過但返回值不符合預期（如期望 `[1,2,3]` 但得到 `[3,2,1]`）
- 成功標準檢查中有 `verified: false` 但 `commands_run` 的 status 都是 `passed`
- Exec 在 concerns 中說「功能實現了，但邊緣情況可能沒處理好」
- 測試輸出類似：`Expected: "¥1,234.50" Received: "1234.50"`（格式不對但沒報錯）

**典型場景**：
任務要求 `formatCurrency(1234.5, "CNY")` 返回 `"¥1,234.50"`。Exec 實現了數字格式化，但忘記添加千位分隔符。測試運行時沒有編譯錯誤，但測試用例期望 `"¥1,234.50"`，實際得到 `"¥1234.50"`。測試框架報告 assertion failure（不是 BUILD_ERROR），因為代碼本身是合法的。

**路由決策**：
- 第 1 次發生 → Tier-Mid 分析根因
- Tier-Mid 分析後，追加上下文讓 Exec 重試 → 最多重試 1 次
- 重試後仍失敗 → Tier-A 重規劃
- 最大重試次數：**1 次**（Exec 重試）

**處理方模板**：

**Tier-Mid 分析步驟**：
1. 逐條對比 exec-to-check.md 中的 `success_criteria_check`
2. 找出 `verified: false` 的標準
3. 對比 Exec 的實現和成功標準的字面意思
4. 判斷偏差原因：
   - Exec 誤解了任務描述 → 澄清後讓 Exec 重試 1 次
   - 任務描述本身有歧義 → 轉 DESIGN_ISSUE，升 Tier-A
   - Exec 的實現有 edge case 沒處理 → 指出具體 edge case，讓 Exec 重試 1 次
5. 如果 3 次相同類型的 LOGIC_ERROR → 系統性問題，升 Tier-A

**Tier-A 重規劃觸發條件**：
- 同類型的 LOGIC_ERROR 出現 3 次
- Tier-Mid 判斷「任務描述本身有歧義」
- 修復需要了解系統其他部分（超出 Exec 的上下文）

**與其他類型的區別**：
- vs BUILD_ERROR：LOGIC_ERROR 的測試命令是 passed 的，只是 assertion 不對
- vs DESIGN_ISSUE：如果字面一致但語義不符 → DESIGN_ISSUE；如果只是實現錯了 → LOGIC_ERROR

---

## 失敗類型 3：DESIGN_ISSUE

**定義**：任務本身的分解有問題，Exec 無法在當前的任務邊界內完成。

**識別信號**（出現以下任一信號即可判斷）：
- Exec 在 concerns 中說「這個任務需要先改 X 才能改 Y，但 X 不在我的任務範圍」
- 成功標準與實際代碼狀態矛盾（如要求修改一個不存在的函數）
- Exec 說「需要知道 Z 的設計決策，但任務描述中沒有」
- exec-to-check.md 狀態為 NEEDS_CONTEXT 且原因是「任務描述與代碼不符」

**典型場景**：
任務要求「在 `UserService.getUser()` 中添加緩存」。Exec 查看代碼後發現 `UserService` 類根本不存在——它在上一次重構中被改名為 `UserRepository`。任務描述基於已經過時的代碼狀態，Exec 無法在「不存在的類」中添加功能。這需要 Tier-A 重新規劃任務（先更新任務描述中的類名）。

**路由決策**：
- 第 1 次發生 → 立即升級到 Tier-A，不重試
- Tier-A 收到後重新分解任務
- 最大重試次數：**0 次**（不應讓 Exec 重試，因為任務本身有問題）

**處理方模板**：

**Tier-Mid 分析步驟**：
1. 確認 Exec 的 concerns 是否指向任務描述本身（不是 Exec 的實現錯誤）
2. 檢查任務描述中的文件/函數/接口是否存在
3. 如果不存在的 → DESIGN_ISSUE 確認，填 check-to-plan.md 升 Tier-A
4. 如果存在但 Exec 沒找到 → 可能是上下文不足 → 補充後讓 Exec 重試 1 次
5. 如果任務描述與成功標準矛盾 → DESIGN_ISSUE 確認

**Tier-A 重規劃觸發條件**：
- 確認是 DESIGN_ISSUE → 立即重規劃

**與其他類型的區別**：
- vs LOGIC_ERROR：LOGIC_ERROR 是 Exec 實現錯了；DESIGN_ISSUE 是任務描述錯了
- vs SCOPE_DRIFT：SCOPE_DRIFT 是「範圍不夠」；DESIGN_ISSUE 是「任務本身有問題」

---

## 失敗類型 4：SCOPE_DRIFT

**定義**：完成任務需要修改 Scope Lock 允許範圍以外的文件。

**識別信號**（出現以下任一信號即可判斷）：
- exec-to-check.md 的 `file_changes.out_of_scope` 非空
- Exec 在 concerns 中說「需要先新增工具函數 X，但 X 不在允許修改的文件列表中」
- Exec 實現的功能正確，但 git diff 顯示修改了 Scope Lock 以外的文件
- Tier-Mid 審查時發現「這個改動依賴另一個模塊的接口，但那不在 Scope 內」

**典型場景**：
任務要求「為 `POST /api/users` 添加輸入驗證」，Scope Lock 只允許修改 `src/routes/users.ts`。Exec 實現了驗證邏輯，但發現驗證規則定義在 `src/validators/user.ts` 中，需要同時修改這個文件。Exec 在 `out_of_scope` 中列出了 `src/validators/user.ts`。這需要 Tier-A 評估：是擴大 Scope Lock（批准修改 validators 文件）還是讓 Exec 用其他方式實現（如在 routes 文件中內聯驗證邏輯）。

**路由決策**：
- 第 1 次發生 → Tier-A 評估是否擴大 Scope Lock
- Tier-A 決定：批准擴大 Scope → Exec 重試；拒絕 → Exec 用其他方式實現或任務重規劃
- 最大重試次數：**0 次**（不重試，先由 Tier-A 決策）

**處理方模板**：

**Tier-A 評估步驟**：
1. 讀取 exec-to-check.md 的 `out_of_scope` 字段
2. 判斷超範圍修改是否合理：
   - 合理（確實需要修改這些文件才能完成任務）→ 擴大 Scope Lock，讓 Exec 重試
   - 不合理（Exec 的實現方式不對，有其他不需要超範圍的方式）→ 指導 Exec 換實現方式
   - 不合理且任務本身不應該需要這些修改 → DESIGN_ISSUE，重規劃任務
3. 如果擴大 Scope Lock：更新 plan-to-exec.md 的 Scope Lock 字段，讓 Exec 重試

**Tier-Mid 在 SCOPE_DRIFT 中的角色**：
- 識別 out_of_scope 是否真的是必要的
- 如果認為不必要 → 直接指導 Exec 換方式，不需要升 Tier-A
- 如果認為必要 → 升 Tier-A 評估

**與其他類型的區別**：
- vs DESIGN_ISSUE：SCOPE_DRIFT 是任務設計對的但範圍不夠；DESIGN_ISSUE 是任務設計錯了
- vs BUILD_ERROR：如果超範圍修改是為了修復 BUILD_ERROR → 先判斷 BUILD_ERROR 是否可以其他方式修復

---

## 快速對照表

| 失敗類型 | 核心問題 | 第一處理方 | 最大重試 | 升級觸發 |
|---------|---------|-----------|---------|---------|
| **BUILD_ERROR** | 跑不起來 | Tier-Exec | 2 次 | 2 次後仍失敗 → Tier-Mid |
| **LOGIC_ERROR** | 跑起來但結果錯 | Tier-Mid | 1 次 | 立即分析，3 次同類 → Tier-A |
| **DESIGN_ISSUE** | 任務本身有問題 | Tier-A | 0 次 | 立即升級 |
| **SCOPE_DRIFT** | 範圍不夠用 | Tier-A | 0 次 | 立即升級評估 |

---

*Phase 2 完成 2026-05-02*
