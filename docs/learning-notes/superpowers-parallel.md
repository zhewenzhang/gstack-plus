# Superpowers Parallel Skills 學習筆記

> Day 10 | 深度分析 subagent-driven-development, dispatching-parallel-agents, using-git-worktrees

---

## 技能概覽

| 技能 | 描述 | 核心原則 |
|------|------|---------|
| `subagent-driven-development` | 計劃執行：每個任務分派新 subagent | 每個任務新鮮 subagent + 兩階段審查 |
| `dispatching-parallel-agents` | 並行調度：獨立任務同時執行 | 每個問題域一個 agent，並行工作 |
| `using-git-worktrees` | 隔離工作區：git worktree 創建 | 系統化目錄選擇 + 安全驗證 = 可靠隔離 |

---

## 一、`subagent-driven-development` — 計劃驅動的 subagent 開發

### 字面層：它做了什麼？

這個技能定義了如何通過分派 subagent 來執行實現計劃。核心模式：**每個任務一個新鮮的 subagent + 兩階段審查（規格合規性 → 代碼質量）**。

**完整工作流程**：

```
1. 讀取計劃文件，提取所有任務
2. 創建 TodoWrite（所有任務列表）
3. 對每個任務執行：
   ├── 3a. 分派 implementer subagent（帶完整任務文本 + 上下文）
   │      ├── subagent 問問題？→ 回答，提供上下文 → 重新分派
   │      └── subagent 實現、測試、commit、自我審查
   ├── 3b. 分派 spec reviewer subagent
   │      ├── 規格合規？→ 進入 3c
   │      └── 不合規？→ implementer 修復 → 重新審查
   ├── 3c. 分派 code quality reviewer subagent
   │      ├── 通過？→ 任務完成
   │      └── 不通過？→ implementer 修復 → 重新審查
   └── 3d. 標記任務完成
4. 所有任務完成後：分派 final code reviewer（整個實現）
5. 調用 finishing-a-development-branch
```

**模型選擇策略**：

| 任務類型 | 模型選擇 | 信號 |
|---------|---------|------|
| 機械性實現（隔離函數、清晰規格、1-2 文件） | 快速、便宜模型 | 1-2 文件 + 完整規格 |
| 集成和判斷（多文件協調、模式匹配、調試） | 標準模型 | 多文件 + 集成關注 |
| 架構、設計、審查 | 最有能力模型 | 需要設計判斷或廣泛代碼理解 |

**Implementer 的四種狀態**：

| 狀態 | 含義 | 處理方式 |
|------|------|---------|
| DONE | 完成 | 進入 spec 審查 |
| DONE_WITH_CONCERNS | 完成但有疑慮 | 讀取關注點，如果正確性/範圍問題→審查前解決，如果是觀察→繼續 |
| NEEDS_CONTEXT | 缺少上下文 | 提供缺失上下文 → 重新分派 |
| BLOCKED | 無法完成 | 評估阻塞：上下文問題→提供更多上下文；需要更多推理→用更強模型；任務太大→拆分；計劃錯誤→升級給用戶 |

**鐵律（Never 清單）**：
- 不在 main/master 分支上開始實現
- 不跳過審查（規格合規性 OR 代碼質量）
- 不帶著未修復的問題繼續
- **不並行分派多個實現 subagent**（會衝突）
- 不讓 subagent 讀計劃文件（提供完整文本）
- 不跳過場景設置上下文（subagent 需要理解任務在哪裡）
- 不忽略 subagent 的問題（在讓他們繼續之前回答）
- 不接受規格合規性上的「差不多」（審查發現問題 = 沒完成）
- 不跳過審查循環（審查發現問題 = implementer 修復 = 重新審查）
- 不讓 implementer 自我審查替代實際審查（兩者都需要）
- **不在規格合規性通過前開始代碼質量審查**（順序錯了）

### 設計層：為什麼這樣設計？

#### 設計決策 1：為什麼每個任務用「新鮮 subagent」而不是在同一個 session 中連續執行？

**決策**：每個任務分派一個全新的 subagent，不繼承前一個任務的上下文。

**為什麼**：
1. **上下文隔離**：每個 subagent 只需要當前任務的上下文，不需要知道之前的任務。這減少了上下文污染（之前任務的殘留影響當前任務的判斷）。
2. **專注性**：精心構造的指令和上下文確保 subagent 專注於當前任務。如果繼承了 session 的完整歷史，subagent 會被不相關的信息淹沒。
3. **協調者的上下文保護**：協調者（controller）的上下文留給協調工作（跟踪進度、審查、決策），不被實現細節消耗。

**反例**：同一個 subagent 連續執行 5 個任務。到第 5 個任務時，context window 被前 4 個任務的歷史佔用了 80%，第 5 個任務的質量急劇下降。

