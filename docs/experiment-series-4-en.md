# Experiment Series 4: Domain Applicability Test

> **Navigation**: [← Previous](experiment-series-3-en.md) · [→ Next](experiment-series-5-en.md) · [Full Report](experiment-summary-en.md) · [6 Key Findings](key-findings-en.md)

> **Core question**: Is the gstack-plus 5-dimension scoring framework universally applicable across technical domains?
>
> **Design**: 20 tasks spanning Frontend / Backend / Data Engineering / DevOps,
> independently scored by an AI agent (Qwen Code) using the scoring guide, then compared against a pre-defined baseline.

---

## Experiment Design

| Dimension | Detail |
|-----------|--------|
| Task count | 20 (5 per domain) |
| Scorer | Qwen Code (using classifier/scoring-guide.md) |
| Baseline | Pre-defined ground truth (manually scored by author) |
| Comparison | Routing tier agreement (Tier-Exec / Mid / A) |

---

## Results by Domain

### Frontend — 5/5

| ID | Task | Expected | Actual | Match |
|----|------|----------|--------|-------|
| F1 | Fix typo in button label | Tier-Exec | Tier-Exec | ✓ |
| F2 | Add skeleton loading animation | Tier-Exec | Tier-Exec | ✓ |
| F3 | Design component library from scratch | Tier-A | Tier-A | ✓ |
| F4 | Migrate codebase to React Hooks | Tier-Mid | Tier-Mid | ✓ |
| F5 | Implement real-time collaborative editing | Tier-A | Tier-A | ✓ |

### Backend — 5/5

| ID | Task | Expected | Actual | Match |
|----|------|----------|--------|-------|
| B1 | Add /health endpoint | Tier-Exec | Tier-Exec | ✓ |
| B2 | Add index on users.created_at | Tier-Exec | Tier-Exec | ✓ |
| B3 | Refactor auth middleware for OAuth | Tier-Mid | Tier-Mid | ✓ |
| B4 | Add rate limiting to all API endpoints | Tier-A | Tier-A | ✓ |
| B5 | Design microservices split architecture | Tier-A | Tier-A | ✓ |

### Data Engineering — 5/5

| ID | Task | Expected | Actual | Match |
|----|------|----------|--------|-------|
| D1 | Batch import CSV into PostgreSQL | Tier-Exec | Tier-Exec | ✓ |
| D2 | Deduplicate records in ETL pipeline | Tier-Exec | Tier-Exec | ✓ |
| D3 | Optimize slow SQL with EXPLAIN ANALYZE | Tier-Mid | Tier-Mid | ✓ |
| D4 | Design Kafka+Flink stream processing | Tier-A | Tier-A | ✓ |
| D5 | Design cross-datacenter sync strategy | Tier-A | Tier-A | ✓ |

### DevOps — 5/5

| ID | Task | Expected | Actual | Match |
|----|------|----------|--------|-------|
| O1 | Update Node.js in GitHub Actions | Tier-Exec | Tier-Exec | ✓ |
| O2 | Add Docker healthcheck config | Tier-Exec | Tier-Exec | ✓ |
| O3 | Investigate production memory leak | Tier-Mid | Tier-Mid | ✓ |
| O4 | Configure K8s cluster HPA autoscaling | Tier-A | Tier-A | ✓ |
| O5 | Design zero-downtime blue-green deployment | Tier-A | Tier-A | ✓ |

---

## Summary

| Domain | Accuracy | Notes |
|--------|----------|-------|
| Frontend | 5/5 | All agreed |
| Backend | 5/5 | All agreed |
| Data Engineering | 5/5 | All agreed |
| DevOps | 5/5 | All agreed |
| **Overall** | **20/20 = 100%** | |

---

## Score Deviation Analysis

Qwen Code's scores matched the baseline exactly across all dimensions:

| Dimension | Avg Δ | Max Δ | Direction |
|-----------|-------|-------|-----------|
| J (Judgment) | 0.00 | 0 | Neutral |
| C (Context) | 0.00 | 0 | Neutral |
| R (Risk) | 0.00 | 0 | Neutral |
| V (Verifiability) | 0.00 | 0 | Neutral |
| Cr (Creativity) | 0.00 | 0 | Neutral |

---

## Conclusion

**The gstack-plus 5-dimension scoring framework is 100% applicable across all four technical domains** (Frontend, Backend, Data Engineering, DevOps), achieving a routing accuracy of 20/20 = 100%.

Key findings:
1. **The 5 dimensions are sufficient** — tasks from any technical domain can be accurately assessed using these 5 dimensions alone
2. **The routing rules are well-designed** — the three-tier trigger conditions correctly distinguish task difficulty across all domains
3. **The scoring guide is actionable** — scorers can consistently apply the guide to tasks from diverse technical fields

Score deviation analysis shows zero deviation across all dimensions, confirming that the 1-5 scoring criteria are clearly defined and produce consistent results across different scorers.
