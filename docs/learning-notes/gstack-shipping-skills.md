# Shipping Skills 學習筆記

> Day 5-6 | 深度分析 `/ship` 和 `/land-and-deploy`

---

## 技能概覽

| 技能 | 版本 | Preamble Tier | 角色 |
|------|------|--------------|------|
| `/ship` | 1.0.0 | 4 | 自動化 PR 創建 + 合併前檢查 |
| `/land-and-deploy` | 1.0.0 | 4 | PR 合併 + 部署 + 生產驗證 |

---

## 一、`/ship` — Fully Automated Ship Workflow

### 字面層：它做了什麼？

`/ship` 是「從代碼完成到 PR 創建」的完整自動化流程。它不只是「創建 PR」——它在 PR 創建前執行完整的質量門控管道，確保只有準備就緒的代碼才能進入 PR。

**完整工作流程（19+ 步驟）：**

```
Step 0:  檢測平台和 base branch (GitHub/GitLab/git-native)
Step 1:  Pre-flight + Review Readiness Dashboard
         ├── 檢查是否在 feature branch (base branch → abort)
         ├── 顯示 Review Readiness Dashboard (Eng/CEO/Design/Adversarial/Outside Voice)
         └── 如果 Eng Review 不是 CLEAR → Step 9 會自己跑 review
Step 2:  Distribution Pipeline Check
         └── 如果新增 CLI/library → 確認有 release CI/CD，否則 AskUserQuestion
Step 3:  Merge base branch (BEFORE tests)
         └── git fetch + merge → 確保測試在 merged state 下運行
Step 4:  Test Framework Bootstrap
         ├── 檢測 runtime (Ruby/Node/Python/Go/Rust/PHP/Elixir)
         ├── 如果沒有測試框架 → AskUserQuestion 選擇 → 安裝 → 創建示例測試
         ├── 生成 3-5 個真實測試（優先高風險文件）
         ├── 創建 TESTING.md + 更新 CLAUDE.md
         └── 生成 CI/CD pipeline (.github/workflows/test.yml)
Step 5:  Run tests (on merged code)
         ├── 並行運行測試 (bin/test-lane + npm test)
         └── 失敗時 → Test Failure Ownership Triage
              ├── 分類: In-branch vs Pre-existing
              ├── solo repo → 現在修復 / 加 TODO / 跳過
              └── collaborative → 現在修復 / 創建 issue 指派作者 / 加 TODO / 跳過
Step 6:  Eval Suites (conditional)
         └── 如果 diff 觸碰 prompt 文件 → 運行 LLM eval (EVAL_JUDGE_TIER=full)
Step 7:  Test Coverage Audit (subagent)
         ├── 追踪每個代碼路徑的數據流
         ├── 繪製 ASCII coverage diagram (代碼路徑 + 用戶流程)
         ├── 標記 [→E2E] 和 [→EVAL] 的路徑
         ├── 回歸規則: 發現 regression → 立即寫 regression test (Iron Rule)
         ├── 覆蓋率門控: 默認 Min 60% / Target 80%
         └── 生成未覆蓋路徑的測試 → 重新檢查覆蓋率
Step 8:  (被跳過，直接到 Step 9)
Step 9:  Pre-landing Review
         ├── 如果沒有 prior review → 運行自己的 review
         └── 檢查 checklist.md
Step 10: Check for plan completion (if autoplan was run)
Step 11: Analyze diff vs plan (Scope Drift Detection)
Step 12: VERSION + CHANGELOG
         ├── 自動 bump VERSION (Micro/Patch)
         ├── 從 diff 生成 CHANGELOG
         └── WIP commit squash (如果有 WIP: 前綴)
Step 13: Commit splitting (bisectable commits)
Step 14: TODOS.md management
Step 15: Commit all changes
Step 16: Push to remote
Step 17: Create PR (with comprehensive body)
Step 18: (PR 創建後處理)
Step 19: 輸出 PR URL
```

**關鍵機制詳解：**

**Test Failure Ownership Triage（測試失敗歸類）：**
```
測試失敗
  ├── In-branch (分支改動導致) → STOP，開發者必須修復
  └── Pre-existing (已有問題)
       ├── solo repo → 現在修復 / 加 P0 TODO / 跳過
       └── collaborative → 現在修復 / 創建 issue 指派最後修改者 / 加 TODO / 跳過
```

