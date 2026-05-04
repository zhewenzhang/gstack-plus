# Failure Type Handbook

> When Tier-Exec returns BLOCKED or DONE_WITH_CONCERNS, Tier-Mid uses this handbook to classify failure and decide routing.
>
> **Usage**: Read exec-to-check.md evidence field →对照 this handbook's identification signals → determine failure type → consult failure-routing-en.md for routing decision.

---

## Failure Type 1: BUILD_ERROR

**Definition**: Compilation/test command output shows errors, code cannot run.

**Identification Signals** (any one signal is sufficient for determination):
- `npm test` output contains `FAIL` or `✕`字样
- `npm run typecheck` output contains lines starting with `error TS`
- `npm run build` exit code non-zero
- Compiler output contains `SyntaxError`, `TypeError`, `Cannot find module`
- Linter outputs `error` (not `warning`)

**Typical Scenario**:
Exec modified a function's parameter list in `src/auth/login.ts` but forgot to update the call site. When tests run, the call site passes old argument count, causing `TypeError: expected 3 arguments but got 2`.

**Routing Decision**:
- 1st occurrence → Allow Tier-Exec self-fix 1 time (read error message, locate problem, fix, re-run)
- Still failing after retry → Tier-Mid intervenes for analysis
- Maximum retries: **2 times**

**Handler Template**:

**Tier-Exec Self-Fix Steps**:
1. Read full error output
2. Locate file and line number where error occurred
3. Check if fix is within Scope Lock
4. If yes (e.g., typo, parameter mismatch, forgot import) → fix
5. Re-run validation commands
6. If passes → fill exec-to-check.md return DONE
7. If still fails → fill BLOCKED, escalate to Tier-Mid

**Tier-Mid Analysis Template** (BUILD_ERROR still fails on 2nd attempt):
- Is error fixable within Exec's Scope Lock?
  - No → convert to SCOPE_DRIFT type
  - Yes → continue
- Is error a code logic error or syntax error?
  - Syntax error → Exec should be able to fix, probably missed something → Tier-Mid fixes directly
  - Logic error → may be LOGIC_ERROR, convert to LOGIC_ERROR type

**Tier-A Replanning Trigger Conditions**:
- BUILD_ERROR occurs 3 consecutive times (Exec 1 + Tier-Mid 2) still cannot fix → task decomposition itself may have issues → Tier-A replans

**Distinctions from Other Types**:
- vs LOGIC_ERROR: BUILD_ERROR is "cannot run," LOGIC_ERROR is "runs but result is wrong"
- vs SCOPE_DRIFT: If fixing BUILD_ERROR requires modifying files outside Scope Lock → convert to SCOPE_DRIFT

---

## Failure Type 2: LOGIC_ERROR

