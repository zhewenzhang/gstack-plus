# 失敗場景模擬實驗

> Phase 2 驗收測試。模擬 5 種失敗場景，驗證路由邏輯正確處理 ≥ 4 種。
>
> **方法**：創建虛構失敗場景 → 用 Phase 2 工具文件（pre-flight-checklist.md、failure-catalog.md、failure-routing.md）走完整流程 → 驗證路由正確性。

---

## 場景 1：BUILD_ERROR → Exec 自我修復成功

### 背景

**任務**：EXEC-20260502-001
**plan-to-exec.md 摘要**：
- 任務描述：在 `src/utils/formatter.ts` 中新增 `formatCurrency(amount: number, currency: string)` 函數
- 成功標準：`npm test src/utils/ 全部通過`、`git diff 只涉及 formatter.ts`
- Scope Lock：允許修改 `src/utils/formatter.ts`

### 失敗發生

**exec-to-check.md 摘要**：
```yaml
狀態：BLOCKED
evidence:
  commands_run:
    - command: "npm test src/utils/formatter.test.ts"
      output: "FAIL\n  ✕ formatCurrency formats CNY correctly\n    TypeError: formatCurrency is not a function"
      status: "failed"
  file_changes:
    modified: ["src/utils/formatter.ts"]
    planned: ["src/utils/formatter.ts"]
    out_of_scope: []
  success_criteria_check:
    - criterion: "npm test src/utils/ 全部通過"
      verified: false
      evidence: "formatCurrency is not a function"
```

### Tier-Mid 分類（用 failure-catalog.md）

- **失敗類型**：BUILD_ERROR
- **識別根據**：`npm test` 輸出包含 `FAIL` 和 `TypeError: formatCurrency is not a function`

### 路由決策（用 failure-routing.md）

- **決策樹路徑**：Evidence 存在 → 編譯/測試命令有錯誤 → BUILD_ERROR → 第 1 次
- **路由到**：Tier-Exec 自我修復

### 解決過程

Tier-Mid 退回給 Exec，允許自我修復 1 次。

Exec 讀取錯誤：`formatCurrency is not a function` → 問題是函數沒有被 export。Exec 檢查代碼，發現寫了函數實現但忘記在文件末尾的 `export { ... }` 中添加 `formatCurrency`。Exec 添加 export，重跑測試。

**第二次 exec-to-check.md**：
```yaml
狀態：DONE
evidence:
  commands_run:
    - command: "npm test src/utils/"
      output: "Test Suites: 2 passed, 2 total\nTests: 12 passed, 12 total"
      status: "passed"
```

### 驗證

- [x] **路由決策是否正確**：是。BUILD_ERROR 第 1 次 → Exec 自我修復，符合 failure-routing.md 決策樹。
- [x] **使用的工具文件是否足夠清晰**：是。failure-catalog.md 的 BUILD_ERROR 識別信號明確匹配了 `TypeError` 輸出。
- **改進點**：無。

---

## 場景 2：BUILD_ERROR → Exec 重試後仍失敗 → Tier-Mid 介入

### 背景

**任務**：EXEC-20260502-002
**plan-to-exec.md 摘要**：
- 任務描述：將 `src/api/user.ts` 中的 `getUser` 函數返回值從 `User` 改為 `UserProfile`（新類型）
- 成功標準：`npm run typecheck 輸出 Found 0 errors`、`npm test src/api/user.test.ts 全部通過`
- Scope Lock：允許修改 `src/api/user.ts`

### 失敗發生

**第 1 次 exec-to-check.md**：
```yaml
狀態：BLOCKED
evidence:
  commands_run:
    - command: "npm run typecheck"
      output: "error TS2305: Module '\"../types\"' has no exported member 'UserProfile'."
      status: "failed"
```

Tier-Mid 允許 Exec 自我修復。Exec 嘗試在 `src/api/user.ts` 中直接定義 `UserProfile` 類型而不是從 `../types` 導入。

**第 2 次 exec-to-check.md**：
```yaml
狀態：BLOCKED
evidence:
  commands_run:
    - command: "npm run typecheck"
      output: "error TS2300: Duplicate identifier 'UserProfile'.\nerror TS2403: Subsequent variable declarations must have the same type."
      status: "failed"
```

### Tier-Mid 分類（用 failure-catalog.md）

- **失敗類型**：BUILD_ERROR（第 2 次）
- **識別根據**：`npm run typecheck` 輸出包含 `error TS`

