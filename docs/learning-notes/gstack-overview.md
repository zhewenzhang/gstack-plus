# gstack 全景圖學習筆記

**學習日期**: 2026-05-02
**學習方法**: 通讀所有 SKILL.md + ETHOS.md + ARCHITECTURE.md + docs/skills.md
**輸出目標**: 理解 gstack 全貌，為 gstack-plus 設計找到啟發點

---

## 字面層：它做了什麼？

gstack 是一個 **AI 工作流技能庫**，給 Claude Code 加上一組有主見的工作流程。

它有兩個核心組件：

1. **Skills（技能）**：26+ 個 Markdown 文件，每個定義一種工作模式（CEO 審查、調試、QA 測試…）
2. **Browse daemon（瀏覽器守護進程）**：持久化 Chromium 實例，~100-200ms 響應，狀態跨命令保持

每個技能 = 一個特定的「專家角色」。當你調用 `/investigate`，Claude 就成為一個「調試員」；調用 `/plan-ceo-review`，Claude 就成為一個「創始人」。

完整的生命週期是：

```
office-hours → plan-ceo-review → plan-eng-review → review → ship → land-and-deploy → canary
                     ↘ plan-design-review ↗                  ↑
                     ↘ plan-devex-review ↗                   |
                                                        qa / design-review
```

---

## 所有技能分類目錄

### 🔭 探索 & 策略類（「想什麼」）

| 技能                 | 角色      | 核心問題                    |
| ------------------ | ------- | ----------------------- |
| `/office-hours`    | YC 合夥人  | 這值得建嗎？最小切入點是什麼？         |
| `/plan-ceo-review` | CEO/創始人 | 這個請求背後的「10-star 產品」是什麼？ |
| `/autoplan`        | 審查流水線   | 自動跑完 CEO+設計+工程三次審查      |

**設計細節：**

- `/office-hours` 有兩種模式：Startup（6 個逼問問題）和 Builder（hackathon/開源）
- `/plan-ceo-review` 有四種模式：Scope Expansion / Selective / Hold / Reduction
- `/autoplan` 用 6 個決策原則自動決策，只把「品味決策」留給人

---

### 📐 規劃 & 審查類（「怎麼做」）

| 技能                     | 角色         | 核心問題                  |
| ---------------------- | ---------- | --------------------- |
| `/plan-eng-review`     | 工程 Manager | 架構對嗎？邊界清晰嗎？有圖嗎？       |
| `/plan-design-review`  | 資深設計師      | 設計有交互狀態嗎？空狀態？移動端？     |
| `/plan-devex-review`   | DevEx 工程師  | API / CLI / SDK 體驗好嗎？ |
| `/design-consultation` | 設計合夥人      | 從零建立設計系統，寫 DESIGN.md  |

**設計細節：**

- `/plan-eng-review` 是唯一的**必須**關卡（其他是可選的）
- `/plan-eng-review` 會把 Test Plan 寫到 `~/.gstack/projects/`，讓 `/qa` 後續自動撿起來
- Review Readiness Dashboard 貫穿所有審查，可視化哪些通過了

---

### 🎨 設計 & 實現類（「做出來」）

| 技能                | 角色    | 核心問題                     |
| ----------------- | ----- | ------------------------ |
| `/design-shotgun` | 設計探索員 | 生成 3 個設計方案，比較板選擇         |
| `/design-html`    | 設計工程師 | 把設計方案轉成可工作的 Pretext HTML |
| `/investigate`    | 調試員   | 鐵律：不搞清楚根因，不修改代碼          |
| `/codex`          | 第二意見  | 讓 OpenAI Codex 獨立審查，找盲點  |

**設計細節：**

- `/design-shotgun` → `/design-html` 是設計流水線，可以鏈式使用
- `/investigate` 內部會自動激活 `/freeze`（限制編輯範圍），防止「修了 A 壞了 B」
- `/codex` 有 3 種模式：review（PASS/FAIL）、challenge（對抗測試）、consult（諮詢）

---

### 🔍 審查 & 安全類（「沒問題嗎」）

| 技能        | 角色       | 核心問題                             |
| --------- | -------- | -------------------------------- |
| `/review` | 偏執的員工工程師 | CI 通過之後還能炸嗎？找 N+1、race condition |
| `/cso`    | 首席安全官    | OWASP Top 10 + STRIDE 威脅模型       |

**設計細節：**

- `/review` 是「Fix-First」風格：顯而易見的問題自動修復，模糊的才問人
- `/review` + `/codex` 聯合使用時，會做跨模型對比（重疊 = 高置信）
- `/cso` 有兩個模式：daily（高閾值，低噪音）和 comprehensive（每月深度掃描）

