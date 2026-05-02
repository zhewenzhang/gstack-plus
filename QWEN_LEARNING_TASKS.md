# Qwen Code 任務：完成 gstack-plus 學習筆記

> **給 Qwen Code 的工作指令**
> 工作目錄：`D:\gstack-plus`
> 預計完成：8 個學習筆記文件 + 更新 README

---

## 背景

這是一個針對 `gstack`（AI 工作流 skill 庫）和 `superpowers`（另一個 AI 紀律系統）的深度學習計劃。
目的是理解這兩個系統的設計哲學，為開發 `gstack-plus`（多 Tier AI 模型協作框架）打基礎。

**已完成的筆記（不要修改）：**
- `docs/learning-notes/gstack-overview.md` — gstack 全景圖
- `docs/learning-notes/gstack-planning-skills.md` — office-hours, plan-ceo-review, plan-eng-review, autoplan
- `docs/learning-notes/gstack-review-skills.md` — review, qa, investigate

**你需要完成的 8 個文件：**
1. `docs/learning-notes/gstack-shipping-skills.md`
2. `docs/learning-notes/gstack-anatomy.md`
3. `docs/learning-notes/superpowers-planning.md`
4. `docs/learning-notes/superpowers-quality.md`
5. `docs/learning-notes/superpowers-parallel.md`
6. `docs/learning-notes/superpowers-anatomy.md`
7. `docs/learning-notes/gstack-vs-superpowers.md`
8. `docs/learning-notes/key-insights.md`

最後更新 `docs/learning-notes/README.md` 的進度追蹤表。

---

## 重要：如何讀技能文件

### gstack 技能文件

**目錄**：`C:\Users\1\.claude\skills\gstack\{skill-name}\SKILL.md`

**關鍵問題**：每個 gstack SKILL.md 開頭有超長的共享 preamble（bash 代碼），實際的技能工作流內容在很後面才開始：

| preamble-tier | 實際內容開始位置 | 識別信號 |
|---|---|---|
| tier 2 | ~offset 450-550 | 看到 `# Systematic Debugging` 或技能名稱標題 |
| tier 3 | ~offset 500-600 | 看到 `# YC Office Hours` 或技能名稱標題 |
| tier 4 | ~offset 680-730 | 看到 `## Step 0:` 或 `# Pre-Landing` 或技能名稱標題 |

**讀取方法**：先讀前 30 行獲取 frontmatter（版本、描述、preamble-tier），然後從 offset 600+ 開始讀實際工作流內容，每次讀 200 行，直到覆蓋完整工作流。

### superpowers 技能文件

**目錄**：`C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\{skill-name}\SKILL.md`

superpowers 的 SKILL.md **沒有**超長 preamble，從第一行就開始有用的內容。直接讀即可。

---

## 質量標準

**必讀**：在開始之前，請先讀 `docs/learning-notes/gstack-review-skills.md` 作為質量參考。

每個筆記文件的結構：

```markdown
# [主題] 學習筆記

> 標注 Day 和涵蓋的技能

## 技能概覽（表格）

## 一、/skill-name — 技能描述

### 字面層：它做了什麼？
（描述完整工作流，用 ASCII 圖或表格呈現）

### 設計層：為什麼這樣設計？
（每個重要設計決策，包含：決策 → 為什麼 → 反例）

## 哲學層：反映了什麼信念？
（2-4 句話，精煉核心信念）

## 對 gstack-plus 的啟發
（具體的可操作啟發）

## 我還沒理解的地方
（誠實列出）
```

**質量要求**：
- 不要只是複述 skill 的說明文字。要提取「設計決策」和「背後的理由」
- 每個設計決策必須有「反例」——如果不這樣設計會發生什麼？
- 對 gstack-plus 的啟發必須是具體的、可操作的，不是空話
- 如果技能內容很短，深挖設計意圖；如果很長，提煉最重要的 3-5 個點

---

## 任務一：gstack-shipping-skills.md

**輸出文件**：`D:\gstack-plus\docs\learning-notes\gstack-shipping-skills.md`

**需要讀的文件**：
1. `C:\Users\1\.claude\skills\gstack\ship\SKILL.md` — 讀 frontmatter + offset 680+ 開始讀工作流
2. `C:\Users\1\.claude\skills\gstack\land-and-deploy\SKILL.md` — 讀 frontmatter + offset 680+ 開始讀工作流

**重點關注的問題**：
- `/ship` 在 PR 合併前做哪些「不可逆操作前的最後防線」檢查？
- `/ship` 和 `/review` 的分工：`/review` 做結構審查，`/ship` 做什麼？
- `/land-and-deploy` 的 CI 等待機制——它怎麼避免「merge 了但 deploy 失敗」的問題？
- 失敗回滾怎麼設計？有沒有明確的回滾步驟？
- WIP commit 的 squash 機制（`/ship` 應該負責把 `WIP:` 前綴的 commit 合併）
- 不可逆操作的前後有什麼確認機制？

