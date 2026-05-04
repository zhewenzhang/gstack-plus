# Superpowers Quality Skills Study Notes

> Day 9 | Deep analysis of verification-before-completion, systematic-debugging, test-driven-development

---

## Skill Overview

| Skill | Description | Core Principle |
|------|------|---------|
| `verification-before-completion` | Verification before claiming done | Evidence before assertion |
| `systematic-debugging` | Systematic debugging | Find root cause before fixing |
| `test-driven-development` | Test-driven development | No code without a failing test |

---

## 1. `verification-before-completion` — Verify Before Completion

### Literal Level: What Does It Do?

This skill defines an iron law: **before any claim of "done, fixed, passed," you must run the verification command and confirm the output.**

**Gate Function (5 steps):**

```
BEFORE claiming any state or expressing satisfaction:

1. IDENTIFY: What command would prove this claim?
2. RUN: Execute the full command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does the output confirm the claim?
   - No → state the actual condition + evidence
   - Yes → state the claim + evidence
5. Only at this point: can you make the claim

Skipping any step = lying, not verifying
```

**Common Failure Modes**:

| Claim | Requires | Not Sufficient |
|------|------|---------|
| Tests passed | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, inference |
| Build succeeded | Build command: exit 0 | Linter passed, logs look fine |
| Bug is fixed | Test original symptom: passes | Code changed, assumed fixed |
| Agent finished | VCS diff shows changes | Agent reported "success" |

**Red Flags (stop immediately)**:
- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- Preparing commit/push/PR without verification
- Trusting an agent's success report
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting to end work
- **Any wording implying success without running verification**

**Rationalization Prevention Table**:

| Excuse | Reality |
|------|------|
| "It should work now" | Run verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said it succeeded" | Independent verification |
| "I'm tired" | Fatigue is not an excuse |
| "Partial check is enough" | Partial proves nothing |
| "Rephrasing the rule means it doesn't apply" | Spirit over literal wording |

### Design Level: Why Is It Designed This Way?

#### Design Decision: "Evidence Before Assertion" — How Does This Differ from gstack's `/qa`?

**Core difference**: gstack's `/qa` is a "QA engineer role" — it uses the browser like a real user to test, finds bugs, and auto-fixes. superpowers' `verification-before-completion` is not a role but a **discipline rule**.

gstack's `/qa` says: "You are a QA engineer, test with the browser, find bugs, fix them, atomic commit."
superpowers' `verification-before-completion` says: "Before you claim completion, run the command, read the output, then you can say you're done."

**gstack is a process, superpowers is discipline**.

gstack's `/qa` relies on role definitions to ensure quality — when AI is told "you are a QA engineer," it works in a QA-like manner. superpowers doesn't rely on roles — it relies on hard rules: "you can't say you're done without running the verification command."

**Why superpowers chose discipline over role**:

Because superpowers observed 24 failure memories, and the most painful failure mode was: AI claimed completion but actually hadn't — tests didn't pass, functions weren't defined, requirements weren't met. This isn't a "role isn't good enough" problem — it's "AI made claims without evidence."

**Counterexample**: AI changed code, didn't run tests, said "tests should pass." Result: undefined function was pushed to production, application crashed. With verification-before-completion, AI would have run tests, seen the failure, fixed it, and then claimed completion.

---

## 2. `systematic-debugging` — Systematic Debugging

### Literal Level: What Does It Do?

`systematic-debugging` is a four-phase root-cause debugging process. Iron law: **no fix without root-cause investigation**.

**Four Phases (must be completed in order):**

**Phase 1: Root Cause Investigation**
```
1. Read the error message carefully (don't skip warnings)
2. Reproduce consistently (can you trigger it reliably? exact steps?)
3. Check recent changes (git diff, new dependencies, config changes)
4. Collect evidence across components in multi-component systems
   → Log input/output at each component boundary
   → Run once, find where it breaks
5. Trace data flow (trace upward from the error location to the source)
```

**Phase 2: Pattern Analysis**
```
1. Find similar working code in the codebase
2. Read the full reference implementation (don't skim)
3. List all differences (no matter how small)
4. Understand dependencies (what components, configs, environments are needed?)
```

**Phase 3: Hypothesis and Testing**
```
1. Form a single hypothesis ("I think X is the root cause because Y")
2. Minimal test (change only one variable)
3. Verify before continuing
   → Success → Phase 4
   → Failure → form new hypothesis (don't pile more fixes on top)
4. If you don't know, say you don't know (ask, research)
```

**Phase 4: Implementation**
```
1. Create a failing test case (simplest reproduction)
2. Implement a single fix (only solves the root cause, no "while I'm here" changes)
3. Verify the fix (did the test pass? did other tests break? is the problem truly solved?)
4. If the fix doesn't work:
   → < 3 attempts → go back to Phase 1
   → ≥ 3 attempts → stop → question the architecture (step 5)
5. 3+ failures → question the architecture
   → Each fix reveals new problems → the architecture is wrong
   → Discuss with user whether to refactor the architecture
```

