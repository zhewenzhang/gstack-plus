# gstack Anatomy: Design Philosophy Comprehensive Analysis

> Day 7 | Comprehensive analysis of gstack-overview, gstack-planning-skills, gstack-review-skills, gstack-shipping-skills, ETHOS.md

---

## TL;DR: gstack Design Philosophy (5 Sentences)

> **gstack redefines AI-assisted development from "making AI write code" to "making AI make the right judgment at the right moment."**
>
> It achieves this through 26+ "role-based skills"—each skill is not a tool, but a specific expert perspective (CEO, Engineering Manager, QA Lead, Security Officer), activated at the right moment.
>
> All skills share three core principles: "Do the complete thing" (Boil the Lake, because AI makes completeness nearly free), "Search before building" (avoid reinventing the wheel), "AI recommends, user decides" (User Sovereignty, humans always retain final judgment).
>
> It optimizes for "decision quality and consistency," not "code productivity"—because in the AI era, writing code has become too cheap, but knowing what to write remains expensive.
>
> The cost is speed and flexibility—gstack's workflows are thorough every time, not suitable for scenarios requiring rapid prototyping. But gstack's belief is: in the AI era, the cost difference between "rapid prototype" and "complete implementation" has shrunk enough to justify doing the complete thing every time.

---

## Part I: Answering 7 Core Questions from LEARNING_PLAN.md

### Q1: Why Is gstack Designed This Way? (Not "How," but "Why")

**Answer**: gstack's design stems from a core belief—**in the AI era, the bottleneck has shifted from "code productivity" to "judgment quality."**

ETHOS.md's opening paragraph states the context: "One person with AI can now accomplish what previously required a 20-person team. Engineering barriers have disappeared. What remains is taste, judgment, and the willingness to see the whole thing through."

This explains the "why" behind all design decisions:

- **Why roles instead of tools?** Because when code productivity is no longer the bottleneck, the biggest risk is "doing the wrong thing quickly." Role-based design ("you are a paranoid Staff Engineer") forces AI to think from a specific perspective, not just "write code."
- **Why does every skill have a lengthy preamble?** Because the preamble is not "initialization code"—it's a mandatory step to "get AI into the right mindset." Telemetry, session tracking, and feature discovery all ensure AI knows "which session I'm working in, what context I have."
- **Why 26+ skills instead of 3 big skills?** Because each skill corresponds to a "judgment moment." When do you need the CEO perspective (is the direction right)? When do you need the Eng Manager perspective (is the architecture right)? When do you need the QA perspective (is the feature right)? These are different questions that cannot be answered by a single skill.

**gstack is not "helping AI write code"—it's "helping AI make the right judgment at the right time."**

---

### Q2: Why Does Superpowers Use "Mandatory Invoke"?

*(This is a superpowers question, answered in superpowers-anatomy.md)*

---

### Q3: What Fundamental Problem Does Brain Sync Solve?

From the gstack-overview notes, GBrain Sync is a cross-machine memory sync mechanism based on GitHub repos.

**The fundamental problem it solves**: AI's working memory is session-scoped (cleared after each conversation ends), but a project's "operational knowledge" is persistent ("this repo's tests use `bun test`, not `npm test`"). Without externalized storage, AI starts from zero every session, repeating the same "beginner mistakes."

**The deeper problem**: When the same developer works on different machines (MacBook at home, PC at the office), the project knowledge AI learns on one machine doesn't automatically transfer to the other. GBrain Sync uses GitHub as an intermediary to synchronize `learnings.jsonl` across machines.

**This reflects a broader design philosophy**: AI's knowledge should be externalized as "readable, persistent assets," not dependent on model training or prompts. The learnings system is gstack's "long-term memory."

---

### Q4: What Does "Boil the Lake" Really Mean?

**Literal meaning**: AI makes the marginal cost of "doing the complete thing" nearly zero. When full implementation only takes a few minutes more than shortcuts, do the complete thing.

**Real meaning**: This is an **economic reassessment of "completeness vs shortcuts."**

Before AI, complete implementation (100% test coverage, all edge case handling, full documentation updates) took 2 days, while shortcuts (90% coverage, main path handling, docs later) took 4 hours. Choosing shortcuts was economically rational—it saved 1.75 days.

