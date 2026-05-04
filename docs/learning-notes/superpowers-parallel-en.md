# Superpowers Parallel Skills Study Notes

> Day 10 | Deep analysis of subagent-driven-development, dispatching-parallel-agents, using-git-worktrees

---

## Skill Overview

| Skill | Description | Core Principle |
|------|------|---------|
| `subagent-driven-development` | Plan execution: each task dispatched to a new subagent | Fresh subagent per task + two-stage review |
| `dispatching-parallel-agents` | Parallel scheduling: independent tasks run concurrently | One agent per problem domain, working in parallel |
| `using-git-worktrees` | Isolated workspaces: git worktree creation | Systematic directory selection + safety checks = reliable isolation |

---

## 1. `subagent-driven-development` — Plan-Driven Subagent Development

### Literal Level: What Does It Do?

This skill defines how to execute an implementation plan by dispatching subagents. Core pattern: **one fresh subagent per task + two-stage review (spec compliance → code quality)**.

**Complete Workflow**:

```
1. Read plan file, extract all tasks
2. Create TodoWrite (all task list)
3. For each task:
   ├── 3a. Dispatch implementer subagent (with full task text + context)
   │      ├── Subagent asks questions? → Answer, provide context → re-dispatch
   │      └── Subagent implements, tests, commits, self-reviews
   ├── 3b. Dispatch spec reviewer subagent
   │      ├── Spec compliant? → proceed to 3c
   │      └── Not compliant? → implementer fixes → re-review
   ├── 3c. Dispatch code quality reviewer subagent
   │      ├── Passes? → task complete
   │      └── Fails? → implementer fixes → re-review
   └── 3d. Mark task as completed
4. After all tasks complete: dispatch final code reviewer (entire implementation)
5. Invoke finishing-a-development-branch
```

**Model Selection Strategy**:

| Task Type | Model Choice | Signal |
|---------|---------|------|
| Mechanical implementation (isolated function, clear spec, 1-2 files) | Fast, cheap model | 1-2 files + complete spec |
| Integration and judgment (multi-file coordination, pattern matching, debugging) | Standard model | Multi-file + integration focus |
| Architecture, design, review | Most capable model | Requires design judgment or broad code understanding |

**Implementer's Four States**:

| State | Meaning | Handling |
|------|------|---------|
| DONE | Complete | Proceed to spec review |
| DONE_WITH_CONCERNS | Complete but with concerns | Read concerns; if correctness/scope issues → resolve before review; if observations → proceed |
| NEEDS_CONTEXT | Lacks context | Provide missing context → re-dispatch |
| BLOCKED | Cannot complete | Evaluate blocker: context issue → provide more context; needs more reasoning → use stronger model; task too large → split; plan error → escalate to user |

**Iron Laws (Never List)**:
- Never start implementation on main/master branch
- Never skip review (spec compliance OR code quality)
- Never continue with unresolved concerns
- **Never dispatch multiple implementer subagents in parallel** (they will conflict)
- Never let subagent read the plan file (provide full text instead)
- Never skip setting up context for the subagent (subagent needs to understand where the task fits)
- Never ignore subagent's questions (answer them before letting them continue)
- Never accept "close enough" on spec compliance (reviewer found issues = not done)
- Never skip the review loop (reviewer found issue → implementer fixes → re-review)
- Never let implementer self-review replace actual review (both are needed)
- **Never start code quality review before spec compliance passes** (wrong order)

### Design Level: Why Is It Designed This Way?

#### Design Decision 1: Why Use a "Fresh Subagent" Per Task Instead of Sequential Execution in the Same Session?

**Decision**: Each task dispatches a brand-new subagent, not inheriting the previous task's context.

**Why**:
1. **Context isolation**: Each subagent only needs the current task's context and doesn't need to know about prior tasks. This reduces context pollution (residue from previous tasks affecting current task judgment).
2. **Focus**: Carefully constructed instructions and context ensure the subagent focuses on the current task. If it inherited the session's full history, the subagent would be drowned in irrelevant information.
3. **Coordinator's context is protected**: The coordinator (controller) keeps its context for coordination work (tracking progress, reviewing, making decisions) and doesn't consume it on implementation details.

**Counterexample**: Same subagent sequentially executes 5 tasks. By the 5th task, the context window is 80% occupied by the history of the first 4 tasks, and the 5th task's quality drops sharply.

