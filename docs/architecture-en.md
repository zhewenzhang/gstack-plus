# gstack-plus Architecture

> Complete design of the 3-tier collaboration framework: role boundaries, cost tradeoffs, and routing decisions.

---

## 1. Three-Tier Model Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │              Tier-A (Architect)               │
                    │  Models: Claude Opus / GPT-5                 │
                    │  Role: Strategic decisions, architecture,    │
                    │        task decomposition, routing           │
                    │  Cost: $$$                                   │
                    └──────────────────────┬──────────────────────┘
                                           │ Task decomposition + handoff
                    ┌──────────────────────▼──────────────────────┐
                    │              Tier-Mid (Reviewer)              │
                    │  Models: Claude Sonnet / GPT-4o              │
                    │  Role: Code review, logic verification,      │
                    │        Exec output validation                │
                    │  Cost: $$                                    │
                    └──────────────────────┬──────────────────────┘
                                           │ Review pass / failure escalation
                    ┌──────────────────────▼──────────────────────┐
                    │              Tier-Exec (Executor)             │
                    │  Models: Qwen Code / DeepSeek                │
                    │  Role: Code implementation, format           │
                    │        refactoring, documentation updates    │
                    │  Cost: $                                     │
                    └─────────────────────────────────────────────┘
```

**Design Philosophy:**
- Not every task needs the strongest model. Cheap models handle simple tasks; savings go to tasks that genuinely need judgment.
- The key is **correct routing** — assigning tasks to models with exactly sufficient capability, no more, no less.
- Goal: Reduce AI workflow costs by 60% while maintaining quality.

---

## 2. Tier Responsibility Boundaries

### Tier-A (Architect)

**Can do:**
- Receive user requirements, decompose into executable tasks
- Fill out `plan-to-exec.md` handoff documents (task description, success criteria, scope lock)
- Make architectural decisions (solution selection, design direction)
- Decide next actions after receiving `check-to-plan.md` failure escalation
- Evaluate whether the classifier's routing is reasonable

**Cannot do:**
- Write code directly (unless classified as Tier-A execution)
- Skip the classifier and route directly (must score all 5 dimensions first)
- Use forbidden words in handoff documents (see `shared/forbidden-words.md`)

### Tier-Mid (Reviewer)

**Can do:**
- Review Exec output (validate evidence in `exec-to-check.md`)
- Fill out `check-to-plan.md` failure escalation when issues are found
- Fix small issues directly (without changing architectural decisions)
- Raise concerns about classifier routing results

**Cannot do:**
- Modify Tier-A's architectural decisions
- Accept Exec output without evidence review
- Downgrade failure escalation severity (low → medium → high is decided by Tier-A)

### Tier-Exec (Executor)

**Can do:**
- Execute per `plan-to-exec.md` task description
- Fill out `exec-to-check.md` upon completion (must include evidence)
- Report BLOCKED status when blocked
- Suggest scope-lock-external modifications (but not execute them)

**Cannot do:**
- Modify files outside scope lock (unless explained in evidence and approved)
- Make architectural decisions (e.g., "Solution A is better than B")
- Submit completion claims without evidence
- Replace specific requirements with their own standards

---

## 3. Task Lifecycle

```
User request
  │
  ▼
┌─────────────────────────────────┐
│ Tier-A: Receive request,        │
│         decompose into tasks    │
│ → 5-dim scoring → routing       │
│ → Fill plan-to-exec.md          │
└──────────────┬──────────────────┘
               │ handoff
               ▼
┌─────────────────────────────────┐
│ Tier-Exec: Execute per handoff  │
│ → Implement code                │
│ → Run validation commands       │
│ → Fill exec-to-check.md         │
└──────────────┬──────────────────┘
               │ evidence + status
               ▼
┌─────────────────────────────────┐
│ Tier-Mid: Review Exec output    │
│ → Validate evidence supports    │
│   completion claim              │
│ → Check scope lock compliance   │
│ → Verify all success criteria   │
└──────┬───────────────┬──────────┘
       │               │
   Pass┘           Fail┘
       │               │
       ▼               ▼
┌──────────┐    ┌─────────────────────────────┐
│ Accept   │    │ Tier-Mid: Fill escalation   │
│ → Merge  │    │ check-to-plan.md            │
│ → Notify │    │ → Tier-A decides next steps │
└──────────┘    └──────────────┬──────────────┘
                               │
                        Re-decompose / retry / escalate
                               │
                               ▼
                        (Back to Tier-A or Tier-Mid)
```

**Key Gates:**
1. **Routing Gate:** Tasks must be scored across 5 dimensions + routed via rules, cannot skip.
2. **Evidence Gate:** Exec completion claims must be supported by evidence, cannot skip.
3. **Review Gate:** Exec output must be reviewed by Tier-Mid before merging, cannot skip.

---

## 4. Template System

```
handoff/templates/
├── plan-to-exec.md          # Tier-A → Tier-Exec handoff
│   ├── Task description (forbidden-word scan passed)
│   ├── Success criteria (command-verifiable)
│   ├── Scope Lock (allowed/denied files)
│   ├── Context snapshot
│   └── Failure escalation conditions
│
├── exec-to-check.md         # Tier-Exec → Tier-Mid report
│   ├── Completion status (DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED)
│   ├── Evidence (commands_run + file_changes + success_criteria_check)
│   ├── Concerns (if applicable)
│   └── Suggestions for Tier-Mid
│
├── check-to-plan.md         # Tier-Mid → Tier-A escalation
│   ├── Failure type (BUILD_ERROR/LOGIC_ERROR/DESIGN_ISSUE/SCOPE_DRIFT)
│   ├── Failure evidence
│   ├── Root cause analysis (3-strike thinking)
│   └── Suggested actions
│
└── shared/
    ├── evidence-format.md   # Evidence field specification
    └── forbidden-words.md   # Forbidden words quick-reference
