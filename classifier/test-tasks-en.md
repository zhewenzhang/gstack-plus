# Classifier Test Task Suite

> 20 synthetic test tasks for validating classifier consistency.
>
> **Usage**: For each task, use only the `scoring-guide.md` and `routing-rules.md` — without relying on human judgment — to see whether the correct routing result can be derived.
>
> **Note**: This is a synthetic test suite covering the full routing spectrum. After the user provides a real Louise task list, it can be replaced or extended based on it.

---

## Tier-Exec Tasks (Tasks 1-7)

### Task 1: Replace all `console.log` with structured logger calls

**Task Description**: In the `src/` directory, replace all `console.log()` and `console.error()` calls with `logger.info()` and `logger.error()` respectively. Keep the log format unchanged (string content remains the same) — only replace the call style. The logger already exists at `src/utils/logger.ts`.

**Correct Routing**: Tier-Exec

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 2 |
| Context Width | 2 |
| Risk Weight | 1 |
| Verifiability | 4 |
| Creativity Density | 1 |

**Routing Derivation**: Judgment ≤ 2 AND Context ≤ 2 AND Verifiability ≥ 4 → Tier-Exec

---

### Task 2: Add TypeScript return type annotations to `formatDate()`

**Task Description**: In `src/utils/format.ts`, add a return type annotation `: string` to the `formatDate` function. This function currently has no return type annotation. Do the same for the `formatNumber` and `formatCurrency` functions in the same file.

**Correct Routing**: Tier-Exec

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 1 |
| Context Width | 1 |
| Risk Weight | 1 |
| Verifiability | 5 |
| Creativity Density | 1 |

**Routing Derivation**: Judgment ≤ 2 AND Context ≤ 2 AND Verifiability ≥ 4 → Tier-Exec

---

### Task 3: Add a pre-commit hook for `npm run lint`

**Task Description**: Install husky in the project (`npm install -D husky`), then set up a pre-commit hook that automatically runs `npm run lint` before each commit. Refer to the existing `scripts` field in `package.json`.

**Correct Routing**: Tier-Exec

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 2 |
| Context Width | 2 |
| Risk Weight | 1 |
| Verifiability | 4 |
| Creativity Density | 1 |

**Routing Derivation**: Judgment ≤ 2 AND Context ≤ 2 AND Verifiability ≥ 4 → Tier-Exec

---

### Task 4: Update Node engine requirement in `package.json` from `>=14` to `>=18`

**Task Description**: Modify the `engines.node` field in `package.json` from `"node": ">=14"` to `"node": ">=18"`. Also update the corresponding Node version number in the Requirements section of `README.md`.

**Correct Routing**: Tier-Exec

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 1 |
| Context Width | 2 |
| Risk Weight | 2 |
| Verifiability | 4 |
| Creativity Density | 1 |

**Routing Derivation**: Judgment ≤ 2 AND Context ≤ 2 AND Verifiability ≥ 4 → Tier-Exec

---

### Task 5: Add `requestId` to response headers for all API routes

**Task Description**: In `src/middleware/response.ts`, add an Express middleware that attaches an `X-Request-Id` header to every response, with the value coming from `req.id` on the request (this field is already set by an upstream middleware). Ensure this middleware runs before all routes.

**Correct Routing**: Tier-Exec

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 2 |
| Context Width | 2 |
| Risk Weight | 1 |
| Verifiability | 4 |
| Creativity Density | 2 |

**Routing Derivation**: Judgment ≤ 2 AND Context ≤ 2 AND Verifiability ≥ 4 → Tier-Exec

---

### Task 6: Rename `.js` files to `.ts` extension across the project (no content changes)

**Task Description**: Rename all `.js` files in the `src/utils/` directory to `.ts` extension (using `mv` commands). Also update the paths in `package.json` that reference these files. Do not modify file contents.

**Correct Routing**: Tier-Exec

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 1 |
| Context Width | 2 |
| Risk Weight | 2 |
| Verifiability | 4 |
| Creativity Density | 1 |

**Routing Derivation**: Judgment ≤ 2 AND Context ≤ 2 AND Verifiability ≥ 4 → Tier-Exec

