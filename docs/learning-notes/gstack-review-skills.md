# Review/Quality Skills 學習筆記

> Day 3-4 | 深度分析 `/review`、`/qa`、`/investigate`

---

## 技能概覽

| 技能 | 版本 | Preamble Tier | 角色 |
|------|------|--------------|------|
| `/review` | 1.0.0 | 4 | Pre-landing PR 結構審查 |
| `/qa` | 2.0.0 | 4 | 瀏覽器測試 + 自動修復 |
| `/investigate` | 1.0.0 | **2** | 根因調試 (調試速度優先) |

---

## 一、`/review` — Pre-Landing PR Review

### 字面層：它做了什麼？

`/review` 在代碼合併前分析 diff，尋找「測試無法捕獲的結構性問題」。它不只是看代碼質量——它先問「你是否構建了正確的東西？」。

完整工作流程 (7 步)：

```
Step 0: 檢測平台和 base branch (GitHub/GitLab/git-native)
Step 1: 確認在 feature branch 上 (否則停止)
Step 1.5: Scope Drift Detection
   ├── SCOPE CREEP: 超出計劃範圍的改動
   └── MISSING REQUIREMENTS: 計劃中未完成的部分
計劃完成度審計:
   ├── 從 plan 文件提取最多 50 個 actionable items
   ├── 與 diff 交叉比對: DONE/PARTIAL/NOT DONE/CHANGED
   └── 深度調查每個 PARTIAL/NOT DONE 的原因
Step 2: 讀 checklist.md (不可跳過，失敗即停止)
Step 2.5: Greptile 集成 (可選)
Step 3: 獲取 diff (git fetch + git diff)
   ├── Step 3.4: 版本隊列狀態 (advisory)
   └── Step 3.5: Slop Scan (AI 代碼質量掃描)
Prior Learnings: 跨項目學習搜索
Step 4: Critical Pass (核心審查)
   └── 置信度校準: 1-10 分
Step 4.5: Review Army — 並行 Specialist Dispatch
   ├── 常駐: Testing, Maintainability (50+ 行時)
   ├── 條件性: Security, Performance, Data Migration, API Contract, Design
   ├── 自適應門控: 10+ 次沒有發現 → 自動跳過
   └── Red Team: DIFF > 200 行或有 CRITICAL 發現時激活
Step 4.6: 合併 findings, PR Quality Score
Step 5+: Fix-First (AUTO-FIX vs ASK 分類)
```

### Scope Drift Detection 詳解

```
Scope Check: [CLEAN / DRIFT DETECTED / REQUIREMENTS MISSING]
Intent: <一行描述請求了什麼>
Plan: <計劃文件路徑>
Delivered: <一行描述 diff 實際做了什麼>
Plan items: N DONE, M PARTIAL, K NOT DONE
```

調查 PARTIAL/NOT DONE 的 5 種可能原因：
- **Scope cut** — 有意移除（revert commit、刪除 TODO）
- **Context exhaustion** — 開始了但停了（半成品，沒有後續 commit）
- **Misunderstood requirement** — 構建了，但不符合計劃描述
- **Blocked by dependency** — 依賴未到位
- **Genuinely forgotten** — 沒有任何嘗試的證據

### Review Army 並行架構

```
Step 4.5 ─── 檢測 STACK + DIFF_LINES
               │
               ├── Always-on (50+ 行)
               │     ├── Testing Specialist
               │     └── Maintainability Specialist
               │
               ├── Conditional
               │     ├── Security (有 auth/backend 時)
               │     ├── Performance
               │     ├── Data Migration
               │     ├── API Contract
               │     └── Design
               │
               └── Agent tool (並行啟動全部 specialist)
                     │
                     └── 每個 specialist 輸出 JSON findings
                           └── 去重: 同 fingerprint → 置信度 +1
```

**Red Team** — 只有大 diff (>200 行) 或有 CRITICAL 發現時才激活，目的是找 specialist 已知漏洞。

**Slop Scan** — 掃描 AI 代碼特有問題：空 catch、冗餘 `return await`、過度抽象。

