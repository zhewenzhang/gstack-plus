# Superpowers Planning Skills Study Notes

> Day 8 | Deep analysis of brainstorming, writing-plans, executing-plans, using-superpowers

---

## Skill Overview

| Skill | Description | Role |
|------|------|------|
| `brainstorming` | Idea → Design → Spec | Product Designer + Architect |
| `writing-plans` | Spec → Implementation Plan | Technical Director |
| `executing-plans` | Plan → Code | Execution Engineer |
| `using-superpowers` | Skill invocation rules | Discipline Supervisor |

---

## 1. `using-superpowers` — Mandatory Invoke Rule

### Literal Level: What Does It Do?

`using-superpowers` is not a workflow skill — it is a **meta-rule** that defines the invocation discipline for all superpowers skills.

**Core Rule (the 1% Rule)**:

```
"If you believe there is even a 1% chance a skill applies to what you are doing, you absolutely must invoke that skill."
```

This is not optional, not a suggestion — it is **mandatory**.

**Red Flag Table (patterns of AI self-rationalization):**

| AI's Thought | Reality |
|---------|------|
| "This is just a simple question" | Questions are also tasks — check skills |
| "I need to learn more first" | Skill check comes before clarifying questions |
| "I can look at the code first" | Skills tell you how to look |
| "This doesn't need a formal skill" | If a skill exists, use it |
| "I remember how this skill works" | Skills evolve — read the current version |
| "This skill is overkill" | Simple things get complex — use it |
| "I'll just do this one small thing" | Check skills before doing anything |

**Skill Priority**:
1. **Explicit user directives** (CLAUDE.md, AGENTS.md) — highest
2. **Superpowers skills** — overrides system default behavior
3. **System default prompt** — lowest

**Skill Invocation Flow**:
```
User message
  → Is there a 1% chance a skill applies?
       ├── Yes → Invoke Skill tool → Announce "Using [skill] to [purpose]"
       │         → Has a checklist? → TodoWrite each item
       │         → Follow the skill strictly
       └── No → Reply (including clarifying questions)
```

### Design Level: Why Is It Designed This Way?

#### Design Decision 1: "Must invoke even at 1% chance" — What Fear Is Behind This Rule?

**Fear**: **AI tends to skip discipline because it "feels" like it knows the answer.**

This rule comes from a painful observation: when AI thinks "this problem is simple," it skips all discipline checks and jumps straight to an answer. But "simple problems" often hide unexamined assumptions — these assumptions become expensive rework during implementation.

**The true meaning of the 1% rule**: It's not "1% chance this skill is useful," but "1% chance you are rationalizing skipping discipline." Every thought listed in the red flag table ("this is just a simple question," "I can look at the code first") is the AI **convincing itself not to do what it should do**.

**Why it must be "mandatory" not "suggested"**: If it were a suggestion, AI would always choose "this case doesn't need it." Because skipping discipline *feels* like "saving time," but the actual cost is "spending 10x time later fixing wrong assumptions." Only a mandatory rule can break this cycle.

**Counterexample**: No 1% rule. User says "add a button," AI thinks it's too simple for brainstorming and writes the button directly. Result: the button's behavior conflicts with existing components, mobile isn't considered, no tests are written. Fixing these issues took 2 hours, while brainstorming would have taken 10 minutes.

---

#### Design Decision 2: Skill Priority "User Directives > Skills > System Default"

**Decision**: Even when user directives conflict with skills (user says "don't use TDD," skill says "always use TDD"), follow the user directive.

**Why**: This aligns with gstack's User Sovereignty principle, but superpowers expresses it more directly — "the user controls everything." Skills are discipline, but discipline is the discipline the user chose, not discipline imposed by the AI.

**Counterexample**: Skills override user directives. User says "this project doesn't need TDD," but the TDD skill forces writing tests. Result: user loses sense of control over their project and starts distrusting the tool.

---

## 2. `brainstorming` — From Idea to Design

### Literal Level: What Does It Do?

`brainstorming` is the converter from "idea → design → spec." It runs before any implementation work, ensuring "we are building the right thing."

**Complete Workflow (9 steps, order is mandatory):**

