# Superpowers Integration Guide

> Defines where superpowers skills plug into the gstack-plus workflow.
>
> **Core belief**: superpowers does not replace the gstack-plus process — it injects discipline rules at critical checkpoints to prevent AI behavioral drift.

---

## Part 1: Integration Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tier-A (Architect)                            │
│                                                                  │
│  Receive user requirements                                       │
│  ├─ Mandatory invoke: superpowers:brainstorming                  │
│  │   (Required for complex tasks only: creativity ≥ 4 or         │
│  │    judgment ≥ 4)                                              │
│  ├─ Mandatory invoke: superpowers:writing-plans                  │
│  │   (All tasks — ensure the plan has no placeholders)            │
│  └─ Output → plan-to-exec.md                                     │
│     (checked against pre-flight-checklist.md)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ handoff
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Pre-flight Check                              │
│                                                                  │
│  └─ Use: verification/pre-flight-checklist.md                    │
│     (Sections A/B/C must all pass before dispatch)                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ dispatch
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Tier-Exec (Executor)                           │
│                                                                  │
│  Receive plan-to-exec.md                                         │
│  ├─ Suggested invoke: superpowers:executing-plans                │
│  │   (Ensure execution follows the plan without deviation)        │
│  └─ Before completion, mandatory invoke:                         │
│     superpowers:verification-before-completion                   │
│     (Cannot claim completion without running verification)        │
│  └─ Output → exec-to-check.md (with evidence)                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ evidence + status
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Tier-Mid (Reviewer)                            │
│                                                                  │
│  Receive exec-to-check.md                                        │
│  ├─ Mandatory invoke: superpowers:verification-before-completion │
│  │   (Verify Exec's evidence — do not trust claims)               │
│  ├─ If failed → use: verification/failure-routing.md             │
│  └─ If passed → accept output / If rejected →                    │
│     check-to-plan.md return flow                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ return flow (if needed)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Tier-A receives Review feedback                │
│                                                                  │
│  Receive check-to-plan.md                                        │
│  ├─ Mandatory invoke: superpowers:receiving-code-review          │
│  │  (Understand criticism correctly, no defensive response)        │
│  └─ Decide next action: retry / replan / escalate                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 2: Detailed Description of Each Checkpoint

### Checkpoint 1: superpowers:brainstorming

**At which stage**: Tier-A planning phase (after receiving user requirements, before filling plan-to-exec.md)

**Mandatory or suggested**: **Conditionally mandatory** (mandatory for tasks with judgment ≥ 4 or creativity ≥ 4; suggested for others)

**Trigger conditions**:
- Task involves an architectural decision (e.g., "choose a caching strategy")
- Task requires designing a new feature from scratch
- Task impacts 3+ modules
- User requirements are themselves ambiguous (e.g., "optimize performance")

**Skip conditions**:
- Task is mechanical (e.g., "change all var to const")
- Task has a complete template to reference (e.g., "add the same feature to module B following module A's pattern")

**Relationship to gstack-plus templates**:
The output of brainstorming is a design document and specification. Tier-A extracts the task description, success criteria, and Scope Lock from it and fills them into plan-to-exec.md. If brainstorming reveals that the requirements need to be decomposed into multiple sub-tasks, multiple plan-to-exec.md files are created.

**What happens if skipped**:
AI jumps straight into implementation, skipping the思考 of "what's the real intent behind this requirement" and "is there a better way to achieve this intent." Result: you build the right thing correctly, but it's the wrong thing. Classic failure: user says "add a button," AI adds a button without considering whether the button's behavior conflicts with existing components.

---

### Checkpoint 2: superpowers:writing-plans

**At which stage**: Tier-A planning phase (after brainstorming, during plan-to-exec.md filling)

**Mandatory or suggested**: **Mandatory** (all tasks)

**Trigger conditions**: Unconditional — all tasks must pass through the spirit of writing-plans before filling plan-to-exec.md.

**Skip conditions**: None. Even simple tasks must ensure the plan has no placeholders.

**Relationship to gstack-plus templates**:
The core discipline of writing-plans is "No Placeholders" — plans must not contain TBD/TODO/"appropriate error handling." This maps directly to the "task description" and "success criteria" fields in plan-to-exec.md: these fields cannot be left blank or contain vague descriptions. The Bite-Sized principle of writing-plans (each step 2-5 minutes) also corresponds to the task granularity requirements of plan-to-exec.md.

**What happens if skipped**:
plan-to-exec.md ends up with "add error handling in appropriate places" — Exec uses their own standard to judge "appropriate," and the result may be completely different from what Tier-A intended. Placeholders are a manifestation of "I didn't want to make a decision during planning," but in gstack-plus, undecided items at planning become guesses at execution.

---

### Checkpoint 3: superpowers:executing-plans

**At which stage**: Tier-Exec execution phase (after receiving plan-to-exec.md, before writing code)

**Mandatory or suggested**: **Suggested**

**Trigger conditions**:
- plan-to-exec.md has more than 3 success criteria
- Task involves modifications to multiple files
- Task has a specific step sequence requirement

**Skip conditions**:
- Task is a simple single-file modification (e.g., "change the return value of one function")

**Relationship to gstack-plus templates**:
The core discipline of executing-plans is "follow the plan, ask when blocked instead of guessing." This maps to the "failure escalation conditions" field in plan-to-exec.md: when Exec encounters uncertainty, they should return BLOCKED, not guess on their own. The "ask, don't guess" spirit of executing-plans ensures Exec doesn't make architectural judgments without context.

**What happens if skipped**:
Exec encounters something unclear in the plan, guesses, and continues executing. Result: you implement functionality in one direction, but it's not what Tier-A wanted. The rework cost far exceeds the cost of stopping to ask.

---

### Checkpoint 4: superpowers:verification-before-completion

**At which stage**: Before Tier-Exec claims completion + when Tier-Mid reviews

**Mandatory or suggested**: **Mandatory** (twice)

**Trigger conditions**:
- Before Exec fills out the completion declaration in exec-to-check.md
- Before Tier-Mid accepts Exec's output

**Skip conditions**: None. This is the core discipline of superpowers — no exceptions.

**Relationship to gstack-plus templates**:
This skill is directly embodied in the `evidence` field of exec-to-check.md. The Gate function of verification-before-completion (IDENTIFY → RUN → READ → VERIFY → can claim completion) is exactly the filling flow for the evidence field:
1. IDENTIFY: What command proves completion? → maps to success_criteria_check
2. RUN: Execute the command → maps to commands_run
3. READ: Read the output → maps to the output field
4. VERIFY: Does the output confirm the claim? → maps to the verified field

**What happens if skipped**:
Exec modifies code and claims completion without running tests. Result: code has syntax or logic errors, but Exec doesn't know. Tier-Mid discovers this during review, but by then Exec's context is lost, and the fix cost is multiplied. In superpowers' 24 failure memories, the most common failure type is "claimed completion but didn't verify."

---

### Checkpoint 5: superpowers:receiving-code-review

**At which stage**: After Tier-A receives the check-to-plan.md return report

**Mandatory or suggested**: **Mandatory**

**Trigger conditions**: Receiving any return report from Tier-Mid (check-to-plan.md)

**Skip conditions**: None

**Relationship to gstack-plus templates**:
The spirit of receiving-code-review is "understand criticism correctly, don't respond defensively." In gstack-plus, this maps to the "Tier-A response" field in check-to-plan.md: Tier-A should objectively evaluate Tier-Mid's analysis, not defensively say "the task is fine, it's Exec's fault." This skill ensures Tier-A treats the return flow as "a learning opportunity for task decomposition," not "a challenge to Tier-A's capability."

**What happens if skipped**:
Tier-A receives the return report and simply has Exec retry without analyzing the root cause. Result: the same error repeats, ultimately wasting 3-5x more time. receiving-code-review forces Tier-A to first understand "why did this fail" before deciding "what to do next."

---

## Part 3: Decision Guide — When Superpowers Must Be Used

| Scenario | Required superpowers skill | Why |
|------|------------------------|------|
| After receiving ambiguous user requirements | brainstorming | Prevents skipping impact analysis and jumping into implementation |
| Before filling plan-to-exec.md | writing-plans | Ensures the plan has no placeholders and the task description is specific |
| Before Exec starts writing code | executing-plans | Ensures execution follows the plan; doesn't guess when blocked |
| Before Exec claims completion | verification-before-completion | Prevents "claiming completion without verification" |
| When Tier-Mid reviews Exec's output | verification-before-completion | Independent verification — don't trust Exec's claims |
| After Tier-A receives a return report | receiving-code-review | Understands criticism correctly; no defensive response |

---

## Part 4: Discipline Fusion — Superpowers + gstack-plus

How superpowers' discipline rules embed into gstack-plus templates:

| superpowers iron rule | gstack-plus location | How it's enforced |
|-----------------|---------------------|---------|
| NO COMPLETION CLAIMS without verification | exec-to-check.md evidence field | Empty evidence → rejected |
| NO FIXES WITHOUT ROOT CAUSE | failure-catalog.md analysis template | Must answer root cause analysis questions |
| NO PRODUCTION CODE WITHOUT FAILING TEST | plan-to-exec.md success criteria field | Success criteria < 2 → pre-flight fails |
| 1% rule (invoke if it might apply) | superpowers-integration.md checkpoints | Mandatory invoke at critical checkpoints |
| No Placeholders | plan-to-exec.md task description + forbidden-words.md | Forbidden words present → pre-flight fails |
| Ask, don't guess | plan-to-exec.md failure escalation conditions | When uncertain → BLOCKED |

---

*Phase 2 completed 2026-05-02*