---

#### 設計決策 2：兩階段審查（規格合規性 → 代碼質量）的順序為什麼重要？

**決策**：先做規格合規性審查（代碼匹配規格嗎？），再做代碼質量審查（代碼寫得好嗎？）。不能在規格合規性通過前開始代碼質量審查。

**為什麼**：如果先做代碼質量審查，可能會發現「代碼寫得很好但不符合規格」的問題。然後 implementer 修改代碼以符合規格，但修改後的代碼可能引入了新的質量問題——需要重新審查。這造成了無限循環。

先做規格合規性確保「我們建了正確的東西」，再做代碼質量確保「我們把東西建對了」。順序反了會浪費審查資源。

**反例**：代碼質量審查發現了很好的優化建議，implementer 採納了。然後規格審查發現這段代碼根本不符合規格，需要重寫。之前質量審查的時間全部浪費。

---

#### 設計決策 3：為什麼不並行分派多個實現 subagent？

**決策**：subagent-driven-development 明確禁止並行分派實現 subagent（「Dispatch multiple implementation subagents in parallel (conflicts)」在 Never 清單中）。

**為什麼**：雖然任務可能獨立，但它們可能修改相同的文件（如配置、共享模塊）。並行實現會導致 git 衝突、文件覆蓋、或者需要額外的合併工作。串行執行確保每個任務的改動被下一個任務看到。

**對比**：`dispatching-parallel-agents` 是並行的，但它用於「獨立問題域的調試」——每個 agent 修改不同的文件，沒有共享狀態。subagent-driven-development 用於「計劃執行」——即使任務獨立，它們在同一個代碼庫上工作，有隱式依賴。

---

## 二、`dispatching-parallel-agents` — 並行 agent 調度

### 字面層：它做了什麼？

這個技能定義了何時以及如何並行調度多個 agent 來處理獨立的問題域。

**使用時機決策樹**：

```
多個問題？
  ├── 相關（修一個可能修好其他）→ 同一個 agent 調查所有
  └── 獨立
       ├── 能並行工作（無共享狀態）→ 並行分派
       └── 有共享狀態 → 串行 agent
```

**何時使用**：
- 3+ 測試文件失敗，根因不同
- 多個子系統獨立損壞
- 每個問題不需要其他問題的上下文就能理解
- 調查之間沒有共享狀態

**何時不使用**：
- 失敗相關
- 需要理解完整系統狀態
- 探索性調試（還不知道哪裡壞了）
- 共享狀態（agent 會互相干擾——編輯相同文件、使用相同資源）

**Agent Prompt 結構**：

好的 agent 指令是：
1. **聚焦**：一個清晰的問題域
2. **自包含**：所有上下文都能理解問題
3. **具體輸出**：agent 應該返回什麼？

```markdown
修復 src/agents/agent-tool-abort.test.ts 中的 3 個失敗：

1. "should abort tool with partial output capture" - 期望消息中包含 'interrupted at'
2. "should handle mixed completed and aborted tools" - 快速工具被中斷而不是完成
3. "should properly track pendingToolCount" - 期望 3 個結果但得到 0

這些是定時/競態條件問題。你的任務：

1. 讀測試文件理解每個測試驗證什麼
2. 找到根因——定時問題還是實際 bug？
3. 修復方法：
   - 用基於事件的等待替換任意 timeout
   - 如果發現中斷實現的 bug 就修復
   - 如果測試的行為變了就調整測試期望

不要只增加 timeout——找到真正的問題。

返回：你發現了什麼和修復了什麼的摘要。
```

**並行 agent 回來後的驗證**：
1. 讀每個摘要
2. 檢查衝突（agent 們編輯了相同代碼嗎？）
3. 跑完整測試套件
4. 抽查（agent 可能犯系統性錯誤）

### 設計層：為什麼這樣設計？

#### 設計決策 1：什麼任務適合並行？什麼不適合？

**適合並行**：
- 獨立問題域（不同的文件、不同的子系統）
- 每個 agent 的輸入不包含其他 agent 的輸出
- 沒有共享狀態（不修改相同文件、不使用相同資源）

**不適合並行**：
- 任務 A 的輸出是任務 B 的輸入
- 任務共享文件/資源（並行編輯導致衝突）
- 需要理解其他任務的結果才能繼續

**核心測試**：如果 agent A 和 agent B 同時工作，它們會不會修改同一個文件？如果是 → 不適合並行。

---

## 三、`using-git-worktrees` — git worktree 隔離

### 字面層：它做了什麼？

這個技能定義了如何創建隔離的 git worktree 工作區。

**完整流程**：

