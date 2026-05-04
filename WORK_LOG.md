# gstack-plus 工作記錄（Claude × Qwen Code 協作存檔）

> **這份檔案是內部工作記錄，不發布到公開 repo。** 已被 `.gitignore` 排除（透過 `*_TASKS.md` / 內部規則）。
> **用途**：把 Claude 給 Qwen Code 的所有執行指令、執行狀態、產出與經驗教訓，集中在一個檔案，方便未來回顧、寫覆盤文章、或拆出 case study。
>
> **協作模式**：Claude（Opus/Sonnet，Tier-A/Mid）寫指令文件，Qwen Code（Tier-Exec）執行，Claude 驗收，必要時補發修正指令。
>
> **第一條指令日期**：2026-05-02
> **截至本檔更新**：2026-05-03

---

## 0. 一頁總覽

| 階段 | 指令文件 | 範圍 | 狀態 | 對應 commit |
|---|---|---|---|---|
| Phase 0 | `QWEN_LEARNING_TASKS.md` | 11 篇學習筆記（gstack/superpowers 解剖+對比） | ✅ 完成 | `0bbc7ce` |
| Phase 0+ | `QWEN_OPTIMIZE_TASKS.md` (v1→v2) | 11 個學習筆記細修 | ✅ 完成 | `0bbc7ce`–`8e0319d` 之間 |
| Phase 1 | `QWEN_PHASE1_TASKS.md` | 9 個交接模板 + 分類器 + 架構文檔 | ✅ 完成 | `8e0319d` |
| Phase 1 修 | `QWEN_OPTIMIZE_PHASE1_TASKS.md` | 2 處修正（context_snapshot 格式 / Task 8 路由） | ⚠️ 部分完成（Task 8 被誤刪） | — |
| Phase 2 | `QWEN_PHASE2_TASKS.md` | 5 個失敗恢復文檔 | ✅ 完成 | `8e0319d` |
| Phase 2 修 | `QWEN_OPTIMIZE_PHASE2_TASKS.md` | 3 處修正（C2 重試次數 / TS 子類 / SCOPE_DRIFT 邊界） | ❌ 未執行（被 FIX_TASKS 取代） | — |
| 修補 | `QWEN_FIX_TASKS.md` | 修 3 個檔案的 4 個問題（Task 8 重建、C2、catalog 補充） | ✅ 完成 | `8e0319d` |
| Phase 3 | `QWEN_PHASE3_TASKS.md` | 7 個對比實驗 specs（Mode A/B/C） | ✅ 完成（specs 寫好；實驗未執行） | `8e0319d` |
| 文檔網站 | `QWEN_DOCSITE_TASKS.md` | Vite + React + TS + Tailwind + GitHub Pages | ✅ 完成 | `8e0319d`, `899bf09`, `9d7625d`, `5973440` |
| 網站優化 | `QWEN_SITE_OPTIMIZE_TASKS.md` | 響應式 + 子分類 + TOC + 麵包屑 + 上下篇 + 404 | ✅ 完成 | `7b234bb` |
| 倉庫打磨 | `QWEN_REPO_POLISH_TASKS.md` | LICENSE + README 重寫 + CONTRIBUTING + Issue templates + repo metadata | ✅ 完成 | `4bab966` |
| Phase 4 | `QWEN_PHASE4_CLI_TASKS.md` | A 段：清理+補打磨 / B 段：runnable CLI | ✅ 完成 | `4bab966`（A）+ `8a8365f`（B）|
| Phase 5 | `QWEN_PHASE5_TASKS.md` | CLI `--auto` 模式 + Mode A/B 實驗模板 + 對比腳本 | ✅ Qwen 部分完成（`d310f21`） / Mode A/B 待用戶執行 | `d310f21` |
| Phase 6 | `QWEN_PHASE6_TASKS.md` | optionalDeps 修正、.npmignore、CHANGELOG、npm publish、v0.1.0 Release | ✅ 完成 | `c1c38de` + tag `v0.1.0` |
| Phase 7 | `QWEN_PHASE7_SITE_V2_TASKS.md` | 網站 v2 — release pill、QuickTry 區塊、CLI 文檔頁、Nav npm/GitHub | ✅ 完成（含 1 個 Nav bug 留待 Phase 8 修） | `e19e305` |
| Phase 8 | `QWEN_PHASE8_PLAYGROUND_TASKS.md` | Web Playground + 5 範例庫 + Nav HashRouter bug 修 | ✅ 完成 | `6a07712` |
| Phase 8.5 | （用戶手動 commit） | 雙語首頁堆疊版本 | ⚠️ 有 UX 問題，Phase 9 重構為 toggle | `3e88c30` |
| Phase 9 | `QWEN_PHASE9_I18N_TASKS.md` | 正式 i18n（中/EN toggle）+ 社交分享 meta + favicon | 🟡 待執行 | — |
| Phase 10 | `QWEN_PHASE10_CLI_V2_TASKS.md` | CLI v0.2.0（examples + --lang）+ Playground 分享 URL | 🟡 待執行 | — |

