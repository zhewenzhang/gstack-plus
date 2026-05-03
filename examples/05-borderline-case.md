---
title: 邊界案例 — 「優化資料庫查詢」
tier: Tier-Mid（但接近 Tier-A）
scores: { judgment: 3, context: 4, risk: 3, verifiability: 3, creativity: 2 }
---

# 邊界案例：把分頁查詢從 `OFFSET` 改為 `cursor-based`

## 任務描述

> 我們的 admin 列表頁在 50k+ 用戶時開始慢。把 `LIMIT/OFFSET` 改為 `WHERE id > cursor LIMIT N` 的 cursor-based 分頁。

## 5 維評分理由

| 維度 | 分 | 為什麼 |
|------|----|--------|
| 判斷強度 | 3 | 模式已知（cursor-based），但要決定 cursor 用 PK 還是 timestamp |
| 上下文寬度 | 4 | 改 SQL + API + frontend pagination state |
| 風險權重 | 3 | 改錯了會看到亂序或重複，但不會掉資料 |
| 可驗證性 | 3 | 部分可測（SQL 結果），但「使用者體驗」要人看 |
| 創意密度 | 2 | 套既有 cursor pagination 模式 |

## 路由決策

無一項 ≥ 4（judgment / risk / creativity）→ 不觸發 Tier-A
judgment = 3 > 2 → 不滿足 Tier-Exec
→ **Tier-Mid**

## 為什麼這是邊界案例

- 上下文寬度 = 4，**很接近** Tier-A 的觸發條件，但 routing 規則只認三個關鍵維度
- 如果 cursor 設計錯（用 timestamp 但有重複時間戳），會出現「跳過某些 row」的 bug — 這是判斷強度應該是 4 的訊號，但你最初評估時可能低估
- **保守路由原則**：不確定時往上抬。如果你猶豫 judgment 是 3 還是 4，選 4，就會路由到 Tier-A

## 教訓

5 維評分**有主觀性**。為了保守，遇到「有點難說 3 還是 4」時，建議：
- 風險維度：取較高那個
- 判斷維度：取較高那個
- 其他：照感覺