---

### Task 7: Generate `CHANGELOG.md` from the last 10 git commits

**Task Description**: Run `git log -10 --pretty=format:"- %s (%h)` to retrieve the last 10 commits. Format the output as a Markdown list and write it into a new chapter of `CHANGELOG.md` (use the `version` field from `package.json` as the version number).

**Correct Routing**: Tier-Exec

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 2 |
| Context Width | 1 |
| Risk Weight | 1 |
| Verifiability | 4 |
| Creativity Density | 1 |

**Routing Derivation**: Judgment ≤ 2 AND Context ≤ 2 AND Verifiability ≥ 4 → Tier-Exec

---

## Tier-Mid Tasks (Tasks 8-13)

### Task 9: Add request body size limits to the Express API

**Task Description**: In `src/app.ts`, add a body-parser size limit (set to 1MB) for all POST/PUT routes. Ensure GET/DELETE routes are unaffected. Capture `PayloadTooLargeError` in the error handling middleware and return a 413 status code. Requires understanding of the existing middleware chain and error handling structure.

**Correct Routing**: Tier-Mid

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 3 |
| Context Width | 3 |
| Risk Weight | 3 |
| Verifiability | 4 |
| Creativity Density | 2 |

**Routing Derivation**: Does not satisfy Exec (Judgment = 3 > 2), does not satisfy Tier-A (Judgment < 4, Risk < 4, Creativity < 4) → Tier-Mid

---

### Task 10: Implement pagination logic for API responses

**Task Description**: Add pagination support for the `GET /api/users` endpoint. Request params: `page` (default 1), `limit` (default 20, max 100). Response format: `{ data: User[], total: number, page: number, limit: number, hasMore: boolean }`. Use the existing `User.findMany()` ORM method (which supports `skip` and `take` params).

**Correct Routing**: Tier-Mid

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 3 |
| Context Width | 3 |
| Risk Weight | 2 |
| Verifiability | 4 |
| Creativity Density | 3 |

**Routing Derivation**: Does not satisfy Exec (Judgment = 3 > 2), does not satisfy Tier-A → Tier-Mid

---

### Task 11: Refactor `getUserProfile` to split data fetching from format conversion

**Task Description**: The current `getUserProfile(userId)` function does two things: (1) fetches user data from the database, and (2) formats it for the API response. Split it into `fetchUserFromDB(userId): UserRow` and `formatUserForAPI(user: UserRow): UserProfile` as two separate functions. Existing tests should all still pass (behavior unchanged).

**Correct Routing**: Tier-Mid

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 4 |
| Context Width | 2 |
| Risk Weight | 3 |
| Verifiability | 4 |
| Creativity Density | 3 |

**Routing Derivation**: Judgment = 4 → Tier-A condition. But this is a refactoring task (behavior unchanged) with test protection, so risk is not high → Tier-Mid.
**Counter-intuitive point**: Judgment = 4 might suggest Tier-A, but the "judgment" here is about having test protection, not open-ended design.

---

### Task 12: Review accessibility (a11y) implementation of frontend components

**Task Description**: Review all form components under `src/components/` (Input, Select, Button, Textarea). Check: does every input have a corresponding label, do buttons have focus states, are error messages associated via `aria-describedby`, does color contrast meet WCAG AA standards.

**Correct Routing**: Tier-Mid

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 3 |
| Context Width | 3 |
| Risk Weight | 2 |
| Verifiability | 3 |
| Creativity Density | 2 |

**Routing Derivation**: Does not satisfy Exec (Verifiability = 3 < 4), does not satisfy Tier-A → Tier-Mid

---

### Task 13: Migrate error code system from hardcoded strings to an enum

**Task Description**: The project has 30+ error code strings (e.g., `"USER_NOT_FOUND"`, `"INVALID_PASSWORD"`). Extract them into an `ErrorCode` enum (defined in `src/types/errors.ts`), then replace all usage sites. Ensure the TypeScript type system can catch typos.

**Correct Routing**: Tier-Mid

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 2 |
| Context Width | 4 |
| Risk Weight | 2 |
| Verifiability | 4 |
| Creativity Density | 1 |