---

#### Design Decision 2: Why Does the Order of Two-Stage Review (Spec Compliance → Code Quality) Matter?

**Decision**: Do spec compliance review first (does the code match the spec?), then code quality review (is the code well-written?). Never start code quality review before spec compliance passes.

**Why**: If you do code quality review first, you might find "the code is well-written but doesn't match the spec." Then the implementer modifies the code to match the spec, but the modifications may introduce new quality issues — requiring re-review. This creates an infinite loop.

Spec compliance first ensures "we built the right thing," then code quality ensures "we built the thing right." Reversing the order wastes review resources.

**Counterexample**: Code quality review finds great optimization suggestions, implementer adopts them. Then spec review finds that the code doesn't match the spec at all and needs a rewrite. All the time spent on quality review is wasted.

---

#### Design Decision 3: Why Not Dispatch Multiple Implementer Subagents in Parallel?

**Decision**: subagent-driven-development explicitly forbids parallel dispatch of implementer subagents ("Dispatch multiple implementation subagents in parallel (conflicts)" is on the Never list).

**Why**: Even though tasks may be independent, they might modify the same files (e.g., configs, shared modules). Parallel implementation leads to git conflicts, file overwrites, or extra merge work. Serial execution ensures each task's changes are seen by the next task.

**Contrast**: `dispatching-parallel-agents` does run in parallel, but it's for "debugging independent problem domains" — each agent modifies different files with no shared state. subagent-driven-development is for "plan execution" — even if tasks are independent, they work on the same codebase with implicit dependencies.

---

## 2. `dispatching-parallel-agents` — Parallel Agent Scheduling

### Literal Level: What Does It Do?

This skill defines when and how to dispatch multiple agents in parallel to handle independent problem domains.

**When-to-Use Decision Tree**:

```
Multiple problems?
  ├── Related (fixing one might fix others) → same agent investigates all
  └── Independent
       ├── Can work in parallel (no shared state) → dispatch in parallel
       └── Has shared state → serial agents
```

**When to Use**:
- 3+ test files failing with different root causes
- Multiple subsystems broken independently
- Each problem can be understood without context from other problems
- No shared state between investigations

**When Not to Use**:
- Failures are related
- Need to understand the full system state
- Exploratory debugging (don't know what's broken yet)
- Shared state (agents would interfere with each other — editing same files, using same resources)

**Agent Prompt Structure**:

A good agent instruction is:
1. **Focused**: one clear problem domain
2. **Self-contained**: all context needed to understand the problem
3. **Specific output**: what should the agent return?

```markdown
Fix the 3 failures in src/agents/agent-tool-abort.test.ts:

1. "should abort tool with partial output capture" - expects message to contain 'interrupted at'
2. "should handle mixed completed and aborted tools" - fast tool gets interrupted instead of completing
3. "should properly track pendingToolCount" - expects 3 results but gets 0

These are timing/race condition issues. Your task:

1. Read the test file to understand what each test validates
2. Find the root cause — timing issue or actual bug?
3. Fix approach:
   - Replace arbitrary timeouts with event-based waits
   - Fix any bugs found in the abort implementation
   - Adjust test expectations if the test's behavior changed

Don't just increase timeouts — find the real problem.

Return: A summary of what you found and what you fixed.
```

**Verification After Parallel Agents Return**:
1. Read each summary
2. Check for conflicts (did agents edit the same code?)
3. Run full test suite
4. Spot-check (agents may make systematic errors)

### Design Level: Why Is It Designed This Way?

#### Design Decision 1: What Tasks Are Suitable for Parallel? What Aren't?

**Suitable for parallel**:
- Independent problem domains (different files, different subsystems)
- Each agent's input doesn't depend on another agent's output
- No shared state (not modifying the same files, not using the same resources)

**Not suitable for parallel**:
- Task A's output is Task B's input
- Tasks share files/resources (parallel editing causes conflicts)
- Need to understand other tasks' results to continue

**Core test**: If agent A and agent B work simultaneously, will they modify the same file? If yes → not suitable for parallel.

---

## 3. `using-git-worktrees` — git worktree Isolation

### Literal Level: What Does It Do?

This skill defines how to create isolated git worktree workspaces.

**Complete Flow**:

