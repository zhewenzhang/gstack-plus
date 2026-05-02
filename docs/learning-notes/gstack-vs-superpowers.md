# gstack vs superpowers：設計哲學對比

> Day 12 | 綜合對比兩個系統的設計哲學、工作流、用戶假設和質量門控

---

## 基本定位對比

| 維度 | gstack | superpowers |
|------|--------|-------------|
| 自我定義 | AI 工作流 skill 庫 | AI 紀律系統 |
| 核心信念 | AI 時代的瓶頸從產能轉移到判斷力 | AI 的紀律不足（不是能力不足） |
| 目標用戶 | AI 增強的獨立開發者/技術負責人 | 任何使用 AI 輔助開發的人 |
| 實現方式 | 26+ 角色化技能（每個是結構化工作流） | 紀律規則集合（每個是不可違背的規則） |
| 平台 | Claude Code | 多平台（Claude Code, Copilot CLI, Gemini CLI） |

**一句話總結**：gstack 說「讓 AI 在正確的時刻做出正確的判斷」，superpowers 說「讓 AI 在強制紀律下工作」。

---

## 技能設計哲學對比

### Markdown 格式

| 維度 | gstack | superpowers |
|------|--------|-------------|
| 典型長度 | 500-2000+ 行（含 preamble） | 50-200 行 |
| 結構 | 步驟 + 判斷 + ASCII 圖 + 報告模板 | 核心原則 + 規則 + 紅旗表 |
| Preamble | 長（bash 代碼、session tracking） | 無（從第一行開始） |
| 表達方式 | 工作流程（「先做 A 再做 B 如果 C 則 D」） | 紀律規則（「在做 X 之前必須做 Y，沒有例外」） |

### 長度

gstack 的技能更長，因為：
1. **嵌入式平台代碼**：preamble 包含大量 bash（session tracking、learnings 搜索、telemetry）
2. **角色定義**：每個技能有完整的角色描述和認知模式
3. **報告模板**：嵌入標準化報告格式（如 DEBUG REPORT、PR Quality Score）

superpowers 的技能更短，因為：
1. **純紀律規則**：紀律規則一句話說完（「沒有驗證不能說完成」）
2. **不依賴角色**：不定義「你是 X 角色」，只定義「你必須做 Y」
3. **引用輔助文件**：不嵌入長內容，而是引用外部文件（`root-cause-tracing.md`）

### 結構

gstack 的結構是**流程驅動**：
```
Step 1 → Step 2 → 判斷 → Step 3a/3b → Step 4 → ...
```

superpowers 的結構是**規則驅動**：
```
鐵律：不可做 X
紅旗：如果你想做 X，停止
規則：在做 Y 之前必須做 Z
```

---

## 工作流設計對比

### 有無 STOP point

| | gstack | superpowers |
|--|--------|-------------|
| STOP point | 多處（AskUserQuestion 在關鍵節點） | 少處（HARD GATE 在 brainstorming） |
| 形式 | 固定格式 AskUserQuestion（A/B/C 選項 + 背景 + 建議） | 「問而不是猜」規則 |
| 哲學 | 人類始終保持最終判斷權 | 在設計批准前不能寫代碼 |

**關鍵差異**：gstack 的 STOP point 是「人類批准」——AI 收集信息，人類決定。superpowers 的 STOP point 是「澄清問題」——AI 不知道就問，但問完繼續。

### 有無 AskUserQuestion

gstack 大量使用 AskUserQuestion：
- Review staleness → 提供快速 review
- Test failure triage → 選擇處理方式
- Coverage gate → 決定是否繼續
- 首次 dry-run → 確認部署配置
- Readiness gate → 確認合併

superpowers 使用較少：
- brainstorming 的澄清問題（一次一個）
- Visual Companion 接受與否
- 設計批准
- worktree 基線測試失敗時詢問

**關鍵差異**：gstack 的 AskUserQuestion 是「決策點」——用戶需要在多個選項中選擇。superpowers 的 AskUserQuestion 是「信息收集」——用戶提供 AI 缺少的上下文。

### 有無 Iron Law

gstack 的 Iron Law（來自 `/investigate`）：
- **Never apply fixes before identifying root cause**
- **Never fix without regression test**
- **Never fix without test showing failure before fix**
- **3 strikes rule**

superpowers 的 Iron Laws（分散在各技能）：
- **NO COMPLETION CLAIMS without running verification commands**
- **NO FIXES WITHOUT ROOT CAUSE**
- **NO PRODUCTION CODE WITHOUT FAILING TEST**
- **1% 規則（即使 1% 可能適用也必須 invoke）**

