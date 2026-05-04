# Review/Quality Skills Learning Notes

> Day 3-4 | Deep analysis of `/review`, `/qa`, `/investigate`

---

## Skills Overview

| Skill | Version | Preamble Tier | Role |
|------|------|--------------|------|
| `/review` | 1.0.0 | 4 | Pre-landing PR structural review |
| `/qa` | 2.0.0 | 4 | Browser testing + auto-fix |
| `/investigate` | 1.0.0 | **2** | Root cause debugging (debugging speed priority) |

---

## Part I: `/review` — Pre-Landing PR Review

### Literal Layer: What Does It Do?

`/review` analyzes diffs before code is merged, looking for "structural issues that tests cannot catch." It doesn't just look at code quality—it first asks "did you build the right thing?"

Complete workflow (7 steps):

```
Step 0: Detect platform and base branch (GitHub/GitLab/git-native)
Step 1: Confirm on feature branch (otherwise stop)
Step 1.5: Scope Drift Detection
   ├── SCOPE CREEP: Changes beyond plan scope
   └── MISSING REQUIREMENTS: Incomplete parts from plan
Plan Completion Audit:
   ├── Extract up to 50 actionable items from plan file
   ├── Cross-reference with diff: DONE/PARTIAL/NOT DONE/CHANGED
   └── Deep investigation of why each PARTIAL/NOT DONE
Step 2: Read checklist.md (not skippable, fail = stop)
Step 2.5: Greptile integration (optional)
Step 3: Get diff (git fetch + git diff)
   ├── Step 3.4: Version queue status (advisory)
   └── Step 3.5: Slop Scan (AI code quality scan)
Prior Learnings: Cross-project learning search
Step 4: Critical Pass (core review)
   └── Confidence calibration: 1-10 score
Step 4.5: Review Army — Parallel Specialist Dispatch
   ├── Always-on: Testing, Maintainability (when >50 lines)
   ├── Conditional: Security (with auth/backend), Performance, Data Migration, API Contract, Design
   ├── Adaptive gating: 10+ times with no findings → auto-skip
   └── Red Team: Activated when DIFF > 200 lines or CRITICAL findings
Step 4.6: Merge findings, PR Quality Score
Step 5+: Fix-First (AUTO-FIX vs ASK classification)
```

### Scope Drift Detection Details

```
Scope Check: [CLEAN / DRIFT DETECTED / REQUIREMENTS MISSING]
Intent: <one-line description of what was requested>
Plan: <plan file path>
Delivered: <one-line description of what diff actually did>
Plan items: N DONE, M PARTIAL, K NOT DONE
```

5 possible reasons for investigating PARTIAL/NOT DONE:
- **Scope cut** — Intentionally removed (revert commit, deleted TODO)
- **Context exhaustion** — Started but stopped (incomplete, no follow-up commits)
- **Misunderstood requirement** — Built, but doesn't match plan description
- **Blocked by dependency** — Dependency not in place
- **Genuinely forgotten** — No evidence of any attempt

### Review Army Parallel Architecture

```
Step 4.5 ─── Detect STACK + DIFF_LINES
               │
               ├── Always-on (50+ lines)
               │     ├── Testing Specialist
               │     └── Maintainability Specialist
               │
               ├── Conditional
               │     ├── Security (when auth/backend present)
               │     ├── Performance
               │     ├── Data Migration
               │     ├── API Contract
               │     └── Design
               │
               └── Agent tool (launch all specialists in parallel)
                     │
                     └── Each specialist outputs JSON findings
                           └── Dedup: same fingerprint → confidence +1
```

**Red Team** — Only activated for large diffs (>200 lines) or when CRITICAL findings exist, purpose is to find known specialist blind spots.

**Slop Scan** — Scans for AI code-specific issues: empty catch blocks, redundant `return await`, over-abstraction.

**Confidence output format:**
```
[P1] (confidence: 9/10) app/models/user.rb:42 — SQL injection via string interpolation
[P2] (confidence: 5/10) controller.rb:18 — Possible N+1 (medium confidence — verify)
```

---

## Part II: `/qa` — Test → Fix → Verify

### Literal Layer: What Does It Do?

`/qa` is a "QA Engineer + Fix Engineer" combined. It tests the application like a real user using a browser, finds bugs, auto-fixes the source code, each fix as an atomic commit, then re-verifies.

**Three Tiers:**

| Tier | Fix Scope | Use Case |
|------|---------|---------|
| Quick | Critical + High | Quick confirmation |
| Standard | + Medium | **Default** |
| Exhaustive | + Low/Cosmetic | Full run |

**Four Modes:**

| Mode | Trigger Condition | Description |
|------|---------|-----|
| Diff-aware | Feature branch, no URL | **Most common**, auto-analyzes branch diff |
| Full | URL provided | Systematically explore all pages |
| Quick | `--quick` | 30-second smoke test |
| Regression | `--regression <baseline>` | Compare against baseline.json |

