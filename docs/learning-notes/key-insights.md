# 核心設計洞察

> 從實際 multi-model 協作中提煉的 5 個設計原則——關於 AI 紀律、角色化設計與品質保障。

---

## 最重要的 5 個洞察

### 洞察 1：AI 的「紀律不足」比「能力不足」更危險——但兩者都需要解決

**陳述**：AI 有能力做正確的事，但傾向於跳過紀律——在 multi-model 協作中，這個問題會被放大而非稀釋。

**解釋**：superpowers 的 24 次失敗記憶證明：AI 的失敗模式不是「不會寫測試」，而是「選擇不寫測試」。在 gstack-plus 的多模型環境中，Claude（協調者）可能跳過對 Exec 輸出的驗證（「上次它沒出錯」），Exec 可能跳過邊緣情況處理（「核心功能夠了」），Tier-Mid 可能跳過深度審查（「看起來沒問題」）。每個模型的紀律偏差會疊加，不是抵消。

**在 gstack-plus 中的具體應用**：
- 定義不可違背的紀律規則（NO EXEC CLAIMS WITHOUT INDEPENDENT VERIFICATION）
- 同時定義自動化工作流（Claude 自動跑測試、自動檢查 diff）——紀律 + 自動化，不只依賴自律

---

### 洞察 2：「角色化」是 LLM 最強的能力，但角色需要紀律來保證輸出質量

**陳述**：讓 LLM 成為「偏執的 Staff Engineer」比「review 代碼」效果好得多——但角色本身不足以保證一致性，需要紀律規則作為角色的「行為約束」。

**解釋**：gstack 的角色化設計（26+ 技能對應不同專家角色）利用了 LLM 的本質特徵——它們對「角色指令」的響應遠好於「功能指令」。但角色是「視角」（用什麼眼光看問題），紀律是「行為」（實際做什麼）。一個「偏執的 Staff Engineer」如果不跑測試就聲稱完成，他的偏執就沒有意義。

**在 gstack-plus 中的具體應用**：
- 每個 Tier 應該有明確角色：Tier-A = Architect（戰略判斷），Tier-Mid = Reviewer（複雜審查），Tier-Exec = Executor（機械實現）
- 每個角色應該有紀律約束：Architect 不能在規劃批准前讓 Exec 開始、Reviewer 不能跳過規格合規性檢查、Executor 不能超出任務描述的範圍

---

### 洞察 3：並行是速度，隔離是質量——兩者需要精心平衡

**陳述**：subagent-driven-development 的「新鮮上下文」模式和 Review Army 的「偏見隔離」模式都指向同一個真理：每個分析/執行單元應該有獨立、乾淨的上下文，不繼承前一個的殘留。

**解釋**：gstack 的 Review Army 讓每個 specialist 有「全新 context」來防止偏見傳染（testing specialist 不知道 maintainability specialist 說了什麼）。superpowers 的 subagent-driven-development 讓每個任務有「新鮮 subagent」來防止上下文污染（不繼承 session 歷史）。兩者殊途同歸——隔離是質量的保證。但 superpowers 同時警告：只有在真正的獨立問題域上才能並行——共享狀態的任務並行會導致衝突。

**在 gstack-plus 中的具體應用**：
- 每個 Exec subagent 應該獲得精心構造的 handoff 指令（不繼承前一個 Exec 的上下文）
- 獨立的 Exec 任務可以並行（修改不同文件、不同子系統）
- 有共享狀態的 Exec 任務必須串行（一個的輸出是另一個的輸入）
- 每個 Exec 應該在自己的 git worktree 中工作

---

### 洞察 4：「完整的事」和「快速的事」的成本差異在 AI 時代縮小了，但「正確的事」和「錯誤的事」的成本差異變大了

**陳述**：Boil the Lake 的經濟學重估在 multi-model 環境中有新的含義：讓 Exec 模型做完整的事（測試 + 文檔 + 邊緣情況）的邊際成本很小，但讓 Exec 模型做錯誤的事（方向錯了）的代價極大。

