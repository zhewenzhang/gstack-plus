# Evidence 格式規格

> 所有移交模板中 evidence 字段的統一標準。
>
> **設計信念**：證據先於斷言。AI 傾向於聲稱完成但沒有驗證——evidence 字段強制每一個完成聲明都有可驗證的支持材料。

---

## 為什麼需要 Evidence

**它防止的問題**：

1. **聲稱完成但沒有跑驗證**：Exec 改了代碼就說「完成了」，但沒有跑測試看結果
2. **聲稱完成但跑了錯誤的驗證**：Exec 跑了測試，但測試的不是移交單中定義的成功標準
3. **聲稱完成但超範圍修改**：Exec 修改了 Scope Lock 以外的文件，但沒有報告
4. **聲稱完成但有隱藏問題**：Exec 完成了，但有一些 concern 沒有報告

**核心原則**：
- 每一個完成聲明都必須有證據
- 證據必須是可驗證的（命令輸出、git diff、文件狀態）
- 證據必須是完整的（不截斷關鍵信息）

---

## 完整字段說明

### commands_run（必填）

Exec 執行的所有驗證命令的列表。

| 字段 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `command` | string | ✅ | 實際執行的命令 |
| `output` | string | ✅ | 命令輸出。如果太長，貼前 5 行 + `...` + 最後 3 行 |
| `status` | enum | ✅ | `passed` 或 `failed` |

**格式要求**：
- 至少 1 條命令
- 命令必須是實際執行的，不是「應該能通過」的推測
- 如果命令失敗了，`status` 填 `failed`，`output` 貼完整錯誤

**範例**：
```yaml
commands_run:
  - command: "npm test src/auth/login.test.ts"
    output: "PASS src/auth/login.test.ts\n  ✓ should login with valid credentials\n  ✓ should reject invalid password\n  ✓ should handle network error\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total"
    status: "passed"
```

### file_changes（必填）

Exec 修改的所有文件的列表。

| 字段 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `modified` | string[] | ✅ | 實際修改的文件列表（從 git diff 獲取） |
| `planned` | string[] | ✅ | 移交單中允許的文件列表（從 plan-to-exec.md 的 Scope Lock 複製） |
| `out_of_scope` | string[] | ✅ | 超出 Scope Lock 的文件。如果沒有，填 `[]` |

**驗證規則**：
- `modified` 中的每個文件必須在 `planned` 中，或出現在 `out_of_scope` 中
- `out_of_scope` 非空時，Exec 必須在 concerns 中說明為什麼需要

### success_criteria_check（必填）

對移交單中每條成功標準的驗證結果。

| 字段 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `criterion` | string | ✅ | 成功標準原文（從 plan-to-exec.md 複製） |
| `verified` | boolean | ✅ | `true` = 通過，`false` = 失敗 |
| `evidence` | string | ✅ | 如何驗證的（描述或命令輸出引用） |

**驗證規則**：
- 條目數必須等於 plan-to-exec.md 中的成功標準條數
- 任何一條 `verified: false` 都意味着任務未完成
- `evidence` 不能是「代碼看起來正確」——必須是具體驗證動作

---

## 完整範例

### 範例 1：正常完成（DONE）

```yaml
evidence:
  commands_run:
    - command: "npm test src/auth/"
      output: "Test Suites: 3 passed, 3 total\nTests:       18 passed, 0 failed"
      status: "passed"
    - command: "npm run typecheck"
      output: "Found 0 errors."
      status: "passed"

  file_changes:
    modified: ["src/auth/login.ts", "src/auth/token.ts"]
    planned: ["src/auth/login.ts", "src/auth/token.ts"]
    out_of_scope: []

  success_criteria_check:
    - criterion: "運行 npm test src/auth/ 全部通過"
      verified: true
      evidence: "npm test 輸出 18 passed, 0 failed"
    - criterion: "git diff 只涉及 login.ts 和 token.ts"
      verified: true
      evidence: "git diff --name-only 輸出只有這兩個文件"
```

