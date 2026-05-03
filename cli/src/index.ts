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
  .version('0.2.0')
  .option('--lang <lang>', 'Language for interactive prompts (zh | en)', 'zh');

program
  .command('classify <task>')
  .description('Classify a task across 5 dimensions and route to the right Tier')
  .option('-o, --out <dir>', 'Output directory for handoff doc', './handoffs')
  .option('--scores <csv>', 'Skip prompts; provide scores as judgment,context,risk,verifiability,creativity (1-5 each)')
  .option('--auto', 'Use Claude API (claude-haiku) to auto-score the task (requires ANTHROPIC_API_KEY)')
  .option('--api-key <key>', 'Anthropic API key (overrides ANTHROPIC_API_KEY env var)')
  .action(async (task: string, opts: { out: string; scores?: string; auto?: boolean; apiKey?: string }, cmd) => {
    const lang = (cmd?.parent?.opts?.()?.lang === 'en' ? 'en' : 'zh') as 'zh' | 'en';
    let scoring: Scoring;

    if (opts.auto) {
      const ora = (await import('ora')).default;
      const spinner = ora('Scoring task with Claude Haiku\u2026').start();
      try {
        const { autoScore } = await import('./auto-score.js');
        scoring = await autoScore(task, opts.apiKey);
        spinner.succeed('Auto-scored');
        const labels = ['judgment', 'context', 'risk', 'verifiability', 'creativity'] as const;
        for (const k of labels) {
          console.log(`  ${k.padEnd(15)} ${scoring[k]}`);
        }
      } catch (err) {
        spinner.fail(String(err));
        process.exit(1);
      }
    } else if (opts.scores) {
      const parts = opts.scores.split(',').map(n => parseInt(n.trim(), 10));
      if (parts.length !== 5 || parts.some(n => isNaN(n) || n < 1 || n > 5)) {
        console.error(chalk.red(lang === 'zh'
          ? '--scores 需要 5 個 1\u20135 的數字，逗號分隔。例: --scores 4,3,4,2,2'
          : '--scores needs 5 comma-separated 1\u20135 numbers. e.g. --scores 4,3,4,2,2'));
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
      scoring = await interactiveScore(task, lang);
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
  .command('examples [query]')
  .description('List built-in routing examples, or show one by name (e.g., examples auth)')
  .action(async (query?: string) => {
    const { EXAMPLES, findExample } = await import('./examples-data.js');

    if (!query) {
      console.log('');
      console.log(chalk.bold(`${EXAMPLES.length} examples to study:`));
      console.log('');
      const longest = Math.max(...EXAMPLES.map(e => e.slug.length));
      for (const ex of EXAMPLES) {
        const tierColor = ex.tier === 'Tier-A' ? chalk.magenta
                       : ex.tier === 'Tier-Mid' ? chalk.cyan
                       : chalk.green;
        console.log(`  ${chalk.bold(ex.slug.padEnd(longest + 2))}  ${tierColor(ex.tier.padEnd(10))}  ${chalk.dim(ex.description)}`);
      }
      console.log('');
      console.log(chalk.dim(`Show details:  gstack-plus examples <name>`));
      console.log(chalk.dim(`Read online:   ${EXAMPLES[0].url.replace(/\/[^/]+$/, '')}/...`));
      return;
    }

    const ex = findExample(query);
    if (!ex) {
      console.error(chalk.red(`No example matched "${query}".`));
      console.log(chalk.dim(`Available: ${EXAMPLES.map(e => e.slug).join(', ')}`));
      process.exit(1);
    }

    const tierColor = ex.tier === 'Tier-A' ? chalk.bold.magenta
                   : ex.tier === 'Tier-Mid' ? chalk.bold.cyan
                   : chalk.bold.green;
    console.log('');
    console.log(chalk.bold(ex.title));
    console.log(chalk.dim(ex.description));
    console.log('');
    console.log(`  judgment      ${ex.scores.judgment}`);
    console.log(`  context       ${ex.scores.context}`);
    console.log(`  risk          ${ex.scores.risk}`);
    console.log(`  verifiability ${ex.scores.verifiability}`);
    console.log(`  creativity    ${ex.scores.creativity}`);
    console.log('');
    console.log(`  \u2192 routes to ${tierColor(ex.tier)}`);
    console.log('');
    console.log(chalk.dim(`Full analysis: ${chalk.underline(ex.url)}`));
    console.log('');
    console.log(chalk.dim(`Try this scoring yourself:`));
    const scores = `${ex.scores.judgment},${ex.scores.context},${ex.scores.risk},${ex.scores.verifiability},${ex.scores.creativity}`;
    console.log(`  gstack-plus classify "your task" --scores ${scores}`);
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
