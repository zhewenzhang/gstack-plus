# Key Design Insights

> 5 design principles distilled from real multi-model collaboration — about AI discipline, role-based design, and quality assurance.

---

## The Top 5 Insights

### Insight 1: AI's "Lack of Discipline" Is More Dangerous Than "Lack of Ability" — But Both Need Solving

**Statement:** AI has the ability to do the right thing, but tends to skip discipline — in multi-model collaboration, this problem compounds rather than dilutes.

**Explanation:** superpowers' 24 failure memories prove: AI's failure mode isn't "can't write tests," it's "chooses not to write tests." In gstack-plus's multi-model environment, Claude (coordinator) might skip validating Exec output ("it didn't fail last time"), Exec might skip edge case handling ("core functionality is enough"), Tier-Mid might skip deep review ("looks fine"). Each model's discipline偏差 compounds, not cancels out.

**Application in gstack-plus:**
- Define non-negotiable discipline rules (NO EXEC CLAIMS WITHOUT INDEPENDENT VERIFICATION)
- Simultaneously define automated workflows (Claude auto-runs tests, auto-checks diffs) — discipline + automation, not just self-discipline

---

### Insight 2: "Role-Based Design" Is LLM's Strongest Capability — But Roles Need Discipline to Guarantee Output Quality

**Statement:** Making LLM "a paranoid Staff Engineer" works far better than "review the code" — but the role alone doesn't guarantee consistency. Discipline rules are needed as behavioral constraints for each role.

**Explanation:** gstack's role-based design (26+ skills mapping to different expert roles) exploits LLM's essential trait — they respond far better to "role instructions" than "functional instructions." But role is "perspective" (how to look at a problem), discipline is "behavior" (what to actually do). A "paranoid Staff Engineer" who claims completion without running tests — his paranoia is meaningless.

**Application in gstack-plus:**
- Each Tier should have a clear role: Tier-A = Architect (strategic judgment), Tier-Mid = Reviewer (complex review), Tier-Exec = Executor (mechanical execution)
- Each role should have discipline constraints: Architect can't start Exec before plan approval, Reviewer can't skip spec compliance check, Executor can't exceed task description scope

---

### Insight 3: Parallelism Is Speed, Isolation Is Quality — Both Need Careful Balance

**Statement:** subagent-driven-development's "fresh context" pattern and Review Army's "bias isolation" pattern both point to the same truth: each analysis/execution unit should have independent, clean context, not inheriting residue from the previous one.

**Explanation:** gstack's Review Army gives each specialist a "brand new context" to prevent bias contagion (testing specialist doesn't know what maintainability specialist said). superpowers' subagent-driven-development gives each task a "fresh subagent" to prevent context pollution (doesn't inherit session history). Different paths, same destination — isolation guarantees quality. But superpowers also warns: only parallelize on truly independent problem domains — shared-state task parallelism causes conflicts.

**Application in gstack-plus:**
- Each Exec subagent should receive carefully crafted handoff instructions (doesn't inherit previous Exec's context)
- Independent Exec tasks can run in parallel (modifying different files, different subsystems)
- Shared-state Exec tasks must run serially (one's output is another's input)
- Each Exec should work in its own git worktree

---

### Insight 4: The Cost Difference Between "Complete Things" and "Quick Things" Has Shrunk in the AI Era — But the Cost Difference Between "Right Things" and "Wrong Things" Has Grown

**Statement:** Boil the Lake's economic reassessment has new meaning in multi-model environments: the marginal cost of having Exec do complete things (tests + docs + edge cases) is tiny, but the cost of having Exec do the wrong things (wrong direction) is enormous.

**Explanation:** gstack's Boil the Lake says: AI shrinks the cost gap between complete implementation (100% test coverage) and shortcuts (90% coverage) from 1.75 days to 7 minutes. So every time, do the complete thing. In gstack-plus, this logic is stronger: having Exec spend 5 extra minutes writing tests and docs costs almost nothing. But if Exec's direction is wrong (implemented unwanted feature), the rework cost is an entire handoff cycle (potentially 30+ minutes).

**Application in gstack-plus:**
- Handoff instructions must include "complete definitions" (not just "do X", but "do X, test Y, doc Z, edge case W")
- No Placeholders rule: Handoff can't say "handle errors" — must say "if NetworkError, retry 2 times, then return 500"
- Exec tasks must be bite-sized (2-5 minute single actions), so the cost of "doing the complete thing" is truly negligible

---

### Insight 5: Failure Is Information, Not Disaster — The Key Is How to Classify and Escalate

**Statement:** gstack's Test Failure Ownership Triage and superpowers' 3-strike rule both point to the same pattern: failures should be classified (who caused it? what type?) then responded to based on classification (fix now? fix later? escalate?).

**Explanation:** gstack's `/ship` classifies test failures as In-branch (current branch caused) vs Pre-existing (existing problem), then gives different responses based on solo/collaborative mode. superpowers' systematic-debugging says: after 3 hypothesis failures, stop and question the architecture, don't keep trying. Both say: failure itself contains information — it tells us where the problem is, whose responsibility it is, and what strategy to use. In gstack-plus, Exec failures should also be classified and escalated, not simply "retry."