```
1. Explore project context
   ├── Read docs, code, recent commits
   └── Assess scope: if too large (multiple independent subsystems) → decompose first

2. Provide Visual Companion (if visual aspects are expected)
   └── Must be a separate message, cannot be combined with clarifying questions

3. Ask clarifying questions (one at a time)
   ├── Purpose, constraints, success criteria
   └── Prefer multiple-choice questions; multi-select is also fine

4. Propose 2-3 approaches
   └── With trade-offs and your recommendation

5. Present design (in sections, get approval after each)
   ├── Architecture, components, data flow, error handling, testing
   └── If not right → go back and revise

6. Write design document
   └── docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md

7. Spec self-review
   ├── Placeholder scan (TBD/TODO)
   ├── Internal consistency
   ├── Scope check
   └── Ambiguity check

8. User reviews written spec
   └── Wait for user approval → if revisions needed → go back to 7

9. Invoke writing-plans skill
   └── This is the only terminal state — no other implementation skills may be invoked
```

**HARD GATE**:
```
<HARD-GATE>
Before presenting the design and getting user approval,
you absolutely must not invoke any implementation skill, write any code,
scaffold any project, or take any implementation action.
This applies to every project, no matter how simple it seems.
</HARD-GATE>
```

**Anti-pattern**: "This is too simple to need a design"
- To-do lists, single-function utilities, config changes — every one goes through this process
- "Simple" projects are where unexamined assumptions cause the most wasted work
- The design can be short (a few sentences for truly simple things), but it **must be presented and approved**

**Scope Control Mechanism**:
- If the request describes multiple independent subsystems (e.g., "build a platform with chat, file storage, billing, analytics") → flag immediately
- Don't spend time refining something that needs to be decomposed
- Help the user decompose: what are the independent parts? How do they relate? What's the build order?
- Each sub-project gets its own spec → plan → implementation cycle

**Design Isolation Principle**:
- Split the system into small units, each with a single clear purpose
- Communicate through well-defined interfaces
- Can be understood and tested independently
- For each unit, you should be able to answer: what does it do? How do you use it? What does it depend on?
- Small, clearly bounded units are also easier for AI to work with — you reason better about code that fits in your context at once

**Visual Companion Mechanism**:
- The browser companion is a **tool**, not a pattern
- Accepting the companion means it's available for problems that need visual processing, not that every problem goes through the browser
- **Per-problem decision**: even if the user accepted it, decide per problem whether to use browser or terminal
- Test: **Will the user understand this better by looking than by reading?**
- Use browser: mockups, wireframes, layout comparisons, architecture diagrams
- Use terminal: requirement questions, concept choices, trade-off lists, scope decisions

### Design Level: Why Is It Designed This Way?

#### Design Decision 1: Brainstorming's "Mandatory Structure" — What Does It Enforce? Why Enforce It?

**What it enforces**:
1. **Order is mandatory**: all 9 steps must be completed in sequence, none skipped
2. **Approval is mandatory**: user approval required after each design section
3. **Terminal state is fixed**: the only terminal state for brainstorming is invoking writing-plans — cannot jump directly to implementation
4. **"Even simple things need design" is enforced**: no "this is too simple" exceptions

**Why enforce it**:

AI's default behavior is "hear idea → start writing code." This leap is too fast — it skips "what is the real intention behind this idea," "is there a better way to realize this intention," and "is this idea itself good?"

The mandatory structure pulls the AI from "implementation mode" into "thinking mode." In implementation mode, AI asks "how to do it"; in thinking mode, AI asks "what to do" and "why do it."

**Counterexample**: No mandatory structure. User says "add a navbar," AI starts writing navbar code. Result: navbar interactions conflict with existing routing, logged-in/logged-out states aren't considered, mobile isn't handled. Rework took 3x the time. With brainstorming, these issues would have been resolved before writing code.

**Deeper insight**: brainstorming's mandatory structure prevents a specific kind of error — **"correctly implementing the wrong thing."** The most dangerous aspect of this error is that the implementation itself may be perfect, but the direction is wrong. Today, when AI has drastically reduced the cost of implementation, the price of this error is not "implementation is expensive" but "we built something nobody needs."

