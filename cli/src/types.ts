export type DimensionKey = 'judgment' | 'context' | 'risk' | 'verifiability' | 'creativity';

export type Score = 1 | 2 | 3 | 4 | 5;

export type Scoring = Record<DimensionKey, Score>;

export type Tier = 'Tier-A' | 'Tier-Mid' | 'Tier-Exec';

export type RoutingDecision = {
  tier: Tier;
  reason: string;
  triggeredRules: string[];
};

export type Lang = 'zh' | 'en';

export const DIMENSIONS: { key: DimensionKey; label: { zh: string; en: string }; hint: { zh: string; en: string } }[] = [
  { key: 'judgment',
    label: { zh: '判斷強度 (Judgment Strength)',  en: 'Judgment Strength' },
    hint:  { zh: '需要多少「人類等級的判斷」？1=機械可解, 5=需要架構決策',
             en: 'How much human-level judgment? 1=mechanical, 5=architectural decision' } },
  { key: 'context',
    label: { zh: '上下文寬度 (Context Width)',    en: 'Context Width' },
    hint:  { zh: '需要讀多少代碼/文檔才能做？1=單檔案, 5=跨模組系統理解',
             en: 'How much codebase context? 1=single file, 5=cross-module understanding' } },
  { key: 'risk',
    label: { zh: '風險權重 (Risk Weight)',         en: 'Risk Weight' },
    hint:  { zh: '出錯的代價有多高？1=本地小錯, 5=資料/安全/生產事故',
             en: 'Cost of failure? 1=local scratch, 5=data loss / security incident' } },
  { key: 'verifiability',
    label: { zh: '可驗證性 (Verifiability)',       en: 'Verifiability' },
    hint:  { zh: '能用命令/測試自動驗證嗎？1=純主觀, 5=tests/lint/build 直接驗',
             en: 'Auto-verifiable? 1=purely subjective, 5=tests/lint/build pass' } },
  { key: 'creativity',
    label: { zh: '創意密度 (Creativity Density)',  en: 'Creativity Density' },
    hint:  { zh: '需要多少創造性方案設計？1=照模板做, 5=從零設計',
             en: 'Novel design required? 1=follow template, 5=design from scratch' } },
];
