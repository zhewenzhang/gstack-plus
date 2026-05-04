---
title: Tier-Exec — Rename Utility Function
tier: Tier-Exec
scores: { judgment: 1, context: 2, risk: 1, verifiability: 5, creativity: 1 }
---

# Tier-Exec Example: Cross-Project Rename `getCwd → getCurrentWorkingDirectory`

## Task Description

> Rename `getCwd` to `getCurrentWorkingDirectory` in `src/utils/path.ts` and update all imports.

## 5-Dimension Scoring Rationale

| Dimension | Score | Why |
|-----------|-------|-----|
| Judgment | 1 | IDE rename is sufficient |
| Context Width | 2 | Spans multiple files, but scope is clear (single function) |
| Risk | 1 | Pure rename, behavior unchanged |
| Verifiability | 5 | `tsc --noEmit && grep -r 'getCwd' src/` should return empty |
| Creativity Density | 1 | Mechanical operation |

## Routing Decision

`judgment ≤ 2 ∧ context ≤ 2 ∧ verifiability ≥ 4` → **Tier-Exec**

## Observation

"Spans multiple files" ≠ "needs Tier-Mid." The key is **the nature of the change** — does it require judgment? Renaming does not.