```
1. 目錄選擇（優先級）：
   ├── 檢查現有：.worktrees/（首選）> worktrees/（备选）
   ├── 檢查 CLAUDE.md 中的偏好
   └── 問用戶
2. 安全驗證：
   └── 如果是項目本地目錄 → 檢查 .gitignore（git check-ignore）
       └── 如果沒有忽略 → 立即修復（加 .gitignore + commit）
3. 創建 worktree：
   ├── 檢測項目名稱
   ├── git worktree add <path> -b <branch>
   └── cd <path>
4. 運行項目設置：
   ├── 自動檢測 runtime（package.json → npm install, Cargo.toml → cargo build...）
   └── 安裝依賴
5. 驗證清潔基線：
   ├── 跑測試
   ├── 如果失敗 → 報告失敗，詢問是否繼續
   └── 如果通過 → 報告就緒
6. 報告位置
```

### 設計層：為什麼這樣設計？

#### 設計決策 1：git worktree 在並行開發中的角色

**決策**：每個獨立任務應該在自己的 git worktree 中進行，而不是在同一個工作區切換分支。

**為什麼**：
1. **真正的隔離**：worktree 是獨立的文件系統空間，可以同時 checkout 不同分支而不衝突。`git checkout` 只能串行工作。
2. **並行 agent 的基礎設施**：如果多個 agent 需要同時工作（不同任務），每個需要自己的 worktree。否則它們會互相覆蓋改動。
3. **安全的沙盒**：如果任務搞砸了，直接刪掉 worktree，不影響主工作區。

**反例（不使用 worktree 的多 Agent 衝突）**：

場景：Qwen Agent A（實現 retry logic）和 Qwen Agent B（實現 timeout）同時在 main 工作區執行。

時間線：
- T=0：兩個 Agent 都讀取 `src/api/client.ts`（當前版本 v1）
- T=5：Agent A 完成，修改 `src/api/client.ts`，commit（變成 v2）
- T=8：Agent B 完成，也修改 `src/api/client.ts`——但它基於 v1，不知道 v2 存在
- T=8：Agent B 的 commit 要麼覆蓋 Agent A 的修改（靜默丟失），
       要麼觸發 merge conflict（需要人工介入）

靜默覆蓋是最危險的情況：retry logic 消失了，但 git history 顯示兩個 commit 都存在，
看起來都「成功」了。

**使用 worktree 後**：
Agent A 在 `worktree-retry` 分支工作，Agent B 在 `worktree-timeout` 分支工作。
完成後 merge 時，git 明確報告衝突（同一文件的不同修改）。
Claude 在合併階段做有意識的決策：retry 和 timeout 的交互邏輯應該如何組合。
問題從「靜默丟失」變成「顯式衝突」——顯式衝突可以被處理，靜默丟失不行。

---

## 哲學層：反映了什麼信念？

**信念 1：並行是速度，隔離是質量。**

`dispatching-parallel-agents` 通過並行獲得速度（3 個問題用 1 個問題的時間解決）。`subagent-driven-development` 通過隔離獲得質量（每個任務的新鮮上下文、兩階段審查）。兩者結合時，只有在真正的獨立問題域上才並行；否則串行。

**信念 2：每個 agent 應該獲得精心構造的上下文，不是 session 的全部歷史。**

三個技能都強調：「精確構建指令和上下文」「不繼承 session 上下文」「提供完整文本而不是讓 subagent 讀文件」。這反映了對 context window 作為稀缺資源的理解——塞滿無用信息會降低輸出質量。

**信念 3：git 隔離是工程紀律，不是可選優化。**

`using-git-worktrees` 說：在開始任何功能工作之前，先創建隔離的 worktree。這不是「好的實踐」——它是必須的。沒有隔離，改動會互相污染，回滾會變得困難。

---

## 對比 gstack：superpowers 的並行 Agent 模式和 gstack 的 `/review` Review Army 有什麼根本的設計差異？

| 維度 | gstack Review Army | superpowers Parallel Agents |
|------|-------------------|---------------------------|
| 並行對象 | 多個 specialist（Testing、Maintainability、Security...） | 多個 general-purpose agent |
| 並行目的 | 同一個 diff 的多角度審查 | 多個獨立問題的並行解決 |
| 上下文隔離 | 每個 specialist 有全新 context（偏見隔離） | 每個 agent 有精心構造的上下文（不繼承 session 歷史） |
| 衝突處理 | 不適用（每個 specialist 讀同一個 diff） | 適用（多個 agent 可能編輯相同文件 → 禁止並行實現） |
| 結果合併 | 去重（同 fingerprint → 置信度 +1） | 檢查衝突 + 跑完整測試套件 |
| 門控 | 自適應：10+ 次沒有發現 → 自動跳過 | 沒有門控——每次並行調度 |
| git 基礎設施 | 不需要（都在同一個 branch 上讀） | 需要 worktree（每個 agent 獨立工作） |

**根本差異**：

