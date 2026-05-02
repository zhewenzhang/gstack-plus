# Qwen Code 修正任務（3 個文件，4 個問題）

> **給 Qwen Code 的工作指令**
> 工作目錄：`D:\gstack-plus`
> 上一輪優化未完成。以下是需要修正的具體缺失，請逐一處理。

---

## 修正 1：`classifier/test-tasks.md` — Task 8 消失了，需要補回

**問題**：Task 8 在上一輪被**刪除**。文件目前從 Task 7（Tier-Exec 區）直接跳到 Task 9（Tier-Mid 區）。任務不見了，不是被移位了。

**需要做的事**：在 Tier-A 任務區（Tasks 14-18 之後），**新增** Task 8 的完整條目，內容如下：

---

把以下完整內容插入到「Task 18」之後、「邊界案例」（Task 19）之前：

```markdown
### 任務 19（原 Task 8，移入 Tier-A 區）：認證系統安全審查

**任務描述**：對現有的用戶認證模組（JWT + refresh token 機制）進行完整的安全審查，識別潛在漏洞，並提出修復建議。

**正確路由**：Tier-A

**評分**：
| 維度 | 分數 | 理由 |
|------|------|------|
| 判斷強度 | 4 | 需要評估安全風險的嚴重性，OWASP checklist 告訴你「查什麼」，但不告訴你「這個項目的風險有多高」 |
| 上下文寬度 | 3 | 需要理解認證模組與其他模組的交互邏輯 |
| 風險權重 | 4 | 安全漏洞直接影響用戶數據，生產事故風險高 |
| 可驗證性 | 2 | 「沒有已知漏洞」難以客觀驗證，依賴審查者的判斷 |
| 創意密度 | 2 | 有 OWASP 框架可參考，但應用到具體代碼需要判斷 |

**路由推導**：
- 判斷強度 = 4 → 觸發 Tier-A 條件（判斷 ≥ 4）✓
- 風險權重 = 4 → 觸發 Tier-A 條件（風險 ≥ 4）✓
- 兩個條件都獨立觸發 Tier-A，路由結果明確。

**保守路由原則示範（這個任務最容易判斷錯）**：

OWASP checklist 的存在讓人誤以為「照 checklist 做就好，不需要 Tier-A 的深度判斷」。這個想法是錯的，原因：

1. **Checklist 告訴你「查什麼」，不告訴你「這個代碼的風險有多高」**
   OWASP 說要檢查「token 過期機制」——但你的代碼的 token 過期是設 1 小時還是 7 天，哪個對你的用戶場景更合適？這需要業務判斷，不在 checklist 裡。

2. **安全任務的代價是不對稱的**
   用 Tier-Exec 執行安全審查，漏掉一個中危漏洞 → 可能導致生產事故，修復成本 100x。
   用 Tier-A 多花的 token → 成本多 30-50%。
   保守路由的成本遠低於漏掉的風險。

3. **可驗證性 = 2，強化 Tier-A 的必要性**
   Tier-Exec 適合「可驗性 ≥ 4」的任務（能用命令驗證）。安全審查的結論是主觀的，Tier-Exec 無法自我驗證是否「做到位了」。
```

**注意**：插入後，原來的 Task 19（邊界案例）編號改為 Task 20，Task 20 改為 Task 21。如果原文件中邊界案例有固定的說明「任務 19-20 是邊界案例」，對應更新為「任務 20-21」。

---

## 修正 2：`verification/pre-flight-checklist.md` — C2 重試次數錯誤

**問題**：C2 目前寫的是「BUILD_ERROR 可重試 **1** 次」，但 `PROJECT_ROADMAP.md` 和 `verification/failure-catalog.md` 都明確是「最多 **2** 次」。

**找到 C2 的原文**（目前是）：
```
- [ ] C2. Exec 最多重試次數已明確（預設：BUILD_ERROR 可重試 1 次，其他不重試）
```

**替換為**：
```markdown
- [ ] C2. Exec 最多重試次數已明確（預設：BUILD_ERROR 可重試 **2 次**，其他不重試）

  > 第 1 次：Exec 讀取錯誤信息，自行修復後重試。
  > 第 2 次：若第 1 次修復後仍然失敗，給第 2 次機會。
  > 第 2 次後仍失敗 → 升級 Tier-Mid，不再讓 Exec 繼續嘗試。
```

---

## 修正 3：`verification/failure-catalog.md` — 補兩個缺失說明

### 3a. BUILD_ERROR 區塊末尾加 TypeScript 特定識別提示

**在 BUILD_ERROR 類型的「識別信號」列表末尾**加入以下內容（在「與其他類型的區別」之前）：

```markdown
**TypeScript 項目常見子類（識別更快）**：

| 錯誤信息模式 | 含義 | Exec 優先動作 |
|------------|------|-------------|
| `Type 'X' is not assignable to type 'Y'` | 類型不匹配，通常是介面定義改了但使用處未更新 | 找到 X 和 Y 的定義，確認哪個需要更新 |
| `Cannot find name 'X'` / `Module has no exported member 'X'` | 缺少 import 或 export | **先全局搜索 X 是否已在其他文件定義**，再決定是補 import 還是新建類型 |
| `Property 'X' does not exist on type 'Y'` | 對象結構與類型定義不符 | 對照類型定義，確認是代碼錯還是類型定義需要更新 |
| `Object is possibly 'undefined'` | 缺少空值檢查 | 加 `?.` 或 `!` 或 `if` 判斷，根據業務邏輯選擇 |

**Exec 在 TypeScript 項目中最常見的錯誤**：遇到 `Cannot find name` 時直接新建類型，但該類型其實已在其他文件定義。
修復前，先執行：`grep -r "TypeName" src/` 確認是否已有定義。
```

### 3b. SCOPE_DRIFT 區塊末尾加「調用 vs 修改」邊界說明

**在 SCOPE_DRIFT 類型的定義段落後**（「識別信號」之前）加入以下內容：

```markdown
**重要邊界：「調用」不等於「修改」**

| Exec 的行為 | 是否觸發 SCOPE_DRIFT | 應對方式 |
|------------|---------------------|---------|
| **import** Scope Lock 外的工具函數（只讀取） | ❌ 不觸發 | 正常完成，在 evidence 的 `out_of_scope` 欄位說明即可 |
| **修改** Scope Lock 外的文件（任何寫入） | ✅ 觸發 | 停止，報告 SCOPE_DRIFT |
| 在 Scope Lock 外的目錄**新建文件** | ✅ 觸發 | 停止，報告 SCOPE_DRIFT |

**30 秒判斷法**：執行 `git diff --name-only`，把結果與 plan-to-exec.md 的「允許修改文件」列表對比。
- 所有變更都在允許列表裡 → 沒問題
- 出現列表外的文件被修改或新建 → SCOPE_DRIFT，停止執行

Import 語句出現在允許修改的文件裡，不算「修改被 import 的文件」。
```

---

## 完成後自查

- [ ] `test-tasks.md`：搜索「Task 8」，能找到嗎？或者搜索「認證系統安全審查」，在 Tier-A 區嗎？
- [ ] `test-tasks.md`：邊界案例的任務編號已相應更新（19→20, 20→21）
- [ ] `pre-flight-checklist.md`：搜索「C2」，看到的是「**2 次**」而不是「1 次」，且下方有三行縮進說明
- [ ] `failure-catalog.md`：搜索「TypeScript 項目常見子類」，能找到這個標題
- [ ] `failure-catalog.md`：搜索「調用」不等於「修改」，能找到這個說明
- [ ] 其他文件未被動

---

*Claude 修正指令 2026-05-02*
