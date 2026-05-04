# Pre-Flight Checklist

> The "pre-launch checklist" from Tier-A (Architect) before dispatching tasks to Tier-Exec.
>
> **Design Source**: PROJECT_ROADMAP.md Task 2.1 + spirit of superpowers `verification-before-completion`.
>
> **When to Use**: After filling out plan-to-exec.md handoff, before formal dispatch.
> **Filer**: Tier-A (Claude Architect).
> **Recording Method**: Attach the passed checklist to the end of plan-to-exec.md.

---

## Rules

1. **Check Each Item**: Every checklist item must be confirmed, none skipped
2. **Any Item ❌**: Cannot dispatch, must fix plan-to-exec.md first
3. **After Fixing**: Re-check the entire checklist, not just the fixed item
4. **Record**: After passing, attach the full checklist to the end of plan-to-exec.md

---

## Section A: Task Description Clarity (6 Items)

- [ ] **A1.** Task description has specific file paths (e.g., `src/xxx.ts` line N)
- [ ] **A2.** Task description contains no forbidden words (reference `handoff/templates/shared/forbidden-words-en.md`)
- [ ] **A3.** Success criteria has at least 2 conditions verifiable by commands (not subjective judgment)
- [ ] **A4.** Explicitly lists files or directories that "must not be modified" (Scope Lock defined)
- [ ] **A5.** Boundary conditions considered (null, empty values, max values, error input handling described)
- [ ] **A6.** Task does not depend on "other tasks not yet completed" (if there are dependencies, complete them first before dispatching)

---

## Section B: Tier Assignment Reasonableness (3 Items)

- [ ] **B1.** Task scored using `classifier/scoring-guide.md`
- [ ] **B2.** Scoring result supports routing to Tier-Exec (Judgment ≤ 2 AND Context ≤ 2 AND Verifiability ≥ 4)
      (If not matching, re-route to correct Tier)
- [ ] **B3.** No "looks simple but is actually Tier-A" hidden decisions
      (Self-ask: If Exec encounters unexpected situations, will they need architectural judgment?)

---

## Section C: Failure Return Preparation (3 Items)

- [ ] **C1.** "Failure Escalation Conditions" defined (corresponding field in plan-to-exec.md filled)
- [ ] **C2.** Maximum retry count for Exec is clear (default: BUILD_ERROR can retry 1 time, others do not retry)
- [ ] **C3.** If Exec returns BLOCKED, clear who takes over (Tier-Mid or Tier-A)

---

## Launch Decision

**Section A All Pass**: [ Yes / No ]
**Section B All Pass**: [ Yes / No ]
**Section C All Pass**: [ Yes / No ]

**Decision**:
- ✅ **All Pass** → Can dispatch to Tier-Exec
- 🚫 **Any ❌** → Fix and re-check entire checklist, do not dispatch

---

## Quick Reference Card

| Category | Key Question | Pass Condition |
|----------|-------------|----------------|
| **Description** | Can an unfamiliar developer execute this? | No guessing, directly executable |
| **Criteria** | Can success be verified with commands? | ≥ 2 executable commands |
| **Scope** | What changes, what doesn't? | File list explicit |
| **Tier** | Does scoring justify Exec? | Routing rules validated |
| **Return** | Who's responsible on failure? | Escalation path clear |

---

## Usage Example

```
Task: Add new formatCurrency(amount: number, currency: string) in src/utils/formatter.ts
Project: gstack-plus

Section A:
- [x] A1. File path explicit: src/utils/formatter.ts
- [x] A2. No forbidden words: description contains no "appropriate", "reasonable", etc.
- [x] A3. Success criteria: "npm test src/utils/ all pass", "git diff only touches formatter.ts"
- [x] A4. Scope Lock: allowed to modify formatter.ts, forbidden to modify other files
- [x] A5. Boundary conditions: null → throw error, 0 → "¥0.00", negative → "-¥X.XX"
- [x] A6. No dependencies: does not depend on other incomplete tasks

Section B:
- [x] B1. Scored: Judgment=2, Context=1, Risk=1, Verifiability=4, Creativity=1
- [x] B2. Routing validated: Judgment≤2 AND Context≤2 AND Verifiability≥4 → Tier-Exec
- [x] B3. No hidden decisions: function implementation has explicit spec, no architectural judgment needed

Section C:
- [x] C1. Failure escalation conditions: modifying other files → BLOCKED; encountering architectural judgment → BLOCKED
- [x] C2. Retry count: BUILD_ERROR can retry 1 time
- [x] C3. BLOCKED handler: Tier-Mid analyzes → if replanning needed, escalate to Tier-A

Launch Decision:
Section A All Pass: Yes
Section B All Pass: Yes
Section C All Pass: Yes
Decision: ✅ Can dispatch to Tier-Exec
```

---

*Phase 2 completed 2026-05-02*