### 路由決策（用 failure-routing.md）

- **決策樹路徑**：Evidence 存在 → 編譯/測試命令有錯誤 → BUILD_ERROR → 第 2 次 → Tier-Mid 分析
- **路由到**：Tier-Mid 分析

### 解決過程

Tier-Mid 分析：
- 錯誤在 Scope Lock 範圍內嗎？是（`src/api/user.ts`）
- 語法錯誤還是邏輯錯誤？邏輯錯誤——`UserProfile` 類型已經在 `../types` 中定義了，但 Exec 不知道，所以在 user.ts 中重複定義導致衝突。

Tier-Mid 檢查 `src/types/index.ts`，確認 `UserProfile` 已經存在。問題是 Exec 的上下文沒有包含這個信息。

Tier-Mid 直接修復：在 `src/api/user.ts` 的 import 語句中添加 `UserProfile`：
```typescript
import { User, UserProfile } from '../types';
```
刪掉 Exec 重複定義的 `UserProfile`。跑 typecheck → 0 errors。

### 驗證

- [x] **路由決策是否正確**：是。BUILD_ERROR 第 2 次 → Tier-Mid 分析，符合決策樹。
- [x] **使用的工具文件是否足夠清晰**：是。failure-catalog.md 的 BUILD_ERROR Tier-Mid 分析模板指導了正確的診斷流程。
- **改進點**：failure-catalog.md 的 BUILD_ERROR 分析模板中，可以加一條「檢查類型是否在其他文件已定義」的提示，因為這是 TypeScript 項目的常見問題。

---

## 場景 3：LOGIC_ERROR → Tier-Mid 分析，追加上下文後 Exec 重試解決

### 背景

**任務**：EXEC-20260502-003
**plan-to-exec.md 摘要**：
- 任務描述：為 `src/utils/array.ts` 的 `uniqueItems(arr: any[])` 函數添加去重邏輯
- 成功標準：`uniqueItems([1, 2, 2, 3])` 返回 `[1, 2, 3]`、`uniqueItems([])` 返回 `[]`、`npm test src/utils/array.test.ts 全部通過`
- Scope Lock：允許修改 `src/utils/array.ts`

### 失敗發生

**exec-to-check.md 摘要**：
```yaml
狀態：DONE_WITH_CONCERNS
evidence:
  commands_run:
    - command: "npm test src/utils/array.test.ts"
      output: "Test Suites: 1 passed, 1 total\nTests: 2 passed, 2 total"
      status: "passed"
  file_changes:
    modified: ["src/utils/array.ts"]
    planned: ["src/utils/array.ts"]
    out_of_scope: []
  success_criteria_check:
    - criterion: "uniqueItems([1, 2, 2, 3]) 返回 [1, 2, 3]"
      verified: true
      evidence: "測試通過"
    - criterion: "uniqueItems([]) 返回 []"
      verified: true
      evidence: "測試通過"
concerns: "我用了 Set 來去重，但這對對象無效（Set 比較引用）。如果輸入是 [{id:1}, {id:1}] 不會去重。任務描述沒有說是否要支持對象。"
```

### Tier-Mid 分類（用 failure-catalog.md）

- **失敗類型**：LOGIC_ERROR
- **識別根據**：Exec 在 concerns 中說「功能實現了，但邊緣情況可能沒處理好」——這是 LOGIC_ERROR 的識別信號

### 路由決策（用 failure-routing.md）

- **決策樹路徑**：Evidence 存在 → 測試命令沒有錯誤 → 但 concerns 提到邊緣情況 → LOGIC_ERROR → Tier-Mid 分析
- **路由到**：Tier-Mid 分析根因

### 解決過程

Tier-Mid 跑 LOGIC_ERROR 根因分析清單：
- 成功標準明確嗎？是（任務描述了兩個測試用例）
- 實現與標準字面一致嗎？是（兩個測試用例都通過）
- 是邊界條件問題嗎？**是**——Exec 正確指出了 `Set` 對對象無效
- 需要系統其他部分的知識嗎？否
- 這是第幾次同類 LOGIC_ERROR？第 1 次

Tier-Mid 決定：追加上下文，讓 Exec 重試 1 次。

Tier-Mid 補充任務描述：「`uniqueItems` 需要支持對象數組的去重。對象的相等性通過 `id` 字段判斷（如果對象有 `id` 字段）。如果對象沒有 `id` 字段，按引用比較。請修改實現以支持這些場景。」

