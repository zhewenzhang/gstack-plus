# gstack Panorama Learning Notes

**Study Date**: 2026-05-02
**Study Method**: Read through all SKILL.md + ETHOS.md + docs/skills.md
**Output Goal**: Understand the full picture of gstack, find inspiration points for gstack-plus design

---

## Literal Layer: What Does It Do?

gstack is an **AI workflow skill library** that adds a set of opinionated workflows to Claude Code.

It has two core components:

1. **Skills**: 26+ Markdown files, each defining a work mode (CEO review, debugging, QA testing...)
2. **Browse daemon**: A persistent Chromium instance, ~100-200ms response, state preserved across commands

Each skill = a specific "expert role." When you invoke `/investigate`, Claude becomes a "debugger"; when you invoke `/plan-ceo-review`, Claude becomes a "founder."

The complete lifecycle is:

```
office-hours → plan-ceo-review → plan-eng-review → review → ship → land-and-deploy → canary
                     ↘ plan-design-review ↗                  ↑
                     ↘ plan-devex-review ↗                   |
                                                        qa / design-review
```

---

## All Skills Classification Directory

### 🔭 Exploration & Strategy ("What to Think")

| Skill                 | Role      | Core Question                    |
| ------------------ | ------- | ----------------------- |
| `/office-hours`    | YC Partner  | Is this worth building? What's the smallest切入点?         |
| `/plan-ceo-review` | CEO/Founder | What's the "10-star product" behind this request? |
| `/autoplan`        | Review Pipeline   | Automatically run CEO + Design + Engineering three reviews      |

**Design Details:**

- `/office-hours` has two modes: Startup (6 probing questions) and Builder (hackathon/open source)
- `/plan-ceo-review` has four modes: Scope Expansion / Selective / Hold / Reduction
- `/autoplan` makes decisions automatically using 6 decision principles, leaving only "taste decisions" to humans

---

### 📐 Planning & Review ("How to Do It")

| Skill                     | Role         | Core Question                  |
| ---------------------- | ---------- | --------------------- |
| `/plan-eng-review`     | Engineering Manager | Is the architecture right? Are boundaries clear? Are there diagrams?       |
| `/plan-design-review`  | Senior Designer      | Does the design have interaction states? Empty states? Mobile?     |
| `/plan-devex-review`   | DevEx Engineer  | Is the API / CLI / SDK experience good? |
| `/design-consultation` | Design Partner      | Build a design system from scratch, write DESIGN.md  |

**Design Details:**

- `/plan-eng-review` is the only **mandatory** gate (others are optional)
- `/plan-eng-review` writes the Test Plan to `~/.gstack/projects/`, so `/qa` can automatically pick it up later
- Review Readiness Dashboard runs through all reviews, visualizing which have passed

---

### 🎨 Design & Implementation ("Build It")

| Skill                | Role    | Core Question                     |
| ----------------- | ----- | ------------------------ |
| `/design-shotgun` | Design Explorer | Generate 3 design options, compare on a board         |
| `/design-html`    | Design Engineer | Convert design into working Pretext HTML |
| `/investigate`    | Debugger   | Iron law: Don't modify code without finding the root cause first          |
| `/codex`          | Second Opinion  | Let OpenAI Codex review independently, find blind spots  |

**Design Details:**

- `/design-shotgun` → `/design-html` is a design pipeline, can be chained
- `/investigate` automatically activates `/freeze` internally (restricts edit scope), preventing "fix A, break B"
- `/codex` has 3 modes: review (PASS/FAIL), challenge (adversarial test), consult (advisory)

---

### 🔍 Review & Security ("Is It OK?")

| Skill        | Role       | Core Question                             |
| --------- | -------- | -------------------------------- |
| `/review` | Paranormal Staff Engineer | Can things still break after CI passes? Find N+1, race conditions |
| `/cso`    | Chief Security Officer    | OWASP Top 10 + STRIDE threat modeling       |

**Design Details:**

- `/review` uses "Fix-First" style: obvious issues are auto-fixed, ambiguous ones ask the user
- When `/review` + `/codex` are used together, cross-model comparison is done (overlap = high confidence)
- `/cso` has two modes: daily (high threshold, low noise) and comprehensive (monthly deep scan)

---

### 🧪 QA & Testing ("Does It Really Work?")

