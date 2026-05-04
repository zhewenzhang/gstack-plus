# Shipping Skills Learning Notes

> Day 5-6 | Deep analysis of `/ship` and `/land-and-deploy`

---

## Skills Overview

| Skill | Version | Preamble Tier | Role |
|------|------|--------------|------|
| `/ship` | 1.0.0 | 4 | Automated PR creation + pre-merge checks |
| `/land-and-deploy` | 1.0.0 | 4 | PR merge + deploy + production verification |

---

## Part I: `/ship` — Fully Automated Ship Workflow

### Literal Layer: What Does It Do?

`/ship` is the complete automated workflow "from code completion to PR creation." It doesn't just "create a PR"—it executes a full quality-gated pipeline before PR creation, ensuring only ready code enters PR.

**Complete Workflow (19+ steps):**

```
Step 0:  Detect platform and base branch (GitHub/GitLab/git-native)
Step 1:  Pre-flight + Review Readiness Dashboard
         ├── Check if on feature branch (base branch → abort)
         ├── Show Review Readiness Dashboard (Eng/CEO/Design/Adversarial/Outside Voice)
         └── If Eng Review is not CLEAR → Step 9 will run review itself
Step 2:  Distribution Pipeline Check
         └── If new CLI/library → confirm release CI/CD exists, otherwise AskUserQuestion
Step 3:  Merge base branch (BEFORE tests)
         └── git fetch + merge → ensure tests run on merged state
Step 4:  Test Framework Bootstrap
         ├── Detect runtime (Ruby/Node/Python/Go/Rust/PHP/Elixir)
         ├── If no test framework → AskUserQuestion to choose → install → create sample test
         ├── Generate 3-5 real tests (prioritize high-risk files)
         ├── Create TESTING.md + update CLAUDE.md
         └── Generate CI/CD pipeline (.github/workflows/test.yml)
Step 5:  Run tests (on merged code)
         ├── Run tests in parallel (bin/test-lane + npm test)
         └── On failure → Test Failure Ownership Triage
              ├── Classify: In-branch vs Pre-existing
              ├── solo repo → fix now / add TODO / skip
              └── collaborative → fix now / create issue assign author / add TODO / skip
Step 6:  Eval Suites (conditional)
         └── If diff touches prompt files → run LLM eval (EVAL_JUDGE_TIER=full)
Step 7:  Test Coverage Audit (subagent)
         ├── Trace data flow for every code path
         ├── Draw ASCII coverage diagram (code paths + user flows)
         ├── Mark paths as [→E2E] and [→EVAL]
         ├── Regression rule: Found regression → immediately write regression test (Iron Rule)
         ├── Coverage gating: Default Min 60% / Target 80%
         └── Generate tests for uncovered paths → re-check coverage
Step 8:  (Skipped, goes directly to Step 9)
Step 9:  Pre-landing Review
         ├── If no prior review → run its own review
         └── Check checklist.md
Step 10: Check for plan completion (if autoplan was run)
Step 11: Analyze diff vs plan (Scope Drift Detection)
Step 12: VERSION + CHANGELOG
         ├── Auto bump VERSION (Micro/Patch)
         ├── Generate CHANGELOG from diff
         └── WIP commit squash (if WIP: prefix exists)
Step 13: Commit splitting (bisectable commits)
Step 14: TODOS.md management
Step 15: Commit all changes
Step 16: Push to remote
Step 17: Create PR (with comprehensive body)
Step 18: (Post-PR creation processing)
Step 19: Output PR URL
```

**Key Mechanism Details:**

**Test Failure Ownership Triage:**
```
Test failure
  ├── In-branch (caused by branch changes) → STOP, developer must fix
  └── Pre-existing (existing issue)
       ├── solo repo → fix now / add P0 TODO / skip
       └── collaborative → fix now / create issue assign last modifier / add TODO / skip
```

