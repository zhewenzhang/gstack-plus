# Cost Calculation Model

> Based on Series 1 and Series 3 experiment data, calculate the actual cost savings from gstack-plus routing strategy.

---

## 1. Cost Calculation Formula

```
Post-routing cost = Σ (task i × corresponding tier cost/tokens)

Theoretical savings rate = (All-Tier-A cost - Post-routing cost) / All-Tier-A cost

Actual savings = Theoretical savings rate × monthly AI task budget
```

---

## 2. Cost Baselines per Tier (2026-05 Data)

| Tier | Typical Model | Input $/1M tokens | Output $/1M tokens | Typical Task Cost |
|------|--------------|-------------------|--------------------|-------------------|
| Tier-A | Opus 4.7 | $15 | $75 | $0.045–$0.08 |
| Tier-Mid | Sonnet 4.6 | $3 | $15 | $0.006–$0.015 |
| Tier-Exec | Haiku / Qwen | $0.08–$0.25 | $0.30–$1.25 | $0.00014–$0.002 |

---

## 3. Savings Estimates by Task Distribution

Series 3 real git commit distribution: 45% Exec + 35% Mid + 20% Tier-A

| Distribution Scenario | Estimated Savings | Use Case |
|----------------------|-------------------|----------|
| Balanced (45%/35%/20%) | **−46%** | Typical mid-size project |
| Exec-heavy (60%/30%/10%) | **−65%** | Maintenance phase |
| Architecture-heavy (10%/30%/60%) | **−12%** | Early design phase |
| Exec-dominant (70%/20%/10%) | **−75%** | DevOps/scripting-focused |

---

## 4. Calculator Template

```
Input:
- Monthly AI task count: N
- Task distribution: E% Exec + M% Mid + A% Tier-A
- Current model: Opus (or Sonnet)

Output:
- Estimated current monthly cost
- Estimated post-routing monthly cost
- Savings amount and percentage
```

### Calculation Example

Assume:
- 200 tasks per month
- Distribution: 45% Exec + 35% Mid + 20% Tier-A
- Currently all using Opus

**Current cost** (all Opus):
200 × $0.060/task = $12.00/month

**Post-routing cost**:
- Exec: 200 × 45% × $0.001 = $0.09
- Mid: 200 × 35% × $0.010 = $0.70
- Tier-A: 200 × 20% × $0.060 = $2.40
- **Total: $3.19/month**

**Savings**: $12.00 - $3.19 = **$8.81/month (−73%)**

---

## 5. Additional Savings from Right Prompting

Series 5 finding: Using the S1 prompt strategy (role identity + depth instruction), Sonnet reaches 15.0/15, beating Opus at 12.7/15, at just 13.3% of Opus's cost.

This means for Tier-Mid tasks, not only does routing save 83%, using the right prompt strategy further improves quality.
