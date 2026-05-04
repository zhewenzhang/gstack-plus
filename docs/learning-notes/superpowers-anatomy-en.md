# Superpowers Anatomy: Design Philosophy Comprehensive Analysis

> Day 11 | Comprehensive analysis of superpowers-planning, superpowers-quality, superpowers-parallel

---

## Part I: Answering Core Questions

### Q1: Where Does Superpowers' "Mandatory Invoke" Spirit Come From? (What Problem Is It Solving?)

**The problem it solves**: **AI tends to replace discipline with its own judgment because it "feels" the current situation doesn't need discipline.**

The red flag table from using-superpowers shows the pattern:
- "This is just a simple question" → skip brainstorming
- "I can take a look at the code first" → skip planning
- "This doesn't need a formal skill" → skip TDD
- "Let me just do this one small thing first" → skip verification

Every red flag is AI **rationalizing the behavior of skipping discipline**. AI is not malicious—it genuinely believes "this time it's not needed." But "this time" accumulates into systematic discipline collapse.

**The spirit of "mandatory invoke" comes from a painful observation**: AI's ability to "judge when discipline is needed" is far worse than its ability to "execute discipline." When AI is allowed to decide "do I need brainstorming this time?" on its own, it almost always says "no"—because skipping discipline feels like saving time.

But the actual cost is: skip brainstorming → implement the wrong thing → 2 hours rework. Skip TDD → no test protection → regression bug → 1 hour debugging. Skip verification → claim done but didn't run → push bad code → production incident.

**The true meaning of the 1% rule**: Not "1% chance the skill is useful," but "1% chance you're rationalizing skipping discipline." Because AI's frequency of saying "this doesn't need it" to itself is far higher than the frequency it actually doesn't need it.

**superpowers is solving the "discipline execution deviation" problem**—not "not knowing what the discipline is" (AI knows), but "feeling this time can be an exception."

**Typical failure scenario (explaining why enforcement is needed)**:

AI receives the task "change timeout in config.yaml from 30 to 60."
It judges: "This is just changing a number, no brainstorming needed." — Skips skill invoke.

What actually happens: The timeout value is read by 3 UI components, controlling loading spinner display duration.
AI changes config, doesn't discover the UI dependency, declares done. The issue is found by QA on staging:
loading spinner doesn't disappear until 60 seconds, damaging user experience. Debugging took 2 hours.

If brainstorming was mandatory: Visual Companion's first question is "which systems does this change affect?"
AI is forced to list dependencies, discovers UI components within 10 minutes, modifies them together, the issue is resolved at the development stage.

**The fundamental problem this scenario illustrates**:
AI evaluates "whether a skill is needed" based on the task's **surface complexity**, not its **actual impact scope**.
"Changing a number" looks simple, but the impact can be deep. The meaning of mandatory invoke is:
Use structured questions to force AI to explore the impact scope, rather than relying on AI's subjective judgment.

---

### Q2: Why Use Markdown Skills Instead of Code or Prompt Templates?

From the design of all superpowers skills, the answer can be extracted:

**1. Markdown Is the Natural Expression of "Discipline Rules"**

superpowers' skills are not "tools"—they are "behavioral constraints." They don't say "doing X gets you Y," they say "must do X before doing Z." This "must do first" constraint relationship expressed in code becomes cumbersome "check → if not → error" logic; expressed in prompt templates becomes soft recommendations of "please ensure you did X."

Markdown sits between: it's not execution checking (too cumbersome), nor soft recommendations (too easily ignored). It's "clear, readable, LLM-understandable discipline description."

**2. Markdown Supports "Spirit Over Literal" Principle**

superpowers emphasizes multiple times that "the spirit of discipline is more important than literal compliance." Markdown's readability lets users understand "what failure this skill is trying to prevent," not just "what steps this skill requires." Understanding "why," users can judge "in special cases, whether literal adjustments still align with the spirit."

**3. Markdown's "Skills Can Evolve" Property**

using-superpowers says: "I may have learned a better way today... skills get stronger over time. That's why you should always invoke skills—even if you think you know how they work."