**Coverage Audit's User Flow Tracking:**
Not just code branch coverage, but also tracking:
- User action sequences (click → verify → API → success/failure page)
- Interaction edge cases (double-click/rapid resubmit/navigate away/expired data/slow connection/concurrent operations)
- User experience of error states (clear error message or silent failure? Can recover or stuck?)

### Design Layer: Why Is It Designed This Way?

#### Design Decision 1: `/ship` Is "PR Creation + Full Quality Pipeline," Not "Just Create PR"

**Decision**: `/ship` executes 19+ steps of full checks (tests, coverage, eval, review, VERSION, CHANGELOG) before creating a PR, not just calling `gh pr create`.

**Why**: A PR is a "request to merge into the main branch," meaning the submitter believes the code is ready. If there's no complete check before PR creation, reviewers are reviewing unverified code, wasting reviewers' time.

**Counter-example**: In traditional workflows, developers manually create PRs, and CI only starts after PR creation. If tests fail, the PR still exists, and reviewers may start reviewing code that ultimately won't be merged.

---

#### Design Decision 2: Test Failure "Ownership Triage"

**Decision**: Test failures aren't simply "stop" or "continue"—they first classify who caused the failure (In-branch vs Pre-existing), then give different handling options based on repo mode (solo vs collaborative).

**Why**:
1. **Pre-existing failures** are not the current branch's responsibility; forcing repair would disrupt workflow
2. **Solo vs collaborative** have completely different responsibility assignments—solo developers have low cost to "fix now" (context is still fresh), collaborative should assign to "last modifier" (usually the actual breaker)
3. Use `git blame` to find "the last person who modified the test file" and "the last person who modified the tested source code," prioritizing the source code author—they're more likely to have introduced the regression

**Counter-example**: Without ownership distinction, all test failures force the current developer to fix. Result: developer spends 2 hours fixing a bug they didn't introduce, while the actual responsible person is completely unaware.

---

#### Design Decision 3: Coverage Audit Runs as Subagent

**Decision**: Test coverage audit runs via Agent tool as a subagent; the parent agent only sees the final conclusion, not the intermediate file reading process.

**Why**: This is **context-rot defense**. Coverage audit requires reading大量 source files; if done directly in the main flow, it would consume large amounts of context window, affecting the quality of subsequent steps. Subagents have independent contexts and return only JSON conclusions when done.

**Counter-example**: Reading 20 source files for coverage analysis in the main flow occupies 60% of context window, degrading the quality of subsequent CHANGELOG generation and PR body creation (increased hallucination risk).

---

#### Design Decision 4: Eval Suites Only Trigger on Prompt File Changes

**Decision**: LLM eval only runs when diff touches prompt-related files (prompt builder, generation service, evaluator, system_prompts); otherwise completely skipped.

**Why**: LLM eval is expensive (full tier ~$1.27 per run, 72 seconds). Non-prompt changes don't affect LLM output quality, so running eval is wasteful. But prompt changes have implicit effects—code logic may be completely correct, but LLM output quality may degrade—this requires specialized eval to catch.

**Counter-example**: Changing a prompt template from "please use friendly tone" to "answer directly," all code tests pass, but production user experience drops sharply. Without eval, this issue wouldn't be discovered until user complaints.

---

#### Design Decision 5: Merge Base Branch Before Tests (Step 3 Before Step 5)

**Decision**: First merge the base branch into the feature branch, then run tests on the merged state.

**Why**: Code that passes tests must work in the merged state. If tests only run on the feature branch, they may pass but fail after merging due to base branch changes (API changes, dependency updates). Merging first then testing ensures tests run on "the real merged state."

**Counter-example**: Feature branch tests all pass, but after merging, the base branch changed an API signature yesterday, and the feature branch's call method is now obsolete, causing production errors.

---

#### Design Decision 6: WIP Commit Squash Mechanism

**Decision**: `/ship` is responsible for squashing `WIP:` prefixed commits into meaningful atomic commits.