**Coverage Audit 的用戶流程追踪：**
不只是代碼分支覆蓋，還要追踪：
- 用戶操作序列（點擊 → 驗證 → API → 成功/失敗頁面）
- 交互邊界情況（雙擊/快速重新提交/導航離開/過期數據/慢連接/並發操作）
- 錯誤狀態的用戶體驗（有明確錯誤信息還是靜默失敗？能恢復還是卡住？）

### 設計層：為什麼這樣設計？

#### 設計決策 1：`/ship` 是「PR 創建 + 完整質量管道」，不是「只創建 PR」

**決策**：`/ship` 在創建 PR 前執行 19+ 步驟的完整檢查（測試、覆蓋率、eval、review、VERSION、CHANGELOG），而不只是調用 `gh pr create`。

**為什麼**：PR 是「請求合併到主分支」，這意味著提交者認為代碼已經準備就緒。如果 PR 創建前沒有完整檢查，review 就是在審查未經驗證的代碼，浪費 review 者的時間。

**反例**：傳統工作流中，開發者手動創建 PR，CI 在 PR 創建後才開始跑。如果測試失敗，PR 仍然存在，review 者可能開始審查最終不會被合併的代碼。

---

#### 設計決策 2：測試失敗的「所有權歸類」(Ownership Triage)

**決策**：測試失敗不是簡單地「停止」或「繼續」——它先分類這個失敗是誰造成的（In-branch vs Pre-existing），然後根據 repo 模式（solo vs collaborative）給出不同的處理選項。

**為什麼**：
1. **Pre-existing failures** 不是當前分支的責任，強迫修復會打斷工作流
2. **solo vs collaborative** 的責任分配完全不同——solo 開發者「現在修」的成本低（上下文還在），collaborative 應該指派給「最後修改者」（通常是實際破壞者）
3. 用 `git blame` 找「最後修改測試文件的人」和「最後修改被測源碼的人」，優先選擇源碼作者——他們更可能引入 regression

**反例**：不區分所有權，所有測試失敗都強迫當前開發者修復。結果：開發者花 2 小時修一個不是他們引入的 bug，而實際責任人完全不知道。

---

#### 設計決策 3：Coverage Audit 用 subagent 執行

**決策**：測試覆蓋率審計通過 Agent tool 作為子 agent 運行，父 agent 只看到最終結論，不看到中間的文件讀取過程。

**為什麼**：這是 **context-rot defense**（上下文腐爛防禦）。覆蓋率審計需要讀取大量源碼文件，如果直接在主流程中讀取，會佔用大量 context window，影響後續步驟的質量。子 agent 有獨立的 context，完成後只返回 JSON 結論。

**反例**：在主流程中讀取 20 個源碼文件做覆蓋率分析，context window 被佔用 60%，後續的 CHANGELOG 生成和 PR body 創建質量下降（ hallucination 風險增加）。

---

#### 設計決策 4：Eval Suites 只在 prompt 文件變更時觸發

**決策**：只有當 diff 觸碰 prompt 相關文件（prompt builder、generation service、evaluator、system_prompts）時才運行 LLM eval，否則完全跳過。

**為什麼**：LLM eval 成本高昂（full tier 每次 ~$1.27，72 秒）。非 prompt 改動不會影響 LLM 輸出質量，運行 eval 是浪費。但 prompt 改動的影響是隱性的——代碼邏輯可能完全正確，但 LLM 的輸出質量可能下降——這需要專門的 eval 來捕獲。

**反例**：修改了一個 prompt template 從 "請用友好語氣" 變成 "直接回答"，代碼測試全部通過，但生產環境的用戶體驗急劇下降。沒有 eval，這個問題直到用戶投訴才會被發現。

---

#### 設計決策 5：Merge base branch 在測試之前（Step 3 在 Step 5 之前）

**決策**：先 merge base branch 到 feature branch，然後在 merged state 上運行測試。

**為什麼**：測試通過的代碼必須能在合併後的狀態下運行。如果只在 feature branch 上跑測試，可能通過，但合併後因為 base branch 的變更（API 改動、依賴更新）而失敗。先 merge 再測試，確保測試的是「真實合併後的狀態」。

**反例**：feature branch 測試全部通過，合併後發現 base branch 昨天改了一個 API 簽名，feature branch 的調用方式已經過時，生產環境報錯。

