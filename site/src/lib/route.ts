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

export type Lang = 'zh' | 'en';

export type RoutingDecision = {
  tier: Tier;
  reason: string;
  triggeredRules: string[];
};

export function route(s: Scoring, lang: Lang = 'zh'): RoutingDecision {
  const triggered: string[] = [];
  if (s.judgment >= 4)   triggered.push(`judgment=${s.judgment} ≥ 4`);
  if (s.risk >= 4)       triggered.push(`risk=${s.risk} ≥ 4`);
  if (s.creativity >= 4) triggered.push(`creativity=${s.creativity} ≥ 4`);

  if (triggered.length > 0) {
    return {
      tier: 'Tier-A',
      reason: lang === 'en'
        ? `Tier-A triggered: ${triggered.join(', ')}`
        : `Tier-A 條件觸發：${triggered.join(', ')}`,
      triggeredRules: triggered,
    };
  }
  if (s.judgment <= 2 && s.context <= 2 && s.verifiability >= 4) {
    const rules = [`judgment=${s.judgment} ≤ 2`, `context=${s.context} ≤ 2`, `verifiability=${s.verifiability} ≥ 4`];
    return {
      tier: 'Tier-Exec',
      reason: lang === 'en'
        ? `Tier-Exec conditions met: ${rules.join(', ')}`
        : `Tier-Exec 條件全部滿足：${rules.join(', ')}`,
      triggeredRules: rules,
    };
  }
  return {
    tier: 'Tier-Mid',
    reason: lang === 'en'
      ? 'No Tier-A or Tier-Exec conditions met — defaulting to Tier-Mid'
      : '不滿足 Tier-A 或 Tier-Exec 任一觸發條件，default 路由到 Tier-Mid',
    triggeredRules: [],
  };
}

export type DimensionExample = { score: 1 | 3 | 5; zh: string; en: string };

export const DIMENSIONS: {
  key: keyof Scoring;
  label: string;
  labelEn: string;
  hint: string;
  hintEn: string;
  examples: DimensionExample[];
}[] = [
  {
    key: 'judgment',
    label: '判斷強度', labelEn: 'Judgment',
    hint: '1=機械可解, 5=需要架構決策',
    hintEn: '1=mechanical, 5=architectural decision-making',
    examples: [
      { score: 1, zh: '加一行 console.log 或修改配置文件中的一個值', en: 'Add a console.log or change one config value' },
      { score: 3, zh: '把一個 React 組件拆分成更小的組件', en: 'Split a React component into smaller ones' },
      { score: 5, zh: '設計多租戶 SaaS 的權限模型或決定是否遷移到微服務', en: 'Design a multi-tenant permission model or decide to migrate to microservices' },
    ],
  },
  {
    key: 'context',
    label: '上下文寬度', labelEn: 'Context Width',
    hint: '1=單檔案, 5=跨模組系統理解',
    hintEn: '1=single file, 5=cross-module system knowledge',
    examples: [
      { score: 1, zh: '修改單個函式的輸出格式', en: 'Change the output format of a single function' },
      { score: 3, zh: '重構一個 Service 類，需要解它的所有調用方', en: 'Refactor a service class, need to understand all its callers' },
      { score: 5, zh: '評估將 REST API 改造成 GraphQL 的影響', en: 'Assess the impact of migrating a REST API to GraphQL' },
    ],
  },
  {
    key: 'risk',
    label: '風險權重', labelEn: 'Risk',
    hint: '1=本地小錯, 5=資料/安全/生產事故',
    hintEn: '1=local/reversible, 5=data/security/production incident',
    examples: [
      { score: 1, zh: '修改開發環境的 CSS 樣式', en: 'Change CSS styles in development environment' },
      { score: 3, zh: '修改 API 響應格式（有版本控制）', en: 'Change API response format (versioned)' },
      { score: 5, zh: '修改用戶密碼加密邏輯或生產數據庫遷移腳本', en: 'Modify password hashing logic or production database migration' },
    ],
  },
  {
    key: 'verifiability',
    label: '可驗證性', labelEn: 'Verifiability',
    hint: '1=純主觀, 5=tests/lint/build 直接驗',
    hintEn: '1=purely subjective, 5=auto-verified by tests/lint/build',
    examples: [
      { score: 1, zh: '改進代碼可讀性或文檔質量（主觀判斷）', en: 'Improve code readability or docs quality (subjective)' },
      { score: 3, zh: '實現一個功能，有手動測試步驟', en: 'Implement a feature with manual test steps' },
      { score: 5, zh: '修復一個有明確失敗測試的 bug，CI 通過即驗收', en: 'Fix a bug with a failing test — CI pass = done' },
    ],
  },
  {
    key: 'creativity',
    label: '創意密度', labelEn: 'Creativity',
    hint: '1=照模板做, 5=從零設計',
    hintEn: '1=follow template, 5=design from scratch',
    examples: [
      { score: 1, zh: '按現有模式新增一個 CRUD 接口', en: 'Add a CRUD endpoint following existing patterns' },
      { score: 3, zh: '設計一個新功能的數據模型，有一定約束', en: 'Design a data model for a new feature with some constraints' },
      { score: 5, zh: '從零設計一套插件系統架構或全新的用戶體驗流程', en: 'Design a plugin system architecture or entirely new UX flow from scratch' },
    ],
  },
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

export type ThresholdHint = {
  targetTier: Tier;
  changes: string[];
  lang: Lang;
};

export function getThresholdHints(s: Scoring, currentTier: Tier, lang: Lang): ThresholdHint[] {
  const hints: ThresholdHint[] = [];

  if (currentTier !== 'Tier-A') {
    const needed: string[] = [];
    if (s.judgment < 4) needed.push(lang === 'en' ? `judgment ${s.judgment}→4` : `判斷強度 ${s.judgment}→4`);
    if (s.risk < 4)     needed.push(lang === 'en' ? `risk ${s.risk}→4` : `風險權重 ${s.risk}→4`);
    if (s.creativity < 4) needed.push(lang === 'en' ? `creativity ${s.creativity}→4` : `創意密度 ${s.creativity}→4`);
    if (needed.length === 1) {
      hints.push({ targetTier: 'Tier-A', changes: needed, lang });
    }
  }

  if (currentTier !== 'Tier-Exec') {
    const needed: string[] = [];
    if (s.judgment > 2)      needed.push(lang === 'en' ? `judgment ${s.judgment}→2` : `判斷強度 ${s.judgment}→2`);
    if (s.context > 2)       needed.push(lang === 'en' ? `context ${s.context}→2` : `上下文寬度 ${s.context}→2`);
    if (s.verifiability < 4) needed.push(lang === 'en' ? `verifiability ${s.verifiability}→4` : `可驗證性 ${s.verifiability}→4`);
    const notMet = needed.length;
    if (notMet <= 2 && notMet > 0) {
      hints.push({ targetTier: 'Tier-Exec', changes: needed, lang });
    }
  }

  return hints;
}
