import type { RoutingDecision, Scoring } from './types.js';

/**
 * gstack-plus routing rules (mirrors classifier/routing-rules.md)
 *
 *  - Judgment >= 4  OR  Risk >= 4  OR  Creativity >= 4   -> Tier-A
 *  - (else) Judgment <= 2  AND  Context <= 2  AND  Verifiability >= 4   -> Tier-Exec
 *  - (else) -> Tier-Mid
 *
 * Conservative routing: when uncertain, route up.
 */
export function route(s: Scoring): RoutingDecision {
  const triggered: string[] = [];

  if (s.judgment >= 4)   triggered.push(`judgment=${s.judgment} >= 4`);
  if (s.risk >= 4)       triggered.push(`risk=${s.risk} >= 4`);
  if (s.creativity >= 4) triggered.push(`creativity=${s.creativity} >= 4`);

  if (triggered.length > 0) {
    return {
      tier: 'Tier-A',
      reason: `Tier-A 條件觸發：${triggered.join(', ')}`,
      triggeredRules: triggered,
    };
  }

  if (s.judgment <= 2 && s.context <= 2 && s.verifiability >= 4) {
    const rules = [`judgment=${s.judgment} <= 2`, `context=${s.context} <= 2`, `verifiability=${s.verifiability} >= 4`];
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