**Application in gstack-plus:**
- Exec failure classification: unclear instruction → clarify and retry; Exec misunderstanding → escalate to Tier-Mid analysis; task too hard → split task or escalate to Tier-A
- 3-strike rule: same Exec task fails 3 times → stop retrying with Exec, escalate to stronger model
- Failure mode records: write to Learnings system ("this type of task, Exec model commonly makes this error"), for future routing decisions

---

## Designs Worth Borrowing Directly from gstack

### 1. Role Personality Design

gstack's each skill isn't a "tool" but a "role" — "you are a paranoid Staff Engineer," "you are a QA Lead Engineer." Role descriptions include cognitive patterns, behavioral frameworks, values.

**Application:** Each Tier should have explicit role personality:
- Tier-A = "You are the chief architect, your job is ensuring direction is right and architecture is sound"
- Tier-Mid = "You are the senior reviewer, your job is finding hidden problems and integration risks"
- Tier-Exec = "You are the execution engineer, your job is implementing per exact spec"

### 2. Review Readiness Dashboard

gstack's Review Readiness Dashboard visualizes which reviews have run, which haven't, which are stale.

**Application:** A Dashboard showing "this handoff cycle's status":
- Plan: approved / needs revision
- Exec tasks: N/M complete
- Verification: pass / fail (which test)
- Cost: cumulative $X

### 3. Fix-First Philosophy

gstack's Fix-First: obvious problems auto-fix, ambiguous ones ask people.

**Application:** When Exec's output has small issues (format, naming, missing edge case handling), Claude should fix directly rather than ask users. Only when the issue involves direction judgment ("is this feature really needed?") should Claude ask the user.

### 4. Learnings System Extended for Cross-Model

gstack's Learnings system stores project-level knowledge ("this repo's tests use `bun test`").

**Extension for gstack-plus:** In addition to project knowledge, also store model-level knowledge:
- "This type of task (API integration) Exec model (Qwen) common error: forgets error handling"
- "This type of task (UI component) Exec model common error: doesn't handle loading state"
- "This type of task (data transformation) Exec model performance: 95% success rate, no escalation needed"

### 5. Parallel Specialist Review

gstack's Review Army runs multiple specialists in parallel reviewing the same diff.

**Application for gstack-plus:** After Exec completes, run parallel validations:
- Functional test validation (tests pass?)
- Scope validation (changes match task description?)
- Quality validation (code style, performance, security?)

---

## Designs in gstack That Can Be Improved

### 1. Single Model → Multi-Model Collaboration

gstack uses only Claude. In cost-sensitive and diverse-task scenarios, single model isn't optimal.

**Improvement:** gstack-plus introduces three-tier model dispatch:
- Tier-A (Opus/GPT-5): strategic planning, architecture judgment
- Tier-Mid (Sonnet/GPT-4o): complex review, integration judgment
- Tier-Exec (Qwen/DeepSeek): mechanical implementation

### 2. Manual Skill Selection → Automatic Task Classification

gstack requires users to know `/investigate` is for bugs, `/review` is for code review.

**Improvement:** gstack-plus's task classifier auto-identifies task type and routes to correct model, user only needs to describe what they want done.

### 3. No Cost Tracking

gstack has telemetry but no "how much did this session cost" view.

**Improvement:** gstack-plus outputs cost estimation at each stage (token usage × model unit price), displays cumulative cost in Dashboard.

### 4. Skill DRY Problem

26+ skills have lots of duplicated logic (platform detection, learnings search, runtime detection).

**Improvement:** gstack-plus extracts "sub-skill" mechanism, letting skills call other skills' core logic, reducing duplication.

---

## Designs Worth Borrowing from superpowers

### 1. Discipline Rule Pattern

superpowers' "non-negotiable rules" + "red flag table" + "rationalization prevention" trio.

**Application in gstack-plus:**
```
Iron Law: Exec says completion ≠ accepted, Claude must independently verify
Red Flags: "it didn't fail last time," "too many tests to run," "this change is small"
Rationalization Prevention: These thoughts are rationalization, stop, run verification
```

### 2. No Placeholders Rule

writing-plans says "plans can't have TBD/TODO." gstack-plus handoff instructions should also have no gray areas: "handle errors" isn't enough, must say "if NetworkError, retry 2 times, then return 500."

### 3. Evidence Before Assertion

verification-before-completion's Gate function: IDENTIFY → RUN → READ → VERIFY → then claim.

**Application in gstack-plus:** Claude's validation process before accepting Exec output:
1. IDENTIFY: What command/test proves Exec completed the task?
2. RUN: Claude runs it itself (not what Exec ran)
3. READ: Read full output
4. VERIFY: Does output confirm Exec's claim?
5. Only at this step can Exec's result be accepted

### 4. Implementer's Four States