---

#### 設計決策 6：WIP commit 的 squash 機制

**決策**：`/ship` 負責把 `WIP:` 前綴的 commit 合併（squash）成有意義的原子 commit。

**為什麼**：開發過程中的 WIP commits（"WIP: 開始做 billing"、"WIP: 修復 typo"）對 git history 是噪音。`/ship` 在 PR 創建前清理這些 commits，讓 PR 的 commit history 成為可審計的資產，而不是開發過程的流水帳。

**反例**：PR 有 47 個 commits，其中 30 個是 "WIP: fix"、"fix typo"、"oops"。review 者無法通過 git log 理解「這個功能是如何一步步完成的」。

---

## 二、`/land-and-deploy` — Merge, Deploy, Verify

### 字面層：它做了什麼？

`/land-and-deploy` 接棒 `/ship` 創建的 PR，負責「合併 → 等待 CI → 等待部署 → 驗證生產健康 → 輸出部署報告」。它是「不可逆操作的最後防線」。

**完整工作流程：**

```
Step 0:  檢測平台 (GitHub only, GitLab 未實現)
Step 1:  Pre-flight
         ├── 檢查 gh auth 認證
         ├── 解析參數 (PR number / 當前 branch / URL)
         └── 驗證 PR 狀態 (OPEN/CLOSED/MERGED)
Step 1.5: First-run dry-run validation (首次 dry run)
         ├── 檢測部署基礎設施 (fly.toml / vercel.json / render.yaml 等)
         ├── 驗證命令可用性 (gh auth / platform CLI / curl prod URL)
         ├── 檢測 staging 環境
         ├── 預覽 readiness checks
         └── AskUserQuestion 確認:「這是你項目的真實部署方式嗎？」
Step 2:  Pre-merge checks
         ├── CI status (gh pr checks)
         └── 合併衝突檢測
Step 3:  Wait for CI (if pending, 15 min timeout)
Step 3.4: VERSION drift detection
         └── 檢測 sibling workspace 是否已經合併並移動了 VERSION queue
Step 3.5: Pre-merge readiness gate (關鍵安全檢查)
         ├── 3.5a: Review staleness check (0 commits=CURRENT, 1-3=RECENT, 4+=STALE)
         ├── 3.5a-bis: Inline review offer (如果 review STALE 或 NOT RUN → 提供快速 review)
         ├── 3.5b: Test results (免費測試 + E2E + LLM evals)
         ├── 3.5c: PR body accuracy check (PR 描述是否反映實際 commits)
         ├── 3.5d: Document-release check (CHANGELOG/VERSION 是否更新)
         └── 3.5e: Readiness report + AskUserQuestion 確認
Step 4:  Merge the PR
         ├── 嘗試 auto-merge (尊重 repo merge settings / merge queues)
         ├── 如果 auto-merge 不可用 → squash merge
         └── Merge queue detection (如果 repo 用 merge queue → poll 30 min)
Step 5:  Deploy strategy detection
         ├── 檢測部署平台 (fly/render/vercel/netlify/heroku/railway)
         ├── 檢測 deploy workflows (GitHub Actions)
         ├── 判斷 diff scope (FRONTEND/BACKEND/DOCS/CONFIG)
         ├── 如果 docs-only → 跳過驗證
         ├── 5a: Staging-first option (如果有 staging → 先部署 staging，通過後再 production)
         └── AskUserQuestion (如果沒有 detect 到 deploy workflow 或 URL)
Step 6:  Wait for deploy
         ├── Strategy A: GitHub Actions workflow (poll 30s, 20 min timeout)
         ├── Strategy B: Platform CLI (fly status / heroku releases)
         ├── Strategy C: Auto-deploy platforms (Vercel/Netlify, wait 60s)
         └── Strategy D: Custom deploy hooks
Step 7:  Canary verification (conditional depth)
         ├── SCOPE_DOCS → 已跳過
         ├── SCOPE_CONFIG → Smoke test (goto + 200 status)
         ├── SCOPE_BACKEND → Console errors + perf check
         ├── SCOPE_FRONTEND → Full canary (console + perf + screenshot + content)
         └── 失敗時 → AskUserQuestion (預期 warming up /  broken 需要 revert / 進一步調查)
Step 8:  Revert (if needed)
         ├── git revert merge-commit-sha
         ├── 如果有衝突 → 手動解決
         ├── 如果有 branch protections → 創建 revert PR
         └── 推送 revert → 自動回滾部署
Step 9:  Deploy report (ASCII 報告 + JSONL 日誌)
Step 10: Suggest follow-ups (/canary, /benchmark, /document-release)
```

