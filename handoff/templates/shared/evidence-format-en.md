# Evidence Format Specification

> Unified standard for evidence fields across all handoff templates.
>
> **Design Belief**: Evidence precedes assertions. AI tends to claim completion without verification — the evidence field forces every completion claim to have verifiable supporting material.

---

## Why Evidence is Needed

**Problems it Prevents**:

1. **Claiming completion without running verification**: Exec modified code and claims "done" without running tests to check results
2. **Claiming completion but running wrong verification**: Exec ran tests, but not testing the success criteria defined in the handoff
3. **Claiming completion but making out-of-scope modifications**: Exec modified files outside Scope Lock without reporting
4. **Claiming completion but hiding problems**: Exec completed but has unreported concerns

**Core Principles**:
- Every completion claim must have evidence
- Evidence must be verifiable (command output, git diff, file state)
- Evidence must be complete (no truncation of critical information)

---

## Complete Field Descriptions

### commands_run (Required)

List of all validation commands executed by Exec.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `command` | string | ✅ | Actually executed command |
| `output` | string | ✅ | Command output. If too long, paste first 5 lines + `...` + last 3 lines |
| `status` | enum | ✅ | `passed` or `failed` |

**Format Requirements**:
- At least 1 command
- Commands must be actually executed, not speculative "should pass"
- If a command failed, `status` is `failed`, `output` includes full error

**Example**:
```yaml
commands_run:
  - command: "npm test src/auth/login.test.ts"
    output: "PASS src/auth/login.test.ts\n  ✓ should login with valid credentials\n  ✓ should reject invalid password\n  ✓ should handle network error\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total"
    status: "passed"
```

### file_changes (Required)

List of all files modified by Exec.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `modified` | string[] | ✅ | Actually modified files (obtained from git diff) |
| `planned` | string[] | ✅ | Handoff-allowed files (copied from plan-to-exec.md Scope Lock) |
| `out_of_scope` | string[] | ✅ | Files outside Scope Lock. Fill `[]` if none |

**Validation Rules**:
- Each file in `modified` must be in `planned` or in `out_of_scope`
- When `out_of_scope` is non-empty, Exec must explain why in concerns

### success_criteria_check (Required)

Validation results for each success criterion in the handoff.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `criterion` | string | ✅ | Original success criterion (copied from plan-to-exec.md) |
| `verified` | boolean | ✅ | `true` = passed, `false` = failed |
| `evidence` | string | ✅ | How it was verified (description or command output reference) |

**Validation Rules**:
- Entry count must equal the success criteria count in plan-to-exec.md
- Any `verified: false` means the task is incomplete
- `evidence` cannot be "code looks correct" — must be specific verification action

---

## Complete Examples

### Example 1: Normal Completion (DONE)

```yaml
evidence:
  commands_run:
    - command: "npm test src/auth/"
      output: "Test Suites: 3 passed, 3 total\nTests:       18 passed, 0 failed"
      status: "passed"
    - command: "npm run typecheck"
      output: "Found 0 errors."
      status: "passed"

  file_changes:
    modified: ["src/auth/login.ts", "src/auth/token.ts"]
    planned: ["src/auth/login.ts", "src/auth/token.ts"]
    out_of_scope: []

  success_criteria_check:
    - criterion: "Run npm test src/auth/ and all pass"
      verified: true
      evidence: "npm test output shows 18 passed, 0 failed"
    - criterion: "git diff only touches login.ts and token.ts"
      verified: true
      evidence: "git diff --name-only output shows only these two files"
```

### Example 2: Completion with Concerns (DONE_WITH_CONCERNS)

```yaml
evidence:
  commands_run:
    - command: "npm test src/utils/"
      output: "Test Suites: 2 passed, 2 total\nTests:       12 passed, 0 failed"
      status: "passed"
    - command: "npm run lint"
      output: "3 warnings:\n  Line 45: 'data' is assigned but never used\n  Line 67: Unexpected console statement\n  Line 89: Missing return type"
      status: "passed"

  file_changes:
    modified: ["src/utils/format.ts"]
    planned: ["src/utils/format.ts"]
    out_of_scope: []

  success_criteria_check:
    - criterion: "Run npm test src/utils/ and all pass"
      verified: true
      evidence: "12 passed, 0 failed"
    - criterion: "lint has no errors"
      verified: true
      evidence: "lint returned passed, but with 3 warnings"

# Concern field (outside evidence):
# Concern: lint has 3 warnings, including 'Unexpected console statement' which was required by the task
# Impact: These warnings won't prevent code from running, but may affect CI lint score
# Suggestion: CI config should allow warnings, or we should handle them uniformly
```

### Example 3: Failure Return (BLOCKED)

```yaml
evidence:
  commands_run:
    - command: "npm test src/api/user.test.ts"
      output: "FAIL src/api/user.test.ts\n  ✕ should handle concurrent requests\n    expect(received).toBe(expected)\n    Expected: 1\n    Received: 3"
      status: "failed"

  file_changes:
    modified: ["src/api/user.ts"]
    planned: ["src/api/user.ts"]
    out_of_scope: []

  success_criteria_check:
    - criterion: "Run npm test src/api/user.test.ts and all pass"
      verified: false
      evidence: "should handle concurrent requests test failed — expected 1 result but received 3"
```

---

## Common Filling Mistakes

### Mistake 1: Empty Evidence

```yaml
# ❌ Wrong:
evidence: {}

# ✅ Correct: Fill in all required fields
```

### Mistake 2: Commands are Speculative, Not Actually Executed

```yaml
# ❌ Wrong:
commands_run:
  - command: "npm test src/auth/"
    output: "Should pass, because I checked the code logic"
    status: "passed"

# ✅ Correct:
commands_run:
  - command: "npm test src/auth/"
    output: "Test Suites: 1 passed, 1 total\nTests: 3 passed, 3 total"
    status: "passed"
```

### Mistake 3: Out-of-Scope Modifications Not Reported

```yaml
# ❌ Wrong:
file_changes:
  modified: ["src/api/user.ts", "src/utils/helpers.ts"]
  planned: ["src/api/user.ts"]
  out_of_scope: []  # ← helpers.ts is not in planned, but this is empty

# ✅ Correct:
file_changes:
  modified: ["src/api/user.ts", "src/utils/helpers.ts"]
  planned: ["src/api/user.ts"]
  out_of_scope: ["src/utils/helpers.ts"]
```

### Mistake 4: Incomplete Success Criteria Check

```yaml
# ❌ Wrong (handoff has 3 criteria, only 1 checked here):
success_criteria_check:
  - criterion: "Run npm test src/auth/ and all pass"
    verified: true
    evidence: "18 passed"

# ✅ Correct (all 3 checked):
success_criteria_check:
  - criterion: "Run npm test src/auth/ and all pass"
    verified: true
    evidence: "18 passed"
  - criterion: "git diff only touches login.ts"
    verified: true
    evidence: "git diff --name-only only has login.ts"
  - criterion: "TypeScript compiles"
    verified: true
    evidence: "tsc output shows Found 0 errors"
```

---

*Phase 1 completed 2026-05-02*