subagent-driven-development's DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED.

**Application in gstack-plus:** Exec reports status after completing:
- DONE → Claude verifies → Accept
- DONE_WITH_CONCERNS → Claude reads concerns → Judges if affects correctness
- NEEDS_CONTEXT → Claude provides more context → Re-dispatch
- BLOCKED → Claude evaluates block → Classified handling (clarify/split/escalate)

### 5. 3-Strike Rule

systematic-debugging's 3 hypothesis failures → stop → question architecture.

**Application in gstack-plus:**
- Exec same task fails 3 times → escalate to Tier-Mid analysis
- Tier-Mid analysis still fails 3 times → escalate to Tier-A replanning
- Tier-A replanning still fails → stop, report to user

### 6. Ask Instead of Guess

executing-plans stops and asks when blocked, doesn't guess.

**Application in gstack-plus:** Exec encounters uncertainty, reports to Claude, doesn't guess. Claude encounters uncertainty, asks user, doesn't guess.

---

## What Is gstack-plus's Core Incremental Value?

**Relative to using only gstack or only superpowers, what does gstack-plus provide?**

**One-sentence answer:** gstack-plus provides "intelligent routing and failure recovery for multi-model collaboration," reducing AI workflow costs by 60% while maintaining gstack's workflow completeness and superpowers' discipline strength.

**Detailed explanation:**

| | Only gstack | Only superpowers | gstack-plus |
|--|-------------|-----------------|-------------|
| Workflow Completeness | ✅ 26+ skills cover full lifecycle | ❌ Only discipline rules, no complete flow | ✅ Inherits gstack's complete flow |
| Discipline Strength | ❌ Relies on role self-discipline | ✅ Non-negotiable rules | ✅ Discipline rules + automated guarantees |
| Model Dispatch | ❌ Only uses Claude | ❌ No model specification | ✅ Three-tier model intelligent routing |
| Cost Optimization | ❌ No cost tracking | ❌ No cost awareness | ✅ Cost visibility + intelligent routing savings |
| Failure Handling | ✅ Fix Loop (auto-fix) | ✅ 3-strike + escalation | ✅ Intelligent classification + tiered escalation |
| Task Routing | ❌ User manually selects skill | ❌ Forcibly invokes all possible skills | ✅ Auto-classification + intelligent routing |

**gstack-plus's unique value isn't "best at any one dimension" — it's "integration across three dimensions":**
1. gstack's workflow completeness (know what to do)
2. superpowers' discipline strength (ensure it's done)
3. Multi-model dispatch's cost advantage (use the right cost for the job)

---

## Questions to Resolve Before Phase 1

After reading all of this, what I'm still unsure about:

### 1. Classifier's 5-Dimension Scoring Thresholds

PROJECT_ROADMAP.md mentions 5 dimensions (judgment, context, risk, verifiability, creativity), but the scoring standards and routing thresholds for each dimension aren't defined.

**Need to determine:**
- Scoring range for each dimension (1-5? 1-10?)
- What thresholds route to which Tier?
- Is there a "veto" (some dimension exceeding → direct to Tier-A)?

### 2. Specific Escalation Path for Failure Recovery

After Exec fails, is it "retry same Exec," "switch to stronger Exec," "escalate to Tier-Mid analysis," or "escalate to Tier-A replanning"? What's the decision tree?

**Need to determine:**
- Failure classification framework (what failure type maps to what response)
- Escalation trigger conditions (3-strike? Or based on failure type?)
- Escalation termination conditions (when to admit "AI can't do this task" and report to user)

### 3. Standard Format for Handoff Instructions

writing-plans' No Placeholders rule is good, but the specific format for handoff instructions (what fields, what granularity) needs definition.

**Need to design:**
- Minimal handoff template (task description, allowed changes, verification criteria, context files)
- Task splitting granularity standards (when to split into multiple handoffs?)
- How to express dependencies between handoffs?

### 4. Balance Point Between Cost and Quality

Conservative routing (default high tier) = high cost, low risk. Aggressive routing (default low tier) = low cost, high risk. What should gstack-plus's default strategy be?

**Need to decide:**
- Default strategy (conservative vs aggressive vs adaptive)
- Can users customize strategy?
- Is there a "cost budget" mechanism (max $5 today)?

### 5. Real User Validation

YC_BLINDSPOTS.md's first blind spot is "have you talked to real users?" All this note analysis is document research, not user interviews.

**Need action:**
- Interview 5-10 gstack users: what's their biggest pain point using gstack?
- Ask them: "if there's multi-model dispatch, what do you care most about?" (cost? quality? speed?)
- Validate assumption: "60% cost savings" — is that real?

---

## Final Word

**gstack-plus isn't an upgrade of gstack, nor a replacement for superpowers — it's an integration of both, plus the new dimension of "model dispatch," forming something entirely new.**

gstack says: "Do the complete thing."
superpowers says: "Do it with discipline."
gstack-plus says: "Do the complete thing, with discipline, using the right model."
