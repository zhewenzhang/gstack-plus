# Getting Started

> From zero to your first routing decision in 5 minutes.

## Install

No install needed — use `npx` to always get the latest version:

```bash
npx gstack-plus --version
```

Or install globally:

```bash
npm install -g gstack-plus
```

## Step 1: Initialize your project

Run `init` in your project root. It creates `./handoffs/` and prints a step-by-step guide:

```bash
gstack-plus init
```

## Step 2: Classify a task

Describe what you're about to build:

```bash
gstack-plus classify "Refactor auth middleware to support OAuth"
```

You'll answer 5 questions (1–5 scale):

| Dimension | 1 means… | 5 means… |
|-----------|----------|----------|
| **Judgment Strength** | Mechanical, rule-following | Requires architectural decision |
| **Context Width** | Single file | Cross-module system understanding |
| **Risk Weight** | Local scratch | Data loss / security incident |
| **Verifiability** | Purely subjective | Tests / lint / build pass |
| **Creativity Density** | Follow a template | Design from scratch |

After scoring, you get a routing decision and a handoff doc:

```
Routing decision: Tier-A
Reason: Tier-A 條件觸發：judgment=4 ≥ 4, risk=4 ≥ 4

✓ Handoff doc written → ./handoffs/handoff-2026-05-03-x9p2.md
```

## Step 3: Fill in the handoff doc

Open `./handoffs/handoff-*.md`. Fill in three sections:

- **Scope Lock** — which files this task is allowed to modify
- **Completion Criteria** — verifiable success conditions
- **Restrictions** — what the model must not do

Then paste the entire doc into your Tier-A / Mid / Exec model's context.

## Shortcuts

Skip the interactive prompts by passing scores directly:

```bash
gstack-plus classify "Add ESLint config" --scores 1,1,1,5,1
# → Tier-Exec  (mechanical, verifiable, low-risk)

gstack-plus --lang en classify "Design auth flow" --scores 5,4,5,2,4
# → Tier-A  (English prompts + output)
```

## Explore

```bash
gstack-plus examples          # browse 5 built-in examples
gstack-plus examples auth     # show one by name
gstack-plus rules             # print the routing rules
gstack-plus history           # list your recent handoffs
```

## Next steps

- [Architecture overview](./architecture) — how the three tiers work together
- [Routing rules](./routing-rules) — full spec with all edge cases
- [Examples library](./ex-tier-exec-eslint) — 5 annotated real-world decisions
- [Web Playground](https://zhewenzhang.github.io/gstack-plus/#/playground) — try the classifier in your browser