**Canary 驗證深度：**

| Diff Scope | Canary Depth | 具體檢查 |
|------------|-------------|---------|
| DOCS only | Skipped | 不執行 |
| CONFIG only | Smoke | `$B goto` + 200 status |
| BACKEND only | Console + Perf | Console errors + 頁面加載時間 |
| FRONTEND (any) | Full | Console + Perf + Screenshot + Content |
| Mixed | Full | 同上 |

**首次 dry-run 機制：**
```
第一次部署 → 顯示完整干跑：
  ├── 檢測到的平台、URL、工作流
  ├── 命令驗證表（gh auth / platform CLI / curl prod URL）
  ├── Staging 檢測結果
  ├── 將要執行什麼（5 步說明）
  └── AskUserQuestion:「這匹配你項目的真實部署方式嗎？」
       ├── A) 正確，繼續
       ├── B) 有不對，告訴我
       └── C) 想更仔細配置（運行 /setup-deploy）
後續部署 → 跳過 dry-run，直接進入 readiness checks
配置變更 → 自動重新 dry-run
```

### 設計層：為什麼這樣設計？

#### 設計決策 1：`/land-and-deploy` 的「首次 dry-run」機制

**決策**：第一次部署時，不執行任何不可逆操作，而是完整展示「檢測到的部署基礎設施 + 將要執行的步驟 + AskUserQuestion 確認」，讓用戶在看到實際部署前有兩次確認機會。

**為什麼**：部署是不可逆的（一旦合併到 production，回滾需要額外的 commit 和時間）。用戶在第一次使用時需要建立對工具的信任。Dry-run 讓用戶看到「工具理解了我的項目」並且「工具的部署計劃是正確的」，然後才執行實際操作。

**反例**：用戶第一次運行 `/land-and-deploy`，工具直接合併 PR 並部署。如果工具誤解了部署配置（例如把 staging URL 當成 production），生產環境就被錯誤更新，用戶失去信任。

---

#### 設計決策 2：Pre-merge Readiness Gate（Step 3.5）作為「不可逆操作的最後防線」

**決策**：在合併前執行完整的 readiness report（review staleness + 測試結果 + PR body accuracy + document-release check），然後通過 AskUserQuestion 獲得明確確認才能合併。

**為什麼**：合併是不可逆的（即使可以 revert，也需要額外時間並且可能導致生產環境短暫不可用）。Readiness Gate 確保：
1. **Review 是當前的**（不是 10 個 commits 前的代碼）
2. **測試今天跑過了**（不是昨天的結果）
3. **PR 描述準確**（沒有遺漏重要功能或包含已回退的改動）
4. **文檔已更新**（CHANGELOG 和 VERSION 反映了新功能）

**反例**：沒有 readiness gate，工具直接合併。結果：review 是 20 個 commits 前的，期間引入了 SQL injection；測試是昨天跑的，今天 base branch 的 API 改動打破了 feature branch；PR 描述缺少新功能的說明。合併後發現所有問題，被迫 revert。

---

#### 設計決策 3：Review Staleness 的「 commits since review」追踪

**決策**：不是用時間（「review 是 3 天前跑的」）來判斷 review 是否過時，而是用「review 的 commit 到當前 HEAD 之間有多少 commits」來判斷（0=CURRENT, 1-3=RECENT, 4+=STALE）。

**為什麼**：時間不是好的指標——有時 3 天內只改了文檔（review 仍然有效），有時 1 小時內改了 30 個文件（review 已經無效）。Commit 數量更能反映「代碼的實際變化程度」。而且檢查 commit messages 中的 "fix"、"refactor"、"rewrite" 等關鍵詞，以及是否觸碰 >5 個文件，進一步判斷變更的重要性。

**反例**：用時間判斷：review 是 1 天前跑的 → CURRENT。但那次 review 後有 15 個 commits 重構了整個 auth 模塊。review 完全無效。

---

#### 設計決策 4：Staging-first 選項

**決策**：如果檢測到 staging 環境，在部署 production 之前先提供「先部署 staging，驗證通過後再 production」的選項。

