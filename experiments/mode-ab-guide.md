# Mode A / Mode B 執行指南

> Mode C（gstack-plus 完整流程）已由 Qwen Code 完成（見 `runs/C1-C3`）。
> **Mode A 和 Mode B 需要你（用戶）在獨立的對話 session 中手動執行**，Qwen Code 無法代替。
> 執行後把結果填入對應的記錄模板。

---

## Mode A：單一 Claude（無模板）

**操作說明**：
1. 開一個全新的 Claude Opus 對話（不帶任何上下文）
2. 直接貼上 `experiments/task-definitions.md` 的任務描述（「給模型的指令」那段）
3. 讓 Claude 規劃 + 執行 + 驗證，**不允許使用 gstack-plus 任何模板**
4. 完成後，把執行過程填入 `runs/A1-simple-eslint.md` 的表格（步驟數、回流次數、質量評分、用戶介入次數）

**每個任務執行完後立刻記錄**（不要等到 3 個都做完才寫，記憶會衰減）：
- 從第一條指令到「驗收通過」之間的總輪次（= 步驟數）
- 中途幾次需要你介入補充說明
- 最終代碼的 ESLint / tsc 是否通過
- 主觀代碼質量評分（0–100）

---

## Mode B：Claude + Qwen 手動協作（無模板）

**操作說明**：
1. 開一個全新的 Claude Sonnet 對話，讓它用**自然語言**給 Qwen Code 寫任務描述（不用任何模板格式）
2. 把 Claude 寫的描述貼給 Qwen Code 執行
3. Qwen 回報結果，Claude 用自然語言確認（不用 exec-to-check.md）
4. 填入 `runs/B1-B3.md`

**關鍵觀察點**（對比 Mode C 最有說明力的）：
- Qwen Code 是否清楚「做到什麼程度算完成」？（缺乏 Scope Lock 和成功標準的影響）
- Claude 是否多次重複同樣的說明？（無模板導致的資訊流失）
- 出錯後重試的路徑是否清晰？（無 failure-routing 的影響）

---

## 完成後跑對比腳本

3 個任務 × 3 個模式全填完後：

```bash
cd D:\gstack-plus
node experiments/compare.mjs
```

輸出對比表並更新 `experiments/results-report.md` 的 Mode A/B 欄位。
