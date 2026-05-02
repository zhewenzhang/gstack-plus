# Qwen Code 優化任務 v2（剩餘未完成部分）

> **給 Qwen Code 的工作指令**
> 工作目錄：`D:\gstack-plus`
> 這是針對上一輪優化後**仍未完成**的具體缺口。已完成的部分不要重複修改。

---

## 已確認完成（不要再動）

| 文件 | 已完成的改動 |
|------|------------|
| gstack-shipping-skills.md | ASCII 流程圖 ✅ |
| key-insights.md | 新增，全部章節，真實合成 ✅ |
| README.md | 全部條目，全部 [x]，日期正確 ✅ |
| superpowers-anatomy.md Q4 | 每個失敗模式加了「根因」解析 ✅ |
| superpowers-planning.md 啟發 1 | 保守路由門檻 ✅ |

---

## 剩餘任務（6 個文件，11 個具體改動）

---

### 任務 1：superpowers-anatomy.md — 補 Q1 具體場景

**找到 Q1 段落**（回答「強制 invoke 精神來自哪裡？」的部分），在它的回答末尾加入以下內容：

```markdown
**典型失敗場景（說明為什麼需要強制）**：

AI 收到任務「把 config.yaml 裡的 timeout 從 30 改成 60」。
它判斷：「這只是改一個數值，不需要 brainstorming。」——跳過了 skill invoke。

實際發生：timeout 值被 3 個 UI 組件讀取，用於控制 loading spinner 的顯示時長。
AI 改了 config，沒有發現 UI 依賴，宣告完成。問題在 staging 上被 QA 發現：
loading spinner 在 60 秒後才消失，用戶體驗損壞。排查花了 2 小時。

如果強制 invoke brainstorming：Visual Companion 的第一個問題是「這個改動影響哪些系統？」
AI 被迫列出依賴，在 10 分鐘內發現 UI 組件，一起修改，問題在開發階段解決。

**這個場景說明的根本問題**：
AI 評估「是否需要 skill」的依據是任務的**表面複雜度**，而不是**實際影響範圍**。
「改一個數值」看起來簡單，但影響可以很深。強制 invoke 的意義在於：
用結構化問題強制 AI 探索影響範圍，而不是依賴 AI 的主觀判斷。
```

---

### 任務 2：superpowers-anatomy.md — 補 Q2 代碼反例

**找到 Q2 段落**（回答「為什麼用 Markdown 而不是代碼」的部分），在它的正面論述後加入：

```markdown
**反例（如果改用 Python hook 實現「強制 invoke」）**：

```python
# 假設的 Python 強制 invoke 實現
def before_task(task_description):
    if not has_invoked_brainstorming():
        raise ComplianceError("必須先 invoke brainstorming")
```

這個方案的問題：
1. **平台綁定**：Claude Code 的 hook 是 Bash，Copilot CLI 格式不同，Gemini CLI 又不同。
   同一套紀律規則需要為每個平台維護不同的代碼。
2. **版本脆弱**：Claude API 更新工具調用格式後，`has_invoked_brainstorming()` 的
   偵測邏輯直接失效，需要發版修復。
3. **精神喪失**：代碼做二元判斷（有/無），無法處理「這個任務 brainstorming 可以
   很短」vs「這個任務需要完整流程」的差異。Markdown 讓 AI 根據情境詮釋「精神」。
4. **更新摩擦**：修改紀律規則需要發版 + 用戶更新。Markdown 修改後立即生效，
   無需任何安裝或更新步驟。

Markdown 的「不精確」是刻意的設計：紀律需要情境判斷，不適合用代碼的精確性來實現。
```

---

### 任務 3：gstack-vs-superpowers.md — 補並行架構失敗場景

**找到「並行架構對比」段落**，在比較表格後加入以下內容：

