# Pre-Flight 檢查清單

> Tier-A（Architect）把任務派發給 Tier-Exec 之前的「發射前檢查清單」。
>
> **設計來源**：PROJECT_ROADMAP.md Task 2.1 + superpowers `verification-before-completion` 的精神。
>
> **使用時機**：plan-to-exec.md 移交單填完後、正式派發前。
> **填寫者**：Tier-A（Claude Architect）。
> **記錄方式**：把通過的清單附在 plan-to-exec.md 的末尾。

---

## 使用規則

1. **逐項核對**：每個檢查項都要確認，不得跳過
2. **任何一項 ❌**：不能派發，必須先修正 plan-to-exec.md
3. **修正後**：重新核對整個清單，不是只修正那一项
4. **記錄**：通過後把完整清單附在 plan-to-exec.md 末尾

---

## Section A：任務描述清晰度（6 項）

- [ ] **A1.** 任務描述中有具體的文件路徑（例如 `src/xxx.ts` 第 N 行）
- [ ] **A2.** 任務描述中沒有禁用詞（對照 `handoff/templates/shared/forbidden-words.md`）
- [ ] **A3.** 成功標準至少有 2 條可用命令驗證的條件（非主觀判斷）
- [ ] **A4.** 明確列出了「不允許修改」的文件或目錄（Scope Lock 已定義）
- [ ] **A5.** 邊界條件已考慮（null、空值、最大值、錯誤輸入的處理方式已說明）
- [ ] **A6.** 任務不依賴「尚未完成的其他任務」（若有依賴，先完成依賴再派發）

---

## Section B：Tier 分配合理性（3 項）

- [ ] **B1.** 已用 `classifier/scoring-guide.md` 對本任務評分
- [ ] **B2.** 評分結果支持路由到 Tier-Exec（判斷 ≤ 2 AND 上下文 ≤ 2 AND 可驗 ≥ 4）
      （如果不符合，重新路由到正確 Tier）
- [ ] **B3.** 沒有「看起來簡單但其實是 Tier-A 的」隱藏決策
      （自問：如果 Exec 遇到未預期情況，需要架構判斷嗎？）

---

## Section C：失敗回流準備（3 項）

- [ ] **C1.** 已定義「失敗升級條件」（plan-to-exec.md 的對應字段已填寫）
- [ ] **C2.** Exec 最多重試次數已明確（預設：BUILD_ERROR 可重試 1 次，其他不重試）
- [ ] **C3.** 如果 Exec 返回 BLOCKED，清楚誰來接手（Tier-Mid 或 Tier-A）

---

## 發射決策

**Section A 全部通過**：[ 是 / 否 ]
**Section B 全部通過**：[ 是 / 否 ]
**Section C 全部通過**：[ 是 / 否 ]

**決定**：
- ✅ **全部通過** → 可以派發給 Tier-Exec
- 🚫 **有任何 ❌** → 修正後重新檢查，不得派發

---

## 快速參考卡

| 類別 | 關鍵問題 | 通過條件 |
|------|---------|---------|
| **描述** | 給陌生開發者能執行嗎？ | 無需猜測，可直接執行 |
| **標準** | 成功用命令可以驗嗎？ | ≥ 2 個可執行命令 |
| **範圍** | 改了哪裡、不改哪裡？ | 文件列表明確 |
| **Tier** | 評分說明可以 Exec 嗎？ | 路由規則驗證通過 |
| **回流** | 失敗時誰負責？ | 升級路徑明確 |

---

## 使用示例

```
任務：在 src/utils/formatter.ts 中新增 formatCurrency(amount: number, currency: string)
項目：gstack-plus

Section A:
- [x] A1. 文件路徑明確：src/utils/formatter.ts
- [x] A2. 無禁用詞：描述中沒有「適當的」「合理的」等
- [x] A3. 成功標準：「npm test src/utils/ 全部通過」「git diff 只涉及 formatter.ts」
- [x] A4. Scope Lock：允許修改 formatter.ts，禁止修改其他文件
- [x] A5. 邊界條件：null → 拋錯，0 → "¥0.00"，負數 → "-¥X.XX"
- [x] A6. 無依賴：不依賴其他未完成任務

Section B:
- [x] B1. 已評分：判斷=2, 上下文=1, 風險=1, 可驗=4, 創意=1
- [x] B2. 路由驗證：判斷≤2 AND 上下文≤2 AND 可驗≥4 → Tier-Exec
- [x] B3. 無隱藏決策：函數實現有明確規格，不需要架構判斷

Section C:
- [x] C1. 失敗升級條件：需要修改其他文件 → BLOCKED；遇到架構判斷 → BLOCKED
- [x] C2. 重試次數：BUILD_ERROR 可重試 1 次
- [x] C3. BLOCKED 接手方：Tier-Mid 分析 → 如需重規劃則升 Tier-A

發射決策：
Section A 全部通過：是
Section B 全部通過：是
Section C 全部通過：是
決定：✅ 可以派發給 Tier-Exec
```

---

*Phase 2 完成 2026-05-02*