Exec 收到後，改用基於 `id` 字段比較的策略：
```typescript
function uniqueItems(arr: any[]): any[] {
  const seen = new Map();
  return arr.filter(item => {
    const key = typeof item === 'object' && item.id !== undefined ? item.id : item;
    if (seen.has(key)) return false;
    seen.set(key, true);
    return true;
  });
}
```
測試通過。

### 驗證

- [x] **路由決策是否正確**：是。LOGIC_ERROR → Tier-Mid 分析 → 追加上下文 → Exec 重試，符合流程。
- [x] **使用的工具文件是否足夠清晰**：是。failure-catalog.md 的 LOGIC_ERROR 分析步驟中「是否是邊界條件問題」引導 Tier-Mid 正確識別了問題類型。
- **改進點**：無。

---

## 場景 4：DESIGN_ISSUE → Tier-A 重新分解任務

### 背景

**任務**：EXEC-20260502-004
**plan-to-exec.md 摘要**：
- 任務描述：在 `src/services/UserService.ts` 的 `getUserProfile(userId)` 方法中添加緩存邏輯（使用 Redis）
- 成功標準：`npm test src/services/UserService.test.ts 包含緩存命中和未命中的測試`、`npm run typecheck 通過`
- Scope Lock：允許修改 `src/services/UserService.ts`

### 失敗發生

**exec-to-check.md 摘要**：
```yaml
狀態：NEEDS_CONTEXT
evidence:
  commands_run: []
  file_changes:
    modified: []
    planned: ["src/services/UserService.ts"]
    out_of_scope: []
  success_criteria_check: []
concerns: "我找不到 src/services/UserService.ts。在 src/services/ 目錄下只有 userRepository.ts 和 userController.ts。UserService.ts 不存在。我需要確認是否應該在 userRepository.ts 中添加緩存，還是創建新的 UserService.ts？"
```

### Tier-Mid 分類（用 failure-catalog.md）

- **失敗類型**：DESIGN_ISSUE
- **識別根據**：Exec 說「找不到文件」——任務描述中的文件不存在。這是 DESIGN_ISSUE 的識別信號：「成功標準與實際代碼狀態矛盾」。

### 路由決策（用 failure-routing.md）

- **決策樹路徑**：Evidence 存在 → 編譯/測試沒有錯誤（沒跑）→ 沒有功能測試失敗 → 沒有超 Scope → 任務本身有歧義/邊界問題 → DESIGN_ISSUE → Tier-A 重規劃
- **路由到**：Tier-A 重規劃

### 解決過程

Tier-Mid 確認：`src/services/UserService.ts` 確實不存在。項目在上次重構中把 `UserService` 改名為 `UserRepository`，但 plan-to-exec.md 用了舊的類名。

Tier-Mid 填寫 check-to-plan.md：
```
回流類型：DESIGN_ISSUE
問題描述：任務描述引用了不存在的 src/services/UserService.ts。實際代碼中這個類已改名為 UserRepository（在 src/services/userRepository.ts）。
建議 Tier-A 行動：更新任務描述中的類名和文件路徑。
```

Tier-A 收到後，用 receiving-code-review 精神分析：這是任務分解的錯誤，不是 Exec 的錯。Tier-A 重新分解任務：
- 新任務 EXEC-20260502-004-v2：在 `src/services/userRepository.ts` 的 `getUserById` 方法中添加 Redis 緩存
- 更新 Scope Lock：允許修改 `src/services/userRepository.ts`
- 重新跑 pre-flight checklist → 通過 → 派發給 Exec

Exec 在新任務中成功完成。

### 驗證

- [x] **路由決策是否正確**：是。DESIGN_ISSUE → 立即升 Tier-A 重規劃，符合「0 次重試」規則。
- [x] **使用的工具文件是否足夠清晰**：是。failure-catalog.md 的 DESIGN_ISSUE 識別信號中「任務描述中的文件/函數不存在」精確匹配了這個場景。
- **改進點**：無。

---

## 場景 5：SCOPE_DRIFT → Tier-A 評估後批准擴大範圍

### 背景

