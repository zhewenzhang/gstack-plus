# Exec Completion Report

> Standard return format from Tier-Exec (Executor) → Tier-Mid (Reviewer).
>
> **Iron Rule**: The evidence field must never be empty. No evidence = incomplete.

## Basic Information

- **Corresponding Task ID**: `[Matching plan-to-exec.md EXEC-xxx]`
- **Completion Status**: `[DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED]`
- **Completion Time**: `[ISO 8601, e.g., 2026-05-02T14:30:00Z]`

---

## Status Definitions

**DONE**:
All success criteria verified as passed, no out-of-scope modifications. Task fully complete.

**DONE_WITH_CONCERNS**:
Task completed, but there are noteworthy items (must be described in the Concerns field below).
Typical scenarios:
- Discovered dependency issues not mentioned in the handoff
- A success criterion verification result is "marginally passing"
- Code size larger than expected, may have performance implications

**NEEDS_CONTEXT**:
Task cannot be completed due to missing key context (must specify what is missing below).
Requires Tier-A to supplement information before re-dispatch.
Typical scenarios:
- Referenced function/file does not exist
- Need to know the value of an environment variable
- Task description contradicts actual code state

**BLOCKED**:
Encountered a question requiring architectural judgment, or 2 consecutive failures.
Escalated to Tier-Mid for analysis, may further return to Tier-A.
Typical scenarios:
- Need to modify files outside Scope Lock
- Both approaches seem reasonable, uncertain which to choose
- Tests repeatedly failing, cannot find root cause

---

## Evidence (Required, Empty Field Not Accepted)

```yaml
evidence:
  commands_run:
    - command: "[Actually executed command, e.g., 'npm test src/auth/']"
      output: "[Output result. If too long, paste first 5 lines + '...' + last 3 lines]"
      status: "passed / failed"
    - command: "[Second command, e.g., 'npm run typecheck']"
      output: "[Output]"
      status: "passed / failed"

  file_changes:
    modified: ["[Actually modified file 1]", "[Actually modified file 2]"]
    planned: ["[Handoff-allowed file 1]", "[Handoff-allowed file 2]"]
    out_of_scope: ["[Out-of-scope files, fill [] if none]"]

  success_criteria_check:
    - criterion: "[Original success criterion 1, copied from plan-to-exec.md]"
      verified: true / false
      evidence: "[How it was verified, e.g., 'npm test output shows 18 passed, 0 failed']"
    - criterion: "[Original success criterion 2]"
      verified: true / false
      evidence: "[How it was verified]"
```

**Validation Rules**:
- `commands_run` must have at least 1 record
- Each file in `file_changes.modified` must be in `file_changes.planned`, otherwise must be explained in `out_of_scope`
- `success_criteria_check` entries count must equal the success criteria count in plan-to-exec.md

---

## Concerns (Required for DONE_WITH_CONCERNS or BLOCKED Status)

`[Describe what was encountered, what was tried, why stopped]`

**Format Suggestion**:
```
Concern: [One-liner description]
Impact: [What problems this may cause]
Suggestion: [Exec's perspective suggestion — not architectural judgment, but execution observation]
```

---

## Suggestions for Tier-Mid

`[Exec's perspective suggestions. Not architectural judgment, but observations from the execution process.]`

Examples:
- "This file was larger than expected, felt the structure could be improved during modification, but uncertain if it's within my scope"
- "There was 1 warning in the tests, not caused by my changes, but worth noting"
- "The function signature mentioned in the task description is inconsistent with the actual code, I adjusted according to my understanding"

---

## Usage Guide

1. **Exec fills in**: Complete all fields above, ensure evidence is not empty
2. **Exec self-check**: After filling in, ask yourself: "Can Tier-Mid judge whether I completed the task just by reading this report?" If not → add more evidence
3. **Send to Tier-Mid**: Use this document as review input
4. **Wait for return**: After Tier-Mid review, may accept, request fixes, or return to Tier-A (using `check-to-plan.md`)

---

*Phase 1 completed 2026-05-02*