**解釋**：gstack 的 Boil the Lake 說：AI 讓完整實現（100% 測試覆蓋）和捷徑（90% 覆蓋）的成本差異從 1.75 天縮小到 7 分鐘。所以每次都應該做完整的。在 gstack-plus 中，這個邏輯更強烈：讓 Exec 模型多花 5 分鐘寫測試和文檔，成本幾乎為零。但如果 Exec 模型的方向錯了（實現了不需要的功能），返工的代價是整個 handoff 循環的時間（可能 30+ 分鐘）。

**在 gstack-plus 中的具體應用**：
- Handoff 指令必須包含「完整定義」（不只是「做 X」，而是「做 X，測試 Y，文檔 Z，邊緣情況 W」）
- No Placeholders 規則：Handoff 指令不能有「處理錯誤」——要說「如果遇到 NetworkError，重試 2 次，然後返回 500」
- Exec 模型的任務必須 Bite-Sized（2-5 分鐘的單一動作），這樣「做完整的事」的成本才真的可忽略

---

### 洞察 5：失敗是信息，不是災難——關鍵在於如何分類和升級

**陳述**：gstack 的 Test Failure Ownership Triage 和 superpowers 的 3-strike rule 都指向同一個模式：失敗應該被分類（誰造成的？什麼類型？）然後根據分類選擇響應（現在修復？稍後修復？升級？）

**解釋**：gstack 的 `/ship` 把測試失敗分為 In-branch（當前分支造成）和 Pre-existing（已有問題），然後根據 solo/collaborative 模式選擇不同響應。superpowers 的 systematic-debugging 說 3 次假設失敗就停下來質疑架構，不是繼續嘗試。兩者都在說：失敗本身包含信息——它告訴我們問題在哪裡、是誰的責任、應該用什麼策略處理。在 gstack-plus 中，Exec 模型的失敗也應該被分類和升級，而不是簡單的「重試」。

**在 gstack-plus 中的具體應用**：
- Exec 失敗分類：指令不清 → 澄清指令後重試；Exec 理解錯誤 → 升級到 Tier-Mid 分析；任務太難 → 拆分任務或升級到 Tier-A
- 3-strike 規則：同一個 Exec 任務失敗 3 次 → 不再讓 Exec 嘗試，升級到更強模型
- 失敗模式記錄：寫入 Learnings 系統（「這類任務 Exec 模型容易犯什麼錯誤」），供未來路由決策使用

---

## gstack 中可以直接借鑒的設計

### 1. 角色人格設計

gstack 的每個技能不是「工具」而是「角色」——「你是偏執的 Staff Engineer」、「你是 QA Lead 工程師」。角色描述包含了認知模式、行為框架、價值觀。

**gstack-plus 的應用**：每個 Tier 應該有明確的角色人格：
- Tier-A = 「你是首席架構師，你的工作是確保方向正確、架構合理」
- Tier-Mid = 「你是高級審查者，你的工作是發現隱藏的問題和集成風險」
- Tier-Exec = 「你是執行工程師，你的工作是按照精確規格實現功能」

### 2. Review Readiness Dashboard

gstack 的 Review Readiness Dashboard 可視化哪些審查跑了、哪些沒跑、哪些過時了。

**gstack-plus 的應用**：一個 Dashboard 顯示「這個 handoff 循環的狀態」：
- 規劃：已批准 / 待修改
- Exec 任務：N/M 完成
- 驗證：通過 / 失敗（具體哪個測試）
- 成本：累計 $X

### 3. Fix-First 哲學

gstack 的 Fix-First：顯而易見的問題自動修復，模糊的才問人。

**gstack-plus 的應用**：當 Exec 的輸出有小問題（格式、命名、缺少邊緣情況處理）時，Claude 應該直接修復而不是問用戶。只有當問題涉及方向判斷（「這個功能真的需要嗎？」）時才問用戶。

### 4. Learnings 系統的跨模型擴展

gstack 的 Learnings 系統存儲項目級知識（「這個 repo 的測試用 `bun test`」）。

**gstack-plus 的擴展**：除了項目知識，還存儲模型級知識：
- 「這類任務（API 集成）Exec 模型（Qwen）的常見錯誤：忘記錯誤處理」
- 「這類任務（UI 組件）Exec 模型的常見錯誤：沒有處理加載狀態」
- 「這類任務（數據轉換）Exec 模型的表現：95% 成功率，不需要升級」

### 5. 並行 specialist 審查

gstack 的 Review Army 並行多個 specialist 審查同一個 diff。