---

### 🧪 QA & 測試類（「真的好使嗎」）

| 技能               | 角色        | 核心問題                         |
| ---------------- | --------- | ---------------------------- |
| `/qa`            | QA Lead   | 測試 + 修 Bug，原子提交，自動生成回歸測試     |
| `/qa-only`       | QA 報告員    | 只報告，不修改                      |
| `/design-review` | 會編碼的設計師   | 80 項視覺審查 + 修復循環              |
| `/devex-review`  | DevEx 審計員 | 開發者體驗測試（time-to-hello-world） |
| `/benchmark`     | 性能工程師     | Core Web Vitals、加載時間基線和回歸檢測  |

**設計細節：**

- `/qa` 是 diff-aware 的：默認只測試你本次改動影響的頁面
- `/qa` 有 4 種模式：Diff-aware / Full / Quick / Regression
- `/design-review` 是迭代的：80 項審查 → 找到問題 → 修 → 截圖對比 → 繼續

---

### 🚀 發布 & 部署類（「上線！」）

| 技能                  | 角色    | 核心問題                      |
| ------------------- | ----- | ------------------------- |
| `/ship`             | 發版工程師 | 同步 main、跑測試、審查、創建 PR      |
| `/land-and-deploy`  | 部署工程師 | Merge + CI 等待 + 部署 + 驗證   |
| `/canary`           | SRE   | 部署後監控循環，捕捉 console errors |
| `/document-release` | 技術寫作  | 更新文檔匹配剛發布的變更              |
| `/setup-deploy`     | 部署配置  | 一次性配置平台，寫入 CLAUDE.md      |

**設計細節：**

- `/ship` 的 Review Gate：如果沒跑過 `/plan-eng-review`，會問你但不會阻止你
- `/ship` 有 Greptile 集成：自動分類 Greptile 的 PR 評論（有效/已修/誤報）
- `/ship` 如果沒有測試框架，會自動建一個（Bootstrap 模式）

---

### 🌐 瀏覽器 & 工具類（「看見頁面」）

| 技能                       | 角色     | 核心問題                    |
| ------------------------ | ------ | ----------------------- |
| `/browse`                | QA 工程師 | 持久 Chromium，~100ms/命令   |
| `/open-gstack-browser`   | 共存模式   | 顯示瀏覽器 + sidebar 代理，實時可見 |
| `/setup-browser-cookies` | 會話管理   | 從真實瀏覽器導入 cookies，測試已登錄頁 |
| `/pair-agent`            | 遠程代理   | 讓遠程 AI agent 使用你的瀏覽器    |

---

### 🧠 記憶 & 反思類（「我們學到了什麼」）

| 技能                 | 角色         | 核心問題                               |
| ------------------ | ---------- | ---------------------------------- |
| `/context-save`    | 狀態保存       | 保存 git 狀態 + 決策 + 剩餘工作，跨 session 銜接 |
| `/context-restore` | 狀態恢復       | 從 `/context-save` 中恢復，接著做          |
| `/learn`           | 記憶管理       | 查看/搜索/清理項目學習記錄（JSONL）              |
| `/retro`           | 工程 Manager | 週回顧：per-person 貢獻 + 趨勢 + 成長機會      |

---

### 🛡️ 安全防護類（「別搞砸」）

| 技能              | 組合                 | 作用          |
| --------------- | ------------------ | ----------- |
| `/careful`      | 單獨                 | 破壞性命令前警告    |
| `/freeze <dir>` | 單獨                 | 限制編輯範圍到指定目錄 |
| `/guard`        | = careful + freeze | 最大安全模式      |
| `/unfreeze`     | 配對                 | 解除 freeze   |

**實現機制**：通過 Claude Code 的 PreToolUse hooks 實現，session 範圍，無需配置文件。

---

### 🔧 基礎設施類

| 技能                | 作用                   |
| ----------------- | -------------------- |
| `/gstack-upgrade` | 自我更新                 |
| `/health`         | 代碼質量儀表板              |
| `/plan-tune`      | 調整提問靈敏度              |
| `/make-pdf`       | 生成 PDF 文檔            |
| `/codex`          | OpenAI Codex CLI 包裝器 |

---

## 設計層：為什麼這樣做？

### 設計決策 1：角色分工，不是功能分工

每個技能不是「做某件事的工具」，而是「扮演某個角色的人」。

- **為什麼**：人類和 AI 合作的最佳模式不是「AI 用工具」，而是「AI 成為某個專家」。當 Claude 被告知「你現在是一個偏執的 Staff Engineer」，它的輸出質量遠高於「請 review 這個代碼」。
- **反例**：如果不這樣做，每次都需要長篇 prompt 解釋想要什麼視角。
- **代價**：26+ 個技能文件需要維護，更新一個邏輯可能需要同步多個文件。