| Skill               | Role        | Core Question                         |
| ---------------- | --------- | ---------------------------- |
| `/qa`            | QA Lead   | Test + fix bugs, atomic commits, auto-generate regression tests     |
| `/qa-only`       | QA Reporter    | Report only, no modifications                      |
| `/design-review` | Designer Who Can Code   | 80-item visual review + fix cycle              |
| `/devex-review`  | DevEx Auditor | Developer experience testing (time-to-hello-world) |
| `/benchmark`     | Performance Engineer     | Core Web Vitals, load time baseline and regression detection  |

**Design Details:**

- `/qa` is diff-aware: by default, only tests pages affected by your changes
- `/qa` has 4 modes: Diff-aware / Full / Quick / Regression
- `/design-review` is iterative: 80-item review → find issues → fix → screenshot comparison → continue

---

### 🚀 Shipping & Deployment ("Go Live!")

| Skill                  | Role    | Core Question                      |
| ------------------- | ----- | ------------------------- |
| `/ship`             | Release Engineer | Sync main, run tests, review, create PR      |
| `/land-and-deploy`  | Deployment Engineer | Merge + CI wait + deploy + verify   |
| `/canary`           | SRE   | Post-deployment monitoring loop, catch console errors |
| `/document-release` | Technical Writing  | Update docs to match just-released changes              |
| `/setup-deploy`     | Deployment Config  | One-time platform setup, write to CLAUDE.md      |

**Design Details:**

- `/ship`'s Review Gate: if `/plan-eng-review` hasn't been run, it asks but doesn't block you
- `/ship` has Greptile integration: automatically categorizes Greptile PR comments (valid/fixed/false positive)
- `/ship` automatically creates a test framework if none exists (Bootstrap mode)

---

### 🌐 Browser & Tools ("See the Pages")

| Skill                       | Role     | Core Question                    |
| ------------------------ | ------ | ----------------------- |
| `/browse`                | QA Engineer | Persistent Chromium, ~100ms/command   |
| `/open-gstack-browser`   | Coexistence Mode   | Show browser + sidebar proxy, visible in real time |
| `/setup-browser-cookies` | Session Management   | Import cookies from real browser, test logged-in pages |
| `/pair-agent`            | Remote Agent   | Let a remote AI agent use your browser    |

---

### 🧠 Memory & Reflection ("What Did We Learn?")

| Skill                 | Role         | Core Question                               |
| ------------------ | ---------- | ---------------------------------- |
| `/context-save`    | State Saver       | Save git state + decisions + remaining work, bridge across sessions |
| `/context-restore` | State Restorer       | Restore from `/context-save`, continue where you left off          |
| `/learn`           | Memory Management       | View/search/clean project learning records (JSONL)              |
| `/retro`           | Engineering Manager | Weekly retro: per-person contributions + trends + growth opportunities      |

---

### 🛡️ Safety Guards ("Don't Mess Up")

| Skill              | Combination                 | Function          |
| --------------- | ------------------ | ----------- |
| `/careful`      | Standalone                 | Warning before destructive commands    |
| `/freeze <dir>` | Standalone                 | Restrict edit scope to specified directory |
| `/guard`        | = careful + freeze | Maximum safety mode      |
| `/unfreeze`     | Paired                 |解除 freeze   |

**Implementation Mechanism**: Implemented through Claude Code's PreToolUse hooks, session-scoped, no configuration file needed.

---

### 🔧 Infrastructure

| Skill                | Function                   |
| ----------------- | -------------------- |
| `/gstack-upgrade` | Self-update                 |
| `/health`         | Code quality dashboard              |
| `/plan-tune`      | Adjust question sensitivity              |
| `/make-pdf`       | Generate PDF documentation            |
| `/codex`          | OpenAI Codex CLI wrapper |

---

## Design Layer: Why Is It Built This Way?

### Design Decision 1: Role Division, Not Functional Division

Each skill is not "a tool that does something," but "a person playing a specific role."

- **Why**: The best mode of human-AI collaboration is not "AI uses tools," but "AI becomes an expert." When Claude is told "you are now a paranoid Staff Engineer," its output quality is far higher than "please review this code."
- **Counter-example**: Without this, every invocation requires a long prompt explaining the desired perspective.
- **Cost**: 26+ skill files need maintenance; updating one logic may require syncing across multiple files.

