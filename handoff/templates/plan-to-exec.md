# Exec 任務移交單

> Tier-A（Architect）→ Tier-Exec（Executor）的標準移交格式。
>
> **鐵律**：此模板中的每個字段都是必填。留空 = 移交不合格，Exec 有權拒絕接受。

## 基本信息

- **任務 ID**：`[唯一標識，格式 EXEC-YYYYMMDD-NNN]`
- **項目**：`[項目名稱]`
- **發起 Tier**：Tier-A（Architect）
- **執行 Tier**：Tier-Exec（Executor）
- **預估複雜度**：`[低 / 中]`（如果評為「高」，請重新評估此任務是否應該由 Tier-Exec 執行）

---

## 任務描述

`[具體描述，必須包含：文件路徑、行號（如適用）、要做什麼、不能做什麼]`

**格式要求**：
- 必須引用具體文件路徑（如 `src/auth/login.ts`）
- 如涉及函數，必須寫明函數名、參數、返回值
- 如涉及 UI，必須說明預期行為（「點擊按鈕 X 後，彈出確認對話框」）

**禁止使用的表達**：
「適當的」「合理的」「如果需要」「根據情況」「類似地」「以此類推」

> 這些詞出現在描述中，視為本移交單格式不合格，Exec 有權拒絕接受。
> 詳情見 `shared/forbidden-words.md`。

---

## 成功標準

必須是可用命令驗證的條件（至少填 2 條）：

- [ ] [條件 1：例如「運行 `npm test src/auth/` 全部通過」]
- [ ] [條件 2：例如「`git diff` 只涉及以下 3 個文件」]
- [ ] [條件 3：如有]

**驗證規則**：每條成功標準必須能用一條命令或一個具體操作驗證。不接受「代碼看起來正確」的主觀判斷。

---

## 允許修改的範圍（Scope Lock）

**允許修改的文件**：
- `[文件路徑 1]`
- `[文件路徑 2]`

**明確禁止修改的文件或目錄**：
- `[如有，例如：`src/db/migrations/`（不要修改數據庫遷移文件）]`

**超出範圍的修改處理**：
Exec 如果認為需要修改列表外的文件，必須：
1. 在 evidence 中列出建議新增的文件
2. 說明為什麼需要
3. 由 Tier-Mid 在審查階段決定是否接受

---

## 上下文快照

```yaml
context_snapshot:
  current_state: "[1-2 句描述相關代碼的現狀，例如：src/auth/login.ts 目前用 JWT，尚未實作 refresh token]"
  recent_changes:
    - change: "[最近一次相關修改摘要，例如：上週將 session 存儲從 cookie 改為 localStorage]"
      commit: "[commit hash 或 PR 號，如有；沒有可省略]"
    - change: "[更早的相關修改，如有]"
      commit: ""
  known_dependencies:
    - "[本任務依賴的其他組件，例如：依賴 src/utils/token.ts 的 generateToken()]"
  known_risks:
    - "[填寫者已知的潛在問題，例如：timeout 值被 3 個 UI 組件讀取，修改可能有連帶影響]"
```

**填寫指引**：
- 只填已知信息。不確定的字段直接省略，**不要填「不確定」或「待確認」**。
- `recent_changes` 如果沒有相關歷史記錄，整個字段可省略。
- `known_risks` 是選填——如果你知道潛在風險，填進來能幫助 Exec 避坑。

---

## 失敗升級條件

出現以下情況立即停止，回傳 `exec-to-check.md`（填 BLOCKED 狀態）：

- 需要修改「允許修改範圍」以外的文件才能完成任務
- 遇到需要架構判斷的問題（如「不確定 A 方案和 B 方案哪種更好」）
- 連續 2 次嘗試後錯誤未減少
- 發現任務描述與實際代碼狀態不一致（如引用了不存在的函數）

---

## Evidence 格式要求

Exec 完成後必須填寫 `exec-to-check.md`，其中 evidence 字段格式見 `shared/evidence-format.md`。

**不接受沒有 evidence 的完成聲明。**

---

## 使用指南

1. **Tier-A 填寫**：填寫以上所有字段，確保任務描述不含禁用詞、成功標準可驗證、Scope Lock 明確
2. **Tier-A 自查**：填寫完畢後，問自己：「一個對這個項目一無所知的開發者，能只看這份移交單就完成任務嗎？」如果不能 → 補充上下文
3. **發送給 Tier-Exec**：將此文件作為 Exec 的輸入
4. **等待返回**：Exec 返回 `exec-to-check.md`，按證據驗證結果

---

*Phase 1 完成 2026-05-02*
