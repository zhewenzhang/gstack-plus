---
title: Tier-Exec — Add ESLint Config
tier: Tier-Exec
scores: { judgment: 1, context: 1, risk: 1, verifiability: 5, creativity: 1 }
---

# Tier-Exec Example: Add ESLint Configuration to a Project

## Task Description

> Initialize ESLint v9 + TypeScript ESLint for a Node.js project, disable `any` type, enforce `===` comparison.

## 5-Dimension Scoring Rationale

| Dimension | Score | Why |
|-----------|-------|-----|
| Judgment | 1 | Apply existing ESLint v9 flat config template, no architectural decisions |
| Context Width | 1 | Only touches root `package.json` + `eslint.config.mjs` |
| Risk | 1 | Dev tool config — if wrong, just re-run, no production impact |
| Verifiability | 5 | `npx eslint . && echo OK` directly verifies |
| Creativity Density | 1 | Exactly follows official documentation |

## Routing Decision

`judgment ≤ 2 ∧ context ≤ 2 ∧ verifiability ≥ 4` → **Tier-Exec**

## Handoff Summary

```yaml
scope_lock:
  - package.json
  - eslint.config.mjs
success_criteria:
  - npx eslint . exit code = 0
  - rules include @typescript-eslint/no-explicit-any: error
  - rules include eqeqeq: error
forbidden:
  - modify any file in src/
  - introduce additional plugins (unless necessary for TS support)
retry_policy:
  build_error: 2
  others: 0
```

## Why This Task Fits Tier-Exec

- Limited answer space (ESLint config template)
- Clear failure signal (command exit code)
- No temptation of "maybe there's a better way"
