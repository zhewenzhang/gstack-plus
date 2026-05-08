# Design Spec: gstack+ Technical Paper (Bilingual PDF)

**Date:** 2026-05-08  
**Status:** Approved  

---

## Context

gstack+ has accumulated 8 experiment series, quantified findings, and a well-documented system design. The goal is to produce two academic-style technical papers that serve as downloadable technical artifacts on the website — one in English (with Chinese abstract), one in Chinese (with English abstract).

Big-company products attach papers like this to build credibility and enable citation. This is the same motivation here.

---

## Paper Identity

**Title (EN):** gstack+: A Three-Tier LLM Orchestration Framework for Cost-Efficient AI Development  
**Title (ZH):** gstack+：面向成本效率的三层大语言模型编排框架

**Style:** Academic (system design + experimental validation), similar to SOSP/NSDI systems papers  
**Tone:** Rigorous but accessible; data-driven; design logic emphasized over implementation details

---

## Paper Structure (Both Versions)

```
Abstract          — Cross-language (EN paper gets ZH abstract; ZH paper gets EN abstract)
1. Introduction   — LLM cost is an engineering bottleneck; gstack+ approach
2. Related Work   — Single-model limits, manual collaboration, existing orchestration tools
3. System Design  — ★ Core contribution
   3.1 Design Motivation & Core Hypothesis
   3.2 Five-Dimension Scoring (J/C/R/V/Cr)
   3.3 Three-Tier Routing Rules & Boundary Handling
   3.4 Handoff Protocol Design
4. Experiments    — 8-series methodology overview
5. Results        — Quantified findings (-46% cost, 100% accuracy, quality parity)
6. Discussion     — Limitations, applicability boundaries, future work
7. Conclusion
8. References
```

**Target length:** ~6,000 words (EN) / ~10,000 characters (ZH)  
**Estimated pages:** 8–12 pages per version

---

## Content Sources

| Section | Primary Source Files |
|---------|---------------------|
| §1 Introduction | `docs/strategy.md`, `README.md` |
| §2 Related Work | `docs/gstack-vs-superpowers.md`, `YC_BLINDSPOTS.md` |
| §3 System Design | `docs/architecture.md`, `docs/routing-confidence-guide.md`, `docs/cost-model.md` |
| §4 Experiments | `experiments/methodology.md`, `experiments/task-definitions.md` |
| §5 Results | `docs/key-findings.md`, `docs/experiment-summary.md`, all `experiments/series-*/results.json` |
| §6 Discussion | `experiments/failure-scenarios.md`, `PROJECT_ROADMAP.md` |

---

## PDF Generation Pipeline

**Toolchain:** Gemini CLI → Typst → PDF

```
Step 1: Claude installs Typst (Windows binary)
Step 2: Claude reads all source docs → structured context in GEMINI_PAPER.md
Step 3: Gemini writes paper-en.typ (EN body + ZH abstract)
Step 4: Gemini writes paper-zh.typ (ZH body + EN abstract)
Step 5: Gemini runs: typst compile paper-en.typ && typst compile paper-zh.typ
Step 6: Claude verifies PDFs exist and have reasonable page count
Step 7: Qwen adds download button to website + commit + push
```

**Output paths:**
```
D:\gstack-plus\site\public\papers\gstack-plus-en.pdf
D:\gstack-plus\site\public\papers\gstack-plus-zh.pdf
```

**Typst version:** latest stable binary from GitHub releases (typst/typst)

---

## Website Integration

- Add download section to Results page (or Homepage)
- Two buttons: "Download EN Paper (PDF)" + "下载中文版论文 (PDF)"
- Link to: `/papers/gstack-plus-en.pdf` and `/papers/gstack-plus-zh.pdf`
- Executed by Qwen after PDFs are confirmed

---

## Division of Labor

| Agent | Responsibility |
|-------|---------------|
| **Claude** | Install Typst, gather source content, write Gemini task file, verify PDFs, coordinate |
| **Gemini** | Write complete Typst source for both papers, compile PDFs |
| **Qwen** | Add download UI to website, git add/commit/push |

---

## Acceptance Criteria

- [ ] `site/public/papers/gstack-plus-en.pdf` exists, ≥6 pages
- [ ] `site/public/papers/gstack-plus-zh.pdf` exists, ≥6 pages
- [ ] EN paper has Chinese abstract section
- [ ] ZH paper has English abstract section
- [ ] Both papers have all 8 sections
- [ ] Download buttons visible on deployed website