---

#### Design Decision 2: "One Question at a Time" Interaction Pattern

**Decision**: brainstorming requires asking only one question at a time, preferring multiple-choice questions, avoiding multi-part questions.

**Why**: Presenting multiple questions at once makes the user feel interrogated and degrades answer quality. Multiple-choice questions are easier to answer than open-ended ones because they narrow the thinking scope — the user doesn't need to construct an answer from scratch, just choose among known options.

**Counterexample**: "Who is your target user? What is their core pain point? What is your desired MVP timeline? What is your business model?" — 4 questions, the user might only answer the first 2 and敷衍 the rest.

---

#### Design Decision 3: Visual Companion's "Per-Problem Decision" Mechanism

**Decision**: Even if the user accepted a visual companion, decide separately for each problem whether to use the browser or the terminal.

**Why**: Accepting a visual companion doesn't mean "all problems use the browser." Some problems are inherently conceptual ("what does personalization mean in this product?"), and using a browser is inefficient for those. Some problems are inherently visual ("which navbar layout is better?"), and the terminal cannot discuss them effectively.

**Counterexample**: User accepted the visual companion, then every problem is shown in the browser. Result: token consumption explodes (each browser operation requires screenshots, DOM parsing), but many displays are just text lists that the terminal could handle fine.

---

## 3. `writing-plans` — From Design to Implementation Plan

### Literal Level: What Does It Do?

`writing-plans` transforms the design document produced by brainstorming into an **immediately executable implementation plan**. It assumes the executor is "a skilled developer who knows almost nothing about this codebase and problem domain."

**Plan Document Structure**:

```markdown
# [Feature Name] Implementation Plan

> **REQUIRED SUB-SKILL:** Use subagent-driven-development or executing-plans

**Goal:** [one-line description]
**Architecture:** [2-3 sentences]
**Tech Stack:** [key technologies]

---

### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

- [ ] **Step 1: Write a failing test**
    [specific code]

- [ ] **Step 2: Run test to confirm failure**
    Run: `pytest ...`
    Expected: FAIL with "..."

- [ ] **Step 3: Write minimal implementation code**
    [specific code]

- [ ] **Step 4: Run test to confirm pass**
    Run: `pytest ...`
    Expected: PASS

- [ ] **Step 5: Commit**
    git add ...
    git commit -m "feat: ..."
```

**Key Rules**:

1. **No Placeholders**:
   - No "TBD", "TODO", "implement later"
   - No "add appropriate error handling" (without showing the specific code)
   - No "write tests for the above" (without showing the specific test code)
   - No "similar to Task N" (duplicating code — the executor may read out of order)
   - Every step must contain actual content

2. **Bite-Sized Granularity**: Each step is a single action of 2-5 minutes
   - "Write a failing test" → one step
   - "Run to confirm failure" → one step
   - "Write minimal implementation" → one step
   - "Run to confirm pass" → one step
   - "Commit" → one step

3. **File Structure Before Task Definition**:
   - Before defining tasks, map out which files will be created or modified
   - Each file has a single clear responsibility
   - Files that change together should be grouped together (split by responsibility, not by technology layer)

4. **Self-Review**:
   - Spec coverage: every spec requirement maps to an implementation task
   - Placeholder scan: search for red flag patterns
   - Type consistency: types/signatures/property names in later tasks match those defined earlier

### Design Level: Why Is It Designed This Way?

#### Design Decision 1: Plan Document Format — Why This Format?

**Why TDD format (test → fail → implement → pass → commit) instead of "implement → test"**:

The TDD format forces the executor to think "what should this code do" before writing code. Tests are behavioral specifications — they describe a function's inputs, outputs, and constraints. Writing tests first means:
1. You are clear about the expected behavior of this code
2. You have regression tests proving the code won't break in the future
3. Minimal implementation principle — write only the code needed to make the test pass, nothing more

**Why every step has specific code and commands**:

The consumer of the plan is "a skilled developer who knows almost nothing about this codebase" (possibly future you, or a subagent). If the plan says "add error handling," the executor has to decide how — but that decision should be made during the planning phase, not implementation.

**Why no placeholders**:

