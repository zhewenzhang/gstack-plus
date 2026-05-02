# 📚 gstack-plus 深度學習計劃

> 這是 Phase 0 的詳細展開。**不要跳過這個階段，深度理解比快速動手更重要。**

---

## 🎯 學習目標

在動手改造 gstack 之前，我必須能回答這些問題：

1. gstack 為什麼這樣設計？（不是「怎麼做」，是「為什麼」）
2. superpowers 為什麼用「強制 invoke」？
3. Brain Sync 解決了什麼根本問題？
4. 「Boil the Lake」原則的真實含義？
5. 為什麼 skill 是 markdown 而不是代碼？
6. gstack 和傳統的 prompt engineering 區別在哪？
7. 哪些設計決策是「對的」？哪些可以改進？

如果這些問題我答不出來，我就還沒準備好做 gstack-plus。

---

## 📖 學習方法論

### 三層閱讀法

每個 skill 都按這三層讀：

**Layer 1: 字面層** — 它做了什麼？
- 讀 SKILL.md，理解輸入輸出
- 看 examples
- 跑一遍實際使用

**Layer 2: 設計層** — 為什麼這樣做？
- 為什麼是這個結構？
- 為什麼是這個順序？
- 為什麼這個地方要 STOP？
- 為什麼用 AskUserQuestion 而不是猜？

**Layer 3: 哲學層** — 反映了什麼信念？
- 設計者相信什麼？
- 他們害怕什麼錯誤？
- 他們優化什麼指標？

只有讀到第三層，才能真正改進它。

---

## 📅 兩週學習日程表

### Week 1: gstack 深度

#### Day 1-2: gstack 全景圖
- [ ] 通讀 gstack 主 SKILL.md（兩遍以上）
- [ ] 列出所有子 skill 並分類：
  - 探索類（office-hours）
  - 規劃類（plan-eng-review、plan-design-review、autoplan）
  - 審查類（review、qa）
  - 執行類（ship、land-and-deploy）
  - 工具類（context-save、context-restore）
- [ ] 畫一張 skill 之間的依賴/協作關係圖

**輸出**：`docs/learning-notes/gstack-overview.md`

---

#### Day 3-4: 規劃類 skill 深度
- [ ] 細讀 `office-hours/SKILL.md`：怎麼引導用戶探索？
- [ ] 細讀 `plan-eng-review/SKILL.md`：質量門檻怎麼設？
- [ ] 細讀 `autoplan/SKILL.md`：怎麼編排多個 review？
- [ ] **重點觀察**：
  - 哪裡使用 AskUserQuestion？為什麼是那些地方？
  - 哪裡有 STOP point？
  - 怎麼確保信息完整再進入下一階段？

**輸出**：`docs/learning-notes/gstack-planning-skills.md`

---

#### Day 5: 審查類 skill 深度
- [ ] 細讀 `review/SKILL.md`：靜態分析 vs 邏輯審查的邊界
- [ ] 細讀 `qa/SKILL.md`：自動化測試的角色
- [ ] 細讀 `investigate/SKILL.md`：根因分析的紀律
- [ ] **重點觀察**：
  - 怎麼平衡「全面性」和「快速」？
  - 失敗時怎麼指導用戶？

**輸出**：`docs/learning-notes/gstack-review-skills.md`

---

#### Day 6: 執行類 skill 深度
- [ ] 細讀 `ship/SKILL.md`：發布前的檢查清單
- [ ] 細讀 `land-and-deploy/SKILL.md`：merge + deploy 的編排
- [ ] **重點觀察**：
  - 不可逆操作怎麼處理？
  - 失敗回滾怎麼設計？

**輸出**：`docs/learning-notes/gstack-shipping-skills.md`

---

#### Day 7: 整合與哲學
- [ ] 讀 Garry Tan 的相關博客（Boil the Lake 等）
- [ ] 寫綜合筆記：`docs/learning-notes/gstack-anatomy.md`
- [ ] **必須回答的問題**：
  - gstack 的核心設計理念是什麼？
  - 它假設了什麼樣的用戶？
  - 它優化什麼？犧牲什麼？

**第一個確認節點**：能用 5 句話講清楚 gstack 的設計理念。

---

### Week 2: superpowers 深度

#### Day 8-9: 規劃類 superpowers
- [ ] 細讀 `brainstorming/SKILL.md`
- [ ] 細讀 `writing-plans/SKILL.md`
- [ ] 細讀 `executing-plans/SKILL.md`
- [ ] **重點觀察**：
  - 為什麼是「強制 invoke」？
  - 怎麼處理用戶想跳過的情況？
  - 計劃文檔的格式為什麼這樣設計？

**輸出**：`docs/learning-notes/superpowers-planning.md`

---

