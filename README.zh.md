<div align="center">

# gstack<sup>+</sup>

**多層 AI 模型編排框架 —— 讓每個任務路由到正確的 Tier。**

[![npm](https://img.shields.io/npm/v/gstack-plus?style=flat-square&color=000000&label=npm%20v0.5.0)](https://www.npmjs.com/package/gstack-plus)
[![Docs](https://img.shields.io/badge/docs-online-000000?style=flat-square)](https://zhewenzhang.github.io/gstack-plus/)
[![Playground](https://img.shields.io/badge/playground-try%20it%20live-6F6F6F?style=flat-square)](https://zhewenzhang.github.io/gstack-plus/#/playground)
[![License](https://img.shields.io/badge/license-MIT-000000?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/status-active-10b981?style=flat-square)]()

[**English**](./README.md) &nbsp;·&nbsp; [**中文**](#)

[**🎮 打開試玩場**](https://zhewenzhang.github.io/gstack-plus/#/playground) &nbsp;·&nbsp;
[**📖 閱讀文檔**](https://zhewenzhang.github.io/gstack-plus/) &nbsp;·&nbsp;
[**🚀 安裝 CLI**](#快速上手)

</div>

<br/>

> **別讓一個模型扛下所有事。** 讓對的層級做對的事 —— Opus 做判斷、Sonnet 做審查、Exec 做執行。質量不打折，成本砍一半。

<div align="center">

### 實驗結果：3 任務成本 + 質量基準

| 任務 | 路由到 | 全部 Opus 成本 | 路由成本 | 節省 | 質量 |
|---|---|---|---|---|---|
| 跨專案重命名函數 | Tier-Exec → Qwen | $0.01173 | $0.00014 | **−99%** | Opus 5/5 · Qwen 3/5 |
| 重構為 React Query v5 | Tier-Mid → Sonnet | $0.07849 | $0.01191 | **−85%** | Opus 4/5 · **Sonnet 5/5** ✓ |
| 設計 SSO + MFA 認證 | Tier-A → Opus | $0.07885 | $0.07885 | — | 兩版持平 |
| **合計** | | **$0.1691** | **$0.0909** | **−46%** | 質量持平 |

*Sonnet 在中等複雜度任務以 85% 更低成本勝過 Opus。→ [完整報告](experiments/token-comparison/RESULTS.md)*

**Series 2 更新（2026-05-05）— 9 任務，30 任務路由驗證：**

| 實驗 | 結果 |
|------|------|
| 路由準確率 | **100%**（30/30 任務，Exp-2A） |
| 路由穩定性 | **87%** 平均（±1 偏差抵抗力） |
| 成本節省 vs All-Opus | **27%**（混合分布）— Tier-Exec 任務 **98%** |
| 質量：All-Opus vs 路由 | **14.1/15 = 14.1/15**（LLM-as-Judge 盲評，Exp-2C） |
| 最關鍵評分維度 | **判斷強度**（±1 變化影響 32% 任務路由） |

**Series 3 更新（2026-05-05）— Prompt 優化 × 真實語料庫：**

| 實驗 | 結果 |
|------|------|
| 最優 Sonnet 策略（S1） | **15.0/15** vs Opus 12.7/15 —— Sonnet **勝出** |
| S1 策略成本 | **$0.006/任務** vs Opus $0.045 —— **便宜 86%，品質更好** |
| 真實任務路由準確率 | **100%**（20/20 來自 git 歷史的真實任務，Exp-3B） |
| 語料庫分布 | 45% Exec · 35% Mid · 20% Tier-A |

</div>

---

## 問題

現在的 AI 工作流都犯著同樣的錯誤：**把所有任務丟給同一個模型。**

| 發生了什麼 | 代價 |
|---|---|
| 🔴 **過度花費** — 用 Opus 做 `git rebase` | 浪費 token，反饋變慢 |
| 🔴 **思考不足** — 用 Haiku 設計認證遷移 | 危險決策，大量返工 |

## 解決方案

**gstack-plus** 在角色技能庫（gstack、[superpowers](https://github.com/obra/superpowers)）之上加了一個**路由層**。每個任務按 **5 個維度**評分，然後分派到對應的 Tier。

<div align="center">

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tier&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;模型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 職責 | 何時使用 |
|---|---|---|---|
| **🟣 Tier-A** | Opus / GPT-5 | 判斷與架構決策 | 風險 ≥ 4 或 創意 ≥ 4 |
| **🔵 Tier-Mid** | Sonnet / GPT-4.1 | 審查與複雜實現 | 介於兩者之間 |
| **🟢 Tier-Exec** | Qwen / DeepSeek | 限範圍精確執行 | 可驗證且低風險 |

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
 └──────┬───────┘  可驗證且低判斷/上下文 → Tier-Exec
        ▼           其他 → Tier-Mid
 ┌──────┴──────┬──────────┐
 ▼             ▼          ▼
Tier-A      Tier-Mid   Tier-Exec
(判斷力)     (審查)      (執行)
```

### 5 個維度

| 維度 | 測量什麼 |
|---|---|
| **判斷強度** | 需要多少人類等級的決策？ |
| **上下文寬度** | 需要多少代碼庫知識？ |
| **風險** | 做錯的代價有多高？ |
| **可驗證性** | 能否自動驗證結果？ |
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
gstack-plus classify "設計 SSO + MFA" --scores 5,4,5,2,4

# 切換英文提示：
gstack-plus --lang en classify "Your task"

# 瀏覽 5 個內建範例：
gstack-plus examples

# 查看最近的 handoff 文件：
gstack-plus history
```

### 輸出預覽

```text
$ gstack-plus classify "設計 SSO + MFA 認證" --scores 5,4,5,2,4

────────────────────────────────────────────────
  判斷強度    ██████████  5
  上下文寬度  ████████░░  4
  風險        ██████████  5
  可驗證性    ████░░░░░░  2
  創意密度    ████████░░  4

路由決策：Tier-A
原因：Tier-A 觸發：判斷=5 ≥ 4，風險=5 ≥ 4，創意=4 ≥ 4

✓ Handoff 文件已寫入 → handoffs/handoff-2026-05-04-x7k2.md
```

> 觸發 Tier-A 的維度（判斷 / 風險 / 創意 ≥ 4）在終端中以**洋紅色**高亮。

### 安裝

```bash
npm install -g gstack-plus
gstack-plus --version    # 0.5.0
```

---

## Web Playground

不想用 CLI？直接在瀏覽器試用：**[https://zhewenzhang.github.io/gstack-plus/#/playground](https://zhewenzhang.github.io/gstack-plus/#/playground)**

| 功能 | 說明 |
|---|---|
| **五維雷達圖** | 即時 SVG 圖表，顏色對應 Tier（紫/藍/綠） |
| **12 個預設任務** | 涵蓋 Exec / Mid / Tier-A / 邊界案例 |
| **臨界提示** | 顯示哪個維度 ±1 會改變路由 |
| **Prompt Builder** | 選角色 × 選工作模式 → 生成可直接貼入 AI 的 System Prompt |
| **S1 增強模式** | 一鍵開啟，讓 Sonnet 達到 Opus 品質（Series 3 驗證） |
| **分享 URL** | 保存任務 + 評分，可直接分享 |

---

## 文檔

完整手冊：**[https://zhewenzhang.github.io/gstack-plus/](https://zhewenzhang.github.io/gstack-plus/)**

| 區段 | 內容 |
|---|---|
| [🚀 快速上手](https://zhewenzhang.github.io/gstack-plus/#/doc/getting-started) | 安裝 CLI，5 分鐘內做出第一個路由決策 |
| [🏗 三層架構](https://zhewenzhang.github.io/gstack-plus/#/doc/architecture) | 三層模型設計、邊界、成本權衡 |
| [📊 分類與路由](https://zhewenzhang.github.io/gstack-plus/#/doc/scoring-guide) | 5 維度評分指南 + 路由規則 |
| [📋 交接與防護](https://zhewenzhang.github.io/gstack-plus/#/doc/plan-to-exec) | Plan→Exec、Exec→Check、起飛前檢查清單 |
| [💡 完整範例](https://zhewenzhang.github.io/gstack-plus/#/doc/ex-tier-exec-eslint) | 5 個真實任務的完整評分決策 |
| [🧪 實驗 Series 2](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-2) | 路由穩定性 + 成本基準 + LLM-as-Judge 盲評 |
| [🔬 實驗 Series 3](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-3) | S1 Prompt 策略讓 Sonnet 超越 Opus |

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
| CLI v0.3.0（語言感知路由、文檔網站） | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.0) |
| CLI v0.3.1（`config` 命令） | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.1) |
| CLI v0.3.2（雙語側邊欄、CI 工作流） | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.2) |
| CLI v0.3.3（分數條視覺化） | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.3) |
| CLI v0.3.4（`stats`、`open` 命令） | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.3.4) |
| Mode A/B 路由實驗（成本 + 質量） | ✅ [結果](experiments/token-comparison/RESULTS.md) |
| v0.4.0 — Playground、雷達圖、Prompt Builder、12 預設、雙語文檔 | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.4.0) |
| 實驗 Series 2 — 路由穩定性、成本基準、LLM-as-Judge（9 任務） | ✅ [報告](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-2) |
| 實驗 Series 3 — S1 Prompt 策略（Sonnet 超越 Opus）+ 真實語料庫 | ✅ [報告](https://zhewenzhang.github.io/gstack-plus/#/doc/experiment-series-3) |
| v0.5.0 — S1 增強切換、邊界警告、深色模式 | ✅ [Release](https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.5.0) |

---

## 倉庫結構

```
classifier/      5 維度評分 + 路由規則
handoff/         Plan→Exec / Exec→Check / Check→Plan 模板
verification/    起飛前檢查清單 + 失敗類型目錄
experiments/     實驗腳本、原始數據、報告
  series-2/      Series 2（路由穩定性、成本基準、Exp-3A/3B）
  token-comparison/  原始成本對比實驗
docs/            架構設計 + 學習筆記 + 實驗報告（雙語）
cli/             npm 包源碼
site/            文檔網站（React + Vite）
```

## 貢獻

文檔修復（錯字、澄清）歡迎 — 見 [CONTRIBUTING.md](./CONTRIBUTING.md)。框架改動請先開 Discussion。

## 授權

MIT — 見 [LICENSE](./LICENSE)。