### Workflow Details

**Prerequisite: Working tree must be clean**
```bash
git status --porcelain
# If uncommitted changes → forced choice: Commit / Stash / Abort
```

**Diff-aware mode flow:**
```
Analyze git diff main...HEAD --name-only
   → Identify affected pages/routes
      ├── Controller files → Corresponding URL paths
      ├── Component files → Corresponding rendered pages
      └── API endpoints → Direct fetch() testing

Detect running application:
   → localhost:3000 / :4000 / :8080 / PR staging URL

For each affected page:
   → navigate → screenshot → console errors → test interactions
```

**Test framework auto-bootstrap:**
If no test framework → ask → install → create TESTING.md → update CLAUDE.md

**QA Health Score (8 categories weighted average):**

| Category | Weight | Deduction Rules |
|------|------|---------|
| Functional | 20% | Critical -25, High -15, Medium -8, Low -3 |
| Console | 15% | 0 errors=100, 1-3=70, 4-10=40, 10+=10 |
| UX | 15% | Same as Functional |
| Accessibility | 15% | Same as Functional |
| Performance | 10% | Same as Functional |
| Links | 10% | Each broken link -15 |
| Visual | 10% | Same as Functional |
| Content | 5% | Same as Functional |

**Phase 8: Fix Loop (per bug flow):**
```
1. Locate source (read source code)
2. Write regression test (write test first: should FAIL without fix)
3. Fix the bug
4. Run test suite (new test passes, no regressions)
5. Atomic commit: "fix: [description of issue]"
6. Re-verify in browser (screenshot before/after)
7. Update report with fix evidence
```

**12 Key Rules (excerpt of most critical):**
1. **"Never read source code. Test as a user, not a developer."**
2. **"Never refuse to use the browser."** — Even if diff has no UI changes, backend changes also affect behavior
3. **"Depth over breadth."** — 5-10 issues with evidence > 20 vague descriptions
4. **"Write incrementally."** — Record one at a time as found, don't batch

---

## Part III: `/investigate` — Systematic Debugging

### Literal Layer: What Does It Do?

`/investigate` is systematic root cause debugging. Iron Law: **"NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST."**

Note: preamble-tier is **2** (review/qa are 4), meaning debugging scenarios need faster startup—shorter preamble, skipping more feature discovery.

**Unique mechanism: Has PreToolUse Hooks**
```yaml
hooks:
  PreToolUse:
    - matcher: "Edit"
      command: check-freeze.sh  # Enforced scope boundary check
    - matcher: "Write"
      command: check-freeze.sh
```

This means `/investigate` actively integrates with `/freeze`, preventing unintended code modifications outside scope during debugging.

### Workflow (5 Phases)

**Phase 1: Root Cause Investigation**
```
1. Collect symptoms (error messages, stack traces, reproduction steps)
2. Read code: Trace from symptoms back to possible causes
3. Check recent changes: git log --oneline -20 -- <affected-files>
4. Can it be deterministically reproduced?
5. Search learnings (repeated bugs in the same file = architecture issue)
```

Output: **"Root cause hypothesis: ..."** — A specific, testable hypothesis

**Scope Lock (Freeze Mechanism):**
```bash
# Lock immediately after forming hypothesis
echo "<narrowest-dir>/" > $GSTACK_HOME/freeze-dir.txt
# Notify user: "Edits restricted to <dir>/ for this debug session"
#解除: /unfreeze
```

**Phase 2: Pattern Analysis (6 Known Patterns)**

| Pattern | Characteristics | Where to Look |
|------|------|---------|
| Race condition | Timing-dependent, intermittent | Concurrent access to shared state |
| Nil/null propagation | NoMethodError, TypeError | Missing guard on optional values |
| State corruption | Data inconsistency | Transactions, callbacks, hooks |
| Integration failure | Timeouts, unexpected responses | External APIs, service boundaries |
| Configuration drift | Works locally, fails on staging | Env vars, feature flags |
| Stale cache | Shows old data | Redis, CDN, browser cache |

External search rules: **sanitize first** — Strip hostnames, IPs, paths, SQL fragments, customer data, only search error types and framework context.

**Phase 3: Hypothesis Testing**
```
1. Add temporary log/assertion at suspected root cause location
2. If hypothesis is wrong: Search (sanitized) → back to Phase 1
3. 3-strike rule: 3 hypotheses fail → STOP → AskUserQuestion
   A) Continue: I have a new hypothesis
   B) Escalate to human review
   C) Add logging, wait for next capture
```

**Red Flags (Signals to Slow Down):**
- "Quick fix for now" — There's no "for now," either fix it or escalate
- Proposing a fix before tracing data flow — You're guessing
- Every fix introduces new problems — The level is wrong, not the code

