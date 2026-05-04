# Failure Routing Decision Tree

> Complete decision flow for Tier-Mid when receiving BLOCKED or DONE_WITH_CONCERNS status from `exec-to-check.md`.
>
> **Usage**: Receive Exec failure report → follow this document's decision tree → consult failure-catalog-en.md for type determination → execute corresponding response.

---

## Part 1: First Step After Receiving Exec Failure Report — Three Questions

Before checking failure-catalog-en.md, ask:

### Question 1: Is the Evidence Field Filled?

- **No** → Return to Exec, request to fill evidence (this is not a true failure, it's a format issue)
- **Yes** → Continue to Question 2

### Question 2: Which Failure Attempt Is This?

- **1st BUILD_ERROR** → Allow Exec self-fix once (jump to BUILD_ERROR routing)
- **2nd or not BUILD_ERROR** → Enter classification flow (continue to Question 3)

### Question 3: Is the Failure Description Clear?

- **Unclear** (e.g., "tests failed" but no output pasted) → Request Exec to supplement specific error information before classification
- **Clear** → Enter Part 2 Decision Tree

---

## Part 2: Failure Classification Decision Tree

```
Received failure report
    │
    ├─ Evidence field exists?
    │   ├── No → Return to Exec, request to fill evidence
    │   └── Yes ↓
    │
    ├─ Compilation/test command output has errors?
    │   (npm test has FAIL / typecheck has error TS / build exit code non-zero)
    │   │
    │   ├── Yes → BUILD_ERROR
    │   │         ├── 1st time → Exec self-fix
    │   │         │              (read error → locate problem → fix → re-run)
    │   │         └── 2nd time → Tier-Mid analysis
    │   │                          (consult failure-catalog-en.md BUILD_ERROR analysis template)
    │   │
    │   └── No ↓
    │
    ├─ Functional test/success criteria failure?
    │   (commands output but success criteria check has verified: false)
    │   │
    │   ├── Yes → LOGIC_ERROR
    │   │         └── Tier-Mid analyzes root cause
    │   │              (consult failure-catalog-en.md LOGIC_ERROR analysis steps)
    │   │              ├── Exec misunderstood task → clarify and retry 1 time
    │   │              ├── Task description ambiguous → convert to DESIGN_ISSUE
    │   │              └── 3 same-type failures → escalate to Tier-A
    │   │
    │   └── No ↓
    │
    ├─ Beyond Scope Lock?
    │   (file_changes.out_of_scope non-empty, or concerns mentions needing to modify other files)
    │   │
    │   ├── Yes → SCOPE_DRIFT
    │   │         └── Tier-A evaluates
    │   │              ├── Expand Scope Lock → Exec retry
    │   │              ├── Guide alternative approach → Exec retry
    │   │              └── Task replanning → Tier-A re-decompose
    │   │
    │   └── No ↓
    │
    └─ Task itself ambiguous/boundary issue?
        (Exec says NEEDS_CONTEXT, or concerns mentions task description doesn't match code)
        │
        ├── Yes → DESIGN_ISSUE
        │         └── Tier-A replans
        │              (no retry, escalate immediately)
        │
        └── No → Reconfirm failure phenomenon
                 (return to Question 1, re-read evidence)
```

---

## Part 3: LOGIC_ERROR Root Cause Analysis Checklist (Tier-Mid Specific)

After receiving LOGIC_ERROR, Tier-Mid must answer each item:

- [ ] **Is the success criterion explicit?**
  (Vague criterion → redefine criterion, not Exec's fault. E.g., "code should be efficient" is not an explicit criterion)

- [ ] **Is Exec's implementation consistent with the literal meaning of the success criterion?**
  (Literally consistent but semantically different → DESIGN_ISSUE; literally inconsistent → LOGIC_ERROR, Exec's fault)

- [ ] **Is it a boundary condition issue?**
  (null, empty, max values unhandled. Yes → point out specific edge case, let Exec retry, but max 1 retry)

- [ ] **Does it require understanding other parts of the system to fix?**
  (Yes → DESIGN_ISSUE, escalate to Tier-A. Exec's context doesn't contain necessary information)

- [ ] **Have 3 same-type LOGIC_ERRORs occurred?**
  (Yes → systemic issue, must escalate to Tier-A for redesign. Not an execution problem, but a task decomposition problem)

---

## Part 4: Tier-Mid Response Template for Each Failure Type

### BUILD_ERROR Response Template (Tier-Mid → Tier-A or Fix Directly)

```markdown
## BUILD_ERROR Response

**Failed Task**: EXEC-xxx
**Error Summary**: [One-liner description, e.g., "TypeError: Cannot read property 'x' of undefined at line 45"]
**Which BUILD_ERROR**: [1 or 2]

**Tier-Mid Analysis**:
- Is error fixable within Exec's Scope Lock? [Yes/No]
- Is error a syntax error or logic error? [Syntax/Logic]
- Tier-Mid attempted fixes: [Describe what was tried]

**Action**:
- [ ] Tier-Mid fixes directly (syntax error, Tier-Mid can handle)
- [ ] Escalate to Tier-A (logic error, may be task decomposition issue)
- [ ] Convert to LOGIC_ERROR (after fixing BUILD_ERROR, functionality also wrong)

**Suggestion**: [One-liner explaining why this action was chosen]
```

---

### LOGIC_ERROR Response Template (Tier-Mid → Tier-A or Exec Retry)

```markdown
## LOGIC_ERROR Response

**Failed Task**: EXEC-xxx
**Failed Success Criterion**: [Copy verified: false criterion from exec-to-check.md success_criteria_check]
**Exec's Implementation**: [What Exec actually did, one-liner]
**Expected Behavior**: [What success criterion requires, one-liner]
**Deviation**: [Where they differ]

**Tier-Mid Root Cause Analysis** (check LOGIC_ERROR root cause checklist):
- Is success criterion explicit? [Yes/No, explain]
- Is implementation literally consistent with criterion? [Yes/No, explain]
- Is it a boundary condition issue? [Yes/No, explain]
- Does it require knowledge of other system parts? [Yes/No, explain]
- How many same-type LOGIC_ERRORs is this? [N times]

**Action**:
- [ ] Let Exec retry (supplement context: [what specifically to supplement])
- [ ] Convert to DESIGN_ISSUE (reason: [why believed to be task description issue])
- [ ] Tier-Mid fixes directly (reason: [why Tier-Mid more suitable than Exec])
- [ ] Escalate to Tier-A (reason: [why needs architectural resolution])
```

---

### DESIGN_ISSUE Response Template (Tier-Mid → Tier-A)

```markdown
## DESIGN_ISSUE Return Report

**Failed Task**: EXEC-xxx
**Return Type**: DESIGN_ISSUE

**Problem Description**:
[Where does the task description contradict actual code state? Or what necessary information is missing?]

**Exec's Feedback**:
[Copy Exec's explanation from exec-to-check.md concerns field]

**Tier-Mid Confirmation**:
- [ ] Do files/functions in task description exist? [Yes/No]
- [ ] Does success criterion contradict code state? [Yes/No]
- [ ] What context does Exec need? [Describe]

**Recommended Tier-A Action**:
- [ ] Update task description (fix outdated references)
- [ ] Re-decompose task (current boundary cannot complete, needs splitting)
- [ ] Supplement context (what information is Exec missing)
```

---

### SCOPE_DRIFT Response Template (Tier-Mid → Tier-A)

```markdown
## SCOPE_DRIFT Evaluation Request

**Failed Task**: EXEC-xxx
**Return Type**: SCOPE_DRIFT

**Out-of-Scope Modifications**:
[Copy from exec-to-check.md file_changes.out_of_scope]

**Exec's Justification**:
[Copy from concerns field Exec's explanation of why they need to modify these files]

**Tier-Mid Evaluation**:
- Are out-of-scope modifications necessary? [Yes/No, explain]
- Are there alternative implementations not requiring out-of-scope changes? [Yes/No, describe]
- If necessary, is expanding Scope Lock risk acceptable? [Low/Medium/High]

**Recommended Tier-A Action**:
- [ ] Approve expanded Scope Lock (reason: [why necessary])
- [ ] Guide Exec to alternative approach (approach: [describe])
- [ ] Replan task (reason: [why current task design unworkable])
```

---

*Phase 2 completed 2026-05-02*