```markdown
**各自的失敗場景**：

**gstack Review Army（並行讀取）的邊界**：
多個 Reviewer 並行看靜態代碼，看不到「運行時行為」。
典型盲點：race condition（只在並發執行時出現）、環境依賴問題（只在特定 OS 上觸發）。
Review Army 會漏掉這類 bug，因為它們不在代碼文字中，而在執行路徑裡。

**superpowers 並行 Agent 實現（並行寫入）的邊界**：
Agent A 和 Agent B 同時修改 `src/api/client.ts`——A 加了 retry logic，B 加了 timeout。
兩人都基於舊版本的文件，merge 時產生衝突。
即使用了 git worktree 做隔離，worktree 合回 main 時仍需人工解決邏輯衝突
（不是 git 衝突，而是「retry 和 timeout 的交互邏輯是否正確」）。

**gstack-plus 的啟示**：
並行 Qwen Exec 任務時，Claude 作為「合併時的邏輯審查者」——
Qwen 負責實現，Claude 負責確保並行實現之間的語義一致性。
```

---

### 任務 4：gstack-vs-superpowers.md — 補啟示段落的具體機制

**找到「對 gstack-plus 的啟示」段落**，在「應該從 superpowers 借鑒的」部分，找到「獨立驗證」相關條目，將它擴展為以下格式（如果已有類似描述則替換）：

```markdown
**獨立驗證 = Exec handoff 的 evidence 字段**

具體實現：Qwen 的每次 handoff 必須包含 `evidence` 字段，格式如下：

```
任務：修改用戶登入邏輯
狀態：完成

evidence:
  - command: "npm test src/auth/"
    output: "18 passed, 0 failed"
  - command: "npm run typecheck"
    output: "Found 0 errors."
  - modified_files: ["src/auth/login.ts", "src/auth/token.ts"]
    planned_files: ["src/auth/login.ts", "src/auth/token.ts"]
    out_of_scope: []
```

Claude 收到 handoff 後的驗證規則：
- `evidence` 字段缺失 → 拒絕接受，要求 Qwen 補充
- `out_of_scope` 非空 → 要求 Qwen 解釋，未解釋的修改 revert
- 命令輸出顯示失敗 → 不接受「但功能上是對的」的口頭聲明

這直接防止「Qwen 說完成但沒有跑過測試」的情況。
```

---

### 任務 5：superpowers-planning.md — 補啟發 3 禁用詞清單

**找到啟發 3 的段落**（關於 No Placeholders 的部分），在現有內容後加入：

```markdown
**在 gstack-plus 中的具體應用——禁用詞清單**：

給 Qwen Exec 的任務描述中，以下詞語出現時必須在派發前替換：

| 禁用詞 | 問題 | 替換方式 |
|-------|------|---------|
| 「適當的」 | Qwen 會用自己的標準判斷「適當」 | 改為具體條件：「不超過 100ms 的」 |
| 「合理的」 | 同上 | 改為可測量標準：「通過 lint 規則的」 |
| 「如果需要」 | Qwen 通常會選擇「不需要」 | 改為明確指令：「必須添加」或「不需要添加」 |
| 「根據情況」 | 把決策推給 Qwen，但 Qwen 沒有全局視角 | 在派發前由 Claude 做決策，明確寫入 |
| 「類似地」「以此類推」 | Qwen 可能推斷錯誤的類比對象 | 明確列出所有需要修改的位置 |

❌ 錯誤的任務描述：「在適當的位置添加錯誤日誌」
✅ 正確的任務描述：「在 src/api/user.ts 的第 45 行 catch 塊中，添加 console.error，
   格式為：`[ERROR][${new Date().toISOString()}][fetchUser] ${error.message}`」
```

---

### 任務 6：superpowers-quality.md — 加三技能缺一不可表格

**找到「哲學層」段落**，在它後面、「對 gstack-plus 的啟發」之前加入以下內容：

```markdown
### 三個技能缺一不可：刪掉任何一個的後果

| 保留哪兩個 | 刪掉哪個 | 具體後果 |
|-----------|---------|---------|
| verification + debugging | TDD | AI 寫的代碼「能跑」，但沒有預先定義失敗標準。AI 可以寫讓測試通過的任何實現，包括針對已知輸入的 hardcode 返回值。測試通過不等於邏輯正確。 |
| TDD + debugging | verification | AI 按 TDD 流程走，但宣告完成前沒有跑完整測試套件。「這個新測試通過了」不代表「之前的 32 個測試還在通過」。迴歸 bug 在 review 時才被發現。 |
| TDD + verification | debugging | 測試失敗時，AI 反覆猜測修改方向（先改 A，不行再改 B），而不是系統地隔離根因。3 次嘗試後問題可能更複雜，因為修改疊加了新的副作用。 |
```