**置信度輸出格式：**
```
[P1] (confidence: 9/10) app/models/user.rb:42 — SQL injection via string interpolation
[P2] (confidence: 5/10) controller.rb:18 — Possible N+1 (medium confidence — verify)
```

---

## 二、`/qa` — Test → Fix → Verify

### 字面層：它做了什麼？

`/qa` 是「QA 工程師 + 修復工程師」二合一。它用瀏覽器像真實用戶一樣測試應用，找到 bug 後自動修復源碼，每個修復作為原子 commit，然後重新驗證。

**三種 Tier：**

| Tier | 修復範圍 | 使用場景 |
|------|---------|---------|
| Quick | Critical + High | 快速確認 |
| Standard | + Medium | **默認** |
| Exhaustive | + Low/Cosmetic | 全量 |

**四種模式：**

| 模式 | 觸發條件 | 描述 |
|------|---------|-----|
| Diff-aware | feature branch, 無 URL | **最常用**，自動分析 branch diff |
| Full | 提供 URL | 系統性探索所有頁面 |
| Quick | `--quick` | 30 秒 smoke test |
| Regression | `--regression <baseline>` | 與 baseline.json 對比 |

### 工作流程詳解

**前置條件：工作樹必須乾淨**
```bash
git status --porcelain
# 如果有未提交改動 → 強制選擇: Commit / Stash / Abort
```

**Diff-aware 模式流程：**
```
分析 git diff main...HEAD --name-only
   → 識別受影響的 pages/routes
      ├── Controller 文件 → 對應 URL paths
      ├── Component 文件 → 對應渲染頁面
      └── API 端點 → 直接測試 fetch()

檢測運行中的應用:
   → localhost:3000 / :4000 / :8080 / PR staging URL

對每個受影響頁面:
   → navigate → screenshot → console errors → 測試交互
```

**測試框架自動 Bootstrap：**
如果沒有測試框架 → 詢問 → 安裝 → 創建 TESTING.md → 更新 CLAUDE.md

**QA 健康分數 (8 類別加權平均)：**

| 類別 | 權重 | 扣分規則 |
|------|------|---------|
| Functional | 20% | Critical -25, High -15, Medium -8, Low -3 |
| Console | 15% | 0 errors=100, 1-3=70, 4-10=40, 10+=10 |
| UX | 15% | 同 Functional |
| Accessibility | 15% | 同 Functional |
| Performance | 10% | 同 Functional |
| Links | 10% | 每個 broken link -15 |
| Visual | 10% | 同 Functional |
| Content | 5% | 同 Functional |

**Phase 8: Fix Loop（每個 bug 的流程）：**
```
1. Locate source (讀源碼)
2. Write regression test (先寫測試: 沒 fix 時應該 FAIL)
3. Fix the bug
4. Run test suite (新 test 通過, 沒有 regression)
5. Atomic commit: "fix: [description of issue]"
6. Re-verify in browser (截圖 before/after)
7. Update report with fix evidence
```

**12 條重要規則（節選最關鍵的）：**
1. **"Never read source code. Test as a user, not a developer."**
2. **"Never refuse to use the browser."** — 即使 diff 沒有 UI 變化，後端改動也影響行為
3. **"Depth over breadth."** — 5-10 個有證據的 issues > 20 個模糊描述
4. **"Write incrementally."** — 找到一個就記錄一個，不要批量

---

## 三、`/investigate` — Systematic Debugging

### 字面層：它做了什麼？

`/investigate` 是系統性根因調試。Iron Law（鐵律）：**"NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST."**

注意：preamble-tier 是 **2**（review/qa 是 4），說明調試場景需要更快啟動——preamble 更短，跳過更多 feature discovery。

**獨特機制：有 PreToolUse Hooks**
```yaml
hooks:
  PreToolUse:
    - matcher: "Edit"
      command: check-freeze.sh  # 強制檢查 scope boundary
    - matcher: "Write"
      command: check-freeze.sh
```

這意味著 `/investigate` 會主動與 `/freeze` 集成，防止調試時無意修改了範圍外的代碼。

### 工作流程（5 個 Phase）