**要回答的核心問題**：
1. `/ship` 是「PR 創建 + 合併」還是「PR 創建」還是只做「發布前檢查」？
2. `/land-and-deploy` 的步驟順序是什麼？merge → CI → deploy → verify 的具體流程？
3. 這兩個技能怎麼協作？誰先誰後？

---

## 任務二：gstack-anatomy.md

**輸出文件**：`D:\gstack-plus\docs\learning-notes\gstack-anatomy.md`

**不需要讀新文件**（基於已有的 4 個筆記綜合分析）。

**要回答的 7 個核心問題**（這是 LEARNING_PLAN.md 設定的）：

1. **gstack 為什麼這樣設計？**（不是「怎麼做」，是「為什麼」）
2. **superpowers 為什麼用「強制 invoke」？**（注意：這個是 superpowers 的問題，可以先留佔位）
3. **Brain Sync 解決了什麼根本問題？**（從已有筆記中尋找答案）
4. **「Boil the Lake」原則的真實含義？**
5. **為什麼 skill 是 markdown 而不是代碼？**
6. **gstack 和傳統的 prompt engineering 區別在哪？**
7. **哪些設計決策是「對的」？哪些可以改進？**

**還需要回答**：
- gstack 假設了什麼樣的用戶？
- 它優化什麼？犧牲什麼？
- 能用 5 句話講清楚 gstack 的設計理念嗎？（用 5 句話挑戰）

**可以引用的內容**：
- `docs/learning-notes/gstack-overview.md` — 全景圖、分類、哲學層
- `docs/learning-notes/gstack-planning-skills.md` — 規劃技能的設計模式
- `docs/learning-notes/gstack-review-skills.md` — 質量技能的設計模式
- `C:\Users\1\.claude\skills\gstack\ETHOS.md` — 直接讀這個文件，它包含 gstack 的三個核心原則

---

## 任務三：superpowers-planning.md

**輸出文件**：`D:\gstack-plus\docs\learning-notes\superpowers-planning.md`

**需要讀的文件**（superpowers 從開頭讀，不需要跳過）：
1. `C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\brainstorming\SKILL.md`
2. `C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\writing-plans\SKILL.md`
3. `C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\executing-plans\SKILL.md`
4. `C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\using-superpowers\SKILL.md` — 讀 using-superpowers 理解整體設計哲學

**重點關注的問題**：
- `brainstorming` 的「強制結構」——它強制了什麼？為什麼要強制？
- `writing-plans` 的計劃文檔格式——為什麼是這個格式？
- `executing-plans` 怎麼處理「計劃和實際執行的偏差」？
- `using-superpowers` 說「即使 1% 的機率也必須 invoke skill」——這個規則背後的恐懼是什麼？
- superpowers 的「強制 invoke」機制 vs gstack 的「proactive suggestion」——根本區別在哪？
- superpowers 的 skill 比 gstack 的 skill 短很多——為什麼？這說明了什麼設計取捨？

---

## 任務四：superpowers-quality.md

**輸出文件**：`D:\gstack-plus\docs\learning-notes\superpowers-quality.md`

**需要讀的文件**：
1. `C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\verification-before-completion\SKILL.md`
2. `C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\systematic-debugging\SKILL.md`
3. `C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\test-driven-development\SKILL.md`

**重點關注的問題**：
- `verification-before-completion` — 在「認為完成」之前必須做什麼？這比 gstack 的 `/qa` 有什麼不同？
- `systematic-debugging` — 與 gstack 的 `/investigate` 對比，兩者有什麼核心差異？
- `test-driven-development` — superpowers 的 TDD 和傳統 TDD 有什麼不同？
- 這三個技能共同反映了什麼信念？（「AI 傾向於謊稱完成」？）
- 這些技能怎麼防止 AI 的「自我欺騙」（聲稱完成卻沒驗證）？

**對比 gstack**：superpowers 的質量技能更輕量，gstack 的 `/qa` 很重（完整的 QA 工程師流程）。這個取捨說明了什麼？

---

## 任務五：superpowers-parallel.md

**輸出文件**：`D:\gstack-plus\docs\learning-notes\superpowers-parallel.md`

**需要讀的文件**：
1. `C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\subagent-driven-development\SKILL.md`
2. `C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\dispatching-parallel-agents\SKILL.md`
3. （可選）`C:\Users\1\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\skills\using-git-worktrees\SKILL.md` — 了解並行開發的基礎設施

**重點關注的問題**：
- 並行子 Agent 的邊界怎麼劃定？什麼任務適合並行？什麼不適合？
- 子 Agent 之間的衝突怎麼避免？（特別是 git 衝突、文件衝突）
- `subagent-driven-development` 和 `dispatching-parallel-agents` 的區別是什麼？一個是模式，一個是技術？
- git worktree 在並行開發中的角色——每個 Agent 有自己的 worktree？
- 並行 Agent 的結果怎麼合併和驗證？

**核心問題**：superpowers 的並行 Agent 模式和 gstack 的 `/review` Review Army（並行 specialist）有什麼根本的設計差異？

---

## 任務六：superpowers-anatomy.md

**輸出文件**：`D:\gstack-plus\docs\learning-notes\superpowers-anatomy.md`

**不需要讀新文件**（基於任務三、四、五的筆記綜合分析）。

