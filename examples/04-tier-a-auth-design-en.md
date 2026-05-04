---
title: Tier-A — Design SSO + MFA Authentication Flow
tier: Tier-A
scores: { judgment: 5, context: 4, risk: 5, verifiability: 2, creativity: 4 }
---

# Tier-A Example: Design SSO + MFA Authentication for SaaS

## Task Description

> We need to support Google / GitHub SSO and enforce MFA for admin accounts. Design the complete authentication flow, token structure, and compatibility with the existing session system.

## 5-Dimension Scoring Rationale

| Dimension | Score | Why |
|-----------|-------|-----|
| Judgment | 5 | Multiple trade-offs: OAuth flow choice (implicit vs PKCE), token storage (cookie vs localStorage), etc. |
| Context Width | 4 | Spans auth, session, user model, frontend, SDK |
| Risk | 5 | Authentication design error = security vulnerability |
| Verifiability | 2 | Design document cannot be verified by commands, requires review |
| Creativity Density | 4 | Many existing solutions but need context-specific trade-offs for this SaaS |

## Routing Decision

`judgment=5 ≥ 4` ∨ `risk=5 ≥ 4` ∨ `creativity=4 ≥ 4` → **Tier-A**

All three conditions **independently trigger** Tier-A, routing is very certain.

## Why This Task Cannot Be Given to Tier-Mid

- Tier-Mid excels at "executing details under an established plan," but the SSO + MFA plan itself needs to be designed first
- Risk = 5 triggers the conservative routing principle: better to pay more for Tier-A than make a design mistake and step on a landmine
- Verifiability = 2 means even if Tier-Mid does it, Tier-A still needs to spend time reviewing — better to let Tier-A design it from the start
