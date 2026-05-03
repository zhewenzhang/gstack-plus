# gstack-plus CLI

> Classify any dev task across 5 dimensions, get the right Tier, generate a handoff doc.

## Install

```bash
npm install -g gstack-plus
# or use without installing:
npx gstack-plus classify "Fix the auth middleware bug"
```

## Usage

### Interactive mode

```bash
gstack-plus classify "Refactor user service to use new auth provider"
```

Walks you through 5 prompts, then prints the routing decision and writes a handoff doc.

### Non-interactive mode

```bash
gstack-plus classify "task description" --scores 4,3,4,2,2
```

Order: `judgment,context,risk,verifiability,creativity` — each 1–5.

### Print routing rules

```bash
gstack-plus rules
```

## What it does

1. Asks you to score the task on 5 dimensions (1–5 each)
2. Applies the routing rules from `classifier/routing-rules.md`
3. Tells you which Tier to send it to (A / Mid / Exec)
4. Generates a handoff template doc you can fill in and ship

## Routing rules

```
Judgment >= 4  OR  Risk >= 4  OR  Creativity >= 4         -> Tier-A
Judgment <= 2  AND  Context <= 2  AND  Verifiability >= 4 -> Tier-Exec
else                                                      -> Tier-Mid
```

Conservative default: when uncertain, route up. The cost of under-thinking
(Haiku breaking auth) far outweighs the cost of over-spending (Opus on a typo fix).

Full spec: [classifier/routing-rules.md](../classifier/routing-rules.md)

## License

MIT
