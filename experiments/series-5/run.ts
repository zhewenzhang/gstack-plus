import { TASKS } from './tasks.ts';
import { JUDGE_SYSTEM_PROMPT, judgePrompt } from './rubric.ts';
import { writeFileSync } from 'fs';

// ── API Clients ──────────────────────────────────────────────────────────────
import OpenAI from 'openai';

const anthropic = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});

const MODELS = [
  { id: 'anthropic/claude-3.5-haiku',         label: 'Haiku 3.5'  },
  { id: 'anthropic/claude-sonnet-4-6',          label: 'Sonnet 4.6' },
  { id: 'anthropic/claude-opus-4-7',            label: 'Opus 4.7' },
] as const;

const JUDGE_MODEL = 'anthropic/claude-opus-4-7';

const SYSTEM_PROMPT_BASE = `You are a staff-level software engineer. Answer the technical task concisely and precisely. Focus on the most important decisions and trade-offs. Surface non-obvious risks.`;

interface ScoreResult {
  correctness: number;
  completeness: number;
  clarity: number;
  risk_awareness: number;
  practical_value: number;
  total: number;
  one_line_verdict: string;
}

interface RunResult {
  taskId: string;
  tier: string;
  model: string;
  modelLabel: string;
  response: string;
  scores: ScoreResult;
  latencyMs: number;
}

async function getResponse(model: string, prompt: string): Promise<{ text: string; latencyMs: number }> {
  const start = Date.now();
  const msg = await anthropic.chat.completions.create({
    model,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_BASE },
      { role: 'user', content: prompt },
    ],
  }) as any;
  const latencyMs = Date.now() - start;
  const text = msg.choices?.[0]?.message?.content ?? '';
  return { text, latencyMs };
}

async function judgeResponse(task: string, response: string): Promise<ScoreResult> {
  const msg = await anthropic.chat.completions.create({
    model: JUDGE_MODEL,
    max_tokens: 512,
    messages: [
      { role: 'system', content: JUDGE_SYSTEM_PROMPT },
      { role: 'user', content: judgePrompt(task, response) },
    ],
  }) as any;
  const text = msg.choices?.[0]?.message?.content ?? '{}';
  // Strip markdown code fences if present
  const clean = text.replace(/^```(?:json)?\n?([\s\S]*?)\n?```$/m, '$1').trim();
  try {
    return JSON.parse(clean) as ScoreResult;
  } catch {
    console.error('Failed to parse judge response:', clean);
    return { correctness: 0, completeness: 0, clarity: 0, risk_awareness: 0, practical_value: 0, total: 0, one_line_verdict: 'Parse error' };
  }
}

async function main() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('Error: OPENROUTER_API_KEY env var is not set.');
    process.exit(1);
  }

  const allResults: RunResult[] = [];

  for (const task of TASKS) {
    console.log(`\n▶ Task: ${task.id} (${task.tier})`);

    for (const model of MODELS) {
      console.log(`  Model: ${model.label}`);

      const { text: response, latencyMs } = await getResponse(model.id, task.prompt);
      console.log(`  Response received (${latencyMs}ms, ${response.length} chars)`);

      const scores = await judgeResponse(task.prompt, response);
      console.log(`  Scores: ${scores.total}/15 — ${scores.one_line_verdict}`);

      allResults.push({
        taskId: task.id,
        tier: task.tier,
        model: model.id,
        modelLabel: model.label,
        response,
        scores,
        latencyMs,
      });

      // Rate limit avoidance
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Write results
  writeFileSync(
    'experiments/series-5/results.json',
    JSON.stringify(allResults, null, 2)
  );

  // Print summary matrix
  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('  Series 5：多模型品質矩陣');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n品質分數（/15）：');
  console.log('');
  console.log('任務 ID        | Haiku 4.5 | Sonnet 4.6 | Opus 4.7');
  console.log('---------------|-----------|------------|----------');

  for (const task of TASKS) {
    const scores = MODELS.map(m => {
      const r = allResults.find(r => r.taskId === task.id && r.model === m.id);
      return r ? r.scores.total.toString().padStart(4) : '  —';
    });
    const tierShort = task.tier.replace('Tier-', '').padEnd(4);
    console.log(`${task.id} (${tierShort})   |${scores[0].padStart(10)} |${scores[1].padStart(11)} |${scores[2].padStart(9)}`);
  }

  // Latency summary
  console.log('\n響應延遲（ms）：');
  for (const task of TASKS) {
    const latencies = MODELS.map(m => {
      const r = allResults.find(r => r.taskId === task.id && r.model === m.id);
      return r ? `${r.latencyMs}ms` : '—';
    });
    const tierShort = task.tier.replace('Tier-', '').padEnd(4);
    console.log(`${task.id} (${tierShort})   | ${latencies[0].padEnd(8)} | ${latencies[1].padEnd(9)} | ${latencies[2].padEnd(7)}`);
  }

  console.log('\n結果已寫入 experiments/series-5/results.json');
}

main().catch(console.error);
