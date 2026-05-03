# Mode A 執行記錄：Task B — 重構 scoring-guide.md 為 TypeScript

> Mode：A（單一 Claude，無模板，無 Qwen Code）
> 執行者：用戶（請在獨立 Claude 對話中手動執行後填寫）
> 任務說明：`experiments/task-definitions.md` 的任務 B

---

## 執行數據

| 指標 | 數值 | 備注 |
|------|------|------|
| 總步驟數（輪次） | _填入_ | |
| 用戶介入次數 | _填入_ | |
| 回流次數 | _填入_ | |
| 代碼質量評分（0-100） | _填入_ | |
| 成功標準通過率 | _/5_ | |
| Token 消耗估算 | _填入_ | |

## 是否通過成功標準

- [ ] `classifier/scoring-schema.ts` 存在，所有類型定義正確
- [ ] `classifier/scorer.ts` 存在，導出 `scoreTask` 函數
- [ ] `classifier/examples.ts` 存在，包含 15 個例子
- [ ] `tsc --noEmit` 執行無錯誤
- [ ] `scoreTask` 對 `test-tasks.md` 的前 3 個任務給出正確路由

## 執行後觀察

（自由填寫：過程中遇到什麼問題、與 Mode C 有何不同感受）
