export type ExampleMeta = {
  slug: string;
  title: string;
  tier: 'Tier-A' | 'Tier-Mid' | 'Tier-Exec';
  scores: { judgment: number; context: number; risk: number; verifiability: number; creativity: number };
  description: string;
  url: string;
};

const BASE = 'https://zhewenzhang.github.io/gstack-plus/#/doc';

export const EXAMPLES: ExampleMeta[] = [
  {
    slug: 'eslint',
    title: 'Tier-Exec — 加 ESLint 配置',
    tier: 'Tier-Exec',
    scores: { judgment: 1, context: 1, risk: 1, verifiability: 5, creativity: 1 },
    description: '機械配置任務的典型路由',
    url: `${BASE}/ex-tier-exec-eslint`,
  },
  {
    slug: 'rename',
    title: 'Tier-Exec — 跨檔案重命名',
    tier: 'Tier-Exec',
    scores: { judgment: 1, context: 2, risk: 1, verifiability: 5, creativity: 1 },
    description: '上下文寬但判斷低 → 仍可派 Exec',
    url: `${BASE}/ex-tier-exec-rename`,
  },
  {
    slug: 'refactor',
    title: 'Tier-Mid — CQRS 重構',
    tier: 'Tier-Mid',
    scores: { judgment: 3, context: 3, risk: 3, verifiability: 4, creativity: 2 },
    description: '中等判斷 + 中等風險的典型',
    url: `${BASE}/ex-tier-mid-refactor`,
  },
  {
    slug: 'auth',
    title: 'Tier-A — 設計 SSO + MFA',
    tier: 'Tier-A',
    scores: { judgment: 5, context: 4, risk: 5, verifiability: 2, creativity: 4 },
    description: '三個條件同時觸發 Tier-A',
    url: `${BASE}/ex-tier-a-auth`,
  },
  {
    slug: 'borderline',
    title: '邊界案例 — cursor pagination',
    tier: 'Tier-Mid',
    scores: { judgment: 3, context: 4, risk: 3, verifiability: 3, creativity: 2 },
    description: '保守路由原則的應用時機',
    url: `${BASE}/ex-borderline`,
  },
];

export function findExample(query: string): ExampleMeta | null {
  const q = query.toLowerCase().trim();
  return EXAMPLES.find(e => e.slug === q || e.slug.includes(q) || e.title.toLowerCase().includes(q)) ?? null;
}