**Why**: WIP commits during development ("WIP: start doing billing", "WIP: fix typo") are noise in git history. `/ship` cleans up these commits before PR creation, making the PR's commit history an auditable asset, not a development流水帐.

**Counter-example**: PR has 47 commits, 30 of which are "WIP: fix", "fix typo", "oops." Reviewers cannot understand through git log "how this feature was built step by step."

---

## Part II: `/land-and-deploy` — Merge, Deploy, Verify

### Literal Layer: What Does It Do?

`/land-and-deploy` takes over the PR created by `/ship`, responsible for "merge → wait for CI → wait for deploy → verify production health → output deploy report." It is "the last line of defense for irreversible operations."

**Complete Workflow:**

```
Step 0:  Detect platform (GitHub only, GitLab not implemented)
Step 1:  Pre-flight
         ├── Check gh auth authentication
         ├── Parse parameters (PR number / current branch / URL)
         └── Verify PR status (OPEN/CLOSED/MERGED)
Step 1.5: First-run dry-run validation (first-time dry run)
         ├── Detect deployment infrastructure (fly.toml / vercel.json / render.yaml etc.)
         ├── Verify command availability (gh auth / platform CLI / curl prod URL)
         ├── Detect staging environment
         ├── Preview readiness checks
         └── AskUserQuestion confirmation: "Does this match your project's real deployment method?"
Step 2:  Pre-merge checks
         ├── CI status (gh pr checks)
         └── Merge conflict detection
Step 3:  Wait for CI (if pending, 15 min timeout)
Step 3.4: VERSION drift detection
         └── Detect if sibling workspace has already merged and moved the VERSION queue
Step 3.5: Pre-merge readiness gate (critical safety check)
         ├── 3.5a: Review staleness check (0 commits=CURRENT, 1-3=RECENT, 4+=STALE)
         ├── 3.5a-bis: Inline review offer (if review STALE or NOT RUN → offer quick review)
         ├── 3.5b: Test results (free tests + E2E + LLM evals)
         ├── 3.5c: PR body accuracy check (does PR description reflect actual commits)
         ├── 3.5d: Document-release check (CHANGELOG/VERSION updated)
         └── 3.5e: Readiness report + AskUserQuestion confirmation
Step 4:  Merge the PR
         ├── Try auto-merge (respect repo merge settings / merge queues)
         ├── If auto-merge unavailable → squash merge
         └── Merge queue detection (if repo uses merge queue → poll 30 min)
Step 5:  Deploy strategy detection
         ├── Detect deployment platform (fly/render/vercel/netlify/heroku/railway)
         ├── Detect deploy workflows (GitHub Actions)
         ├── Judge diff scope (FRONTEND/BACKEND/DOCS/CONFIG)
         ├── If docs-only → skip verification
         ├── 5a: Staging-first option (if staging → deploy staging first, then production after passing)
         └── AskUserQuestion (if no deploy workflow or URL detected)
Step 6:  Wait for deploy
         ├── Strategy A: GitHub Actions workflow (poll 30s, 20 min timeout)
         ├── Strategy B: Platform CLI (fly status / heroku releases)
         ├── Strategy C: Auto-deploy platforms (Vercel/Netlify, wait 60s)
         └── Strategy D: Custom deploy hooks
Step 7:  Canary verification (conditional depth)
         ├── SCOPE_DOCS → Skipped
         ├── SCOPE_CONFIG → Smoke test (goto + 200 status)
         ├── SCOPE_BACKEND → Console errors + perf check
         ├── SCOPE_FRONTEND → Full canary (console + perf + screenshot + content)
         └── On failure → AskUserQuestion (expected warming up / broken needs revert / further investigation)
Step 8:  Revert (if needed)
         ├── git revert merge-commit-sha
         ├── If conflicts → manual resolution
         ├── If branch protections → create revert PR
         └── Push revert → automatic rollback deployment
Step 9:  Deploy report (ASCII report + JSONL log)
Step 10: Suggest follow-ups (/canary, /benchmark, /document-release)
```

