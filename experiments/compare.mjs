#!/usr/bin/env node
// experiments/compare.mjs
// Usage: node experiments/compare.mjs
// Reads Mode A/B/C run records in experiments/runs/ and prints comparison tables.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = join(dirname(fileURLToPath(import.meta.url)), 'runs');

function extractValue(text, label) {
  const regex = new RegExp(`\\|\\s*\\*\\*?${label}\\*\\*?\\s*\\|([^|]+)\\|`);
  const m = text.match(regex);
  if (!m) return null;
  const val = m[1].trim().replace(/_填入_/g, '?').replace(/~?([0-9,]+)~?/g, '$1');
  const num = parseFloat(val.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? val : num;
}

const MODES = ['A', 'B', 'C'];
const TASKS = ['1', '2', '3'];
const LABELS = {
  '1': 'simple-eslint',
  '2': 'medium-refactor',
  '3': 'complex-auth'
};
const METRICS = ['步驟數', '用戶介入次數', '回流次數', '代碼質量評分', 'Token 消耗估算'];

const data = {};
for (const mode of MODES) {
  for (const task of TASKS) {
    const file = `${mode}${task}-${LABELS[task]}.md`;
    const path = join(__dir, file);
    let content = '';
    try { content = readFileSync(path, 'utf-8'); } catch { continue; }
    const key = `${mode}${task}`;
    data[key] = {};
    for (const metric of METRICS) {
      data[key][metric] = extractValue(content, metric.replace(/（.+?）/, '').trim());
    }
  }
}

const TASK_NAMES = { '1': 'Task A (簡單)', '2': 'Task B (中等)', '3': 'Task C (複雜)' };

for (const task of TASKS) {
  console.log(`\n### ${TASK_NAMES[task]}\n`);
  const header = `| 指標 | Mode A | Mode B | Mode C |`;
  const divider = `|------|--------|--------|--------|`;
  console.log(header);
  console.log(divider);
  for (const metric of METRICS) {
    const vals = MODES.map(m => {
      const key = `${m}${task}`;
      const v = data[key]?.[metric];
      return v == null ? '—' : String(v);
    });
    console.log(`| ${metric} | ${vals.join(' | ')} |`);
  }
}

console.log('\n> 執行完成。如需寫入 results-report.md，請複製上面的表格。');
