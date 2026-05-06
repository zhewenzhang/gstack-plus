import { TASKS_7 } from './tasks';
import { TIER_COST, type Tier } from './router';
import * as fs from 'fs';
import * as path from 'path';

interface TaskResult {
  id: string;
  description: string;
  correctTier: Tier;
  experimentTier: Tier;
  errorType: string;
  costCorrect: number;
  costExperiment: number;
  costDelta: number;
  costDeltaPct: number;
  overRoutingWaste?: number;
  underRoutingNotes?: string;
}

function analyze() {
  const results: TaskResult[] = [];

  for (const task of TASKS_7) {
    const costCorrect = TIER_COST[task.correctTier];
    const costExperiment = TIER_COST[task.experimentTier];
    const costDelta = costExperiment - costCorrect;
    const costDeltaPct = costCorrect > 0 ? (costDelta / costCorrect) * 100 : 0;

    results.push({
      id: task.id,
      description: task.description,
      correctTier: task.correctTier,
      experimentTier: task.experimentTier,
      errorType: task.errorType,
      costCorrect,
      costExperiment,
      costDelta,
      costDeltaPct: Math.round(costDeltaPct),
      overRoutingWaste: task.errorType === 'over-routing' ? costDelta : undefined,
      underRoutingNotes: task.errorType === 'under-routing'
        ? `Potential quality risk: task requires ${task.correctTier} but was sent to ${task.experimentTier}`
        : undefined,
    });
  }

  // Summary stats
  const overRouting = results.filter(r => r.errorType === 'over-routing');
  const underRouting = results.filter(r => r.errorType === 'under-routing');

  const avgOverRoutingWaste = overRouting.reduce((s, r) => s + r.costDelta, 0) / overRouting.length;
  const avgUnderRoutingSaving = underRouting.reduce((s, r) => s + Math.abs(r.costDelta), 0) / underRouting.length;

  const summary = {
    totalTasks: results.length,
    overRoutingTasks: overRouting.length,
    underRoutingTasks: underRouting.length,
    avgOverRoutingCostIncrease: `+${Math.round(avgOverRoutingWaste / TIER_COST['Tier-Exec'] * 100)}% vs correct`,
    avgUnderRoutingSaving: `-${Math.round(avgUnderRoutingSaving / TIER_COST['Tier-A'] * 100)}% vs correct`,
    breakEvenAnalysis: {
      description: 'Is conservative routing (always escalate on J=3 or R=3) worth it?',
      overRoutingCostPenalty: `+${Math.round((TIER_COST['Tier-Mid'] / TIER_COST['Tier-Exec'] - 1) * 100)}% per Exec→Mid escalation`,
      underRoutingQualityRisk: 'Quality degradation on Tier-A tasks sent to Tier-Mid',
      recommendation: avgOverRoutingWaste < 0.02
        ? 'Conservative routing justified — over-routing penalty < $0.02/task'
        : 'Conservative routing expensive — evaluate case-by-case',
    },
  };

  const output = { tasks: results, summary };

  const outPath = path.join(__dirname, 'results.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

  // Print results
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  Series 7: Routing Error Cost Analysis');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Over-routing (sending cheaper tasks to expensive model):');
  for (const r of overRouting) {
    console.log(`  ${r.id} ${r.correctTier} → ${r.experimentTier}: +$${r.costDelta.toFixed(4)} (+${r.costDeltaPct}%)`);
  }

  console.log('\nUnder-routing (sending complex tasks to cheaper model):');
  for (const r of underRouting) {
    console.log(`  ${r.id} ${r.correctTier} → ${r.experimentTier}: -$${Math.abs(r.costDelta).toFixed(4)} (${r.costDeltaPct}%) — ${r.underRoutingNotes}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  Summary');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Over-routing tasks: ${summary.overRoutingTasks}`);
  console.log(`  Avg over-routing cost increase: ${summary.avgOverRoutingCostIncrease}`);
  console.log(`  Under-routing tasks: ${summary.underRoutingTasks}`);
  console.log(`  Avg under-routing saving: ${summary.avgUnderRoutingSaving}`);
  console.log(`\n  Break-even: ${summary.breakEvenAnalysis.recommendation}`);
  console.log(`\n  Results written to ${outPath}`);
}

analyze();
