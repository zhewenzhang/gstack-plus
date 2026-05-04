---
title: Tier-Mid — Refactor User Service
tier: Tier-Mid
scores: { judgment: 3, context: 3, risk: 3, verifiability: 4, creativity: 2 }
---

# Tier-Mid Example: Split `UserService` into `UserQuery` + `UserCommand`

## Task Description

> The current `UserService` handles both reads and writes, bloated to 800 lines. Split it into `UserQuery` (read) + `UserCommand` (write) following CQRS style.

## 5-Dimension Scoring Rationale

| Dimension | Score | Why |
|-----------|-------|-----|
| Judgment | 3 | Split points need review (which methods go to Query / which to Command) |
| Context Width | 3 | Need to read entire UserService + all call sites |
| Risk | 3 | Changes will affect multiple callers, but tests provide coverage |
| Verifiability | 4 | Existing unit tests + tsc can verify |
| Creativity Density | 2 | Apply existing CQRS pattern |

## Routing Decision

No Tier-A conditions triggered (none ≥ 4 in judgment/risk/creativity); does not satisfy Tier-Exec conditions (judgment = 3 > 2) → **Tier-Mid**

## Why Not Tier-A

- Pattern (CQRS) is already decided, no architectural decision needed
- Medium risk: all callers are in the same monorepo, changes are caught by tsc

## Why Not Tier-Exec

- Split points need semantic judgment per method (e.g., does `findOrCreate` count as read or write?)
- Exec lacks the judgment ability to determine "classification boundaries"