**累積產出**：
- Markdown 文檔 30+ 篇（學習筆記 11、開發手冊 13、實驗 5、戰略 1）
- 網站 1 套（13 個 React 元件、5 個分類、自動部署到 GitHub Pages）
- Git commits 8 個
- 對外開源就緒度：✅ LICENSE / README / CONTRIBUTING / Issue templates / repo metadata 齊全
- 待補：CLI（runnable code）+ Phase 3 實驗實際執行

---

## 1. Phase 0 — 學習筆記（2026-05-02）

### 1.1 `QWEN_LEARNING_TASKS.md`
- **目標**：建立對 gstack 與 superpowers 兩個既有 AI 工作流框架的深入理解
- **產出**：`docs/learning-notes/` 11 篇
  - `gstack-overview.md` / `gstack-planning-skills.md` / `gstack-review-skills.md` / `gstack-shipping-skills.md` / `gstack-anatomy.md`
  - `superpowers-anatomy.md` / `superpowers-planning.md` / `superpowers-quality.md` / `superpowers-parallel.md`
  - `gstack-vs-superpowers.md` / `key-insights.md`
- **狀態**：✅ 完成
- **驗收方法**：Claude 用 Explore agent 並行驗證每篇覆蓋了預期的 skill/概念

### 1.2 `QWEN_OPTIMIZE_TASKS.md`（v1 → v2）
- **背景**：v1 範圍太廣導致 Qwen Code 漂移；改寫成 v2 只列 11 個具體未完成項目
- **產出**：學習筆記細部修正（補對比表、補引用、補 takeaway）
- **狀態**：✅ 完成
- **教訓**：給 Tier-Exec 的指令必須是「具體任務清單」，不能用「請優化」這種開放式描述

---

## 2. Phase 1 — 交接模板 + 分類器 + 架構（2026-05-03）

### 2.1 `QWEN_PHASE1_TASKS.md`
- **目標**：建立三層協作的核心規範文檔
- **產出**：9 個檔案
  - 交接模板：`handoff/templates/plan-to-exec.md` / `exec-to-check.md` / `check-to-plan.md`
  - 共享規範：`handoff/templates/shared/evidence-format.md` / `forbidden-words.md`
  - 分類器：`classifier/scoring-guide.md` / `routing-rules.md` / `test-tasks.md`
  - 架構：`docs/architecture.md`
- **狀態**：✅ 完成
- **品質評估**：9/9 達標，2 處小缺口（見下）

### 2.2 `QWEN_OPTIMIZE_PHASE1_TASKS.md`（2 處修正）
- **修正 1**：`plan-to-exec.md` 的「上下文快照」字段缺結構化格式 → 補 YAML 模板（`context_snapshot: {current_state, recent_changes, known_dependencies, known_risks}`）
- **修正 2**：`test-tasks.md` Task 8（auth 安全審查）路由錯誤 → 應從 Tier-Mid 改為 Tier-A 並移到 Tier-A 區
- **執行結果**：修正 1 ✅；修正 2 ❌ Task 8 被**刪除**而非移動 → 觸發 FIX_TASKS

---

## 3. Phase 2 — 失敗恢復機制（2026-05-03）

### 3.1 `QWEN_PHASE2_TASKS.md`
- **目標**：當 Tier-Exec 執行失敗時，何時 retry、何時升級
- **產出**：5 個檔案
  - `verification/pre-flight-checklist.md`（12 項起飛前必過檢查）
  - `verification/failure-catalog.md`（4 種失敗類型：BUILD_ERROR / LOGIC_ERROR / DESIGN_ISSUE / SCOPE_DRIFT）
  - `verification/failure-routing.md`（從失敗類型到處理動作的決策樹）
  - `docs/superpowers-integration.md`（5 個整合點）
  - `experiments/failure-scenarios.md`（5 個情境演練）
