export type Tier = 'Tier-A' | 'Tier-Mid' | 'Tier-Exec';

export interface Scores {
  j: number;
  c: number;
  r: number;
  v: number;
  cr: number;
}

export function route(s: Scores): Tier {
  if (s.j >= 4 || s.r >= 4 || s.cr >= 4) return 'Tier-A';
  if (s.j <= 2 && s.c <= 2 && s.v >= 4 && s.r <= 2) return 'Tier-Exec';
  return 'Tier-Mid';
}

/** Clamp score to 1-5 range */
export function clamp(v: number): number {
  return Math.max(1, Math.min(5, v));
}
