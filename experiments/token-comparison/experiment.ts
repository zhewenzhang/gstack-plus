import OpenAI from 'openai';
import fs from 'node:fs';

// ─── API Clients ──────────────────────────────────────────────────────────────
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});

const dashscope = new OpenAI({
  baseURL: 'https://coding.dashscope.aliyuncs.com/v1',
  apiKey: process.env.DASHSCOPE_API_KEY ?? '',
});

// ─── Models ───────────────────────────────────────────────────────────────────
const MODELS = {
  opus:   { client: openrouter, id: 'anthropic/claude-opus-4.7' },
  sonnet: { client: openrouter, id: 'anthropic/claude-sonnet-4-6' },
  qwen:   { client: dashscope,  id: 'qwen3-coder-plus' },
} as const;

// Per-million-token prices (USD) — update if OpenRouter pricing changes
const PRICES: Record<string, { input: number; output: number }> = {
  'anthropic/claude-opus-4.7':   { input: 15.00, output: 75.00 },
  'anthropic/claude-sonnet-4-6': { input:  3.00, output: 15.00 },
  'qwen3-coder-plus':            { input:  0.50, output:  2.00 },
};

// ─── Tasks ────────────────────────────────────────────────────────────────────
// 三個任務，分別對應三個不同 Tier 的典型工作
const TASKS = [
  {
    id: 'T1',
    name: 'Rename function across repo',
    expectedTier: 'Tier-Exec',
    gstackScores: '1,2,1,5,1',
    prompt: `You are a senior engineer. Give me the exact shell command(s) to rename all occurrences of the function name \`getCwd\` to \`getWorkingDir\` across all TypeScript files under ./src using sed or a Node.js one-liner. Show only the command, no explanation.`,
  },
  {
    id: 'T2',
    name: 'Refactor data layer to React Query',
    expectedTier: 'Tier-Mid',
    gstackScores: '3,3,2,4,2',
    prompt: `You are a senior React engineer. Create a concise refactoring plan to migrate a React app's data fetching from raw fetch() calls to React Query v5. Cover: (1) key code changes required, (2) recommended migration order, (3) top 3 risks and how to mitigate them. Keep the total response under 400 words.`,
  },
  {
    id: 'T3',
    name: 'Design SSO + MFA auth architecture',
    expectedTier: 'Tier-A',
    gstackScores: '5,4,5,2,4',
    prompt: `You are a security architect. Design the complete authentication system for a B2B SaaS app that requires SAML SSO and TOTP-based MFA. Cover: (1) technology stack choices with rationale, (2) data model for sessions and MFA state, (3) top 3 security edge cases and mitigations, (4) implementation phases. Be specific and opinionated — avoid vague recommendations.`,
  },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type TaskResult = {
  taskId: string;
  taskName: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
  outputText: string;
};

// ─── Runner ───────────────────────────────────────────────────────────────────
async function runTask(
  task: (typeof TASKS)[number],
  model: { client: OpenAI; id: string },
): Promise<TaskResult> {
  const t0 = Date.now();

  const res = await model.client.chat.completions.create({
    model: model.id,
    max_tokens: 1024,
    messages: [{ role: 'user', content: task.prompt }],
  });

  const usage = res.usage!;
  const price = PRICES[model.id] ?? { input: 0, output: 0 };
  const costUsd =
    (usage.prompt_tokens * price.input + usage.completion_tokens * price.output) / 1_000_000;

  const outputText = res.choices[0]?.message?.content ?? '(no output)';

  return {
    taskId: task.id,
    taskName: task.name,
    model: model.id,
    inputTokens: usage.prompt_tokens,
    outputTokens: usage.completion_tokens,
    totalTokens: usage.prompt_tokens + usage.completion_tokens,
    costUsd,
    latencyMs: Date.now() - t0,
    outputText,
  };
}

// ─── Mode A: All Opus ─────────────────────────────────────────────────────────
async function runModeA(): Promise<TaskResult[]> {
  console.log('\n▶  Mode A — All tasks → Claude Opus (baseline)');
  const results: TaskResult[] = [];
  for (const task of TASKS) {
    process.stdout.write(`   ${task.id} (${task.name})... `);
    const r = await runTask(task, MODELS.opus);
    results.push(r);
    console.log(`✓  ${r.totalTokens} tokens  ${r.latencyMs}ms`);
  }
  return results;
}

// ─── Mode B: Routed ───────────────────────────────────────────────────────────
// T1 (Tier-Exec) → Qwen, T2 (Tier-Mid) → Sonnet, T3 (Tier-A) → Opus
async function runModeB(): Promise<TaskResult[]> {
  console.log('\n▶  Mode B — gstack-plus Routed (Exec→Qwen · Mid→Sonnet · A→Opus)');
  const routeModels = [MODELS.qwen, MODELS.sonnet, MODELS.opus] as const;
  const results: TaskResult[] = [];
  for (let i = 0; i < TASKS.length; i++) {
    const task = TASKS[i];
    const model = routeModels[i];
    const tierLabel = model.id.split('/').pop() ?? model.id;
    process.stdout.write(`   ${task.id} → ${tierLabel}... `);
    const r = await runTask(task, model);
    results.push(r);
    console.log(`✓  ${r.totalTokens} tokens  ${r.latencyMs}ms`);
  }
  return results;
}

// ─── Report ───────────────────────────────────────────────────────────────────
function printReport(modeA: TaskResult[], modeB: TaskResult[]): void {
  const W = 74;
  console.log('\n' + '═'.repeat(W));
  console.log('  RESULTS — gstack-plus Mode A (All-Opus) vs Mode B (Routed)');
  console.log('═'.repeat(W));
  console.log(
    `  ${'Task'.padEnd(34)} ${'Mode A'.padStart(10)} ${'Mode B'.padStart(10)} ${'Saved'.padStart(8)}`
  );
  console.log('  ' + '─'.repeat(W - 2));

  let totalA = 0, totalB = 0, totalCostA = 0, totalCostB = 0;

  for (let i = 0; i < TASKS.length; i++) {
    const a = modeA[i], b = modeB[i];
    const saved = a.totalTokens > 0 ? Math.round((1 - b.totalTokens / a.totalTokens) * 100) : 0;
    const savedStr = (saved > 0 ? `${saved}%` : saved === 0 ? '—' : `+${Math.abs(saved)}%`);
    console.log(
      `  ${a.taskName.padEnd(34)} ${a.totalTokens.toString().padStart(10)} ${b.totalTokens.toString().padStart(10)} ${savedStr.padStart(8)}`
    );
    totalA += a.totalTokens;
    totalB += b.totalTokens;
    totalCostA += a.costUsd;
    totalCostB += b.costUsd;
  }

  const totalSaved = Math.round((1 - totalB / totalA) * 100);
  console.log('  ' + '─'.repeat(W - 2));
  console.log(
    `  ${'TOTAL TOKENS'.padEnd(34)} ${totalA.toString().padStart(10)} ${totalB.toString().padStart(10)} ${(totalSaved + '%').padStart(8)}`
  );
  console.log(
    `  ${'EST. COST (USD)'.padEnd(34)} ${('$' + totalCostA.toFixed(4)).padStart(10)} ${('$' + totalCostB.toFixed(4)).padStart(10)} ${('$' + (totalCostA - totalCostB).toFixed(4) + ' saved').padStart(8)}`
  );
  console.log('═'.repeat(W));

  console.log('\n  Model used per task (Mode B):');
  const routeModels = [MODELS.qwen, MODELS.sonnet, MODELS.opus];
  for (let i = 0; i < TASKS.length; i++) {
    const b = modeB[i];
    const tier = ['Tier-Exec', 'Tier-Mid', 'Tier-A'][i];
    console.log(
      `   ${TASKS[i].id}  ${tier.padEnd(12)}  model: ${b.model.split('/').pop()?.padEnd(22)}  in:${b.inputTokens}  out:${b.outputTokens}  ${b.latencyMs}ms`
    );
  }

  // Save CSV
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const csvPath = `results-${timestamp}.csv`;
  const csvRows = [
    'task_id,task_name,expected_tier,gstack_scores,modeA_model,modeA_in,modeA_out,modeA_total,modeA_cost_usd,modeB_model,modeB_in,modeB_out,modeB_total,modeB_cost_usd,token_saved_pct',
    ...TASKS.map((t, i) => {
      const a = modeA[i], b = modeB[i];
      const pct = Math.round((1 - b.totalTokens / a.totalTokens) * 100);
      return [
        t.id, `"${t.name}"`, t.expectedTier, t.gstackScores,
        a.model, a.inputTokens, a.outputTokens, a.totalTokens, a.costUsd.toFixed(6),
        b.model, b.inputTokens, b.outputTokens, b.totalTokens, b.costUsd.toFixed(6),
        pct,
      ].join(',');
    }),
  ].join('\n');

  fs.writeFileSync(csvPath, csvRows);
  console.log(`\n  ✓ Results saved → ${csvPath}`);

  // Generate quality-review.md for human scoring
  const reviewLines: string[] = [
    '# Quality Review — gstack-plus Mode A vs Mode B',
    '',
    '> **打分說明**：每個任務對兩個模型的輸出分別評分。',
    '> 評分維度：**有用性 1–5**（1=幾乎沒用，5=直接可用）、**正確性 Pass/Fail**。',
    '> 填完後把這個文件回報給 Claude 進行最終分析。',
    '',
    '---',
    '',
  ];

  for (let i = 0; i < TASKS.length; i++) {
    const task = TASKS[i];
    const a = modeA[i];
    const b = modeB[i];

    reviewLines.push(`## ${task.id} — ${task.name}`);
    reviewLines.push('');
    reviewLines.push(`**任務 prompt：**`);
    reviewLines.push('');
    reviewLines.push('```');
    reviewLines.push(task.prompt);
    reviewLines.push('```');
    reviewLines.push('');
    reviewLines.push(`**預期 Tier：** ${task.expectedTier}`);
    reviewLines.push('');
    reviewLines.push('---');
    reviewLines.push('');

    reviewLines.push(`### Mode A — ${a.model} (${a.totalTokens} tokens, $${a.costUsd.toFixed(5)})`);
    reviewLines.push('');
    reviewLines.push(a.outputText);
    reviewLines.push('');
    reviewLines.push('**Mode A 評分（你來填）：**');
    reviewLines.push('- 有用性：__ / 5');
    reviewLines.push('- 正確性：Pass / Fail');
    reviewLines.push('- 備註：');
    reviewLines.push('');
    reviewLines.push('---');
    reviewLines.push('');

    reviewLines.push(`### Mode B — ${b.model} (${b.totalTokens} tokens, $${b.costUsd.toFixed(5)})`);
    reviewLines.push('');
    reviewLines.push(b.outputText);
    reviewLines.push('');
    reviewLines.push('**Mode B 評分（你來填）：**');
    reviewLines.push('- 有用性：__ / 5');
    reviewLines.push('- 正確性：Pass / Fail');
    reviewLines.push('- 備註：');
    reviewLines.push('');
    reviewLines.push('---');
    reviewLines.push('');
  }

  reviewLines.push('## 總結（你來填）');
  reviewLines.push('');
  reviewLines.push('| 任務 | Mode A 有用性 | Mode B 有用性 | 勝者 |');
  reviewLines.push('|------|-------------|-------------|------|');
  for (const task of TASKS) {
    reviewLines.push(`| ${task.id} ${task.name} | __ / 5 | __ / 5 | A / B / 持平 |`);
  }
  reviewLines.push('');

  const reviewPath = 'quality-review.md';
  fs.writeFileSync(reviewPath, reviewLines.join('\n'));
  console.log(`  ✓ Quality review template → ${reviewPath}`);
  console.log('');
  console.log('  下一步：打開 quality-review.md，閱讀每對輸出，填寫評分，回報給 Claude 分析。\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('Error: OPENROUTER_API_KEY env var is not set.');
    process.exit(1);
  }
  if (!process.env.DASHSCOPE_API_KEY) {
    console.error('Error: DASHSCOPE_API_KEY env var is not set.');
    process.exit(1);
  }

  console.log('gstack-plus Experiment: Token Cost — Mode A (All-Opus) vs Mode B (Routed)');
  console.log(`Tasks: ${TASKS.map(t => `${t.id}(${t.expectedTier})`).join(' · ')}`);

  const modeA = await runModeA();
  const modeB = await runModeB();
  printReport(modeA, modeB);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
