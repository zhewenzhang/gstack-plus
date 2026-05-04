# Routing Decision Tree

> Part 2 of the task classifier: after scoring all 5 dimensions, use this decision tree to route to the correct Tier.
>
> **Conservative Routing Principle:** When uncertain, default to a higher Tier. The cost of underestimating task complexity far exceeds overestimating.

---

## Routing Rules

### Rule 1: Tier-A (Strategic Decision Layer)

```
Judgment >= 4
  OR Risk >= 4
  OR Creativity >= 4
→ Tier-A
```

**Rationale:** High scores in these dimensions mean the task requires architecture-level judgment, involves high risk, or needs design from scratch. These are things Tier-Exec and Tier-Mid are not good at.

---

### Rule 2: Tier-Exec (Execution Layer)

```
Judgment <= 2
  AND Context <= 2
  AND Verifiability >= 4
→ Tier-Exec
```

**Rationale:** This task is mechanical (low judgment), localized (narrow context), verifiable (clear success criteria). Perfect fit for Exec execution.

**Note:** Verifiability >= 4 is a hard requirement. If a task is unverifiable (verifiability <= 3), even with low judgment and context, it's not suitable for Exec — because there's no automatic way to prove Exec did it right.

---

### Rule 3: Tier-Mid (Complex Check Layer)

```
Does not satisfy Rule 1 AND does not satisfy Rule 2
→ Tier-Mid
```

**Rationale:** This task needs some judgment but not architecture-level reasoning; or it involves more context but isn't high-risk. This is Tier-Mid's sweet spot.

---

## Decision Tree ASCII Diagram

```
                     ┌─────────────────────┐
                     │  Task + 5-Dim Score  │
                     └──────────┬──────────┘
                                │
                    ┌───────────▼───────────┐
                    │ Judgment >= 4?        │
                    │ Risk >= 4?            │
                    │ Creativity >= 4?      │
                    └───────┬───┬───┬───────┘
                            │   │   │
                    Any yes┘    │   │
                                │   │
                    ┌───────────▼───▼───┐
                    │     Tier-A        │
                    │  (Strategic)      │
                    └───────────────────┘
                                │
                         All no┘
                                │
                    ┌───────────▼───────────┐
                    │ Judgment <= 2?        │
                    │ Context <= 2?         │
                    │ Verifiability >= 4?   │
                    └───────┬───┬───┬───────┘
                            │   │   │
                    All yes┘    │   │
                                │   │
                    ┌───────────▼───▼───┐
                    │     Tier-Exec     │
                    │  (Execution)      │
                    └───────────────────┘
                                │
                         Any no┘
                                │
                    ┌───────────▼───────────┐
                    │     Tier-Mid          │
                    │  (Complex Check)      │
                    └───────────────────────┘
```

---

## Special Cases

### Case 1: Insufficient Information for a Dimension

**Problem:** When scoring a dimension, information is lacking (e.g., don't know how many files this task touches).

**Handling:** **Default → High score (conservative routing)**

```
Dimension lacking info → Score high → Apply routing rules
```

**Rationale:** The cost of underestimating (Exec messes up and needs redoing from scratch) far exceeds overestimating (using a stronger model than needed).

**Examples:**
- "How many files does this task change?" → Don't know → Context = 4 → Route to Tier-Mid or Tier-A
- "What's the risk if this goes wrong?" → Don't know → Risk = 4 → Route to Tier-A

---

### Case 2: Fallback When Tier-Mid Is Unavailable

**Problem:** Tier-Mid model is temporarily unavailable (API rate limit, maintenance, etc.).

**Fallback plan:**
- Tasks that should route to Tier-Mid → **Escalate to Tier-A**
- If Tier-A is also unavailable → **Delay execution, queue and wait**

**Not recommended:**
- ❌ Downgrade to Tier-Exec: Mid tasks usually need judgment, Exec has high chance of messing up

**Rationale:** Tier-A is more expensive than Tier-Mid, but cheaper than rework after Exec gets it wrong.

---

### Case 3: Task Description Is Ambiguous

**Problem:** Task description isn't clear enough for the classifier to score reliably.

**Handling:** **Escalate to Tier-A for clarification, don't guess**

```
Ambiguous task → Tier-A clarifies → Re-score → Route
```

**Rationale:** Scoring based on ambiguous descriptions is unreliable, and so is the routing result. Let Tier-A (with architecture-level perspective) clarify — safest choice.

**Examples:**
- "Optimize performance" → Optimize what? → Ambiguous → Tier-A clarifies
- "Update documentation" → Which docs? → Ambiguous → Tier-A clarifies

---

## Edge Case Guide

### Characteristics of Tasks That Look Simple But Need Tier-A

| Characteristic | Example | Why Tier-A |
|----------------|---------|------------|
| **Hidden architecture impact** | "Make this function async" | All callers need synchronous changes; impact chain not obvious |
| **Hidden security risk** | "Pass user ID in URL" | May lead to IDOR vulnerability, but looks like a format change |
| **Hidden data risk** | "Change this field from string to number" | Existing data needs migration, may lose precision |
| **Small change but deep dependencies** | "Change a constant value" | Constant referenced in 50 places, changes behavior |

**Identification tip:** Ask "How deep is the impact chain of this change?" If more than 2 levels deep, it might be a pseudo-simple task.

---

### Characteristics of Tasks That Look Complex But Can Be Tier-Exec

| Characteristic | Example | Why Exec Works |
|----------------|---------|----------------|
| **Looks big but mechanical** | "Update license header to 2026 in all files" | Involves 100+ files but operation is identical |
| **Has complete template reference** | "Add same error handling to billing module as auth module has" | Complex but has template, Exec can copy |
| **Extremely high verifiability** | "Run benchmark, alert if p99 > 100ms" | Clear pass/fail criteria |

**Identification tip:** Ask "Can this task be automated with a script?" If yes, Exec can substitute.

---

## Conservative Routing Principle

> **When uncertain, default to a higher Tier. The cost of underestimating task complexity far exceeds overestimating.**

**Specific actions:**

1. **Uncertain when scoring** (3 or 4?) → **Give 4**
2. **Routing result is borderline** (just barely doesn't meet Exec criteria) → **Bump up to Tier-Mid**
3. **Task type is first-time** (never done this kind of task before) → **Bump up one level**
4. **Task involves user data or security** → **Direct to Tier-A**

**Rationale:**
- Overestimating cost: Uses more high-tier model tokens, costs 20-50% more
- Underestimating cost: Exec messes up → Tier-Mid analysis → Tier-A replanning → Total cost is 3-5x original

**Long-term optimization:** As experience accumulates, scores for similar tasks will stabilize. When a task type has been successfully completed by Exec 5 times in a row, the score can be lowered by 1 point (from 3 to 2), making routing more aggressive.

---
