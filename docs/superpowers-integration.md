# Superpowers 整合指南

> 定義 superpowers skill 在 gstack-plus 工作流中的切入點。
>
> **核心信念**：superpowers 不是取代 gstack-plus 的流程，而是在關鍵節點注入紀律規則，防止 AI 的行為偏差。

---

## Part 1：整合地圖

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tier-A（Architect）                           │
│                                                                  │
│  接收用戶需求                                                     │
│  ├─ 強制 invoke: superpowers:brainstorming                       │
│  │   （複雜任務才需要，判斷標準：創意密度 ≥ 4 或判斷強度 ≥ 4）     │
│  ├─ 強制 invoke: superpowers:writing-plans                       │
│  │   （所有任務，確保計劃無佔位符）                                │
│  └─ 輸出 → plan-to-exec.md（用 pre-flight-checklist.md 檢查）     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ handoff
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Pre-flight 檢查                               │
│                                                                  │
│  └─ 使用: verification/pre-flight-checklist.md                   │
│     （Section A/B/C 全部通過才能派發）                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ 派發
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Tier-Exec（Executor）                          │
│                                                                  │
│  接收 plan-to-exec.md                                            │
│  ├─ 建議 invoke: superpowers:executing-plans                     │
│  │   （確保按照計劃執行，不偏離）                                  │
│  └─ 完成前強制 invoke: superpowers:verification-before-completion │
│     （沒有跑驗證命令不能聲稱完成）                                 │
│  └─ 輸出 → exec-to-check.md（含 evidence）                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │ evidence + 狀態
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Tier-Mid（Reviewer）                           │
│                                                                  │
│  接收 exec-to-check.md                                           │
│  ├─ 強制 invoke: superpowers:verification-before-completion      │
│  │   （驗證 Exec 的證據，不信任聲明）                              │
│  ├─ 如果失敗 → 使用: verification/failure-routing.md             │
│  └─ 通過 → 接受產出 / 不通過 → check-to-plan.md 回流             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ 回流（如需要）
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Tier-A 收到 Review 反饋                        │
│                                                                  │
│  接收 check-to-plan.md                                           │
│  ├─ 強制 invoke: superpowers:receiving-code-review               │
│  │  （正確理解批評，不防衛性回應）                                 │
│  └─ 決定後續行動：重試 / 重規劃 / 升級                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 2：每個切入點的詳細說明

### 切入點 1：superpowers:brainstorming

**在哪個階段**：Tier-A 規劃階段（接收用戶需求後、填寫 plan-to-exec.md 之前）

**是強制還是建議**：**條件強制**（判斷強度 ≥ 4 或創意密度 ≥ 4 的任務強制，其他建議）

**觸發條件**：
- 任務涉及架構決策（如「選擇緩存策略」）
- 任務需要從零設計新功能
- 任務影響 3 個以上模塊
- 用戶需求本身模糊（如「優化性能」）

**跳過條件**：
- 任務是機械性的（如「把所有 var 改為 const」）
- 任務有完整模板參考（如「按照模塊 A 的模式給模塊 B 加同樣的功能」）

**與 gstack-plus 模板的關係**：
brainstorming 的輸出是設計文檔和規格。Tier-A 從中提取任務描述、成功標準、Scope Lock，填入 plan-to-exec.md。如果 brainstorming 發現需求本身需要分解為多個子任務，則創建多個 plan-to-exec.md。

**如果跳過會發生什麼**：
AI 直接進入實現模式，跳過了「這個需求背後的真實意圖是什麼」「有沒有更好的方式實現這個意圖」的思考。結果：實現了正確但錯誤的東西。典型失敗：用戶說「加個按鈕」，AI 加了按鈕但沒有考慮按鈕的行為與現有組件衝突。

---

### 切入點 2：superpowers:writing-plans

**在哪個階段**：Tier-A 規劃階段（brainstorming 之後、plan-to-exec.md 填寫期間）

**是強制還是建議**：**強制**（所有任務）

**觸發條件**：無條件，所有任務在填寫 plan-to-exec.md 前必須過 writing-plans 的精神。

**跳過條件**：無。即使是簡單任務也需要確保計劃無佔位符。

**與 gstack-plus 模板的關係**：
writing-plans 的核心紀律是「No Placeholders」——計劃中不能有 TBD/TODO/「適當的錯誤處理」。這直接對應 plan-to-exec.md 的「任務描述」和「成功標準」字段：這些字段不能留空或寫模糊描述。writing-plans 的 Bite-Sized 原則（每步 2-5 分鐘）也對應 plan-to-exec.md 的任務粒度要求。

**如果跳過會發生什麼**：
plan-to-exec.md 中出現「在適當的位置添加錯誤處理」——Exec 會用自己的標準判斷「適當」，結果可能與 Tier-A 的意圖完全不符。佔位符是「計劃時不想做決定」的表現，但在 gstack-plus 中，計劃階段的未決定會變成執行階段的猜測。

---

### 切入點 3：superpowers:executing-plans

**在哪個階段**：Tier-Exec 執行階段（收到 plan-to-exec.md 後、開始寫代碼前）

**是強制還是建議**：**建議**

**觸發條件**：
- plan-to-exec.md 中有超過 3 條成功標準
- 任務涉及多個文件的修改
- 任務有明確的步驟順序要求

