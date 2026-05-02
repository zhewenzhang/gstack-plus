# Exec 完成報告

> Tier-Exec（Executor）→ Tier-Mid（Reviewer）的標準返回格式。
>
> **鐵律**：evidence 字段絕不接受空。沒有 evidence = 未完成。

## 基本信息

- **對應任務 ID**：`[對應 plan-to-exec.md 的 EXEC-xxx]`
- **完成狀態**：`[DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED]`
- **完成時間**：`[ISO 8601，如 2026-05-02T14:30:00Z]`

---

## 狀態說明

**DONE**：
所有成功標準已驗證通過，無超範圍修改。任務完全完成。

**DONE_WITH_CONCERNS**：
任務完成了，但有值得注意的地方（必須在下方 Concerns 字段中說明）。
典型場景：
- 發現了移交單中沒有提到的依賴問題
- 某個成功標準的驗證結果是「邊緣情況通過」
- 代碼量超出預期，可能有性能影響

**NEEDS_CONTEXT**：
任務無法完成，因為缺少關鍵上下文（必須在下方說明缺少什麼）。
需要 Tier-A 補充信息後重新分派。
典型場景：
- 引用的函數/文件不存在
- 需要知道某個環境變量的值
- 任務描述與實際代碼狀態矛盾

**BLOCKED**：
遇到需要架構判斷的問題，或連續 2 次失敗。
升級到 Tier-Mid 分析，可能進一步回流到 Tier-A。
典型場景：
- 需要修改 Scope Lock 以外的文件
- 兩個方案都合理，不確定選哪個
- 測試反覆失敗，找不到根因

---

## Evidence（必填，不接受空字段）

```yaml
evidence:
  commands_run:
    - command: "[實際執行的命令，如 'npm test src/auth/']"
      output: "[輸出結果。如果太長，貼前 5 行 + '...' + 最後 3 行]"
      status: "passed / failed"
    - command: "[第二個命令，如 'npm run typecheck']"
      output: "[輸出]"
      status: "passed / failed"

  file_changes:
    modified: ["[實際修改的文件 1]", "[實際修改的文件 2]"]
    planned: ["[移交單中允許的文件 1]", "[移交單中允許的文件 2]"]
    out_of_scope: ["[超出範圍的文件，如無則填 []]"]

  success_criteria_check:
    - criterion: "[成功標準 1 原文，從 plan-to-exec.md 複製]"
      verified: true / false
      evidence: "[如何驗證的，如 'npm test 輸出顯示 18 passed, 0 failed']"
    - criterion: "[成功標準 2 原文]"
      verified: true / false
      evidence: "[如何驗證的]"
```

**驗證規則**：
- `commands_run` 至少要有 1 條記錄
- `file_changes.modified` 中的每個文件必須在 `file_changes.planned` 中，否則必須在 `out_of_scope` 中說明
- `success_criteria_check` 的條目數必須等於 plan-to-exec.md 中的成功標準條數

---

## Concerns（狀態為 DONE_WITH_CONCERNS 或 BLOCKED 時必填）

`[說明遇到了什麼、嘗試了什麼、為什麼停下來]`

**格式建議**：
```
關注點：[一句話描述]
影響：[這可能導致什麼問題]
建議：[Exec 視角的建議——不是架構判斷，是執行觀察]
```

---

## 給 Tier-Mid 的建議

`[Exec 視角的建議。不是架構判斷，是執行過程中的觀察。]`

示例：
- 「這個文件比預期的大，修改時感覺結構可以改進，但不確定是否屬於我的任務範圍」
- 「測試中有 1 個警告，不是我的改動引起的，但值得注意」
- 「任務描述提到的函數簽名和實際代碼不一致，我按自己的理解調整了」

---

## 使用指南

1. **Exec 填寫**：填寫以上所有字段，確保 evidence 不為空
2. **Exec 自查**：填寫完畢後，問自己：「Tier-Mid 只看這份報告，能判斷我完成了任務嗎？」如果不能 → 補充證據
3. **發送給 Tier-Mid**：將此文件作為審查的輸入
4. **等待返回**：Tier-Mid 審查後，可能接受、要求修復、或回流到 Tier-A（使用 `check-to-plan.md`）

---

*Phase 1 完成 2026-05-02*
