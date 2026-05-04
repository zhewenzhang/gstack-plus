# Task Classifier: 5-Dimension Scoring Guide

> The core of the task classifier: evaluate each task across 5 dimensions, then route to the correct Tier using the routing rules.
>
> **Usage:** Given a task description, score each of the 5 dimensions 1–5, then consult `routing-rules.md` for the routing result.

---

## Dimension 1: Judgment Strength

**Core question:** Does this task require the ability to "evaluate which solution is better"?

| Score | Meaning | Criteria |
|-------|---------|----------|
| 1 | Mechanical repetition | Clear input→output rules, just follow them. E.g., "Change all `var` to `const` in the file" |
| 2 | Minor judgment | 1-2 small decisions, but low failure cost. E.g., "Choose a variable name" |
| 3 | Moderate judgment | Multiple options, wrong choice requires backtracking. E.g., "Decide error handling strategy" |
| 4 | High judgment | Must consider interactions across multiple systems. E.g., "Choose caching strategy" |
| 5 | Deep reasoning | Requires architecture-level tradeoff analysis. E.g., "Decide microservice split boundaries" |

**Quick check:** Give the task description to a "technically skilled developer unfamiliar with this project." Can they execute it directly?
- Yes → Low score (1-2)
- Needs some questions answered → Mid score (3)
- Requires extensive architecture-level discussion → High score (4-5)

---

## Dimension 2: Context Width

**Core question:** How much codebase knowledge does this task require?

| Score | Meaning | Criteria |
|-------|---------|----------|
| 1 | Single file | Only need to understand 1 file. E.g., "Change this function's return value" |
| 2 | Single module | Need 2-5 related files (same module). E.g., "Refactor error handling in this module" |
| 3 | Cross-module | Need 5-15 files (2-3 modules). E.g., "Change API endpoint and sync frontend calls" |
| 4 | Multiple subsystems | Need 15+ files, data flows across many components. E.g., "Change authentication flow" |
| 5 | Entire system | Need to understand the entire codebase architecture. E.g., "Migrate from REST to GraphQL" |

**Quick check:** Can the code involved in this task fit into an LLM's context window at once?
- Yes, easily → Low score (1-2)
- Yes, but needs trimming → Mid score (3)
- No, needs multi-turn conversation → High score (4-5)

---

## Dimension 3: Risk Weight

**Core question:** What happens if this task is done wrong?

| Score | Meaning | Criteria |
|-------|---------|----------|
| 1 | Pure style | Wrong answer only affects code aesthetics, not functionality. E.g., "Reformat code, rename variables" |
| 2 | Low impact | May cause minor bugs, easy to find and fix. E.g., "Change UI text" |
| 3 | Moderate impact | May break functionality, but tests provide protection. E.g., "Modify business logic function" |
| 4 | High impact | May cause security vulnerabilities or data loss. E.g., "Change permission check logic" |
| 5 | Critical impact | May cause production incidents, data leaks, compliance issues. E.g., "Change password hashing algorithm" |

**Quick check:** If this task is done wrong, can the user perceive it?
- Imperceptible, only developer cares → Low score (1)
- Perceptible but doesn't affect core functionality → Low-mid score (2)
- Affects core functionality but has error handling → Mid score (3)
- Affects core functionality and may cause security/data issues → High score (4-5)

---

## Dimension 4: Verifiability

**Core question:** How do you know this task is done?

| Score | Meaning | Criteria |
|-------|---------|----------|
| 1 | Subjective | No objective criteria, relies on reviewer judgment. E.g., "Make code more readable" |
| 2 | Semi-subjective | Has general direction but needs human judgment. E.g., "Improve user experience" |
| 3 | Measurable | Has metrics but needs manual execution. E.g., "Reduce API response time" |
| 4 | Objective (command-verified) | Can be verified with a single command. E.g., "npm test all pass" |
| 5 | Fully automatable | Complete automated verification (tests + lint + formatting). E.g., "All CI checks pass" |

**Quick check:** Can you prove this task is done with a single command?
- Completely impossible → Low score (1-2)
- Partially possible → Mid score (3)
- Fully possible → High score (4-5)

**Note:** High score (4-5) is good — high verifiability means it's well-suited for Exec.

---

## Dimension 5: Creativity Density

**Core question:** How much "designing new things" work does this task require?