**Phase 1: Root Cause Investigation**
```
1. 收集症狀 (error messages, stack traces, 重現步驟)
2. 讀代碼: 從症狀回溯到可能的原因
3. 檢查最近的改動: git log --oneline -20 -- <affected-files>
4. 能否確定性重現?
5. 搜索 learnings (同一文件的反覆 bug = 架構問題)
```

輸出：**"Root cause hypothesis: ..."** — 一個具體的、可測試的假設

**Scope Lock（Freeze 機制）：**
```bash
# 形成假設後立即 Lock
echo "<narrowest-dir>/" > $GSTACK_HOME/freeze-dir.txt
# 告知用戶: "Edits restricted to <dir>/ for this debug session"
# 解除: /unfreeze
```

**Phase 2: Pattern Analysis（6 種已知模式）**

| 模式 | 特徵 | 查看位置 |
|------|------|---------|
| Race condition | 時機依賴、間歇性 | 共享狀態的並發訪問 |
| Nil/null propagation | NoMethodError, TypeError | 可選值缺少 guard |
| State corruption | 數據不一致 | 事務、callbacks、hooks |
| Integration failure | 超時、意外響應 | 外部 API、服務邊界 |
| Configuration drift | 本地正常、staging 失敗 | env vars、feature flags |
| Stale cache | 顯示舊數據 | Redis、CDN、browser cache |

外部搜索規則：**sanitize first** — 剝離 hostname、IP、路徑、SQL 片段、客戶數據，只搜索錯誤類型和框架上下文。

**Phase 3: Hypothesis Testing**
```
1. 添加臨時 log/assertion 在懷疑的根因位置
2. 如果假設錯誤: 搜索 (sanitize) → 回到 Phase 1
3. 3-strike 規則: 3 個假設都失敗 → STOP → AskUserQuestion
   A) 繼續: 我有新假設
   B) 升級人工審查
   C) 增加日誌，等下次捕獲
```

**Red Flags（慢下來的信號）：**
- "Quick fix for now" — 沒有「暫時」，要麼修好要麼升級
- 在追蹤數據流之前就提出 fix — 你在猜
- 每個 fix 都引入新問題 — 層次錯了，不是代碼錯了

**Phase 4: Implementation**
```
1. 修根因，不修症狀
2. 最小 diff (最少文件、最少行)
3. 回歸測試: 沒 fix 時 FAIL，有 fix 時 PASS
4. 跑完整測試套件
5. 如果 fix 觸碰 >5 個文件 → AskUserQuestion (blast radius 警告)
```

**Phase 5: Verification & Report**

```
DEBUG REPORT
════════════════════════════════════════
Symptom:         [用戶觀察到的現象]
Root cause:      [實際出錯的原因]
Fix:             [改了什麼, file:line]
Evidence:        [測試輸出, 重現確認修復]
Regression test: [新測試 file:line]
Related:         [TODOS.md 條目, 同一區域的先前 bug]
Status:          DONE | DONE_WITH_CONCERNS | BLOCKED
════════════════════════════════════════
```

**規則（最重要的 4 條）：**
- **"Never say 'this should fix it.'"** — 驗證並證明，運行測試
- **"Never apply a fix you cannot verify."**
- **"3+ failed fix attempts → STOP and question the architecture."** — 架構問題，不是假設錯了
- **"If fix touches >5 files → AskUserQuestion"**

---

## 設計層：為什麼這樣設計？

### 設計決策 1：`/review` 優先問「你構建了正確的東西嗎？」

**決策**：Step 1.5 (Scope Drift Detection) 放在代碼質量審查之前。

**為什麼**：代碼可以寫得很好，但如果構建的是錯誤的東西，所有的代碼質量都是浪費。先確認方向對，再審查細節。

**反例**：傳統 code review 直接看代碼質量，可能會精心審查一個不應該存在的功能。

---

### 設計決策 2：`/review` 的 Review Army 並行架構

**決策**：所有 specialists 在同一個 message 中同時通過 Agent tool 啟動。

