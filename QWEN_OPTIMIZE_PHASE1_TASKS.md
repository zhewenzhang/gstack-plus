# Qwen Code Phase 1 優化任務（2 個精準修正）

> **給 Qwen Code 的工作指令**
> 工作目錄：`D:\gstack-plus`
> Phase 1 整體品質高，只需修正以下 2 個具體缺口。

---

## 修正 1：`handoff/templates/plan-to-exec.md` — 補「上下文快照」格式

**問題**：`上下文快照` 字段目前只有一行說明「填當前相關代碼狀態、最近 3 次修改摘要、已知依賴」，但沒有格式規範。對比同目錄的 `evidence-format.md` 有超具體的 YAML 格式，這個字段讓填寫者需要猜格式。

**找到文件中的「上下文快照」段落**，把現有的說明替換為：

```markdown
## 上下文快照

```yaml
context_snapshot:
  current_state: "[1-2 句描述相關代碼的現狀，例如：src/auth/login.ts 目前用 JWT，尚未實作 refresh token]"
  recent_changes:
    - change: "[最近一次相關修改摘要，例如：上週將 session 存儲從 cookie 改為 localStorage]"
      commit: "[commit hash 或 PR 號，如有；沒有可省略]"
    - change: "[更早的相關修改，如有]"
      commit: ""
  known_dependencies:
    - "[本任務依賴的其他組件，例如：依賴 src/utils/token.ts 的 generateToken()]"
  known_risks:
    - "[填寫者已知的潛在問題，例如：timeout 值被 3 個 UI 組件讀取，修改可能有連帶影響]"
```

**填寫指引**：
- 只填已知信息。不確定的字段直接省略，**不要填「不確定」或「待確認」**。
- `recent_changes` 如果沒有相關歷史記錄，整個字段可省略。
- `known_risks` 是選填——如果你知道潛在風險，填進來能幫助 Exec 避坑。
```

---

## 修正 2：`classifier/test-tasks.md` — 修正 Task 8 路由決策

**問題**：Task 8（auth 安全審查）的評分是判斷=4、風險=4。按 `routing-rules.md` 的路由規則：

```
判斷 ≥ 4 → Tier-A  ✓ 觸發
風險 ≥ 4 → Tier-A  ✓ 觸發
```

兩個條件都明確指向 Tier-A，但 Task 8 目前路由為 Tier-Mid，理由是「有 OWASP checklist 可用，Tier-Mid 足夠」。**這違反了保守路由原則**，也與路由規則的字面條件矛盾。

Task 8 應改為 **Tier-A**，並作為「保守路由原則的典型示範案例」。

### 具體操作

**步驟 1**：把 Task 8 的路由從 Tier-Mid 改為 Tier-A。

**步驟 2**：把 Task 8 整個移動到任務 14-18（典型 Tier-A 區）後面，編號改為任務 19'（或直接插入 18 和 19 之間，其他任務編號相應調整）。

**步驟 3**：把 Task 8 的「路由推導」和「反直覺點」改寫為：

```markdown
**路由結果**：Tier-A

**路由推導**：
- 判斷強度 = 4 → 觸發 Tier-A 條件（判斷 ≥ 4）
- 風險權重 = 4 → 觸發 Tier-A 條件（風險 ≥ 4）
- 兩個獨立條件都指向 Tier-A，路由結果明確。

**保守路由原則示範**：
這個任務有一個誤導性特徵——有現成的 OWASP checklist 可以參考，讓人覺得
「按 checklist 照做就好，不需要 Tier-A 的判斷」。

這個想法是錯的。OWASP checklist 告訴你「要檢查什麼」，但不告訴你「在這個
具體代碼庫裡，第 3 條的風險等級高不高、怎麼修」。後者需要對代碼架構的理解，
這正是判斷強度=4 的原因。

保守路由原則：有 checklist 只是降低了知識門檻，不降低判斷需求。
安全任務（風險=4）的代價是不對稱的——低估給 Tier-Exec 做錯的代價，
遠大於高估給 Tier-A 多花的 token 成本。
```

**步驟 4**：Task 8 移走後，原來的「邊界案例」區（任務 19-20）保持不變，這兩個是真正的邊界案例（路由結果不明顯的任務）。

---

## 完成後自查

- [ ] `plan-to-exec.md`：找到「上下文快照」字段，已有 YAML 格式模板 + 填寫指引
- [ ] `test-tasks.md`：Task 8 路由改為 Tier-A，說明中有「保守路由原則」的完整論述
- [ ] `test-tasks.md`：Task 8 位置在典型 Tier-A 區（不在邊界案例區）
- [ ] 其他文件未被修改

---

*Claude 審查生成 2026-05-02*