### 設計決策 2：Preamble = 共享基礎設施

所有技能都有相同的 preamble 代碼塊（更新檢查、session 追蹤、遙測、遙感同步…），通過模板系統 `SKILL.md.tmpl` 生成。

- **為什麼**：DRY 原則 + 一致性。每個技能都需要知道「當前 session 有幾個」（ELI16 模式），「遙測是否開啟」等。
- **反例**：手動維護會導致各技能 preamble 漂移不同步。
- **代價**：增加了構建步驟，SKILL.md 是生成的，不能直接編輯。

### 設計決策 3：Browse daemon = 持久狀態，不是每次啟動

瀏覽器不是每次命令都新建，而是一個持久守護進程，通過本地 HTTP 通信。

- **為什麼**：登錄狀態、cookies、localStorage 跨命令保持。20 個命令不需要等待 20 次瀏覽器啟動（每次 3 秒 = 60 秒 vs 持久模式 ~2 秒）。
- **反例**：per-command 模式下，QA 測試中途無法保持登錄。
- **代價**：複雜性更高，需要管理守護進程生命週期、端口衝突、版本重啟。

### 設計決策 4：Review Gate，不是強制阻塞

`/plan-eng-review` 是「必須」的，但 `/ship` 會問你，不會直接拒絕。

- **為什麼**：User Sovereignty 原則。AI 的職責是讓人知道風險，不是替人做決定。強制阻塞會讓用戶繞過，不如讓流程透明。
- **反例**：強制 gate 在用戶確信安全的情況下反而是阻礙。
- **代價**：有人可能忽略警告導致問題，但這是用戶的選擇。

### 設計決策 5：Operational Self-Improvement（運行時自我改進）

每個技能結束前，如果發現了「下次可以節省 5+ 分鐘的項目特定怪癖」，就記錄到 JSONL。

- **為什麼**：AI 記憶是 session 級的，項目級知識（「這個 repo 的測試要用 `bun test`，不是 `npm test`」）如果不外化存儲，下次還要重新發現。
- **反例**：每次 session 都從零開始，重複犯同樣的「新手錯誤」。
- **代價**：需要判斷什麼值得記錄（信噪比問題）。

---

## 哲學層：反映了什麼信念？

### 核心信念 1：Boil the Lake（燒乾那個湖）

> AI 讓「做完整的事」的邊際成本幾乎為零。當完整實現比捷徑只多幾分鐘，就做完整的。

這個信念滲透在每個技能設計裡：

- `/ship` 自動 bootstrap 測試框架（「沒有測試框架？幾分鐘建一個」）
- `/review` 標記「80% 方案」並指出「完整方案只是湖，不是海」
- ETHOS.md 有完整的人類 vs AI 時間壓縮比表格（boilerplate: 100x，架構: 5x）

**對 gstack-plus 的意義**：任務分級的核心邏輯之一——判斷一個任務是「湖」還是「海」，影響是否值得用高端模型完整做，還是用執行模型快速做。

### 核心信念 2：User Sovereignty（用戶主權）

> AI 推薦，用戶決定。兩個模型都同意，也只是強信號，不是授權。

- 所有 review gate 都是「問你」不是「阻止你」
- AskUserQuestion 有固定格式（D<N>、ELI10、Stakes、Recommendation、Pros/Cons）
- 「AI 生成建議，用戶核驗，AI 不跳過核驗步驟」

**對 gstack-plus 的意義**：在模型路由決策時，User Sovereignty 意味著「自動路由」需要有清晰的覆蓋機制，用戶能知道「這個任務被路由給了 Qwen，是因為 X 原因」。

### 核心信念 3：Search Before Building（建之前先搜）

> 三層知識體系：Layer 1（成熟做法）、Layer 2（流行新做法）、Layer 3（第一性原理）。Eureka 時刻來自：理解了 Layer 1+2，然後 Layer 3 推導出「大家都錯了」。

**對 gstack-plus 的意義**：在 gstack-plus 的競品分析中，要真正運行 AutoGen/CrewAI/LangGraph，不只是查文檔。只有運行了才能得到 Layer 3 的洞察。

---

## 依賴和協作關係圖

