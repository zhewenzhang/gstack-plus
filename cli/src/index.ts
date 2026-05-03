#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { interactiveScore } from './classify.js';
import { route } from './route.js';
import { generateHandoff } from './handoff.js';
import type { Scoring } from './types.js';

const program = new Command();

program
  .name('gstack-plus')
  .description('Multi-tier model orchestration CLI')
  .version('0.1.0');

program
  .command('classify <task>')
  .description('Classify a task across 5 dimensions and route to the right Tier')
  .option('-o, --out <dir>', 'Output directory for handoff doc', './handoffs')
  .option('--scores <csv>', 'Skip prompts; provide scores as judgment,context,risk,verifiability,creativity (1-5 each)')
  .action(async (task: string, opts: { out: string; scores?: string }) => {
    let scoring: Scoring;

    if (opts.scores) {
      const parts = opts.scores.split(',').map(n => parseInt(n.trim(), 10));
      if (parts.length !== 5 || parts.some(n => isNaN(n) || n < 1 || n > 5)) {
        console.error(chalk.red('--scores 需要 5 個 1\u20135 的數字，逗號分隔。例: --scores 4,3,4,2,2'));
        process.exit(1);
      }
      scoring = {
        judgment: parts[0] as 1|2|3|4|5,
        context: parts[1] as 1|2|3|4|5,
        risk: parts[2] as 1|2|3|4|5,
        verifiability: parts[3] as 1|2|3|4|5,
        creativity: parts[4] as 1|2|3|4|5,
      };
    } else {
      scoring = await interactiveScore(task);
    }

    const decision = route(scoring);

    console.log('');
    console.log(chalk.dim('\u{2500}'.repeat(48)));
    const color = decision.tier === 'Tier-A' ? chalk.bold.magenta
                : decision.tier === 'Tier-Mid' ? chalk.bold.cyan
                : chalk.bold.green;
    console.log(`Routing decision: ${color(decision.tier)}`);
    console.log(chalk.dim('Reason: ') + decision.reason);
    console.log('');

    const outPath = await generateHandoff({ task, scoring, decision, outDir: opts.out });
    console.log(chalk.green('\u2713 ') + 'Handoff doc written \u2192 ' + chalk.underline(outPath));
    console.log('');
    console.log(chalk.dim('Next: open the handoff doc, fill in Scope Lock + \u5b8c\u6210\u6a19\u6e96, send to your ' + decision.tier + ' model.'));
  });

program
  .command('rules')
  .description('Print the routing rules in plain text')
  .action(() => {
    console.log(`
gstack-plus routing rules
\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}
  Judgment \u2265 4  OR  Risk \u2265 4  OR  Creativity \u2265 4         \u2192 Tier-A
  Judgment \u2264 2  AND  Context \u2264 2  AND  Verifiability \u2265 4 \u2192 Tier-Exec
  else                                                    \u2192 Tier-Mid

Conservative routing: when in doubt, route up.
Full spec: classifier/routing-rules.md
`);
  });

program.parseAsync().catch(err => { console.error(chalk.red(err)); process.exit(1); });
