// Exp-3B: Real-world Task Corpus
// Extract tasks from git history, route them, and generate a scoring template
// for human expert validation.

import { execSync } from 'child_process';
import fs from 'node:fs';
import { route } from '../../site/src/lib/route.js';

// Extract the last 30 commits from git log
const gitLog = execSync('git log --oneline -30 --no-merges', { cwd: 'D:\\gstack-plus' })
  .toString()
  .trim()
  .split('\n');

console.log(`\ngstack-plus Exp-3B: Real-world Task Corpus\n`);
console.log(`Extracted ${gitLog.length} commits from git history\n`);

// Map commit messages to task descriptions (best effort from commit text)
const REALWORLD_TASKS = [
  { id: 'R01', commit: gitLog[0]  ?? '', task: 'Implement complete i18n for Playground page — translate h1, description, routing decision label, buttons, routing rules, fix threshold arrow direction for Tier-Exec, add minimum radius to pentagon chart', expectedNotes: '' },
  { id: 'R02', commit: gitLog[1]  ?? '', task: 'Bump version to v0.4.0 — update cli/package.json, CHANGELOG.md, strings.ts pill text, README npm badge', expectedNotes: '' },
  { id: 'R03', commit: gitLog[2]  ?? '', task: 'Add 12 Playground presets with tier-based color coding (Exec=green, Mid=cyan, A=fuchsia, Border=amber)', expectedNotes: '' },
  { id: 'R04', commit: gitLog[3]  ?? '', task: 'Build pentagon radar chart SVG component for 5-dimension scoring visualization, add dimension examples (1/3/5 per slider), add threshold proximity hints', expectedNotes: '' },
  { id: 'R05', commit: gitLog[4]  ?? '', task: 'Add English translations for 5 worked examples + fix GitHub Actions deploy trigger for examples/ path', expectedNotes: '' },
  { id: 'R06', commit: gitLog[5]  ?? '', task: 'Add English translations for 9 core documentation files (classifier, handoff templates, verification guardrails)', expectedNotes: '' },
  { id: 'R07', commit: gitLog[6]  ?? '', task: 'Update README.zh.md to match latest English README — add experiment table, update badges and v0.3.4 status', expectedNotes: '' },
  { id: 'R08', commit: gitLog[7]  ?? '', task: 'Add amber stats bar to Hero section (46% cost reduction, 3 tiers, 5 dimensions), restore 11 learning notes to sidebar, add tier sublabels to Playground', expectedNotes: '' },
  { id: 'R09', commit: gitLog[8]  ?? '', task: 'Complete i18n for DocPage — breadcrumb, prev/next navigation, section cards, Playground labels, handoff template bilingual', expectedNotes: '' },
  { id: 'R10', commit: gitLog[9]  ?? '', task: 'Add Mode A/B experiment results to README and strategy docs — 46% cost saving validated', expectedNotes: '' },
  { id: 'R11', task: 'Design and implement MCP bridge server (qwen-bridge) — allows Claude to dispatch tasks to Qwen Code via MCP tool, includes Windows Toast + speech notification + Windows Terminal tab launch', expectedNotes: '' },
  { id: 'R12', task: 'Add Prompt Builder feature — role selector (6 roles) × flow selector (5 flows) generates structured system prompt via buildPrompt() function', expectedNotes: '' },
  { id: 'R13', task: 'Add Strategy documentation page explaining why layered routing matters — bilingual zh+en', expectedNotes: '' },
  { id: 'R14', task: 'Load Google Fonts (Instrument Serif + Inter) in index.html, fix video placement in Hero (pb-0, mt-20), update footer version, improve CJK word-break CSS', expectedNotes: '' },
  { id: 'R15', task: 'Fix stats bar faux bold (remove font-bold from Instrument Serif elements), add Hero bottom padding, bilingual video caption', expectedNotes: '' },
  { id: 'R16', task: 'Create GitHub Release v0.4.0 with release notes covering all new features', expectedNotes: '' },
  { id: 'R17', task: 'Run routing stability analysis — 30 tasks × ±1 perturbation across all 5 dimensions, generate stability report', expectedNotes: '' },
  { id: 'R18', task: 'Run extended cost benchmark — 9 tasks × All-Opus vs Routed, 18 API calls, generate RESULTS.md', expectedNotes: '' },
  { id: 'R19', task: 'Implement LLM-as-Judge quality evaluation — blind evaluation with position bias mitigation, Claude Haiku as judge, 3-dimension 1-5 scoring', expectedNotes: '' },
  { id: 'R20', task: 'Write and publish bilingual experiment Series 2 report — add to docs site as /doc/experiment-series-2, update README with findings', expectedNotes: '' },
];

