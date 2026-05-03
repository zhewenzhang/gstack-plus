import type { Scoring } from './types.js';

export async function autoScore(task: string, apiKey?: string): Promise<Scoring> {
  const key = apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set.\n' +
      'Set the env var: ANTHROPIC_API_KEY=sk-... gstack-plus classify "task" --auto\n' +
      'Or pass directly:  gstack-plus classify "task" --auto --api-key sk-...\n' +
      'Without --auto, use interactive mode or --scores flag instead.'
    );
  }

  let Anthropic: typeof import('@anthropic-ai/sdk').default;
  try {
    const mod = await import('@anthropic-ai/sdk');
    Anthropic = mod.default;
  } catch {
    throw new Error(
      '@anthropic-ai/sdk is not installed. To use --auto mode, run:\n' +
      '  npm install @anthropic-ai/sdk\n' +
      'Or use --scores 4,3,4,2,2 instead of --auto.'
    );
  }

  const SYSTEM = `You are a task classifier for the gstack-plus multi-tier AI orchestration framework.
Score the given task on 5 dimensions, each from 1 to 5.

DIMENSIONS:
1. judgment: How much human-level judgment is required? 1=mechanical, 5=architectural decision
2. context: How much codebase context must be read? 1=single file, 5=cross-module understanding
3. risk: Cost of getting it wrong? 1=local scratch, 5=data loss/security/production incident
4. verifiability: Can success be auto-verified? 1=purely subjective, 5=tests/lint/build passes
5. creativity: How much novel design is required? 1=follow template, 5=design from scratch

Respond ONLY with valid JSON, no prose, no code fences:
{"judgment":N,"context":N,"risk":N,"verifiability":N,"creativity":N}`;

  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Task: ${task}` }],
  });

  const raw = (msg.content[0] as { type: string; text: string }).text.trim();
  let parsed: Record<string, number>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Claude returned unexpected format: ${raw}`);
  }

  const keys: (keyof Scoring)[] = ['judgment', 'context', 'risk', 'verifiability', 'creativity'];
  for (const k of keys) {
    const v = parsed[k];
    if (typeof v !== 'number' || v < 1 || v > 5) {
      throw new Error(`Invalid score for ${k}: ${v}`);
    }
  }

  return {
    judgment:     parsed.judgment     as 1|2|3|4|5,
    context:      parsed.context      as 1|2|3|4|5,
    risk:         parsed.risk         as 1|2|3|4|5,
    verifiability:parsed.verifiability as 1|2|3|4|5,
    creativity:   parsed.creativity   as 1|2|3|4|5,
  };
}
