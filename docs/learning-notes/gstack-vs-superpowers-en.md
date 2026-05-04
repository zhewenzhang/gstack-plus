# gstack vs Superpowers: Design Philosophy Comparison

> Day 12 | Comprehensive comparison of two systems' design philosophy, workflow, user assumptions, and quality gates

---

## Basic Positioning Comparison

| Dimension | gstack | superpowers |
|------|--------|-------------|
| Self-definition | AI workflow skill library | AI discipline system |
| Core belief | AI era bottleneck shifted from productivity to judgment | AI's discipline is insufficient (not capability) |
| Target users | AI-augmented independent developers / technical leads | Anyone using AI-assisted development |
| Implementation | 26+ role-based skills (each is a structured workflow) | Discipline rule collection (each is a non-negotiable rule) |
| Platform | Claude Code | Multi-platform (Claude Code, Copilot CLI, Gemini CLI) |

**One-sentence summary**: gstack says "make AI make the right judgment at the right moment," superpowers says "make AI work under enforced discipline."

---

## Skill Design Philosophy Comparison

### Markdown Format

| Dimension | gstack | superpowers |
|------|--------|-------------|
| Typical length | 500-2000+ lines (including preamble) | 50-200 lines |
| Structure | Steps + decisions + ASCII diagrams + report templates | Core principles + rules + red flag tables |
| Preamble | Long (bash code, session tracking) | None (starts from line one) |
| Expression | Workflow ("do A first then B if C then D") | Discipline rules ("must do Y before doing X, no exceptions") |

### Length

gstack's skills are longer because:
1. **Embedded platform code**: Preamble contains大量 bash (session tracking, learnings search, telemetry)
2. **Role definitions**: Each skill has complete role descriptions and cognitive patterns
3. **Report templates**: Embedded standardized report formats (e.g., DEBUG REPORT, PR Quality Score)

superpowers' skills are shorter because:
1. **Pure discipline rules**: Discipline rules are stated in one sentence ("cannot claim done without verification")
2. **No role dependency**: Doesn't define "you are role X," only defines "you must do Y"
3. **References auxiliary files**: Doesn't embed long content, instead references external files (`root-cause-tracing.md`)

### Structure

gstack's structure is **process-driven**:
```
Step 1 → Step 2 → Decision → Step 3a/3b → Step 4 → ...
```

superpowers' structure is **rule-driven**:
```
Iron Law: Must not do X
Red Flag: If you want to do X, stop
Rule: Must do Z before doing Y
```

---

## Workflow Design Comparison

### Presence of STOP Points

| | gstack | superpowers |
|--|--------|-------------|
| STOP points | Multiple (AskUserQuestion at critical nodes) | Few (HARD GATE in brainstorming) |
| Form | Fixed-format AskUserQuestion (A/B/C options + background + recommendation) | "Ask instead of guess" rule |
| Philosophy | Humans always retain final judgment | Cannot write code before design approval |

**Key difference**: gstack's STOP points are "human approval"—AI collects information, humans decide. superpowers' STOP points are "clarifying questions"—AI asks when it doesn't know, then continues after asking.

### Presence of AskUserQuestion

gstack uses AskUserQuestion extensively:
- Review staleness → offer quick review
- Test failure triage → choose handling method
- Coverage gate → decide whether to continue
- First-time dry-run → confirm deployment configuration
- Readiness gate → confirm merge

superpowers uses it less:
- Brainstorming clarifying questions (one at a time)
- Visual Companion accept or not
- Design approval
- Worktree baseline test failure when asking

**Key difference**: gstack's AskUserQuestion is a "decision point"—users need to choose among multiple options. superpowers' AskUserQuestion is "information gathering"—users provide context AI is missing.

### Presence of Iron Law

gstack's Iron Law (from `/investigate`):
- **Never apply fixes before identifying root cause**
- **Never fix without regression test**
- **Never fix without test showing failure before fix**
- **3 strikes rule**

superpowers' Iron Laws (scattered across skills):
- **NO COMPLETION CLAIMS without running verification commands**
- **NO FIXES WITHOUT ROOT CAUSE**
- **NO PRODUCTION CODE WITHOUT FAILING TEST**
- **1% rule (must invoke even if only 1% likely to apply)**

**Key similarity**: Both have "cannot fix without root cause" and "3 strikes rule." This shows these two disciplines are universal principles distilled from real failures, not a single system's design.

**Key difference**: gstack's Iron Laws are concentrated in `/investigate` (debugging scenarios), superpowers' Iron Laws are scattered across multiple skills (general discipline).

---

## User Assumption Comparison

