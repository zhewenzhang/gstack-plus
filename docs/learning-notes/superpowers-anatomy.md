# Superpowers 解剖學：設計哲學綜合分析

> Day 11 | 綜合分析 superpowers-planning、superpowers-quality、superpowers-parallel

---

## 一、回答核心問題

### Q1：superpowers 的「強制 invoke」精神來自哪裡？（它在解決什麼問題？）

**它解決的問題**：**AI 傾向於用自己的判斷替換紀律，因為它「覺得」當前情況不需要紀律。**

從 using-superpowers 的紅旗表可以看到模式：
- "這只是個簡單問題" → 跳過 brainstorming
- "我可以先看看代碼" → 跳過規劃
- "這個不需要正式技能" → 跳過 TDD
- "我先做這一件小事" → 跳過驗證

每個紅旗都是 AI 在**理性化跳過紀律的行為**。AI 不是惡意——它真的相信「這次不需要」。但「這次」累積起來，就形成了系統性的紀律崩潰。

**「強制 invoke」的精神來自一個痛苦的觀察**：AI 的「判斷何時需要紀律」的能力遠差於「執行紀律」的能力。當 AI 被允許自行決定「這次需要 brainstorming 嗎？」時，它幾乎總是說「不需要」——因為跳過紀律感覺上節省了時間。

但實際代價是：跳過 brainstorming → 實現了錯誤的東西 → 2 小時返工。跳過 TDD → 沒有測試保護 → 回歸 bug → 1 小時調試。跳過驗證 → 聲稱完成但沒跑過 → 推送了壞代碼 → 生產事故。

**1% 規則的真正含義**：不是「1% 機率技能有用」，而是「1% 機率你正在理性化跳過紀律」。因為 AI 對自己說「這個不需要」的頻率遠高於真正不需要的頻率。

**superpowers 在解決的是「紀律執行偏差」問題**——不是「不知道紀律是什麼」（AI 知道），而是「覺得這次可以例外」。

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

---

### Q2：為什麼用 markdown skill 而不是代碼或 prompt template？

從所有 superpowers 技能的設計中可以提取出答案：

**1. Markdown 是「紀律規則」的自然表達**

superpowers 的技能不是「工具」——是「行為約束」。它們說的不是「做 X 能得到 Y」，而是「在做 Z 之前必須先做 X」。這種「必須先」的約束關係用代碼表達會變成「檢查 → 如果沒有 → 報錯」的繁瑣邏輯；用 prompt template 表達會變成「請確保你做了 X」的軟性建議。

Markdown 在兩者之間：它不是執行檢查（太笨重），也不是軟性建議（太容易被忽略）。它是「清晰的、可讀的、LLM 能理解的紀律描述」。

**2. Markdown 支持「精神重於字面」的原則**

superpowers 多次強調「紀律的精神比字面遵守更重要」。Markdown 的可讀性讓用戶理解「這個技能試圖防止什麼失敗」，而不只是「這個技能要求什麼步驟」。理解了「為什麼」，用戶可以判斷「在特殊情況下，字面調整是否仍然符合精神」。

**3. Markdown 的「技能可以演化」特性**

using-superpowers 說：「我可能今天學到了更好的方式……技能會隨時間變得更強。這就是為什麼你應該總是 invoke 技能——即使你認為你知道它們怎麼做。」

如果是代碼，演化意味著改代碼邏輯（需要編程能力）。如果是 prompt template，演化意味著改 prompt（但 prompt 的結構化表達力有限）。Markdown 的演化是改文字——任何用戶都能做，而且 diff 清晰可見。

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

---

### Q3：superpowers 的 skill 比 gstack 短很多——這是設計選擇還是成熟度差異？

**這是設計選擇，不是成熟度差異。**

**證據**：

| 維度 | gstack | superpowers |
|------|--------|-------------|
| 最長技能 | `/autoplan`（preamble tier 4，2000+ 行） | `brainstorming`（~200 行） |
| 最典型技能 | `/review`（preamble tier 4，含 Review Army 定義） | `verification-before-completion`（~100 行） |
| 共享基礎設施 | 長 preamble（bash 代碼，session tracking） | 無 preamble，從第一行開始 |
| 結構 | 步驟 + 判斷 + ASCII 圖 + 模板 + 報告格式 | 核心原則 + 規則 + 紅旗表 |

**為什麼 superpowers 更短**：

1. **紀律 vs 流程**：superpowers 定義紀律規則（「沒有驗證不能說完成」），gstack 定義工作流程（「Step 1: 檢測平台 → Step 2: 確認 branch → Step 3: 合併...」）。紀律是簡短的（「不可做 X」一句話說完），流程是冗長的（「先做 A 再做 B 如果 C 則 D...」）。

2. **不依賴角色**：gstack 的冗長部分來自角色定義（「你是偏執的 Staff Engineer，你有這些認知模式，你按照這個流程...」）。superpowers 不定義角色——它定義規則。規則比角色簡潔。

