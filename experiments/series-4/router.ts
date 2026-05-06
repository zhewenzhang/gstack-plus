export type Tier = 'Tier-A' | 'Tier-Mid' | 'Tier-Exec';

export interface Scores {
  j: number;   // Judgment  判斷強度
  c: number;   // Context   上下文寬度
  r: number;   // Risk      風險權重
  v: number;   // Verif.    可驗證性
  cr: number;  // Creativity 創意密度
}

export function route(s: Scores): Tier {
  if (s.j >= 4 || s.r >= 4 || s.cr >= 4) return 'Tier-A';
  if (s.j <= 2 && s.c <= 2 && s.v >= 4 && s.r <= 2) return 'Tier-Exec';
  return 'Tier-Mid';
}
