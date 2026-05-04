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
      { score: 3, zh: '重構一個 Service 類，需要了解它的所有調用方', en: 'Refactor a service class, need to understand all its callers' },
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
  // ── Tier-Exec ───────────────────────────────────────────────────────────
  {
    label: 'Exec · 加 ESLint',
    task: '為 Node.js 專案初始化 ESLint v9 + TypeScript ESLint，加入 .eslintrc 並配置 no-console、no-unused-vars 規則',
    scoring: { judgment: 1, context: 1, risk: 1, verifiability: 5, creativity: 1 },
  },
  {
    label: 'Exec · 重命名函式',
    task: '把 src/ 下所有 TypeScript 文件中的 getCwd 重命名為 getWorkingDir',
    scoring: { judgment: 1, context: 2, risk: 2, verifiability: 5, creativity: 1 },
  },
  {
    label: 'Exec · 加環境變量',
    task: '在 .env.example 加入 DATABASE_URL、REDIS_URL、JWT_SECRET 三個變量，並更新 README 的 Setup 章節',
    scoring: { judgment: 1, context: 1, risk: 1, verifiability: 5, creativity: 1 },
  },
  // ── Tier-Mid ────────────────────────────────────────────────────────────
  {
    label: 'Mid · CQRS 重構',
    task: '把 UserService 按 CQRS 拆成 UserQueryService 和 UserCommandService，保持現有接口不變',
    scoring: { judgment: 3, context: 3, risk: 3, verifiability: 4, creativity: 2 },
  },
  {
    label: 'Mid · 升級 React Query',
    task: '把 React 應用的 data fetching 從 raw fetch() 遷移到 React Query v5，覆蓋用戶列表和詳情頁',
    scoring: { judgment: 3, context: 3, risk: 2, verifiability: 4, creativity: 2 },
  },
  {
    label: 'Mid · Code Review',
    task: '審查 PR #47：新增了一個 PaymentProcessor 類，處理 Stripe webhook 和退款邏輯',
    scoring: { judgment: 3, context: 3, risk: 3, verifiability: 3, creativity: 1 },
  },
  {
    label: 'Mid · 修復 race condition',
    task: '修復用戶同時點擊提交按鈕導致雙重扣款的 bug，需要理解現有的 OrderService 和 PaymentService 流程',
    scoring: { judgment: 3, context: 3, risk: 4, verifiability: 4, creativity: 2 },
  },
  // ── Tier-A ──────────────────────────────────────────────────────────────
  {
    label: 'A · 設計 SSO + MFA',
    task: '為 B2B SaaS 設計 SAML SSO + TOTP MFA 認證架構，需要考慮 session 管理、MFA bypass 攻擊防護',
    scoring: { judgment: 5, context: 4, risk: 5, verifiability: 2, creativity: 4 },
  },
  {
    label: 'A · 微服務拆分決策',
    task: '評估是否把現有 Rails monolith 的 billing 模塊拆成獨立微服務，分析邊界、依賴、遷移風險',
    scoring: { judgment: 5, context: 5, risk: 4, verifiability: 2, creativity: 4 },
  },
  {
    label: 'A · 設計插件系統',
    task: '為開源工具設計插件架構，支持第三方開發者擴展核心功能，需要決定 API 設計、版本兼容策略',
    scoring: { judgment: 5, context: 3, risk: 3, verifiability: 2, creativity: 5 },
  },
  // ── Borderline ──────────────────────────────────────────────────────────
  {
    label: 'Border · Cursor pagination',
    task: '把用戶列表 API 的分頁從 offset 改成 cursor-based，需要兼容現有的前端查詢參數',
    scoring: { judgment: 2, context: 2, risk: 3, verifiability: 4, creativity: 2 },
  },
  {
    label: 'Border · 性能優化',
    task: '優化首頁加載時間，目前 LCP > 4s，需要分析原因並提出方案，可能涉及圖片優化/代碼分割/CDN',
    scoring: { judgment: 3, context: 3, risk: 2, verifiability: 4, creativity: 3 },
  },
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
