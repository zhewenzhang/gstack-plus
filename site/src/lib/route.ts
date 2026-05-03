// Mirror of cli/src/route.ts — keep in sync.
// Pure routing function; no Node deps so safe to import in browser.

export type Score = 1 | 2 | 3 | 4 | 5;

export type Scoring = {
  judgment: Score;
  context: Score;
  risk: Score;
  verifiability: Score;
  creativity: Score;
};

export type Tier = 'Tier-A' | 'Tier-Mid' | 'Tier-Exec';

export type RoutingDecision = {
  tier: Tier;
  reason: string;
  triggeredRules: string[];
};

export function route(s: Scoring): RoutingDecision {
  const triggered: string[] = [];
  if (s.judgment >= 4)   triggered.push(`judgment=${s.judgment} ≥ 4`);
  if (s.risk >= 4)       triggered.push(`risk=${s.risk} ≥ 4`);
  if (s.creativity >= 4) triggered.push(`creativity=${s.creativity} ≥ 4`);

  if (triggered.length > 0) {
    return {
      tier: 'Tier-A',
      reason: `Tier-A 條件觸發：${triggered.join(', ')}`,
      triggeredRules: triggered,
    };
  }
  if (s.judgment <= 2 && s.context <= 2 && s.verifiability >= 4) {
    const rules = [`judgment=${s.judgment} ≤ 2`, `context=${s.context} ≤ 2`, `verifiability=${s.verifiability} ≥ 4`];
    return {
      tier: 'Tier-Exec',
      reason: `Tier-Exec 條件全部滿足：${rules.join(', ')}`,
      triggeredRules: rules,
    };
  }
  return {
    tier: 'Tier-Mid',
    reason: '不滿足 Tier-A 或 Tier-Exec 任一觸發條件，default 路由到 Tier-Mid',
    triggeredRules: [],
  };
}

export const DIMENSIONS: { key: keyof Scoring; label: string; hint: string }[] = [
  { key: 'judgment',     label: '判斷強度',  hint: '1=機械可解, 5=需要架構決策' },
  { key: 'context',      label: '上下文寬度', hint: '1=單檔案, 5=跨模組系統理解' },
  { key: 'risk',         label: '風險權重',  hint: '1=本地小錯, 5=資料/安全/生產事故' },
  { key: 'verifiability',label: '可驗證性',  hint: '1=純主觀, 5=tests/lint/build 直接驗' },
  { key: 'creativity',   label: '創意密度',  hint: '1=照模板做, 5=從零設計' },
];

export const PRESETS: { label: string; task: string; scoring: Scoring }[] = [
  { label: 'Tier-Exec：加 ESLint 配置',
    task: '為 Node.js 專案初始化 ESLint v9 + TypeScript ESLint',
    scoring: { judgment: 1, context: 1, risk: 1, verifiability: 5, creativity: 1 } },
  { label: 'Tier-Mid：CQRS 重構',
    task: '把 UserService 拆成 UserQuery 和 UserCommand',
    scoring: { judgment: 3, context: 3, risk: 3, verifiability: 4, creativity: 2 } },
  { label: 'Tier-A：設計 SSO + MFA',
    task: '為 SaaS 設計 Google/GitHub SSO，admin 帳號強制 MFA',
    scoring: { judgment: 5, context: 4, risk: 5, verifiability: 2, creativity: 4 } },
];