**為什麼**：Staging 是生產環境的安全網。在 staging 上驗證通過，production 的風險大幅降低。如果 staging 失敗，production 完全不受影響。這是傳統 SRE 的最佳實踐。

**反例**：沒有 staging 選項，直接部署 production。部署後發現一個環境變量配置錯誤，生產環境報錯 5 分鐘，直到 revert 完成。

---

#### 設計決策 5：Canary 驗證的「條件深度」(Conditional Depth)

**決策**：不是所有部署都做同樣深度的 canary 驗證——根據 diff scope 動態調整驗證深度（docs → 跳過, config → smoke, backend → console+perf, frontend → full）。

**為什麼**：驗證成本（時間 + API 調用）應該與風險匹配。文檔改動沒有運行時風險，跳過驗證。配置改動可能影響行為但不影響 UI，smoke test 足夠。前端改動直接影響用戶體驗，需要完整驗證（截圖 + 控制台錯誤 + 性能）。

**反例**：文檔改動也做完整 canary（截圖 + 控制台 + 性能），浪費 2 分鐘和 3 次瀏覽器調用，但沒有發現任何問題。

---

#### 設計決策 6：VERSION Drift Detection

**決策**：在合併前檢測 VERSION 文件是否因為 sibling workspace 的合併而變得過時（queue moved），如果檢測到 drift → 停止並要求重新運行 `/ship`。

**為什麼**：在 multi-workspace 環境中，多個分支可能同時準備合併。如果分支 A 的 VERSION 是 `1.2.3`，分支 B 也是 `1.2.3`，分支 A 先合併，VERSION 變成 `1.2.4`。此時分支 B 的 `1.2.3` 就變成了「倒退」。如果分支 B 仍然合併，VERSION 會從 `1.2.4` 回到 `1.2.3`，破壞版本順序。

**反例**：沒有 drift detection，分支 B 合併後 VERSION 倒退。CI 的版本檢查通過（因為分支 B 的版本在自己的分支上是正確的），但 production 的版本號出現倒退，用戶和監控系統混淆。

---

## 哲學層：反映了什麼信念？

**信念 1：合並和部署是不可逆的，所以必須在不可逆操作前做完整確認。**

`/ship` 的 19 步質量管道和 `/land-and-deploy` 的 readiness gate 都反映了同一個信念：一旦代碼進入主分支，回滾的成本遠高於預防的成本。每個「不可逆操作前的最後防線」都在說：「確認比道歉便宜」。

**信念 2：自動化不等於跳過人類判斷——自動化的是數據收集，判斷仍然交給人類。**

兩個技能都在關鍵節點使用 AskUserQuestion（測試失敗歸類、覆蓋率門控、首次 dry-run 確認、readiness gate 確認、staging-first 選項、canary 失敗處理）。工具收集所有數據、執行所有檢查，但最終判斷（「這個風險可接受嗎？」）交給人類。

**信念 3：部署是一次信任建立過程，不是一次功能調用。**

`/land-and-deploy` 的「首次 dry-run → 教師模式」和「後續部署 → 高效模式」反映了對用戶心理的理解：第一次使用時，用戶需要看到工具的理解和計劃來建立信任；信任建立後，用戶只需要結果。部署工具的目標是：「第一次讓用戶說『哇，這很徹底』，後續讓用戶說『這很快』」。

**信念 4：失敗是有所有權的，不只是「通過/失敗」的二元結果。**

Test Failure Ownership Triage 的設計反映了對軟件開發協作現實的理解：測試失敗的原因可能是當前分支的改動，也可能是已有的問題。強制開發者修復所有測試（包括不是他們引入的）是錯誤的激勵——他們會學會避免運行測試。

---

## 兩技能的協作關係

```
┌─────────────────────────────────────────────────────────┐
│  開發者完成代碼                                          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │      /ship             │
         │  PR 創建前質量管道     │
         │  ──────────────────    │
         │  • 測試 + 覆蓋率       │
         │  • Eval (prompt 變更)  │
         │  • Pre-landing review  │
         │  • VERSION + CHANGELOG │
         │  • 創建 PR             │
         └────────┬───────────────┘
                  │ 輸出 PR URL
                  ▼
         ┌────────────────────────┐
         │  (人類 review / 批准)  │
         └────────┬───────────────┘
                  │ 批准後
                  ▼
         ┌────────────────────────┐
         │  /land-and-deploy      │
         │  合併 + 部署 + 驗證    │
         │  ──────────────────    │
         │  • Readiness gate      │
         │  • Merge PR            │
         │  • Wait for CI/deploy  │
         │  • Canary verification │
         │  • Deploy report       │
         └────────────────────────┘
```