**Definition**: Code can run (compilation/test commands don't error), but functionality does not meet success criteria.

**Identification Signals** (any one signal is sufficient for determination):
- Tests pass but return values don't match expectations (e.g., expected `[1,2,3]` but got `[3,2,1]`)
- Success criteria check has `verified: false` but `commands_run` status are all `passed`
- Exec says in concerns "functionality implemented, but edge cases may not be handled"
- Test output similar: `Expected: "¥1,234.50" Received: "1234.50"` (format wrong but no error)

**Typical Scenario**:
Task requires `formatCurrency(1234.5, "CNY")` to return `"¥1,234.50"`. Exec implemented number formatting but forgot to add thousand separators. When tests run, no compile errors, but test case expects `"¥1,234.50"`, actual gets `"¥1234.50"`. Test framework reports assertion failure (not BUILD_ERROR), because the code itself is legal.

**Routing Decision**:
- 1st occurrence → Tier-Mid analyzes root cause
- After Tier-Mid analysis, add context for Exec to retry → maximum 1 retry
- Still failing after retry → Tier-A replans
- Maximum retries: **1 time** (Exec retry)

**Handler Template**:

**Tier-Mid Analysis Steps**:
1. Compare each entry in exec-to-check.md `success_criteria_check`
2. Find criteria with `verified: false`
3. Compare Exec's implementation against success criteria literally
4. Determine deviation reason:
   - Exec misunderstood task description → clarify and let Exec retry 1 time
   - Task description itself ambiguous → convert to DESIGN_ISSUE, escalate to Tier-A
   - Exec's implementation missed an edge case → point out specific edge case, let Exec retry 1 time
5. If same type of LOGIC_ERROR occurs 3 times → systemic issue, escalate to Tier-A

**Tier-A Replanning Trigger Conditions**:
- Same type of LOGIC_ERROR occurs 3 times
- Tier-Mid judges "task description itself is ambiguous"
- Fix requires understanding other parts of system (beyond Exec's context)

**Distinctions from Other Types**:
- vs BUILD_ERROR: LOGIC_ERROR test commands pass, only assertion is wrong
- vs DESIGN_ISSUE: If literal match but semantics differ → DESIGN_ISSUE; if just wrong implementation → LOGIC_ERROR

---

## Failure Type 3: DESIGN_ISSUE

**Definition**: The task itself has decomposition problems; Exec cannot complete within the current task boundary.

**Identification Signals** (any one signal is sufficient for determination):
- Exec says in concerns "this task requires changing X first, but X is not in my scope"
- Success criteria contradicts actual code state (e.g., requires modifying a non-existent function)
- Exec says "need to know design decision for Z, but not in task description"
- exec-to-check.md status is NEEDS_CONTEXT with reason "task description doesn't match code"

**Typical Scenario**:
Task requires "add caching to `UserService.getUser()`." Exec looks at code and finds `UserService` class doesn't exist — it was renamed to `UserRepository` in a previous refactor. Task description is based on outdated code state; Exec cannot add functionality to "non-existent class." This requires Tier-A to replan the task (update class name in task description first).

**Routing Decision**:
- 1st occurrence → Immediately escalate to Tier-A, no retry
- Tier-A re-decomposes task upon receiving
- Maximum retries: **0 times** (should not let Exec retry because task itself is wrong)

**Handler Template**:

**Tier-Mid Analysis Steps**:
1. Confirm Exec's concerns point to task description itself (not Exec's implementation error)
2. Check if files/functions/interfaces in task description exist
3. If non-existent → DESIGN_ISSUE confirmed, fill check-to-plan.md escalate to Tier-A
4. If exists but Exec didn't find it → may be insufficient context → supplement and let Exec retry 1 time
5. If task description contradicts success criteria → DESIGN_ISSUE confirmed

**Tier-A Replanning Trigger Conditions**:
- DESIGN_ISSUE confirmed → replan immediately

**Distinctions from Other Types**:
- vs LOGIC_ERROR: LOGIC_ERROR is Exec implemented wrong; DESIGN_ISSUE is task description wrong
- vs SCOPE_DRIFT: SCOPE_DRIFT is "scope insufficient"; DESIGN_ISSUE is "task itself wrong"

---

## Failure Type 4: SCOPE_DRIFT

**Definition**: Task completion requires modifying files beyond what Scope Lock allows.

**Identification Signals** (any one signal is sufficient for determination):
- exec-to-check.md `file_changes.out_of_scope` is non-empty
- Exec says in concerns "need to add utility function X first, but X is not in allowed file list"
- Exec's functionality is correct, but git diff shows modifications to files outside Scope Lock
- Tier-Mid review finds "this change depends on another module's interface, but that's not in scope"

**Typical Scenario**:
Task requires "add input validation for `POST /api/users`", Scope Lock only allows modifying `src/routes/users.ts`. Exec implements validation logic but finds validation rules defined in `src/validators/user.ts`, requiring simultaneous modification. Exec lists `src/validators/user.ts` in `out_of_scope`. This requires Tier-A evaluation: expand Scope Lock (approve modifying validators file) or have Exec implement differently (e.g., inline validation logic in routes file).

**Routing Decision**:
- 1st occurrence → Tier-A evaluates whether to expand Scope Lock
- Tier-A decides: approve expansion → Exec retry; deny → Exec implements differently or task replanned
- Maximum retries: **0 times** (no retry, Tier-A decides first)

**Handler Template**:

**Tier-A Evaluation Steps**:
1. Read exec-to-check.md `out_of_scope` field
2. Determine if out-of-scope modifications are reasonable:
   - Reasonable (truly need to modify these files to complete task) → expand Scope Lock, let Exec retry
   - Unreasonable (Exec's approach is wrong, there are other ways without out-of-scope changes) → guide Exec to change approach
   - Unreasonable and task itself shouldn't need these modifications → DESIGN_ISSUE, replan task
3. If expanding Scope Lock: update plan-to-exec.md Scope Lock field, let Exec retry

**Tier-Mid's Role in SCOPE_DRIFT**:
- Identify whether out_of_scope is truly necessary
- If deemed unnecessary → guide Exec to change approach directly, no need to escalate to Tier-A
- If deemed necessary → escalate to Tier-A for evaluation

**Distinctions from Other Types**:
- vs DESIGN_ISSUE: SCOPE_DRIFT is task design correct but scope insufficient; DESIGN_ISSUE is task design wrong
- vs BUILD_ERROR: If out-of-scope modification is to fix BUILD_ERROR → first determine if BUILD_ERROR can be fixed differently

---

## Quick Reference Table

| Failure Type | Core Problem | First Handler | Max Retries | Escalation Trigger |
|--------------|-------------|---------------|-------------|-------------------|
| **BUILD_ERROR** | Cannot run | Tier-Exec | 2 times | After 2 failures → Tier-Mid |
| **LOGIC_ERROR** | Runs but result wrong | Tier-Mid | 1 time | Analyze immediately, 3 same-type → Tier-A |
| **DESIGN_ISSUE** | Task itself wrong | Tier-A | 0 times | Escalate immediately |
| **SCOPE_DRIFT** | Scope insufficient | Tier-A | 0 times | Escalate immediately for evaluation |

---

*Phase 2 completed 2026-05-02*