```

**Template Relationships:**

```
plan-to-exec.md ──→ Tier-Exec executes ──→ exec-to-check.md
                                                    │
                                               Tier-Mid review
                                                    │
                                    ┌───────────────┼───────────────┐
                                    │               │               │
                                 Pass┘         Minor issue┘      Major issue┘
                                    │               │               │
                                    ▼               ▼               ▼
                                Accept output   Tier-Mid fixes  check-to-plan.md
                                                                    │
                                                               Tier-A responds
```

---

## 5. Classifier Design

### Why These 5 Dimensions?

| Dimension | Why |
|-----------|-----|
| **Judgment** | Distinguishes "mechanical operations" from "needs decision" — the core dimension of model dispatch |
| **Context** | Distinguishes "local task" from "global task" — context windows are finite |
| **Risk** | Ensures high-risk tasks don't use cheap models — safety/data issues can't be cheapened |
| **Verifiability** | Ensures Exec tasks have clear success criteria — unverifiable tasks Exec can't handle well |
| **Creativity** | Distinguishes "follow template" from "design from scratch" — creativity needs stronger models |

These 5 dimensions cover three aspects of "what capability a task needs":
- **Cognitive ability**: Judgment + Creativity
- **Knowledge scope**: Context
- **Risk attitude**: Risk + Verifiability

### Routing Rules Summary

```
Tier-A:   judgment >= 4 OR risk >= 4 OR creativity >= 4
Tier-Exec: judgment <= 2 AND context <= 2 AND verifiability >= 4
Tier-Mid:  None of the above
```

### Conservative Routing Principle

**When uncertain, route to a higher Tier.**

Reasoning: The cost of underestimating task complexity (Exec messes up → 3-5x rework cost) far exceeds overestimating (slightly more high-tier model tokens, 20-50% more).

---

## 6. Unresolved Design Issues

Source: `docs/learning-notes/key-insights.md` "Questions to resolve before Phase 1"

### Issue 1: Are the classifier scoring thresholds reasonable?

**Status:** Routing rules use fixed thresholds (judgment >= 4 → Tier-A), but these are design inferences, not empirical data.

**Resolution (Phase 2-3):** Through 9-group comparative experiments (3 modes × 3 tasks), collect real routing data and adjust thresholds.

### Issue 2: Specific escalation path for failure routing

**Status:** `check-to-plan.md` defines escalation format, but the decision tree for "which Tier to escalate to after 3 failures" is not fully defined.

**Resolution (Phase 2):** Define complete decision tree in the failure recovery mechanism implementation.

### Issue 3: Cost tracking and budget control

**Status:** No "spend max $5 today" mechanism.

**Resolution (Phase 2-3):** Add cost estimation to each handoff, display cumulative cost in Dashboard.

### Issue 4: Real user validation

**Status:** All designs are document analysis, no user interviews.

**Resolution (Phase 0 remaining):** Interview 5-10 gstack users to validate assumptions.

---

## 7. Phase 1 Confirmation Points

Source: `PROJECT_ROADMAP.md` Phase 1 confirmation points.

### Confirmation Point 1: Routing table can assign 20 test tasks reasonably

**Verification method:**
1. Take each task from `classifier/test-tasks.md`
2. Score using only `classifier/scoring-guide.md`
3. Route using only `classifier/routing-rules.md`
4. Compare results with annotated "correct routing"
5. Target: >= 80% consistency (16/20)

**Status:** ✅ Test set created, routing rules defined. Awaiting user validation.

### Confirmation Point 2: Template system can generate high-quality handoffs

**Verification method:**
1. Use `plan-to-exec.md` to generate handoff for a real task
2. Check: task description has no forbidden words? Success criteria verifiable? Scope Lock clear?
3. Simulate Exec return using `exec-to-check.md`
4. Simulate escalation using `check-to-plan.md`

**Status:** ✅ Templates created, format defined. Awaiting practical validation.

### Confirmation Point 3: Classifier and template system integration

**Verification method:**
1. Give a task description
2. Score + route via classifier → target Tier
3. Generate handoff via corresponding template
4. Check end-to-end flow

**Status:** ⏳ Requires Phase 2 code implementation to validate integration.

---

## File Index

```
classifier/
├── scoring-guide.md      # 5-dimension scoring guide + 15 examples
├── routing-rules.md      # Routing decision tree + edge cases
└── test-tasks.md         # 20+ test tasks

handoff/templates/
├── plan-to-exec.md       # Tier-A → Tier-Exec handoff
├── exec-to-check.md      # Tier-Exec → Tier-Mid report
├── check-to-plan.md      # Tier-Mid → Tier-A escalation
└── shared/
    ├── evidence-format.md    # Evidence field spec
    └── forbidden-words.md    # Forbidden words quick-ref

verification/
├── pre-flight-checklist.md   # 12 pre-flight checks
├── failure-catalog.md        # 4 failure types
└── failure-routing.md        # Decision tree + response templates

experiments/
├── methodology.md            # Experiment methodology
├── task-definitions.md       # 3 task definitions
├── runs/                     # Execution records
│   ├── C1-simple-eslint.md   # Mode C: ESLint task
│   ├── C2-medium-refactor.md # Mode C: Refactor task
│   ├── C3-complex-auth.md    # Mode C: Auth design task
│   └── recording-template.md # Mode A/B recording template
└── results-report.md         # Results report

docs/
├── architecture.md           # This file (design overview)
├── getting-started.md        # Getting started guide
├── superpowers-integration.md# Superpowers integration guide
└── learning-notes/           # Learning notes
    ├── key-insights.md       # Key design insights
    └── ... (12 learning notes total)
```