Placeholders represent "not wanting to make a decision during planning." But "decide later" means the execution phase stops to ask questions when problems arise — this breaks the workflow. The plan's job is to make all decisions before execution.

**Counterexample**: The plan has "Task 5: Add appropriate error handling." The executor reaches this and doesn't know what "appropriate" means — return a 500 error? Retry? Degrade? They have to go back and ask the plan author, breaking the workflow.

---

#### Design Decision 2: "Assume Executor Is Skilled But Has Zero Context"

**Decision**: The plan assumes the executor is a skilled developer but knows almost nothing about the toolchain and problem domain.

**Why**: This assumption precisely describes the state of a subagent — they have general programming ability (know how to write Python, how to use git) but don't know this project's specific conventions ("this project uses pytest not unittest," "error handling follows this pattern").

The plan needs to fill this gap: provide exact file paths, exact commands, exact code patterns. The executor doesn't need guidance on "how to program," they need guidance on "how to do it in this project."

**Counterexample**: Assume the executor knows project conventions. The plan says "write tests," the executor uses unittest but the project uses pytest. Rework required.

---

## 4. `executing-plans` — From Plan to Code

### Literal Level: What Does It Do?

`executing-plans` is the executor of the plan. It reads the plan document, executes step by step, and stops at checkpoints to report.

**Workflow**:

```
Step 1: Read and critically review the plan
         → Has concerns? → Raise them with the user before starting
         → No concerns? → Create TodoWrite

Step 2: Execute tasks
         → Mark each task in_progress
         → Follow steps strictly
         → Run validations
         → Mark completed

Step 3: Complete development
         → After all tasks are done
         → Invoke finishing-a-development-branch
         → Verify tests, present options, execute choices
```

**When to stop and ask for help**:
- Hit a blocker (missing dependency, test failure, unclear instruction)
- Plan has critical gaps that prevent starting
- Don't understand an instruction
- Validation keeps failing

**Core Rule**: **Ask, don't guess.**

### Design Level: Why Is It Designed This Way?

#### Design Decision 1: "Stop when blocked, ask instead of guessing" during execution

**Decision**: executing-plans stops immediately upon encountering any blocker and asks the user for clarification, rather than trying to resolve it independently.

**Why**: The executor's job is "follow the plan," not "modify the plan." If the plan has issues, the executor's guessed fix may not match the plan author's intent. Asking instead of guessing ensures the plan's authority and execution accuracy.

**Counterexample**: Plan says "use library X," but library X isn't installed. The executor guesses "then use library Y," installs Y, and continues. Result: Y's API differs from X, and all subsequent steps depending on X's API fail.

---

## Philosophy Level: What Beliefs Does It Reflect?

**Belief 1: Thinking mode and implementation mode are two entirely different states that require forced transitions.**

Brainstorming's HARD GATE, writing-plans' No Placeholders rule, executing-plans' "ask, don't guess" — all force the AI to do the right thing at the right moment: don't think about code during design, don't think about shortcuts during planning, don't deviate from the plan during execution.

**Belief 2: AI tends to skip discipline because it "feels" like it knows the answer.**

The 1% rule and red flag table directly counter this tendency. Every thought AI has of "this is simple, don't need X" is a signal it's trying to bypass discipline. Superpowers chose "mandatory" over "suggested" because suggestions get skipped by AI's "self-rationalization."

**Belief 3: Plan quality determines execution quality.**

Writing-plans' No Placeholders rule, bite-sized granularity, specific code requirements — all say: a plan is not a "rough to-do list" but a "script of exactly how to do it." Executors (especially subagents) need scripts, not checklists.

**Belief 4: "Simple" projects are the most dangerous.**

Brainstorming's anti-pattern clearly states: "this is too simple to need a design" is the most dangerous thought. Because assumptions in simple projects are most easily overlooked — to-do lists, config changes, single-function utilities — when these "simple" changes have wrong assumptions, the cost is as large as for complex features.

---

## Implications for gstack-plus

### Implication 1: "Mandatory invoke" spirit can apply to gstack-plus model routing

Superpowers' 1% rule says "must use even at 1% chance of applicability." In gstack-plus, the corresponding rule could be: "even at 1% chance this task needs Tier-A judgment, it must route to Tier-A."