### Design Decision 2: Preamble = Shared Infrastructure

All skills share the same preamble code block (update check, session tracking, telemetry, remote sensing sync...) generated through the template system `SKILL.md.tmpl`.

- **Why**: DRY principle + consistency. Every skill needs to know "how many sessions are current" (ELI16 mode), "whether telemetry is on," etc.
- **Counter-example**: Manual maintenance would cause skill preambles to drift out of sync.
- **Cost**: Adds a build step; SKILL.md is generated, cannot be edited directly.

### Design Decision 3: Browse Daemon = Persistent State, Not Fresh Start Each Time

The browser is not created fresh each command, but is a persistent daemon communicating via local HTTP.

- **Why**: Login state, cookies, localStorage persist across commands. 20 commands don't need to wait for 20 browser launches (3s each = 60s vs persistent mode ~2s).
- **Counter-example**: In per-command mode, QA testing can't maintain login state mid-session.
- **Cost**: Higher complexity; need to manage daemon lifecycle, port conflicts, version restarts.

### Design Decision 4: Review Gate, Not Forced Blocking

`/plan-eng-review` is "mandatory," but `/ship` asks you, doesn't outright refuse.

- **Why**: User Sovereignty principle. AI's job is to inform humans of risks, not make decisions for them. Forced blocking causes users to work around it; transparency is better.
- **Counter-example**: A forced gate becomes an obstacle when the user is confident it's safe.
- **Cost**: Someone might ignore warnings and cause problems, but that's the user's choice.

### Design Decision 5: Operational Self-Improvement (Runtime Self-Improvement)

At the end of each skill, if a "project-specific quirk that could save 5+ minutes next time" is discovered, it's recorded to JSONL.

- **Why**: AI memory is session-scoped; project-level knowledge ("this repo's tests use `bun test`, not `npm test`") must be externalized or rediscovered every session.
- **Counter-example**: Every session starts from zero, repeating the same "beginner mistakes."
- **Cost**: Need to decide what's worth recording (signal-to-noise problem).

---

## Philosophy Layer: What Beliefs Does It Reflect?

### Core Belief 1: Boil the Lake

> AI makes the marginal cost of "doing the complete thing" nearly zero. When full implementation only takes a few minutes more than shortcuts, do the complete thing.

This belief permeates every skill design:

- `/ship` automatically bootstraps test frameworks ("no test framework? build one in minutes")
- `/review` flags "80% solutions" and points out "the complete solution is just a lake, not an ocean"
- ETHOS.md has a complete human vs AI time compression ratio table (boilerplate: 100x, architecture: 5x)

**Implication for gstack-plus**: One of the core logics of task tiering—judging whether a task is a "lake" or an "ocean" affects whether it's worth doing fully with a high-end model or quickly with an execution model.

### Core Belief 2: User Sovereignty

> AI recommends, user decides. Even when both models agree, it's a strong signal, not authorization.

- All review gates "ask you" rather than "block you"
- AskUserQuestion has a fixed format (D<N>, ELI10, Stakes, Recommendation, Pros/Cons)
- "AI generates suggestions, user verifies, AI doesn't skip the verification step"

**Implication for gstack-plus**: In model routing decisions, User Sovereignty means "automatic routing" needs a clear override mechanism—users should know "this task was routed to Qwen because of X reason."

### Core Belief 3: Search Before Building

> Three-layer knowledge system: Layer 1 (mature approaches), Layer 2 (popular new approaches), Layer 3 (first principles). The Eureka moment comes from: understanding Layer 1+2, then using Layer 3 to derive "everyone is wrong."

**Implication for gstack-plus**: In gstack-plus's competitive analysis, actually run AutoGen/CrewAI/LangGraph, don't just read docs. Only by running them can you get Layer 3 insights.

---

## Dependency and Collaboration Diagram

