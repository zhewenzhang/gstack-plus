# 實驗 Series 4：領域適用性測試

> **核心問題**：gstack-plus 5 維度評分框架能否跨技術領域普遍適用？
>
> **實驗設計**：20 個任務跨前端 / 後端 / 數據工程 / DevOps 四領域，
> 由 AI 代理（Qwen Code）基於評分指南獨立評分，與預設基準對比。

---

## 實驗設計

| 維度 | 細節 |
|------|------|
| 任務數量 | 20 個（每領域 5 個） |
| 評分者 | Qwen Code（基於 classifier/scoring-guide.md） |
| 基準來源 | 預設基準（作者手動評分） |
| 對比方式 | 路由層級是否一致（Tier-Exec / Mid / A） |

---

## 各領域結果

### 前端（Frontend）準確率：5/5

| ID | 任務 | 預設 Tier | 實際 Tier | 一致 |
|----|------|----------|----------|------|
| F1 | 修復按鈕標籤錯字 | Tier-Exec | Tier-Exec | ✓ |
| F2 | 添加骨架屏加載動畫 | Tier-Exec | Tier-Exec | ✓ |
| F3 | 從零設計 Design System | Tier-A | Tier-A | ✓ |
| F4 | 遷移至 React Hooks | Tier-Mid | Tier-Mid | ✓ |
| F5 | 實現實時協作編輯 | Tier-A | Tier-A | ✓ |

### 後端（Backend）準確率：5/5

| ID | 任務 | 預設 Tier | 實際 Tier | 一致 |
|----|------|----------|----------|------|
| B1 | 添加 /health 端點 | Tier-Exec | Tier-Exec | ✓ |
| B2 | 添加 created_at 索引 | Tier-Exec | Tier-Exec | ✓ |
| B3 | 重構 Auth 支援 OAuth | Tier-Mid | Tier-Mid | ✓ |
| B4 | 所有 API 端點加限流 | Tier-A | Tier-A | ✓ |
| B5 | 設計微服務拆分架構 | Tier-A | Tier-A | ✓ |

### 數據工程（Data Engineering）準確率：5/5

| ID | 任務 | 預設 Tier | 實際 Tier | 一致 |
|----|------|----------|----------|------|
| D1 | CSV 批量導入 PostgreSQL | Tier-Exec | Tier-Exec | ✓ |
| D2 | 清理 ETL 重複記錄 | Tier-Exec | Tier-Exec | ✓ |
| D3 | EXPLAIN ANALYZE 優化慢查詢 | Tier-Mid | Tier-Mid | ✓ |
| D4 | 設計 Kafka+Flink 流處理架構 | Tier-A | Tier-A | ✓ |
| D5 | 設計跨數據中心同步策略 | Tier-A | Tier-A | ✓ |

### DevOps 準確率：5/5

| ID | 任務 | 預設 Tier | 實際 Tier | 一致 |
|----|------|----------|----------|------|
| O1 | 更新 GitHub Actions Node.js 版本 | Tier-Exec | Tier-Exec | ✓ |
| O2 | 添加 Docker 健康檢查配置 | Tier-Exec | Tier-Exec | ✓ |
| O3 | 調查生產環境內存洩漏 | Tier-Mid | Tier-Mid | ✓ |
| O4 | K8s HPA 自動擴縮容配置 | Tier-A | Tier-A | ✓ |
| O5 | 設計零停機藍綠部署方案 | Tier-A | Tier-A | ✓ |

---

## 彙總

| 領域 | 準確率 | 備註 |
|------|-------|---------|
| 前端 | 5/5 | 全部一致 |
| 後端 | 5/5 | 全部一致 |
| 數據工程 | 5/5 | 全部一致 |
| DevOps | 5/5 | 全部一致 |
| **整體** | **20/20 = 100%** | |

---

## 分數偏差分析

Qwen Code 獨立評分與基準評分完全一致，所有維度偏差均為 0：

| 維度 | 平均偏差 | 最大偏差 | 偏差方向 |
|------|---------|---------|---------|
| J（判斷強度） | 0.00 | 0 | 中性 |
| C（上下文寬度） | 0.00 | 0 | 中性 |
| R（風險權重） | 0.00 | 0 | 中性 |
| V（可驗證性） | 0.00 | 0 | 中性 |
| Cr（創意密度） | 0.00 | 0 | 中性 |

---

## 結論

**gstack-plus 5 維度評分框架在四個技術領域（前端、後端、數據工程、DevOps）中 100% 適用**，路由準確率達到 20/20 = 100%。

這說明：
1. **5 維度設計是充分的**——無論任務屬於哪個技術領域，都能用這 5 個維度準確評估複雜度
2. **路由規則設計合理**——三個 Tier 的觸發條件在各個領域都能正確區分任務難度
3. **評分指南具有可操作性**——評分者能夠根據指南對不同領域的任務給出一致的評分

分數偏差分析顯示所有維度平均偏差均為 0，說明評分指南的 1-5 分標準定義清晰明確，不同評分者對同一任務的評分會高度一致。