**Specific application**: In the task classifier, set a "conservative routing" rule — when the classifier is unsure about task difficulty, default to routing to a higher tier, not lower. The cost is slightly more expense, but it avoids the huge cost of "Exec botched it and we need to start from scratch."

### Implication 2: Brainstorming's HARD GATE is a template for gstack-plus "planning and execution separation"

Superpowers says "absolutely no code writing before design approval." Gstack-plus can say "absolutely no Exec work before Tier-A plan approval."

**Specific application**: Add a hard gate in the handoff template: Exec models can only receive tasks after "plan approved + task description is clear + verification criteria are defined."

### Implication 3: No Placeholders rule applies to handoff directive design

Writing-plans' No Placeholders says "plans must not have TBD/TODO." Gstack-plus handoff directives should follow the same: instructions to Exec models must not have vague areas — "handle errors" is not enough; say "if NetworkError occurs, retry 2 times, then return 500."

### Implication 4: "Ask, don't guess" is a good behavior pattern when Exec models fail

Executing-plans stops and asks when blocked. Gstack-plus Exec models should do the same: when encountering uncertainty, return to Claude for questions rather than guessing on their own.

### Implication 5: Bite-sized granularity applies to Exec model task decomposition

Writing-plans requires each step to be a single action of 2-5 minutes. Gstack-plus tasks for Exec models should also be split this way: not "build the entire billing module," but "write the Payment.process() function, accepting amount and currency parameters, returning transaction_id."

**Specific application in gstack-plus — Forbidden Words List**:

In task descriptions dispatched to Qwen Exec, the following words must be replaced before dispatch:

| Forbidden Word | Problem | Replacement |
|-------|------|---------|
| "appropriate" | Qwen will use its own judgment for "appropriate" | Replace with specific conditions: "under 100ms" |
| "reasonable" | Same as above | Replace with measurable criteria: "passes lint rules" |
| "if needed" | Qwen will usually choose "not needed" | Replace with explicit instruction: "must add" or "do not add" |
| "depending on the situation" | Pushes the decision to Qwen, but Qwen lacks global view | Claude makes the decision before dispatch and writes it explicitly |
| "similarly," "and so on" | Qwen may infer the wrong analogy target | Explicitly list all locations that need modification |

❌ Wrong task description: "Add error logging in appropriate places"
✅ Correct task description: "In src/api/user.ts, line 45, inside the catch block, add console.error
   in the format: `[ERROR][${new Date().toISOString()}][fetchUser] ${error.message}`"

---

## Key Differences: Superpowers vs gstack Planning Skills

| Dimension | gstack | Superpowers |
|------|--------|-------------|
| Planning trigger | User invokes `/plan-*` skills | Mandatory brainstorming before any implementation |
| Planning roles | Different roles have different perspectives (CEO/Eng/Design) | Unified "Product Designer + Architect" role |
| Planning output | Design doc + review findings | Spec doc + implementation plan |
| Mandatory | Optional (but `/ship` suggests it) | Mandatory (HARD GATE) |
| User interaction | AskUserQuestion at key points | One question at a time, step-by-step approval |
| Plan format | Natural language + ASCII diagrams | TDD format + specific code + specific commands |
| Granularity | Feature-level | Step-level (2-5 minutes) |

**Core insight**: gstack's planning is "multi-angle review," superpowers' planning is "from idea to script." Gstack assumes the user already has an idea and needs to ensure it's a good one; superpowers assumes the user only has a creative idea and needs to turn it into an executable script first.

---

## What I Haven't Fully Understood Yet

- The selection logic between `executing-plans` and `subagent-driven-development`: when to choose which? How does plan complexity affect this choice?
- The concrete implementation of Brainstorming's Visual Companion — how does it generate mockups and architecture diagrams?
- Superpowers skills are much shorter than gstack skills — is this because superpowers is more streamlined, or because it relies more on external references (like `visual-companion.md`)?
- Does the 1% rule in `using-superpowers` lead to over-invocation in practice (invoking 5-6 skills per message)?

---

*Completed 2026-05-02*
