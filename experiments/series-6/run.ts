import { route, clamp, type Scores, type Tier } from './router.ts';
import { writeFileSync } from 'fs';

interface BoundaryTask {
  id: string;
  descEn: string;
  baseline: Scores;
  baselineTier: Tier;
  boundaryType: string;
}

const TASKS: BoundaryTask[] = [
  { id: 'S1',  descEn: 'Add type annotation to existing function',
    baseline: { j:2, c:2, r:2, v:4, cr:1 }, baselineTier: 'Tier-Exec',
    boundaryType: 'Exec/Mid — J/C/R/V 同時邊界' },
  { id: 'S2',  descEn: 'Refactor large component into smaller ones',
    baseline: { j:3, c:3, r:3, v:3, cr:3 }, baselineTier: 'Tier-Mid',
    boundaryType: 'Mid/A — J/R/Cr 同時邊界' },
  { id: 'S3',  descEn: 'Write integration tests for payment service',
    baseline: { j:3, c:2, r:3, v:4, cr:2 }, baselineTier: 'Tier-Mid',
    boundaryType: 'Mid/A — J/R 邊界' },
  { id: 'S4',  descEn: 'Add database connection pooling',
    baseline: { j:3, c:2, r:3, v:4, cr:1 }, baselineTier: 'Tier-Mid',
    boundaryType: 'Mid/A — R 邊界' },
  { id: 'S5',  descEn: 'Create a reusable animation system',
    baseline: { j:3, c:2, r:1, v:3, cr:3 }, baselineTier: 'Tier-Mid',
    boundaryType: 'Mid/A — Cr 邊界' },
  { id: 'S6',  descEn: 'Update environment variables in CI',
    baseline: { j:2, c:2, r:2, v:3, cr:1 }, baselineTier: 'Tier-Mid',
    boundaryType: 'Exec/Mid — V 邊界' },
  { id: 'S7',  descEn: 'Add logging to three specific functions',
    baseline: { j:2, c:3, r:1, v:5, cr:1 }, baselineTier: 'Tier-Mid',
    boundaryType: 'Exec/Mid — C 邊界' },
  { id: 'S8',  descEn: 'Add database index for search query',
    baseline: { j:1, c:1, r:3, v:5, cr:1 }, baselineTier: 'Tier-Mid',
    boundaryType: 'Exec/Mid — R 邊界 / Mid/A — R 邊界' },
  { id: 'S9',  descEn: 'Implement pagination for user list API',
    baseline: { j:2, c:3, r:2, v:4, cr:2 }, baselineTier: 'Tier-Mid',
    boundaryType: 'Exec/Mid — J/C 邊界' },
  { id: 'S10', descEn: 'Design API rate limiting strategy',
    baseline: { j:4, c:2, r:3, v:4, cr:2 }, baselineTier: 'Tier-A',
    boundaryType: 'A（J 單維度支撐，J-1 → Mid）' },
];

type DimKey = 'j' | 'c' | 'r' | 'v' | 'cr';
const DIMS: DimKey[] = ['j', 'c', 'r', 'v', 'cr'];
const DIM_NAMES: Record<DimKey, string> = {
  j: 'J（判斷強度）',
  c: 'C（上下文寬度）',
  r: 'R（風險權重）',
  v: 'V（可驗證性）',
  cr: 'Cr（創意密度）',
};

interface PerturbResult {
  taskId: string;
  dim: DimKey;
  direction: '+1' | '-1';
  originalScore: number;
  perturbedScore: number;
  originalTier: Tier;
  perturbedTier: Tier;
  tierChanged: boolean;
}

const allResults: PerturbResult[] = [];

// ── Perturb each task's each dimension by ±1 ─────────────────────────────────
for (const task of TASKS) {
  for (const dim of DIMS) {
    for (const delta of [+1, -1] as const) {
      const perturbed = { ...task.baseline };
      perturbed[dim] = clamp(task.baseline[dim] + delta);

      // Skip if clamp didn't change the score
      if (perturbed[dim] === task.baseline[dim]) continue;

      const perturbedTier = route(perturbed);
      allResults.push({
        taskId: task.id,
        dim,
        direction: delta > 0 ? '+1' : '-1',
        originalScore: task.baseline[dim],
        perturbedScore: perturbed[dim],
        originalTier: task.baselineTier,
        perturbedTier,
        tierChanged: perturbedTier !== task.baselineTier,
      });
    }
  }
}

// ── Calculate per-dimension sensitivity ──────────────────────────────────────
interface DimSensitivity {
  dim: DimKey;
  name: string;
  totalPerturbations: number;
  tierChanges: number;
  sensitivityRate: number;
  positiveChanges: number;
  negativeChanges: number;
}

const sensitivity: DimSensitivity[] = DIMS.map(dim => {
  const dimResults = allResults.filter(r => r.dim === dim);
  const changes = dimResults.filter(r => r.tierChanged);
  return {
    dim,
    name: DIM_NAMES[dim],
    totalPerturbations: dimResults.length,
    tierChanges: changes.length,
    sensitivityRate: dimResults.length > 0 ? changes.length / dimResults.length : 0,
    positiveChanges: changes.filter(r => r.direction === '+1').length,
    negativeChanges: changes.filter(r => r.direction === '-1').length,
  };
}).sort((a, b) => b.sensitivityRate - a.sensitivityRate);

// ── Print report ─────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  Series 6：評分維度敏感性排名');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log('排名 | 維度               | 擾動次數 | 路由變化 | 敏感率   | +1 變化 | -1 變化');
console.log('-----|--------------------|---------|---------|---------|---------|---------');

sensitivity.forEach((s, i) => {
  console.log(
    `  ${(i + 1).toString().padStart(2)} | ${s.name.padEnd(18)} | ${s.totalPerturbations.toString().padStart(8)} | ` +
    `${s.tierChanges.toString().padStart(8)} | ${(s.sensitivityRate * 100).toFixed(0).padStart(6)}%  | ` +
    `${s.positiveChanges.toString().padStart(7)} | ${s.negativeChanges.toString().padStart(7)}`
  );
});

console.log('\n--- 各任務詳細擾動結果 ---\n');

for (const task of TASKS) {
  const taskResults = allResults.filter(r => r.taskId === task.id);
  const changes = taskResults.filter(r => r.tierChanged);
  console.log(`${task.id} (${task.baselineTier}) — ${task.descEn}`);
  if (changes.length === 0) {
    console.log('  → 無任何維度 ±1 擾動引發路由變化（穩定任務）');
  } else {
    for (const c of changes) {
      console.log(`  → ${DIM_NAMES[c.dim]} ${c.direction} (${c.originalScore}→${c.perturbedScore}): ${c.originalTier} → ${c.perturbedTier}`);
    }
  }
  console.log('');
}

// ── Overall stats ─────────────────────────────────────────────────────────────
const totalPerturbations = allResults.length;
const totalChanges = allResults.filter(r => r.tierChanged).length;
console.log(`\n整體統計：${totalChanges}/${totalPerturbations} 次擾動引發路由變化（${(totalChanges / totalPerturbations * 100).toFixed(0)}%）`);

// ── Write JSON ────────────────────────────────────────────────────────────────
writeFileSync(
  'experiments/series-6/results.json',
  JSON.stringify({ sensitivity, allResults, totalPerturbations, totalChanges }, null, 2)
);
console.log('\n結果已寫入 experiments/series-6/results.json');