**Routing Derivation**: Context = 4 (need to understand 30+ usage sites), Judgment ≤ 2, Verifiability ≥ 4. Does not satisfy Exec (Context > 2), does not satisfy Tier-A → Tier-Mid
**Counter-intuitive point**: The operation itself is mechanical, but the context width is large (spans many files), so it is not pure Exec.

---

## Tier-A Tasks (Tasks 14-19)

### Task 14: Design a new authentication system supporting OAuth2 + JWT + MFA

**Task Design**: Design a new authentication system supporting: (1) OAuth2 third-party login (Google, GitHub), (2) JWT access/refresh tokens, (3) TOTP multi-factor authentication. Decisions required: token storage strategy, refresh mechanism, MFA backup code design, session expiration policy.

**Correct Routing**: Tier-A

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 5 |
| Context Width | 4 |
| Risk Weight | 5 |
| Verifiability | 2 |
| Creativity Density | 5 |

**Routing Derivation**: Judgment = 5, Risk = 5, Creativity = 5 → Tier-A (pure architecture design + high risk + high creativity)

---

### Task 15: Evaluate whether to migrate from REST API to GraphQL

**Task Description**: The project currently has 50+ REST API endpoints. Evaluate the feasibility of migrating to GraphQL: is the frontend over-fetching or under-fetching, the learning curve and maintenance cost of GraphQL, compatibility with existing API clients, and a gradual migration strategy (can REST and GraphQL coexist during the transition).

**Correct Routing**: Tier-A

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 5 |
| Context Width | 5 |
| Risk Weight | 4 |
| Verifiability | 2 |
| Creativity Density | 4 |

**Routing Derivation**: Judgment = 5, Risk = 4, Creativity = 4 → Tier-A

---

### Task 16: Design a soft delete mechanism for the database