- **狀態**：✅ 完成（5/5 場景路由正確）

### 3.2 `QWEN_OPTIMIZE_PHASE2_TASKS.md`（生成但未執行）
- **內容**：3 處修正（C2 重試次數 1→2、TS 子類補充、SCOPE_DRIFT 邊界澄清）
- **狀態**：❌ 未執行 → 直接被 `QWEN_FIX_TASKS.md` 整併取代

---

## 4. 修補回合 — `QWEN_FIX_TASKS.md`（2026-05-03）

### 背景
Phase 1+2 兩輪優化後做交叉驗收，發現 3 個檔案有 4 個問題沒被正確處理：

| 檔案 | 問題 | 來源 |
|---|---|---|
| `classifier/test-tasks.md` | Task 8 被誤刪而非移動 | OPTIMIZE_PHASE1 修正 2 執行錯誤 |
| `verification/pre-flight-checklist.md` | C2 仍寫「重試 1 次」（與其他檔案的 2 次矛盾） | OPTIMIZE_PHASE2 未執行 |
| `verification/failure-catalog.md` | BUILD_ERROR 缺 TypeScript 子類提示 | OPTIMIZE_PHASE2 未執行 |
| `verification/failure-catalog.md` | SCOPE_DRIFT 缺「調用 vs 修改」邊界說明 | OPTIMIZE_PHASE2 未執行 |

### 處理
寫了**極度具體**的修正指令（含完整新 Task 8 內容、完整替換文字、完整新增段落），讓 Qwen Code 不需要做任何判斷。

- **狀態**：✅ 完成
- **教訓**：當 Tier-Exec 第一次執行錯了，第二次指令要把「應該長什麼樣」寫到字面上完全可貼上的程度，不要再用「移動到」「修改為」這種需要解讀的動詞

---

## 5. Phase 3 — 對比實驗（2026-05-03）

### 5.1 `QWEN_PHASE3_TASKS.md`
- **目標**：用真實任務驗證三層協作的價值
- **產出**：7 個檔案
  - `experiments/README.md` / `methodology.md` / `task-definitions.md` / `results-report.md` / `runs/`（實驗運行紀錄目錄）
  - 三種對比模式：**Mode A**（單 Claude）vs **Mode B**（人工分配）vs **Mode C**（gstack-plus 自動路由）
- **狀態**：✅ specs 完成；**實際實驗待執行**（需要等 CLI 完成才能跑）

---

## 6. 文檔網站 — `QWEN_DOCSITE_TASKS.md`（2026-05-03）

### 目標
把所有 markdown 文檔變成可瀏覽的網站，部署到 GitHub Pages，未來新增 .md 自動上線。

### 規格
- React 18 + Vite + TypeScript + Tailwind
- Cinematic hero 風格（Instrument Serif + Inter，影片背景，淡入淡出）
- 5 大分類：概覽 / 學習筆記 / 開發手冊 / 實驗記錄 / 戰略思考
- 三位數 order 編號排序（100/200/300/400/500 區段）
- HashRouter 避開 GitHub Pages 子路徑問題
- `import.meta.glob` 把 repo 根所有 .md 編入 bundle
- GitHub Action 自動部署：push 到 main → 1–2 分鐘後線上更新

### 執行軌跡
| Commit | 內容 |
|---|---|
| `8e0319d` | feat: Phase 0-3 complete + docs site with cinematic hero |
| `899bf09` | fix: set vite base to `/gstack-plus/` for GitHub Pages subpath |
| `9d7625d` | fix: remove conflicting `tailwind.config.js`, restore `postcss.config.js` |
| `5973440` | ci: upgrade to Node.js 24, update checkout@v5 |

### 上線
**https://zhewenzhang.github.io/gstack-plus/**

---

## 7. 網站優化 — `QWEN_SITE_OPTIMIZE_TASKS.md`（2026-05-03）

### 觸發
用戶反饋：「首頁打開有自適應顯示不好的狀況」「內容沒有分類很好，閱讀不是很方便」