**Red Flags (stop immediately and go back to Phase 1)**:
- "Quick fix for now, investigate later"
- "Just try changing X and see"
- "Add multiple changes, run tests"
- "Skip the test, manually verify"
- "Probably X, fix that"
- "One more fix attempt" (when already tried 2+ times)
- Each fix reveals new problems in different places

### Design Level: Why Is It Designed This Way?

#### Design Decision 1: Compared to gstack's `/investigate`, What Are the Core Differences?

**Similarities**:
- Both require finding root cause before fixing (Iron Laws are identical)
- Both have a 3-strike rule (3 failures → stop → question the architecture)
- Both require minimal fixes (no "while I'm here" changes)
- Both require regression testing (FAIL without fix, PASS with fix)

**Core Differences**:

| Dimension | gstack `/investigate` | superpowers `systematic-debugging` |
|------|----------------------|-----------------------------------|
| Scope Lock | PreToolUse hook physically restricts edit scope | No physical restriction, relies on discipline |
| Pattern Classification | 6 known patterns (Race condition, Nil propagation, etc.) | Find similar working code in the codebase |
| Multi-component Debugging | No dedicated handling | Phase 1.4: log input/output at each component boundary |
| External Search | `gstack-learnings-search` cross-project search | No cross-project search |
| Report Format | Standardized DEBUG REPORT template | No standard report format |

**superpowers' unique design**: Phase 1.4's "multi-component evidence collection" — add logs at each component boundary, run once, find where it breaks. This is more systematic than gstack's `/investigate` — gstack assumes the problem is in the code, superpowers assumes the problem could be "anywhere the data flows through" (environment, config, inter-component communication).

**gstack's unique design**: Scope Lock enforced via PreToolUse hook. superpowers has no such physical enforcement — it relies on discipline and a Red Flags table to prevent scope creep.

**Why the difference**: gstack is designed for Claude Code (which has hooks capability), superpowers is designed for multiple platforms (Claude Code, Copilot CLI, Gemini CLI). PreToolUse hooks are Claude Code-specific and not cross-platform. So superpowers chose "discipline + Red Flags" instead of "physical hook."

---

#### Design Decision 2: "3+ Failures → Question the Architecture" — It's Not That the Hypothesis Was Wrong, It's That the Architecture Was Wrong

**Decision**: When 3 hypotheses all fail, don't keep forming new hypotheses — stop and question the entire pattern/architecture.

**Why**: If every fix reveals a new problem (fix A and B breaks, fix B and C breaks), it's not that the code is wrong — it's that the design is wrong. Continuing to fix is just putting bandaids on symptoms.

**Identifying patterns**:
- Each fix reveals new shared state/coupling/problems in different places
- Fix requires "large-scale refactoring" to implement
- Each fix creates new symptoms elsewhere

These are saying: "this architecture is fundamentally broken," not "this code has a bug."

**Counterexample**: 3 fix attempts all failed, try a 4th. The 4th also fails. Wasted 4x the time, only to discover the entire data flow design was wrong — should have refactored from scratch instead of patching on a broken foundation.

---

## 3. `test-driven-development` — Test-Driven Development

### Literal Level: What Does It Do?

superpowers' TDD is the classic Red-Green-Refactor cycle, but with extremely strict rules.

**Iron Law**:

```
No production code without a failing test
```

If code was written before the test → **delete the code and start over from zero**.

**Red-Green-Refactor Cycle**:

```
RED → Write a failing test
  ↓
Verify RED → Confirm failure (not an error, an expected failure)
  ↓
GREEN → Write minimal code to make the test pass
  ↓
Verify GREEN → Confirm pass (and other tests aren't broken)
  ↓
REFACTOR → Clean up code (don't add behavior)
  ↓
Next → Next failing test
```

**Key Rules**:

1. **Delete code written first**: If implementation code was written first, don't "add tests later" — "delete the implementation and start over from the test."
2. **No exceptions**: Cannot keep as "reference," cannot "adapt while reading," cannot "explore first then test."
3. **Verify RED is mandatory**: The test must fail because of "missing functionality," not because of a typo or syntax error.
4. **Test-after ≠ TDD**: Test-after answers "what does this code do"; test-first answers "what should this code do."

**Why Order Matters (5 Common Excuses and Their Rebuttals)**:

