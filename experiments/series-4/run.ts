import { route, type Scores, type Tier } from './router.ts';
import { writeFileSync } from 'fs';

interface Task {
  id: string;
  domain: 'Frontend' | 'Backend' | 'DataEng' | 'DevOps';
  descZh: string;
  descEn: string;
  groundTruth: Scores;
  expectedTier: Tier;
}

const TASKS: Task[] = [
  // ── Frontend ──────────────────────────────────────────────────────────────
  { id: 'F1', domain: 'Frontend', descZh: '修復按鈕標籤錯字', descEn: 'Fix typo in button label',
    groundTruth: { j:1, c:1, r:1, v:5, cr:1 }, expectedTier: 'Tier-Exec' },
  { id: 'F2', domain: 'Frontend', descZh: '添加骨架屏加載動畫', descEn: 'Add skeleton loading animation to all pages',
    groundTruth: { j:2, c:2, r:1, v:4, cr:2 }, expectedTier: 'Tier-Exec' },
  { id: 'F3', domain: 'Frontend', descZh: '從零設計組件庫 Design System', descEn: 'Design component library Design System from scratch',
    groundTruth: { j:4, c:3, r:2, v:2, cr:5 }, expectedTier: 'Tier-A' },
  { id: 'F4', domain: 'Frontend', descZh: '遷移整個項目至 React Hooks', descEn: 'Migrate entire codebase from React class components to Hooks',
    groundTruth: { j:3, c:4, r:3, v:3, cr:2 }, expectedTier: 'Tier-Mid' },
  { id: 'F5', domain: 'Frontend', descZh: '實現實時協作編輯功能', descEn: 'Implement real-time collaborative editing',
    groundTruth: { j:5, c:4, r:4, v:2, cr:4 }, expectedTier: 'Tier-A' },

  // ── Backend ───────────────────────────────────────────────────────────────
  { id: 'B1', domain: 'Backend', descZh: '添加 /health 心跳端點', descEn: 'Add /health heartbeat endpoint',
    groundTruth: { j:1, c:1, r:1, v:5, cr:1 }, expectedTier: 'Tier-Exec' },
  { id: 'B2', domain: 'Backend', descZh: '為 users 表的 created_at 欄位添加索引', descEn: 'Add index on users.created_at column',
    groundTruth: { j:1, c:1, r:2, v:5, cr:1 }, expectedTier: 'Tier-Exec' },
  { id: 'B3', domain: 'Backend', descZh: '重構 Auth 中介層以支援 OAuth 2.0', descEn: 'Refactor auth middleware to support OAuth 2.0',
    groundTruth: { j:3, c:3, r:3, v:3, cr:2 }, expectedTier: 'Tier-Mid' },
  { id: 'B4', domain: 'Backend', descZh: '為所有 API 端點加入速率限流', descEn: 'Add rate limiting to all API endpoints',
    groundTruth: { j:4, c:3, r:4, v:3, cr:2 }, expectedTier: 'Tier-A' },
  { id: 'B5', domain: 'Backend', descZh: '設計全平台微服務拆分架構', descEn: 'Design microservices split architecture for the entire platform',
    groundTruth: { j:5, c:5, r:4, v:1, cr:3 }, expectedTier: 'Tier-A' },

  // ── Data Engineering ──────────────────────────────────────────────────────
  { id: 'D1', domain: 'DataEng', descZh: '將 CSV 文件批量導入 PostgreSQL', descEn: 'Batch import CSV files into PostgreSQL',
    groundTruth: { j:1, c:1, r:2, v:5, cr:1 }, expectedTier: 'Tier-Exec' },
  { id: 'D2', domain: 'DataEng', descZh: '清理 ETL 管道中的重複數據記錄', descEn: 'Deduplicate records in ETL pipeline',
    groundTruth: { j:2, c:2, r:2, v:4, cr:1 }, expectedTier: 'Tier-Exec' },
  { id: 'D3', domain: 'DataEng', descZh: 'EXPLAIN ANALYZE 優化慢查詢', descEn: 'Optimize slow SQL query using EXPLAIN ANALYZE',
    groundTruth: { j:3, c:3, r:3, v:4, cr:2 }, expectedTier: 'Tier-Mid' },
  { id: 'D4', domain: 'DataEng', descZh: '設計 Kafka + Flink 實時流處理架構', descEn: 'Design real-time stream processing architecture with Kafka + Flink',
    groundTruth: { j:5, c:4, r:4, v:2, cr:3 }, expectedTier: 'Tier-A' },
  { id: 'D5', domain: 'DataEng', descZh: '設計跨數據中心數據同步策略', descEn: 'Design cross-datacenter data synchronization strategy',
    groundTruth: { j:5, c:4, r:5, v:2, cr:3 }, expectedTier: 'Tier-A' },

  // ── DevOps ────────────────────────────────────────────────────────────────
  { id: 'O1', domain: 'DevOps', descZh: '更新 GitHub Actions 中的 Node.js 版本', descEn: 'Update Node.js version in GitHub Actions workflow',
    groundTruth: { j:1, c:1, r:2, v:5, cr:1 }, expectedTier: 'Tier-Exec' },
  { id: 'O2', domain: 'DevOps', descZh: '添加 Docker 健康檢查配置', descEn: 'Add Docker healthcheck configuration',
    groundTruth: { j:2, c:2, r:2, v:4, cr:1 }, expectedTier: 'Tier-Exec' },
  { id: 'O3', domain: 'DevOps', descZh: '調查生產環境間歇性內存洩漏', descEn: 'Investigate intermittent memory leak in production',
    groundTruth: { j:3, c:4, r:3, v:2, cr:2 }, expectedTier: 'Tier-Mid' },
  { id: 'O4', domain: 'DevOps', descZh: '為 K8s 集群配置 HPA 自動擴縮容', descEn: 'Configure K8s cluster HPA autoscaling',
    groundTruth: { j:4, c:3, r:4, v:3, cr:2 }, expectedTier: 'Tier-A' },
  { id: 'O5', domain: 'DevOps', descZh: '設計零停機藍綠部署方案', descEn: 'Design zero-downtime blue-green deployment strategy',
    groundTruth: { j:4, c:4, r:5, v:2, cr:3 }, expectedTier: 'Tier-A' },
];

