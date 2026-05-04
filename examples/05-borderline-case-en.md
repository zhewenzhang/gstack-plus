---
title: Borderline Case — "Optimize Database Query"
tier: Tier-Mid (but close to Tier-A)
scores: { judgment: 3, context: 4, risk: 3, verifiability: 3, creativity: 2 }
---

# Borderline Case: Change Paginated Query from `OFFSET` to `cursor-based`

## Task Description

> Our admin list page starts to slow down at 50k+ users. Change `LIMIT/OFFSET` to `WHERE id > cursor LIMIT N` cursor-based pagination.

## 5-Dimension Scoring Rationale

| Dimension | Score | Why |
|-----------|-------|-----|
| Judgment | 3 | Pattern is known (cursor-based), but need to decide whether cursor uses PK or timestamp |
| Context Width | 4 | Changes SQL + API + frontend pagination state |
| Risk | 3 | If done wrong, will see out-of-order or duplicate results, but no data loss |
| Verifiability | 3 | Partially testable (SQL results), but "user experience" needs human review |
| Creativity Density | 2 | Apply existing cursor pagination pattern |

## Routing Decision

None ≥ 4 (judgment / risk / creativity) → does not trigger Tier-A
judgment = 3 > 2 → does not satisfy Tier-Exec
→ **Tier-Mid**

## Why This Is a Borderline Case

- Context Width = 4, **very close** to Tier-A trigger condition, but routing rules only recognize the three key dimensions
- If cursor is designed wrong (using timestamp but with duplicate timestamps), there will be "skipping some rows" bugs — this is a signal that Judgment should be 4, but you may have underestimated it during initial assessment
- **Conservative Routing Principle**: when uncertain, round up. If you hesitate whether judgment is 3 or 4, choose 4, which routes to Tier-A

## Lesson

5-dimension scoring **has subjectivity**. To be conservative, when "hard to say whether 3 or 4":
- Risk dimension: take the higher one
- Judgment dimension: take the higher one
- Others: go with your feeling