| Excuse | Rebuttal |
|------|------|
| "I'll test after to verify" | Tests passing immediately proves nothing — you might be testing the wrong thing |
| "I already manually tested all edge cases" | Manual testing is improvised, not recorded, can't be re-run |
| "Deleting X hours of work is wasteful" | Sunk cost fallacy. Keeping untested code is the real technical debt |
| "TDD is dogmatic, pragmatism means adapting" | TDD *is* pragmatic: find bugs faster, prevent regressions, document behavior |
| "Test-after achieves the same goal" | No. Test-after verifies "you remembered all edge cases." Test-first discovers "the edge cases you forgot" |

### Design Level: Why Is It Designed This Way?

#### Design Decision 1: How Does superpowers' TDD Differ from Traditional TDD?

**Traditional TDD**: A development methodology that recommends writing tests first. But many teams "flexibly handle" it — sometimes write code then add tests, sometimes skip tests.

**superpowers' TDD**: A **discipline rule**, not a methodology. It says:
- Wrote code first? Delete it, start over.
- Thinking "just this once"? That's rationalization, stop.
- Thinking "too simple to need tests"? Simple code breaks too, tests take 30 seconds.

**Core difference**: Traditional TDD is a "best practice," superpowers' TDD is an "inviolable rule."

**Why**: Because superpowers learned from failure memories: when AI "flexibly handles" TDD, it almost always chooses "write code first, add tests later" — and the added tests almost always "pass immediately" as ineffective tests (testing existing behavior instead of expected behavior).

**Counterexample**: AI wrote a `retryOperation` function first, then wrote tests. Tests passed immediately because they tested "call mock 3 times" instead of "actual retry behavior." Test coverage is 100%, but the tests found no problems.

---

#### Design Decision 2: What Belief Do These Three Skills Collectively Reflect?

**Core belief: AI tends to claim completion without actually verifying (self-deception).**

All three skills prevent the same failure mode:

1. `verification-before-completion`: Prevents "claiming completion without running verification"
2. `systematic-debugging`: Prevents "claiming a fix without finding the root cause"
3. `test-driven-development`: Prevents "claiming to have tests when they were added after the fact"

They collectively reflect a painful observation: **AI will "feel" like it's done because it changed the code, but it hasn't actually run the code and looked at the result.**

**Why AI does this**: LLM training makes it tend toward "predicting the next step based on pattern matching" rather than "executing and observing the result." When it writes "correct code" (based on training data patterns), it "believes" it's correct — but it hasn't actually executed, so it doesn't know whether it's correct in the current environment.

**Common design pattern across these three skills**:
- **Iron Law**: Each skill has an inviolable rule (NO COMPLETION CLAIMS, NO FIXES WITHOUT ROOT CAUSE, NO PRODUCTION CODE WITHOUT FAILING TEST)
- **Red Flags**: Lists the "rationalizing thoughts" AI has when trying to skip discipline
- **Mandatory order**: Cannot skip steps, cannot "do X first and Y later"
- **Independent verification**: Don't trust AI's own judgment — must run commands and see output

---

## Philosophy Level: What Beliefs Does It Reflect?

**Belief 1: AI's "confidence" and "correctness" are two different things.**

All three skills say the same thing: AI feeling right doesn't count. Tests ran and passed — that counts. Root cause found — that counts. Code ran in the current environment with no issues — that counts.

This isn't distrust of AI — it's trust in evidence. AI's training data makes it good at predicting "code that looks correct," but prediction is not the same as verification.

**Belief 2: Discipline is more important than flexibility.**

None of these three skills have an "adjust based on the situation" option. They are mandatory, unskippable, and have no exceptions. Because the "super" in superpowers isn't about being "more flexible," it's about being "more disciplined."

**Belief 3: "Simple" and "urgent" are not reasons to skip discipline.**

"This problem is simple" → simple problems have root causes too.
"Urgent fix" → systematic debugging is faster than guessing.
"Just this once" → no exceptions.

The value of discipline is precisely demonstrated at the moments you most want to skip it — because those are the moments when skipping it costs the most.

---

### All Three Skills Are Indispensable: The Consequence of Removing Any One

| Keep Which Two | Remove Which | Specific Consequence |
|-----------|---------|---------|
| verification + debugging | TDD | AI writes code that "runs," but without pre-defined failure criteria. AI can write any implementation that makes tests pass, including hardcoded return values for known inputs. Tests passing doesn't mean logic is correct. |
| TDD + debugging | verification | AI follows the TDD process but doesn't run the full test suite before claiming completion. "This new test passed" doesn't mean "the previous 32 tests still pass." Regression bugs are discovered during review. |
| TDD + verification | debugging | When tests fail, AI guesses and changes direction repeatedly (try A, then B), instead of systematically isolating the root cause. After 3 attempts the problem may be worse because modifications stacked new side effects. |

---

## Compared to gstack: superpowers' Quality Skills Are Lighter, gstack's `/qa` Is Heavy. What Does This Tradeoff Tell Us?

