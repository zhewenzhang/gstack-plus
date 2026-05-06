# Experiment Series 7: Routing Error Cost Analysis

> **Navigation**: [← Previous](experiment-series-6-en.md) · [→ Next](experiment-series-8-en.md) · [Full Report](experiment-summary-en.md) · [6 Key Findings](key-findings-en.md)

> **Core question**: "If I route wrong, how much do I actually lose? Is it money or quality? Is conservative routing worth it?"
>
> **Method**: Deliberately misroute 9 tasks, comparing correct routing's cost and quality risk.

---

## 7.1 Over-routing Cost

| Task | Correct Tier | Experiment Tier | Correct Cost | Experiment Cost | Extra Waste |
|------|-------------|-----------------|-------------|-----------------|-------------|
| E1 (type annotations) | Tier-Exec | Tier-Mid | $0.001 | $0.010 | +$0.009 (+900%) |
| E2 (CI env vars) | Tier-Exec | Tier-Mid | $0.001 | $0.010 | +$0.009 (+900%) |
| E3 (database index) | Tier-Exec | Tier-Mid | $0.001 | $0.010 | +$0.009 (+900%) |
| M1 (JWT auth refactor) | Tier-Mid | Tier-A | $0.010 | $0.060 | +$0.050 (+500%) |
| M2 (pagination API) | Tier-Mid | Tier-A | $0.010 | $0.060 | +$0.050 (+500%) |

**Key finding**: Exec tasks promoted to Mid waste ~$0.009 per task. Mid tasks promoted to Tier-A waste ~$0.050 per task. If 100 Exec tasks are over-routed monthly, monthly waste is $0.90.

---

## 7.2 Under-routing Cost

| Task | Correct Tier | Experiment Tier | Cost Saved | Quality Risk |
|------|-------------|-----------------|-----------|-------------|
| M3 (payment tests) | Tier-Mid | Tier-Exec | −90% | Medium: test design may miss edge cases |
| A1 (DB sharding) | Tier-A | Tier-Mid | −83% | High: architecture decision quality may drop |
| A2 (OAuth2+SSO) | Tier-A | Tier-Mid | −83% | High: security architecture design may be incomplete |
| A3 (caching strategy) | Tier-A | Tier-Mid | −83% | High: tech choices may be inappropriate |

**Key finding**: Under-routing "saves money" but the quality risk on design/architecture tasks is unacceptable.

---

## 7.3 Conservative Routing Break-even Analysis

Based on Series 6 (21% of boundary tasks need conservative routing):

```
Assume: 200 tasks/month
Boundary tasks (21%): 42 tasks
Conservative routing promotes these 42: Tier-Mid → Tier-A

Extra cost: 42 × ($0.060 - $0.010) = 42 × $0.050 = $2.10/month

Prevented under-routing errors (estimated 5% occurrence):
Potential loss: each architecture error = hours of rework = tens of dollars
Conservative routing ROI: $2.10/month vs. preventing 1-2 major architecture errors
```

**Conclusion**: Conservative routing is justified in most scenarios — the extra cost is far less than the cost of prevented errors.

---

## 7.4 Practical Recommendations

1. **Over-routing is more expensive** (cost perspective): Sending Exec tasks to Tier-Mid wastes ~900%, but the amount is small ($0.009/task)
2. **Under-routing is more dangerous** (quality perspective): Sending Tier-A tasks to Tier-Mid saves 83% cost, but design quality risk is high
3. **Conservative routing has positive ROI**: Even with 21% of tasks conservatively promoted, the monthly extra cost is ~$2, far less than the cost of prevented architecture errors
