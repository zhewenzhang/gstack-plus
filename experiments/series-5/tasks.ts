export interface BenchmarkTask {
  id: string;
  tier: 'Tier-Exec' | 'Tier-Mid' | 'Tier-A';
  scores: { j: number; c: number; r: number; v: number; cr: number };
  prompt: string;
  rationale: string;
}

export const TASKS: BenchmarkTask[] = [
  {
    id: 'T1-Exec',
    tier: 'Tier-Exec',
    scores: { j: 1, c: 1, r: 1, v: 5, cr: 1 },
    prompt: `Add an ESLint rule to ban console.log in a JavaScript project.

Requirements:
- Add "no-console" rule to .eslintrc.js (or eslint.config.js)
- Rule should be "error" level
- Allow console.warn and console.error
- Show the exact config change needed`,
    rationale: 'Tier-Exec: mechanical, verifiable, low judgment. Any capable model should handle this equally well.',
  },
  {
    id: 'T2-Mid',
    tier: 'Tier-Mid',
    scores: { j: 3, c: 3, r: 3, v: 3, cr: 2 },
    prompt: `Refactor an Express.js authentication middleware to support OAuth 2.0 (Google provider).

Current state: The middleware uses username/password with bcrypt.
Requirements:
- Add Google OAuth 2.0 support using passport.js
- Keep existing username/password auth working
- Add session management
- Handle OAuth callback route
- Show key code changes (not full implementation, but enough to understand the approach)`,
    rationale: 'Tier-Mid: moderate judgment + risk. Sonnet should match Opus; Haiku may miss edge cases.',
  },
  {
    id: 'T3-A',
    tier: 'Tier-A',
    scores: { j: 5, c: 4, r: 5, v: 2, cr: 4 },
    prompt: `Design a unified SSO + MFA authentication architecture for a SaaS platform with 100k+ users.

Context:
- Current: each service has independent auth
- Requirements: unified identity provider, support SAML, OIDC, and internal JWT
- MFA: TOTP + SMS + hardware key (FIDO2)
- Compliance: SOC2 Type II, GDPR
- Must handle: session invalidation across services, token refresh, audit logs

Produce: architecture decision record (ADR) with component diagram description, technology choices with justification, security threat model highlights, and migration path from current state.`,
    rationale: 'Tier-A: high judgment, risk, creativity. Requires deep security reasoning — model capability gap expected.',
  },
];
