import prompts from 'prompts';
import chalk from 'chalk';
import { DIMENSIONS, type Scoring, type Lang } from './types.js';

const HEADER = {
  zh: { taskLabel: 'Task: ', divider: '────────────────────────────────────────────────', hint: '給每個維度打 1–5 分。輸入後 Enter 進入下一題。' },
  en: { taskLabel: 'Task: ', divider: '────────────────────────────────────────────────', hint: 'Score each dimension 1–5. Press Enter to continue.' },
};

export async function interactiveScore(taskDescription: string, lang: Lang = 'zh'): Promise<Scoring> {
  const h = HEADER[lang];
  console.log('');
  console.log(chalk.bold(h.taskLabel) + taskDescription);
  console.log(chalk.dim(h.divider));
  console.log(chalk.dim(h.hint));
  console.log('');

  const answers: Partial<Scoring> = {};
  for (const dim of DIMENSIONS) {
    const res = await prompts({
      type: 'number',
      name: 'score',
      message: chalk.bold(dim.label[lang]) + chalk.dim(` — ${dim.hint[lang]}`),
      min: 1, max: 5,
      validate: (v: number) => (v >= 1 && v <= 5) ? true : (lang === 'zh' ? '請輸入 1–5' : 'Enter 1–5'),
    }, { onCancel: () => process.exit(1) });
    answers[dim.key] = res.score as 1|2|3|4|5;
  }
  return answers as Scoring;
}
