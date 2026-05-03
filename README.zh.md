<div align="center">

# gstack<sup>+</sup>

**多層 AI 模型編排框架 —— 讓每個任務路由到正確的 Tier。**

[![Docs](https://img.shields.io/badge/docs-online-000000?style=flat-square)](https://zhewenzhang.github.io/gstack-plus/)
[![npm](https://img.shields.io/npm/v/gstack-plus?style=flat-square&color=000000)](https://www.npmjs.com/package/gstack-plus)
[![Playground](https://img.shields.io/badge/playground-try%20it%20live-6F6F6F?style=flat-square)](https://zhewenzhang.github.io/gstack-plus/#/playground)
[![License](https://img.shields.io/badge/license-MIT-000000?style=flat-square)](./LICENSE)

**[English](./README.md)** | **中文**

</div>

<br/>

> **別讓一個模型扛下所有事。** 讓對的層級做對的事 —— Opus 做判斷、Sonnet 做審查、Exec 做執行。質量不打折，成本砍一半。

---

## 問題

現在的 AI 工作流都犯著同樣的錯誤：**把所有任務丟給同一個模型。**

| 發生了什麼 | 代價 |
|---|---|
| 🔴 **過度花費** — 用 Opus 做 `git rebase` | 浪費 token，反饋變慢 |
| 🔴 **思考不足** — 用便宜模型設計認證遷移 | 危險決策，大量返工 |

## 解決方案

**gstack-plus** 在角色技能庫（[gstack](https://github.com/your-org/gstack)、[superpowers](https://github.com/obra/superpowers)）之上加了一個**分類層**。每個任務按 **5 個維度**評分，然後分派到對應的 Tier：

<div align="center">

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tier&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;模型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 職責 | 何時使用 |
|---|---|---|---|
| **🟣 Tier-A** | Opus / GPT-5 | 判斷與架構決策 | 風險 ≥ 4 或 創意 ≥ 4 |
| **🔵 Tier-Mid** | Sonnet / GPT-4.1 | 審查與驗證 | 介於兩者之間 |
| **🟢 Tier-Exec** | Qwen / DeepSeek | 限範圍執行 | 可驗證且低風險 |

</div>

## 運作方式

```
  你的任務
      │
      ▼
 ┌─────────────┐
 │   分類器     │  5 維度評分
 └──────┬──────┘
        ▼
 ┌──────────────┐
 │  路由規則     │  判斷≥4 或 風險≥4 → Tier-A
 └──────┬───────┘  可驗證且低風險 → Tier-Exec
        ▼           其他 → Tier-Mid
 ┌──────┴──────┬──────────┐
 ▼             ▼          ▼
Tier-A      Tier-Mid   Tier-Exec
(判斷力)     (審查)      (執行)
```

### 5 個維度

| 維度 | 測量什麼 |
|---|---|
| **判斷力** | 需要多少人類等級的決策？ |
| **上下文** | 需要多少代碼庫知識？ |
| **風險** | 做錯的代價有多高？ |
| **可驗證性** | 能否用命令自動驗證？ |
| **創意密度** | 需要多少新穎設計？ |

---

## 快速上手

不需安裝，`npx` 會自動獲取最新版本：

```bash
npx gstack-plus classify "重構認證中間件以支援 OAuth"
```

回答 5 個問題 → 得到路由決策 → 生成預填好的 handoff 文件。

### 常用命令

```bash
# 跳過互動，直接給分數：
gstack-plus classify "重命名 getCwd" --scores 1,1,1,5,1
# → Tier-Exec  ✅

gstack-plus classify "設計 SSO + MFA 認證" --scores 5,4,5,2,4
# → Tier-A  🟣

# 切換英文提示：
gstack-plus --lang en classify "Your task"

# 瀏覽 5 個內建範例：
gstack-plus examples

# 查看最近的 handoff 文件：
gstack-plus history
```

### 安裝

```bash
npm install -g gstack-plus
gstack-plus --version    # 0.2.1
```

---

## 文檔

完整手冊：**[https://zhewenzhang.github.io/gstack-plus/](https://zhewenzhang.github.io/gstack-plus/)**

| 區段 | 內容 |
|---|---|
| [🗺 路線圖](https://zhewenzhang.github.io/gstack-plus/#/doc/roadmap) | 項目階段與時間線 |
| [🏗 架構設計](https://zhewenzhang.github.io/gstack-plus/#/doc/architecture) | 三層模型設計、邊界、成本權衡 |
| [📊 分類器](https://zhewenzhang.github.io/gstack-plus/#/doc/scoring-guide) | 5 維度評分指南 + 路由規則 |
| [📋 交接模板](https://zhewenzhang.github.io/gstack-plus/#/doc/plan-to-exec) | Plan→Exec、Exec→Check、Check→Plan 格式 |
| [🔧 失敗恢復](https://zhewenzhang.github.io/gstack-plus/#/doc/failure-catalog) | 起飛前檢查清單 + 失敗路由樹 |
| [🧪 實驗記錄](https://zhewenzhang.github.io/gstack-plus/#/doc/experiments-readme) | 3 模式 × 3 任務對照實驗 |
| [💡 戰略思考](https://zhewenzhang.github.io/gstack-plus/#/doc/yc-blindspots) | YC 風格盲點分析 |

---

## 項目狀態

**活躍研究項目。** 已發布並持續維護。

| 里程碑 | 狀態 |
|---|---|
| 框架文檔（分類器、模板、恢復機制） | ✅ 完成 |
| CLI v0.1.0（`classify`、`rules`、`--auto`） | ✅ [npm](https://www.npmjs.com/package/gstack-plus) |
| 文檔網站 + Web Playground | ✅ [上線](https://zhewenzhang.github.io/gstack-plus/) |
| 中英雙語切換 | ✅ 完成 |
| CLI v0.2.0（`examples`、`--lang`） | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.2.0) |
| CLI v0.2.1（雙語修復、`history`） | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.2.1) |
| Mode A/B 對照實驗 | 🚧 進行中 |

---

## 倉庫結構

```
classifier/      5 維度評分 + 路由規則
handoff/         Plan→Exec / Exec→Check / Check→Plan 模板
verification/    起飛前檢查清單 + 失敗類型目錄
experiments/     對照實驗規格
docs/            架構設計 + 學習筆記
cli/             npm 包源碼
site/            文檔網站（React + Vite）
```

## 貢獻

文檔修復（錯字、澄清）歡迎 — 見 [CONTRIBUTING.md](./CONTRIBUTING.md)。框架改動請先開 Discussion。

## 授權

MIT — 見 [LICENSE](./LICENSE)。
