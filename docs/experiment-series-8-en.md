# Experiment Series 8: Routing Error Quality Impact Matrix

> **Navigation**: [← Previous](experiment-series-7-en.md) · [→ Next][Latest] · [Full Report](experiment-summary-en.md) · [6 Key Findings](key-findings-en.md)

## 8.1 Experimental Design

This experiment builds on the multi-model quality matrix data from Series 5 (Haiku/Sonnet/Opus × 3 tasks, max score 15), combined with the 9 routing error scenarios defined in Series 7 (5 over-routing + 4 under-routing), to quantify the **quality cost** of each routing error scenario — not just the financial cost. Quality scores come from Series 5 experiment results; scenario definitions come from Series 7 routing error cost analysis.

## 8.2 Quality Impact Matrix

| Scenario | Correct Tier | Actual Routing | Quality (Correct) | Quality (Actual) | Quality Loss | Cost Change |
|----------|-------------|---------------|------------------|-----------------|-------------|-------------|
| E1 | Tier-Exec | Tier-Mid | 14.5/15 | 14.5/15 | 0 | +900% |
| E2 | Tier-Exec | Tier-Mid | 14.5/15 | 14.5/15 | 0 | +900% |
| E3 | Tier-Exec | Tier-Mid | 14.5/15 | 14.5/15 | 0 | +900% |
| M1 | Tier-Mid | Tier-A | 13.5/15 | 13.0/15 | −0.5 | +500% |
| M2 | Tier-Mid | Tier-A | 13.5/15 | 13.0/15 | −0.5 | +500% |
| M3 | Tier-Mid | Tier-Exec | 13.5/15 | 10.5/15 | −3.0 | −90% |
| A1 | Tier-A | Tier-Mid | 12.0/15 | 11.0/15 | −1.0 | −83% |
| A2 | Tier-A | Tier-Mid | 12.0/15 | 11.0/15 | −1.0 | −83% |
| A3 | Tier-A | Tier-Mid | 12.0/15 | 11.0/15 | −1.0 | −83% |

## 8.3 Key Findings

### 1. Over-routing: zero or positive quality impact, only financial cost

Over-routing scenarios (E1/E2/E3/M1/M2) show quality loss of **0 or near-zero** (within −0.5 points). Giving a task to a higher-tier model does not degrade quality — quality stays the same or improves slightly, but costs increase 500%–900%.

### 2. Under-routing: significant quality degradation

Under-routing scenarios (M3/A1/A2/A3) show quality loss ranging from **−1.0 to −3.0 points**:
- **Tier-Mid tasks downgraded to Tier-Exec**: average loss of **−3.0 points** (13.5 → 10.5)
- **Tier-A tasks downgraded to Tier-Mid**: average loss of **−1.0 point** (12.0 → 11.0)
- Average under-routing quality loss: **−1.5 points / 15**

### 3. Routing errors are asymmetric

| Error Type | Quality Impact | Cost Impact |
|-----------|---------------|-------------|
| Over-routing | ≈ 0 (flat or better) | +500%–900% (waste) |
| Under-routing | −8%–33% (loss) | −83%–90% (savings) |

**Core conclusion**: Over-routing wastes money; under-routing wastes quality. The two error types have fundamentally different cost profiles.

### 4. Conclusion: conservative routing is the rational choice

Quality loss is harder to fix than financial loss — an architecture design error may require rewriting an entire module, while a few extra cents in API calls can be compensated instantly. Therefore:

> **When in doubt, prefer over-routing (upgrade to a higher tier) rather than under-routing.**

## 8.4 Comparison with Series 7

| Dimension | Over-routing | Under-routing |
|-----------|-------------|---------------|
| Cost Impact (Series 7) | +500%–900% | −83%–90% |
| Quality Impact (Series 8) | ≈ 0 | −8%–33% |
| Recommendation | Acceptable, but avoid if possible | **Strictly avoid** |

## Related Reading

- [← Previous: Series 7 Routing Error Cost Analysis](experiment-series-7-en.md)
- [Full Summary](experiment-summary-en.md)
- [6 Key Findings](key-findings-en.md)