**gstack-plus 的應用**：當 Exec 完成後，並行多個驗證：
- 功能測試驗證（測試通過嗎？）
- 範圍驗證（改動符合任務描述嗎？）
- 質量驗證（代碼風格、性能、安全嗎？）

---

## gstack 中可以改進的設計

### 1. 單一模型 → 多模型協作

gstack 只用 Claude。在成本敏感和任務多樣性的場景下，單一模型不是最優的。

**改進**：gstack-plus 引入三層模型分工：
- Tier-A（Opus/GPT-5）：戰略規劃、架構判斷
- Tier-Mid（Sonnet/GPT-4o）：複雜審查、集成判斷
- Tier-Exec（Qwen/DeepSeek）：機械實現

### 2. 手動技能選擇 → 自動任務分類

gstack 需要用戶知道 `/investigate` 適合 bug、`/review` 適合代碼審查。

**改進**：gstack-plus 的任務分類器自動識別任務類型並路由到正確模型，用戶只需要描述想做什麼。

### 3. 沒有成本追蹤

gstack 有 telemetry 但沒有「這個 session 花了多少錢」的視圖。

**改進**：gstack-plus 在每個環節輸出成本估算（token 使用量 × 模型單價），並在 Dashboard 中顯示累計成本。

### 4. 技能的 DRY 問題

26+ 個技能之間有大量重複邏輯（平台檢測、learnings 搜索、runtime 檢測）。

**改進**：gstack-plus 提取「子技能」機制，讓技能可以調用其他技能的核心邏輯，減少重複。

---

## superpowers 中可以借鑒的設計

### 1. 紀律規則模式

superpowers 的「不可違背的規則」+「紅旗表」+「理性化預防」三件套。

**gstack-plus 的應用**：
```
鐵律：Exec 說完成不算數，Claude 必須獨立驗證
紅旗：「上次它沒出錯」、「測試太多了跑不完」、「這個改動很小」
理性化預防：這些想法都是理性化，停止，跑驗證
```

### 2. No Placeholders 規則

writing-plans 的計劃不能有 TBD/TODO/「適當的錯誤處理」。

**gstack-plus 的應用**：Handoff 指令不能有模糊地帶：
- ❌ 「處理錯誤情況」
- ✅ 「如果遇到 NetworkError，重試 2 次（間隔 1s），然後返回 500 狀態碼和 'Service temporarily unavailable' 消息」

### 3. 證據先於斷言

verification-before-completion 的 Gate 函數：IDENTIFY → RUN → READ → VERIFY → 才能聲稱。

**gstack-plus 的應用**：Claude 接受 Exec 輸出前的驗證流程：
1. IDENTIFY：什麼命令/測試能證明 Exec 完成了任務？
2. RUN：Claude 自己執行（不是 Exec 跑的）
3. READ：完整讀取輸出
4. VERIFY：輸出確認了 Exec 的聲稱嗎？
5. 只有到這一步才能接受 Exec 的結果

### 4. Implementer 四種狀態

subagent-driven-development 的 DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED。

**gstack-plus 的應用**：Exec 模型完成後報告狀態：
- DONE → Claude 驗證 → 接受
- DONE_WITH_CONCERNS → Claude 讀取關注點 → 判斷是否影響正確性
- NEEDS_CONTEXT → Claude 提供更多上下文 → 重新分派
- BLOCKED → Claude 評估阻塞 → 分類處理（澄清/拆分/升級）

### 5. 3-strike 規則

systematic-debugging 的 3 次假設失敗 → 停止 → 質疑架構。

**gstack-plus 的應用**：
- Exec 同一個任務失敗 3 次 → 升級到 Tier-Mid 分析根因
- Tier-Mid 分析後仍然失敗 3 次 → 升級到 Tier-A 重新規劃
- Tier-A 重新規劃後仍然失敗 → 停止，報告給用戶

### 6. 問而不是猜

executing-plans 遇到阻塞就停止求助，不自行猜測。

**gstack-plus 的應用**：Exec 模型遇到不確定應該報告給 Claude，不是自行猜測。Claude 遇到不確定應該問用戶，不是自行猜測。

---

## gstack-plus 的核心增量價值是什麼？

**相對於單用 gstack 或單用 superpowers，gstack-plus 提供了什麼？**