**為什麼**：
1. **偏見隔離** — 每個 subagent 有全新的 context，避免先發現的問題影響後續判斷
2. **速度** — N 個 specialist 並行 vs 串行，速度接近於 1 個 specialist 的時間
3. **自適應門控** — 如果某類問題 10 次都沒發現，自動跳過，節省資源

**反例**：串行審查時，先看到安全問題的 reviewer 可能對後面的性能問題更警惕（帶偏見）。

---

### 設計決策 3：`/qa` 強制「工作樹必須乾淨」

**決策**：`/qa` 開始前檢查 `git status --porcelain`，如果有未提交改動就 STOP。

**為什麼**：每個 bug fix 需要是原子 commit。如果工作樹已經有改動，fix 的 commit 就會混入未相關的改動，破壞原子性，讓後續的 git blame 和回滾變得困難。

**反例**：如果允許在 dirty working tree 上 QA，修復 3 個 bug 的 commit 可能混入原本就有的其他改動，讓 `git log` 無法清晰記錄每個 bug 的修復。

---

### 設計決策 4：`/investigate` 的 Scope Lock 機制

**決策**：形成假設後，立即把編輯範圍 Lock 到最窄的相關目錄，並通過 PreToolUse Hook 強制執行。

**為什麼**：調試時的「順便改一改」(scope creep) 是最危險的——你修了一個 bug，同時無意引入了另一個。Hook 是機器強制（不是自律），更可靠。

**反例**：沒有 scope lock，調試 `src/auth/` 時順便「優化」了 `src/utils/`，測試通過但生產出現新問題。

---

### 設計決策 5：`/qa` 的「永遠不讀源碼」規則

**決策**：`/qa` 不讀源碼，只像用戶一樣測試。即使 diff 沒有 UI 變化，也必須打開瀏覽器。

**為什麼**：讀了源碼的 QA 工程師會不自覺地「知道應該怎樣」，進而測試「理論上的行為」而不是「實際行為」。真實用戶不讀源碼，QA 也不應讀。

**反例**：看了源碼知道「這個按鈕調用 API X」，就直接測 API 而跳過按鈕的 DOM 事件。但用戶點按鈕，DOM 可能根本沒有綁定事件處理。

---

### 設計決策 6：`/investigate` 的 preamble-tier 2

**決策**：`/investigate` 只有 tier 2 的 preamble，比 review/qa 輕很多。

**為什麼**：調試是緊急任務。用戶報告 bug 時，他們想要快速進入調試。如果 AI 先花時間做 telemetry 提示、feature discovery、upgrade check，用戶體驗很差。

**反例**：用戶說「生產環境 500 錯誤！」，AI 開始問「你要不要啟用遙測？」——這是錯誤的優先級。

---

### 設計決策 7：cross-project learnings 的 opt-in 機制

**決策**：三個技能都在使用 `gstack-learnings-search`，第一次使用時詢問是否啟用 cross-project learnings，之後記住選擇。

**為什麼**：獨立開發者（solo）能從跨項目學習中受益（相似的 auth bug 在不同項目都出現過）；多客戶 agency 不希望項目 A 的知識污染項目 B。選擇應該由用戶決定，且只問一次。

---

## 哲學層：反映了什麼信念？

**信念 1：結構性問題比代碼質量問題更危險**。

`/review` 的 Scope Drift Detection、Plan Completion Audit 都在問「你構建了對的東西嗎？」——這比「你的代碼寫得好嗎？」更重要。錯誤的代碼可以重寫；錯誤的功能需要扔掉所有工作。

**信念 2：AI 代碼需要 AI 特定的質量關**。

Slop Scan、多 specialist 並行架構、Red Team 等機制，都反映了對「AI 生成代碼的特殊缺陷模式」的承認。空 catch、冗餘 await、過度抽象是 AI 代碼的特有問題，需要針對性的工具。

**信念 3：可複現性是所有質量工作的前提**。

`/qa` 的「每個 issue 必須有截圖」、`/investigate` 的「能否確定性重現？」、「3 個假設失敗就停止」——都在說：沒有可複現的問題，什麼都不能驗證。寧可說「無法確定」，也不要說「這應該修好了」。

**信念 4：防止 scope creep 是工程紀律的核心**。