### Claude 加碼（產品設計師視角）
除了用戶提的 2 個問題，順手加了：
- 「四步閱讀路徑」卡片（What is + Why + 推薦順序）
- 「開發手冊」13 篇分子組（架構 / 任務分類器 / 交接模板 / 失敗恢復 / 整合）
- DocPage：麵包屑 + 上/下一篇 + 右側 TOC（scroll spy）+ Edit on GitHub
- Mobile：hamburger menu + drawer + sticky topbar
- Hero：第二顆 CTA "See Architecture"，副標題用 inline highlight 強化價值主張
- 404 頁

### 執行
- **Commit**：`7b234bb`
- **新增元件**：`HomeBelowFold.tsx` / `MobileDrawer.tsx` / `DocToc.tsx` / `NotFound.tsx`
- **狀態**：✅ 完成

---

## 8. 倉庫打磨 — `QWEN_REPO_POLISH_TASKS.md`（2026-05-03）

### 目標
從「個人筆記」升級到「能拿出去給陌生人看」的開源狀態。

### 動作
| 項目 | 動作 |
|---|---|
| `site-screenshot.png` (1.1MB 殘渣) | `git rm` |
| `.gitignore` | 加 png 白名單 + dist 路徑 + secrets 規則 |
| `LICENSE` | 新增 MIT |
| `README.md` | 完全重寫（英文 + ASCII 架構圖 + shields + 表格 + 文檔索引） |
| `CONTRIBUTING.md` | 新增（兩種歡迎的貢獻：docs fix / experiment report） |
| `.github/ISSUE_TEMPLATE/` | bug_report + experiment_report + config.yml |
| Repo metadata | `gh repo edit`：description / homepage / 7 個 topics |
| Discussions | `gh api -X PATCH ... -f has_discussions=true` |

### 執行
- **Commit**：`4bab966`
- **狀態**：✅ 完成（用戶於 2026-05-03 確認）

---

## 9. Phase 4 — runnable CLI — `QWEN_PHASE4_CLI_TASKS.md`（2026-05-03，進行中）

### 動機
從產品/AI 思想家視角：項目最大缺口是**「沒辦法 try」**。陌生人讀完文檔只能說「有意思」然後關掉。一個 `npx gstack-plus classify "..."` 能 30 秒內感受到價值。這是從「論文」變「工具」的單一最高槓桿動作。

### 兩段
- **A 段（清理 + 補打磨）**：刪 `css-diagnosis.png`、`.gitignore` 加 `QWEN_*.md`/`*-diagnosis.png`/`*-screenshot.png` 防呆、補執行 REPO_POLISH 漏的部分
  - **狀態**：✅ 完成（commit `4bab966`）

- **B 段（CLI 建構）**：建 `cli/` workspace（root 升級成 monorepo）
  - 純函式 `route.ts`（routing 規則的 single source of truth）
  - 互動式 `classify.ts`（5 維打分，含 hint）
  - 模板 `handoff.ts`（套變數產出 handoff doc）
  - CLI entrypoint（`gstack-plus classify <task>` + `--scores 4,3,4,2,2` + `gstack-plus rules`）
  - 7 個單元測試
  - root README 加 "Try it: the CLI" 段落
  - **狀態**：🟡 待執行

---

## 10. Phase 7–17 補記（2026-05-03 ~ 2026-05-04）

| Phase | 指令文件 | 範圍 | 狀態 | commit |
|---|---|---|---|---|
| Phase 7 | `QWEN_PHASE7_SITE_V2_TASKS.md` | 網站 v2：release pill / QuickTry / CLI 文檔頁 / Nav npm+GitHub | ✅ | `e19e305` |
| Phase 8 | `QWEN_PHASE8_PLAYGROUND_TASKS.md` | Web Playground + 5 範例庫 + HashRouter anchor bug 修 | ✅ | `6a07712` |
| Phase 8.5 | 用戶手動 | 雙語首頁堆疊（UX 問題，Phase 9 重構） | ⚠️ 已被取代 | `3e88c30` |
| Phase 9 | `QWEN_PHASE9_I18N_TASKS.md` | i18n 中/EN toggle + useLang hook + favicon + OG meta | ✅ | `0549e8c` |
| Phase 10 | `QWEN_PHASE10_CLI_V2_TASKS.md` | CLI v0.2.0：examples 命令 + --lang 旗標 + Playground 分享 URL | ✅ npm v0.2.0 | `d52be1e` |
| Phase 11 | `QWEN_PHASE11_CLI_V2_1_TASKS.md` | CLI v0.2.1：雙語路由原因（route.ts lang 參數）+ history 命令 | ✅ npm v0.2.1 | `6536ed4` |
| Phase 12 | `QWEN_PHASE12_POLISH_TASKS.md` | 英文 handoff-en.md + QuickTry 雙語 sample + cli/README v0.2.1 + git tag 補齊 | ✅ | `616cacf` |
| README 重設計 | Qwen 自主（Phase 13 間隙） | README 視覺重設計 + README.zh.md 中文版 | ✅ | `e248743`, `9d9b2e2` |
| Phase 13/14 | `QWEN_PHASE14_CI_INIT_V3_TASKS.md` | GitHub Actions CI + gstack-plus init + 21 測試 + Getting Started 頁 + v0.3.0 | ✅ npm v0.3.0 | `f5181a9` |
| Phase 15 | `QWEN_PHASE15_SITE_AUDIT_TASKS.md` | 網站版本號統一 + Sidebar 雙語 + EN headline 改寫 + Nav → getting-started | ✅ | `98c6abf` |
| Phase 17 | `QWEN_PHASE17_CONFIG_POLISH_TASKS.md` | Phase 15 補完（Nav 標籤 + QuickTry 連結）+ gstack-plus config 命令 + v0.3.1 | 🔄 執行中 | — |