If code, evolution means changing code logic (requires programming ability). If prompt templates, evolution means changing prompts (but prompt's structured expressive power is limited). Markdown evolution is changing text—any user can do it, and diffs are clearly visible.

**Counter-example (if "mandatory invoke" were implemented as Python hooks)**:

```python
# Hypothetical Python mandatory invoke implementation
def before_task(task_description):
    if not has_invoked_brainstorming():
        raise ComplianceError("Must invoke brainstorming first")
```

Problems with this approach:
1. **Platform binding**: Claude Code's hooks are Bash, Copilot CLI format differs, Gemini CLI differs again.
   The same discipline rules need different code maintained for each platform.
2. **Version fragility**: When Claude API updates tool calling format, `has_invoked_brainstorming()`'s
   detection logic becomes directly invalid, requiring a release to fix.
3. **Spirit lost**: Code makes binary judgments (present/absent), cannot handle the difference between
   "this task's brainstorming can be brief" vs "this task needs full process." Markdown lets AI interpret
   the "spirit" based on context.
4. **Update friction**: Changing discipline rules requires releasing + users updating. Markdown changes take
   effect immediately, no installation or update steps needed.

Markdown's "imprecision" is deliberate design: discipline needs contextual judgment, not suitable for code's precision to implement.

---

### Q3: superpowers' Skills Are Much Shorter Than gstack's—Is This a Design Choice or Maturity Difference?

**This is a design choice, not a maturity difference.**

**Evidence**:

| Dimension | gstack | superpowers |
|------|--------|-------------|
| Longest skill | `/autoplan` (preamble tier 4, 2000+ lines) | `brainstorming` (~200 lines) |
| Typical skill | `/review` (preamble tier 4, includes Review Army definition) | `verification-before-completion` (~100 lines) |
| Shared infrastructure | Long preamble (bash code, session tracking) | No preamble, starts from line one |
| Structure | Steps + decisions + ASCII diagrams + templates + report format | Core principles + rules + red flag tables |

**Why superpowers is shorter**:

1. **Discipline vs process**: superpowers defines discipline rules ("cannot claim done without verification"), gstack defines workflows ("Step 1: detect platform → Step 2: confirm branch → Step 3: merge..."). Discipline is concise ("must not do X" said in one sentence), process is verbose ("do A first then B if C then D...").

2. **No role dependency**: gstack's verbosity partly comes from role definitions ("you are a paranoid Staff Engineer, you have these cognitive patterns, you follow this process..."). superpowers doesn't define roles—it defines rules. Rules are more concise than roles.

3. **No embedded platform code**: gstack's preamble contains大量 bash code (session tracking, learnings search, telemetry), which is gstack's "runtime infrastructure." superpowers doesn't have this layer—its skills are purely behavioral descriptions.

4. **References instead of embedding**: superpowers often references auxiliary files (`root-cause-tracing.md`, `visual-companion.md`) instead of embedding content into skill files. gstack tends to embed everything into SKILL.md (including all specialist definitions).

**Conclusion**: superpowers is shorter because it chose "discipline rules" over "workflow" expression. This is not lower maturity—it's a design trade-off. But the trade-off's cost is: discipline rules require AI's self-discipline to execute (no automated process guarantee), while workflows auto-execute through step ordering.

---

### Q4: What AI Failure Modes Does superpowers Assume?

From all skills, superpowers' assumed AI failure modes can be extracted:

**Failure Mode 1: Claiming done without verification**
- `verification-before-completion`'s 24 failure memories
- AI changes code and feels "done," without actually running to see results
- **Root cause**: LLM's training makes it tend to "predict next step based on pattern matching" rather than "execute and observe results"

**Failure Mode 2: Fixing without finding root cause**
- `systematic-debugging`'s red flag table
- AI tries "let me try this fix first" rather than understanding why it's broken first
- **Root cause**: AI's "quick fix" tendency—it feels "this looks like the problem, fix it and see"

**Failure Mode 3: Writing code first then adding tests**
- `test-driven-development`'s 5 common excuses
- AI feels "I've figured it out, writing code directly is faster"
- **Root cause**: AI's "productivity optimization" tendency—it wants to maximize code output, minimize time spent on "non-code output" activities (writing tests)

**Failure Mode 4: Skipping discipline because "this time isn't needed"**
- `using-superpowers`'s red flag table
- AI replaces discipline with its own judgment
- **Root cause**: AI's "self-trust" tendency—it trusts its own judgment, but this judgment has systematic bias (偏向 skipping discipline)

**Failure Mode 5: Rationalization**
- "Rationalization prevention tables" in all skills
- AI doesn't just make mistakes—it "explains why this is reasonable" after making mistakes
- **Root cause**: LLM's "alignment training" makes it tend to give "sounds reasonable" explanations, even when the explanation is wrong

**Core insight**: superpowers assumes AI failure modes are not "insufficient capability" (AI is capable of doing it right), but "insufficient discipline" (AI doesn't choose to do right). Its problem is not "can AI write tests," but "does AI choose to write tests first."

---

### Q5: superpowers and gstack's Role Division: Which Is Better as a "Discipline Framework," Which as a "Workflow Framework"?

**superpowers = Discipline Framework**

superpowers' core is discipline rules:
- 1% rule (must invoke even if 1% likely)
- NO COMPLETION CLAIMS (cannot claim done without verification)
- NO FIXES WITHOUT ROOT CAUSE (cannot fix without root cause)
- NO PRODUCTION CODE WITHOUT FAILING TEST (cannot write code without failing test)

These are "must not do" rules, not "should do" processes. They don't tell you "do Step 1 first then Step 2"—they say "must do Y before doing X, no exceptions."

superpowers is suited for: ensuring AI behavior quality, preventing AI's discipline collapse.

**gstack = Workflow Framework**

gstack's core is workflow:
- 26+ skills, each with fixed step sequences
- Review Army's parallel specialist dispatch
- Coverage Audit's subagent execution
- Ship's 19-step quality pipeline

These are "do A first then B if C then D" processes. They guarantee completeness—ensuring every necessary step is executed.

gstack is suited for: ensuring workflow completenessteness, preventing missing necessary steps.

**gstack-plus's positioning**: gstack-plus should take the best of both:
- From superpowers take "discipline rules" (must independently verify after Exec model completes)
- From gstack take "workflow" (planning → review → execution step sequence)

---

## Part II: 5-Sentence Challenge: superpowers' Design Philosophy

> **superpowers redefines AI-assisted development from "letting AI freely improvise" to "making AI work under enforced discipline."**
>
> It achieves this through a set of non-negotiable discipline rules—even if there's only a 1% chance a skill applies, it must be invoked; cannot claim done without running verification; cannot fix without finding root cause; cannot write code without a failing test.
>
> It assumes AI failure modes are not "insufficient capability" but "insufficient discipline"—AI has the ability to do the right thing, but tends to replace discipline with its own judgment because it "feels" the current situation can be an exception.
>
> It optimizes for "behavioral reliability and consistency," not "workflow completenessness"—because the "super" in superpowers isn't about "doing more things," but about "doing the right things correctly."
>
> The cost is flexibility—superpowers has almost no room for "adjusting based on circumstances." But this is precisely its design intent: the value of discipline is exactly manifested at the moments you most want to skip it.

---

## Part III: Superpowers' Overall Architecture View

```
                    ┌─────────────────────────────────────────┐
                    │    using-superpowers (Meta Rules)          │
                    │  1% Rule | Skill Priority | Red Flag Table │
                    └────────────────────┬────────────────────┘
                                         │ Mandatory invoke all skills
                    ┌────────────────────┴────────────────────┐
                    │     Workflow Skills (Sequential Mandatory) │
                    │  brainstorming → writing-plans → executing │
                    └────────────────────┬────────────────────┘
                                         │
     ┌─────────────────┬─────────────────┼─────────────────┐
     ▼                 ▼                 ▼                 ▼
┌─────────────┐ ┌─────────────┐ ┌──────────────┐ ┌──────────────┐
│ Discipline   │ │ Quality     │ │ Parallel      │ │ Infrastructure│
│ Rules        │ │ Discipline  │ │ Patterns       │ │              │
│ verification │ │ TDD         │ │ subagent-     │ │ worktrees    │
│ before       │ │ systematic  │ │ driven        │ │ finishing    │
│ completion   │ │ debugging   │ │ parallel      │ │ branch       │
└──────┬──────┘ └──────┬──────┘ └──────┬───────┘ └──────┬───────┘
       │               │               │               │
       │          ┌────┴────┐          │               │
       │          │ Red Flag│          │               │
       │          │ Table   │          │               │
       │          │ Rational│          │               │
       │          │ ization │          │               │
       │          │ Prevent │          │               │
       │          └─────────┘          │               │
       │                               │               │
       └───────────────┬───────────────┘               │
                       │                               │
               ┌───────┴────────┐                      │
               │ Failure Memory │                      │
               │ Learning       │                      │
               │ 24 Failure     │                      │
               │ Patterns       │                      │
               └────────────────┘                      │
                                                       │
                        ┌──────────────────────────────┘
                        │
               ┌────────┴────────┐
               │ Auxiliary Tech  │
               │ Documents       │
               │ root-cause-     │
               │ tracing.md      │
               │ visual-companion│
               │ testing-anti-   │
               │ patterns.md     │
               └─────────────────┘
```

---

## Part IV: gstack-plus's Design Space from the Anatomy Perspective

Based on the analysis above, superpowers' core inspiration for gstack-plus:

### superpowers' "Discipline Rules" Model Is Worth Borrowing

superpowers' most powerful design is "discipline rules"—not processes, not suggestions, non-negotiable rules. gstack-plus should define similar disciplines for Exec model collaboration:

- **NO EXEC CLAIMS WITHOUT INDEPENDENT VERIFICATION** (Exec saying done doesn't count, Claude must independently verify)
- **NO TASK EXECUTION WITHOUT CLEAR SPEC** (Cannot dispatch to Exec if task description is unclear)
- **NO SILENT FAILURES** (Exec failure must be reported, cannot silently skip)
- **NO SCOPE CREEP** (Exec's modifications cannot exceed what the task description allows)

### superpowers' "Rationalization Prevention" Model Is Worth Borrowing

superpowers' red flag table lists AI's "rationalizing thoughts" when trying to skip discipline. gstack-plus should have a similar table—specific rationalizations for multi-model collaboration:

| Claude's Thought | Reality |
|---------|------|
| "This Exec model performed well last time, trust it this time too" | Independent verification every time |
| "The task is simple, Exec won't mess up" | Simple tasks also have edge cases |
| "Exec already ran tests, no need to run again" | Evidence before assertions |
| "This change is small, doesn't need Tier-A review" | Small changes can have large ripple effects |
| "Cost is too high, let's skip verification this time" | The cost of skipping verification is higher |

### superpowers' "Discipline vs Process" Trade-off Needs Balance

superpowers' pure discipline model relies on AI's self-discipline—it says "must do X," but has no automated guarantee that you did X. gstack-plus should combine both:
- **Discipline rules** define "what must not be done" (No Completion Claims Without Verification)
- **Workflows** define "how to do it" (Claude runs tests → checks diff → checks scope → accepts/rejects)

This way, it has both discipline's conciseness and process's automated guarantee.

---

## Things I Haven't Fully Understood

- Is there a dependency graph between superpowers' skills? (Which skills must be invoked before others can be invoked?)
- What is the specific content of the `finishing-a-development-branch` skill? (subagent-driven-development and executing-plans both call it at the end)
- How is superpowers' "failure memory" system implemented? (`verification-before-completion` mentions 24 failure memories—is this cross-session persistent?)
- Does superpowers have a "cost tracking" mechanism? (subagent-driven-development calls 3 subagents per task, the cost is not low)

---

*Completed 2026-05-02*
