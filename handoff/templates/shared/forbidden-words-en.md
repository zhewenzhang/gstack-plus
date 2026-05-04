# Forbidden Words Quick Reference

> For use by Tier-A (Architect). Before filling `plan-to-exec.md`, scan the task description.
> If any of the following words appear, they must be replaced before sending.
>
> **Core Principle**: Task descriptions must be executable by a "technically proficient but unfamiliar with this project" developer directly.

---

## Forbidden Words List

### ❌ "appropriate"

**Problem**: Exec will use their own standard to judge what is "appropriate" — but Exec lacks a global perspective, and their standard may not match the project.

**Replacement Approach**: Replace with specific conditions or standards.

```
❌ Wrong: "Add appropriate error handling"
✅ Correct: "If encountering NetworkError, retry 2 times (1 second apart), then return 500 status code"

❌ Wrong: "Use appropriate data structures"
✅ Correct: "Use Map<string, User>, with userId as key"

❌ Wrong: "Set appropriate timeout"
✅ Correct: "Set timeout to 30 seconds"
```

---

### ❌ "reasonable"

**Problem**: Same as "appropriate" — Exec's "reasonable" may not be correct.

**Replacement Approach**: Replace with measurable standards.

```
❌ Wrong: "Ensure performance is reasonable"
✅ Correct: "Ensure response time does not exceed 100ms"

❌ Wrong: "Code structure should be reasonable"
✅ Correct: "Pass lint rule checks, cyclomatic complexity < 10"

❌ Wrong: "Return reasonable error messages"
✅ Correct: "Return objects in format { error: string, code: number }"
```

---

### ❌ "if needed"

**Problem**: Exec will typically choose "not needed" — because it's the fastest path to completing the task.

**Replacement Approach**: Explicitly tell Exec whether it's "required" or "not needed."

```
❌ Wrong: "Add log output if needed"
✅ Correct: "Must add log output, format: [INFO][timestamp][functionName] message"

❌ Wrong: "Handle edge cases if needed"
✅ Correct: "Must handle the following edge cases: null input, empty arrays, arrays exceeding 1000 elements"

❌ Wrong: "Update tests if needed"
✅ Correct: "Must add tests for new functions, covering null input, normal input, edge cases"
```

---

### ❌ "depending on the situation" / "it depends"

**Problem**: Pushes decision to Exec, but Exec lacks the global perspective to make that decision.

**Replacement Approach**: Make the decision before dispatching, write it explicitly into the task description.

```
❌ Wrong: "Display different content based on user role"
✅ Correct: "Admin users see all data, viewer users only see name and email fields"

❌ Wrong: "Choose different database config based on environment"
✅ Correct: "Use SQLite for development environment, PostgreSQL for production environment"
```

---

### ❌ "similarly" / "and so on" / "likewise"

**Problem**: Exec may infer wrong analogies. Every location that needs modification must be listed explicitly.

**Replacement Approach**: Explicitly list all locations that need modification.

```
❌ Wrong: "Add loading state to User component, handle other components similarly"
✅ Correct: "Add loading state to the following components:
          - src/components/User.tsx
          - src/components/Order.tsx
          - src/components/Product.tsx
          Implementation: add isLoading prop, show <Spinner /> when true"

❌ Wrong: "Add pagination to getAll function, and so on for other CRUD functions"
✅ Correct: "Add pagination to the following functions:
          - getAllUsers(page, limit)
          - getAllOrders(page, limit)
          - getAllProducts(page, limit)
          Return format: { data: T[], total: number, page: number, limit: number }"
```

---

## Quick Self-Check

After filling in the task description, ask yourself this test question:

> **Can a "technically proficient but completely unfamiliar with this project" developer execute this directly?**

- **Yes, no additional info needed** → ✅ Pass
- **Needs guessing at some details** → ❌ Fail, add specific conditions
- **Needs to know project-specific conventions** → ❌ Fail, add context snapshot

---

## Common Patterns Quick Reference

| Vague Expression | Problem | Specific Replacement |
|------------------|---------|----------------------|
| "Handle errors" | What errors? How to handle? | "If catching TypeError, return 400; if catching NetworkError, retry once then return 503" |
| "Optimize performance" | Optimize what? How to measure? | "Reduce getUsers response time from 500ms to under 100ms using Redis caching" |
| "Improve code quality" | What counts as improved? | "Reduce cyclomatic complexity from 15 to under 8 by extracting functions" |
| "Ensure security" | Which security issues? | "Add CSRF token validation, prevent SQL injection (use parameterized queries)" |
| "Update documentation" | Which docs? | "Update README.md Installation and Usage sections to reflect new environment variable requirements" |

---

*Phase 1 completed 2026-05-02*