// ── Qwen Code 獨立評分（基於 classifier/scoring-guide.md）────────────────────
const ACTUAL_SCORES: Scores[] = [
  // F1  F2  F3  F4  F5
  { j:1, c:1, r:1, v:5, cr:1 },
  { j:2, c:2, r:1, v:4, cr:2 },
  { j:4, c:3, r:2, v:2, cr:5 },
  { j:3, c:4, r:3, v:3, cr:2 },
  { j:5, c:4, r:4, v:2, cr:4 },
  // B1  B2  B3  B4  B5
  { j:1, c:1, r:1, v:5, cr:1 },
  { j:1, c:1, r:2, v:5, cr:1 },
  { j:3, c:3, r:3, v:3, cr:2 },
  { j:4, c:3, r:4, v:3, cr:2 },
  { j:5, c:5, r:4, v:1, cr:3 },
  // D1  D2  D3  D4  D5
  { j:1, c:1, r:2, v:5, cr:1 },
  { j:2, c:2, r:2, v:4, cr:1 },
  { j:3, c:3, r:3, v:4, cr:2 },
  { j:5, c:4, r:4, v:2, cr:3 },
  { j:5, c:4, r:5, v:2, cr:3 },
  // O1  O2  O3  O4  O5
  { j:1, c:1, r:2, v:5, cr:1 },
  { j:2, c:2, r:2, v:4, cr:1 },
  { j:3, c:4, r:3, v:2, cr:2 },
  { j:4, c:3, r:4, v:3, cr:2 },
  { j:4, c:4, r:5, v:2, cr:3 },
];

