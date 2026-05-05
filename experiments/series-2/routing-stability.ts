// Routing Stability Analysis — Series 2 Experiment A
// Tests: how many tasks change tier when any single dimension shifts ±1?

import { route } from '../../site/src/lib/route.js';

type Scoring = { judgment: number; context: number; risk: number; verifiability: number; creativity: number };
type Tier = 'Tier-A' | 'Tier-Mid' | 'Tier-Exec';

// ─── 30 diverse tasks covering all three tiers ───────────────────────────────
const TASKS: { id: string; name: string; scores: Scoring; expectedTier: Tier }[] = [
  // Tier-Exec (J≤2, C≤2, V≥4)
  { id: 'E01', name: 'Add JSDoc to single function',
    scores: { judgment: 1, context: 1, risk: 1, verifiability: 5, creativity: 1 }, expectedTier: 'Tier-Exec' },
  { id: 'E02', name: 'Rename variable across repo',
    scores: { judgment: 1, context: 2, risk: 1, verifiability: 5, creativity: 1 }, expectedTier: 'Tier-Exec' },
  { id: 'E03', name: 'Create .prettierrc config',
    scores: { judgment: 1, context: 1, risk: 1, verifiability: 5, creativity: 1 }, expectedTier: 'Tier-Exec' },
  { id: 'E04', name: 'Add package.json script alias',
    scores: { judgment: 1, context: 1, risk: 1, verifiability: 5, creativity: 1 }, expectedTier: 'Tier-Exec' },
  { id: 'E05', name: 'Write unit test for pure utility function',
    scores: { judgment: 2, context: 1, risk: 1, verifiability: 5, creativity: 1 }, expectedTier: 'Tier-Exec' },
  { id: 'E06', name: 'Fix typo in error message string',
    scores: { judgment: 1, context: 1, risk: 1, verifiability: 5, creativity: 1 }, expectedTier: 'Tier-Exec' },
  // Tier-Exec boundary (close to Tier-Mid)
  { id: 'E07', name: 'Add validation to form field',
    scores: { judgment: 2, context: 2, risk: 2, verifiability: 4, creativity: 1 }, expectedTier: 'Tier-Exec' },
  { id: 'E08', name: 'Add logging to existing function',
    scores: { judgment: 1, context: 2, risk: 2, verifiability: 5, creativity: 1 }, expectedTier: 'Tier-Exec' },

  // Tier-Mid (not triggering A or Exec)
  { id: 'M01', name: 'Refactor service class following CQRS',
    scores: { judgment: 3, context: 3, risk: 3, verifiability: 4, creativity: 2 }, expectedTier: 'Tier-Mid' },
  { id: 'M02', name: 'Migrate fetch() to React Query v5',
    scores: { judgment: 3, context: 3, risk: 2, verifiability: 4, creativity: 2 }, expectedTier: 'Tier-Mid' },
  { id: 'M03', name: 'Add pagination to list API endpoint',
    scores: { judgment: 3, context: 3, risk: 3, verifiability: 4, creativity: 2 }, expectedTier: 'Tier-Mid' },
  { id: 'M04', name: 'Write code review for payment processor PR',
    scores: { judgment: 3, context: 3, risk: 3, verifiability: 3, creativity: 1 }, expectedTier: 'Tier-Mid' },
  { id: 'M05', name: 'Extract React custom hook from component',
    scores: { judgment: 3, context: 3, risk: 2, verifiability: 4, creativity: 2 }, expectedTier: 'Tier-Mid' },
  { id: 'M06', name: 'Design DB schema for blog feature',
    scores: { judgment: 3, context: 3, risk: 3, verifiability: 3, creativity: 3 }, expectedTier: 'Tier-Mid' },
  // Tier-Mid boundary (close to Tier-A)
  { id: 'M07', name: 'Fix race condition in order service',
    scores: { judgment: 3, context: 3, risk: 4, verifiability: 4, creativity: 2 }, expectedTier: 'Tier-A' }, // risk=4 → Tier-A
  { id: 'M08', name: 'Upgrade auth lib with breaking changes',
    scores: { judgment: 3, context: 3, risk: 3, verifiability: 3, creativity: 3 }, expectedTier: 'Tier-Mid' },

  // Tier-A (J≥4 or R≥4 or Cr≥4)
  { id: 'A01', name: 'Design SSO + MFA architecture',
    scores: { judgment: 5, context: 4, risk: 5, verifiability: 2, creativity: 4 }, expectedTier: 'Tier-A' },
  { id: 'A02', name: 'Plan microservices migration',
    scores: { judgment: 5, context: 5, risk: 4, verifiability: 2, creativity: 4 }, expectedTier: 'Tier-A' },
  { id: 'A03', name: 'Design plugin system architecture',
    scores: { judgment: 5, context: 3, risk: 3, verifiability: 2, creativity: 5 }, expectedTier: 'Tier-A' },
  { id: 'A04', name: 'Design database sharding strategy',
    scores: { judgment: 5, context: 4, risk: 4, verifiability: 2, creativity: 4 }, expectedTier: 'Tier-A' },
  { id: 'A05', name: 'Security audit of auth flow',
    scores: { judgment: 4, context: 4, risk: 5, verifiability: 3, creativity: 2 }, expectedTier: 'Tier-A' },
  { id: 'A06', name: 'Design feature flag system',
    scores: { judgment: 4, context: 3, risk: 3, verifiability: 2, creativity: 4 }, expectedTier: 'Tier-A' },
  // Tier-A boundary (barely triggered)
  { id: 'A07', name: 'Refactor with high creativity demand',
    scores: { judgment: 3, context: 3, risk: 3, verifiability: 3, creativity: 4 }, expectedTier: 'Tier-A' },
  { id: 'A08', name: 'Design data model with risk concerns',
    scores: { judgment: 3, context: 3, risk: 4, verifiability: 3, creativity: 3 }, expectedTier: 'Tier-A' },

  // Explicitly borderline — designed to be near tier boundaries
  { id: 'B01', name: 'Cursor pagination borderline',
    scores: { judgment: 2, context: 2, risk: 3, verifiability: 4, creativity: 2 }, expectedTier: 'Tier-Exec' },
  { id: 'B02', name: 'Performance analysis borderline',
    scores: { judgment: 3, context: 3, risk: 2, verifiability: 4, creativity: 3 }, expectedTier: 'Tier-Mid' },
  { id: 'B03', name: 'Barely-Exec refactor',
    scores: { judgment: 2, context: 2, risk: 1, verifiability: 4, creativity: 1 }, expectedTier: 'Tier-Exec' },
  { id: 'B04', name: 'Barely-A judgment task',
    scores: { judgment: 4, context: 3, risk: 3, verifiability: 3, creativity: 3 }, expectedTier: 'Tier-A' },
  { id: 'B05', name: 'Mid-to-Exec-adjacent',
    scores: { judgment: 3, context: 2, risk: 2, verifiability: 4, creativity: 2 }, expectedTier: 'Tier-Mid' },
  { id: 'B06', name: 'Risk-border task',
    scores: { judgment: 3, context: 3, risk: 3, verifiability: 3, creativity: 2 }, expectedTier: 'Tier-Mid' },
];