**關鍵相似點**：兩者都有「沒有根因不能修復」和「3 strikes rule」。這說明這兩個紀律是從真實失敗中提煉的通用原則，不是單一系統的設計。

**關鍵差異**：gstack 的 Iron Law 集中在 `/investigate`（調試場景），superpowers 的 Iron Law 分散在多個技能（通用紀律）。

---

## 用戶假設對比

### 假設用戶是誰？

| | gstack | superpowers |
|--|--------|-------------|
| 主要場景 | 獨立開發者或小團隊的技術負責人 | 任何使用 AI 輔助開發的人 |
| 編程能力 | 有編程經驗，但不一定是專家 | 有編程經驗 |
| AI 使用經驗 | 熟悉 AI 輔助開發 | 熟悉 AI 輔助開發 |
| 判斷力 | 有產品洞察（能回答 office-hours 的 6 個問題） | 能批准設計、提供上下文 |
| 主要風險 | 速度太快方向錯了、完整性不足、過度信任 AI | AI 跳過紀律、聲稱完成但沒驗證、理性化 |

### 用戶的主要風險是什麼？

**gstack 假設的用戶風險**：
1. **方向風險**：AI 讓代碼產能變大，但方向錯誤時代價也變大 → 需要 CEO review、office-hours
2. **完整性風險**：AI 生成的代碼看起來對，但缺少測試、文檔、邊緣情況 → 需要 Boil the Lake、QA 流程
3. **過度信任風險**：用戶可能認為 AI 生成的代碼就是正確的 → 需要 Anti-sycophancy、Review Army
4. **知識不積累風險**：每次 session 都從零開始 → 需要 Learnings 系統

**superpowers 假設的用戶風險**：
1. **紀律風險**：AI 傾向於跳過紀律 → 需要 1% 規則、強制 invoke
2. **驗證風險**：AI 聲稱完成但沒有驗證 → 需要 verification-before-completion
3. **根因風險**：AI 試圖修復但沒有找到根因 → 需要 systematic-debugging
4. **測試風險**：AI 先寫代碼再補測試 → 需要 TDD 紀律

**關鍵洞察**：gstack 假設用戶的風險是「做得太快」，superpowers 假設用戶的風險是「做得不紀律」。gstack 的解決方案是「多角度審查」，superpowers 的解決方案是「強制規則」。

---

## 技能調用機制對比

### gstack: proactive routing

gstack 的技能調用是**用戶主動選擇**：
- 用戶決定「現在需要 review」→ 調用 `/review`
- 用戶決定「現在需要規劃」→ 調用 `/autoplan`
- 用戶決定「現在需要發布」→ 調用 `/ship`

但 gstack 也有 **proactive suggestion** 機制：
- 技能可以在結束時建議後續步驟（`/review` 建議 `/qa`、`/freeze`）
- Review Readiness Dashboard 提醒用戶哪些審查沒跑
- 但最終決定權在用戶

### superpowers: 強制 invoke

superpowers 的技能調用是**強制自動**：
- 1% 規則：「即使只有 1% 機率適用也必須 invoke」
- AI 沒有選擇權——如果技能可能適用，就必須調用
- 技能覆蓋系統默認行為（但不是用戶指令）

**根本區別**：

gstack 信任用戶的判斷來選擇何時調用技能。用戶可能錯過調用時機，但技能會在結束時建議。

superpowers 不信任 AI 的判斷來選擇何時調用技能。AI 總會說「這次不需要」，所以用強制規則確保每次都調用。

**更深的洞察**：gstack 的「proactive suggestion」和 superpowers 的「強制 invoke」其實在解決同一個問題——「AI 可能不調用應該調用的技能」。gstack 的解決方案是「提醒但不強制」，superpowers 的解決方案是「強制不提醒」。

---

## 質量門控對比

| 維度 | gstack | superpowers |
|------|--------|-------------|
| 質量方法 | 流程（QA 工程師角色 + 瀏覽器自動化） | 紀律（規則 + 驗證命令） |
| 測試深度 | 端到端（瀏覽器 + 用戶流程 + Health Score） | 單元（TDD + 命令驗證） |
| 覆蓋率 | 60% 最小 / 80% 目標（Coverage Audit subagent） | 沒有明確目標（TDD 自然增長覆蓋率） |
| 自動化程度 | 高（自動修復、原子 commit、regression test 生成） | 低（人工修復、紀律保證） |
| 並行審查 | Review Army（多個 specialist 並行讀取同一個 diff） | 兩階段審查（spec → quality，串行） |
| 失敗處理 | Fix Loop（每個 bug 自動修復 + 原子 commit） | 問而不是猜（遇到阻塞就停止求助） |