**任務**：EXEC-20260502-005
**plan-to-exec.md 摘要**：
- 任務描述：為 `POST /api/users` 端點添加請求體驗證（驗證 `name`、`email`、`password` 字段）
- 成功標準：`POST /api/users 缺少 name 字段返回 400`、`POST /api/users email 格式錯誤返回 400`、`npm test src/routes/users.test.ts 新增的驗證測試通過`
- Scope Lock：允許修改 `src/routes/users.ts`，禁止修改 `src/validators/` 目錄

### 失敗發生

**exec-to-check.md 摘要**：
```yaml
狀態：DONE_WITH_CONCERNS
evidence:
  commands_run:
    - command: "npm test src/routes/users.test.ts"
      output: "Test Suites: 1 passed, 1 total\nTests: 5 passed, 5 total"
      status: "passed"
  file_changes:
    modified: ["src/routes/users.ts", "src/validators/user.ts"]
    planned: ["src/routes/users.ts"]
    out_of_scope: ["src/validators/user.ts"]
  success_criteria_check:
    - criterion: "POST /api/users 缺少 name 字段返回 400"
      verified: true
      evidence: "測試通過"
    - criterion: "POST /api/users email 格式錯誤返回 400"
      verified: true
      evidence: "測試通過"
concerns: "我在 routes/users.ts 中添加了驗證邏輯，但發現項目有一個現成的驗證框架在 src/validators/user.ts 中。為了保持一致性，我用了這個框架（用了它的 validateUserInput 函數）。但這意味著我修改了 Scope Lock 以外的文件。"
```

### Tier-Mid 分類（用 failure-catalog.md）

- **失敗類型**：SCOPE_DRIFT
- **識別根據**：`file_changes.out_of_scope` 非空（包含 `src/validators/user.ts`）

### 路由決策（用 failure-routing.md）

- **決策樹路徑**：Evidence 存在 → 編譯/測試沒有錯誤 → 成功標準檢查通過 → 超出 Scope Lock → SCOPE_DRIFT → Tier-A 評估
- **路由到**：Tier-A 評估

### 解決過程

Tier-Mid 評估超範圍修改是否合理：
- `src/validators/user.ts` 已經存在且包含 `validateUserInput` 函數
- Exec 的修改是「調用現有驗證框架」，不是「創建新的驗證邏輯」
- 這個修改是合理的——保持一致性比在 routes 中內聯驗證更好
- 風險：低（只是添加了一個函數調用）

Tier-Mid 填寫 SCOPE_DRIFT 評估請求給 Tier-A：
```
超範圍修改是必要的嗎？是。項目有現成的驗證框架，使用它比內聯驗證更一致。
有其他不需要超範圍的實現方式嗎？有，但不好——在 routes 中內聯所有驗證邏輯，會導致代碼重複和不一致。
擴大 Scope Lock 的風險可接受嗎？低。只是添加函數調用，不修改 validators 的邏輯。
建議：批准擴大 Scope Lock。
```

Tier-A 審查後同意：批准擴大 Scope Lock。任務接受為 DONE。

### 驗證

- [x] **路由決策是否正確**：是。SCOPE_DRIFT → Tier-A 評估 → 批准擴大 Scope，符合流程。
- [x] **使用的工具文件是否足夠清晰**：是。failure-catalog.md 的 SCOPE_DRIFT Tier-A 評估步驟指導了正確的決策流程。
- **改進點**：failure-catalog.md 的 SCOPE_DRIFT 部分可以更明確地說「如果超範圍修改是調用現有代碼（不是修改現有代碼），風險通常較低」。

---

## Phase 2 工具有效性評估

完成 5 個場景後，填寫：

| 工具文件 | 在使用中順暢嗎？ | 需要改進的地方 |
|---------|----------------|--------------|
| pre-flight-checklist.md | 是 | 無。檢查項清晰，沒有「猜」的地方。 |
| failure-catalog.md | 是 | BUILD_ERROR 的 Tier-Mid 分析模板可以增加 TypeScript 特有的提示（「檢查類型是否在其他文件已定義」）。SCOPE_DRIFT 部分可以補充「調用現有代碼 vs 修改現有代碼」的區分。 |
| failure-routing.md | 是 | 決策樹完整，所有分支都有終點。 |
| superpowers-integration.md | 是 | 切入點定義清晰，與模板的關係明確。 |

**Phase 2 確認節點結果**：
- 5 個場景中正確路由的數量：**5/5**
- 是否達到確認節點標準（≥ 4/5）：**是** ✅
- 如果否：不適用

---

*Phase 2 完成 2026-05-02*
