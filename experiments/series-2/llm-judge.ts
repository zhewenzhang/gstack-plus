// LLM-as-Judge Quality Evaluation — Series 2 Experiment C
// Uses Claude Haiku to blind-evaluate Mode A vs Mode B outputs on 3 dimensions.
// Random assignment of A/B to "Response 1"/"Response 2" prevents position bias.

import OpenAI from 'openai';
import fs from 'node:fs';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});

const JUDGE_MODEL = 'anthropic/claude-3.5-haiku';

const JUDGE_PROMPT = (task: string, resp1: string, resp2: string) => `You are an expert technical evaluator. Evaluate two responses to the same task. Do NOT consider which model or service produced each response — evaluate ONLY the content quality.

## Task
${task}

## Response 1
${resp1}

## Response 2
${resp2}

## Evaluation Criteria (1–5 scale)
- **Correctness**: Is the technical content accurate and free of errors?
- **Completeness**: Does it fully address all parts of the task?
- **Actionability**: Can a developer immediately use or implement this output?

Respond with ONLY valid JSON, no markdown, no explanation:
{"response1":{"correctness":N,"completeness":N,"actionability":N},"response2":{"correctness":N,"completeness":N,"actionability":N},"winner":"response1"|"response2"|"tie","confidence":"high"|"medium"|"low","key_difference":"one sentence explaining the main quality difference"}`;

async function judgeTask(taskId: string, taskName: string, prompt: string, outputA: string, outputB: string) {
  const flip = Math.random() > 0.5;
  const resp1 = flip ? outputB : outputA;
  const resp2 = flip ? outputA : outputB;

  const res = await openrouter.chat.completions.create({
    model: JUDGE_MODEL,
    max_tokens: 300,
    messages: [{ role: 'user', content: JUDGE_PROMPT(prompt, resp1, resp2) }],
  });

  const raw = res.choices[0].message.content ?? '{}';
  const judgment = JSON.parse(raw);

  const scoreA = flip ? judgment.response2 : judgment.response1;
  const scoreB = flip ? judgment.response1 : judgment.response2;
  const rawWinner = judgment.winner;
  const winner = rawWinner === 'tie' ? 'tie' : flip ? (rawWinner === 'response1' ? 'B' : 'A') : (rawWinner === 'response1' ? 'A' : 'B');

  const tokensUsed = res.usage?.total_tokens ?? 0;
  const costUsd = (tokensUsed * 0.80) / 1_000_000;

  return { taskId, taskName, scoreA, scoreB, winner, confidence: judgment.confidence, keyDiff: judgment.key_difference, tokensUsed, costUsd };
}

async function main() {
  if (!process.env.OPENROUTER_API_KEY) { console.error('OPENROUTER_API_KEY required'); process.exit(1); }
  if (!fs.existsSync('benchmark-outputs.json')) { console.error('Run benchmark.ts first'); process.exit(1); }

  const data = JSON.parse(fs.readFileSync('benchmark-outputs.json', 'utf-8'));
  const results = [];

  console.log('\ngstack-plus Series 2C: LLM-as-Judge Quality Evaluation\n');
  console.log('  Judge model:', JUDGE_MODEL);
  console.log('  Position bias mitigation: random assignment of A/B to Response 1/2\n');

  let totalCost = 0;
  for (const task of data.tasks) {
    const outputs = data.outputs[task.id];
    process.stdout.write(`  Judging ${task.id} (${task.name})...`);
    const result = await judgeTask(task.id, task.name, task.prompt, outputs.a, outputs.b);
    results.push({ ...result, tier: outputs.tier });
    totalCost += result.costUsd;
    console.log(` Mode ${result.winner} wins (${result.confidence})`);
  }

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('  SERIES 2C: QUALITY COMPARISON (LLM-as-Judge, blind evaluation)');
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log(`  ${'Task'.padEnd(28)} ${'Tier'.padEnd(11)} ${'A Score'.padEnd(10)} ${'B Score'.padEnd(10)} ${'Winner'}`);
  console.log(`  ${'─'.repeat(70)}`);

  for (const r of results) {
    const aTotal = r.scoreA.correctness + r.scoreA.completeness + r.scoreA.actionability;
    const bTotal = r.scoreB.correctness + r.scoreB.completeness + r.scoreB.actionability;
    console.log(`  ${r.taskName.slice(0, 27).padEnd(28)} ${r.tier.padEnd(11)} ${String(aTotal+'/15').padEnd(10)} ${String(bTotal+'/15').padEnd(10)} Mode ${r.winner}`);
  }

  const avgA = results.reduce((s, r) => s + r.scoreA.correctness + r.scoreA.completeness + r.scoreA.actionability, 0) / results.length;
  const avgB = results.reduce((s, r) => s + r.scoreB.correctness + r.scoreB.completeness + r.scoreB.actionability, 0) / results.length;
  const winsA = results.filter(r => r.winner === 'A').length;
  const winsB = results.filter(r => r.winner === 'B').length;
  const ties  = results.filter(r => r.winner === 'tie').length;

  console.log(`  ${'─'.repeat(70)}`);
  console.log(`  AVERAGE QUALITY SCORE: Mode A ${avgA.toFixed(1)}/15 · Mode B ${avgB.toFixed(1)}/15`);
  console.log(`  WINS: Mode A ${winsA} · Mode B ${winsB} · Ties ${ties}`);
  console.log(`  Total judge cost: $${totalCost.toFixed(4)}`);
  console.log('══════════════════════════════════════════════════════════════════════');

  console.log('\n  KEY QUALITY DIFFERENCES (per task):');
  for (const r of results) {
    console.log(`  ${r.taskId}: ${r.keyDiff}`);
  }
  console.log('');

  fs.writeFileSync('judge-results.json', JSON.stringify(results, null, 2));
  console.log('  judge-results.json saved.\n');
}

main().catch(err => { console.error(err); process.exit(1); });
