export type Tier = 'Tier-Exec' | 'Tier-Mid' | 'Tier-A';

export interface Scores {
  j: number; c: number; r: number; v: number; cr: number;
}

export function route(s: Scores): Tier {
  if (s.j >= 4 || s.r >= 4 || s.cr >= 4) return 'Tier-A';
  if (s.j <= 2 && s.c <= 2 && s.v >= 4 && s.r <= 2) return 'Tier-Exec';
  return 'Tier-Mid';
}

export const TIER_COST: Record<Tier, number> = {
  'Tier-A': 0.060,    // Opus 4.7 average per task
  'Tier-Mid': 0.010,  // Sonnet 4.6 average per task
  'Tier-Exec': 0.001, // Haiku/Qwen average per task
};
