---
title: Tier-Exec — 重命名工具函數
tier: Tier-Exec
scores: { judgment: 1, context: 2, risk: 1, verifiability: 5, creativity: 1 }
---

# Tier-Exec 範例：跨專案重命名 `getCwd → getCurrentWorkingDirectory`

## 任務描述

> 把 `src/utils/path.ts` 裡的 `getCwd` 重命名為 `getCurrentWorkingDirectory`，並更新所有 import。

## 5 維評分理由

| 維度 | 分 | 為什麼 |
|------|----|--------|
| 判斷強度 | 1 | IDE rename 即可 |
| 上下文寬度 | 2 | 跨多個檔案，但範圍清楚（同一函式） |
| 風險權重 | 1 | 純重命名，行為不變 |
| 可驗證性 | 5 | `tsc --noEmit && grep -r 'getCwd' src/` 應為空 |
| 創意密度 | 1 | 機械操作 |

## 路由決策

`judgment ≤ 2 ∧ context ≤ 2 ∧ verifiability ≥ 4` → **Tier-Exec**

## 觀察

「跨多個檔案」≠「需要 Tier-Mid」。重點是**改動的本質**是否需要判斷。重命名不需要。
