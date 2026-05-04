# Quality Review — gstack-plus Mode A vs Mode B

> **打分說明**：每個任務對兩個模型的輸出分別評分。
> 評分維度：**有用性 1–5**（1=幾乎沒用，5=直接可用）、**正確性 Pass/Fail**。
> 填完後把這個文件回報給 Claude 進行最終分析。

---

## T1 — Rename function across repo

**任務 prompt：**

```
You are a senior engineer. Give me the exact shell command(s) to rename all occurrences of the function name `getCwd` to `getWorkingDir` across all TypeScript files under ./src using sed or a Node.js one-liner. Show only the command, no explanation.
```

**預期 Tier：** Tier-Exec

---

### Mode A — anthropic/claude-opus-4.7 (234 tokens, $0.01173)

```bash
find ./src -type f -name "*.ts" -exec sed -i 's/\bgetCwd\b/getWorkingDir/g' {} +
```

On macOS (BSD sed):

```bash
find ./src -type f -name "*.ts" -exec sed -i '' 's/[[:<:]]getCwd[[:>:]]/getWorkingDir/g' {} +
```

**Mode A 評分（你來填）：**
- 有用性：__ / 5
- 正確性：Pass / Fail
- 備註：

---

### Mode B — qwen3-coder-plus (118 tokens, $0.00014)

```bash
find ./src -name "*.ts" -exec sed -i 's/getCwd/getWorkingDir/g' {} +
```

```bash
npx replace-in-file "getCwd" "getWorkingDir" "./src/**/*.ts"
```

**Mode B 評分（你來填）：**
- 有用性：__ / 5
- 正確性：Pass / Fail
- 備註：

---

## T2 — Refactor data layer to React Query

**任務 prompt：**

```
You are a senior React engineer. Create a concise refactoring plan to migrate a React app's data fetching from raw fetch() calls to React Query v5. Cover: (1) key code changes required, (2) recommended migration order, (3) top 3 risks and how to mitigate them. Keep the total response under 400 words.
```

**預期 Tier：** Tier-Mid

---

### Mode A — anthropic/claude-opus-4.7 (1137 tokens, $0.07849)

# React Query v5 Migration Plan

## 1. Key Code Changes

**Setup**
- Install `@tanstack/react-query` and `@tanstack/react-query-devtools`
- Wrap app root with `QueryClientProvider` and a shared `QueryClient` (configure default `staleTime`, `retry`, `gcTime`)
- Add Devtools in development

**Replace fetch patterns**
- Convert `useEffect + fetch + useState` blocks into `useQuery({ queryKey, queryFn })`
- Centralize fetch functions in an `api/` layer (pure async functions returning typed data; throw on non-2xx)
- Replace mutations (POST/PUT/DELETE) with `useMutation`, using `queryClient.invalidateQueries` in `onSuccess`
- Adopt v5-specific changes: object-form signatures only, `isPending` (not `isLoading`), `throwOnError` replaces `useErrorBoundary`, `gcTime` replaces `cacheTime`
- Standardize query keys (e.g., `['users', id]`) — consider a `queryKeys` factory
- Remove manual loading/error state, AbortControllers, and custom caches

## 2. Migration Order

1. **Foundation**: Install, configure `QueryClient`, add provider + devtools, build `api/` layer with typed fetchers
2. **Leaf reads first**: Migrate simple, isolated GET requests (e.g., lists, detail pages) to `useQuery`
3. **Shared/derived reads**: Migrate queries used across multiple components; introduce query key factory
4. **Mutations**: Convert writes to `useMutation` with targeted invalidations; add optimistic updates where valuable
5. **Advanced patterns**: Pagination (`useInfiniteQuery`), prefetching on route/hover, `suspense` mode if desired
6. **Cleanup**: Delete obsolete global state (Redux/context caches), custom hooks, and loading reducers

## 3. Top Risks & Mitigations

**Risk 1 — Cache invalidation gaps**
Manual refetching gets replaced by invalidation; missing a key causes stale UI.
*Mitigation*: Use a typed query key factory; write integration tests for mutation→refetch flows; default `staleTime: 0` initially, tune later.

**Risk 2 — Behavioral drift from defaults**
React Query's refetch-on-focus, retries, and background refetch can surprise users or hit rate limits.
*Mitigation*: Set conservative global defaults (`refetchOnWindowFocus: false`, `retry: 1`) during migration; relax per-query once validated. Monitor network traffic in staging.