**一句話回答**：gstack-plus 提供了「多模型協作的智能路由和失敗回流機制」，在保持 gstack 工作流完整性和 superpowers 紀律強度的前提下，將 AI 工作流成本降低 60%。

**詳細解釋**：

| | 單用 gstack | 單用 superpowers | gstack-plus |
|--|-------------|-----------------|-------------|
| 工作流完整性 | ✅ 26+ 技能覆蓋完整生命周期 | ❌ 只有紀律規則，沒有完整流程 | ✅ 繼承 gstack 的完整流程 |
| 紀律強度 | ❌ 依賴角色自律 | ✅ 不可違背的規則 | ✅ 紀律規則 + 自動化保證 |
| 模型分工 | ❌ 只用 Claude | ❌ 不指定模型 | ✅ 三層模型智能路由 |
| 成本優化 | ❌ 沒有成本追蹤 | ❌ 沒有成本意識 | ✅ 成本可視化 + 智能路由節省 |
| 失敗處理 | ✅ Fix Loop（自動修復） | ✅ 3-strike + 升級 | ✅ 智能分類 + 分級升級 |
| 任務路由 | ❌ 用戶手動選擇技能 | ❌ 強制調用所有可能技能 | ✅ 自動分類 + 智能路由 |

**gstack-plus 的獨特價值不是「任何一個維度的最好」——而是「三個維度的整合」**：
1. gstack 的工作流完整性（知道該做什麼）
2. superpowers 的紀律強度（確保做了）
3. 多模型分工的成本優勢（用正確的成本做）

---

## 開始 Phase 1 前必須解決的問題

讀完所有這些後，我還沒確定的：

### 1. 任務分類器的 5 維度評分閾值

PROJECT_ROADMAP.md 提到 5 維度（判斷強度、上下文寬度、風險權重、可驗證性、創意密度），但每個維度的評分標準和路由閾值還沒定義。

**需要確定**：
- 每個維度的評分範圍（1-5？1-10？）
- 什麼閾值路由到哪個 Tier？
- 有沒有「一票否決」（某個維度超標直接路由到 Tier-A）？

### 2. 失敗回流的具體升級路徑

Exec 失敗後，是「重試同一個 Exec」「換更強的 Exec」「升級到 Tier-Mid 分析」「升級到 Tier-A 重新規劃」？決策樹是什麼？

**需要確定**：
- 失敗分類框架（什麼類型的失敗對應什麼響應）
- 升級的觸發條件（3-strike？還是根據失敗類型不同？）
- 升級的終止條件（什麼時候承認「這個任務 AI 做不了」並報告給用戶）

### 3. Handoff 指令的標準格式

writing-plans 的 No Placeholders 規則很好，但 Handoff 指令的具體格式（什麼字段、什麼粒度）需要定義。

**需要設計**：
- 最小 Handoff 模板（任務描述、允許改動、驗證標準、上下文文件）
- 任務拆分的粒度標準（什麼時候拆成多個 Handoff？）
- Handoff 之間的依賴關係怎麼表達？

### 4. 成本和質量的平衡點

保守路由（默認高 tier）= 高成本低風險。激進路由（默認低 tier）= 低成本高風險。gstack-plus 的默認策略應該是什麼？

**需要決策**：
- 默認策略（保守 vs 激進 vs 自適應）
- 用戶能不能自定義策略？
- 有沒有「成本預算」機制（今天最多花 $5）？

### 5. 真實用戶驗證

YC_BLINDSPOTS.md 的第一個盲點就是「和真實用戶聊過了嗎？」。所有這些筆記分析都是文檔研究，不是用戶訪談。

**需要行動**：
- 找 5-10 個 gstack 用戶訪談：他們用 gstack 的最大痛點是什麼？
- 問他們：「如果有多模型分工，你最關心什麼？」（成本？質量？速度？）
- 驗證假設：「60% 成本節省」是真實的嗎？

---

## 最後一句話

**gstack-plus 不是 gstack 的升級版，也不是 superpowers 的替代者——它是兩者的整合，加上「模型分工」的新維度，形成的全新東西。**

gstack 說：「做完整的事。」
superpowers 說：「紀律地做。」
gstack-plus 說：「用正確的模型，以紀律的方式，做完整的事。」

---

*完成 2026-05-02*