AI makes complete implementation take 15 minutes, shortcuts take 8 minutes. The difference is 7 minutes. Choosing shortcuts is no longer economically rational—you save 7 minutes but incur permanent technical debt.

**ETHOS.md's compression ratio table explains why**:

| Task Type          | Human Team | AI-Assisted | Compression Ratio   |
| ------------- | ---- | ----- | ----- |
| Boilerplate   | 2 days  | 15 minutes | ~100x |
| Writing Tests          | 1 day  | 15 minutes | ~50x  |
| Bug Fix + Regression Test | 4 hours | 15 minutes | ~20x  |
| Architecture/Design         | 2 days  | 4 hours  | ~5x   |
| Research/Exploration         | 1 day  | 3 hours  | ~3x   |

**Key insight**: Compression ratios are not uniform. The more "mechanical" the work, the greater AI's acceleration (100x); the more "judgment-dependent" the work, the smaller the acceleration (3-5x). This means: **in the AI era, the relative value of "judgment" has risen, while the relative value of "productivity" has fallen**.

**The Lake vs Ocean distinction is also critical**:

- Lake (boilable): 100% test coverage for a module, complete implementation of a feature, all error paths
- Ocean (unboilable): Rewriting an entire system from scratch, cross-quarter platform migration

**The final layer of real meaning**: Boil the Lake is not "do everything"—it's "do the complete thing within the boilable scope." Identifying what is a Lake and what is an Ocean is itself a form of judgment.

---

### Q5: Why Are Skills in Markdown Instead of Code?

**Answer from three levels**:

**1. Markdown is the natural language of "workflows"**

Skills describe "steps → decisions → branches → outputs" workflows, not "input → computation → output" algorithms. Workflows are clearest expressed in natural language; expressing them in code becomes cumbersome.

For example, `/review`'s Scope Drift Detection:

- In Markdown: "If the diff contains features not in the plan → mark as SCOPE CREEP"
- In code: Requires parsing the plan file, parsing the diff, doing text matching, handling edge cases, handling the case where the plan file doesn't exist...

**2. Markdown is readable, auditable, and modifiable**

Any user can open SKILL.md and understand "what this skill is doing." If it were code, users would need to understand script logic. If it were compiled binary, users would have no idea what the skill does. This aligns with the User Sovereignty principle—users should be able to audit AI's behavior.

**3. Markdown is LLM's native format**

LLMs are far better at reading and writing Markdown than code. Defining skills in Markdown means:

- Users can directly modify skill behavior (change text, no code logic changes needed)
- Skills can be injected into AI's context via prompts
- Skill updates can be git diffs, understandable by both humans and AI

**Counter-example**: If skills were Python scripts, users would need to know Python to modify behavior; if YAML config, expressive power is insufficient for complex workflows; if prompt templates, they lack conditional logic and loop structures.

---

### Q6: What's the Difference Between gstack and Traditional Prompt Engineering?

**Traditional prompt engineering**:

```
"You are an experienced software engineer. Please review this code and find potential issues."
```

**gstack's `/review` skill**:

```
1. Detect platform and base branch
2. Confirm on feature branch (otherwise stop)
3. Scope Drift Detection (plan vs diff comparison)
4. Read checklist.md (not skippable)
5. Get diff
6. Critical Pass + confidence calibration
7. Review Army (parallel specialist dispatch)
8. Merge findings, PR Quality Score
9. Fix-First classification
```

**Core differences**:

| Dimension   | Prompt Engineering           | gstack                                   |
| ---- | ---------------------------- | ---------------------------------------- |
| Structure   | A paragraph of text                         | Structured workflow (steps + decisions + outputs)                    |
| Verifiability | "What did AI do?" Unclear                | Each step has specific bash commands and outputs                      |
| Consistency  | AI may do different things each time                | Same step order, same output format                          |
| Auditability | Hard to check if AI actually executed all parts of the prompt | Output of each step is auditable                              |
| Role Depth | "You are an engineer" → AI improvises             | "You are a paranoid Staff Engineer, using these 15 cognitive patterns" → specific framework |
| Failure Handling | No "what if step X fails"             | Each step has error handling and fallback                      |
| Knowledge Accumulation | Starts from zero each time                       | Learnings system shares knowledge across sessions                 |

