export type DimensionKey = 'judgment' | 'context' | 'risk' | 'verifiability' | 'creativity';

export type Score = 1 | 2 | 3 | 4 | 5;

export type Scoring = Record<DimensionKey, Score>;

export type Tier = 'Tier-A' | 'Tier-Mid' | 'Tier-Exec';

export type RoutingDecision = {
  tier: Tier;
  reason: string;
  triggeredRules: string[];
};

export const DIMENSIONS: { key: DimensionKey; label: string; hint: string }[] = [
  { key: 'judgment',     label: '判斷強度 (Judgment Strength)',
    hint: '需要多少「人類等級的判斷」？1=機械可解, 5=需要架構決策' },
  { key: 'context',      label: '上下文寬度 (Context Width)',
    hint: '需要讀多少代碼/文檔才能做？1=單檔案, 5=跨模組系統理解' },
  { key: 'risk',         label: '風險權重 (Risk Weight)',
    hint: '出錯的代價有多高？1=本地小錯, 5=資料/安全/生產事故' },
  { key: 'verifiability',label: '可驗證性 (Verifiability)',
    hint: '能用命令/測試自動驗證嗎？1=純主觀, 5=tests/lint/build 直接驗' },
  { key: 'creativity',   label: '創意密度 (Creativity Density)',
    hint: '需要多少創造性方案設計？1=照模板做, 5=從零設計' },
];