### 範例 2：帶 Concern 完成（DONE_WITH_CONCERNS）

```yaml
evidence:
  commands_run:
    - command: "npm test src/utils/"
      output: "Test Suites: 2 passed, 2 total\nTests:       12 passed, 0 failed"
      status: "passed"
    - command: "npm run lint"
      output: "3 warnings:\n  Line 45: 'data' is assigned but never used\n  Line 67: Unexpected console statement\n  Line 89: Missing return type"
      status: "passed"

  file_changes:
    modified: ["src/utils/format.ts"]
    planned: ["src/utils/format.ts"]
    out_of_scope: []

  success_criteria_check:
    - criterion: "運行 npm test src/utils/ 全部通過"
      verified: true
      evidence: "12 passed, 0 failed"
    - criterion: "lint 無錯誤"
      verified: true
      evidence: "lint 返回 passed，但有 3 個警告"

# Concern 字段（在 evidence 之外）：
# 關注點：lint 有 3 個警告，其中 'Unexpected console statement' 是任務要求添加的 console.error
# 影響：這些警告不會阻止代碼運行，但可能影響 CI 的 lint 評分
# 建議：CI 配置應該允許警告通過，或者我們應該統一處理這些警告
```

### 範例 3：失敗回流（BLOCKED）

```yaml
evidence:
  commands_run:
    - command: "npm test src/api/user.test.ts"
      output: "FAIL src/api/user.test.ts\n  ✕ should handle concurrent requests\n    expect(received).toBe(expected)\n    Expected: 1\n    Received: 3"
      status: "failed"

  file_changes:
    modified: ["src/api/user.ts"]
    planned: ["src/api/user.ts"]
    out_of_scope: []

  success_criteria_check:
    - criterion: "運行 npm test src/api/user.test.ts 全部通過"
      verified: false
      evidence: "should handle concurrent requests 測試失敗——期望 1 個結果但收到 3 個"
```

---

## 常見錯誤填法

### 錯誤 1：Evidence 為空

```yaml
# ❌ 錯誤：
evidence: {}

# ✅ 正確：填寫所有必填字段
```

### 錯誤 2：命令是推測，不是實際執行

```yaml
# ❌ 錯誤：
commands_run:
  - command: "npm test src/auth/"
    output: "應該能通過，因為我檢查了代碼邏輯"
    status: "passed"

# ✅ 正確：
commands_run:
  - command: "npm test src/auth/"
    output: "Test Suites: 1 passed, 1 total\nTests: 3 passed, 3 total"
    status: "passed"
```

### 錯誤 3：超範圍修改沒有報告

```yaml
# ❌ 錯誤：
file_changes:
  modified: ["src/api/user.ts", "src/utils/helpers.ts"]
  planned: ["src/api/user.ts"]
  out_of_scope: []  # ← helpers.ts 不在 planned 中，但這裡是空的

# ✅ 正確：
file_changes:
  modified: ["src/api/user.ts", "src/utils/helpers.ts"]
  planned: ["src/api/user.ts"]
  out_of_scope: ["src/utils/helpers.ts"]
```

### 錯誤 4：成功標準檢查不完整

```yaml
# ❌ 錯誤（移交單有 3 條標準，這裡只檢查了 1 條）：
success_criteria_check:
  - criterion: "運行 npm test src/auth/ 全部通過"
    verified: true
    evidence: "18 passed"

# ✅ 正確（3 條都檢查）：
success_criteria_check:
  - criterion: "運行 npm test src/auth/ 全部通過"
    verified: true
    evidence: "18 passed"
  - criterion: "git diff 只涉及 login.ts"
    verified: true
    evidence: "git diff --name-only 只有 login.ts"
  - criterion: "TypeScript 編譯通過"
    verified: true
    evidence: "tsc 輸出 Found 0 errors"
```

---

*Phase 1 完成 2026-05-02*
