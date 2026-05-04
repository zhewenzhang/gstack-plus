# Failure Return Report

> Return format from Tier-Mid (Reviewer) → Tier-A (Architect).
>
> **Purpose**: When Exec's output is found不合格 (invalid) after review, or the task itself has decomposition issues, use this template to return to Tier-A.
>
> **Core Mindset**: Failure is not Exec's fault — the task may be decomposed too hard, context insufficient, or beyond Exec's capability boundary. The purpose of the return report is to diagnose "what went wrong," not to blame "who went wrong."

## Basic Information

- **Corresponding Task ID**: `[EXEC-xxx]`
- **Return Type**: `[BUILD_ERROR / LOGIC_ERROR / DESIGN_ISSUE / SCOPE_DRIFT]`
- **Severity**: `[Low (retry solves) / Medium (needs analysis) / High (needs replanning)]`
- **Return Time**: `[ISO 8601]`
- **Tier-Mid Analyst**: `[Name/Role]`

---

## Return Type Definitions

**BUILD_ERROR**:
Compilation/test failure. May be solvable by Exec retrying once.
Typical scenarios: syntax errors, type mismatches, missing dependencies.

**LOGIC_ERROR**:
Code runs, but logic does not meet success criteria. Requires Tier-Mid root cause analysis.
Typical scenarios: incorrect function return values, unhandled edge cases, business logic errors.

**DESIGN_ISSUE**:
The task itself has decomposition problems; Exec cannot complete within the current task boundary. Requires Tier-A replanning.
Typical scenarios: task requires modifying A but actually needs to modify B first, task depends on non-existent interfaces.

**SCOPE_DRIFT**:
Task completion requires modifications beyond Scope Lock. Requires Tier-A evaluation on whether to expand scope.
Typical scenarios: implementing functionality requires adding utility functions, modifying config files, updating dependency versions.

---

## Failure Evidence

```yaml
failure_evidence:
  attempted_at: "[Time]"
  error_type: "[BUILD_ERROR / LOGIC_ERROR / DESIGN_ISSUE / SCOPE_DRIFT]"
  error_detail: "[Specific error message or failed success criterion. For BUILD_ERROR, paste full compile error; for LOGIC_ERROR, paste test failure output]"
  exec_attempts: 1   # Number of Exec attempts

  what_was_tried:
    - attempt: 1
      action: "[What Exec tried]"
      result: "[Result: did error decrease?]"
    - attempt: 2
      action: "[Second attempt (if any)]"
      result: "[Result]"

  # If Exec returned exec-to-check.md, copy its evidence and concerns fields here
```

---

## Root Cause Analysis (Filled by Tier-Mid)

> **3-strike mindset**: If the same issue occurs 3 times, what systemic issue does this indicate?

**Is it a task decomposition problem?**: [ Yes / No ]
Explanation: `[If "yes", explain where the decomposition went wrong — granularity too coarse? unclear boundaries?]`

**Is it an insufficient context problem?**: [ Yes / No ]
Explanation: `[If "yes", explain what context is missing — environment info? code state? dependency relationships?]`

**Is it beyond Exec's capability boundary?**: [ Yes / No ]
Explanation: `[If "yes", explain whether this task exceeds typical Tier-Exec capabilities — requires architectural judgment? or needs global perspective?]`

---

## Recommended Action (Tier-Mid → Tier-A)

Check the most recommended action:

- [ ] **Let Exec retry** (provide more context, retry once)
  Supplemental info: `[Clearly write what needs to be supplemented]`

- [ ] **Tier-Mid fixes directly**
  Reason: `[Why Tier-Mid is more suitable for this fix than Exec]`

- [ ] **Tier-A re-decomposes the task**
  Reason: `[Why the task decomposition was wrong — granularity issue? boundary issue? dependency issue?]`

- [ ] **Re-evaluate whether this task is suitable for Tier-Exec**
  Reason: `[Why this task may need Tier-Mid or Tier-A direct execution]`

**Priority recommendation**: `[Select one and explain why]`

---

## Tier-A Response (Filled by Tier-A after receiving return)

- [ ] Read and agree with recommended action
- [ ] Disagree, my judgment is: `[Explain]`

**Follow-up Action**:
`[What Tier-A decides to do — re-decompose task? expand Scope Lock? escalate to Tier-A direct execution?]`

**New Task ID (if re-decomposed)**: `[New EXEC-xxx]`

---

## Usage Guide

1. **Tier-Mid identifies issue**: After reviewing Exec output, found it不合格 (invalid)
2. **Tier-Mid fills in**: Complete this report (Basic Info → Failure Evidence → Root Cause Analysis → Recommended Action)
3. **Send to Tier-A**: Use this report as return input
4. **Tier-A responds**: Fill in "Tier-A Response" fields, decide follow-up actions
5. **Execute**: Act according to the decision (retry, fix, re-decompose, or escalate)

---

*Phase 1 completed 2026-05-02*
