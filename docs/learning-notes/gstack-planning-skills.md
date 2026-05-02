# gstack 規劃類技能深度解析

**學習日期**: 2026-05-02（Day 2）
**覆蓋技能**: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/autoplan`
**學習方法**: 通讀每個技能的完整 SKILL.md，重點分析工作流步驟和設計決策

---

## 字面層：這四個技能做了什麼？

### `/office-hours` — YC 辦公時間

**核心任務**：在任何代碼誕生之前，搞清楚「我們在建什麼，為什麼」。

**嚴格的 HARD GATE**：這個技能絕對不能寫代碼、調用其他實現技能、或做任何實現動作。輸出只有一個設計文檔。

**工作流**（3 個階段）：

**Phase 1：上下文收集**
1. 讀 CLAUDE.md、TODOS.md、git log（最近 30 條）
2. 列出這個項目已有的設計文檔
3. 搜索相關的歷史 learnings
4. **問用戶一個問題**：「你的目標是什麼？」→ 根據答案決定 Startup 模式或 Builder 模式

**Phase 2A：Startup 模式（最重要的部分）**

6 個「逼問問題」，每個要求具體的、基於證據的答案：

| 問題 | 問什麼 | 紅旗信號 |
|------|--------|---------|
| Q1 Demand Reality | 最強的「有人真的需要」的證據 | 「很多人說感興趣」「有 500 個 waitlist」 |
| Q2 Status Quo | 用戶現在用什麼替代方案 | 「現在什麼都沒有，所以機會很大」 |
| Q3 Desperate Specificity | 說出最需要這個的那個「人」的名字和職位 | 「企業客戶」「開發者」（不夠具體） |
| Q4 Narrowest Wedge | 最小版本是什麼，可以這週就付錢買的 | 「要完整平台才能提供價值」 |
| Q5 Observation & Surprise | 有沒有坐下來看人用（不說話只看）？看到了什麼意外？ | 「我們做了問卷調查」「演示進行得很順」 |
| Q6 Future-Fit | 3 年後世界不一樣了，這個產品更重要還是更不重要？ | 「市場在增長 20%」（不是 thesis） |

**Phase 2B：Builder 模式**（hackathon、open source、學習等）
- 協作式，找「最酷版本」，問「什麼能讓人說 'whoa'？」

**Phase 3：前提挑戰**（Premise Challenge）
- 提出 3-5 個產品背後的隱含假設，要求用戶確認/否認
- 被確認的假設成為設計文檔的基石

**Phase 4：實現方案**
- 給出 2-3 個具體方案，每個有努力估算（人工時間 vs CC 時間）

**Phase 5：設計文檔輸出**
- 保存到 `~/.gstack/projects/$SLUG/{branch}-design-{timestamp}.md`
- 這個文檔供下游所有 review 技能讀取

---

### `/plan-ceo-review` — CEO 視角計劃審查

**核心任務**：找到「這個請求裡藏著的那個 10-star 產品」。

**4 種模式**（第一步就選模式）：
- **SCOPE EXPANSION**：夢得更大，推薦每個擴展機會
- **SELECTIVE EXPANSION**：守住當前範圍，但逐個展示可以加的東西
- **HOLD SCOPE**：最嚴格審查當前計劃，不增不減
- **SCOPE REDUCTION**：找最小可行版本，切掉其他一切

**Pre-Review System Audit**（正式審查前）：
```
git log --oneline -30          # 近期歷史
git diff <base> --stat         # 已改動什麼
grep -r "TODO|FIXME|HACK" ... # TODO 熱點
最近 30 天觸動最多的文件
讀 CLAUDE.md, TODOS.md, 架構文檔
```

**9 大 Prime Directives**（審查準則）：
1. 零靜默故障：每個失敗都必須可見
2. 每個錯誤都有名字：不接受 "handle errors"，要說具體是什麼錯誤
3. 數據流有 shadow paths：null 輸入、空輸入、上游錯誤
4. 交互有邊緣情況：雙擊、中途離開、慢連接、過期狀態
5. 可觀測性是範圍，不是事後補充
6. 圖表是強制的：每個非平凡流程都要 ASCII 圖
7. 所有延期的必須寫下來：模糊意願是謊言
8. 為 6 個月後優化：今天解決的問題，不能製造下季度的噩夢
9. 有權說「推翻重來」

**18 個 CEO 認知模式**（內化，不是清單）：
- Bezos: 可逆/不可逆決策、速度校準、代理懷疑、遺憾最小化
- Munger: 反轉反射（「什麼會讓我們失敗？」）
- Jobs: 專注即減法（從 350 個產品到 10 個）
- Horowitz: 人-產品-利潤順序、戰時/和平時的不同管理
- Grove: 偏執掃描（「只有偏執狂才能生存」）
- Altman: 意志力作為策略、槓桿迷戀
- Rams: 減法默認（「盡可能少的設計」）

---

### `/plan-eng-review` — 工程 Manager 計劃審查

**核心任務**：讓計劃可建造——架構、測試、邊界情況、圖表。

**Prerequisite Offer 機制**：
如果沒有找到設計文檔（沒跑過 `/office-hours`），會問用戶：
> 「要先跑 /office-hours 給審查更好的輸入嗎？（大約 10 分鐘）」

如果用戶選 A，就內聯加載並執行 office-hours 的完整工作流，然後繼續 eng review。

**Step 0 Scope Challenge**（每個審查的第一步）：
1. 現有代碼有沒有已部分解決這個問題的？
2. 實現目標的最小改動集是什麼？
3. 複雜度檢查：>8 個文件或 >2 個新 class/service = 代碼異味，建議減法
4. 搜索檢查：框架有內建嗎？這是現在的最佳實踐嗎？有已知陷阱嗎？

**4 個審查段落**（必須全部評估，不能跳過）：

**1. Architecture Review（架構審查）**
- 系統設計和組件邊界
- 依賴圖和耦合問題
- 數據流和瓶頸
- 安全架構
- 分佈式制品（binary/package/container）的構建和發布管道
- 每個新代碼路徑的一個「真實生產故障場景」

**2. Code Quality Review（代碼質量審查）**
- DRY 違反（要積極標記）
- 錯誤處理模式和缺失邊緣情況
- 過度工程 or 工程不足
- ASCII 圖的維護（改了代碼，旁邊的圖過期了嗎？）

**3. Test Review（測試審查）—— 最詳細的部分**

目標：100% 覆蓋率。

5 個步驟：
1. **Trace every codepath**：從每個入口點追蹤數據流，畫出所有 branch
2. **Map user flows**：用戶交互、雙擊、中途離開、慢連接、並發
3. **Check each branch**：搜索是否有測試覆蓋每個 branch
4. **Output ASCII coverage diagram**：代碼路徑 + 用戶流，標 ★★★/★★/★ 評分
5. **E2E Decision Matrix**：判斷每個 branch 要 unit test 還是 E2E

IRON RULE（鐵律，不討論）：發現 regression 就必須加 regression test，不問用戶。

**Plan-to-QA Flow**：eng review 的測試分析結果寫到 `~/.gstack/projects/`，`/qa` 會自動讀取。

**4. Performance Review**
- 加載時間影響
- 查詢效率（N+1、缺少索引）
- 資源限制

**15 個工程 Manager 認知模式**：
- Larson (An Elegant Puzzle): 4 種團隊狀態（落後、踩水、還債、創新）
- McKinley: 默認選無聊技術（創新幣有限）
- Fowler: 漸進式優於革命性
- Google SRE: 錯誤預算而非正常運行時間目標
- Brooks (No Silver Bullet): 本質複雜度 vs 偶然複雜度
- Beck: 先讓改動容易，再做容易的改動

**信心校準系統**：
每個發現都有信心評分 1-10：
- 9-10：驗證過，看到了具體代碼的 bug
- 7-8：高信心模式匹配
- 5-6：中等，加警告
- 3-4：低信心，放到附錄
- 1-2：只有 P0 嚴重度才報告

---

### `/autoplan` — 自動審查流水線

**核心任務**：一個命令，從粗糙計劃到完整審查計劃。

**執行流程**：
1. 從磁碟讀取 CEO + Design + Eng + DX review SKILL.md
2. 按順序完整執行：CEO → Design → Eng → DX
3. 中間所有 AskUserQuestion 用 6 個決策原則自動決定
4. 最後呈現「品味決策」讓用戶確認

**6 個決策原則**（自動決策的規則）：
1. 選完整性：涵蓋更多邊緣情況的方案
2. Boil lakes：修爆炸半徑內的一切（<5 個文件，<1 天 CC 工作量）
3. 實用主義：兩個選項解決同樣問題，選更乾淨的
4. DRY：已有功能的，拒絕重複實現
5. 顯式優於聰明：10 行明顯的 > 200 行的抽象
6. 偏向行動：合併 > 審查循環 > 過時的討論

**決策分類**（三類）：

| 類型 | 定義 | 處理方式 |
|------|------|---------|
| Mechanical（機械性）| 只有一個明顯正確答案 | 靜默自動決定 |
| Taste（品味性）| 合理的人可能意見不同 | 自動決定但在最終關口呈現 |
| User Challenge | 兩個模型都同意應該改變用戶的方向 | 絕對不自動決定，必須問用戶 |

**User Challenge 特別處理**：
當 Claude 和 Codex 都認為用戶的既定方向應該改變，必須提供：
- 用戶說的是什麼（原方向）
- 兩個模型建議什麼（具體改變）
- 為什麼
- 我們可能缺少什麼上下文（明確承認盲點）
- 如果我們錯了，代價是什麼

用戶的原方向是默認值。模型要論證改變，不是反過來。

---

## 設計層：為什麼這樣設計？

### 設計決策 1：Anti-Sycophancy Rules（反諂媚規則）

`/office-hours` 有明確的「禁止用語」列表：
- ❌ "That's an interesting approach" — 換成：直接表態
- ❌ "There are many ways to think about this" — 換成：選一個，說清楚什麼證據可以改變這個立場
- ❌ "You might want to consider..." — 換成："This is wrong because..." 或 "This works because..."
- ❌ "That could work" — 換成：說清楚「基於現有證據，這是否真的能行」

**為什麼**：AI 的默認模式是「找共識」，這在諮詢場景是災難性的。YC 辦公時間的價值恰恰在於「讓你不舒服的問題」。如果 AI 不願意直說「你的需求驗證不夠，這不是真的 demand」，那整個技能就沒有意義了。

**反例**：如果沒有這個規則，AI 會說「非常有趣的想法！有一些事情值得考慮...」，然後創始人覺得得到了驗證，繼續做了 6 個月的錯誤產品。

**對 gstack-plus 的意義**：在任何「分析/評估」類任務的設計裡，要明確規定 AI 不能做的事，而不只是說 AI 要做什麼。

---

### 設計決策 2：Prerequisite Skill Offer（前置技能邀請）

`/plan-eng-review` 和 `/plan-ceo-review` 在開始前都會檢查：有沒有設計文檔？如果沒有，提供跑 `/office-hours` 的選項。

**為什麼**：好的工程審查需要清晰的問題陳述。如果沒有 `/office-hours` 的設計文檔，審查的起點是「一個模糊的需求」，而不是「一個已驗證的產品假設」。結果是：審查了很多對的東西，但可能在審查錯誤的問題。

**反例**：如果不做這個檢查，工程師可能完美實現了一個沒人真正需要的功能。

**設計細節**：這個「邀請」不是強制的，不阻止用戶繼續。但它使技能的依賴關係顯性化，而不是用戶需要記住「應該先跑 office-hours」。

**對 gstack-plus 的意義**：在 Handoff 模板設計裡，傳遞上下文時應該包含「這個任務是否有前置條件？前置條件是否完成？」

---

### 設計決策 3：Iron Law（鐵律）

`/plan-eng-review` 的 regression test 規則：「發現 regression 就必須加測試，不問用戶，不跳過，不協商。」

**為什麼**：大多數 AskUserQuestion 都是在平衡用戶的選擇和最佳實踐。但有一類東西是不能協商的：已經壞掉的東西再次壞的概率，只有測試可以防止。如果讓用戶「選擇不寫 regression test」，用戶幾乎每次都會選「跳過」（因為感覺沒必要）。

**反例**：如果這是可選的，開發者會說「時間緊，以後補」，然後永遠不補。三個月後同樣的 bug 又來了。

**對 gstack-plus 的意義**：在任務分類裡，有些維度的決策不應該被路由到 Exec 模型，因為 Exec 模型可能「走捷徑」。什麼不可以走捷徑，需要明確定義。

---

### 設計決策 4：Decision Classification（決策分類）

`/autoplan` 把中間決策分成三類，用完全不同的處理方式。

**為什麼**：不是所有決策都一樣。
- **Mechanical**（只有一個對）：自動決定，不要浪費用戶的注意力
- **Taste**（合理分歧）：可以有默認選項，但用戶應該知道
- **User Challenge**（模型認為用戶的方向有問題）：這是最危險的，不能自動決定，因為用戶可能有模型不知道的上下文

最重要的洞察：**User Challenge 的默認是用戶的原方向，不是模型的建議**。模型要論證為什麼改，而不是用戶要論證為什麼不改。這是 User Sovereignty 原則在 autoplan 場景的具體實現。

**反例**：如果模型可以「自動覆蓋用戶方向」，那會發生什麼？用戶說要 A，autoplan 改成了 B（因為兩個模型都覺得 B 更好），用戶開始按 B 的計劃執行，3 週後發現 B 和他的業務需求不符。損失是巨大的。

**對 gstack-plus 的意義**：在模型路由時，「Exec 模型建議改變任務描述」這個情況需要被處理。Exec 不能自行修改任務定義，必須升級到 Tier-A 確認。

---

### 設計決策 5：Confidence Calibration（信心校準）

`/plan-eng-review` 的每個發現都有 1-10 信心評分。低信心的發現被過濾到附錄，不出現在主報告裡。

**為什麼**：「也許可能有問題」的海量警告和「這裡有 SQL injection」的高信心發現，對用戶的認知負擔完全不同。Signal-to-noise ratio 決定了技能是否值得使用。如果每次 review 都輸出 50 條發現，用戶會直接忽略。

**額外設計**：如果用戶確認了一個低信心的發現是真實 bug，這個「校準事件」應該被記錄，以便未來的 review 能以更高的信心識別同類問題。這是 learnings 系統的一個應用。

**對 gstack-plus 的意義**：在任務驗證（verification）設計裡，Tier-Mid 的驗證輸出也需要有置信度，而不是 binary pass/fail。

---

## 哲學層：反映了什麼信念？

### 信念 1：問題空間 > 解決方案空間

`/office-hours` 的 HARD GATE 不讓 AI 寫任何代碼，這是刻意設計的。

在 AI 技術讓代碼生成「太容易」的今天，最大的風險已經不是「寫代碼太慢」，而是「花 2 個月寫了一個沒人需要的東西」。gstack 的規劃類技能把問題空間的澄清放在最高優先級，用結構化流程強制放慢在代碼之前的思考。

### 信念 2：CEO 和 Eng Manager 有不同的認知模式

gstack 不只是列了一堆「審查要點」。它根據不同角色內化了不同的認知框架：CEO 模式有 Bezos/Munger/Jobs 的思維；Eng Manager 模式有 Larson/Fowler/Brooks 的思維。

這個設計說明 gstack 的作者（Garry Tan）相信：優秀的決策來自正確的認知框架，而不只是正確的清單。LLM 可以被「框架化」為特定角色，這樣比 prompt 更有效。

### 信念 3：好的流程是遞進的（Progressive）

`office-hours` → `plan-ceo-review` → `plan-eng-review` 的設計讓每個技能的輸出作為下一個的輸入。這不只是「可以這樣用」，而是被技能自身強化：每個 review 技能會在開始前檢查是否有上游的設計文檔。

這個遞進設計的最終效果是：你不可能「跳過問題定義直接做技術架構審查」而不被系統提醒。

---

## 對 gstack-plus 的啟發

### 可以借鑒

1. **Anti-sycophancy rules 設計模式**：
   在 gstack-plus 的任何「分析類」prompt 設計裡，要明確說「AI 不能說的話」，而不只是說「AI 要說什麼」。這是防止大模型默認諂媚行為的關鍵。

2. **Prerequisite 顯性化機制**：
   Handoff 模板裡應該包含「前置任務狀態」字段。Exec 模型開始工作前，應該能驗證它需要的上下文是否準備好了。如果沒有，升級詢問而不是靜默繼續。

3. **Iron Law（不可協商的最低標準）**：
   在 gstack-plus 的任務規格裡，某些維度是「必須」的（比如：驗證步驟），某些是「可選」的。必須和可選的邊界要明確，Exec 模型不能自行降低必要標準。

4. **Decision Classification 三分法**：
   機械性決策（Exec 自動做）、品味決策（做但記錄）、User Challenge（必須問用戶）這三類，是 gstack-plus 模型路由時的重要參考。Exec 模型可以做 Mechanical，可以做 Taste（但標記），不能做 User Challenge。

5. **Confidence Calibration**：
   驗證輸出應該帶置信度而不是 binary。高置信度的發現直接呈現，低置信度的放到附錄，幫助 Tier-A 快速 triage。

### 可以改進

1. **gstack 的規劃類技能是靜態的**：
   `/plan-eng-review` 的 15 個認知模式是固定的，不會隨項目類型調整。對一個 CLI 工具和一個 web app 用同樣的框架。gstack-plus 在任務分類時應該包含「項目類型」維度，影響路由到不同的認知框架。

2. **前置條件檢查是手動觸發的**：
   gstack 的 Prerequisite Skill Offer 需要用戶顯式調用技能才能觸發。gstack-plus 可以在任務接收時自動掃描前置條件，不需要用戶知道執行順序。

3. **沒有成本意識**：
   `/autoplan` 的 6 個決策原則都在優化質量，沒有一個考慮「這個決定的 token 成本」。gstack-plus 需要在決策原則裡加入成本維度。

### 不適用的部分

1. **YC 強迫問題**：是為 "startup founder" 設計的，gstack-plus 的用例是技術任務，不需要這 6 個問題。但 "Anti-sycophancy rules" 可以用在任何分析類任務。

2. **CEO 的 18 個認知模式**：是高層產品/商業決策框架，gstack-plus 是技術執行框架，這些模式在技術路由決策中不直接適用。

---

## 深度洞察：`/autoplan` 的 User Challenge 機制是 gstack-plus 的核心模板

當 gstack-plus 的 Exec 模型完成任務後返回「這個任務描述有問題，我認為應該這樣重新定義...」，這就是 User Challenge。

處理這個情況的正確方式是：

1. **Exec 不能自行修改任務定義**（對應 gstack: User Challenge 不能自動決定）
2. **必須帶著「我可能缺少什麼上下文」的承認升級**（對應: 明確說盲點）
3. **Tier-A 的回覆以用戶原始意圖為默認**（對應: 用戶原方向是默認值）
4. **如果 Tier-A 和 Exec 都認為任務定義有問題，才能向用戶確認**（對應: 兩個模型都同意才是 User Challenge）

這個機制防止了「Exec 模型擅自改動任務定義，導致最終完成了錯誤的任務」的風險，是 gstack-plus Failure Recovery 設計的重要參考。

---

*筆記作者：Claude Sonnet 4.6 | 學習來源：`~/.claude/skills/gstack/office-hours/SKILL.md`, `plan-ceo-review/SKILL.md`, `plan-eng-review/SKILL.md`, `autoplan/SKILL.md`*