**Phase 4: Implementation**
```
1. Fix the root cause, not the symptom
2. Minimum diff (fewest files, fewest lines)
3. Regression test: FAIL without fix, PASS with fix
4. Run full test suite
5. If fix touches >5 files → AskUserQuestion (blast radius warning)
```

**Phase 5: Verification & Report**

```
DEBUG REPORT
════════════════════════════════════════
Symptom:         [What the user observed]
Root cause:      [What actually went wrong]
Fix:             [What changed, file:line]
Evidence:        [Test output, reproduction confirmed fixed]
Regression test: [New test file:line]
Related:         [TODOS.md entries, prior bugs in same area]
Status:          DONE | DONE_WITH_CONCERNS | BLOCKED
════════════════════════════════════════
```

**Rules (the 4 most important):**
- **"Never say 'this should fix it.'"** — Verify and prove it, run tests
- **"Never apply a fix you cannot verify."**
- **"3+ failed fix attempts → STOP and question the architecture."** — Architecture problem, not wrong hypothesis
- **"If fix touches >5 files → AskUserQuestion"**

---

## Design Layer: Why Is It Designed This Way?

### Design Decision 1: `/review` Asks "Did You Build the Right Thing?" First

**Decision**: Step 1.5 (Scope Drift Detection) is placed before code quality review.

**Why**: Code can be written well, but if you built the wrong thing, all code quality is wasted. Confirm the direction first, then review the details.

**Counter-example**: Traditional code reviews go straight to code quality, potentially giving a thorough review to a feature that shouldn't exist.

---

### Design Decision 2: `/review`'s Review Army Parallel Architecture

**Decision**: All specialists are launched simultaneously via Agent tool in the same message.

**Why**:
1. **Bias isolation** — Each subagent has a fresh context, preventing earlier findings from influencing subsequent judgments
2. **Speed** — N specialists in parallel vs sequential, speed approaches that of 1 specialist
3. **Adaptive gating** — If a type of issue hasn't been found in 10 times, auto-skip to save resources

**Counter-example**: In sequential review, a reviewer who spots a security issue first may be more alert to subsequent performance issues (carried bias).

---

### Design Decision 3: `/qa` Enforces "Working Tree Must Be Clean"

**Decision**: `/qa` checks `git status --porcelain` before starting; if there are uncommitted changes, STOP.

**Why**: Each bug fix needs to be an atomic commit. If the working tree already has changes, the fix's commit will mix in unrelated changes, breaking atomicity and making subsequent git blame and rollback difficult.

**Counter-example**: If QA on a dirty working tree is allowed, a commit fixing 3 bugs may mix in other pre-existing changes, making `git log` unable to clearly track each bug fix.

---

### Design Decision 4: `/investigate`'s Scope Lock Mechanism

**Decision**: After forming a hypothesis, immediately lock the edit scope to the narrowest relevant directory, enforced via PreToolUse Hook.

**Why**: "While I'm at it" changes (scope creep) during debugging are the most dangerous—you fix one bug while unintentionally introducing another. The Hook enforces mechanically (not through self-discipline), which is more reliable.

**Counter-example**: Without scope lock, debugging `src/auth/` while "optimizing" `src/utils/` passes tests but causes new problems in production.

---

### Design Decision 5: `/qa`'s "Never Read Source Code" Rule

**Decision**: `/qa` doesn't read source code, only tests like a user. Even if diff has no UI changes, the browser must be opened.

**Why**: QA engineers who read source code will unconsciously "know how it should work," testing "theoretical behavior" rather than "actual behavior." Real users don't read source code, and neither should QA.

**Counter-example**: Reading the source code and knowing "this button calls API X," then directly testing the API while skipping the button's DOM event. But when users click the button, the DOM may not have an event handler bound at all.

---

### Design Decision 6: `/investigate`'s Preamble-Tier 2

**Decision**: `/investigate` only has tier 2 preamble, much lighter than review/qa.

**Why**: Debugging is an emergency task. When users report a bug, they want to get into debugging quickly. If AI spends time on telemetry prompts, feature discovery, and upgrade checks first, the user experience is terrible.

**Counter-example**: User says "production 500 error!" and AI starts asking "Do you want to enable telemetry?"—that's the wrong priority.

---

### Design Decision 7: Cross-Project Learnings Opt-In Mechanism

**Decision**: All three skills use `gstack-learnings-search`, asking on first use whether to enable cross-project learnings, then remembering the choice.

**Why**: Independent developers (solo) can benefit from cross-project learning (similar auth bugs appear across different projects); multi-client agencies don't want project A's knowledge polluting project B. The choice should be up to the user, and asked only once.

---

## Philosophy Layer: What Beliefs Does It Reflect?

**Belief 1: Structural issues are more dangerous than code quality issues**.

