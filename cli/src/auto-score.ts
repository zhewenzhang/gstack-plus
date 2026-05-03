import Anthropic from '@anthropic-ai/sdk';
import type { Scoring } from './types.js';

const SYSTEM = `You are a task classifier for the gstack-plus multi-tier AI orchestration framework.
Score the given task on 5 dimensions, each from 1 to 5.

DIMENSIONS:
1. judgment (判斷強度): How much "human-level judgment" is required?
   1=mechanical/rule-following, 5=architectural decision with major trade-offs
2. context (上下文寬度): How much codebase context must be read?
   1=single file, 5=cross-module system understanding required
3. risk (風險權重): Cost of getting it wrong?
   1=local scratch, 5=data loss / security / production incident
4. verifiability (可驗證性): Can success be auto-verified?
   1=purely subjective judgment, 5=passes tests/lint/build with exit code 0
5. creativity (創意密度): How much novel design is required?
   1=follow a template, 5=design from scratch with no reference

Respond ONLY with a JSON object, no prose:
{"judgment":N,"context":N,"risk":N,"verifiability":N,"creativity":N}
`;

export async function autoScore(task: string, apiKey?: string): Promise<Scoring> {
  const key = apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Either set the env var or pass --api-key.\n' +
      'Without --auto, use the interactive mode or --scores flag instead.'
    );
  }

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
    judgment: parsed.judgment as 1|2|3|4|5,
    context: parsed.context as 1|2|3|4|5,
    risk: parsed.risk as 1|2|3|4|5,
    verifiability: parsed.verifiability as 1|2|3|4|5,
    creativity: parsed.creativity as 1|2|3|4|5,
  };
}