const DIMS: (keyof Scoring)[] = ['judgment', 'context', 'risk', 'verifiability', 'creativity'];

function clamp(v: number): number {
  return Math.min(5, Math.max(1, v));
}

// ─── Analysis ─────────────────────────────────────────────────────────────────
interface TaskAnalysis {
  id: string;
  name: string;
  expectedTier: Tier;
  actualTier: Tier;
  routingCorrect: boolean;
  perturbations: { dim: string; delta: number; tier: Tier; changed: boolean }[];
  stableCount: number;
  unstableCount: number;
  stabilityPct: number;
}

const analyses: TaskAnalysis[] = [];

for (const task of TASKS) {
  const baseResult = route(task.scores);
  const perturbations: TaskAnalysis['perturbations'] = [];

  for (const dim of DIMS) {
    for (const delta of [-1, +1]) {
      const modified = { ...task.scores, [dim]: clamp(task.scores[dim] + delta) };
      if (modified[dim] === task.scores[dim]) continue;
      const r = route(modified);
      perturbations.push({ dim, delta, tier: r.tier as Tier, changed: r.tier !== baseResult.tier });
    }
  }

  const stableCount = perturbations.filter(p => !p.changed).length;
  const unstableCount = perturbations.filter(p => p.changed).length;

  analyses.push({
    id: task.id,
    name: task.name,
    expectedTier: task.expectedTier,
    actualTier: baseResult.tier as Tier,
    routingCorrect: baseResult.tier === task.expectedTier,
    perturbations,
    stableCount,
    unstableCount,
    stabilityPct: Math.round((stableCount / perturbations.length) * 100),
  });
}