```
[辦公時間]          [決策關口]        [執行關口]       [驗證關口]      [發布關口]
────────────────────────────────────────────────────────────────────────────

/office-hours ──→ /plan-ceo-review ──→                             
                  /plan-eng-review ──→ implement ──→ /review ──→ /ship ──→ /land-and-deploy
                  /plan-design-review ─────────────→ /design-review ↗     
                  /plan-devex-review ─────────────→ /devex-review ↗        ↓
                                                    /qa ↗                /canary

[自動化]  /autoplan = /plan-ceo-review + /plan-design-review + /plan-eng-review

[瀏覽器基礎設施] /browse ← 使用者：/qa, /design-review, /benchmark, /canary, /land-and-deploy

[調試流]  bug report → /investigate (激活 /freeze) → fix → /review → /ship

[設計流]  /design-consultation → /design-shotgun → /design-html

[記憶流]  每個技能結束 → 寫 learnings.jsonl ← /learn 管理
          session 中斷 → /context-save ← /context-restore

[第二意見] /review + /codex = 跨模型交叉對比（overlap = 高置信）

[安全層]  /careful 或 /freeze 或 /guard = 底層 PreToolUse hooks（session 範圍）
```

---

## 對 gstack-plus 的啟發

### 可以借鑒

1. **角色人格設計**：gstack-plus 的三層模型（Tier-A/Mid/Exec）也應該有明確「角色」定義，不只是「用什麼模型」——而是「這個角色在做什麼決策」。

2. **Preamble 共享基礎設施**：任務分類、路由決策、日誌記錄的代碼應該是所有 skill 共享的，通過模板注入。

3. **Review Readiness Dashboard**：可以做一個「Tier Dispatch Dashboard」——「這個任務被路由到 Tier-X，原因是 Y，用時 Z，結果 W」。

4. **Operational Self-Improvement**：執行模型完成任務後，如果發現了「這類任務的常見陷阱」，應該記錄下來供下次使用。

5. **Fix-First 哲學**：在任務分配時，顯而易見的簡單任務（Exec 層可以做的）應該自動路由，不要每次都問人。

6. **四種模式（Hold/Expand/Reduce/Selective）**：在任務分類器裡，可以引入類似的「複雜度策略」參數——用戶可以選擇「省錢模式（更多 Exec）」或「質量模式（更多 Tier-A）」。

### 可以改進

1. **gstack 的任務路由是手動的**：用戶必須知道 `/investigate` 適合 bug，`/review` 適合代碼審查。gstack-plus 應該自動分類任務類型，不需要用戶選擇。

2. **gstack 沒有失敗回流**：如果 Exec 模型搞砸了，沒有自動升級到 Tier-A 的機制。gstack-plus 的核心差異化就在這裡。

3. **gstack 的模型是固定的**：整個系統只用 Claude，沒有模型多樣性設計。gstack-plus 的核心是把「誰做這個技能」從技能本身解耦出來。

4. **gstack 沒有成本追蹤**：雖然有 telemetry，但沒有「這個 session 花了多少 token / 錢」的視圖。gstack-plus 的目標（降低 60% 成本）需要成本可視化。

### 不適用的部分

1. **Browse daemon**：gstack-plus 不是瀏覽器自動化框架，這部分不需要借鑒。

2. **Pretext HTML 生成**：這是 gstack 特有的設計工具，和 gstack-plus 的定位不同。

3. **Greptile 集成**：這是特定工具集成，不是通用框架設計。

---

## 我還沒理解的地方

1. **OpenClaw 是什麼**？文件裡多次提到 OpenClaw 作為 orchestrator，但沒有詳細解釋。是 gstack 的多 agent 協作框架嗎？

2. **GBrain 是什麼**？有 GBrain Sync 機制，似乎是跨機器記憶同步，基於 GitHub repo。它和 `/learn` 的關係是什麼？

3. **Browser skills（domain skills）**的設計**：`$B domain-skill save|list` 讓代理給特定網站存儲筆記，有「學習升級」機制（用夠多次才激活）。這個 trust-building 機制背後的設計哲學是什麼？

4. **preamble-tier 1/2/3/4**：各技能有不同的 preamble tier 值，但沒有找到這個值的具體影響。

---

## 關鍵洞察（Day 1 最重要的發現）

**gstack 的本質是：把 AI 工作流「角色化」**

不是 "prompt engineering"，不是 "tool use"——而是「賦予 AI 清晰的角色認同」。

當一個技能說「你是偏執的 Staff Engineer」，AI 的輸出質量和一致性遠超泛化指令。這是 gstack 能工作的核心。

**對 gstack-plus 的最大啟發**：

三層模型路由的最終目的，不只是「用便宜模型省錢」，而是「讓每層模型都在它最擅長的角色上工作」。Tier-Exec 做的不是「便宜版的 Tier-A」，而是「在它最擅長的執行角色上的完整版自己」。這才是護城河。

---

*筆記作者：Claude Sonnet 4.6 | 學習來源：`~/.claude/skills/gstack/`*