**Canary Verification Depth:**

| Diff Scope | Canary Depth | Specific Checks |
|------------|-------------|---------|
| DOCS only | Skipped | Not executed |
| CONFIG only | Smoke | `$B goto` + 200 status |
| BACKEND only | Console + Perf | Console errors + page load time |
| FRONTEND (any) | Full | Console + Perf + Screenshot + Content |
| Mixed | Full | Same as above |

**First-Time Dry-Run Mechanism:**
```
First deployment → show full dry run:
  ├── Detected platform, URL, workflow
  ├── Command verification table (gh auth / platform CLI / curl prod URL)
  ├── Staging detection results
  ├── What will be executed (5-step description)
  └── AskUserQuestion: "Does this match your project's real deployment method?"
       ├── A) Correct, continue
       ├── B) Something is wrong, let me know
       └── C) Want to configure in more detail (run /setup-deploy)
Subsequent deployments → skip dry-run, go straight to readiness checks
Configuration changes → automatic re-dry-run
```

### Design Layer: Why Is It Designed This Way?

#### Design Decision 1: `/land-and-deploy`'s "First-Time Dry-Run" Mechanism

**Decision**: On first deployment, don't execute any irreversible operations—instead fully display "detected deployment infrastructure + steps to be executed + AskUserQuestion confirmation," giving users two confirmation opportunities before actual deployment.

**Why**: Deployment is irreversible (once merged to production, rollback requires additional commits and time). Users need to build trust in the tool on first use. Dry-run lets users see "the tool understands my project" and "the tool's deployment plan is correct," then executes actual operations.

**Counter-example**: User runs `/land-and-deploy` for the first time, and the tool directly merges the PR and deploys. If the tool misunderstood the deployment configuration (e.g., treating staging URL as production), the production environment gets incorrectly updated, and the user loses trust.

---

#### Design Decision 2: Pre-merge Readiness Gate (Step 3.5) as "Last Line of Defense for Irreversible Operations"

**Decision**: Before merging, execute a complete readiness report (review staleness + test results + PR body accuracy + document-release check), then get explicit confirmation via AskUserQuestion before merging.

