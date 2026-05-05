// Exp-3A: Tier-Mid Prompt Optimization
// Tests 4 prompt strategies for Sonnet on the same 3 Mid tasks from Series 2.
// Goal: close the quality gap vs Opus (12.7 → 14+ out of 15)

import OpenAI from 'openai';
import fs from 'node:fs';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});

const SONNET = 'anthropic/claude-sonnet-4-6';
const OPUS   = 'anthropic/claude-opus-4.7';

const PRICES: Record<string, { input: number; output: number }> = {
  [SONNET]: { input: 3.00, output: 15.00 },
  [OPUS]:   { input: 15.00, output: 75.00 },
};

// The same 3 Tier-Mid tasks from Series 2 (user prompts unchanged)
const MID_TASKS = [
  {
    id: 'M1',
    name: 'Code review for no-pagination API',
    userPrompt: `You are a senior engineer reviewing a PR. The PR adds a new UserService.findAll() that loads all users from the database with no pagination or limit. Write a concise code review comment (max 150 words) that explains the performance risk and suggests a specific fix.`,
  },
  {
    id: 'M2',
    name: 'Config migration plan to Zod',
    userPrompt: `Create a brief migration plan (max 300 words) to move a Node.js app's configuration from raw process.env calls to a structured config object validated with Zod. Cover: (1) migration steps, (2) top risks, (3) rollback plan.`,
  },
  {
    id: 'M3',
    name: 'API design review: idempotency + errors',
    userPrompt: `You are reviewing a REST API design for a "create order" endpoint. Write targeted feedback (max 250 words) covering three areas: idempotency, error response structure, and rate limiting. For each area, name one thing to check and one common mistake to avoid.`,
  },
];

// 4 prompt strategies to test (system prompt only changes; user prompt stays the same)
const STRATEGIES: { id: string; name: string; system: string | null }[] = [
  {
    id: 'S0',
    name: 'Baseline (no system prompt)',
    system: null,
  },
  {
    id: 'S1',
    name: 'Role + depth primer',
    system: `You are a staff-level engineer at a fast-growing tech company. You provide thorough, technically precise feedback. You are opinionated — you give specific recommendations, not a list of options. You proactively surface non-obvious risks that junior engineers would miss. Your answers are comprehensive but concise.`,
  },
  {
    id: 'S2',
    name: 'Structured output format',
    system: `Structure every response as:
## Problem
(1-2 sentences: what is wrong and why it matters)

## Root Cause
(1 sentence: the underlying technical issue)

## Recommended Fix
(specific, actionable solution with example if helpful)

## Watch-outs
(1-3 non-obvious risks or edge cases to monitor)

Be specific and direct. Avoid vague language.`,
  },
  {
    id: 'S3',
    name: 'Chain-of-thought + role',
    system: `You are a senior staff engineer. Before answering, silently reason through: (1) what the actual technical risk is, (2) what a junior engineer would miss, (3) what the most actionable fix is. Then provide your final response — concise, specific, and immediately usable.`,
  },
];

// Judge prompt (same as Series 2 Exp-2C methodology)
const JUDGE_SYSTEM = `You are an expert technical evaluator assessing engineering advice quality. Evaluate only content quality — not style or length.`;

const JUDGE_USER = (task: string, resp1: string, resp2: string) => `
## Task
${task}

## Response A
${resp1}

## Response B
${resp2}

Evaluate each on:
- **Correctness** (1-5): Technical accuracy, no errors
- **Completeness** (1-5): Fully addresses all parts of the task
- **Actionability** (1-5): Developer can immediately apply this

Respond with ONLY valid JSON:
{"A":{"correctness":N,"completeness":N,"actionability":N},"B":{"correctness":N,"completeness":N,"actionability":N},"winner":"A"|"B"|"tie","keyDiff":"one sentence"}`;

type Result = {
  taskId: string; taskName: string; strategyId: string; strategyName: string;
  model: string; tokens: number; costUsd: number; latencyMs: number; output: string;
};

async function runOne(
  task: typeof MID_TASKS[0],
  strategy: typeof STRATEGIES[0],
  model: string,
): Promise<Result> {
  const t0 = Date.now();
  const messages: { role: 'system' | 'user'; content: string }[] = [];
  if (strategy.system) messages.push({ role: 'system', content: strategy.system });
  messages.push({ role: 'user', content: task.userPrompt });

  const res = await openrouter.chat.completions.create({
    model, max_tokens: 1500, messages,
  });
  const latencyMs = Date.now() - t0;
  const u = res.usage!;
  const pricing = PRICES[model];
  const costUsd = (u.prompt_tokens * pricing.input + u.completion_tokens * pricing.output) / 1_000_000;
  return {
    taskId: task.id, taskName: task.name, strategyId: strategy.id, strategyName: strategy.name,
    model, tokens: u.total_tokens, costUsd, latencyMs, output: res.choices[0].message.content ?? '',
  };
}

