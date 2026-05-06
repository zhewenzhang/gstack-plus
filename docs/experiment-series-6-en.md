# Experiment Series 6: Scoring Dimension Sensitivity Analysis

> **Navigation**: [← Previous](experiment-series-5-en.md) · [→ Next](experiment-series-7-en.md) · [Full Report](experiment-summary-en.md) · [6 Key Findings](key-findings-en.md)

> **Background**: Series 2 Exp-2A found that "Judgment (J) ±1 affects 32% of routing decisions."
> Series 6 extends this analysis to all 5 dimensions.
>
> **Core question**: For 10 boundary tasks, which scoring dimension's minor error (±1) most easily causes routing tier mistakes?
>
> **Method**: 10 boundary tasks × 5 dimensions × ±1 perturbation — measure routing flip rate per dimension.

---

## 10 Boundary Tasks

| ID | Task | Baseline Scores (J,C,R,V,Cr) | Baseline Tier | Boundary Type |
|----|------|------------------------------|--------------|---------------|
| S1 | Add type annotation to existing function | 2,2,2,4,1 | Tier-Exec | Exec/Mid — 4-dim boundary |
| S2 | Refactor large component into smaller ones | 3,3,3,3,3 | Tier-Mid | Mid/A — J/R/Cr boundary |
| S3 | Write integration tests for payment service | 3,2,3,4,2 | Tier-Mid | Mid/A — J/R boundary |
| S4 | Add database connection pooling | 3,2,3,4,1 | Tier-Mid | Mid/A — R boundary |
| S5 | Create a reusable animation system | 3,2,1,3,3 | Tier-Mid | Mid/A — Cr boundary |
| S6 | Update environment variables in CI | 2,2,2,3,1 | Tier-Mid | Exec/Mid — V boundary |
| S7 | Add logging to three specific functions | 2,3,1,5,1 | Tier-Mid | Exec/Mid — C boundary |
| S8 | Add database index for search query | 1,1,3,5,1 | Tier-Mid | R boundary (both Exec/Mid and Mid/A) |
| S9 | Implement pagination for user list API | 2,3,2,4,2 | Tier-Mid | Exec/Mid — J/C boundary |
| S10 | Design API rate limiting strategy | 4,2,3,4,2 | Tier-A | A (single J support — J-1 → Mid) |

---

## Sensitivity Ranking

> Sensitivity rate = routing flips ÷ valid perturbations

| Rank | Dimension | Rate | Flips | Perturbations |
|------|-----------|------|-------|---------------|
| 1 | R (Risk) | 33% | 6 | 18 |
| 2 | J (Judgment) | 32% | 6 | 19 |
| 3 | C (Context) | 16% | 3 | 19 |
| 4 | Cr (Creativity) | 13% | 2 | 15 |
| 5 | V (Verifiability) | 11% | 2 | 18 |

---

## Per-Dimension Analysis

### R (Risk) — 33%

Risk is the most sensitive dimension. Of 18 valid perturbations, 6 caused routing changes. 5 of those were R+1 causing Mid→Tier-A, and 1 was R-1 causing Mid→Tier-Exec (S8). R is most sensitive at the Mid/A boundary (S2/S3/S4/S8), and S8 shows bidirectional sensitivity (R+1→Tier-A, R-1→Tier-Exec).

### J (Judgment) — 32%

Judgment ties with Risk as the most sensitive dimension. 6 changes: 5 from J+1 causing Mid→Tier-A (S2/S3/S4/S5), 1 from J-1 causing Tier-A→Mid (S10), plus 1 from J+1 causing Exec→Mid (S1). This confirms the Series 2 finding — J is the key dimension for routing stability.

### C (Context) — 16%

C only affects the Exec/Mid boundary (it doesn't participate in Mid/A routing). All 3 changes are C±1 on S1/S7/S9, all Exec↔Mid flips. No impact on Mid/A.

### Cr (Creativity) — 13%

Cr only operates through the Tier-A trigger (Cr≥4). Both changes are Cr+1 causing Mid→Tier-A (S2/S5). Cr-1 causes no changes since Cr doesn't participate in Exec判定.

### V (Verifiability) — 11%

V only operates through the Exec condition (V≥4). Of 2 changes, 1 is V+1 causing Mid→Exec (S6), 1 is V-1 causing Exec→Mid (S1). V has the lowest sensitivity because it only affects Exec conditions and doesn't directly trigger Tier-A.

---

## Comparison with Series 2

| Metric | Series 2 Exp-2A | Series 6 |
|--------|----------------|---------|
| Task count | 30 | 10 (boundary tasks) |
| J sensitivity | 32% | 32% |
| Most sensitive dim | J | R (33%, slightly ahead) |
| Overall flip rate | 13% (non-boundary) | 21% (boundary) |

**Key finding**: In boundary tasks, J sensitivity (32%) matches the Series 2 result exactly. R slightly edges it out at 33%, suggesting that Risk is particularly critical for "hard to judge" tasks.

---

## Design Guidance

Based on sensitivity ranking, users should score the most sensitive dimensions more carefully:

| Dimension | Sensitivity | Guidance |
|-----------|-------------|---------|
| R (Risk) | Highest | At boundary values (R=3 vs 4), apply conservative routing (promote to Tier-A) |
| J (Judgment) | High | At J=3 vs 4 or J=2 vs 3, apply conservative routing |
| C (Context) | Medium | Only affects Exec/Mid; watch C=2 vs 3 |
| Cr (Creativity) | Low | Only affects Mid/A; watch Cr=3 vs 4 |
| V (Verifiability) | Lowest | Scoring errors have minimal routing impact |

---

## Conclusion

1. **R (Risk) is the most sensitive dimension** (33%), slightly edging out J (32%). The two are nearly tied, indicating that for tasks in the gray zone, minor scoring differences in Risk and Judgment most easily change routing. This aligns strongly with Series 2's J finding (32% in the larger sample).

2. **21% of boundary tasks flip their routing under ±1 perturbation**, meaning if a scorer's rating is off by 1 on any dimension, roughly 1 in 5 tasks would be routed to the wrong tier. This underscores the importance of clear scoring criteria and scorer consistency.

3. **5 of the 10 boundary tasks are "conditionally stable"** — they only flip under specific single-dimension changes (e.g., S10 only flips on J-1). No task is completely immune to perturbation, but some are far more robust than others.

4. **Practical guidance**: When scoring, if J or R lands on a boundary value (3 vs 4), trigger conservative routing (promote tier). V and Cr scoring can be more lenient since their errors have less routing impact.
