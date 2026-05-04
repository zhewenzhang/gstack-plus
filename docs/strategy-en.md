# Why Layered Routing? — The Design Rationale for gstack-plus

> In one sentence: **The cost problem in most AI workflows isn't that models are too expensive — it's that routing is too lazy.**

---

## The Status Quo: Everything Goes to the Same Model

Open Claude, GPT-4, or Cursor. Whether it's "rename a function" or "design an SSO architecture," everything gets sent to the same top-tier model.

This creates two problems:

| Problem | What it looks like | Cost |
|---------|-------------------|------|
| **Overspending** | Using Opus for `git rebase` or function renames | Token cost 5–20× too high |
| **Underthinking** | Using Haiku to design auth architecture or evaluate risk | Wrong decisions, expensive rework |

Both are routing errors. Both are waste.

---

## The Core Insight: Task Complexity Varies 10×, and So Does Cost

Real development tasks roughly break down like this:

```
Tier-Exec (low judgment)    ████████████████████░░░░  ~50%
Tier-Mid  (medium)          ████████████░░░░░░░░░░░░  ~35%
Tier-A    (high judgment)   ██████░░░░░░░░░░░░░░░░░░  ~15%
```

And costs look like this:

| Tier | Example Model | Relative Cost |
|------|--------------|---------------|
| Tier-A | Claude Opus | **1×** (baseline) |
| Tier-Mid | Claude Sonnet | **0.2×** |
| Tier-Exec | Qwen / Haiku | **0.03×** |

If you run 50% of your Tier-Exec tasks through Opus, you're paying a 30× premium for mechanical work.

### Experiment Validation

This isn't theory. We ran a 3-task × 2-mode controlled experiment on 2026-05-04:

| Task type | Mode A (All-Opus) | Mode B (Routed) | Cost saving | Quality |
|-----------|------------------|-----------------|-------------|---------|
| Tier-Exec: function rename | $0.012 | $0.0001 (Qwen) | −99% | Missed word boundary |
| Tier-Mid: React Query refactor | $0.079 | $0.012 (Sonnet) | −85% | Sonnet **beat** Opus |
| Tier-A: SSO+MFA architecture | $0.079 | $0.079 (Opus) | 0% | Tied (same model) |
| **Total** | **$0.169** | **$0.091** | **−46%** | Near-equivalent |

Key finding: **Tier-Mid routing is the clearest win** — Sonnet is not only 85% cheaper, it produced more actionable output than Opus for implementation tasks.

Full report: [experiments/token-comparison/RESULTS.md](../experiments/token-comparison/RESULTS.md)

---

## The gstack-plus Solution: 5-Dimension Scoring → Precise Routing

The goal isn't "use cheap models." It's "use the **right** model."

Five dimensions determine which tier a task goes to:

| Dimension | Core Question |
|-----------|--------------|
| **Judgment** | Does this decision require domain intuition? |
| **Context Width** | How much codebase knowledge does the model need? |
| **Risk** | How long until a mistake is found and fixed? |
| **Verifiability** | Can success be verified automatically? |
| **Creativity** | Does this require designing something new, or following existing patterns? |

Routing rules:
- `Judgment ≥ 4 OR Risk ≥ 4 OR Creativity ≥ 4` → **Tier-A** (must use the strongest model)
- `Judgment ≤ 2 AND Context ≤ 2 AND Verifiability ≥ 4` → **Tier-Exec** (mechanical, cheaper models suffice)
- Everything else → **Tier-Mid**

---

## When Is gstack-plus Most Valuable?

**Best fit:**
- You have a high volume of repetitive "execution tasks" (code generation, file transforms, formatting)
- You occasionally need high-judgment architecture design or technical review
- AI usage cost is already a visible problem

**Not a good fit:**
- You only use AI for 2–3 things per day and cost isn't an issue
- All your tasks genuinely require top-tier models (pure research work)
- You're not willing to spend time classifying tasks (the `--auto` flag helps but still needs an API key)

---

## Clearing Up Misconceptions

**"Isn't tiering just cutting corners to save money?"**

No. The core of tiering is **quality assurance**, not cost cutting.

Sending architecture design to Tier-Exec is *quality degradation* (insufficient model capability).
Sending function renames to Tier-A is *waste* (excess capability that adds no quality improvement).

Correct routing means every model does what it's best at. Cost reduction is a side effect, not the goal.

**"Isn't scoring 5 dimensions tedious?"**

Once familiar, most tasks take under 30 seconds to score. The `--auto` flag lets Haiku score automatically.

More importantly: **the scoring process is itself an act of thinking through the task.** Forcing yourself to consider "how complex is this task, really?" before dispatching it — that habit has value on its own.

---

## Further Reading

- [3-Tier Architecture](./architecture.md) — Role boundaries and cost tradeoffs per tier
- [Scoring Guide](../classifier/scoring-guide.md) — 1–5 criteria for all 5 dimensions
- [Routing Rules](../classifier/routing-rules.md) — Complete decision table from scores to tier