**gstack's `/qa` is a "heavyweight process"**:
- Browser automation (persistent Chromium)
- Tests every affected page
- Health Score (8 categories weighted)
- Fix Loop (atomic commit per bug)
- Regression test generation

**superpowers' quality skills are "lightweight discipline"**:
- No browser — just running commands and checking output
- No health score — just test pass/fail
- No automated fix — just find root cause and fix manually
- No coverage audit — just TDD cycle

**This tradeoff reveals the different positioning of the two systems**:

| | gstack | superpowers |
|--|--------|-------------|
| Quality method | Process (QA engineer role) | Discipline (rules + verification) |
| Test depth | End-to-end (browser + user flows) | Unit (TDD + command verification) |
| Automation level | High (auto-fix, atomic commits) | Low (manual fix, discipline guarantee) |
| Applicable scenario | Web apps, UI-intensive | Any codebase, libraries, CLIs |
| Cost | High (browser, multiple specialists) | Low (just running commands) |

**gstack's `/qa` is suited for**: Web apps with UI, needing to ensure user flows work correctly.
**superpowers' quality skills are suited for**: Any codebase, especially backends, libraries, CLIs — scenarios with no UI to browser-test.

**Deeper insight**: gstack assumes the user is building web apps (so it has browser infrastructure); superpowers assumes the user is doing "any programming task" (so it only has generic command verification). gstack is more vertical, superpowers is more horizontal.

---

## Implications for gstack-plus

### Implication 1: "Evidence Before Assertion" Is the Core Verification Rule for Exec Model Output

After gstack-plus' Exec model (Qwen) completes a task and returns "done," the claim must be independently verified before acceptance — cannot just trust the Exec's report.

**Specific application**: Add a verification step in the handoff template:
```
Exec returns results
  → Claude independently verifies:
       ├── Run tests (not the ones Exec ran — Claude runs them)
       ├── Check diff (do changes match the task description?)
       ├── Check scope (no changes beyond allowed files?)
       └── All pass → accept
           → Any failure → return to Exec to fix
```

### Implication 2: Systematic Debugging's "Multi-Component Evidence Collection" Can Be Used for Cross-Model Collaboration Failure Diagnosis

When Exec model output has issues, don't just "fix" — add diagnostic logs between Claude and Exec:
- What command did Claude send?
- What command did Exec receive?
- What was Exec's output?
- What output did Claude receive?

This helps identify which stage the problem occurred at (unclear instruction? Exec misunderstanding? execution error?).

### Implication 3: TDD's "Delete Code Written First" Rule Is Too Strict, but the "Test-First" Mindset Is Worth Borrowing

**What TDD spirit means concretely in gstack-plus — Spec-first Execution**:

Don't require Qwen to write tests first (Qwen may not have access to the test framework), but require:

**Step 1**: When Claude dispatches a task, include a "success criteria" field in the prompt:
```
Success criteria:
- When input is null, function returns []
- When input is empty array [], function returns []
- When input is [1, 2, 3], function returns filtered results
- Running npm test src/utils/ all pass
```

**Step 2**: After Qwen completes, Claude verifies each success criterion one by one, not accepting claims of "logically should be satisfied."

**Why this is more useful than "TDD spirit"**:
It moves the "test-first mindset" from Qwen (not suited for design decisions) to Claude (which should define success criteria).
Each criterion can be verified with a command (falsifiable), excluding subjective judgments of "code looks correct."

### Implication 4: Universality of the 3-Strike Rule

All three quality skills have a "stop after 3 failures" pattern. This is a universal superpowers pattern:
- 3 verification attempts fail → stop, re-analyze
- 3 debugging hypotheses fail → stop, question the architecture
- TDD isn't the key point, but 3 rewrites still fail → stop, redesign

gstack-plus' failure escalation should also use this pattern: Exec fails 3 times → escalate to Tier-Mid for analysis → fails again → escalate to Tier-A.

### Implication 5: "Discipline > Role" Tradeoff

gstack uses roles ("you are a QA engineer") to ensure quality, superpowers uses discipline ("can't claim completion without verification") to ensure quality. gstack-plus can combine both:
- Define roles for each tier (Architect, Reviewer, Executor)
- But use discipline rules to guarantee each role's output quality (not relying on role self-discipline)

---

## What I Haven't Fully Understood Yet

- What are the 24 failure memories in `verification-before-completion` specifically? Are there extractable patterns?
- What are the concrete contents of `root-cause-tracing.md` and `defense-in-depth.md` auxiliary techniques in `systematic-debugging`?
- The `@testing-anti-patterns.md` reference in the TDD skill — what anti-patterns does this file specifically list?
- superpowers' quality skills don't mention "test coverage targets" (gstack has 60%/80% gates). How does superpowers determine tests are "sufficient"?

---

*Completed 2026-05-02*
