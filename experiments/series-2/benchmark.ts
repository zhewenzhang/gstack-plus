// Extended Cost Benchmark — Series 2 Experiment B
// 9 tasks × 2 modes = 18 API calls. All-Opus vs Routed.

import OpenAI from 'openai';
import fs from 'node:fs';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});
const dashscope = new OpenAI({
  baseURL: 'https://coding.dashscope.aliyuncs.com/v1',
  apiKey: process.env.DASHSCOPE_API_KEY ?? '',
});

const MODELS = {
  opus:   { client: openrouter, id: 'anthropic/claude-opus-4.7' },
  sonnet: { client: openrouter, id: 'anthropic/claude-sonnet-4-6' },
  haiku:  { client: openrouter, id: 'anthropic/claude-haiku-4-5-20251001' },
  qwen:   { client: dashscope,  id: 'qwen3-coder-plus' },
} as const;

const PRICES: Record<string, { input: number; output: number }> = {
  'anthropic/claude-opus-4.7':          { input: 15.00, output: 75.00 },
  'anthropic/claude-sonnet-4-6':         { input:  3.00, output: 15.00 },
  'anthropic/claude-haiku-4-5-20251001': { input:  0.80, output:  4.00 },
  'qwen3-coder-plus':                    { input:  0.50, output:  2.00 },
};

const TASKS = [
  // ── Tier-Exec tasks ────────────────────────────────────────────────────────
  {
    id: 'E1', name: 'Add Husky pre-commit hook', tier: 'Tier-Exec',
    scores: '1,1,1,5,1',
    routedModel: 'qwen' as const,
    prompt: `You are a senior engineer. Give me the exact terminal commands (in sequence) to add a Husky v9 pre-commit hook that runs ESLint only on staged TypeScript files, using lint-staged. Show only the commands, no explanation.`,
  },
  {
    id: 'E2', name: 'Count lines in TypeScript files', tier: 'Tier-Exec',
    scores: '1,1,1,5,1',
    routedModel: 'qwen' as const,
    prompt: `Show me a bash one-liner that counts the total number of lines across all .ts files inside a ./src directory. Output only the command.`,
  },
  {
    id: 'E3', name: 'Create .prettierrc config', tier: 'Tier-Exec',
    scores: '1,1,1,5,1',
    routedModel: 'qwen' as const,
    prompt: `Show me the exact .prettierrc JSON content for these settings: singleQuote: true, tabWidth: 2, semi: false, printWidth: 100, trailingComma: "es5". Output only the JSON.`,
  },
  // ── Tier-Mid tasks ─────────────────────────────────────────────────────────
  {
    id: 'M1', name: 'Code review for no-pagination API', tier: 'Tier-Mid',
    scores: '3,3,3,3,1',
    routedModel: 'sonnet' as const,
    prompt: `You are a senior engineer reviewing a PR. The PR adds a new UserService.findAll() that loads all users from the database with no pagination or limit. Write a concise code review comment (max 150 words) that explains the performance risk and suggests a specific fix.`,
  },
  {
    id: 'M2', name: 'Config migration plan to Zod', tier: 'Tier-Mid',
    scores: '3,3,2,4,2',
    routedModel: 'sonnet' as const,
    prompt: `Create a brief migration plan (max 300 words) to move a Node.js app's configuration from raw process.env calls to a structured config object validated with Zod. Cover: (1) migration steps, (2) top risks, (3) rollback plan.`,
  },
  {
    id: 'M3', name: 'API design review: idempotency + errors', tier: 'Tier-Mid',
    scores: '3,3,3,3,1',
    routedModel: 'sonnet' as const,
    prompt: `You are reviewing a REST API design for a "create order" endpoint. Write targeted feedback (max 250 words) covering three areas: idempotency, error response structure, and rate limiting. For each area, name one thing to check and one common mistake to avoid.`,
  },
  // ── Tier-A tasks ───────────────────────────────────────────────────────────
  {
    id: 'A1', name: 'Database sharding strategy', tier: 'Tier-A',
    scores: '5,4,4,2,4',
    routedModel: 'opus' as const,
    prompt: `You are a principal engineer. Design a database sharding strategy for a multi-tenant SaaS app with 10M users that must shard by tenant_id. Be specific about: (1) shard key choice and rationale, (2) hot-spot tenant mitigation, (3) how to handle cross-shard queries, (4) migration path from a single Postgres database. Give opinionated recommendations, not a list of options.`,
  },
  {
    id: 'A2', name: 'Feature flag system design', tier: 'Tier-A',
    scores: '4,3,3,2,4',
    routedModel: 'opus' as const,
    prompt: `Design a feature flag system for a high-traffic web app (50k req/s). Cover: (1) data model for flags and targeting rules, (2) evaluation logic for user-% rollouts, beta groups, and A/B experiments, (3) kill switch mechanism, (4) client SDK design tradeoffs. Be opinionated about architecture choices.`,
  },
  {
    id: 'A3', name: 'JWT auth security review', tier: 'Tier-A',
    scores: '4,4,5,3,2',
    routedModel: 'opus' as const,
    prompt: `You are performing a security architecture review. A team's JWT auth setup: access tokens expire in 7 days, stored in localStorage; refresh tokens in httpOnly cookies, no rotation. Identify the security vulnerabilities, explain the attack vectors for each, and give specific remediation steps with implementation detail. Be technically precise.`,
  },
] as const;

