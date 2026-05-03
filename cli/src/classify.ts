import prompts from 'prompts';
import chalk from 'chalk';
import { DIMENSIONS, type Scoring } from './types.js';

export async function interactiveScore(taskDescription: string): Promise<Scoring> {
  console.log('');
  console.log(chalk.bold('Task: ') + taskDescription);
  console.log(chalk.dim('\u{2500}'.repeat(48)));
  console.log(chalk.dim('給每個維度打 1\u20135 分。輸入後 Enter 進入下一題。'));
  console.log('');

  const answers: Partial<Scoring> = {};
  for (const dim of DIMENSIONS) {
    const res = await prompts({
      type: 'number',
      name: 'score',
      message: chalk.bold(dim.label) + chalk.dim(` \u2014 ${dim.hint}`),
      min: 1, max: 5,
      validate: (v: number) => (v >= 1 && v <= 5) ? true : '請輸入 1\u20135',
    }, { onCancel: () => process.exit(1) });
    answers[dim.key] = res.score as 1|2|3|4|5;
  }
  return answers as Scoring;
}
