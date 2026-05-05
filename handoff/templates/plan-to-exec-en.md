# Plan → Exec Handoff

> Standard handoff format from Tier-A (Architect) → Tier-Exec (Executor).
>
> **Iron Rule**: Every field in this template is required. Leaving blank = invalid handoff, Exec has the right to refuse acceptance.

## Basic Information

- **Task ID**: `[Unique identifier, format EXEC-YYYYMMDD-NNN]`
- **Project**: `[Project name]`
- **Originating Tier**: Tier-A (Architect)
- **Executing Tier**: Tier-Exec (Executor)
- **Estimated Complexity**: `[Low / Medium]` (if rated "High", please re-evaluate whether this task should be executed by Tier-Exec)

---

## Task Description

`[Specific description, must include: file paths, line numbers (if applicable), what to do, what not to do]`

**Format Requirements**:
- Must cite specific file paths (e.g., `src/auth/login.ts`)
- If involving functions, must write function name, parameters, and return values explicitly
- If involving UI, must specify expected behavior ("After clicking button X, show a confirmation dialog")

**Forbidden Expressions**:
"appropriate", "reasonable", "if needed", "depending on the situation", "similarly", "and so on"

> If these words appear in the description, this handoff is considered不合格 (invalid), and Exec has the right to refuse.
> See `shared/forbidden-words-en.md` for details.

---

## Success Criteria

Must be conditions verifiable by commands (at least 2 items):

- [ ] [Criterion 1: e.g., "Run `npm test src/auth/` and all pass"]
- [ ] [Criterion 2: e.g., "`git diff` only touches the following 3 files"]
- [ ] [Criterion 3: if any]

**Validation Rule**: Each success criterion must be verifiable with a single command or specific operation. Subjective judgments like "code looks correct" are not accepted.

---

## Scope Lock

**Allowed Files to Modify**:
- `[File path 1]`
- `[File path 2]`

**Explicitly Forbidden Files or Directories**:
- `[If any, e.g., `src/db/migrations/` (do not modify database migration files)]`

**Handling Out-of-Scope Modifications**:
If Exec determines that files outside the allowed list need to be modified:
1. List the suggested additional files in the evidence
2. Explain why they are needed
3. Tier-Mid will decide whether to accept them during the review phase

---

## Context Snapshot

```yaml
context_snapshot:
  current_state: "[1-2 sentences describing the current state of relevant code, e.g., src/auth/login.ts currently uses JWT, refresh token not yet implemented]"
  recent_changes:
    - change: "[Summary of the most recent related change, e.g., last week changed session storage from cookie to localStorage]"
      commit: "[commit hash or PR number, if available; omit if not available]"
    - change: "[Earlier related changes, if any]"
      commit: ""
  known_dependencies:
    - "[Other components this task depends on, e.g., depends on generateToken() in src/utils/token.ts]"
  known_risks:
    - "[Potential issues the filer is aware of, e.g., timeout value is read by 3 UI components, changes may have cascading effects]"
```

**Filling Guidelines**:
- Only fill in known information. Omit uncertain fields — **do not write "uncertain" or "TBD"**.
- If there is no `recent_changes` history, the entire field can be omitted.
- `known_risks` is optional — if you know potential risks, filling them in can help Exec avoid pitfalls.

---

## Prompt Strategy Recommendation for Tier-Mid Tasks (Series 3 Findings)

> Applies to Tier-Mid tasks only. Experiments show S1 and S3 strategies make Sonnet surpass Opus on Mid tasks (15.0/15 vs 14.1/15).

**S1: Role + Depth Primer** (Recommended, Exp-3A best result)
```
You are a staff-level engineer at a fast-growing tech company. You provide thorough, technically precise feedback. You are opinionated — you give specific recommendations, not a list of options. You proactively surface non-obvious risks that junior engineers would miss. Your answers are comprehensive but concise.
```

**S3: Chain-of-Thought Trigger** (Second recommendation)
```
You are a senior staff engineer. Before answering, silently reason through: (1) what the actual technical risk is, (2) what a junior engineer would miss, (3) what the most actionable fix is. Then provide your final response — concise, specific, and immediately usable.
```

**Effect**: S1 makes Sonnet score 15.0/15 on Mid tasks (vs 13.7/15 without system prompt, vs Opus baseline 14.1/15).

---

## Failure Escalation Conditions

Stop immediately and return `exec-to-check.md` (with BLOCKED status) if:

- Modifying files outside the "allowed scope" is required to complete the task
- Encountering questions requiring architectural judgment (e.g., "uncertain whether approach A or B is better")
- Errors do not decrease after 2 consecutive attempts
- Finding inconsistency between task description and actual code state (e.g., referencing a non-existent function)

---

## Evidence Format Requirements

After completion, Exec must fill out `exec-to-check.md`. The evidence field format is specified in `shared/evidence-format-en.md`.

**Completion declarations without evidence are not accepted.**

---

## Usage Guide

1. **Tier-A fills in**: Complete all fields above, ensure task description contains no forbidden words, success criteria are verifiable, and Scope Lock is explicit
2. **Tier-A self-check**: After filling in, ask yourself: "Can a developer unfamiliar with this project complete the task just by reading this handoff?" If not → add more context
3. **Send to Tier-Exec**: Use this document as input for Exec
4. **Wait for return**: Exec returns `exec-to-check.md`, verify results against evidence

---

*Phase 1 completed 2026-05-02*
