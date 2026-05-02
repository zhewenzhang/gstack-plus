# Mode A/B 實驗數據記錄模板

> 這個模板是給**用戶（davezhangus@gmail.com）**填寫 Mode A 和 Mode B 實驗數據用的。
> Qwen Code 無法替代用戶執行 Mode A（單一 Claude）和 Mode B（手動協作），因為這些需要在獨立的 Claude 會話中進行。

> ⚠️ **重要提示**：Mode A 和 Mode B 的實驗需要在獨立的 Claude 會話中執行，使用和 Mode C 完全相同的任務描述（來自 `experiments/task-definitions.md`）。Mode C 的記錄已在 `experiments/runs/C1/C2/C3` 中完成。請在執行 Mode A/B 後，把數據填入對應的文件。

---

## 使用方法

1. 開啟一個新的 Claude 會話
2. 使用 `experiments/task-definitions.md` 中的任務描述作為指令
3. 按照該模式的規則執行（Mode A：Claude 獨立完成；Mode B：Claude 規劃 + Qwen 執行，自由格式）
4. 執行完成後，將數據填入對應的記錄文件
5. 每種模式的 3 個任務分別記錄在 A1-A3、B1-B3

---

# Mode A 執行記錄：Task [A/B/C]

## 模式說明
- Mode A：Claude 獨立完成全部工作（規劃 + 執行 + 驗證）
- 不允許：使用 gstack-plus 模板或分類器
- Claude 既是 Architect 也是 Executor

## 執行過程摘要
[描述執行過程的關鍵步驟：
- Claude 如何規劃？
- 執行了什麼操作？
- 遇到了什麼問題？怎麼解決的？
- 有沒有需要重做的步驟？]

## 結果驗證
[成功標準逐項：通過/不通過]
- [ ] 標準 1：[通過/不通過]
- [ ] 標準 2：[通過/不通過]
- [ ] 標準 3：[通過/不通過]

## 實驗數據
| 指標 | 數值 | 備注 |
|------|------|------|
| 總步驟數（輪次）| | |
| 回流次數 | | |
| Token 消耗（估算）| | |
| 代碼質量（0-10）| | |
| 用戶介入次數 | | |
| 主觀感受（1-5，5 最順暢）| | |

---

# Mode B 執行記錄：Task [A/B/C]

## 模式說明
- Mode B：Claude 規劃 + Qwen 執行，自由格式溝通（無模板）
- 不允許：使用 plan-to-exec.md、exec-to-check.md 等模板
- Claude 寫任意格式的任務描述，Qwen 執行，Claude 口頭確認結果

## 執行過程摘要
[描述執行過程：
- Claude 的規劃是什麼？
- 給 Qwen 的指令怎麼寫的？
- Qwen 執行結果如何？
- 有沒有需要重做或修正的？
- 溝通是否順暢？有無誤解？]

## 結果驗證
[成功標準逐項：通過/不通過]
- [ ] 標準 1：[通過/不通過]
- [ ] 標準 2：[通過/不通過]
- [ ] 標準 3：[通過/不通過]

## 實驗數據
| 指標 | 數值 | 備注 |
|------|------|------|
| 總步驟數（輪次）| | |
| 回流次數 | | |
| Token 消耗（估算）| | |
| 代碼質量（0-10）| | |
| 用戶介入次數 | | |
| 主觀感受（1-5，5 最順暢）| | |

---

## 執行順序建議

```
Mode A: Task A → Task B → Task C（建立基準）
Mode B: Task A → Task B → Task C（對比）
```

每個任務應該從相同的 git commit 狀態開始（用 `git stash` 和 `git checkout` 確保）。

---

*Phase 3 完成 2026-05-02*