```
1. Directory selection (priority):
   ├── Check existing: .worktrees/ (preferred) > worktrees/ (fallback)
   ├── Check CLAUDE.md for preferences
   └── Ask the user
2. Safety verification:
   └── If project-local directory → check .gitignore (git check-ignore)
       └── If not ignored → fix immediately (add .gitignore + commit)
3. Create worktree:
   ├── Detect project name
   ├── git worktree add <path> -b <branch>
   └── cd <path>
4. Run project setup:
   ├── Auto-detect runtime (package.json → npm install, Cargo.toml → cargo build...)
   └── Install dependencies
5. Verify clean baseline:
   ├── Run tests
   ├── If failing → report failure, ask whether to continue
   └── If passing → report ready
6. Report location
```

### Design Level: Why Is It Designed This Way?

#### Design Decision 1: The Role of git worktree in Parallel Development

**Decision**: Each independent task should be done in its own git worktree, not switching branches in the same workspace.

**Why**:
1. **True isolation**: worktrees are independent filesystem spaces that can checkout different branches simultaneously without conflict. `git checkout` only works serially.
2. **Infrastructure for parallel agents**: if multiple agents need to work simultaneously (different tasks), each needs its own worktree. Otherwise they overwrite each other's changes.
3. **Safe sandbox**: if a task goes wrong, just delete the worktree without affecting the main workspace.

**Counterexample (Multi-Agent Conflict Without worktree)**:

Scenario: Qwen Agent A (implements retry logic) and Qwen Agent B (implements timeout) execute simultaneously in the main workspace.

Timeline:
- T=0: Both agents read `src/api/client.ts` (current version v1)
- T=5: Agent A finishes, modifies `src/api/client.ts`, commits (becomes v2)
- T=8: Agent B finishes, also modifies `src/api/client.ts` — but it was based on v1, unaware of v2
- T=8: Agent B's commit either overwrites Agent A's changes (silent loss)
       or triggers a merge conflict (requires human intervention)

Silent overwrite is the most dangerous case: the retry logic disappears, but git history
shows both commits exist, looking like both "succeeded."

**After using worktree**:
Agent A works in `worktree-retry` branch, Agent B works in `worktree-timeout` branch.
When merging, git explicitly reports conflicts (different modifications to the same file).
Claude makes conscious decisions at merge time: how should retry and timeout logic interact?
The problem shifts from "silent loss" to "explicit conflict" — explicit conflicts can be handled, silent losses cannot.

---

## Philosophy Level: What Beliefs Does It Reflect?

**Belief 1: Parallel is speed, isolation is quality.**

`dispatching-parallel-agents` gains speed through parallelism (3 problems solved in the time of 1). `subagent-driven-development` gains quality through isolation (fresh context per task, two-stage review). When combining both, parallelize only on truly independent problem domains; otherwise go serial.

**Belief 2: Each agent should get carefully constructed context, not the session's full history.**

All three skills emphasize: "precisely constructed instructions and context," "don't inherit session context," "provide full text instead of letting subagent read files." This reflects an understanding of the context window as a scarce resource — filling it with useless information degrades output quality.

**Belief 3: git isolation is engineering discipline, not an optional optimization.**

`using-git-worktrees` says: before any feature work, create an isolated worktree. This isn't "good practice" — it's mandatory. Without isolation, changes pollute each other and rollback becomes difficult.

---

## Compared to gstack: What Is the Fundamental Design Difference Between superpowers' Parallel Agent Pattern and gstack's `/review` Review Army?

| Dimension | gstack Review Army | superpowers Parallel Agents |
|------|-------------------|---------------------------|
| Parallel target | Multiple specialists (Testing, Maintainability, Security...) | Multiple general-purpose agents |
| Parallel purpose | Multi-angle review of the same diff | Parallel resolution of multiple independent problems |
| Context isolation | Each specialist gets fresh context (bias isolation) | Each agent gets carefully constructed context (no session history inheritance) |
| Conflict handling | Not applicable (each specialist reads the same diff) | Applicable (multiple agents may edit the same file → parallel implementation forbidden) |
| Result merging | Deduplication (same fingerprint → confidence +1) | Check conflicts + run full test suite |
| Gating | Adaptive: 10+ times with no findings → auto-skip | No gating — parallel dispatch every time |
| git infrastructure | Not needed (all reading on the same branch) | Requires worktree (each agent works independently) |

**Fundamental difference**:

gstack's Review Army is **parallel read** — multiple specialists simultaneously read the same diff, each outputting findings. They don't modify code, only produce reports. So there's no conflict risk.

superpowers' parallel agents are **parallel write** — multiple agents simultaneously modify code. This brings conflict risk, so they must be strictly limited to "independent problem domains" — each agent modifies different files.

**gstack is parallel analysis, superpowers is parallel implementation**.

---

## Implications for gstack-plus

### Implication 1: Subagent-Driven Development Is the Core Mode for gstack-plus Exec Model Execution

gstack-plus execution flow should be:
```
Tier-A planning
  → Split into independent tasks
    → Dispatch Exec subagent per task (fresh context + precise instructions)
      → Exec completes
        → Claude two-stage review (spec compliance → code quality)
          → Passes → next task
          → Fails → Exec fixes → re-review
```

This is much better than "one Exec model sequentially executes all tasks" — fresh context per task guarantees quality.

### Implication 2: Model Selection Strategy Can Be Directly Borrowed

subagent-driven-development's model selection strategy (mechanical → cheap model, integration → standard model, architecture → strongest model) directly maps to gstack-plus' three-tier model:

| Task Type | gstack-plus Tier |
|---------|-----------------|
| Mechanical implementation (1-2 files, clear spec) | Tier-Exec (Qwen/DeepSeek) |
| Integration and judgment (multi-file coordination) | Tier-Mid (Sonnet/GPT-4o) |
| Architecture, design, review | Tier-A (Opus/GPT-5) |

**Applicability Boundary for Qwen Exec (gstack-plus specific)**:

✅ Tasks suitable for Qwen dispatch (have clear specs, don't need global judgment):
- Function implementation: input/output clearly defined, no architectural decisions
- Format refactoring: clear before/after format, no logic changes
- Test supplementation: add edge cases based on existing test patterns
- Documentation updates: update corresponding JSDoc/README based on code changes

❌ Tasks not suitable for Qwen, need escalation to Claude:
- Involves "which approach is better" judgment (Qwen lacks global architecture view)
- Coordination work touching boundaries of 3+ modules
- Task description itself is ambiguous (should clarify first — Claude does the clarifying)
- Previous similar task failed with Qwen (escalate to Claude for re-analysis)

**Root cause**: Qwen's context is local — it sees the prompt given to it,
not the complete project architecture map. Asking it to make global judgments
is using local information to make global decisions.

### Implication 3: Parallel Scheduling for Exec Model's Independent Tasks

If a plan has 3 independent tasks (modifying different files, different subsystems), you can dispatch 3 Exec agents in parallel. But you must strictly follow the "when not to use" rules: no parallel related tasks, no parallel tasks with shared state.

### Implication 4: git worktree as Isolated Workspace for Exec Models

Each Exec subagent should work in its own git worktree. This ensures:
- Changes between Exec agents don't overwrite each other
- If an Exec messes up, delete the worktree and start over
- Claude can coordinate in the main worktree without Exec changes interfering

### Implication 5: Implementer's Four States Are a Good Classification for Exec Model Output

After completing a task, the Exec model should report:
- **DONE** → Accept
- **DONE_WITH_CONCERNS** → Read concerns, judge whether they affect correctness
- **NEEDS_CONTEXT** → Provide more context, re-dispatch
- **BLOCKED** → Evaluate blocker reason, decide whether to provide more context, escalate to stronger model, split task, or revise plan

This classification is far more valuable than a simple "success/failure" binary — it lets Claude know "where the Exec model is stuck," enabling the correct recovery strategy.

---

## What I Haven't Fully Understood Yet

- What are the concrete contents of `implementer-prompt.md`, `spec-reviewer-prompt.md`, `code-quality-reviewer-prompt.md` template files in `subagent-driven-development`? How do these templates construct context?
- How is "parallel" in `dispatching-parallel-agents` actually implemented in AI environments? Is it true parallelism (multi-threading) or pseudo-parallelism (fast rotation)?
- What is the collaboration flow between `using-git-worktrees` and `finishing-a-development-branch`? How does a worktree merge back to the main branch after completion?
- Cost model of subagent-driven-development: each task = implementer + spec reviewer + code quality reviewer = 3 subagent calls. If a plan has 10 tasks, that's 30 calls plus possible fix cycles. How to optimize this cost?

---

*Completed 2026-05-02*
