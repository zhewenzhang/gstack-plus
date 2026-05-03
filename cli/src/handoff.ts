import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { RoutingDecision, Scoring } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateHandoff(opts: {
  task: string;
  scoring: Scoring;
  decision: RoutingDecision;
  outDir: string;
}): Promise<string> {
  const tplPath = path.join(__dirname, '..', 'templates', 'handoff.md');
  const tpl = await readFile(tplPath, 'utf-8');

  const ts = new Date().toISOString();
  const title = opts.task.length > 60 ? opts.task.slice(0, 60) + '\u2026' : opts.task;
  const slug = ts.slice(0, 10) + '-' + Math.random().toString(36).slice(2, 6);

  const filled = tpl
    .replaceAll('{{TASK_TITLE}}', title)
    .replaceAll('{{TASK_DESCRIPTION}}', opts.task)
    .replaceAll('{{TIMESTAMP}}', ts)
    .replaceAll('{{TIER}}', opts.decision.tier)
    .replaceAll('{{REASON}}', opts.decision.reason)
    .replaceAll('{{JUDGMENT}}', String(opts.scoring.judgment))
    .replaceAll('{{CONTEXT}}', String(opts.scoring.context))
    .replaceAll('{{RISK}}', String(opts.scoring.risk))
    .replaceAll('{{VERIFIABILITY}}', String(opts.scoring.verifiability))
    .replaceAll('{{CREATIVITY}}', String(opts.scoring.creativity));

  await mkdir(opts.outDir, { recursive: true });
  const outPath = path.join(opts.outDir, `handoff-${slug}.md`);
  await writeFile(outPath, filled, 'utf-8');
  return outPath;
}