**核心差異**：

gstack 的質量門控是**自動化流程**——跑瀏覽器、測用戶流程、計算 Health Score、自動修復。用戶看到結果（「Health Score: 92/100」），可以決定是否接受。

superpowers 的質量門控是**紀律保證**——沒有跑驗證命令不能說完成、沒有找到根因不能修復、沒有失敗測試不能寫代碼。用戶看到的不是分數，而是「這些規則都被遵守了」的保證。

---

## 並行架構對比

| 維度 | gstack Review Army | superpowers Parallel Agents |
|------|-------------------|---------------------------|
| 並行對象 | 多個 specialist（Testing、Maintainability、Security...） | 多個 general-purpose agent |
| 並行目的 | 同一個 diff 的多角度審查 | 多個獨立問題的並行解決 |
| 並行類型 | 並行讀取（不修改代碼） | 並行寫入（修改代碼） |
| 上下文隔離 | 每個 specialist 有全新 context（偏見隔離） | 每個 agent 有精心構造的上下文 |
| 衝突處理 | 不適用（只讀） | 嚴格限制（只並行獨立問題域） |
| git 基礎設施 | 不需要 | 需要 worktree |
| 結果合併 | 去重（同 fingerprint → 置信度 +1） | 檢查衝突 + 跑完整測試套件 |

**根本差異**：gstack 是並行分析，superpowers 是並行實現。

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

---

## 綜合評估：各自的優勢和弱點

### gstack 的優勢

1. **完整性保證**：26+ 技能覆蓋了從規劃到發布的完整生命周期
2. **自動化程度高**：瀏覽器測試、自動修復、原子 commit、覆蓋率審計——用戶不需要手動做這些
3. **角色深度**：「你是偏執的 Staff Engineer」比「做代碼審查」效果好得多
4. **知識積累**：Learnings 系統跨 session 共享項目知識
5. **用戶體驗**：AskUserQuestion 的固定格式確保用戶得到充分信息和選項

### gstack 的弱點

1. **單一模型**：整個工作流只用 Claude，沒有利用模型分工的成本優勢
2. **學習曲線陡峭**：26+ 技能的存在、用途和調用時機需要大量學習
3. **速度**：每次都很徹底，不適合需要快速原型的場景
4. **平台鎖定**：深度集成 Claude Code（hooks、瀏覽器守護進程）
5. **沒有成本追蹤**：大量 token 消耗但沒有可視化

### superpowers 的優勢

1. **紀律強度**：不可違背的規則確保了行為的可靠性
2. **平台無關**：不依賴 Claude Code 特有功能，適用於多個 AI 工具
3. **簡潔**：技能短而精，快速理解
4. **失敗學習**：24 次失敗記憶提煉出的紅旗表極具實用價值
5. **理性化預防**：直接對付 AI 最危險的行為——為自己跳過紀律找理由

### superpowers 的弱點

1. **依賴自律**：紀律規則沒有自動化保證——AI 可能仍然會跳過
2. **覆蓋範圍**：沒有涵蓋規劃、設計、發布等完整生命周期
3. **沒有知識積累**：沒有跨 session 的知識共享機制
4. **用戶互動少**：問而不是猜的模式效率依賴用戶的響應速度
5. **沒有角色深度**：不利用 LLM 的「角色扮演」能力優勢

---

## 核心論點評估

### 論點 1：gstack 是「工作流框架」，superpowers 是「行為紀律框架」

**支持**：✅

gstack 的 26+ 技能是完整的工作流覆蓋——從規劃到設計到執行到審查到發布。每個技能是結構化的步驟序列，保證「所有必要的步驟都被執行了」。

superpowers 的技能是紀律規則集合——「沒有驗證不能說完成」、「沒有根因不能修復」、「沒有失敗測試不能寫代碼」。它不定義完整工作流，它定義工作流中必須遵守的規則。

**gstack-plus 的啟示**：gstack-plus 需要同時做兩件事：
1. **工作流**：定義多模型協作的完整流程（規劃 → 審查 → 執行 → 驗證）
2. **紀律**：定義每個環節不可違背的規則（Exec 完成後必須獨立驗證）

---

### 論點 2：gstack 信任用戶的判斷，superpowers 不信任 AI 的自律