| Score | Meaning | Criteria |
|-------|---------|----------|
| 1 | Follow a template | Completely follow existing patterns. E.g., "Add the same border to this component as other components have" |
| 2 | Minor modification | Small adjustments within an existing framework. E.g., "Add a new form field" |
| 3 | Moderate creativity | Design new functions or interfaces, but with references. E.g., "Design a new data transformation function" |
| 4 | High creativity | Design new components or modules, no direct reference. E.g., "Design a new user notification system" |
| 5 | Fully open-ended | Design a new feature or system from scratch. E.g., "Design and implement a real-time chat system" |

**Quick check:** How much of this task has "no standard answer"?
- Almost none, all standard operations → Low score (1-2)
- Some, but most has references → Mid score (3)
- Mostly needs design from scratch → High score (4-5)

---

## 15 Examples with Full Scoring

### Example 1: Change all `var` to `const`/`let`

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 1 | Rule is clear: change to const if possible, otherwise let |
| Context | 1 | Single-file scan, no cross-file understanding needed |
| Risk | 1 | Pure style change, no functional impact |
| Verifiability | 5 | ESLint rule auto-verifies |
| Creativity | 1 | Follow rules completely |

**Routing:** Tier-Exec
**Reason:** judgment <= 2 AND context <= 2 AND verifiability >= 4 → Tier-Exec
**Counterintuitive point:** None. This task obviously fits Exec.

---

### Example 2: Add JSDoc to existing functions

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 2 | Need to understand function signature and purpose, but fixed format |
| Context | 2 | Need to read function implementation and callers to understand parameter meaning |
| Risk | 1 | Pure doc change, no runtime impact |
| Verifiability | 4 | `npm run lint -- --rule jsdoc` auto-verifies |
| Creativity | 1 | Follow JSDoc spec |

**Routing:** Tier-Exec

---

### Example 3: Add input validation (null checks + type checks)

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 2 | Rule is clear: null → throw error, wrong type → throw error |
| Context | 2 | Need to understand function parameters and call sites |
| Risk | 3 | Wrong answer may cause valid calls to be rejected |
| Verifiability | 4 | Unit tests can cover |
| Creativity | 1 | Standard guard pattern |

**Routing:** Tier-Exec

---

### Example 4: Rename a function referenced by 3 files

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 1 | Rule is clear: update all references synchronously |
| Context | 2 | Need to understand reference points in 3 files |
| Risk | 2 | Wrong answer causes reference errors, but caught at compile time |
| Verifiability | 5 | TypeScript compiler auto-checks |
| Creativity | 1 | Mechanical operation |

**Routing:** Tier-Exec

---

### Example 5: Review logic correctness of a code snippet

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 4 | Need to understand business logic and edge cases |
| Context | 3 | Need to understand function call chain and data flow |
| Risk | 3 | Missing bugs may cause functional issues, but tests provide protection |
| Verifiability | 3 | Can write tests to verify, but need to understand logic first |
| Creativity | 2 | No design needed, but needs judgment |

**Routing:** Tier-Mid
**Reason:** judgment = 4, doesn't satisfy Exec (judgment > 2), doesn't satisfy Tier-A (risk < 4, creativity < 4) → Tier-Mid

---

### Example 6: Review API endpoint security vulnerabilities

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 4 | Need to understand authentication, authorization, input validation across multiple security dimensions |
| Context | 3 | Need to understand API routes, middleware, data validation layers |
| Risk | 4 | Security vulnerabilities may cause data leaks |
| Verifiability | 3 | Can run security scan tools, but manual review also needed |
| Creativity | 2 | No design needed, but needs security knowledge |

**Routing:** Tier-A
**Reason:** judgment = 4 → Tier-A (security review needs architecture-level perspective)

---

### Example 7: Implement a new REST API endpoint (CRUD Create)

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 3 | Need to design request body format, validation rules, error response |
| Context | 3 | Need to understand existing API patterns, database schema, error handling strategy |
| Risk | 3 | Wrong answer may cause invalid data writes |
| Verifiability | 4 | Unit tests + integration tests can cover |
| Creativity | 3 | Need to design new API interface, but with existing patterns to reference |

**Routing:** Tier-Mid

---

### Example 8: Change error code system from hardcoded strings to enum

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 2 | New spec is clear for the format |
| Context | 4 | Need to find 30+ usage points across files |
| Risk | 2 | Wrong answer causes compilation errors, easily found |
| Verifiability | 4 | TypeScript compiler checks |
| Creativity | 1 | Mechanical operation |