// Route each task (note: these need manual scoring — this generates the template)
// We provide our best-guess scores, then output a template for expert validation
const ROUTING_GUESSES: Record<string, { j: number; c: number; r: number; v: number; cr: number }> = {
  R01: { j: 2, c: 3, r: 1, v: 5, cr: 1 },  // i18n + bug fix — Exec-adjacent
  R02: { j: 1, c: 2, r: 1, v: 5, cr: 1 },  // version bump — pure Exec
  R03: { j: 2, c: 2, r: 1, v: 4, cr: 2 },  // add presets — Exec
  R04: { j: 3, c: 3, r: 2, v: 3, cr: 4 },  // design radar chart from scratch — Mid/A border
  R05: { j: 2, c: 2, r: 1, v: 5, cr: 1 },  // translation — Exec
  R06: { j: 2, c: 2, r: 1, v: 5, cr: 1 },  // translation — Exec
  R07: { j: 2, c: 2, r: 1, v: 5, cr: 1 },  // doc sync — Exec
  R08: { j: 3, c: 3, r: 2, v: 3, cr: 3 },  // homepage feature — Mid
  R09: { j: 2, c: 3, r: 1, v: 5, cr: 1 },  // i18n patch — Exec-adjacent
  R10: { j: 2, c: 2, r: 1, v: 4, cr: 1 },  // doc update — Exec
  R11: { j: 4, c: 4, r: 3, v: 3, cr: 4 },  // MCP server design — Tier-A
  R12: { j: 3, c: 3, r: 2, v: 3, cr: 4 },  // Prompt Builder feature — Mid/A
  R13: { j: 3, c: 3, r: 1, v: 3, cr: 3 },  // write strategy doc — Mid
  R14: { j: 2, c: 2, r: 1, v: 4, cr: 1 },  // CSS + font fix — Exec
  R15: { j: 2, c: 2, r: 1, v: 5, cr: 1 },  // visual bug fixes — Exec
  R16: { j: 1, c: 1, r: 1, v: 5, cr: 1 },  // create release — Exec
  R17: { j: 3, c: 3, r: 1, v: 5, cr: 3 },  // write analysis script — Mid
  R18: { j: 3, c: 3, r: 2, v: 5, cr: 2 },  // run experiment — Mid
  R19: { j: 4, c: 4, r: 2, v: 4, cr: 3 },  // design judge methodology — Mid/A
  R20: { j: 3, c: 4, r: 1, v: 4, cr: 3 },  // write + publish report — Mid
};

// Route all tasks and generate report
const results = REALWORLD_TASKS.map(t => {
  const g = ROUTING_GUESSES[t.id];
  const s = { judgment: g.j as 1|2|3|4|5, context: g.c as 1|2|3|4|5, risk: g.r as 1|2|3|4|5, verifiability: g.v as 1|2|3|4|5, creativity: g.cr as 1|2|3|4|5 };
  const r = route(s);
  return { ...t, scores: s, tier: r.tier, reason: r.reason };
});

console.log('Routed tasks:\n');
for (const r of results) {
  console.log(`  ${r.id} [${r.tier}] ${r.task.slice(0, 70)}`);
}

// Distribution
const dist: Record<string, number> = {};
for (const r of results) { dist[r.tier] = (dist[r.tier] ?? 0) + 1; }
console.log('\nTier distribution:', dist);
console.log(`  Tier-Exec: ${dist['Tier-Exec'] ?? 0}`);
console.log(`  Tier-Mid:  ${dist['Tier-Mid'] ?? 0}`);
console.log(`  Tier-A:    ${dist['Tier-A'] ?? 0}`);

// Generate validation template
const template = [
  '# Exp-3B: Real-world Task Corpus — Expert Validation Template',
  '',
  '> Fill in "Your Tier" for each task to validate algorithm routing.',
  '> Your Tier options: Tier-Exec | Tier-Mid | Tier-A',
  '',
  `| ID | Task (truncated) | Algo Scores (J,C,R,V,Cr) | Algo Tier | Your Tier | Match? |`,
  `|----|-----------------|--------------------------|-----------|-----------|----|`,
  ...results.map(r =>
    `| ${r.id} | ${r.task.slice(0, 60)}... | ${Object.values(r.scores).join(',')} | **${r.tier}** | ___ | ___ |`
  ),
  '',
  '## Summary (fill after completing)',
  '',
  '- Agreement rate: __ / 20',
  '- Disagreements: [list task IDs]',
  '- Notes on disagreements:',
];

fs.writeFileSync('exp3b-validation-template.md', template.join('\n'));
console.log('\n  exp3b-validation-template.md saved — please fill in "Your Tier" column.\n');
fs.writeFileSync('exp3b-results.json', JSON.stringify(results, null, 2));
console.log('  exp3b-results.json saved.\n');