**The biggest difference**: Prompt engineering is "telling AI what you want"; gstack is "defining how AI should work." The former is a one-time instruction, the latter is structured discipline.

---

### Q7: Which Design Decisions Are "Right"? Which Can Be Improved?

**Right decisions**:

1. **Role-based > tool-based**: Making AI become a "paranoid Staff Engineer" works far better than "review code." This is an essential feature of LLMs—they respond much better to "role instructions" than "functional instructions."

2. **Review Readiness Dashboard**: Visualizes which reviews have been run, which haven't, which are stale. This makes "process completeness" visible, not "I probably ran it."

3. **Fix-First Philosophy**: Obvious issues are auto-fixed, ambiguous ones ask the user. This reduces cognitive load—users don't need to judge each issue as "simple" or "needs my decision."

4. **Learnings System (JSONL)**: Externalized storage of project-level knowledge. Without this, AI starts from zero every session.

5. **Concrete implementation of User Sovereignty**: All gates "ask you" rather than "block you," and AskUserQuestion's fixed format ensures users get sufficient information.

**Areas for improvement**:

1. **DRY problem in skills**: 26+ skills have大量 duplication (preamble, platform detection, learnings search). Although there's a template system, workflow logic itself is also duplicated across skills (e.g., "detect runtime → choose framework → install" appears in both `/ship` and `/qa`). **Improvement**: Extract a "sub-skill" mechanism so skills can call each other's core logic.

2. **Model singularity**: All of gstack uses only Claude. Although `/codex` exists as a second opinion, the core workflow is a Claude solo act. **Improvement**: gstack-plus's multi-model collaboration is a response to this issue.

3. **No cost tracking**: Although there is telemetry, there's no view of "how much money this session cost." **Improvement**: Output cost estimates at the end of each skill (token usage × model unit price).

4. **Task routing is manual**: Users need to know `/investigate` is for bugs, `/review` is for code review. **Improvement**: gstack-plus's task classifier should automatically identify task types and route.

---

## Part II: What Kind of User Does gstack Assume?

From the design of all skills, gstack's "user profile" can be extracted:

**Core user**: **"AI-augmented independent developer" or "technical lead of a small team."**

Evidence:

- **Solo vs Collaborative modes**: `/ship`'s Test Failure Triage distinguishes solo and collaborative, with completely different recommendations. Solo developers are the primary scenario.
- **"One person doing the work of a 20-person team"**: ETHOS.md's core narrative.
- **Doesn't need programming infrastructure knowledge**: `/ship` automatically bootstraps test frameworks, CI/CD, documentation. Users don't need to know "how to build jest.config.js"—AI knows.
- **But needs product judgment**: `/office-hours` requires users to answer 6 probing questions, assuming users have product insight.
- **Knows git but may not be a git expert**: Skills automatically handle merge, rebase, cherry-pick, but users need to understand "why it's done this way."

**User's primary risks**:

1. **Too fast, wrong direction**: AI makes code productivity huge, but the cost of wrong direction is also huge. → CEO review, office-hours
2. **Insufficient completeness**: AI-generated code looks right, but lacks tests, docs, edge cases. → Boil the Lake, QA process
3. **Over-trusting AI's output**: Users may think AI-generated code is correct. → Anti-sycophancy, Review Army, Fix-First
4. **Knowledge doesn't accumulate**: Every session starts from zero. → Learnings system

---

## Part III: What Does gstack Optimize? What Does It Sacrifice?

**Optimizes**:

1. **Decision quality > code productivity**: 26+ review checkpoints vs 3 core execution skills
2. **Completeness > speed**: Boil the Lake, 100% test coverage targets
3. **Consistency > flexibility**: Fixed step order, fixed output format
4. **Auditability > automation**: AskUserQuestion at critical nodes, not fully automatic

**Sacrifices**:

1. **Speed**: 26+ skills take time to learn and execute. Running `/autoplan` through CEO → Design → Eng → DX may take 30+ minutes.
2. **Flexibility**: Fixed step order isn't suitable for all scenarios. Sometimes you just need to "quickly look at code," not a full Review Army.
3. **Cognitive load**: Users need to understand the existence, purpose, and invocation timing of 26+ skills. Steep learning curve.
4. **Cost**: 26+ skills + Review Army + Learnings search =大量 token consumption.

