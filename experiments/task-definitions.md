# 實驗任務定義

> 3 個任務的完整規格。所有模式（A/B/C）使用相同的任務描述，確保對比公平。
>
> **來源**：PROJECT_ROADMAP.md Phase 3 實驗設計。

---

## 任務 A：給 gstack-plus 項目加 ESLint 規則（簡單）

### 背景
gstack-plus 項目目前沒有代碼風格檢查工具。需要初始化 npm 項目並配置 TypeScript ESLint，確保所有代碼符合一致的風格規範。

### 初始狀態
- `D:\gstack-plus` 目錄下沒有 `package.json`
- 沒有 `.eslintrc`、`.eslintignore`、或 ESLint 相關配置
- 沒有 TypeScript 依賴

### 給模型的指令（3 種模式都用這個）
```
初始化這個項目為 npm 項目，添加 ESLint 和 TypeScript ESLint 配置。
要求：
1. package.json 只需要 devDependencies（不需要運行時依賴）
2. 安裝 @typescript-eslint/parser 和 @typescript-eslint/eslint-plugin
3. 配置 ESLint 規則：
   - 禁止使用 any 類型（@typescript-eslint/no-explicit-any: error）
   - 強制使用 === 而不是 ==（eqeqeq: error）
   - 強制函數返回類型標注（@typescript-eslint/explicit-function-return-type: warn）
4. 創建 .eslintrc.json 配置文件
5. 確保 npx eslint . 能正常執行，沒有配置錯誤
```

### 成功標準（3 種模式統一判定）
- [ ] `package.json` 存在且包含 `eslint` 和 `@typescript-eslint/eslint-plugin` 的 devDependencies
- [ ] `.eslintrc.json` 存在且包含上述 3 條規則
- [ ] `npx eslint . --no-error-on-unmatched-pattern` 能執行，退出碼為 0（無配置錯誤）

### 預期複雜度分析（用於 Mode C 分類）
| 維度 | 分數 | 理由 |
|------|------|------|
| 判斷強度 | 1 | 有明確的工具和配置規範，不需要架構決策 |
| 上下文寬度 | 1 | 只涉及項目根目錄，不需要理解現有代碼 |
| 風險權重 | 1 | 純開發工具配置，不影響運行 |
| 可驗證性 | 5 | npx eslint 命令可以直接驗證 |
| 創意密度 | 1 | 套模板（標準 npm + ESLint 初始化流程） |

**預期路由**：Tier-Exec（判斷 ≤ 2 AND 上下文 ≤ 2 AND 可驗 ≥ 4）

---

## 任務 B：重構 classifier/scoring-guide.md 的評分邏輯為結構化數據（中等）

### 背景
`classifier/scoring-guide.md` 包含了 5 個維度的評分標準和 15 個例子，但都是純文字格式。需要將其轉換為 TypeScript 結構化數據，並實現自動評分函數。

### 初始狀態
- `classifier/scoring-guide.md` 已存在，包含完整的 5 維度定義和 15 個評分例子
- 項目還沒有 TypeScript 配置（需要在任務 A 完成後的狀態下開始）

### 給模型的指令（3 種模式都用這個）
```
把 classifier/scoring-guide.md 中的評分邏輯轉換為 TypeScript 代碼。

需要創建：
1. classifier/scoring-schema.ts — TypeScript 類型定義：
   - DimensionScore 類型（1-5 的數字）
   - ScoringDimensions 類型（包含 judgmentStrength、contextBreadth、riskWeight、verifiability、creativityDensity）
   - ScoringResult 類型（包含 dimensions 和路由建議）
   - ExampleTask 類型（包含描述、5 維度分數、路由結果、理由）

2. classifier/scorer.ts — 實現 scoreTask(description: string): ScoringResult 函數：
   - 根據任務描述的關鍵詞和特徵，估算 5 個維度的分數
   - 應用 routing-rules.md 的路由邏輯
   - 返回 ScoringResult

3. 把 scoring-guide.md 中的 15 個例子轉換為 TypeScript 對象數組，
   存儲在 classifier/examples.ts 中，符合 scoring-schema.ts 的類型定義
```

