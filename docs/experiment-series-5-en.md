# Experiment Series 5: Multi-Model Quality Matrix

> **Navigation**: [← Previous](experiment-series-4-en.md) · [→ Next](experiment-series-6-en.md) · [Full Report](experiment-summary-en.md) · [6 Key Findings](key-findings-en.md)

> **Core question**: Does the quality difference between Claude models (Haiku / Sonnet / Opus) align with gstack-plus routing decisions — i.e., harder tasks benefit more from capable models?
>
> **Design**: 3 benchmark tasks (Tier-Exec / Mid / A) × 3 Claude models, LLM-as-Judge (Opus 4.7) unified scoring, max 15 points.

---

## Quality Matrix

| Task (Tier) | Haiku 3.5 | Sonnet 4.6 | Opus 4.7 | Δ (Haiku vs Opus) |
|-------------|-----------|------------|----------|-------------------|
| T1 Tier-Exec | 14/15 | 15/15 | 15/15 | −1 |
| T2 Tier-Mid | 14/15 | 13/15 | 13/15 | +1 |
| T3 Tier-A | 10/15 | 12/15 | 12/15 | −2 |

---

## Task Details

### T1: Tier-Exec — Add ESLint rule to ban console.log

| Model | Score | Notes |
|-------|-------|-------|
| Haiku 3.5 | 14/15 | Accurate, complete config for both ESLint formats; risk section thin but adequate |
| Sonnet 4.6 | 15/15 | Covers both config formats precisely, adds behavior table, flags non-obvious risks |
| Opus 4.7 | 15/15 | Provides both formats with exact syntax, plus thoughtful risk analysis (overrides for tests, migration strategy) |

**Conclusion**: Haiku performs nearly on par with Opus on Tier-Exec (14 vs 15), fully capable for this task class. Sonnet and Opus both scored perfectly.

### T2: Tier-Mid — Refactor auth middleware to support OAuth 2.0

| Model | Score | Notes |
|-------|-------|-------|
| Haiku 3.5 | 14/15 | Comprehensive, correct refactoring with clear code and preserved local auth |
| Sonnet 4.6 | 13/15 | Excellent technical depth but response truncated mid-route definition, leaving OAuth callback incomplete |
| Opus 4.7 | 13/15 | Excellent risk analysis but response truncated, missing callback route and serialize/deserialize setup |

**Conclusion**: Surprisingly, Haiku scored highest (14/15) on this Mid task, while Sonnet and Opus both lost points due to response truncation (1024 token limit). Haiku may already be sufficient for many Mid tasks.

### T3: Tier-A — Design unified SSO + MFA auth architecture

| Model | Score | Notes |
|-------|-------|-------|
| Haiku 3.5 | 10/15 | Covers right components and tech choices at high level but lacks depth in session invalidation, threat modeling (STRIDE), concrete migration steps |
| Sonnet 4.6 | 12/15 | Solid component architecture and tech choices, but response truncated mid-diagram, missing full threat model and migration path |
| Opus 4.7 | 12/15 | Strong technical foundations and well-justified choices, but truncated mid-diagram — missing threat model, migration path |

**Conclusion**: Opus ties with Sonnet (both 12/15), with Haiku lagging by 2 points. All three were truncated by max_tokens, but Opus demonstrated slightly deeper technical reasoning in the visible portion.

---

## Dimension Analysis

| Dimension | Haiku Avg | Sonnet Avg | Opus Avg |
|-----------|-----------|------------|----------|
| Correctness | 2.7 | 2.7 | 2.7 |
| Completeness | 2.0 | 2.0 | 2.0 |
| Clarity | 2.7 | 2.3 | 2.7 |
| Risk Awareness | 2.0 | 2.3 | 2.7 |
| Practical Value | 2.3 | 2.0 | 2.0 |

---

## Conclusions

**Hypothesis Validation**:

| Hypothesis | Result | Notes |
|------------|--------|-------|
| Tier-Exec: all models similar | ✅ Confirmed | Haiku 14, Sonnet 15, Opus 15 — just 1-point gap, Haiku fully sufficient |
| Tier-Mid: Sonnet ≈ Opus > Haiku | ❌ Not confirmed | Haiku 14 > Sonnet 13 = Opus 13 — Haiku scored highest (Sonnet/Opus truncation issue) |
| Tier-A: Opus > Sonnet > Haiku | ⚠️ Partially confirmed | Opus 12 = Sonnet 12 > Haiku 10 — Opus and Sonnet tied, Haiku lagged by 2 points |

**Implications**:

1. **Haiku is more capable than expected** — performed excellently on Tier-Exec and Tier-Mid tasks, even surpassing Sonnet/Opus (when accounting for their truncation).
2. **max_tokens is a significant factor** — Sonnet and Opus both truncated on T2 and T3 due to the 1024 token limit, impacting completeness and practical value scores.
3. **Opus leads in Risk Awareness** — on T3, Opus scored highest in risk awareness (3/3), confirming its superior deep reasoning on complex tasks.
4. **gstack-plus routing remains sound** — even with Haiku's strong performance, the 2-point gap on T3 confirms that high-complexity tasks genuinely benefit from stronger models.