**Why**: Merging is irreversible (even with revert, it takes additional time and may cause production downtime). The Readiness Gate ensures:
1. **Review is current** (not code from 10 commits ago)
2. **Tests ran today** (not yesterday's results)
3. **PR description is accurate** (no missing important features or including reverted changes)
4. **Docs are updated** (CHANGELOG and VERSION reflect new functionality)

**Counter-example**: Without readiness gate, the tool merges directly. Result: review was from 20 commits ago, during which SQL injection was introduced; tests ran yesterday, and today's base branch API changes broke the feature branch; PR description is missing new feature documentation. All issues discovered after merge, forced to revert.

---

#### Design Decision 3: Review Staleness Tracking by "Commits Since Review"

**Decision**: Instead of using time ("review was run 3 days ago") to judge if a review is stale, use "how many commits are between the review's commit and current HEAD" (0=CURRENT, 1-3=RECENT, 4+=STALE).

**Why**: Time is a poor metric—sometimes only docs were changed in 3 days (review still valid), sometimes 30 files were changed in 1 hour (review is now invalid). Commit count better reflects "the actual degree of code change." Additionally, checking commit messages for keywords like "fix", "refactor", "rewrite," and whether >5 files were touched further judges the importance of changes.

**Counter-example**: Using time to judge: review ran 1 day ago → CURRENT. But 15 commits refactoring the entire auth module occurred since that review. The review is completely invalid.

---

#### Design Decision 4: Staging-First Option

**Decision**: If a staging environment is detected, offer the option "deploy to staging first, verify, then production" before deploying to production.

**Why**: Staging is a safety net for the production environment. Verifying on staging significantly reduces production risk. If staging fails, production is completely unaffected. This is a traditional SRE best practice.

**Counter-example**: Without staging option, deploy directly to production. After deployment, an environment variable is found misconfigured, production errors for 5 minutes until revert completes.

---

#### Design Decision 5: Canary Verification "Conditional Depth"

**Decision**: Not all deployments do the same depth of canary verification—dynamically adjust verification depth based on diff scope (docs → skip, config → smoke, backend → console+perf, frontend → full).

**Why**: Verification cost (time + API calls) should match risk. Documentation changes have no runtime risk, skip verification. Configuration changes may affect behavior but not UI, smoke test is sufficient. Frontend changes directly impact user experience, need full verification (screenshot + console errors + performance).

**Counter-example**: Documentation changes also doing full canary (screenshot + console + performance), wasting 2 minutes and 3 browser calls, but finding nothing.

---

#### Design Decision 6: VERSION Drift Detection

**Decision**: Before merging, detect if the VERSION file has become stale due to sibling workspace merges (queue moved); if drift is detected → stop and require re-running `/ship`.

**Why**: In multi-workspace environments, multiple branches may be ready to merge simultaneously. If branch A's VERSION is `1.2.3`, and branch B is also `1.2.3`, branch A merges first, VERSION becomes `1.2.4`. At this point, branch B's `1.2.3` becomes a "regression." If branch B still merges, VERSION goes from `1.2.4` back to `1.2.3`, breaking version ordering.

**Counter-example**: Without drift detection, after branch B merges, VERSION regresses. CI's version check passes (because branch B's version is correct on its own branch), but production version numbers appear reversed, confusing users and monitoring systems.

---

## Philosophy Layer: What Beliefs Does It Reflect?

**Belief 1: Merge and deploy are irreversible, so full confirmation must be done before irreversible operations.**

`/ship`'s 19-step quality pipeline and `/land-and-deploy`'s readiness gate both reflect the same belief: once code enters the main branch, the cost of rollback far exceeds the cost of prevention. Every "last line of defense before irreversible operation" says: "confirmation is cheaper than apology."

**Belief 2: Automation doesn't mean skipping human judgment—automation is data collection, judgment remains with humans.**

Both skills use AskUserQuestion at critical nodes (test failure classification, coverage gating, first-time dry-run confirmation, readiness gate confirmation, staging-first option, canary failure handling). The tool collects all data, executes all checks, but the final judgment ("is this risk acceptable?") goes to humans.

**Belief 3: Deployment is a trust-building process, not a function call.**

`/land-and-deploy`'s "first-time dry-run → teacher mode" and "subsequent deployments → efficient mode" reflect an understanding of user psychology: on first use, users need to see the tool's understanding and plan to build trust; after trust is established, users just want results. The deployment tool's goal is: "first time make the user say 'wow, this is thorough,' subsequent times make the user say 'this is fast.'"

**Belief 4: Failures have ownership, not just "pass/fail" binary results.**