### 成功標準（3 種模式統一判定）
- [ ] `classifier/scoring-schema.ts` 存在，所有類型定義正確
- [ ] `classifier/scorer.ts` 存在，導出 `scoreTask` 函數
- [ ] `classifier/examples.ts` 存在，包含 15 個例子對象
- [ ] `tsc --noEmit` 執行無錯誤（需要先安裝 TypeScript）
- [ ] `scoreTask` 對 `test-tasks.md` 的前 3 個任務給出與預期一致的路由結果

### 預期複雜度分析（用於 Mode C 分類）
| 維度 | 分數 | 理由 |
|------|------|------|
| 判斷強度 | 3 | 需要設計 TypeScript 類型結構，但模式明確 |
| 上下文寬度 | 2 | 需要理解 scoring-guide.md 和 test-tasks.md |
| 風險權重 | 2 | 做錯了只影響分類器工具，不影響運行 |
| 可驗證性 | 4 | tsc --noEmit 和 scoreTask 測試可驗證 |
| 創意密度 | 2 | 有現有文檔參考，不需要從零設計 |

**預期路由**：Tier-Mid（不滿足 Exec 條件：判斷 = 3 > 2）

---

## 任務 C：設計 gstack-plus 的 API Key 認證方案（複雜）

### 背景
gstack-plus 作為多模型協作框架，需要認證機制來控制不同 Tier 的訪問權限。這需要一個完整的安全設計方案。

### 初始狀態
- 項目沒有任何認證機制或相關設計

### 給模型的指令（3 種模式都用這個）
```
為 gstack-plus 設計 API Key 認證方案，輸出為設計文件 docs/auth-design.md。

需要覆蓋：
1. API Key 的生成、存儲、驗證方案
   - 生成算法（用什麼生成 key？長度多少？）
   - 存儲方式（明文存儲還是哈希存儲？）
   - 驗證流程（請求中攜帶 key 的格式）
2. 每個 Tier 的訪問控制
   - Tier-A（Architect）需要什麼權限？
   - Tier-Mid（Reviewer）需要什麼權限？
   - Tier-Exec（Executor）需要什麼權限？
3. 安全考量
   - Key rotation（定期更換機制的設計）
   - Key revocation（撤銷機制）
   - Rate limiting（防止濫用）
   - 至少 3 個具體的威脅場景分析
4. 實施路線圖
   - 分 3 個 sprint 的實施計劃
   - 每個 sprint 的交付物
   - 風險和依賴項
```

### 成功標準（3 種模式統一判定）
- [ ] `docs/auth-design.md` 存在
- [ ] 文件包含 API Key 生成、存儲、驗證方案
- [ ] 文件包含 3 個 Tier 的訪問控制定義
- [ ] 文件包含安全考量部分，且有 ≥ 3 個具體威脅場景分析
- [ ] 文件包含分 3 個 sprint 的實施路線圖

### 預期複雜度分析（用於 Mode C 分類）
| 維度 | 分數 | 理由 |
|------|------|------|
| 判斷強度 | 5 | 需要評估多個方案的取捨（算法選擇、存儲策略、權限模型） |
| 上下文寬度 | 3 | 需要理解 gstack-plus 的三層架構 |
| 風險權重 | 5 | 認證設計錯誤可能導致安全漏洞 |
| 可驗證性 | 2 | 設計文件的質量難以用命令驗證，需要人工審查 |
| 創意密度 | 5 | 從零設計一個安全方案 |

**預期路由**：Tier-A（判斷 = 5, 風險 = 5, 創意 = 5 → 三個條件都觸發 Tier-A）

---

## 任務執行順序建議

```
任務 A（ESLint）→ 任務 B（重構）→ 任務 C（認證設計）
```

理由：
- 任務 A 的輸出（TypeScript + ESLint 配置）是任務 B 的前置條件
- 任務 C 是純設計任務，不依賴前兩個任務的輸出
- 簡單 → 中等 → 複雜的順序符合認知梯度

---

*Phase 3 完成 2026-05-02*
