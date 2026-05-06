# Routing Confidence Guide

> Based on Series 6: 21% of boundary tasks change routing under ±1 scoring error. This guide helps you make correct decisions at scoring boundaries.

---

## 1. What Is "Confidence Routing"

Each task's scoring should come with a confidence level:

| Confidence | Condition | Action |
|-----------|-----------|--------|
| **High** | All dimension scores are clear, no ambiguity | Route directly per scores |
| **Medium** | 1-2 dimensions are ambiguous but don't affect routing | Route per scores, note concerns |
| **Low** | J or R at boundary (=3 vs 4) and task is important | Trigger conservative routing |

---

## 2. Conservative Routing Trigger Conditions

Auto-promote one tier when any of these apply:

```
Condition A: J = 3 (Judgment boundary) and task affects production
Condition B: R = 3 (Risk boundary) and cannot quickly rollback
Condition C: Two or more dimensions simultaneously at boundary (e.g., J=3, C=2, V=4 — exactly at Exec/Mid boundary)
```

**Why it's worth it**: Series 6 shows R and J sensitivity rates of 33% and 32%. The extra cost of conservative routing (~$0.009/task) is far less than misrouting cost.

---

## 3. Per-Dimension Scoring Decision Trees

### J (Judgment)

- How many "no standard answer" decision points does the task have?
  - 0 → **1-2**
  - 1-2 → **2-3**
  - 3+ → **4-5**
- Could reasonable engineers disagree on the best approach?
  - No → ≤2
  - Possibly → 3
  - Very likely → ≥4

**Common error**: "I'm not sure how to do this" ≠ high J, it's high C (need more context).

### R (Risk)

- If done wrong, what's the fix cost?
  - < 30 min → **1-2**
  - Hours → **3**
  - Days → **4**
  - Catastrophic → **5**
- Does it involve prod database, user auth, billing?
  - Yes → **Auto ≥4**

**Common error**: Security-related code's R is often underestimated as 2, should be 4+.

### C (Context)

- How many files need to be read to execute?
  - 0-2 → **1-2**
  - 3-5 → **3**
  - 5+ → **4-5**

### V (Verifiability)

- Can you 100% confirm completion with a test/script?
  - Yes → **4-5**
  - Partially → **2-3**
  - Cannot auto-verify → **1-2**

**Common error**: "I can manually test" = V=2, "CI script can verify" = V=4.

### Cr (Creativity)

- Does the task require designing something that didn't exist before?
  - No → **1-2**
  - Partial innovation → **3**
  - Brand new design → **4-5**

---

## 4. Boundary Case Reference Table

| Scenario | Recommended Scores | Route | Notes |
|----------|-------------------|-------|-------|
| Add log statements to specific function | J=2,C=2,R=1,V=5,Cr=1 | Tier-Exec | Fully mechanical, V=5 |
| Refactor large component split | J=3,C=3,R=3,V=3,Cr=3 | Tier-Mid (conservative candidate) | R=3 and J=3, evaluate Tier-A |
| Design API rate limiting strategy | J=4,C=2,R=3,V=4,Cr=2 | Tier-A | J=4 single-dimension trigger |
| Update CI environment variables | J=2,C=2,R=2,V=3,Cr=1 | Tier-Mid | Doesn't meet Exec criteria (V<4) |

---

## 5. Common Scoring Mistakes

Based on Series 6 findings:

1. **R underestimation**: Security-related code's R is often underestimated as 2, should be 4+
2. **J overestimation**: "I'm not sure how" ≠ high J, it's high C (need more context)
3. **V confusion**: "I can manually test" = V=2, "CI script verifies" = V=4
