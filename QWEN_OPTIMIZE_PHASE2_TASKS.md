# Qwen Code Phase 2 優化任務（3 個精準修正）

> **給 Qwen Code 的工作指令**
> 工作目錄：`D:\gstack-plus`
> Phase 2 整體品質高，5/5 場景路由正確。
> 以下 3 個缺口需要修正，其中修正 1 是**邏輯錯誤**（數字不一致），必須先修。

---

## 修正 1：`verification/pre-flight-checklist.md` — BUILD_ERROR 重試次數與其他文件不一致（必修）

**問題（數字矛盾）**：

| 文件 | BUILD_ERROR 最大重試次數 |
|------|------------------------|
| `PROJECT_ROADMAP.md`（來源真相） | **2 次** |
| `verification/failure-catalog.md` | **2 次** ✓ |
| `verification/failure-routing.md` | **2 次** ✓（推測）|
| `verification/pre-flight-checklist.md` | **1 次** ❌ 矛盾 |

`pre-flight-checklist.md` 的 Section C，C2 項目目前寫的是：
> 「預設：BUILD_ERROR 可重試 1 次，其他不重試」

這與 `PROJECT_ROADMAP.md` 和 `failure-catalog.md` 的「最多 2 次」矛盾。

**修正方式**：找到 C2 項目，把「1 次」改為「2 次」：

```markdown
- [ ] C2. Exec 最多重試次數已明確（預設：BUILD_ERROR 可重試 **2 次**，其他不重試）
```

同時在 C2 下方加一行說明，解釋為什麼是 2 次（讓填寫者理解原因，不只是數字）：

```markdown
  （第 1 次：Exec 讀錯誤信息自行修復；第 2 次：若第 1 次修復後仍失敗，給第 2 次機會。
   第 2 次後仍失敗 → 升級到 Tier-Mid，不再給 Exec 重試機會）
```

---

## 修正 2：`verification/failure-catalog.md` — BUILD_ERROR 補 TypeScript 特定識別提示

**問題**：`failure-catalog.md` 的 BUILD_ERROR 識別信號是通用的（「命令輸出有錯誤字樣」），但 TypeScript 項目中最常見的 BUILD_ERROR 類型有特定模式，目前沒有覆蓋。這個問題由 `failure-scenarios.md` 的自我評估記錄（評估表中「需要改進的地方」欄位）提出。

**修正方式**：在 BUILD_ERROR 的「識別信號」列表末尾，加入 TypeScript 特定的識別子類：

```markdown
**TypeScript 項目常見子類（識別更快）**：
- `Type 'X' is not assignable to type 'Y'` → 類型不匹配，通常是介面定義改了但使用處沒更新
- `Cannot find name 'X'` / `Module has no exported member 'X'` → 缺少 import 或 export，
  **先檢查 X 是否在其他文件已定義**（Exec 常見錯誤：重複定義已存在的類型）
- `Property 'X' does not exist on type 'Y'` → 對象結構與類型定義不符
- `Object is possibly 'undefined'` / `Object is possibly 'null'` → 需要加空值檢查

**TypeScript BUILD_ERROR 的 Exec 自我修復提示**：
遇到 `Cannot find name` 或 `Module has no exported member` 時，**先搜索整個項目是否已有相同名稱的定義**，再決定是「補 import」還是「新建類型」。重複定義是 Exec 在 TypeScript 項目中最常見的錯誤。
```

---

## 修正 3：`verification/failure-catalog.md` — SCOPE_DRIFT 補「調用 vs 修改」邊界說明

**問題**：`failure-catalog.md` 的 SCOPE_DRIFT 類型目前沒有說明一個關鍵邊界：Exec **調用**（import/call）Scope Lock 範圍外的代碼，和 **修改**範圍外的代碼，應該有不同的處理方式。這個問題由 `failure-scenarios.md` 的自我評估記錄提出。

**修正方式**：在 SCOPE_DRIFT 的定義或「與其他類型的區別」段落後，加入以下澄清：

```markdown
**重要邊界：「調用」不等於「修改」**

| 行為 | 是否觸發 SCOPE_DRIFT | 處理方式 |
|------|---------------------|---------|
| Exec **import** 了 Scope Lock 外的工具函數（只讀取，不修改） | ❌ **不觸發** | 正常完成，在 evidence 的 `out_of_scope` 欄位說明原因 |
| Exec **修改**了 Scope Lock 外的文件（寫入、重構） | ✅ **觸發** | 報告 SCOPE_DRIFT，停止執行，等待 Tier-A 評估 |
| Exec **創建了新文件**在 Scope Lock 外的目錄 | ✅ **觸發** | 同上 |

**判斷訣竅**：打開 `git diff`，如果變更只出現在允許的文件列表裡 → 沒問題；
如果出現了計劃外的文件被修改 → SCOPE_DRIFT。
Import 語句本身不算「修改」被 import 的文件。
```

---

## 完成後自查

- [ ] `pre-flight-checklist.md` C2：BUILD_ERROR 重試次數改為 **2 次**，並有原因說明
- [ ] `failure-catalog.md` BUILD_ERROR：識別信號末尾有 TypeScript 特定子類說明
- [ ] `failure-catalog.md` SCOPE_DRIFT：有「調用 vs 修改」對照表
- [ ] 其他文件未被修改

---

*Claude 審查生成 2026-05-02*
