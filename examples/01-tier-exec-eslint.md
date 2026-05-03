---
title: Tier-Exec — 加 ESLint 配置
tier: Tier-Exec
scores: { judgment: 1, context: 1, risk: 1, verifiability: 5, creativity: 1 }
---

# Tier-Exec 範例：給專案加 ESLint 配置

## 任務描述

> 為 Node.js 專案初始化 ESLint v9 + TypeScript ESLint，禁用 `any` 類型，強制 `===` 比較。

## 5 維評分理由

| 維度 | 分 | 為什麼 |
|------|----|--------|
| 判斷強度 | 1 | 套既有的 ESLint v9 flat config 模板，無架構決策 |
| 上下文寬度 | 1 | 只動 root 的 `package.json` + `eslint.config.mjs` |
| 風險權重 | 1 | 開發工具配置錯了重新跑就好，不影響生產 |
| 可驗證性 | 5 | `npx eslint . && echo OK` 直接驗證 |
| 創意密度 | 1 | 完全照官方文件 |

## 路由決策

`judgment ≤ 2 ∧ context ≤ 2 ∧ verifiability ≥ 4` → **Tier-Exec**

## Handoff 摘要

```yaml
scope_lock:
  - package.json
  - eslint.config.mjs
success_criteria:
  - npx eslint . exit code = 0
  - rules include @typescript-eslint/no-explicit-any: error
  - rules include eqeqeq: error
forbidden:
  - 修改 src/ 任何檔案
  - 引入額外的 plugin（除非為了 TS 支援必要）
retry_policy:
  build_error: 2
  others: 0
```

## 為什麼這個任務適合 Tier-Exec

- 答案空間有限（ESLint 配置範本）
- 失敗信號明確（命令退出碼）
- 沒有「可能有更好方案」的誘惑空間