---

### 任務 7：superpowers-quality.md — 修改啟發 3

**找到啟發 3**（關於 TDD 的部分），將「TDD 精神值得借鑒」的模糊描述替換為：

```markdown
**TDD 精神在 gstack-plus 中的具體含義——Spec-first 執行**：

不要求 Qwen 先寫測試（Qwen 可能無法訪問測試框架），但要求：

**步驟 1**：Claude 在派發任務時，在 prompt 中加入「成功標準」字段：
```
成功標準：
- 當輸入為 null 時，函數返回 []
- 當輸入為空數組 [] 時，函數返回 []
- 當輸入為 [1, 2, 3] 時，函數返回過濾後的結果
- 運行 npm test src/utils/ 全部通過
```

**步驟 2**：Qwen 完成後，Claude 逐條驗證成功標準，不接受「邏輯上應該滿足」的聲明。

**為什麼這比「TDD 精神」更有用**：
它把「測試優先的思維」從 Qwen（不適合做設計決策）移到 Claude（應該定義成功標準）。
每個標準都可以用命令驗證（Falsifiable），排除了「代碼看起來正確」的主觀判斷。
```

---

### 任務 8：superpowers-parallel.md — 補啟發 2 Qwen 邊界分析

**找到啟發 2**（關於模型選擇策略的部分），在現有內容後加入：

```markdown
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
```

---

### 任務 9：superpowers-parallel.md — 補 worktree 衝突反例

**找到「使用 git worktree」段落的反例部分**，將現有的基礎反例替換為更具體的多 Agent 衝突場景：

```markdown
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
```

---

### 任務 10：gstack-anatomy.md — 移動「5 句話挑戰」位置

**目前問題**：「5 句話挑戰」在文件第四節（靠近末尾），但它是最精華的總結，應作為讀者的入口。

**具體操作**：

1. 找到當前的「四、5 句話挑戰」段落（包含 5 句話的完整內容）
2. 把它**剪切**（連標題一起）
3. **貼到**「技能概覽表格」之後、「一、回答 LEARNING_PLAN.md 的 7 個核心問題」之前
4. 修改標題為「## TL;DR：gstack 設計哲學（5 句話）」
5. 在這個段落末尾加一行分隔線 `---`，再開始 Section 一

目的：讓讀者在讀 7 個問題的詳細分析之前，先有一個完整的心智模型。

---

## 執行順序

```
1. superpowers-anatomy.md（任務 1、2）
2. gstack-vs-superpowers.md（任務 3、4）
3. superpowers-planning.md（任務 5）
4. superpowers-quality.md（任務 6、7）
5. superpowers-parallel.md（任務 8、9）
6. gstack-anatomy.md（任務 10）
```

---

## 驗收自查（完成每個文件後自行確認）

- [ ] superpowers-anatomy.md Q1：有「典型失敗場景」，包含 config→UI→2小時 的具體鏈
- [ ] superpowers-anatomy.md Q2：有「如果用 Python 代碼」的 4 個具體問題
- [ ] gstack-vs-superpowers.md 並行架構：有兩個系統各自的失敗邊界描述
- [ ] gstack-vs-superpowers.md 啟示：有 `evidence` 字段的具體格式示例
- [ ] superpowers-planning.md 啟發 3：有禁用詞表格和 before/after 示例
- [ ] superpowers-quality.md：有三欄「缺一不可」表格
- [ ] superpowers-quality.md 啟發 3：有「成功標準」字段格式示例
- [ ] superpowers-parallel.md 啟發 2：有 Qwen 適用/不適用的邊界清單
- [ ] superpowers-parallel.md：有 T=0/T=5/T=8 時間線的具體衝突場景
- [ ] gstack-anatomy.md：「5 句話挑戰」出現在 Section 一之前

---

*Claude 審查更新 2026-05-02*