`/review` 的 Scope Drift Detection、`/investigate` 的 Scope Lock、`/qa` 的原子 commit 要求——三個技能都在從不同角度解決「邊界模糊」問題。每個技能都包含強制執行 scope 的機制，而不只是建議。

---

## 三技能的協作關係

```
                     ┌──────────────┐
                     │  /autoplan   │
                     │  (協調者)    │
                     └──────┬───────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
  │  /review    │   │   /qa        │   │ /investigate │
  │  PR 合併前  │   │  功能完成後  │   │  出現 bug 時 │
  └─────────────┘   └──────────────┘   └──────────────┘
         │                  │                  │
         └──────────────────┴──────────────────┘
                    共享: learnings JSONL
                    前後: plan-eng-review → qa (test plan 傳遞)
```

**關鍵協作點：**
- `plan-eng-review` 在 `~/.gstack/projects/` 寫 test plan，`/qa` 會自動讀取
- `autoplan` 調用這三個技能形成完整質量管道
- 三個技能都讀寫 `learnings.jsonl`，知識在技能間共享

---

## 對 gstack-plus 的啟發

### 啟發 1：並行子 Agent = 質量倍增器，不是複雜度

Review Army 用並行 Agent 做到了：速度不慢 (並行) + 偏見隔離 (獨立 context) + 自適應跳過 (0 發現的 specialist 下次跳過)。

**在 gstack-plus 中**：當 Exec 模型 (Qwen) 完成代碼後，Claude 可以並行派出多個輕量 Agent 做專項驗證（安全、性能、測試覆蓋），而不是串行。

### 啟發 2：「工作樹必須乾淨」是版本控制的哲學，不只是 QA 規則

每個原子 commit 代表一個完整的思想單元。`/qa` 強制這樣做是因為：原子 commit 讓 git history 成為可調試的資產，不是噪音。

**在 gstack-plus 中**：Qwen 執行任務時，Claude 應該要求每個獨立修改作為單獨的 commit，而不是一個巨大的 "fix everything" commit。

### 啟發 3：Scope Lock 的概念可以用於 Exec 模型的邊界控制

`/investigate` 用物理 hook 防止調試時改了範圍外的代碼。在 gstack-plus 中，給 Exec 模型的指令應該包含明確的「允許改動的文件列表」，並在 handoff 時驗證 git diff 是否超出。

### 啟發 4：3-strike 規則是失敗恢復的通用模式

`/investigate` 的「3 個假設失敗 → 停止 → 升級」是 Exec 模型失敗恢復的良好模板：

```
Exec 嘗試 1: 失敗
Exec 嘗試 2: 失敗  
Exec 嘗試 3: 失敗 → 返回 Architect (Claude) 重新分析
             (不再繼續嘗試，升級而不是重試)
```

### 啟發 5：學習系統跨技能共享是知識資產的核心

三個技能都讀寫同一個 `learnings.jsonl`。一次調試的發現，下次 review 也能用。這是「知識複利」的具體實現。

**在 gstack-plus 中**：Qwen 執行時發現的「這個項目特有的問題」應該回傳給 Claude，更新 context，而不是每次都重新探索。

### 可以改進的地方

- `/review` 的 Scope Drift Detection 依賴計劃文件存在。如果沒有 plan，只能用 commit messages，信噪比低。**改進**: 在 handoff template 中強制包含「本次任務範圍」字段，給 review 提供明確的 ground truth。
- `/qa` 的 health score 是主觀的（Functional 20%）。不同項目的重要性不同。**改進**: 允許在 CLAUDE.md 中自定義權重。

---

## 我還沒完全理解的地方

- `/review` 的 checklist.md 具體包含什麼？Step 2 說「如果不能讀就 STOP」，說明這是核心，但沒有看到具體內容。
- `/qa` 的 Phase 8 Fix Loop 中「locate source」具體怎麼做？讀哪些文件？
- Review Army 的 Red Team 具體用什麼策略找 specialist 遺漏的問題？
- Slop Scan 的 `bun run slop:diff` 背後的規則集是什麼？

---

*Day 3 完成 2026-05-02*