async function judge(task: string, outputA: string, outputB: string, retries = 3): Promise<{
  scoreA: {correctness:number; completeness:number; actionability:number};
  scoreB: {correctness:number; completeness:number; actionability:number};
  winner: string; keyDiff: string; tokens: number; costUsd: number;
}> {
  const flip = Math.random() > 0.5;
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3.5-haiku',
      max_tokens: 300,
      messages: [
        { role: 'system', content: JUDGE_SYSTEM },
        { role: 'user', content: JUDGE_USER(task, flip ? outputB : outputA, flip ? outputA : outputB) },
      ],
    });
    const raw = (res.choices[0].message.content ?? '{}').trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    try {
      const j = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
      const sA = flip ? j.B : j.A;
      const sB = flip ? j.A : j.B;
      const winner = j.winner === 'tie' ? 'tie' : flip ? (j.winner === 'A' ? 'B' : 'A') : j.winner;
      const u = res.usage!;
      return { scoreA: sA, scoreB: sB, winner, keyDiff: j.keyDiff ?? '',
        tokens: u.total_tokens, costUsd: (u.total_tokens * 0.80) / 1_000_000 };
    } catch {
      if (attempt === retries - 1) throw new Error(`Judge failed after ${retries} retries: ${raw.slice(0, 100)}`);
    }
  }
  throw new Error('unreachable');
}

async function main() {
  if (!process.env.OPENROUTER_API_KEY) { console.error('OPENROUTER_API_KEY required'); process.exit(1); }

  console.log('\ngstack-plus Exp-3A: Tier-Mid Prompt Optimization\n');
  console.log('Testing 4 Sonnet strategies + Opus baseline across 3 Mid tasks\n');

  // Step 1: Run Opus baseline
  const opusResults: Result[] = [];
  for (const task of MID_TASKS) {
    process.stdout.write(`  Opus baseline ${task.id}...`);
    const r = await runOne(task, { id: 'OPUS', name: 'Opus baseline', system: null }, OPUS);
    opusResults.push(r);
    console.log(` ${r.tokens}t $${r.costUsd.toFixed(5)} ${r.latencyMs}ms`);
  }

  // Step 2: Run 4 Sonnet strategies
  const sonnetResults: Record<string, Result[]> = {};
  for (const strategy of STRATEGIES) {
    sonnetResults[strategy.id] = [];
    for (const task of MID_TASKS) {
      process.stdout.write(`  Sonnet ${strategy.id} ${task.id}...`);
      const r = await runOne(task, strategy, SONNET);
      sonnetResults[strategy.id].push(r);
      console.log(` ${r.tokens}t $${r.costUsd.toFixed(5)} ${r.latencyMs}ms`);
    }
  }

  // Step 3: Judge each Sonnet strategy vs Opus
  console.log('\n  Running LLM-as-Judge evaluations...\n');
  const judgeResults: Record<string, { taskId: string; totalSonnet: number; totalOpus: number; winner: string; diff: string }[]> = {};
  for (const strategy of STRATEGIES) {
    judgeResults[strategy.id] = [];
    for (let i = 0; i < MID_TASKS.length; i++) {
      const task = MID_TASKS[i];
      process.stdout.write(`  Judge ${strategy.id} vs OPUS for ${task.id}...`);
      const j = await judge(task.userPrompt, sonnetResults[strategy.id][i].output, opusResults[i].output);
      const tS = j.scoreA.correctness + j.scoreA.completeness + j.scoreA.actionability;
      const tO = j.scoreB.correctness + j.scoreB.completeness + j.scoreB.actionability;
      judgeResults[strategy.id].push({ taskId: task.id, totalSonnet: tS, totalOpus: tO, winner: j.winner, diff: j.keyDiff });
      console.log(` Sonnet ${tS}/15 vs Opus ${tO}/15 → ${j.winner} wins`);
    }
  }

  // Step 4: Print summary
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('  EXP-3A RESULTS: Which Sonnet Strategy Best Approaches Opus?');
  console.log('══════════════════════════════════════════════════════════════════');
  console.log(`  ${'Strategy'.padEnd(32)} ${'Avg Sonnet'.padEnd(12)} ${'Avg Opus'.padEnd(12)} ${'Gap'.padEnd(8)} ${'Cost'}`);
  console.log(`  ${'─'.repeat(70)}`);
  for (const strategy of STRATEGIES) {
    const results = judgeResults[strategy.id];
    const avgS = (results.reduce((s, r) => s + r.totalSonnet, 0) / results.length).toFixed(1);
    const avgO = (results.reduce((s, r) => s + r.totalOpus, 0) / results.length).toFixed(1);
    const gap  = (parseFloat(avgS) - parseFloat(avgO)).toFixed(1);
    const costPerTask = sonnetResults[strategy.id].reduce((s, r) => s + r.costUsd, 0) / MID_TASKS.length;
    console.log(`  ${strategy.name.padEnd(32)} ${(avgS+'/15').padEnd(12)} ${(avgO+'/15').padEnd(12)} ${(gap>='0'?'+':'')+gap} pts   $${costPerTask.toFixed(5)}/task`);
  }
  console.log('══════════════════════════════════════════════════════════════════\n');

  // Step 5: Save detailed results
  const output = { opusResults, sonnetResults, judgeResults, strategies: STRATEGIES, tasks: MID_TASKS };
  fs.writeFileSync('exp3a-results.json', JSON.stringify(output, null, 2));
  console.log('  exp3a-results.json saved.\n');
}

main().catch(err => { console.error(err); process.exit(1); });