`/review`'s Scope Drift Detection and Plan Completion Audit both ask "did you build the right thing?"—this is more important than "is your code written well?" Wrong code can be rewritten; wrong functionality requires throwing away all the work.

**Belief 2: AI code needs AI-specific quality gates**.

Slop Scan, multi-specialist parallel architecture, Red Team, and other mechanisms all reflect an acknowledgment of "special defect patterns in AI-generated code." Empty catch blocks, redundant awaits, and over-abstraction are unique problems in AI code, requiring targeted tools.

**Belief 3: Reproducibility is the prerequisite for all quality work**.

`/qa`'s "each issue must have a screenshot," `/investigate`'s "can it be deterministically reproduced?", "stop after 3 failed hypotheses"—all say: without a reproducible issue, nothing can be verified. Better to say "cannot confirm" than "this should be fixed."

**Belief 4: Preventing scope creep is the core of engineering discipline**.

`/review`'s Scope Drift Detection, `/investigate`'s Scope Lock, `/qa`'s atomic commit requirement—all three skills tackle the "boundary ambiguity" problem from different angles. Each skill contains mechanisms to enforce scope, not just recommendations.

---

## Three-Skill Collaboration Relationships

```
                     ┌──────────────┐
                     │  /autoplan   │
                     │  (Coordinator)    │
                     └──────┬───────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
  │  /review    │   │   /qa        │   │ /investigate │
  │  Before PR  │   │  After feature│   │  When bug    │
  │  merge      │   │  complete     │   │  appears     │
  └─────────────┘   └──────────────┘   └──────────────┘
         │                  │                  │
         └──────────────────┴──────────────────┘
                    Shared: learnings JSONL
                    Before/After: plan-eng-review → qa (test plan passed)
```

**Key collaboration points:**
- `plan-eng-review` writes test plans to `~/.gstack/projects/`, `/qa` reads them automatically
- `autoplan` calls these three skills to form a complete quality pipeline
- All three skills read and write `learnings.jsonl`, knowledge is shared between skills

---

## Inspiration for gstack-plus

### Inspiration 1: Parallel Sub-Agents = Quality Multiplier, Not Complexity

Review Army achieves with parallel agents: not slow (parallel) + bias isolation (independent context) + adaptive skipping (specialists with 0 findings skipped next time).

**In gstack-plus**: After the Exec model (Qwen) completes code, Claude can dispatch multiple lightweight agents in parallel for specialized validation (security, performance, test coverage), rather than sequentially.

### Inspiration 2: "Working Tree Must Be Clean" Is a Version Control Philosophy, Not Just a QA Rule

Each atomic commit represents a complete unit of thought. `/qa` enforces this because: atomic commits make git history a debuggable asset, not noise.

**In gstack-plus**: When Qwen executes tasks, Claude should require each independent modification as a separate commit, not one giant "fix everything" commit.

### Inspiration 3: Scope Lock Concept Can Be Used for Exec Model Boundary Control

`/investigate` uses physical hooks to prevent code changes outside scope during debugging. In gstack-plus, instructions given to Exec models should include an explicit "allowed file modification list," and git diff should be validated against it during handoff.

### Inspiration 4: 3-Strike Rule Is a Universal Pattern for Failure Recovery

`/investigate`'s "3 failed hypotheses → stop → escalate" is a good template for Exec model failure recovery:

```
Exec attempt 1: Failure
Exec attempt 2: Failure
Exec attempt 3: Failure → Return to Architect (Claude) for re-analysis
             (Stop trying, escalate instead of retry)
```

### Inspiration 5: Cross-Skill Shared Learning System Is the Core of Knowledge Assets

All three skills read and write the same `learnings.jsonl`. A debugging discovery can be used in the next review. This is the concrete implementation of "knowledge compound interest."

**In gstack-plus**: "Project-specific issues" discovered during Qwen's execution should be fed back to Claude, updating context, rather than rediscovered every time.

### Areas for Improvement

- `/review`'s Scope Drift Detection depends on the plan file existing. Without a plan, it can only use commit messages, which have low signal-to-noise. **Improvement**: Force an "this task's scope" field in the handoff template, giving review a clear ground truth.
- `/qa`'s health score is subjective (Functional 20%). Different projects have different priorities. **Improvement**: Allow custom weights in CLAUDE.md.

---

## Things I Haven't Fully Understood

- What does `/review`'s checklist.md specifically contain? Step 2 says "STOP if it can't be read," indicating it's core, but the specific content wasn't seen.
- In `/qa`'s Phase 8 Fix Loop, how exactly does "locate source" work? Which files are read?
- What specific strategies does Review Army's Red Team use to find issues specialists missed?
- What rule set is behind `/review`'s `bun run slop:diff` in Slop Scan?

---

*Day 3 completed 2026-05-02*