**要回答的核心問題**：
1. superpowers 的「強制 invoke」精神來自哪裡？（它在解決什麼問題？）
2. 為什麼用 markdown skill 而不是代碼或 prompt template？
3. superpowers 的 skill 比 gstack 短很多——這是設計選擇還是成熟度差異？
4. superpowers 假設了什麼樣的 AI 失敗模式？
5. superpowers 和 gstack 的角色分工：哪個更適合做「紀律框架」，哪個更適合做「工作流框架」？

**必須達到的輸出**：能用 5 句話講清楚 superpowers 的設計哲學。

---

## 任務七：gstack-vs-superpowers.md

**輸出文件**：`D:\gstack-plus\docs\learning-notes\gstack-vs-superpowers.md`

**不需要讀新文件**（基於所有之前的筆記綜合分析）。

**結構建議**：

```markdown
# gstack vs superpowers：設計哲學對比

## 基本定位對比

## 技能設計哲學對比
（markdown 格式、長度、結構）

## 工作流設計對比
（有無 STOP point、有無 AskUserQuestion、有無 Iron Law）

## 用戶假設對比
（假設用戶是誰？用戶的主要風險是什麼？）

## 技能調用機制對比
（gstack: proactive routing vs superpowers: 強制 invoke）

## 質量門控對比

## 並行架構對比

## 綜合評估：各自的優勢和弱點

## 對 gstack-plus 的啟示：如何融合兩者？
```

**核心論點**（你需要支持或反駁）：
- gstack 是「工作流框架」，superpowers 是「行為紀律框架」
- gstack 信任用戶的判斷，superpowers 不信任 AI 的自律
- gstack 優化「完整性」（Boil the Lake），superpowers 優化「可靠性」（強制驗證）

---

## 任務八：key-insights.md

**輸出文件**：`D:\gstack-plus\docs\learning-notes\key-insights.md`

**不需要讀新文件**（綜合所有 7 個之前的筆記）。

**這是整個學習計劃最重要的輸出文件。** 它回答：「讀完所有這些，對 gstack-plus 的設計有什麼核心啟發？」

**必須涵蓋的部分**：

```markdown
# 對 gstack-plus 設計的核心啟發

## 最重要的 5 個洞察
（每個洞察：1 句話陳述 + 2-3 句解釋 + 在 gstack-plus 中的具體應用）

## gstack 中可以直接借鑒的設計
（具體機制，不是抽象原則）

## gstack 中可以改進的設計
（有理由的批判，不是否定）

## superpowers 中可以借鑒的設計

## gstack-plus 的核心增量價值是什麼？
（相對於單用 gstack 或單用 superpowers，gstack-plus 提供了什麼？）

## 開始 Phase 1 前必須解決的問題
（還有什麼是你在讀完這些後還沒確定的？）
```

---

## 最後：更新 README.md

完成所有任務後，更新 `D:\gstack-plus\docs\learning-notes\README.md`：

1. 把所有 `[ ]` 改為 `[x]`（已完成的項目）
2. 在進度表中添加每個文件的完成記錄，日期統一用 `2026-05-02`

---

## 執行順序建議

按以下順序執行（每個任務完成後再進行下一個）：

```
1. gstack-shipping-skills.md    (讀新文件: ship, land-and-deploy)
2. gstack-anatomy.md             (讀 ETHOS.md，綜合已有筆記)
3. superpowers-planning.md       (讀 brainstorming, writing-plans, executing-plans, using-superpowers)
4. superpowers-quality.md        (讀 verification, systematic-debugging, TDD)
5. superpowers-parallel.md       (讀 subagent-driven, dispatching-parallel, git-worktrees)
6. superpowers-anatomy.md        (綜合 3-5 的筆記)
7. gstack-vs-superpowers.md      (綜合所有筆記)
8. key-insights.md               (最後的綜合，最重要的文件)
9. 更新 README.md
```

---

## 驗收標準

Claude 將在你完成後檢查以下內容：

- [ ] 8 個文件都已創建，路徑正確
- [ ] 每個文件都遵循三層結構（字面層、設計層、哲學層）
- [ ] 每個設計決策都有「反例」（如果不這樣會怎樣）
- [ ] `gstack-anatomy.md` 包含對 LEARNING_PLAN.md 中 7 個核心問題的回答
- [ ] `key-insights.md` 有明確的「gstack-plus 核心增量價值」陳述
- [ ] `gstack-vs-superpowers.md` 有具體的對比，而不只是列清單
- [ ] README.md 已更新

---

## 注意事項

1. **不要修改**已完成的 3 個文件（gstack-overview、gstack-planning-skills、gstack-review-skills）
2. **不要包含 Day 14 的實驗**（`experiments/baseline-vs-hybrid.md`）——這需要真實測試數據，不是文檔分析任務
3. 如果某個 SKILL.md 文件無法讀取，在筆記中標注「無法讀取，基於已知信息推斷」，繼續完成其他部分
4. 筆記語言：**繁體中文**（與已完成的筆記一致）
5. 每個文件底部加上 `*完成 2026-05-02*`