Test Failure Ownership Triage design reflects an understanding of the collaborative reality of software development: test failure reasons may be current branch changes or existing issues. Forcing developers to fix all tests (including ones they didn't introduce) creates wrong incentives—they'll learn to avoid running tests.

---

## Two-Skill Collaboration Relationship

```
┌─────────────────────────────────────────────────────────┐
│  Developer completes code                                │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │      /ship             │
         │  Pre-PR quality pipe   │
         │  ──────────────────    │
         │  • Tests + coverage    │
         │  • Eval (prompt changes)│
         │  • Pre-landing review  │
         │  • VERSION + CHANGELOG │
         │  • Create PR           │
         └────────┬───────────────┘
                  │ Output PR URL
                  ▼
         ┌────────────────────────┐
         │  (Human review / approve)│
         └────────┬───────────────┘
                  │ After approval
                  ▼
         ┌────────────────────────┐
         │  /land-and-deploy      │
         │  Merge + deploy + verify│
         │  ──────────────────    │
         │  • Readiness gate      │
         │  • Merge PR            │
         │  • Wait for CI/deploy  │
         │  • Canary verification │
         │  • Deploy report       │
         └────────────────────────┘
```

**Key division of labor**:
- `/ship` = PR creation + **all** quality checks before merge (tests, coverage, review, docs)
- `/land-and-deploy` = **all** deployment operations after PR approval (merge, wait, verify, report)
- Human = Makes final judgment after `/ship` creates PR and before `/land-and-deploy` merges

---

## Inspiration for gstack-plus

### Inspiration 1: "Full Confirmation Before Irreversible Operations" Is Core Failure Recovery Design

`/ship`'s 19-step pipeline and `/land-and-deploy`'s readiness gate are both "last lines of defense before doing irreversible things." In gstack-plus, when the Exec model (Qwen) completes code, Claude should execute similar quality checks before merging to the main branch:

```
Exec completes code
  → Claude executes quality check:
       ├── Tests pass?
       ├── Coverage acceptable?
       ├── Scope not exceeded handoff instructions?
       └── Pass → Create PR
           → Human approval
               → /land-and-deploy merge + deploy
```

### Inspiration 2: Test Failure Classification Can Be Applied to Exec Model Failures

When the Exec model encounters test failures, it should first classify:
- **Caused by Exec's code** → Exec fixes again
- **Existing issue** → Report to Claude, Claude decides whether to fix now or handle later

### Inspiration 3: Subagent's Context-Rot Defense

`/ship`'s coverage audit uses subagent execution to avoid context rot. In gstack-plus, when Exec model output needs deep validation (security audit, performance analysis), it should be executed by independent subagents, not in the main context, to maintain main context quality.

### Inspiration 4: First Dry-Run → Subsequent Efficient Mode Can Be Used for gstack-plus User Onboarding

On first use of gstack-plus, the complete "model division workflow" should be shown so users see: "Tier-A did planning → Tier-Mid did review → Exec did execution → Claude did verification." After trust is established, subsequent uses can skip explanation and execute directly.

### Inspiration 5: Readiness Gate's "Staleness by Commits, Not Time" Can Be Used for Exec Model Context Verification

When judging whether the Exec model's context is stale, don't look at "how long ago the context was written," but at "how many code changes occurred after the context was written." If the codebase has changed 20 commits since Exec started executing, the Exec's context should be refreshed.

### Areas for Improvement

- `/ship`'s coverage audit relies on AI tracing data flow—this may miss complex indirect calls (reflection, dynamic dispatch). **Improvement**: Integrate runtime coverage tools (SimpleCov, Istanbul) as a supplement to AI analysis.
- `/land-and-deploy`'s canary verification only does one-time checks, not continuous monitoring. **Improvement**: Merge with `/canary` skill, continuously monitoring for 10-15 minutes after deployment, catching issues that "start normal but appear minutes later" (CDN propagation, cache warming).
- Review staleness only checks commit count, not change "importance." **Improvement**: Add change scale weighting (fixing a typo in 1 file vs refactoring 15 files—both are 5 commits, but the latter needs re-review much more).

---

## Things I Haven't Fully Understood

- `/ship`'s Step 8 is skipped—what was the original Step 8? Is it a leftover from document history or intentionally removed?
- `bin/test-lane`'s specific implementation—how does it run tests in parallel? What's its relationship with `npm test`?
- How does VERSION drift detection's `gstack-next-version` tool maintain the global version queue?
- `/land-and-deploy`'s GitLab support is marked "not implemented"—is this due to GitLab API differences or priority issues?
- Who consumes the deploy report's JSONL logs afterward? Is it for cross-project analysis or only for audit trails?

---

*Completed 2026-05-02*