type TaskResult = {
  taskId: string; taskName: string; tier: string; model: string;
  inputTokens: number; outputTokens: number; totalTokens: number;
  costUsd: number; latencyMs: number; outputText: string;
};

async function runTask(
  task: (typeof TASKS)[number],
  model: { client: OpenAI; id: string },
): Promise<TaskResult> {
  const t0 = Date.now();
  const res = await model.client.chat.completions.create({
    model: model.id, max_tokens: 1500,
    messages: [{ role: 'user', content: task.prompt }],
  });
  const latencyMs = Date.now() - t0;
  const usage = res.usage!;
  const pricing = PRICES[model.id];
  const costUsd = (usage.prompt_tokens * pricing.input + usage.completion_tokens * pricing.output) / 1_000_000;
  return {
    taskId: task.id, taskName: task.name, tier: task.tier, model: model.id,
    inputTokens: usage.prompt_tokens, outputTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens, costUsd, latencyMs,
    outputText: res.choices[0].message.content ?? '',
  };
}

async function main() {
  if (!process.env.OPENROUTER_API_KEY || !process.env.DASHSCOPE_API_KEY) {
    console.error('Error: OPENROUTER_API_KEY and DASHSCOPE_API_KEY must be set.'); process.exit(1);
  }

  console.log('\ngstack-plus Series 2B: Extended Cost Benchmark (9 tasks × 2 modes)\n');

  const modeA: TaskResult[] = [];
  const modeB: TaskResult[] = [];

  for (const task of TASKS) {
    process.stdout.write(`  Running ${task.id} Mode A (Opus)...`);
    const a = await runTask(task, MODELS.opus);
    modeA.push(a);
    console.log(` ${a.totalTokens} tokens, $${a.costUsd.toFixed(5)}, ${a.latencyMs}ms`);

    process.stdout.write(`  Running ${task.id} Mode B (${task.routedModel})...`);
    const b = await runTask(task, MODELS[task.routedModel]);
    modeB.push(b);
    console.log(` ${b.totalTokens} tokens, $${b.costUsd.toFixed(5)}, ${b.latencyMs}ms`);
  }

  // ─── Save outputs for judge evaluation ────────────────────────────────────
  const outputs: Record<string, { a: string; b: string; tier: string }> = {};
  for (let i = 0; i < TASKS.length; i++) {
    outputs[TASKS[i].id] = { a: modeA[i].outputText, b: modeB[i].outputText, tier: TASKS[i].tier };
  }
  fs.writeFileSync('benchmark-outputs.json', JSON.stringify({ tasks: TASKS, modeA, modeB, outputs }, null, 2));

  // ─── Print report ──────────────────────────────────────────────────────────
  const totalA = { tokens: modeA.reduce((s, r) => s + r.totalTokens, 0), cost: modeA.reduce((s, r) => s + r.costUsd, 0) };
  const totalB = { tokens: modeB.reduce((s, r) => s + r.totalTokens, 0), cost: modeB.reduce((s, r) => s + r.costUsd, 0) };

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('  SERIES 2B RESULTS — All-Opus vs Routed (9 tasks)');
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log(`  ${'Task'.padEnd(30)} ${'Tier'.padEnd(11)} ${'A tokens'.padEnd(10)} ${'B tokens'.padEnd(10)} ${'A cost'.padEnd(9)} ${'B cost'.padEnd(9)} ${'Cost Δ'}`);
  console.log(`  ${'─'.repeat(90)}`);
  for (let i = 0; i < TASKS.length; i++) {
    const a = modeA[i]; const b = modeB[i];
    const deltaStr = a.costUsd === 0 ? '—' : `${Math.round((1 - b.costUsd / a.costUsd) * 100)}%`;
    console.log(`  ${(TASKS[i].name).padEnd(30)} ${TASKS[i].tier.padEnd(11)} ${String(a.totalTokens).padEnd(10)} ${String(b.totalTokens).padEnd(10)} $${a.costUsd.toFixed(5).padEnd(8)} $${b.costUsd.toFixed(5).padEnd(8)} ${deltaStr}`);
  }
  console.log(`  ${'─'.repeat(90)}`);
  const costSaving = Math.round((1 - totalB.cost / totalA.cost) * 100);
  console.log(`  ${'TOTAL'.padEnd(41)} ${String(totalA.tokens).padEnd(10)} ${String(totalB.tokens).padEnd(10)} $${totalA.cost.toFixed(5).padEnd(8)} $${totalB.cost.toFixed(5).padEnd(8)} ${costSaving}%`);
  console.log('══════════════════════════════════════════════════════════════════════\n');
  console.log('  benchmark-outputs.json saved. Run llm-judge.ts next.\n');
}

main().catch(err => { console.error(err); process.exit(1); });