**跳過條件**：
- 任務是單文件的簡單修改（如「修改一個函數的返回值」）

**與 gstack-plus 模板的關係**：
executing-plans 的核心紀律是「按照計劃執行，遇到阻塞就問而不是猜」。這對應 plan-to-exec.md 的「失敗升級條件」字段：Exec 遇到不確定的情況應該返回 BLOCKED，不是自行猜測。executing-plans 的「問而不是猜」精神確保 Exec 不會在沒有上下文的情況下做架構判斷。

**如果跳過會發生什麼**：
Exec 遇到計劃中不清楚的地方，自行猜測並繼續執行。結果：實現了某個方向的功能，但不是 Tier-A 想要的方向。返工成本遠高於停下來問的代價。

---

### 切入點 4：superpowers:verification-before-completion

**在哪個階段**：Tier-Exec 完成聲明前 + Tier-Mid 審查時

**是強制還是建議**：**強制**（兩次）

**觸發條件**：
- Exec 準備填寫 exec-to-check.md 的完成聲明前
- Tier-Mid 準備接受 Exec 產出前

**跳過條件**：無。這是超能力的核心紀律，沒有例外。

**與 gstack-plus 模板的關係**：
這個 skill 直接體現為 exec-to-check.md 的 `evidence` 字段。verification-before-completion 的 Gate 函數（IDENTIFY → RUN → READ → VERIFY → 才能聲稱）就是 evidence 字段的填寫流程：
1. IDENTIFY：什麼命令能證明完成了？→ 對應 success_criteria_check
2. RUN：執行命令 → 對應 commands_run
3. READ：讀取輸出 → 對應 output 字段
4. VERIFY：輸出確認了聲稱嗎？→ 對應 verified 字段

**如果跳過會發生什麼**：
Exec 改了代碼就聲稱完成，沒有跑測試。結果：代碼有語法錯誤或邏輯錯誤，但 Exec 不知道。Tier-Mid 在審查時發現，但此時 Exec 的上下文已經丟失，修復成本增加。superpowers 的 24 次失敗記憶中，最多數的失敗類型就是「聲稱完成但未驗證」。

---

### 切入點 5：superpowers:receiving-code-review

**在哪個階段**：Tier-A 收到 check-to-plan.md 回流報告後

**是強制還是建議**：**強制**

**觸發條件**：收到任何 Tier-Mid 的回流報告（check-to-plan.md）

**跳過條件**：無

**與 gstack-plus 模板的關係**：
receiving-code-review 的精神是「正確理解批評，不防衛性回應」。在 gstack-plus 中，這對應 check-to-plan.md 的「Tier-A 回應」字段：Tier-A 應該客觀評估 Tier-Mid 的分析，不是防衛性地說「任務沒問題，是 Exec 的錯」。這個 skill 確保 Tier-A 把回流視為「任務分解的學習機會」，不是「對 Tier-A 能力的質疑」。

**如果跳過會發生什麼**：
Tier-A 收到回流後，直接讓 Exec 重試而不是分析根因。結果：同樣的錯誤重複出現，最終浪費 3-5 倍時間。receiving-code-review 強制 Tier-A 先理解「為什麼會失敗」，再決定「下一步做什麼」。

---

## Part 3：決策指南——什麼時候必須用 superpowers

| 場景 | 必用的 superpowers skill | 原因 |
|------|------------------------|------|
| 接收模糊用戶需求後 | brainstorming | 防止跳過影響範圍分析，直接進入實現模式 |
| 填寫 plan-to-exec.md 前 | writing-plans | 確保計劃無佔位符，任務描述明確 |
| Exec 開始寫代碼前 | executing-plans | 確保按計劃執行，遇到阻塞不猜測 |
| Exec 聲稱完成前 | verification-before-completion | 防止「聲稱完成但未驗證」 |
| Tier-Mid 審查 Exec 產出時 | verification-before-completion | 獨立驗證，不信任 Exec 的聲明 |
| Tier-A 收到回流報告後 | receiving-code-review | 正確理解批評，不防衛性回應 |

---

## Part 4：Superpowers 與 gstack-plus 的紀律融合

superpowers 的紀律規則如何嵌入 gstack-plus 的模板：

| superpowers 鐵律 | gstack-plus 體現位置 | 如何強制 |
|-----------------|---------------------|---------|
| NO COMPLETION CLAIMS without verification | exec-to-check.md evidence 字段 | evidence 為空 → 退回 |
| NO FIXES WITHOUT ROOT CAUSE | failure-catalog.md 分析模板 | 必須回答根因分析問題 |
| NO PRODUCTION CODE WITHOUT FAILING TEST | plan-to-exec.md 成功標準字段 | 成功標準 < 2 條 → pre-flight 不通過 |
| 1% 規則（可能適用就 invoke） | superpowers-integration.md 切入點 | 在關鍵節點強制 invoke |
| No Placeholders | plan-to-exec.md 任務描述 + forbidden-words.md | 有禁用詞 → pre-flight 不通過 |
| Ask, don't guess | plan-to-exec.md 失敗升級條件 | 遇到不確定 → BLOCKED |

---

*Phase 2 完成 2026-05-02*