**支持**：✅

gstack 的用戶始終有最終決定權（AskUserQuestion），技能是「建議和執行」不是「強制」。用戶可以跳過 review、可以拒絕修復、可以選擇不同的部署方式。

superpowers 的 1% 規則說「即使你認為不需要也必須用」。它不信任 AI 自行判斷「什麼時候需要紀律」——因為 AI 的判斷有系統性偏差（總是偏向跳過）。

**gstack-plus 的啟示**：gstack-plus 應該：
- **信任用戶**：用戶決定模型分工的策略（保守 vs 激進、成本預算）
- **不信任 AI**：Exec 模型的輸出必須獨立驗證，不能因為「上次表現好」就跳過

---

### 論點 3：gstack 優化「完整性」（Boil the Lake），superpowers 優化「可靠性」（強制驗證）

**支持**：✅

gstack 的 Boil the Lake 原則說「做完整的事」——100% 測試覆蓋、所有邊緣情況、完整文檔。它在優化「沒有遺漏」。

superpowers 的 verification-before-completion 說「在你說完成之前，跑命令看輸出」。它在優化「聲稱的真實性」。

**gstack-plus 的啟示**：gstack-plus 需要同時優化兩者：
- **完整性**：Exec 模型也應該做完整的事（不只是讓測試通過，還要處理邊緣情況、寫文檔）
- **可靠性**：Exec 模型的聲稱必須獨立驗證（不因為它說通過了就相信）

---

## 對 gstack-plus 的啟示：如何融合兩者？

### gstack-plus 應該從 gstack 借鑒的

1. **角色化設計**：每個 Tier 應該是明確的角色（Architect、Reviewer、Executor），有具體的行為框架
2. **結構化工作流**：規劃 → 審查 → 執行的步驟順序，不是自由發揮
3. **Learnings 系統**：跨 session 共享「哪類任務 Exec 模型容易犯什麼錯誤」
4. **Boil the Lake**：Exec 模型也應該做完整的事，不是只做「核心功能」
5. **Review Army 模式**：並行 specialist 審查可以借鑒為並行驗證（功能測試 + 安全 + 性能）
6. **Fix-First 哲學**：顯而易見的問題自動修復，模糊的才問人
7. **User Sovereignty**：用戶始終有最終決定權，AI 提供信息

### gstack-plus 應該從 superpowers 借鑒的

1. **紀律規則**：Exec 完成後必須獨立驗證、任務描述必須清晰、失敗必須報告

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

2. **理性化預防**：列出 Claude 可能試圖跳過驗證的想法，提前對付
3. **No Placeholders**：Handoff 指令不能有模糊地帶
4. **問而不是猜**：Exec 遇到不確定就報告，不自行猜測
5. **3-strike 規則**：Exec 失敗 3 次 → 升級到更強模型
6. **證據先於斷言**：不能因為 Exec 說「測試通過了」就相信——Claude 必須自己跑
7. **Bite-Sized 任務拆分**：每個 Handoff 任務應該是 2-5 分鐘的單一動作

### gstack-plus 的獨特創新：模型分工

兩者都沒有解決的問題：**如何用多個模型協作，在保持質量的前提下降低成本**。

gstack-plus 的核心增量價值：
1. **任務分類器**：自動識別任務類型 → 路由到正確模型（gstack 手動選擇技能，superpowers 強制調用）
2. **失敗回流**：Exec 失敗 → 智能升級（不是從零重來）
3. **成本追蹤**：每個模型的 token 消耗和成本可視化
4. **模型路由策略**：保守（默認高 tier）vs 激進（默認低 tier）可配置

---

## 我最後的綜合洞察

讀完所有 12 篇筆記（5 篇已有 + 7 篇新寫），我對兩個系統的理解達到了新的層次：

**gstack 和 superpowers 不是競爭關係——它們是互補的。**

gstack 提供了「完整工作流的藍圖」——從規劃到發布，每個環節應該做什麼。
superpowers 提供了「每個環節的紀律」——在做之前應該遵守什麼規則。

**gstack-plus 的正確定位是：在 gstack 的工作流藍圖上，疊加 superpowers 的紀律規則，再加上模型分工的維度。**

```
gstack 的工作流:  規劃 → 設計 → 執行 → 審查 → 發布
superpowers 紀律: 1%規則  TDD   驗證   根因   No Claims
gstack-plus 新增: Tier-A  Mid   Exec  驗證   成本追蹤
```

這三者不是取代關係，是疊加關係。

---

*完成 2026-05-02*