**Risk 3 — Error handling regressions**
Existing code may rely on fetch returning non-throwing responses or custom error shapes.
*Mitigation*: Normalize errors in the `api/` layer (always `throw` on failure with a typed `ApiError`); define a global `QueryCache` `onError` handler; add an error boundary

**Mode A 評分（你來填）：**
- 有用性：__ / 5
- 正確性：Pass / Fail
- 備註：

---

### Mode B — anthropic/claude-sonnet-4-6 (862 tokens, $0.01191)

# React Query v5 Migration Plan

## 1. Key Code Changes Required

**Setup**
```tsx
// Add QueryClient provider at app root
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 } }
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

**Replace fetch() calls with useQuery**
```tsx
// BEFORE
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(() => {
  fetch('/api/users').then(r => r.json()).then(setData).finally(() => setLoading(false));
}, []);

// AFTER (v5 syntax — object signature required)
const { data, isPending, isError } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(r => r.json()),
});
```

**Mutations**
```tsx
const mutation = useMutation({
  mutationFn: (newUser) => fetch('/api/users', { method: 'POST', body: JSON.stringify(newUser) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
});
```

---

## 2. Recommended Migration Order

| Phase | Action |
|-------|--------|
| **1 — Foundation** | Install `@tanstack/react-query`, add `QueryClientProvider`, install Devtools |
| **2 — Extract** | Move all `fetch` logic into dedicated `api/` service functions |
| **3 — Leaf components first** | Migrate simple, isolated components with no shared state |
| **4 — Shared/global data** | Migrate shared data (user session, config) using consistent `queryKey` conventions |
| **5 — Mutations** | Replace POST/PUT/DELETE handlers with `useMutation` + cache invalidation |
| **6 — Cleanup** | Remove redundant `useState`/`useEffect` pairs and old loading states |

---

## 3. Top 3 Risks & Mitigations

**① Cache Staleness Surprises**
Data may appear "stale" and refetch unexpectedly, breaking UX.
→ **Mitigate:** Set explicit `staleTime` per query; audit background-refetch triggers (`refetchOnWindowFocus`, `refetchOnMount`).

**② queryKey Collisions / Cache Pollution**
Inconsistent keys cause wrong data to be shared or invalidated.
→ **Mitigate:** Define a centralized `queryKeys` factory object used everywhere; enforce via code review.

**③ v5 Breaking API Changes**
v5 dropped the positional argument overloads (callbacks in `useQuery`, `isLoading` renamed to `isPending`).
→ **Mitigate:** Run the official [v5 codemod](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5), add TypeScript strict mode to catch mismatches early, and migrate one module at a time rather than all at once.

**Mode B 評分（你來填）：**
- 有用性：__ / 5
- 正確性：Pass / Fail
- 備註：

---

## T3 — Design SSO + MFA auth architecture

**任務 prompt：**

```
You are a security architect. Design the complete authentication system for a B2B SaaS app that requires SAML SSO and TOTP-based MFA. Cover: (1) technology stack choices with rationale, (2) data model for sessions and MFA state, (3) top 3 security edge cases and mitigations, (4) implementation phases. Be specific and opinionated — avoid vague recommendations.
```

**預期 Tier：** Tier-A

---

### Mode A — anthropic/claude-opus-4.7 (1161 tokens, $0.07885)

# Authentication System Design: B2B SaaS with SAML SSO + TOTP MFA

## 1. Technology Stack

**Identity Layer: Ory Kratos + Ory Hydra** (self-hosted)
- **Why not Auth0/Okta Customer Identity?** B2B SaaS cost scales brutally per MAU; Ory is open-source, Go-based, horizontally scalable, and gives you full control over the session model. Auth0 hits ~$0.03/MAU at scale; Ory infra costs ~10% of that.
- **Why not build from scratch?** SAML is a standards minefield (XML signature wrapping, canonicalization). Don't write it yourself.
- **Why Kratos + Hydra split?** Kratos handles user identity/login flows; Hydra handles OAuth2/OIDC for issuing tokens to your own API and downstream services. Clean separation.

**SAML Library: `crewjam/saml` (Go)** behind Kratos via a custom login UI
- Battle-tested, handles SP-initiated and IdP-initiated flows, supports metadata URL refresh.
- Alternative if you're on Node: `node-saml/passport-saml`. Avoid `samlify` (historical signature bypass CVEs).

**TOTP: `pquerna/otp`** (Go) — RFC 6238, 30-second window, SHA-1 (for Google Authenticator compat), 6 digits.
- Store secrets encrypted with envelope encryption (AWS KMS or Vault Transit).

**Session Store: Redis Cluster** with `SETEX` keyed sessions + **PostgreSQL** for durable session metadata (audit trail).
- Redis for hot path (p99 < 2ms); Postgres for revocation lists and forensics.

**Token Format:** Opaque session tokens (256-bit random, base64url) for browser sessions. **JWTs only for service-to-service**, signed with rotating ES256 keys (JWKS endpoint). 
- **Why opaque for users?** Instant revocation. JWT revocation in B2B is a nightmare — admins fire employees and expect sessions killed *now*.

**Transport:** HTTP-only, Secure, SameSite=Lax cookies. Separate `__Host-` prefixed cookie for session ID.

---

## 2. Data Model

```sql
-- Tenants (B2B core)
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  saml_enforced BOOLEAN DEFAULT false,
  mfa_required BOOLEAN DEFAULT false,
  mfa_grace_period_days INT DEFAULT 7
);

-- SAML config per tenant
CREATE TABLE saml_connections (
  tenant_id UUID REFERENCES tenants(id),
  idp_metadata_url TEXT,
  idp_entity_id TEXT NOT NULL,
  idp_sso_url TEXT NOT NULL

**Mode A 評分（你來填）：**
- 有用性：__ / 5
- 正確性：Pass / Fail
- 備註：

---

### Mode B — anthropic/claude-opus-4.7 (1161 tokens, $0.07885)

# Authentication System Design: B2B SaaS with SAML SSO + TOTP MFA

## 1. Technology Stack

**Identity Provider Layer: Ory Kratos + Ory Hydra (self-hosted)**
- **Rationale**: Auth0/Okta hit $23k+/year fast at B2B scale, and every enterprise tenant wants their own SAML config. Kratos handles identity/credentials; Hydra handles OAuth2/OIDC issuance. Self-hosted means no per-MAU pricing death spiral.
- **Alternative rejected**: WorkOS is excellent for SAML-only but locks you in; building TOTP on top requires separate infra anyway.

**SAML Handling: `samlify` (Node) or `python3-saml` (Python), behind WorkOS-style abstraction**
- Don't write SAML from scratch. Ever. XML signature wrapping attacks are real and `samlify` has been audited.
- Wrap it in your own `SSOConnection` service so you can swap libraries.

**TOTP: `otplib` / `pyotp`, HMAC-SHA1, 30s window, 6 digits (RFC 6238 defaults)**
- Use SHA-1 for TOTP despite its reputation — this is HMAC-SHA1, not raw SHA-1, and universal authenticator app compatibility matters more than theoretical margin. Google Authenticator still doesn't support SHA-256 reliably.

**Session Storage: Redis (hot) + Postgres (audit trail)**
- Redis with key `session:{id}` for active lookups (p99 < 2ms).
- Postgres `session_events` for compliance/SOC2 audit.

**Token Format: Opaque session IDs (256-bit random), NOT JWTs**
- JWTs cannot be revoked without a denylist (which defeats the point). For B2B where admins need to kick users, opaque tokens + Redis lookup is the correct call. Reserve JWTs for service-to-service.

**Framework-agnostic middleware**: Express/FastAPI middleware that validates session → loads tenant → enforces MFA requirement per-tenant policy.

---

## 2. Data Model

```sql
-- Tenants configure their own SSO + MFA policy
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE,
  mfa_policy TEXT CHECK (mfa_policy IN ('disabled','optional','required','required_except_sso')),
  sso_enforced BOOLEAN DEFAULT false,  -- blocks password login when true
  session_max_age_seconds INT DEFAULT 28800,      -- 8h
  session_idle_timeout_seconds INT DEFAULT 3600   -- 1h
);

CREATE TABLE sso_connections (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  idp_entity_id TEXT NOT NULL,
  idp_sso

**Mode B 評分（你來填）：**
- 有用性：__ / 5
- 正確性：Pass / Fail
- 備註：

---

## 總結（你來填）

| 任務 | Mode A 有用性 | Mode B 有用性 | 勝者 |
|------|-------------|-------------|------|
| T1 Rename function across repo | __ / 5 | __ / 5 | A / B / 持平 |
| T2 Refactor data layer to React Query | __ / 5 | __ / 5 | A / B / 持平 |
| T3 Design SSO + MFA auth architecture | __ / 5 | __ / 5 | A / B / 持平 |
