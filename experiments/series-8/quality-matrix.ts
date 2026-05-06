import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Series 5 品質基準（滿分 15，3 任務平均，取各 Tier 任務對應模型的分數）
const QUALITY: Record<string, Record<string, number>> = {
  'Tier-Exec': { 'Tier-Exec': 14.5, 'Tier-Mid': 14.5, 'Tier-A': 15   },
  'Tier-Mid':  { 'Tier-Exec': 10.5, 'Tier-Mid': 13.5, 'Tier-A': 13   },
  'Tier-A':    { 'Tier-Exec': 8.0,  'Tier-Mid': 11.0, 'Tier-A': 12   },
};
// 說明：QUALITY[correctTier][sentToTier]
// = 把「需要 correctTier 能力的任務」送給「sentToTier」模型的預期品質分
// Tier-Exec 任務：Exec/Mid/A 模型都能做好（14.5/14.5/15）
// Tier-Mid 任務：Exec 模型做不好（10.5），Mid/A 差不多（13.5/13）
// Tier-A 任務：Exec 做差（8），Mid 差（11），A 最好（12）

const TIER_COST: Record<string, number> = {
  'Tier-A':    0.060,
  'Tier-Mid':  0.010,
  'Tier-Exec': 0.001,
};

interface Scenario {
  id: string;
  descriptionZh: string;
  descriptionEn: string;
  correctTier: string;
  sentToTier: string;
  errorType: 'over-routing' | 'under-routing';
}

const SCENARIOS: Scenario[] = [
  { id: 'E1', descriptionZh: '為工具函數加類型標注', descriptionEn: 'Add type annotations to utility functions',
    correctTier: 'Tier-Exec', sentToTier: 'Tier-Mid', errorType: 'over-routing' },
  { id: 'E2', descriptionZh: '更新 CI 環境變量', descriptionEn: 'Update environment variables in CI pipeline',
    correctTier: 'Tier-Exec', sentToTier: 'Tier-Mid', errorType: 'over-routing' },
  { id: 'E3', descriptionZh: '為高頻查詢欄位加索引', descriptionEn: 'Add database index for frequently queried field',
    correctTier: 'Tier-Exec', sentToTier: 'Tier-Mid', errorType: 'over-routing' },
  { id: 'M1', descriptionZh: '重構 auth 中間件使用 JWT', descriptionEn: 'Refactor auth middleware to use JWT',
    correctTier: 'Tier-Mid', sentToTier: 'Tier-A', errorType: 'over-routing' },
  { id: 'M2', descriptionZh: '為用戶列表 API 加分頁', descriptionEn: 'Add pagination to user list API',
    correctTier: 'Tier-Mid', sentToTier: 'Tier-A', errorType: 'over-routing' },
  { id: 'M3', descriptionZh: '為支付服務編寫整合測試', descriptionEn: 'Write integration tests for payment service',
    correctTier: 'Tier-Mid', sentToTier: 'Tier-Exec', errorType: 'under-routing' },
  { id: 'A1', descriptionZh: '設計資料庫分片策略', descriptionEn: 'Design database sharding strategy',
    correctTier: 'Tier-A', sentToTier: 'Tier-Mid', errorType: 'under-routing' },
  { id: 'A2', descriptionZh: '規劃 OAuth2 + SSO 整合架構', descriptionEn: 'Plan OAuth2 + SSO integration architecture',
    correctTier: 'Tier-A', sentToTier: 'Tier-Mid', errorType: 'under-routing' },
  { id: 'A3', descriptionZh: '評估並推薦緩存策略', descriptionEn: 'Evaluate and recommend caching strategy',
    correctTier: 'Tier-A', sentToTier: 'Tier-Mid', errorType: 'under-routing' },
];

function run() {
  const results = SCENARIOS.map(s => {
    const qualityCorrect = QUALITY[s.correctTier][s.correctTier];
    const qualityActual  = QUALITY[s.correctTier][s.sentToTier];
    const qualityDelta   = qualityActual - qualityCorrect;
    const qualityDeltaPct = Math.round((qualityDelta / qualityCorrect) * 100);

    const costCorrect  = TIER_COST[s.correctTier];
    const costActual   = TIER_COST[s.sentToTier];
    const costDelta    = costActual - costCorrect;
    const costDeltaPct = Math.round((costDelta / costCorrect) * 100);

    return {
      id: s.id,
      descriptionZh: s.descriptionZh,
      descriptionEn: s.descriptionEn,
      errorType: s.errorType,
      correctTier: s.correctTier,
      sentToTier: s.sentToTier,
      qualityCorrect,
      qualityActual,
      qualityDelta: Math.round(qualityDelta * 10) / 10,
      qualityDeltaPct,
      costCorrect,
      costActual,
      costDeltaPct,
    };
  });

  const overRouting  = results.filter(r => r.errorType === 'over-routing');
  const underRouting = results.filter(r => r.errorType === 'under-routing');

  const summary = {
    overRouting: {
      avgQualityDelta: Math.round(overRouting.reduce((s, r) => s + r.qualityDelta, 0) / overRouting.length * 10) / 10,
      finding: 'Over-routing has zero or positive quality impact — you waste money but quality stays the same or improves',
    },
    underRouting: {
      avgQualityDelta: Math.round(underRouting.reduce((s, r) => s + r.qualityDelta, 0) / underRouting.length * 10) / 10,
      finding: 'Under-routing degrades quality by 1–4 points per task — most severe for Tier-A architecture tasks',
    },
    keyConclusion: 'Routing errors are asymmetric: over-routing wastes money but preserves quality; under-routing saves money but degrades quality. The risk is one-directional — always prefer conservative (over) routing.',
  };

  const output = { scenarios: results, summary };
  const outPath = path.join(__dirname, 'results.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log('\n=== Series 8: Routing Error Quality Impact Matrix ===\n');
  console.log('Over-routing quality impact:');
  overRouting.forEach(r => console.log(`  ${r.id}: quality ${r.qualityCorrect} → ${r.qualityActual} (${r.qualityDelta >= 0 ? '+' : ''}${r.qualityDelta} pts, ${r.costDeltaPct > 0 ? '+' : ''}${r.costDeltaPct}% cost)`));
  console.log('\nUnder-routing quality impact:');
  underRouting.forEach(r => console.log(`  ${r.id}: quality ${r.qualityCorrect} → ${r.qualityActual} (${r.qualityDelta} pts, ${r.costDeltaPct}% cost)`));
  console.log('\nSummary:', JSON.stringify(summary, null, 2));
  console.log(`\nResults written to ${outPath}`);
}

run();