#### Day 10-11: 質量類 superpowers
- [ ] 細讀 `verification-before-completion/SKILL.md`
- [ ] 細讀 `systematic-debugging/SKILL.md`
- [ ] 細讀 `test-driven-development/SKILL.md`
- [ ] **重點觀察**：
  - 為什麼這些紀律有效？
  - 怎麼防止 AI 偷懶（聲稱完成卻沒驗證）？

**輸出**：`docs/learning-notes/superpowers-quality.md`

---

#### Day 12: 並行類 superpowers
- [ ] 細讀 `subagent-driven-development/SKILL.md`
- [ ] 細讀 `dispatching-parallel-agents/SKILL.md`
- [ ] **重點觀察**：
  - 並行的邊界在哪？
  - 子任務之間怎麼避免衝突？

**輸出**：`docs/learning-notes/superpowers-parallel.md`

---

#### Day 13: 整合 superpowers
- [ ] 寫綜合筆記：`docs/learning-notes/superpowers-anatomy.md`
- [ ] **必須回答**：
  - superpowers 的「強制紀律」精神來自哪裡？
  - 為什麼用 markdown skill 而不是代碼？
  - 它和 gstack 的角色分工有什麼區別？

---

#### Day 14: 對比基線實驗
- [ ] 用單 Claude 模式重做 Louise v2 的優化
- [ ] 詳細記錄：token、時間、錯誤、回流
- [ ] 對比現有 hybrid 模式
- [ ] 產出：`experiments/baseline-vs-hybrid.md`

**第二個確認節點**：有真實數據，知道方法論在哪些場景有價值。

---

## 🧠 學習過程的思考工具

### 工具 1：費曼學習法

每讀完一個 skill，**用自己的話寫給「不懂技術的朋友」**。
如果寫不出來，說明還沒理解。

### 工具 2：批判性提問

對每個設計決策問：
- 為什麼這樣？
- 反例是什麼？
- 換一種方式會怎樣？
- 這個假設成立嗎？

### 工具 3：類比思考

把 skill 設計類比到：
- 公司管理（gstack = 組織架構，superpowers = SOP）
- 軍隊指揮（清晰命令鏈、檢查點、撤退方案）
- 醫院（術前 checklist、術中監控、術後復查）

類比能暴露設計的本質。

---

## 📝 學習筆記模板

每個 skill 用這個模板寫筆記：

```markdown
# [Skill 名稱] 學習筆記

## 字面層：它做了什麼？
（一段話描述）

## 設計層：為什麼這樣做？
- 設計決策 1：...
  - 為什麼：...
  - 反例：如果不這樣會怎樣
- 設計決策 2：...

## 哲學層：反映了什麼信念？
（兩三句話）

## 對 gstack-plus 的啟發
- 可以借鑒：...
- 可以改進：...
- 不適用的部分：...

## 我還沒理解的地方
- ?
- ?
```

---

## ⚠️ 學習階段的常見陷阱

### 陷阱 1：跳到實現
- 症狀：讀了一半就想動手寫代碼
- 解決：強制自己寫完 10+ 學習筆記再動手

### 陷阱 2：表面理解
- 症狀：能說「這個 skill 做 X」，但說不出為什麼
- 解決：用費曼學習法檢驗

### 陷阱 3：迷信權威
- 症狀：覺得 gstack 一切設計都是對的
- 解決：強制找 3 個你覺得可以改進的地方

### 陷阱 4：學完忘記
- 症狀：學的時候懂，過幾天忘
- 解決：做學習筆記，且要寫到「能教別人」的程度

---

## 🎯 學習結束的自檢清單

學習完成的標準（不是時間，是質量）：

- [ ] 能用 5 句話講清楚 gstack 的設計理念
- [ ] 能解釋 superpowers 為什麼「強制 invoke」
- [ ] 能說出 gstack 至少 3 個可以改進的地方
- [ ] 能說出 gstack-plus 的核心增量價值
- [ ] 寫了至少 8 篇學習筆記
- [ ] 跑通了基線對比實驗
- [ ] 能對 20 個歷史任務做 Tier 分類，與直覺一致

達到這些，才能進入 Phase 1。

---

## 🔄 與社區的連接

學習階段就要開始連接社區：

1. **加入 gstack 的相關頻道**（Discord、X、GitHub Discussions）
2. **觀察別人怎麼用 gstack**
3. **發現問題就提 issue**（這也是貢獻）
4. **學習筆記發到博客**（提前建立內容資產）

---

## 💡 給未來自己的提醒

1. **不要急** — 深度比速度重要
2. **不要全信** — 任何設計都有取捨
3. **不要孤軍奮戰** — 找人討論
4. **不要忘記用戶** — gstack-plus 是給人用的，不是自嗨

---

**這個學習計劃完成後，你才真正準備好改造 gstack。**