### npm 發布歷史
| 版本 | 主要功能 |
|------|---------|
| v0.1.0 | classify、rules、--scores、--auto |
| v0.2.0 | examples 命令、--lang zh/en |
| v0.2.1 | 雙語路由原因修正、history 命令 |
| v0.3.0 | init 命令、GitHub Actions CI、21 個測試 |
| v0.3.1 | config 命令（執行中） |

### 測試覆蓋（v0.3.0）
- `route.test.ts`：11 個（含雙語 reason 測試）
- `examples-data.test.ts`：7 個
- `auto-score.test.ts`：1 個
- `config.test.ts`：2 個（v0.3.1 後）
- **共計 21 個，全部通過**

---

## 11. 待辦事項（按優先序）

1. ~~**執行 Phase 4 B 段**：建 CLI~~ ✅ `8a8365f`
2. ~~**Phase 4.5**：CLI `--auto` 模式~~ → 合入 Phase 5
3. ~~**Phase 5**~~：✅ `d310f21`
4. ~~**Phase 6**：npm publish v0.1.0~~ ✅ `c1c38de`
   - **前置檢查**：`npm view gstack-plus` 確認名稱未被佔用
   - 補 `CHANGELOG.md` + 打 v0.1.0 tag + `npm publish`
5. **Phase 7**：軟發布（HN / Twitter / Discord / 相關開發者社群）
6. **Phase 8**：根據實驗結果與用戶反饋迭代規則表

---

## 11. 關鍵教訓（給未來自己 + 寫成 case study 用）

### Tier-Exec 指令撰寫原則
1. **絕對具體** — 「修改 X 為 Y」要寫出完整的 X 文字與完整的 Y 文字，不能用「相應地調整」「把 1 改成 2」這種需要解讀的指令
2. **避免動詞陷阱** — 「移動」「重組」「優化」這些詞 Tier-Exec 會誤讀成「刪除」。改用「複製到 X 位置，然後刪除原 Y 位置的舊內容」這種無歧義動詞鏈
3. **預設不執行未列出的事** — 一定要明說「其他檔案不要動」「這個欄位不要碰」，否則 Tier-Exec 會自作主張延伸 scope
4. **驗收清單與指令同檔** — 每份指令最末必加「完成後自查清單」，讓 Tier-Exec 自己跑一遍
5. **跨檔案數字一致性** — 同一個事實（如 BUILD_ERROR 重試 2 次）出現在多個檔案時，指令必須點名所有出現位置；漏一處 = 矛盾

### 工作流節奏
- **生成 → 執行 → 驗收 → 修補** 循環跑了 11 次
- Claude（Tier-A/Mid）平均每輪生成 1 份指令文件，Qwen Code 執行後 Claude 用 Explore agent 並行驗收 3–5 個檔案
- **執行成功率約 85%**（首次正確執行佔比），15% 需要修補回合
- 修補回合的失敗率比首次低很多（指令更具體）

### 內部檔案 vs 公開檔案
- `QWEN_*.md` / `*_TASKS.md` / `WORK_LOG.md` 屬於**協作過程紀錄**，不發布
- `.gitignore` 用 glob pattern 一次防呆所有同類檔案，比逐個列名稱可靠
- 公開的是**產出**（學習筆記、開發手冊、網站、CLI），不是**過程**（指令文件）