```
[Office Hours]          [Decision Gate]        [Execution Gate]       [Verification Gate]      [Release Gate]
─────────────────────────────────────────────────────────────────────────────────────────────────

/office-hours ──→ /plan-ceo-review ──→
                  /plan-eng-review ──→ implement ──→ /review ──→ /ship ──→ /land-and-deploy
                  /plan-design-review ─────────────→ /design-review ↗
                  /plan-devex-review ─────────────→ /devex-review ↗        ↓
                                                    /qa ↗                /canary

[Automation]  /autoplan = /plan-ceo-review + /plan-design-review + /plan-eng-review

[Browser Infrastructure] /browse ← Used by: /qa, /design-review, /benchmark, /canary, /land-and-deploy

[Debug Flow]  bug report → /investigate (activates /freeze) → fix → /review → /ship

[Design Flow]  /design-consultation → /design-shotgun → /design-html

[Memory Flow]  End of each skill → write learnings.jsonl ← /learn manages
          Session interruption → /context-save ← /context-restore

[Second Opinion] /review + /codex = cross-model cross-comparison (overlap = high confidence)

[Safety Layer]  /careful or /freeze or /guard = underlying PreToolUse hooks (session-scoped)
```

---

## Inspiration for gstack-plus

### What Can Be Borrowed

1. **Role-based personality design**: gstack-plus's three-tier model (Tier-A/Mid/Exec) should also have clear "role" definitions, not just "which model to use"—but "what decisions this role is making."

2. **Preamble shared infrastructure**: Task classification, routing decisions, and logging code should be shared across all skills, injected via templates.

3. **Review Readiness Dashboard**: Could build a "Tier Dispatch Dashboard"—"this task was routed to Tier-X because of Y, took Z time, result W."

4. **Operational Self-Improvement**: After the execution model completes a task, if it discovers "common pitfalls for this type of task," it should record them for next time.

5. **Fix-First Philosophy**: In task assignment, obvious simple tasks (doable at the Exec level) should be auto-routed, don't ask the user every time.

6. **Four modes (Hold/Expand/Reduce/Selective)**: In the task classifier, a similar "complexity strategy" parameter could be introduced—users can choose "save money mode (more Exec)" or "quality mode (more Tier-A)."

### What Can Be Improved

1. **gstack's task routing is manual**: Users must know `/investigate` is for bugs, `/review` is for code review. gstack-plus should auto-classify task types without user selection.

2. **gstack has no failure fallback**: If the Exec model messes up, there's no automatic escalation to Tier-A. gstack-plus's core differentiation is right here.

3. **gstack's model is fixed**: The entire system only uses Claude, no model diversity. gstack-plus's core is decoupling "who does this skill" from the skill itself.

4. **gstack has no cost tracking**: Although there is telemetry, there's no view of "how many tokens / money this session cost." gstack-plus's goal (reduce cost by 60%) requires cost visualization.

### What Doesn't Apply

1. **Browse daemon**: gstack-plus is not a browser automation framework, this part doesn't need to be borrowed.

2. **Pretext HTML generation**: This is a gstack-specific design tool, not aligned with gstack-plus's positioning.

3. **Greptile integration**: This is a specific tool integration, not a general framework design.

---

## Things I Haven't Fully Understood

1. **What is OpenClaw?** The files mention OpenClaw as an orchestrator multiple times, but there's no detailed explanation. Is it gstack's multi-agent collaboration framework?

2. **What is GBrain?** There's a GBrain Sync mechanism, seemingly cross-machine memory sync based on GitHub repos. What's its relationship with `/learn`?

3. **Design of Browser skills (domain skills)**: `$B domain-skill save|list` lets agents store notes for specific sites, with a "learning upgrade" mechanism (activates after enough uses). What's the design philosophy behind this trust-building mechanism?

4. **preamble-tier 1/2/3/4**: Each skill has different preamble tier values, but I couldn't find what these values specifically affect.

---

## Key Insight (Most Important Finding on Day 1)

**gstack's essence is: "role-ifying" AI workflows**

Not "prompt engineering," not "tool use"—but "giving AI a clear role identity."

When a skill says "you are a paranoid Staff Engineer," the AI's output quality and consistency far exceed generic instructions. This is the core of why gstack works.

**The biggest inspiration for gstack-plus**:

The ultimate purpose of three-tier model routing is not just "save money by using cheap models," but "let each model work in the role it's best at." Tier-Exec isn't doing "a cheap version of Tier-A," but "the complete version of itself in its best-suited execution role." That's the moat.

---

*Notes by: Claude Sonnet 4.6 | Learning source: `~/.claude/skills/gstack/`*
