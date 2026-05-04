# gstack Planning Skills Deep Dive

**Study Date**: 2026-05-02 (Day 2)
**Covered Skills**: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/autoplan`
**Study Method**: Read through each skill's complete SKILL.md, focusing on workflow steps and design decisions

---

## Literal Layer: What Do These Four Skills Do?

### `/office-hours` — YC Office Hours

**Core task**: Before any code is born, figure out "what are we building, and why."

**Strict HARD GATE**: This skill absolutely must not write code, invoke other implementation skills, or do any implementation work. It produces only one deliverable: a design document.

**Workflow** (3 phases):

**Phase 1: Context Gathering**
1. Read CLAUDE.md, TODOS.md, git log (last 30 entries)
2. List existing design documents for this project
3. Search relevant historical learnings
4. **Ask the user one question**: "What's your goal?" → Based on the answer, decide Startup mode or Builder mode

**Phase 2A: Startup Mode (the most important part)**

6 "probing questions," each requiring specific, evidence-based answers:

| Question | What It Asks | Red Flag Signals |
|------|--------|---------|
| Q1 Demand Reality | Strongest evidence that "someone really needs this" | "Many people say they're interested," "500 people on waitlist" |
| Q2 Status Quo | What are users using as a substitute now | "Nothing exists yet, so the opportunity is huge" |
| Q3 Desperate Specificity | Name the specific "person" who needs this most, and their job title | "Enterprise customers," "developers" (not specific enough) |
| Q4 Narrowest Wedge | What's the smallest version people would pay for this week | "Need a full platform to deliver value" |
| Q5 Observation & Surprise | Have you sat and watched people use it (without talking)? What surprised you? | "We did a survey," "the demo went well" |
| Q6 Future-Fit | In 3 years when the world is different, is this product more or less important? | "The market is growing 20%" (not a thesis) |

**Phase 2B: Builder Mode** (hackathons, open source, learning, etc.)
- Collaborative, find the "coolest version," ask "what would make people say 'whoa'?"

**Phase 3: Premise Challenge**
- Propose 3-5 implicit assumptions behind the product, ask user to confirm/deny
- Confirmed assumptions become the foundation of the design document

**Phase 4: Implementation Plan**
- Provide 2-3 specific options, each with effort estimates (human time vs CC time)

**Phase 5: Design Document Output**
- Save to `~/.gstack/projects/$SLUG/{branch}-design-{timestamp}.md`
- This document is read by all downstream review skills

---

### `/plan-ceo-review` — CEO Perspective Plan Review

**Core task**: Find the "10-star product hidden inside this request."

**4 modes** (selected in the first step):
- **SCOPE EXPANSION**: Dream bigger, recommend every expansion opportunity
- **SELECTIVE EXPANSION**: Hold current scope, but show things that could be added one by one
- **HOLD SCOPE**: Strictly review the current plan, no additions or reductions
- **SCOPE REDUCTION**: Find the minimum viable version, cut everything else

**Pre-Review System Audit** (before formal review):
```
git log --oneline -30          # Recent history
git diff <base> --stat         # What has changed
grep -r "TODO|FIXME|HACK" ... # TODO hotspots
Most touched files in last 30 days
Read CLAUDE.md, TODOS.md, architecture docs
```

**9 Prime Directives** (review criteria):
1. Zero silent failures: Every failure must be visible
2. Every error has a name: Don't accept "handle errors," specify what error
3. Data flows have shadow paths: null inputs, empty inputs, upstream errors
4. Interactions have edge cases: double-clicks, mid-way exits, slow connections, expired states
5. Observability is in scope, not an afterthought
6. Diagrams are mandatory: Every non-trivial process needs an ASCII diagram
7. All deferrals must be written down: Vague intentions are lies
8. Optimize for 6 months from now: Don't create next quarter's nightmare by solving today's problem
9. Has the right to say "tear it down and start over"

**18 CEO Cognitive Patterns** (internalized, not a checklist):
- Bezos: Reversible/irreversible decisions, speed calibration, agency suspicion, regret minimization
- Munger: Inversion reflex ("what would make us fail?")
- Jobs: Focus means subtraction (from 350 products to 10)
- Horowitz: People-product-profit order, wartime vs peacetime management
- Grove: Paranoid scanning ("only the paranoid survive")
- Altman: Willpower as strategy, leverage obsession
- Rams: Subtraction by default ("as little design as possible")

---

### `/plan-eng-review` — Engineering Manager Plan Review

**Core task**: Make the plan buildable—architecture, tests, edge cases, diagrams.

**Prerequisite Offer Mechanism**:
If no design document is found (didn't run `/office-hours`), ask the user:
> "Want to run /office-hours first to give the review better input? (about 10 minutes)"

If the user selects A, inline-load and execute the full office-hours workflow, then continue with eng review.

**Step 0 Scope Challenge** (first step of every review):
1. Does existing code already partially solve this problem?
2. What's the minimum change set to achieve the goal?
3. Complexity check: >8 files or >2 new classes/services = code smell, recommend subtraction
4. Search check: Does the framework have this built-in? Is this current best practice? Are there known pitfalls?

**4 Review Paragraphs** (all must be evaluated, none can be skipped):

**1. Architecture Review**
- System design and component boundaries
- Dependency graph and coupling issues
- Data flow and bottlenecks
- Security architecture
- Build and release pipeline for distributed artifacts (binary/package/container)
- One "real production failure scenario" for each new code path

**2. Code Quality Review**
- DRY violations (proactively flag)
- Error handling patterns and missing edge cases
- Over-engineering or under-engineering
- ASCII diagram maintenance (code changed, is the diagram next to it stale?)

**3. Test Review — The Most Detailed Section**

Goal: 100% coverage.

5 steps:
1. **Trace every codepath**: From every entry point, trace data flow, draw all branches
2. **Map user flows**: User interactions, double-clicks, mid-way exits, slow connections, concurrency
3. **Check each branch**: Search whether there's a test covering each branch
4. **Output ASCII coverage diagram**: Code paths + user flows, scored with ★★★/★★/★
5. **E2E Decision Matrix**: Decide whether each branch needs unit test or E2E

IRON RULE (non-negotiable): If a regression is found, a regression test must be added—no asking the user.

**Plan-to-QA Flow**: Eng review's test analysis results are written to `~/.gstack/projects/`, `/qa` reads them automatically.

**4. Performance Review**
- Load time impact
- Query efficiency (N+1, missing indexes)
- Resource limits

**15 Engineering Manager Cognitive Patterns**:
- Larson (An Elegant Puzzle): 4 team states (behind, treading water, paying debt, innovating)
- McKinley: Default to boring tech (innovation budget is limited)
- Fowler: Incremental is better than revolutionary
- Google SRE: Error budgets, not uptime targets
- Brooks (No Silver Bullet): Essential complexity vs accidental complexity
- Beck: Make changes easy first, then make the easy change

**Confidence Calibration System**:
Each finding has a confidence score 1-10:
- 9-10: Verified, saw a specific code bug
- 7-8: High confidence pattern matching
- 5-6: Medium, add a warning
- 3-4: Low confidence, put in appendix
- 1-2: Only report if P0 severity

---

### `/autoplan` — Automated Review Pipeline

**Core task**: One command, from rough plan to fully reviewed plan.

**Execution flow**:
1. Read CEO + Design + Eng + DX review SKILL.md from disk
2. Execute them in full sequence: CEO → Design → Eng → DX
3. All intermediate AskUserQuestion decisions are made automatically using 6 decision principles
4. Finally present "taste decisions" for user confirmation

**6 Decision Principles** (rules for automatic decisions):
1. Choose completeness: The option that covers more edge cases
2. Boil lakes: Fix everything within the blast radius (<5 files, <1 day CC effort)
3. Pragmatism: Two options solving the same problem, choose the cleaner one
4. DRY: If functionality already exists, reject reimplementation
5. Explicit over clever: 10 obvious lines > 200 lines of abstraction
6. Bias toward action: Merge > review cycles > stale discussions

**Decision Classification** (three types):

| Type | Definition | Handling |
|------|------|---------|
| Mechanical | Only one obviously correct answer | Silently auto-decide |
| Taste | Reasonable people may disagree | Auto-decide but present at final gate |
| User Challenge | Both models agree the user's direction should change | Never auto-decide, must ask user |

**Special Handling for User Challenge**:
When both Claude and Codex believe the user's established direction should change, must provide:
- What the user said (original direction)
- What both models suggest (specific change)
- Why
- What context we might be missing (explicit acknowledgment of blind spots)
- What the cost is if we're wrong

The user's original direction is the default. Models must argue for change, not the other way around.

---

## Design Layer: Why Is It Designed This Way?

### Design Decision 1: Anti-Sycophancy Rules

`/office-hours` has an explicit "forbidden phrases" list:
- ❌ "That's an interesting approach" → Replace with: State your position directly
- ❌ "There are many ways to think about this" → Replace with: Pick one, state clearly what evidence would change your position
- ❌ "You might want to consider..." → Replace with: "This is wrong because..." or "This works because..."
- ❌ "That could work" → Replace with: State clearly "based on existing evidence, will this actually work"

**Why**: AI's default mode is "find consensus," which is disastrous in consulting scenarios. The value of YC office hours lies precisely in "questions that make you uncomfortable." If AI is unwilling to directly say "your demand validation isn't sufficient, this isn't real demand," then the entire skill is meaningless.

**Counter-example**: Without this rule, AI would say "very interesting idea! There are some things worth considering..." and the founder feels validated and continues building the wrong product for 6 months.

**Implication for gstack-plus**: In the design of any "analysis/evaluation" task, explicitly define what AI must NOT do, not just what AI should do.

---

### Design Decision 2: Prerequisite Skill Offer

`/plan-eng-review` and `/plan-ceo-review` both check before starting: Is there a design document? If not, offer the option to run `/office-hours`.

**Why**: Good engineering reviews need clear problem statements. Without `/office-hours`'s design document, the review's starting point is "a vague requirement" rather than "a validated product hypothesis." The result: reviewing many things correctly, but possibly reviewing the wrong problem.

**Counter-example**: Without this check, engineers might perfectly implement a feature nobody actually needs.

**Design detail**: This "invitation" is not mandatory and doesn't block the user from continuing. But it makes the skill's dependency relationships explicit, rather than requiring users to remember "I should run office-hours first."

**Implication for gstack-plus**: When designing Handoff templates, passing context should include "does this task have prerequisites? Are prerequisites complete?"

---

### Design Decision 3: Iron Law

`/plan-eng-review`'s regression test rule: "If a regression is found, a test must be added—no asking the user, no skipping, no negotiation."

**Why**: Most AskUserQuestion instances balance user choice against best practices. But there's a category of things that cannot be negotiated: the probability of something already broken breaking again can only be prevented by tests. If users can "choose not to write a regression test," they'll almost always choose "skip" (because it feels unnecessary).

**Counter-example**: If this were optional, developers would say "time is tight, we'll add it later," and never add it. Three months later, the same bug returns.

**Implication for gstack-plus**: In task classification, some dimensions of decisions should not be routed to Exec models, because Exec models may "take shortcuts." What cannot be shortcutted must be explicitly defined.

---

### Design Decision 4: Decision Classification

`/autoplan` classifies intermediate decisions into three types, each handled completely differently.

**Why**: Not all decisions are the same.
- **Mechanical** (only one right answer): Auto-decide, don't waste the user's attention
- **Taste** (reasonable disagreement possible): Can have a default, but the user should know
- **User Challenge** (models think the user's direction is problematic): This is the most dangerous—cannot auto-decide, because the user may have context the models don't

The most important insight: **User Challenge's default is the user's original direction, not the model's recommendation**. Models must argue why to change, not the user why not to change. This is the concrete implementation of User Sovereignty in the autoplan scenario.

**Counter-example**: If models could "automatically override the user's direction," what would happen? User says A, autoplan changes to B (because both models think B is better), user starts executing plan B, and 3 weeks later discovers B doesn't match their business needs. The loss is enormous.

**Implication for gstack-plus**: During model routing, when "the Exec model suggests changing the task description," this situation needs special handling. Exec cannot modify the task definition on its own—it must escalate to Tier-A for confirmation.

---

### Design Decision 5: Confidence Calibration

`/plan-eng-review` gives each finding a 1-10 confidence score. Low-confidence findings are filtered to the appendix, not appearing in the main report.

**Why**: A flood of "maybe there's a problem" warnings vs a high-confidence "here's a SQL injection" impose completely different cognitive loads on the user. Signal-to-noise ratio determines whether the skill is worth using. If every review outputs 50 findings, users will simply ignore them.

**Additional design**: If a user confirms a low-confidence finding is a real bug, this "calibration event" should be recorded so future reviews can identify the same type of issue with higher confidence. This is one application of the learnings system.

**Implication for gstack-plus**: In task verification design, Tier-Mid's verification output should also have confidence levels, not binary pass/fail.

---

## Philosophy Layer: What Beliefs Does It Reflect?

### Belief 1: Problem Space > Solution Space

`/office-hours`'s HARD GATE preventing AI from writing any code is deliberate.

In today's world where AI technology makes code generation "too easy," the biggest risk is no longer "writing code too slowly," but "spending 2 months building something nobody needs." gstack's planning skills put problem-space clarification at the highest priority, using structured processes to force slower thinking before coding.

### Belief 2: CEO and Eng Manager Have Different Cognitive Modes

gstack doesn't just list a bunch of "review points." It internalizes different cognitive frameworks based on roles: CEO mode has Bezos/Munger/Jobs thinking; Eng Manager mode has Larson/Fowler/Brooks thinking.

This design shows that gstack's author (Garry Tan) believes: excellent decisions come from the right cognitive framework, not just the right checklist. LLMs can be "framed" into specific roles, which is more effective than prompts.

### Belief 3: Good Processes Are Progressive (Progressive)

The `office-hours` → `plan-ceo-review` → `plan-eng-review` design makes each skill's output the next skill's input. This isn't just "you can use it this way"—it's reinforced by the skills themselves: each review skill checks for upstream design documents at the start.

The ultimate effect of this progressive design: you cannot "skip problem definition and go straight to technical architecture review" without the system reminding you.

---

## Inspiration for gstack-plus

### What Can Be Borrowed

1. **Anti-sycophancy rules design pattern**:
   In any "analysis-type" prompt design for gstack-plus, explicitly state "what AI must not say," not just "what AI should say." This is key to preventing LLM default sycophantic behavior.

2. **Prerequisite explicitness mechanism**:
   Handoff templates should include a "predecessor task status" field. Before the Exec model starts work, it should be able to verify whether its required context is ready. If not, escalate and ask rather than silently continuing.

3. **Iron Law (non-negotiable minimum standards)**:
   In gstack-plus task specifications, some dimensions are "must" (e.g., verification steps), others are "optional." The boundary between must and optional must be clear—Exec models cannot lower necessary standards on their own.

4. **Decision Classification three-way split**:
   Mechanical decisions (Exec auto-does), Taste decisions (does but marks), User Challenge (must ask user)—these three categories are an important reference for gstack-plus model routing. Exec models can do Mechanical, can do Taste (but marked), cannot do User Challenge.

5. **Confidence Calibration**:
   Verification output should carry confidence levels, not be binary. High-confidence findings are presented directly, low-confidence ones go to the appendix, helping Tier-A quickly triage.

### What Can Be Improved

1. **gstack's planning skills are static**:
   `/plan-eng-review`'s 15 cognitive patterns are fixed, not adjusted by project type. The same framework is used for a CLI tool and a web app. gstack-plus should include a "project type" dimension in task classification, affecting routing to different cognitive frameworks.

2. **Prerequisite checks are manually triggered**:
   gstack's Prerequisite Skill Offer requires users to explicitly invoke the skill to trigger it. gstack-plus can automatically scan prerequisites upon task receipt, without users needing to know the execution order.

3. **No cost awareness**:
   `/autoplan`'s 6 decision principles all optimize quality, none consider "the token cost of this decision." gstack-plus needs to add a cost dimension to its decision principles.

### What Doesn't Apply

1. **YC probing questions**: Designed for "startup founders," gstack-plus's use case is technical tasks, so these 6 questions aren't needed. But "Anti-sycophancy rules" can be applied to any analysis-type task.

2. **CEO's 18 cognitive patterns**: These are high-level product/business decision frameworks. gstack-plus is a technical execution framework, so these patterns don't directly apply to technical routing decisions.

---

## Deep Insight: `/autoplan`'s User Challenge Mechanism Is gstack-plus's Core Template

When gstack-plus's Exec model completes a task and returns "this task description has issues, I think it should be redefined like this...", that is a User Challenge.

The correct way to handle this:

1. **Exec cannot modify the task definition on its own** (corresponds to gstack: User Challenge cannot be auto-decided)
2. **Must escalate with an admission of "what context I might be missing"** (corresponds to: explicitly state blind spots)
3. **Tier-A's response takes the user's original intent as the default** (corresponds to: user's original direction is the default)
4. **Only when both Tier-A and Exec agree the task definition is problematic, confirm with the user** (corresponds to: both models agreeing is required for User Challenge)

This mechanism prevents the risk of "the Exec model擅自 changing the task definition, ultimately completing the wrong task," and is an important reference for gstack-plus's Failure Recovery design.

---

*Notes by: Claude Sonnet 4.6 | Learning source: `~/.claude/skills/gstack/office-hours/SKILL.md`, `plan-ceo-review/SKILL.md`, `plan-eng-review/SKILL.md`, `autoplan/SKILL.md`*