// ── 計算結果 ──────────────────────────────────────────────────────────────────
interface Result {
  id: string;
  domain: string;
  descEn: string;
  groundTruth: Scores;
  expectedTier: Tier;
  actualScores: Scores;
  actualTier: Tier;
  tierMatch: boolean;
  scoreDelta: { j: number; c: number; r: number; v: number; cr: number };
}

const results: Result[] = TASKS.map((task, i) => {
  const actual = ACTUAL_SCORES[i];
  const actualTier = route(actual);
  return {
    id: task.id,
    domain: task.domain,
    descEn: task.descEn,
    groundTruth: task.groundTruth,
    expectedTier: task.expectedTier,
    actualScores: actual,
    actualTier,
    tierMatch: actualTier === task.expectedTier,
    scoreDelta: {
      j: actual.j - task.groundTruth.j,
      c: actual.c - task.groundTruth.c,
      r: actual.r - task.groundTruth.r,
      v: actual.v - task.groundTruth.v,
      cr: actual.cr - task.groundTruth.cr,
    },
  };
});

// ── 輸出報告 ──────────────────────────────────────────────────────────────────
const domains = ['Frontend', 'Backend', 'DataEng', 'DevOps'] as const;

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  Series 4：領域適用性測試結果');
console.log('═══════════════════════════════════════════════════════════════\n');

for (const domain of domains) {
  const domainResults = results.filter(r => r.domain === domain);
  const correct = domainResults.filter(r => r.tierMatch).length;
  console.log(`【${domain}】準確率：${correct}/${domainResults.length}`);
  for (const r of domainResults) {
    const match = r.tierMatch ? '✓' : '✗';
    const delta = `Δ(j:${r.scoreDelta.j > 0 ? '+' : ''}${r.scoreDelta.j},c:${r.scoreDelta.c > 0 ? '+' : ''}${r.scoreDelta.c},r:${r.scoreDelta.r > 0 ? '+' : ''}${r.scoreDelta.r},v:${r.scoreDelta.v > 0 ? '+' : ''}${r.scoreDelta.v},cr:${r.scoreDelta.cr > 0 ? '+' : ''}${r.scoreDelta.cr})`;
    console.log(`  ${match} ${r.id} | 預設:${r.expectedTier} | 實際:${r.actualTier} | ${delta}`);
    console.log(`       ${r.descEn}`);
  }
  console.log('');
}

const totalCorrect = results.filter(r => r.tierMatch).length;
console.log(`═══════════════════════════════════════════════════════════════`);
console.log(`總準確率：${totalCorrect}/20 = ${(totalCorrect / 20 * 100).toFixed(0)}%`);
console.log(`═══════════════════════════════════════════════════════════════\n`);

// ── 分數偏差統計 ──────────────────────────────────────────────────────────────
const dimNames = { j: 'J（判斷）', c: 'C（上下文）', r: 'R（風險）', v: 'V（可驗）', cr: 'Cr（創意）' };
const dims = ['j', 'c', 'r', 'v', 'cr'] as const;

console.log('分數偏差分析（實際評分 − 基準評分）：');
for (const d of dims) {
  const deltas = results.map(r => r.scoreDelta[d]);
  const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  const maxAbs = Math.max(...deltas.map(Math.abs));
  const sign = avg > 0.01 ? '偏高' : avg < -0.01 ? '偏低' : '中性';
  console.log(`  ${dimNames[d]}: 平均Δ=${avg.toFixed(2)}, 最大Δ=${maxAbs}, 方向=${sign}`);
}
console.log('');

// ── 輸出 JSON ─────────────────────────────────────────────────────────────────
writeFileSync(
  'experiments/series-4/results.json',
  JSON.stringify({ results, totalCorrect, accuracy: totalCorrect / 20 }, null, 2)
);
console.log('結果已寫入 experiments/series-4/results.json');