**關鍵分工**：
- `/ship` = PR 創建 + 合併前的**所有**質量檢查（測試、覆蓋率、review、文檔）
- `/land-and-deploy` = PR 批准後的**所有**部署操作（合併、等待、驗證、報告）
- 人類 = 在 `/ship` 創建 PR 後、`/land-and-deploy` 合併前做最終判斷

---

## 對 gstack-plus 的啟發

### 啟發 1：「不可逆操作前的完整確認」是失败回流的核心設計

`/ship` 的 19 步管道和 `/land-and-deploy` 的 readiness gate 都是「在做不可逆事情前的最後防線」。在 gstack-plus 中，當 Exec 模型（Qwen）完成代碼後，Claude 應該在合併到主分支前執行類似的質量檢查：

```
Exec 完成代碼
  → Claude 執行質量檢查:
       ├── 測試通過？
       ├── 覆蓋率可接受？
       ├── 範圍沒有超出 handoff 指令？
       └── 通過 → 創建 PR
           → 人類批准
               → /land-and-deploy 合併 + 部署
```

### 啟發 2：測試失敗歸類可以應用於 Exec 模型的失敗

Exec 模型運行測試時遇到失敗，應該先分類：
- **Exec 的代碼造成的** → Exec 重新修復
- **已有的問題** → 報告給 Claude，由 Claude 決定是否現在修復或稍後處理

### 啟發 3：Subagent 的 context-rot defense

`/ship` 的 coverage audit 用 subagent 執行以避免 context 腐爛。在 gstack-plus 中，當 Exec 模型的輸出需要深度驗證時（安全審計、性能分析），應該用獨立的 subagent 執行，而不是在主 context 中做，以保持主 context 的質量。

### 啟發 4：首次 dry-run → 後續高效的模式可以用於 gstack-plus 的用戶引導

gstack-plus 第一次使用時，應該展示完整的「模型分工流程」讓用戶看到：「Tier-A 做了規劃 → Tier-Mid 做了審查 → Exec 做了執行 → Claude 做了驗證」。信任建立後，後續使用可以跳過解釋，直接執行。

### 啟發 5：Readiness gate 的「staleness by commits, not time」可以用於 Exec 模型的上下文驗證

當判斷 Exec 模型的上下文是否過時，不是看「上下文是多久前寫的」，而是看「上下文寫完後有多少代碼變更」。如果 Exec 開始執行後，代碼庫變更了 20 個 commits，那麼 Exec 的上下文就應該刷新。

### 可以改進的地方

- `/ship` 的 coverage audit 依賴 AI 追踪數據流——這可能遺漏複雜的間接調用（reflection、dynamic dispatch）。**改進**: 集成運行時覆蓋率工具（SimpleCov、Istanbul）作為 AI 分析的補充。
- `/land-and-deploy` 的 canary 驗證只做一次性檢查，沒有持續監控。**改進**: 合併 `/canary` 技能，在部署後持續監控 10-15 分鐘，捕獲「剛開始正常，幾分鐘後才出現」的問題（CDN propagation、cache warming）。
- Review staleness 只檢查 commit 數量，不檢查變更的「重要性」。**改進**: 加入變更規模的權重（改了 1 個文件的 typo vs 改了 15 個文件的重構，雖然都是 5 commits，但後者更需要重新 review）。

---

## 我還沒完全理解的地方

- `/ship` 的 Step 8 被跳過了——原本的 Step 8 應該是什麼？是文檔歷史中的遺留還是有意移除？
- `bin/test-lane` 的具體實現——它如何並行運行測試？與 `npm test` 的關係是什麼？
- VERSION drift detection 的 `gstack-next-version` 工具如何維護全局版本隊列？
- `/land-and-deploy` 的 GitLab 支持標記為「未實現」——是因為 GitLab API 的差異還是優先級問題？
- Deploy report 的 JSONL 日誌後續被誰消費？是用於跨項目分析還是僅作審計追踪？

---

*完成 2026-05-02*