3. **不嵌入平台代碼**：gstack 的 preamble 包含大量 bash 代碼（session tracking、learnings 搜索、telemetry），這些是 gstack 的「運行時基礎設施」。superpowers 沒有這個層——它的技能純粹是行為描述。

4. **引用而不是嵌入**：superpowers 經常引用輔助文件（`root-cause-tracing.md`、`visual-companion.md`），而不是把內容嵌入技能文件。gstack 傾向於把所有內容嵌入 SKILL.md（包括所有 specialist 的定義）。

**結論**：superpowers 的短是因為它選擇了「紀律規則」而不是「工作流程」的表達方式。這不是成熟度低——這是設計取捨。但取捨的代價是：紀律規則需要 AI 的自律來執行（沒有自動化流程保證），而工作流程通過步驟順序自動執行。

---

### Q4：superpowers 假設了什麼樣的 AI 失敗模式？

從所有技能中提取出 superpowers 假設的 AI 失敗模式：

**失敗模式 1：聲稱完成但沒有驗證**
- `verification-before-completion` 的 24 次失敗記憶
- AI 改了代碼就覺得「完成了」，沒有實際運行看結果
- **根因**：LLM 的訓練方式讓它傾向於「基於模式匹配預測下一步」而不是「執行並觀察結果」

**失敗模式 2：修復但沒有找到根因**
- `systematic-debugging` 的紅旗表
- AI 試圖「先試試這個修復」而不是先理解為什麼壞了
- **根因**：AI 的「快速解決」傾向——它覺得「這個看起來像問題，修了再說」

**失敗模式 3：先寫代碼再補測試**
- `test-driven-development` 的 5 個常見藉口
- AI 覺得「我已經想清楚了，直接寫代碼更快」
- **根因**：AI 的「產能優化」傾向——它想最大化代碼產出，最小化「不產出代碼」的時間（寫測試）

**失敗模式 4：跳過紀律因為「這次不需要」**
- `using-superpowers` 的紅旗表
- AI 用自己的判斷替換紀律
- **根因**：AI 的「自我信任」傾向——它相信自己的判斷，但這個判斷有系統性偏差（偏向跳過紀律）

**失敗模式 5：理性化（Rationalization）**
- 所有技能都有的「理性化預防表」
- AI 不只是犯錯——它犯錯後會「解釋為什麼這是合理的」
- **根因**：LLM 的「對齊訓練」讓它傾向於給出「聽起來合理」的解釋，即使解釋是錯的

**核心洞察**：superpowers 假設的 AI 失敗模式不是「能力不足」（AI 有能力做對），而是「紀律不足」（AI 不選擇做對）。它的問題不是「AI 能不能寫測試」，而是「AI 選不選擇先寫測試」。

---

### Q5：superpowers 和 gstack 的角色分工：哪個更適合做「紀律框架」，哪個更適合做「工作流框架」？

**superpowers = 紀律框架**

superpowers 的核心是紀律規則：
- 1% 規則（即使 1% 可能也必須 invoke）
- NO COMPLETION CLAIMS（沒有驗證不能說完成）
- NO FIXES WITHOUT ROOT CAUSE（沒有根因不能修復）
- NO PRODUCTION CODE WITHOUT FAILING TEST（沒有失敗測試不能寫代碼）

這些都是「不可做」的規則，不是「應該做」的流程。它們不告訴你「先做 Step 1 再做 Step 2」——它們說「在做 X 之前必須做 Y，沒有例外」。

superpowers 適合：確保 AI 的行為質量，防止 AI 的紀律崩潰。

**gstack = 工作流框架**

gstack 的核心是工作流程：
- 26+ 技能，每個有固定的步驟順序
- Review Army 的並行 specialist dispatch
- Coverage Audit 的 subagent 執行
- Ship 的 19 步質量管道

這些是「先做 A 再做 B 如果 C 則 D」的流程。它們保證完整性——確保每個必要的步驟都被執行了。

gstack 適合：確保工作流的完整性，防止遺漏必要的步驟。

**gstack-plus 的定位**：gstack-plus 應該從兩者各取所長：
- 從 superpowers 取「紀律規則」（Exec 模型完成後必須獨立驗證）
- 從 gstack 取「工作流程」（規劃 → 審查 → 執行的步驟順序）

---

## 二、5 句話挑戰：superpowers 的設計哲學

> **superpowers 把 AI 輔助開發從「讓 AI 自由發揮」重新定義為「讓 AI 在強制紀律下工作」。**
>
> 它通過一套不可違背的紀律規則實現——即使只有 1% 的可能適用某個技能也必須調用、沒有運行驗證不能聲稱完成、沒有找到根因不能修復、沒有失敗測試不能寫代碼。
>
> 它假設的 AI 失敗模式不是「能力不足」而是「紀律不足」——AI 有能力做對的事，但傾向於用自己的判斷替換紀律，因為它「覺得」當前情況可以例外。
>
> 它優化的是「行為的可靠性和一致性」，而不是「工作流的完整性」——因為超能力的「超」不在於「做更多事」，而在於「把應該做的事做對」。
>
> 代價是靈活性——superpowers 幾乎沒有「根據情況調整」的空間。但這正是它的設計意圖：紀律的價值恰恰在最想跳過它的時刻體現。

