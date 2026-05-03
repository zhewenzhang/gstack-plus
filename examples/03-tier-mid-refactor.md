---
title: Tier-Mid — 重構 user service
tier: Tier-Mid
scores: { judgment: 3, context: 3, risk: 3, verifiability: 4, creativity: 2 }
---

# Tier-Mid 範例：把 `UserService` 拆成 `UserQuery` + `UserCommand`

## 任務描述

> 現在的 `UserService` 同時管讀寫，類別膨脹到 800 行。按 CQRS 風格拆成 `UserQuery`（讀）+ `UserCommand`（寫）。

## 5 維評分理由

| 維度 | 分 | 為什麼 |
|------|----|--------|
| 判斷強度 | 3 | 拆分點需要審視（哪些方法歸 Query / 哪些歸 Command） |
| 上下文寬度 | 3 | 要讀整個 UserService + 所有呼叫處 |
| 風險權重 | 3 | 改動會影響多個 caller，但有測試覆蓋 |
| 可驗證性 | 4 | 既有單元測試 + tsc 可驗 |
| 創意密度 | 2 | 套用既有 CQRS 模式 |

## 路由決策

未觸發 Tier-A 條件（無一項 ≥ 4 是 judgment/risk/creativity）；未滿足 Tier-Exec 全條件（judgment=3 > 2）→ **Tier-Mid**

## 為什麼不是 Tier-A

- 模式（CQRS）已定，不需要架構決策
- 風險中等：caller 都在同一個 monorepo，改動可被 tsc 抓到

## 為什麼不是 Tier-Exec

- 拆分點需要看 method 語意做判斷（例如 `findOrCreate` 算讀還是寫？）
- Exec 沒有判斷力決定「歸類邊界」