gstack 的 Review Army 是**並行讀取**——多個 specialist 同時讀同一個 diff，各自輸出 findings。它們不修改代碼，只輸出報告。所以沒有衝突問題。

superpowers 的並行 agent 是**並行寫入**——多個 agent 同時修改代碼。這帶來了衝突風險，所以必須嚴格限制在「獨立問題域」——每個 agent 修改不同的文件。

**gstack 是並行分析，superpowers 是並行實現**。

---

## 對 gstack-plus 的啟發

### 啟發 1：Subagent-Driven Development 是 gstack-plus Exec 模型執行的核心模式

gstack-plus 的執行流程應該是：
```
Tier-A 規劃
  → 拆分為獨立任務
    → 每個任務分派 Exec subagent（新鮮上下文 + 精確指令）
      → Exec 完成
        → Claude 兩階段審查（規格合規性 → 代碼質量）
          → 通過 → 下一任務
          → 不通過 → Exec 修復 → 重新審查
```

這比「一個 Exec 模型連續執行所有任務」好得多——每個任務的新鮮上下文保證質量。

### 啟發 2：模型選擇策略可以直接借鑒

subagent-driven-development 的模型選擇策略（機械 → 便宜模型，集成 → 標準模型，架構 → 最強模型）直接對應 gstack-plus 的三層模型：

| 任務類型 | gstack-plus Tier |
|---------|-----------------|
| 機械性實現（1-2 文件，清晰規格） | Tier-Exec（Qwen/DeepSeek） |
| 集成和判斷（多文件協調） | Tier-Mid（Sonnet/GPT-4o） |
| 架構、設計、審查 | Tier-A（Opus/GPT-5） |

**Qwen Exec 的適用邊界（gstack-plus 特定）**：

✅ 適合派給 Qwen 的任務（有明確規格，不需要全局判斷）：
- 函數實現：輸入/輸出明確定義，無需架構決策
- 格式重構：有明確的 before/after 格式，不改邏輯
- 測試補充：根據現有測試模式補充 edge cases
- 文檔更新：根據代碼變動更新對應的 JSDoc/README

❌ 不適合 Qwen，需升級到 Claude 的任務：
- 涉及「選哪種方案更好」的判斷（Qwen 沒有全局架構視圖）
- 修改觸及 3 個以上模塊邊界的協調工作
- 任務描述本身有歧義（應先澄清再執行，澄清由 Claude 做）
- 之前同類任務 Qwen 曾失敗過（升級到 Claude 重新分析）

**根本原因**：Qwen 的 context 是局部的——它看到的是給它的 prompt，
不是完整的項目架構圖。要求它做全局判斷是用局部信息做全局決策。

### 啟發 3：並行調度用於 Exec 模型的獨立任務

如果一個規劃中有 3 個獨立任務（修改不同文件、不同子系統），可以並行分派 3 個 Exec agent。但必須嚴格遵守「何時不使用」的規則：不並行相關任務、不並行共享狀態的任務。

### 啟發 4：git worktree 作為 Exec 模型的隔離工作區

每個 Exec subagent 應該在自己的 git worktree 中工作。這確保：
- Exec 之間的改動不互相覆蓋
- 如果 Exec 搞砸了，刪掉 worktree 重來
- Claude 可以在主 worktree 中協調，不受 Exec 改動干擾

### 啟發 5：Implementer 的四種狀態是 Exec 模型輸出的良好分類

Exec 模型完成任務後應該報告：
- **DONE** → 接受
- **DONE_WITH_CONCERNS** → 讀取關注點，判斷是否影響正確性
- **NEEDS_CONTEXT** → 提供更多上下文，重新分派
- **BLOCKED** → 評估阻塞原因，決定是提供更多上下文、升級到更強模型、拆分任務、還是修改規劃

這個分類比簡單的「完成/失敗」二值分類有價值得多——它讓 Claude 知道「Exec 模型卡在什麼地方」，從而選擇正確的恢復策略。

---

## 我還沒完全理解的地方

- `subagent-driven-development` 的 `implementer-prompt.md`、`spec-reviewer-prompt.md`、`code-quality-reviewer-prompt.md` 模板文件的具體內容是什麼？這些模板怎麼構建上下文？
- `dispatching-parallel-agents` 的「並行」在實際的 AI 環境中怎麼實現？是真正的並行（多線程）還是偽並行（快速輪轉）？
- `using-git-worktrees` 和 `finishing-a-development-branch` 的協作流程是什麼？worktree 完成後怎麼合併回主分支？
- subagent-driven-development 的成本模型：每個任務 implementer + spec reviewer + code quality reviewer = 3 個 subagent 調用。如果計劃有 10 個任務，就是 30 次調用 + 可能的修復循環。這個成本怎麼優化？

---

*完成 2026-05-02*