**Routing:** Tier-Mid
**Reason:** context = 4 (not <= 2), doesn't satisfy Exec; judgment < 4, risk < 4, creativity < 4, doesn't satisfy Tier-A → Tier-Mid
**Counterintuitive point:** Operation itself is mechanical, but context width is large (across many files), so not pure Exec.

---

### Example 9: Review frontend component accessibility (a11y)

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 3 | Need to understand WCAG AA standards |
| Context | 3 | Need to review all form components |
| Risk | 2 | Accessibility issues affect user experience but don't break functionality |
| Verifiability | 3 | Can use a11y scan tools, but manual review also needed |
| Creativity | 2 | No design needed |

**Routing:** Tier-Mid

---

### Example 10: Add new unit test cases

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 2 | Design test cases based on function behavior, rules clear |
| Context | 2 | Need to understand tested function's signature and behavior |
| Risk | 2 | Wrong tests only miss bugs, don't introduce new bugs |
| Verifiability | 5 | Test runner auto-verifies |
| Creativity | 2 | Need to think about test cases, but has fixed patterns |

**Routing:** Tier-Exec

---

### Example 11: Split a large function into smaller functions

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 4 | Need to decide split boundaries, function responsibilities, interface design |
| Context | 3 | Need to understand function-internal data flow and callers |
| Risk | 3 | Improper split may change behavior |
| Verifiability | 4 | Existing tests should all pass (behavior unchanged) |
| Creativity | 3 | Need to design new function structure |

**Routing:** Tier-Mid
**Reason:** judgment = 4 → Tier-A (function split needs design judgment)
**Counterintuitive point:** Looks like "refactoring," but split boundary selection needs architecture judgment.

---

### Example 12: Modify CI/CD pipeline configuration

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 3 | Need to understand build flow and dependencies |
| Context | 2 | Mainly CI config files |
| Risk | 4 | Wrong answer may cause deployment failure or security issues |
| Verifiability | 4 | CI run results verifiable |
| Creativity | 2 | Follow existing patterns |

**Routing:** Tier-A
**Reason:** risk = 4 → Tier-A (CI/CD is high-risk operation)

---

### Example 13: Migrate logging system from console.log to structured logging

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 3 | Need to decide log levels, format, context info |
| Context | 4 | Need to find all log call points |
| Risk | 2 | Wrong answer only affects log output, not functionality |
| Verifiability | 4 | Can use regex search + lint to verify all call points changed |
| Creativity | 2 | Follow library API calls |

**Routing:** Tier-Mid
**Reason:** context = 4 but other dimensions not high → Tier-Mid (large mechanical work + minor judgment)

---

### Example 14: Design new database schema for new feature

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 5 | Need to understand business requirements, data relationships, query patterns, extensibility |
| Context | 5 | Need to understand existing schema and relationships |
| Risk | 4 | Schema design errors have extremely high later-fix cost |
| Verifiability | 2 | Can review, but can't auto-verify design quality |
| Creativity | 5 | Design from scratch |

**Routing:** Tier-A
**Reason:** judgment = 5, risk = 4, creativity = 5 → Tier-A (pure architecture design)

---

### Example 15: Evaluate whether to introduce a new third-party dependency

| Dimension | Score | Reason |
|-----------|-------|--------|
| Judgment | 5 | Need to evaluate feature match, maintenance activity, security record, license compatibility, bundle size impact |
| Context | 3 | Need to understand existing dependency tree and project requirements |
| Risk | 4 | Introducing unmaintained or malicious dependencies has long-term risk |
| Verifiability | 3 | Can run security scans, but quality evaluation is subjective |
| Creativity | 3 | No design needed, but needs comprehensive judgment |

**Routing:** Tier-A
**Reason:** judgment = 5, risk = 4 → Tier-A (architecture decision)

---

## Scoring Consistency Check

If you score the same task differently twice, the dimension definitions aren't clear enough. At that point:

1. **Check judgment criteria**: The "criteria" column in each dimension's table is key — does your score match the criteria?
2. **Check quick checks**: Each dimension's "quick check" is a fast verification method — use them to confirm scores
3. **Conservative principle**: When unsure whether to give 3 or 4, give 4 (overestimating is safer than underestimating)