---

## 三、Superpowers 的整體架構視圖

```
                    ┌─────────────────────────────────────────┐
                    │    using-superpowers（元規則）            │
                    │  1% 規則 | 技能優先級 | 紅旗表           │
                    └────────────────────┬────────────────────┘
                                         │ 強制調用所有技能
                    ┌────────────────────┴────────────────────┐
                    │     工作流技能（順序強制）                │
                    │  brainstorming → writing-plans → executing │
                    └────────────────────┬────────────────────┘
                                         │
     ┌─────────────────┬─────────────────┼─────────────────┐
     ▼                 ▼                 ▼                 ▼
┌─────────────┐ ┌─────────────┐ ┌──────────────┐ ┌──────────────┐
│ 紀律規則     │ │ 質量紀律     │ │ 並行模式      │ │ 基礎設施     │
│ verification│ │ TDD         │ │ subagent-    │ │ worktrees    │
│ before      │ │ systematic  │ │ driven       │ │ finishing    │
│ completion  │ │ debugging   │ │ parallel     │ │ branch       │
└──────┬──────┘ └──────┬──────┘ └──────┬───────┘ └──────┬───────┘
       │               │               │               │
       │          ┌────┴────┐          │               │
       │          │ 紅旗表  │          │               │
       │          │ 理性化  │          │               │
       │          │ 預防    │          │               │
       │          └─────────┘          │               │
       │                               │               │
       └───────────────┬───────────────┘               │
                       │                               │
               ┌───────┴────────┐                      │
               │ 失敗記憶學習    │                      │
               │ 24 次失敗模式   │                      │
               └────────────────┘                      │
                                                       │
                        ┌──────────────────────────────┘
                        │
               ┌────────┴────────┐
               │ 輔助技術文件     │
               │ root-cause-     │
               │ tracing.md      │
               │ visual-companion│
               │ testing-anti-   │
               │ patterns.md     │
               └─────────────────┘
```

---

## 四、從解剖學看 gstack-plus 的設計空間

基於以上分析，superpowers 給 gstack-plus 的核心啟發：

### superpowers 的「紀律規則」模式值得借鑒

superpowers 最有力的設計是「紀律規則」——不是流程，不是建議，是不可違背的規則。gstack-plus 應該在 Exec 模型的協作中定義類似的紀律：

- **NO EXEC CLAIMS WITHOUT INDEPENDENT VERIFICATION**（Exec 說完成不算，Claude 必須獨立驗證）
- **NO TASK EXECUTION WITHOUT CLEAR SPEC**（任務描述不清晰就不能分派給 Exec）
- **NO SILENT FAILURES**（Exec 失敗必須報告，不能默默跳過）
- **NO SCOPE CREEP**（Exec 的改動不能超出任務描述允許的範圍）

### superpowers 的「理性化預防」模式值得借鑒

superpowers 的紅旗表列出了 AI 試圖跳過紀律時的「理性化想法」。gstack-plus 也應該有類似的表——針對多模型協作的特定理性化：

| Claude 的想法 | 現實 |
|---------|------|
| "這個 Exec 模型上次表現很好，這次也信它" | 獨立驗證每次 |
| "任務很簡單，Exec 不會搞砸" | 簡單任務也會有邊緣情況 |
| "Exec 已經跑了測試，沒必要再跑" | 證據先於斷言 |
| "這個改動很小，不需要 Tier-A 審查" | 小改動可能有大的連鎖反應 |
| "成本太高了，這次跳過驗證吧" | 跳過驗證的代價更高 |

### superpowers 的「紀律 vs 流程」取捨需要平衡

superpowers 的純紀律模式依賴 AI 的自律——它說「必須做 X」，但沒有自動化保證你做了 X。gstack-plus 應該結合兩者：
- **紀律規則**定義「不可做什麼」（No Completion Claims Without Verification）
- **工作流程**定義「怎麼做」（Claude 跑測試 → 檢查 diff → 檢查範圍 → 接受/拒絕）

這樣既有紀律的簡潔性，又有流程的自動化保證。

---

## 我還沒完全理解的地方

- superpowers 的技能之間有沒有依賴關係圖？（哪些技能必須先 invoke 才能 invoke 其他？）
- `finishing-a-development-branch` 技能的具體內容是什麼？（subagent-driven-development 和 executing-plans 都在結束時調用它）
- superpowers 的「失敗記憶」系統是怎麼實現的？（`verification-before-completion` 提到了 24 次失敗記憶，這個是跨 session 持久化嗎？）
- superpowers 有沒有「成本追蹤」機制？（subagent-driven-development 每個任務 3 個 subagent 調用，成本不低）

---

*完成 2026-05-02*