### 產品設計判斷
- 用戶說 A 個問題，往往背後有 B、C、D 個相關問題 — 加碼修正比「只處理 A」價值大很多倍
- 「分類」不只是排序，還要給每個分類**一句話介紹**（讓人知道這裡裝什麼），這比改字體大小有用 10 倍
- Hero 文案不能只詩意，要有**可掃讀的副標題**（30 字內說清這是什麼工具）
- 第一屏不能只有 hero — 必須有「下一步該往哪走」的卡片，否則訪客滑下去就跳出

---

## 12. 檔案位置索引

```
D:\gstack-plus\
├── WORK_LOG.md                           ← 你正在讀的這份
├── QWEN_PHASE4_CLI_TASKS.md              ← 唯一還在的待執行指令
├── README.md                             ← 公開：專案首頁
├── LICENSE                               ← 公開：MIT
├── CONTRIBUTING.md                       ← 公開：貢獻指南
├── PROJECT_ROADMAP.md                    ← 公開：路線圖
├── LEARNING_PLAN.md                      ← 公開：學習計劃
├── YC_BLINDSPOTS.md                      ← 公開：戰略思考
├── .github/
│   ├── workflows/deploy-docs.yml         ← Pages auto deploy
│   └── ISSUE_TEMPLATE/                   ← 3 個 templates
├── docs/
│   ├── architecture.md
│   ├── superpowers-integration.md
│   └── learning-notes/                   ← Phase 0 產出 11 篇
├── classifier/                           ← Phase 1：分類器
├── handoff/templates/                    ← Phase 1：交接模板
├── verification/                         ← Phase 2：失敗恢復
├── experiments/                          ← Phase 3：實驗 specs
└── site/                                 ← 文檔網站源碼（已部署）
```

**消失的檔案**（已被 `1e31aed` 從 repo 移除，且本地 .gitignore 已禁止重新追蹤）：
所有 `QWEN_*.md` 與 `*_TASKS.md`，除 `QWEN_PHASE4_CLI_TASKS.md` 外。需要回看歷史指令時，這份 `WORK_LOG.md` 的摘要 + git log 可重建脈絡。

---

## Phase 18 — Tags + Site version sync (2026-05-04)

**目標**：補打遺漏的 git tags；網站版本同步至 v0.3.2

- 補打 `git tag v0.3.1 b2d55f9` 和 `git tag v0.3.2 1e6c8a4`，推送到 origin
- site/src/i18n/strings.ts：pill / eyebrow 升至 v0.3.2
- site/src/pages/Home.tsx：SITE_VERSION 升至 '0.3.2'
- cli/README.md + docs/getting-started.md：補記 init 和 config 段落

git tag: v0.3.1 ✅，v0.3.2 ✅（共 6 個 tag：v0.1.0 v0.2.0 v0.2.1 v0.3.0 v0.3.1 v0.3.2）

---

## Phase 19 — Roadmap update + Soft launch drafts (2026-05-04)

**目標**：更新 PROJECT_ROADMAP.md 狀態；建立軟發布三份文稿

- PROJECT_ROADMAP.md：狀態改為「進行中（CLI v0.3.2 已發布）」
- PROJECT_ROADMAP.md：新增「📊 當前實際進度」表格（v0.1.0–v0.3.2 里程碑）
- PROJECT_ROADMAP.md：時間表前 3 個 Week 標記 ✅
- docs/launch/hn-post.md：HN "Show HN" 英文草稿
- docs/launch/twitter-thread.md：6 條推文草稿
- docs/launch/juejin-article.md：掘金中文長文草稿

commit: 318b4e0

---

## Phase 20 — Score bars + v0.3.3 (2026-05-04)

**目標**：CLI 輸出加入 score bars 視覺化；發布 v0.3.3

- cli/src/index.ts：加入 scoreBar() 函數
- classify 輸出：在路由決策前顯示 5 維度分數條
- examples 詳細輸出：同樣使用分數條
- 版本 0.3.2 → 0.3.3（cli/package.json + index.ts）
- 網站版本同步至 v0.3.3（strings.ts 兩處 + Home.tsx）
- npm publish v0.3.3

*Last updated: 2026-05-04 by Claude (Sonnet 4.6)*
*Maintained as a living document — append when generating new QWEN_* files or completing major phases.*