### Who Is the Assumed User?

| | gstack | superpowers |
|--|--------|-------------|
| Primary scenario | Independent developer or small team technical lead | Anyone using AI-assisted development |
| Programming ability | Has programming experience, but not necessarily expert | Has programming experience |
| AI experience | Familiar with AI-assisted development | Familiar with AI-assisted development |
| Judgment | Has product insight (can answer office-hours' 6 questions) | Can approve designs, provide context |
| Primary risk | Too fast, wrong direction; insufficient completeness; over-trusting AI | AI skips discipline, claims done without verification, rationalizes |

### What Are the User's Primary Risks?

**Risks gstack assumes for users**:
1. **Direction risk**: AI makes code productivity huge, but the cost of wrong direction is also huge → Needs CEO review, office-hours
2. **Completeness risk**: AI-generated code looks right but lacks tests, docs, edge cases → Needs Boil the Lake, QA process
3. **Over-trust risk**: Users may think AI-generated code is correct → Needs Anti-sycophancy, Review Army
4. **Knowledge accumulation risk**: Every session starts from zero → Needs Learnings system

**Risks superpowers assumes for users**:
1. **Discipline risk**: AI tends to skip discipline → Needs 1% rule, mandatory invoke
2. **Verification risk**: AI claims done without verification → Needs verification-before-completion
3. **Root cause risk**: AI tries to fix without finding root cause → Needs systematic-debugging
4. **Testing risk**: AI writes code first then adds tests → Needs TDD discipline

**Key insight**: gstack assumes the user's risk is "doing things too fast," superpowers assumes the user's risk is "doing things undisciplined." gstack's solution is "multi-angle review," superpowers' solution is "enforced rules."

---

## Skill Invocation Mechanism Comparison

### gstack: Proactive Routing

gstack's skill invocation is **user-driven selection**:
- User decides "need review now" → invoke `/review`
- User decides "need planning now" → invoke `/autoplan`
- User decides "need to ship now" → invoke `/ship`

But gstack also has **proactive suggestion** mechanisms:
- Skills can suggest next steps at the end (`/review` suggests `/qa`, `/freeze`)
- Review Readiness Dashboard reminds users which reviews haven't been run
- But the final decision is with the user

### superpowers: Mandatory Invoke

superpowers' skill invocation is **mandatory and automatic**:
- 1% rule: "Must invoke even if only 1% chance of applicability"
- AI has no choice—if a skill might apply, it must be invoked
- Skills override system default behavior (but not user instructions)

**Fundamental difference**:

gstack trusts the user's judgment to choose when to invoke skills. Users may miss invocation timing, but skills will suggest at the end.

superpowers doesn't trust AI's judgment to choose when to invoke skills. AI will always say "not needed this time," so mandatory rules ensure every invocation.

**Deeper insight**: gstack's "proactive suggestion" and superpowers' "mandatory invoke" are actually solving the same problem—"AI may not invoke skills it should." gstack's solution is "remind but don't force," superpowers' solution is "force without reminding."

---

## Quality Gate Comparison

| Dimension | gstack | superpowers |
|------|--------|-------------|
| Quality method | Process (QA engineer role + browser automation) | Discipline (rules + verification commands) |
| Test depth | End-to-end (browser + user flows + Health Score) | Unit (TDD + command verification) |
| Coverage | 60% minimum / 80% target (Coverage Audit subagent) | No explicit target (TDD naturally grows coverage) |
| Automation degree | High (auto-fix, atomic commits, regression test generation) | Low (manual fix, discipline guarantee) |
| Parallel review | Review Army (multiple specialists reading the same diff in parallel) | Two-stage review (spec → quality, sequential) |
| Failure handling | Fix Loop (auto-fix each bug + atomic commit) | Ask instead of guess (stop and ask when blocked) |

**Core difference**:

gstack's quality gates are **automated processes**—run browser, test user flows, calculate Health Score, auto-fix. Users see results ("Health Score: 92/100") and can decide whether to accept.

superpowers' quality gates are **discipline guarantees**—cannot claim done without running verification commands, cannot fix without finding root cause, cannot write code without failing tests. Users don't see a score, but a guarantee that "these rules were followed."

---

## Parallel Architecture Comparison

| Dimension | gstack Review Army | superpowers Parallel Agents |
|------|-------------------|---------------------------|
| Parallel target | Multiple specialists (Testing, Maintainability, Security...) | Multiple general-purpose agents |
| Parallel purpose | Multi-angle review of the same diff | Parallel solving of multiple independent problems |
| Parallel type | Parallel reading (no code modification) | Parallel writing (code modification) |
| Context isolation | Each specialist has fresh context (bias isolation) | Each agent has carefully constructed context |
| Conflict handling | Not applicable (read-only) | Strictly limited (only parallel independent problem domains) |
| Git infrastructure | Not needed | Needs worktree |
| Result merging | Deduplication (same fingerprint → confidence +1) | Check conflicts + run full test suite |

**Fundamental difference**: gstack is parallel analysis, superpowers is parallel implementation.

**Each one's failure scenarios**:

**gstack Review Army (parallel reading) boundaries**:
Multiple reviewers looking at static code in parallel cannot see "runtime behavior."
Typical blind spots: race conditions (only appear during concurrent execution), environment dependency issues (only triggered on specific OS).
Review Army will miss these bugs because they're not in the code text, but in execution paths.

**superpowers parallel agent implementation (parallel writing) boundaries**:
Agent A and Agent B both modify `src/api/client.ts` simultaneously—A adds retry logic, B adds timeout.
Both are based on the old version of the file, creating conflicts on merge.
Even with git worktree for isolation, merging worktrees back to main still requires manual resolution of logical conflicts
(not git conflicts, but "whether the interaction logic between retry and timeout is correct").

**gstack-plus inspiration**:
When parallel Qwen Exec tasks run, Claude acts as "logical reviewer during merging"—
Qwen handles implementation, Claude ensures semantic consistency between parallel implementations.

---

## Comprehensive Evaluation: Strengths and Weaknesses of Each

### gstack's Strengths

1. **Completeness guarantee**: 26+ skills cover the complete lifecycle from planning to shipping
2. **High automation degree**: Browser testing, auto-fix, atomic commits, coverage audit—users don't need to do these manually
3. **Role depth**: "You are a paranoid Staff Engineer" works far better than "do code review"
4. **Knowledge accumulation**: Learnings system shares project knowledge across sessions
5. **User experience**: AskUserQuestion's fixed format ensures users get full information and options

### gstack's Weaknesses

1. **Single model**: The entire workflow only uses Claude, no cost advantage from model division
2. **Steep learning curve**: The existence, purpose, and invocation timing of 26+ skills requires大量 learning
3. **Speed**: Thorough every time, not suitable for rapid prototyping scenarios
4. **Platform lock-in**: Deep integration with Claude Code (hooks, browser daemon)
5. **No cost tracking**:大量 token consumption but no visualization

### superpowers' Strengths

1. **Discipline strength**: Non-negotiable rules ensure behavioral reliability
2. **Platform-agnostic**: Doesn't rely on Claude Code-specific features, applicable to multiple AI tools
3. **Concise**: Skills are short and focused, quickly understood
4. **Failure learning**: Red flag tables distilled from 24 failure memories are highly practical
5. **Rationalization prevention**: Directly counters AI's most dangerous behavior—making excuses for skipping discipline

### superpowers' Weaknesses

1. **Relies on self-discipline**: Discipline rules have no automation guarantee—AI may still skip
2. **Coverage scope**: Doesn't cover the complete lifecycle of planning, design, shipping, etc.
3. **No knowledge accumulation**: No cross-session knowledge sharing mechanism
4. **Low user interaction**: Ask-instead-of-guess mode efficiency depends on user response speed
5. **No role depth**: Doesn't leverage LLM's "role-playing" capability advantage

---

## Core Argument Evaluation

### Argument 1: gstack Is a "Workflow Framework," superpowers Is a "Behavioral Discipline Framework"

**Support**: ✅

gstack's 26+ skills provide complete workflow coverage—from planning to design to execution to review to shipping. Each skill is a structured step sequence, guaranteeing "all necessary steps are executed."

superpowers' skills are discipline rule collections—"cannot claim done without verification," "cannot fix without root cause," "cannot write code without failing tests." It doesn't define a complete workflow; it defines rules that must be followed within the workflow.

**gstack-plus inspiration**: gstack-plus needs to do both:
1. **Workflow**: Define the complete process of multi-model collaboration (planning → review → execution → verification)
2. **Discipline**: Define non-negotiable rules at each stage (must independently verify after Exec completion)

---

### Argument 2: gstack Trusts User Judgment, superpowers Doesn't Trust AI Self-Discipline

**Support**: ✅

gstack's users always have final decision power (AskUserQuestion), skills are "suggest and execute" not "force." Users can skip review, can refuse to fix, can choose different deployment methods.

superpowers' 1% rule says "must use even if you think it's not needed." It doesn't trust AI to self-judge "when discipline is needed"—because AI's judgment has systematic bias (always偏向 skipping).

**gstack-plus inspiration**: gstack-plus should:
- **Trust users**: Users decide the model division strategy (conservative vs aggressive, cost budget)
- **Not trust AI**: Exec model output must be independently verified, can't skip just because "it performed well last time"

---

### Argument 3: gstack Optimizes "Completeness" (Boil the Lake), superpowers Optimizes "Reliability" (Enforced Verification)

**Support**: ✅

gstack's Boil the Lake principle says "do the complete thing"—100% test coverage, all edge cases, full documentation. It optimizes for "nothing missed."

superpowers' verification-before-completion says "run commands and see output before claiming done." It optimizes for "truthfulness of claims."

**gstack-plus inspiration**: gstack-plus needs to optimize both:
- **Completeness**: Exec models should also do the complete thing (not just make tests pass, but also handle edge cases, write docs)
- **Reliability**: Exec model claims must be independently verified (don't believe it just because it says it passed)

---

## Inspiration for gstack-plus: How to Merge Both?

### What gstack-plus Should Borrow from gstack

1. **Role-based design**: Each Tier should be a clear role (Architect, Reviewer, Executor) with specific behavioral frameworks
2. **Structured workflow**: Planning → review → execution step sequence, not improvisation
3. **Learnings system**: Cross-session sharing of "what errors Exec models tend to make on which types of tasks"
4. **Boil the Lake**: Exec models should also do the complete thing, not just "core functionality"
5. **Review Army model**: Parallel specialist review can be borrowed as parallel verification (functional testing + security + performance)
6. **Fix-First philosophy**: Obvious issues auto-fixed, ambiguous ones ask the user
7. **User Sovereignty**: Users always have final decision power, AI provides information

### What gstack-plus Should Borrow from superpowers

1. **Discipline rules**: Must independently verify after Exec completion, task descriptions must be clear, failures must be reported

**Independent verification = the evidence field in Exec handoff**

Specific implementation: Every Qwen handoff must include an `evidence` field, formatted as:

```
Task: Modify user login logic
Status: Complete

evidence:
  - command: "npm test src/auth/"
    output: "18 passed, 0 failed"
  - command: "npm run typecheck"
    output: "Found 0 errors."
  - modified_files: ["src/auth/login.ts", "src/auth/token.ts"]
    planned_files: ["src/auth/login.ts", "src/auth/token.ts"]
    out_of_scope: []
```

Verification rules after Claude receives handoff:
- `evidence` field missing → reject, require Qwen to supplement
- `out_of_scope` non-empty → require Qwen to explain, revert unexplained modifications
- Command output shows failure → don't accept verbal claims of "but functionally correct"

This directly prevents the situation of "Qwen says done but tests didn't pass."

2. **Rationalization prevention**: List thoughts Claude might have to skip verification, preemptively counter them
3. **No Placeholders**: Handoff instructions must have no ambiguity
4. **Ask instead of guess**: Exec reports when uncertain, doesn't guess on its own
5. **3-strike rule**: Exec fails 3 times → escalate to stronger model
6. **Evidence before assertions**: Don't believe just because Exec says "tests passed"—Claude must run them independently
7. **Bite-sized task splitting**: Each Handoff task should be a single action of 2-5 minutes

### gstack-plus's Unique Innovation: Model Division

The problem neither solves: **how to use multiple models collaboratively, reducing cost while maintaining quality**.

gstack-plus's core incremental value:
1. **Task classifier**: Auto-identify task type → route to correct model (gstack manually selects skills, superpowers mandates invocation)
2. **Failure fallback**: Exec failure → smart escalation (not restart from zero)
3. **Cost tracking**: Token consumption and cost visualization per model
4. **Model routing strategy**: Conservative (default high tier) vs aggressive (default low tier) configurable

---

## My Final Comprehensive Insight

After reading all 12 notes (5 existing + 7 new), my understanding of both systems has reached a new level:

**gstack and superpowers are not competitors—they are complementary.**

gstack provides "the blueprint of complete workflow"—what should be done at each stage from planning to shipping.
superpowers provides "the discipline at each stage"—what rules should be followed before doing anything.

**gstack-plus's correct positioning is: on top of gstack's workflow blueprint, layer superpowers' discipline rules, then add the dimension of model division.**

```
gstack's workflow:  Planning → Design → Execution → Review → Shipping
superpowers discipline: 1% rule  TDD   Verify   Root cause   No Claims
gstack-plus adds: Tier-A  Mid   Exec  Verification   Cost tracking
```

These three are not replacement relationships, they are叠加 relationships.

---

*Completed 2026-05-02*