**Core trade-off**: gstack chose "thorough every time" rather than "sometimes fast, sometimes thorough." This is reasonable—because AI has drastically reduced the cost of "thorough"—but it means not suitable for all scenarios.

---

## Part V: gstack's Overall Architecture View

```
                    ┌─────────────────────────────────────────┐
                    │           ETHOS (Three Core Principles)            │
                    │  Boil the Lake | Search First | Sovereignty │
                    └────────────────────┬────────────────────┘
                                         │ Injected into all skills
                    ┌────────────────────┴────────────────────┐
                    │          Preamble (Shared Infrastructure)           │
                    │  Update check | Session tracking | ELI16   │
                    └────────────────────┬────────────────────┘
                                         │
     ┌─────────────────┬─────────────────┼─────────────────┬─────────────────┐
     ▼                 ▼                 ▼                 ▼                 ▼
┌─────────┐    ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────┐
│ Planning │    │   Design     │  │   Execution   │  │  Review     │  │ Release  │
│ Skills   │    │   Skills     │  │   Skills      │  │  Skills     │  │ Skills   │
│ office-  │    │ design-      │  │ investigate   │  │ review      │  │ ship     │
│ hours    │    │ shotgun      │  │ freeze        │  │ review-army │  │ land-    │
│ plan-*   │    │ design-html  │  │               │  │ adversarial │  │ deploy   │
│ autoplan │    │ consultation │  │               │  │ codex       │  │ canary   │
└────┬─────┘    └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  └────┬─────┘
     │                 │                 │                 │              │
     │            ┌────┴────┐            │            ┌────┴────┐         │
     │            │ Browser │            │            │  QA     │         │
     │            │ daemon  │◄───────────┘            │ /qa     │         │
     │            └─────────┘                         └─────────┘         │
     │                                                                    │
     └────────────────────┬───────────────────────────────────────────────┘
                          │
               ┌──────────┴──────────┐
               │   Learnings System     │
               │  learnings.jsonl    │
               │  GBrain Sync        │
               └──────────┬──────────┘
                          │
               ┌──────────┴──────────┐
               │   Safety Layer         │
               │  careful / guard    │
               │  PreToolUse hooks   │
               └─────────────────────┘
```

---

## Part VI: gstack-plus's Design Space from the Anatomy Perspective

Based on the answers to the 7 questions above, gstack-plus's core incremental value can be positioned as:

**gstack solved "how humans + AI can make correct decisions," but assumed "after the decision, only one model executes."**

**gstack-plus needs to solve "after the decision, how to use multiple models collaboratively to execute, reducing cost while maintaining quality."**

Specifically:

1. **gstack's role-based design** → gstack-plus can inherit: each Tier should be a clear role
2. **gstack's Boil the Lake** → gstack-plus can inherit: Exec models should also do the complete thing
3. **gstack's User Sovereignty** → gstack-plus needs to extend: users not only decide "direction," but can also see "which model is doing what"
4. **gstack's Learnings system** → gstack-plus needs to extend: cross-model learning ("what errors Exec models tend to make on this type of task")
5. **gstack's single model** → gstack-plus's core innovation: model division of labor

**What gstack-plus should NOT change**:

- The role-based design philosophy (but role definitions need adjustment for multi-model)
- Structured workflows (steps + decisions + outputs)
- Fix-First philosophy
- User Sovereignty

**What gstack-plus needs to add**:

- Task classifier (auto-identify task type → route to correct model)
- Failure fallback mechanism (Exec failure → smart escalation, not restart from zero)
- Cost tracking (token consumption and cost per model)
- Cross-model Learnings ("common error patterns for Exec models on this type of task")

---

## Things I Haven't Fully Understood

- **GBrain Sync's specific implementation**: How does it handle conflicts? If two machines write to learnings simultaneously, which takes priority?
- **Preamble-tier's specific impact**: What's the difference between tier 1/2/3/4? Is it preamble length or content difference?
- **How Review Army's Specialists are defined**: Does each specialist have its own SKILL.md, or are they distinguished via prompt parameters?
- **`/codex`'s specific process as second opinion**: How does it ensure Codex's review and Claude's review are independent (avoiding bias contamination)?

---

*Completed 2026-05-02*
