---
title: Tier-A — 設計 SSO + MFA 認證流程
tier: Tier-A
scores: { judgment: 5, context: 4, risk: 5, verifiability: 2, creativity: 4 }
---

# Tier-A 範例：為 SaaS 設計 SSO + MFA 認證

## 任務描述

> 我們要支援 Google / GitHub SSO，並對 admin 帳號強制 MFA。設計完整的認證流程、token 結構、與既有 session 系統的相容性。

## 5 維評分理由

| 維度 | 分 | 為什麼 |
|------|----|--------|
| 判斷強度 | 5 | OAuth flow 選擇（implicit vs PKCE）、token 存儲（cookie vs localStorage）等多個取捨 |
| 上下文寬度 | 4 | 跨 auth、session、user model、frontend、SDK |
| 風險權重 | 5 | 認證設計錯誤 = 安全漏洞 |
| 可驗證性 | 2 | 設計文件無法用命令驗證，需 review |
| 創意密度 | 4 | 既有方案多但需根據 SaaS 上下文取捨 |

## 路由決策

`judgment=5 ≥ 4` ∨ `risk=5 ≥ 4` ∨ `creativity=4 ≥ 4` → **Tier-A**

三個條件**都獨立觸發** Tier-A，路由非常確定。

## 為什麼這個任務不能交給 Tier-Mid

- Tier-Mid 善於「在既定方案下執行細節」，但 SSO + MFA 的方案本身需要先設計
- 風險權重 = 5 觸發保守路由原則：寧可貴一點用 Tier-A，也不要因設計失誤踩雷
- 可驗證性 = 2，意味著就算 Tier-Mid 做了，Tier-A 也得花時間 review，不如一開始就讓 Tier-A 設計
