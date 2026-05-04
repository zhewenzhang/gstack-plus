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

Walks you through 5 prompts (1–5 scale), then prints the routing decision and writes a handoff doc.

### Non-interactive mode

```bash
gstack-plus classify "task description" --scores 4,3,4,2,2
```

Order: `judgment,context,risk,verifiability,creativity` — each 1–5.

### Output preview

```text
────────────────────────────────────────────────
  Judgment    ████████░░  4
  Context     ██████░░░░  3
  Risk        ████████░░  4
  Verif.      ████░░░░░░  2
  Creativity  ████░░░░░░  2

Routing decision: Tier-A
Reason: Tier-A triggered: judgment=4 >= 4, risk=4 >= 4

✓ Handoff doc written → handoffs/handoff-2026-05-04-x7k2.md
```

Bars for dimensions that triggered Tier-A (judgment / risk / creativity >= 4) display in magenta in your terminal.

### Language option

```bash
gstack-plus --lang en classify "task description"
gstack-plus --lang zh classify "task description"   # default
```

Switches prompts and output messages to English or Chinese. Handoff doc language follows the flag.

### Auto mode (uses Claude API)

```bash
ANTHROPIC_API_KEY=sk-... gstack-plus classify "Refactor auth middleware" --auto
```

Uses `claude-haiku-4-5-20251001` to score the task automatically. Same routing rules apply.

Without the env var, use `--api-key sk-...` directly.

### Browse examples

```bash
gstack-plus examples            # list all 5 built-in routing examples
gstack-plus examples auth       # show one example by name with score breakdown
```

### View recent handoffs

```bash
gstack-plus history             # list recent handoff docs in ./handoffs/
gstack-plus history -d ~/handoffs -n 20   # custom dir, show up to 20
```

### Initialize a project

```bash
gstack-plus init
```

Creates `./handoffs/` directory and prints a step-by-step quick-start guide.

```bash
gstack-plus init -d ~/my-handoffs   # custom directory
```

### Manage config

Store preferences in `~/.gstack-plus.json` so you don't need to pass flags every time:

```bash
gstack-plus config                        # list current settings
gstack-plus config set lang en            # remember English as default
gstack-plus config set handoffDir ~/work/handoffs   # remember handoff directory
gstack-plus config get lang               # read one setting
gstack-plus config reset                  # clear all settings
```

Once `lang` is set, `classify` and `init` use it automatically without `--lang`.

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
Judgment >= 4  OR  Risk >= 4  OR  Creativity >= 4         → Tier-A
Judgment <= 2  AND  Context <= 2  AND  Verifiability >= 4 → Tier-Exec
else                                                      → Tier-Mid
```

Conservative default: when in doubt, route up. The cost of under-thinking
(Haiku breaking auth) far outweighs the cost of over-spending (Opus on a typo fix).

Full spec: [classifier/routing-rules.md](../classifier/routing-rules.md)

## License

MIT