// ─── Routing Accuracy ─────────────────────────────────────────────────────────
const correct = analyses.filter(a => a.routingCorrect).length;
const total = analyses.length;
console.log(`\n════════════════════════════════════════════════════════`);
console.log(`  ROUTING STABILITY ANALYSIS — gstack-plus Series 2A`);
console.log(`════════════════════════════════════════════════════════`);
console.log(`\n  Routing Accuracy: ${correct}/${total} (${Math.round(correct/total*100)}%)`);

// ─── Stability Summary ────────────────────────────────────────────────────────
const avgStability = Math.round(analyses.reduce((s, a) => s + a.stabilityPct, 0) / total);
console.log(`  Avg routing stability: ${avgStability}% (across ±1 perturbations)\n`);

console.log(`  TASK STABILITY TABLE`);
console.log(`  ${'ID'.padEnd(5)} ${'Tier'.padEnd(10)} ${'Stable%'.padEnd(9)} ${'Unstable perturbations'.padEnd(40)}`);
console.log(`  ${'─'.repeat(70)}`);
for (const a of analyses.sort((x, y) => x.stabilityPct - y.stabilityPct)) {
  const unstable = a.perturbations.filter(p => p.changed).map(p => `${p.dim}${p.delta>0?'+1':'-1'}→${p.tier}`).join(' ');
  const label = a.routingCorrect ? '' : '⚠WRONG';
  console.log(`  ${a.id.padEnd(5)} ${a.actualTier.padEnd(10)} ${String(a.stabilityPct+'%').padEnd(9)} ${(unstable || '—').padEnd(40)} ${label}`);
}

// ─── Dimension Impact ─────────────────────────────────────────────────────────
console.log(`\n  DIMENSION ROUTING IMPACT (how often ±1 changes tier)`);
console.log(`  ${'Dimension'.padEnd(15)} ${'Changes caused'.padEnd(16)} ${'Impact %'.padEnd(12)}`);
console.log(`  ${'─'.repeat(45)}`);
for (const dim of DIMS) {
  const dimPerts = analyses.flatMap(a => a.perturbations.filter(p => p.dim === dim));
  const changes = dimPerts.filter(p => p.changed).length;
  const pct = Math.round(changes / dimPerts.length * 100);
  console.log(`  ${dim.padEnd(15)} ${String(changes + '/' + dimPerts.length).padEnd(16)} ${pct}%`);
}

// ─── Key Insights ─────────────────────────────────────────────────────────────
const mostUnstable = analyses.sort((a, b) => a.stabilityPct - b.stabilityPct).slice(0, 5);
console.log(`\n  MOST UNSTABLE TASKS (top 5 — where score calibration matters most)`);
for (const a of mostUnstable) {
  console.log(`  ${a.id} ${a.name}: ${a.stabilityPct}% stable`);
  for (const p of a.perturbations.filter(pp => pp.changed)) {
    console.log(`    → ${p.dim}${p.delta > 0 ? '+1' : '-1'} changes ${a.actualTier} to ${p.tier}`);
  }
}

console.log(`\n════════════════════════════════════════════════════════\n`);