**Task Design**: Design a soft delete system for the entire database: add a `deleted_at` field to all tables, auto-filter deleted records at the ORM layer, provide an admin interface for recovery, handle foreign key constraints and cascading soft deletes, and maintain audit logs of who deleted what. Need to decide on the boundaries of soft deletion (which tables need it? which don't? why?).

**Correct Routing**: Tier-A

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 5 |
| Context Width | 5 |
| Risk Weight | 4 |
| Verifiability | 3 |
| Creativity Density | 4 |

**Routing Derivation**: Judgment = 5, Creativity = 4 → Tier-A

---

### Task 17: Design an event-driven communication scheme between microservices

**Task Design**: The system has 5 microservices and needs event-driven communication: choose a message queue (RabbitMQ vs Kafka vs Redis Streams), design event schemas, decide on event versioning strategy, handle duplicate consumption and out-of-order delivery, implement dead letter queues and retry mechanisms.

**Correct Routing**: Tier-A

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 5 |
| Context Width | 4 |
| Risk Weight | 4 |
| Verifiability | 2 |
| Creativity Density | 5 |

**Routing Derivation**: Judgment = 5, Risk = 4, Creativity = 5 → Tier-A

---

### Task 18: Review the overall security posture of the project

**Task Description**: Conduct a security review of the entire project: are there vulnerabilities in authentication and authorization (IDOR, CSRF, XSS, SQL injection), is input validation sufficient, do dependencies have known CVEs, is environment variable and secret management secure, do logs leak sensitive information, is API rate limiting in place.

**Correct Routing**: Tier-A

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 5 |
| Context Width | 5 |
| Risk Weight | 5 |
| Verifiability | 2 |
| Creativity Density | 3 |

**Routing Derivation**: Judgment = 5, Risk = 5 → Tier-A

---

### Task 19: Code review of password validation logic in `src/auth/login.ts`

**Task Description**: Review the `validatePassword` function in `src/auth/login.ts`. Check: does the password strength requirement meet OWASP standards (minimum length, uppercase, lowercase, digits, special characters), is there brute-force protection (rate limiting), do error messages leak whether the user exists.

**Correct Routing**: Tier-A

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 4 |
| Context Width | 2 |
| Risk Weight | 4 |
| Verifiability | 3 |
| Creativity Density | 2 |

**Routing Derivation**:
- Judgment Intensity = 4 → triggers Tier-A condition (Judgment ≥ 4)
- Risk Weight = 4 → triggers Tier-A condition (Risk ≥ 4)
- Both independent conditions point to Tier-A, routing result is clear.

**Conservative Routing Principle Demo**:
This task has a misleading feature — there is an existing OWASP checklist to reference, which might make one think "just follow the checklist, no need for Tier-A judgment."

That thinking is wrong. The OWASP checklist tells you "what to check," but it doesn't tell you "in this specific codebase, how high is the risk level for item 3, and how should it be fixed." The latter requires understanding of the code architecture, which is exactly why Judgment Intensity = 4.

Conservative routing principle: having a checklist lowers the knowledge barrier, but does not lower the judgment requirement.
The cost of a security task (Risk = 4) is asymmetric — the cost of underestimating and giving it to Tier-Exec and getting it wrong
far exceeds the extra token cost of overestimating and giving it to Tier-A.

---

## Edge Cases (Tasks 20-21)

### Task 20: Migrate error handling from callback style to async/await

**Task Description**: Approximately 40 functions in the project use callback-style error handling (`function(err, result)`). Migrate them all to `async/await` style. Callers also need to be modified synchronously. All existing tests should still pass.

**Correct Routing**: Tier-Mid

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 3 |
| Context Width | 4 |
| Risk Weight | 3 |
| Verifiability | 4 |
| Creativity Density | 1 |

**Routing Derivation**: Context = 4, Judgment = 3, Risk = 3, Verifiability = 4. Does not satisfy Exec (Context > 2, Judgment > 2), does not satisfy Tier-A (Judgment < 4, Risk < 4, Creativity < 4) → Tier-Mid

**Counter-intuitive point**: This task looks like a "mechanical operation" (syntax change), but the context width is large (40 functions + their callers), and the callback→async change may alter error propagation behavior (need to judge whether each change is safe). So it is not pure Exec.

**Why it is easy to misjudge**: Looking only at the operation type (syntax transformation) might make one think it is Exec, but in reality it requires understanding the error propagation path of each function.

---

### Task 21: Add a new `/health` API endpoint returning service status

**Task Description**: Add a `GET /health` endpoint that returns JSON: `{ status: "ok", uptime: number, timestamp: string }`. Checks required: should this endpoint run before the authentication middleware (yes, health checks don't require auth), should it log (yes, but at debug level), does it need rate limiting (no, because the returned information is minimal and simple).

**Correct Routing**: Tier-Exec

**Scoring**:
| Dimension | Score |
|-----------|-------|
| Judgment Intensity | 2 |
| Context Width | 2 |
| Risk Weight | 1 |
| Verifiability | 4 |
| Creativity Density | 1 |

**Routing Derivation**: Judgment ≤ 2 AND Context ≤ 2 AND Verifiability ≥ 4 → Tier-Exec

**Counter-intuitive point**: The task description includes the results of architectural judgment ("should it run before the authentication middleware"), which are decisions already made by Tier-A. Exec only needs to follow those decisions. If the task description were just "add /health endpoint" (without specifying these design decisions), it would need Tier-Mid to make those judgments.

**Why it is easy to misjudge**: If the task description does not include design decisions, the scoring Judgment Intensity would rise to 3-4, and the routing result would become Tier-Mid or Tier-A. The key is whether the task description already includes the decisions.

---

## Test Suite Coverage Analysis

| Routing Result | Task Count | Coverage |
|----------------|------------|----------|
| Tier-Exec | 7 (Tasks 1-7) | 33% |
| Tier-Mid | 6 (Tasks 8-13) | 29% |
| Tier-A | 6 (Tasks 14-19) | 29% |
| Edge Cases | 2 (Tasks 20-21) | 10% |

**Consistency Validation Method**:
1. Look at the task description only, not the "Correct Routing"
2. Score using `scoring-guide.md`
3. Route using `routing-rules.md`
4. Compare the result against the "Correct Routing" for consistency
5. Target: ≥ 80% consistency rate (16/20)

---

*Phase 1 completed 2026-05-02*
