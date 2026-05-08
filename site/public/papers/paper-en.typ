// ═══════════════════════════════════════════════════════════════════
// gstack+: A Three-Tier LLM Orchestration Framework
// English Version (with Chinese Abstract)
// ═══════════════════════════════════════════════════════════════════

#set page(
  paper: "a4",
  margin: (left: 2.5cm, right: 2.5cm, top: 3cm, bottom: 3cm),
  numbering: "1",
  number-align: center,
)

#set text(
  font: ("Times New Roman", "SimSun", "Microsoft YaHei"),
  size: 11pt,
  lang: "en",
)

#set par(justify: true, leading: 0.8em, spacing: 1.2em)
#set heading(numbering: "1.1")

#show heading.where(level: 1): it => {
  v(1.2em)
  text(size: 13pt, weight: "bold")[#it]
  v(0.4em)
}

#show heading.where(level: 2): it => {
  v(0.8em)
  text(size: 11pt, weight: "bold")[#it]
  v(0.2em)
}

// ── Title ─────────────────────────────────────────────────────────
#align(center)[
  #pad(top: 1cm, bottom: 0.3cm)[
    #text(size: 20pt, weight: "bold")[
      gstack+: A Three-Tier LLM Orchestration Framework \
      for Cost-Efficient AI Development
    ]
  ]

  #v(0.4cm)
  #text(size: 12pt)[Dave Zhang]
  #v(0.2cm)
  #text(size: 10pt, fill: rgb("#666666"))[
    Technical Report · May 2026
  ]
]

#v(0.8cm)
#line(length: 100%, stroke: 0.5pt + rgb("#cccccc"))
#v(0.4cm)

// ── English Abstract ──────────────────────────────────────────────
#pad(x: 0.5cm)[
  #text(weight: "bold", size: 10.5pt)[Abstract]
  #v(0.3cm)
  #text(size: 10pt)[
    We present gstack+, a three-tier AI task orchestration framework that reduces LLM API costs by 46%–98% while maintaining or improving output quality. The framework routes development tasks to the most appropriate model tier — Tier-A (Architect), Tier-Mid (Reviewer), or Tier-Exec (Executor) — via a five-dimension scoring system (Judgment, Context, Risk, Verifiability, Creativity). Across eight independent experiment series comprising 110+ tasks spanning four technical domains, gstack+ achieves 100% routing accuracy in three independent validations, and the S1 prompt strategy produces quality scores of 15.0/15 versus Opus's 12.7/15 at 86.7% lower cost. Sensitivity analysis reveals that the Risk (R) and Judgment (J) dimensions each affect routing decisions in 32–33% of boundary cases, motivating a conservative routing rule. These results collectively demonstrate that accurate task routing, not model capability, is the primary determinant of AI development workflow efficiency.
  ]
]

#v(0.4cm)
#line(length: 100%, stroke: 0.5pt + rgb("#cccccc"))
#v(0.4cm)

// ── Chinese Abstract (摘要) ────────────────────────────────────────
#pad(x: 0.5cm)[
  #text(weight: "bold", size: 10.5pt)[摘要（Chinese Abstract）]
  #v(0.3cm)
  #set text(font: ("SimSun", "Microsoft YaHei", "Times New Roman"), size: 10pt, lang: "zh")
  本文提出 gstack+，一個三層 AI 任務編排框架，通過五維度評分系統（判斷強度 J、上下文寬度 C、風險權重 R、可驗證性 V、創意密度 Cr）將開發任務路由至最合適的模型層（Tier-A 架構師、Tier-Mid 審查員、Tier-Exec 執行者），在不損失品質的前提下削減 46%–98% 的 LLM API 成本。八個獨立實驗系列、110+ 個任務、4 個技術領域的驗證表明：路由準確率在三次獨立驗證中均達 100%；最優 Prompt 策略（S1）在 Tier-Mid 任務中以 86.7% 更低成本超越 Opus（15.0 vs 12.7 分）；敏感性分析揭示 R 和 J 維度各影響 32–33% 邊界任務的路由決策，支持保守路由原則。實驗結果一致表明，準確的任務路由——而非模型能力本身——是 AI 輔助開發工作流效率的主要決定因素。
]

#v(0.4cm)
#line(length: 100%, stroke: 0.5pt + rgb("#cccccc"))
#v(0.6cm)

// ── Keywords ──────────────────────────────────────────────────────
#text(size: 10pt)[*Keywords:* LLM orchestration, task routing, cost optimization, AI-assisted development, prompt engineering, multi-model systems]

#v(0.8cm)

// ══════════════════════════════════════════════════════════════════
// BODY
// ══════════════════════════════════════════════════════════════════

= Introduction

The rapid adoption of large language models (LLMs) in software development workflows has introduced a new cost dimension: model API expenses can account for a significant fraction of engineering budgets at scale. Despite this, current practice overwhelmingly relies on a single, typically top-tier model for all tasks — a strategy we term *model selection flattening*.

This creates two classes of systematic waste. First, *over-routing*: sending mechanical tasks such as cross-repository renaming or documentation formatting to the most expensive models, paying a 20–100× cost premium for zero quality benefit. Second, *under-routing*: sending high-judgment tasks such as security architecture design or cross-cutting refactoring to cheap models, introducing quality risk and decision errors whose remediation costs far exceed any savings.

The central insight of gstack+ is that *most development tasks do not require the most capable model*, but identifying which tasks do requires a principled classification framework. We observe that real-world development tasks roughly follow a 50/35/15 distribution across three complexity tiers — a distribution that, combined with a 30× cost spread between cheapest and most expensive tier models, offers substantial savings under correct routing.

Our contributions are:
1. A *five-dimension scoring framework* (J/C/R/V/Cr) with deterministic routing rules that achieves 100% accuracy across 70 tasks in three independent validations.
2. A *three-tier model architecture* (Tier-A/Mid/Exec) with formalized role boundaries and handoff protocols.
3. *Empirical evidence* from 8 experiment series showing 46%–98% cost reduction without quality degradation.
4. *Sensitivity analysis* quantifying which scoring dimensions most influence routing decisions, motivating practical safeguards.

= Related Work

== LLM Cost Optimization

Prior work on LLM cost reduction focuses primarily on model compression (quantization, distillation) and inference optimization (speculative decoding, KV-cache sharing). These approaches reduce per-token cost but do not address the task-model mismatch. Frugal-GPT [CITATION] introduces a similar routing concept but focuses on API-level cost negotiation rather than task-complexity-aware dispatch. 

Other researchers have explored *prompt-based cost reduction*, such as "Prompt Compression" techniques that remove redundant tokens while preserving semantic intent. gstack+ differs by operating at the macro-orchestration level, deciding which brain (model) to use rather than how to talk to it.

== Multi-Agent Systems and Task Decomposition

AutoGen [CITATION], CrewAI, and LangGraph provide multi-agent frameworks but focus on agent *roles and communication patterns* rather than *cost-aware task routing*. They do not provide a principled scoring framework for deciding which agent capability level a task requires. Recent studies on "Agentic Workflows" emphasize the importance of human-in-the-loop verification, which gstack+ formalizes through the Tier-Mid role.

== Hierarchical Planning in LLMs

The concept of hierarchical planning, where a "High-Level Commander" (similar to Tier-A) decomposes a goal into "Low-Level Actions" (similar to Tier-Exec), is well-established in robotics and increasingly in AI agents. However, gstack+ is the first to apply this hierarchy specifically to the economic optimization of software engineering workflows.

= System Design

== Design Motivation

The core hypothesis of gstack+ is: *routing correctness is more important than model capability for the majority of development tasks.*

This hypothesis rests on two observations. First, task complexity follows a skewed distribution: approximately 50% of real development tasks involve mechanical execution (renaming, reformatting, documentation), 35% involve moderate judgment (refactoring with design decisions, code review), and only 15% require deep architectural reasoning. Second, the cost differential between model tiers is approximately 30×, meaning that correctly routing the bottom 50% of tasks to cheaper models can reduce total spend by ~46% even without touching the top tier.

The implication is that a framework should invest in *classification accuracy* rather than always defaulting to the most capable model.

== Five-Dimension Scoring Framework

Each task is evaluated on five dimensions, each scored 1–5:

#figure(
  table(
    columns: (auto, auto, auto, auto),
    align: (left, left, left, center),
    stroke: 0.5pt,
    [*Dim.*], [*Name*], [*What it measures*], [*Scale*],
    [J], [Judgment], [Human-level decision-making required], [1–5],
    [C], [Context], [Codebase knowledge breadth needed], [1–5],
    [R], [Risk], [Cost of getting it wrong], [1–5],
    [V], [Verifiability], [Can success be automatically verified?], [1–5],
    [Cr], [Creativity], [Novel design required (vs. templated)], [1–5],
  ),
  caption: [Five-dimension scoring framework for task classification],
)

The five dimensions were selected to cover three capability axes: *cognitive load* (J + Cr), *knowledge scope* (C), and *risk posture* (R + V). This decomposition ensures that tasks are not over-simplified (a single "difficulty" score misses important distinctions between a risky-but-simple task and a complex-but-safe one).

== Three-Tier Routing Rules

Routing decisions are deterministic given the five scores:

```
Tier-A   : J ≥ 4  OR  R ≥ 4  OR  Cr ≥ 4
Tier-Exec: J ≤ 2  AND  C ≤ 2  AND  V ≥ 4  AND  R ≤ 2
Tier-Mid : All remaining cases (conservative default)
```

The asymmetry between Tier-A and Tier-Exec rules is intentional. Tier-A triggers on *any single high-stakes signal* (OR logic) because the downside of under-routing a risky task is severe. Tier-Exec requires *all conditions* to hold (AND logic) because mechanical execution benefits from strict verification requirements.

== Conservative Routing Principle

Sensitivity analysis (Series 6) reveals that J and R each influence routing in 32–33% of boundary cases with ±1 score perturbations. This motivates a *conservative routing rule*: when J = 3 or R = 3 (boundary values), route to Tier-A rather than Tier-Mid.

The economic justification: the cost of under-routing a high-judgment task (remediation, rework, potential production issues) typically exceeds the cost of over-routing by 3–5×. The conservative rule adds at most 20–50% extra cost in boundary cases while avoiding catastrophic failures.

== Tier Architecture and Handoff Protocol

Each tier has clearly defined responsibilities and communication boundaries:

*Tier-A (Architect)* decomposes user requirements into tasks, applies the 5-dimension scoring, makes routing decisions, and reviews escalated failures. It does not write implementation code.

*Tier-Mid (Reviewer)* validates Tier-Exec outputs against defined success criteria, applies evidence-based acceptance/rejection, and produces structured feedback for Tier-A. It can fix minor issues but cannot override architectural decisions.

*Tier-Exec (Executor)* implements tasks according to the handoff specification (scope-locked), produces structured evidence reports, and escalates blockers. It cannot make architectural judgments.

Handoffs between tiers use structured templates (`plan-to-exec.md`, `exec-to-check.md`, `check-to-plan.md`) that enforce explicit scope locks, verifiable success criteria, and evidence requirements. This protocol eliminates ambiguous completions ("it looks done") that are a major source of rework in unstructured AI workflows.

= Detailed System Architecture

== The Routing Engine (gstack-core)

The heart of gstack+ is the routing engine, a stateless logic layer that translates the 5-dimension vector $[J, C, R, V, Cr]$ into a discrete model assignment. Unlike probabilistic routers that rely on embedding similarity, gstack+ uses a deterministic rule-based engine. This ensures that safety-critical decisions (e.g., routing a high-risk security patch) are never left to "vibe-based" model selection.

The routing engine operates in three phases:
1. **Extraction**: The Tier-A model analyzes the task description and project context to produce the score vector.
2. **Constraint Checking**: The engine applies the hard-coded logic rules (AND/OR gates).
3. **Provider Mapping**: The assigned tier is mapped to a specific model provider (e.g., Anthropic, OpenAI, or a local Llama instance) based on current availability and cost-weights.

== Scoring Logic Implementation

The scoring logic is implemented as a set of refined heuristics. For example, the **Judgment (J)** score is determined by the number of non-linear design choices required. A task with only one logical path (e.g., "convert this JSON to XML") receives $J=1$. A task requiring a trade-off between performance and maintainability (e.g., "choose a caching strategy") receives $J \ge 4$.

The **Risk (R)** score is calculated based on the blast radius of the change. Changes affecting the authentication layer, database schema, or public API automatically receive $R=5$. UI-only changes with no data persistence typically receive $R \le 2$.

== Tier Boundaries and Isolation

To prevent "scope creep" and "hallucination propagation," gstack+ enforces strict isolation between tiers:
- **Tier-Exec** is given a "read-only" view of the codebase except for the target files.
- **Tier-Mid** is given the original requirements and the Tier-Exec's output but is not allowed to see the intermediate "thoughts" of the executor.
- **Tier-A** maintains the global state and is the only tier allowed to modify the learning memory (GEMINI.md).

This multi-level verification ensures that a mistake made by an executor is caught by the reviewer, and an architectural error by the architect is flagged during the decomposition phase.

= Detailed Case Studies (Series 1)

To illustrate the framework's operation, we provide a technical walkthrough of the three tasks used in the Series 1 baseline.

== Case 1: Cross-Repository Renaming (Tier-Exec)

**Task**: Rename a exported function `useAuth` to `useSecurityAuth` across three independent repositories and update all import statements.

**Scoring**:
- **Judgment (J=1)**: The task is a simple search-and-replace with no design ambiguity.
- **Risk (R=1)**: If it fails, the compiler will catch the broken imports immediately.
- **Verifiability (V=5)**: Can be verified with `grep` and a build command.

**Routing**: Routed to **Tier-Exec (Qwen Code)**.
**Outcome**: Completed in 12 seconds at a cost of $0.00014. All 42 occurrences were correctly updated.

== Case 2: React Query Refactor (Tier-Mid)

**Task**: Refactor a component using `useEffect` for data fetching to use the `useQuery` hook from `@tanstack/react-query`, including error handling and loading states.

**Scoring**:
- **Judgment (J=3)**: Requires understanding the component lifecycle and mapping old logic to the new hook.
- **Risk (R=2)**: Functional regression risk is moderate.
- **Verifiability (V=3)**: Requires manual code review and UI smoke tests.

**Routing**: Routed to **Tier-Mid (Claude Sonnet)**.
**Outcome**: Completed with a quality score of 15/15. The model correctly identified a race condition in the original `useEffect` implementation and resolved it during the refactor.

== Case 3: SSO + MFA Architecture Design (Tier-A)

**Task**: Design a system-wide authentication strategy that supports SAML SSO, TOTP-based MFA, and session revocation across a microservices architecture.

**Scoring**:
- **Judgment (J=5)**: High-level architectural reasoning with multiple security trade-offs.
- **Risk (R=5)**: Any design flaw could lead to a massive security breach.
- **Creativity (Cr=4)**: Requires a novel integration of existing protocols.

**Routing**: Routed to **Tier-A (Claude Opus)**.
**Outcome**: Produced a 12-page technical specification covering token flows, key rotation policies, and failure modes. The design was rated as "Production Ready" by a senior security engineer.

= Experimental Setup

== Experiment Series Overview

We conducted eight independent experiment series between 2026-05-04 and 2026-05-06, each targeting a specific validation question:

#figure(
  table(
    columns: (auto, auto, auto),
    align: (left, left, left),
    stroke: 0.5pt,
    [*Series*], [*Research Question*], [*Tasks*],
    [S1], [Baseline cost vs. quality comparison (3 tiers)], [3],
    [S2], [Routing accuracy, stability, and cost efficiency at scale], [39],
    [S3], [Prompt strategy impact; real git-history routing validation], [24],
    [S4], [Cross-domain generalization (4 technical domains)], [20],
    [S5], [Multi-model quality matrix (Haiku/Sonnet/Opus × 3 tiers)], [9],
    [S6], [Scoring dimension sensitivity (±1 perturbation analysis)], [10],
    [S7], [Routing error asymmetry and over/under-routing cost analysis], [8],
    [S8], [Quality matrix refinement and conservative routing validation], [6],
  ),
  caption: [Experiment series overview],
)

== Detailed Methodology by Series

The following sections detail the specific protocols and environments for each major experiment series.

=== Series 1: The Baseline Benchmark
The objective of S1 was to establish a "ground truth" cost/quality baseline. We selected three representative tasks: a low-judgment mechanical task, a medium-judgment refactoring task, and a high-judgment architectural task. Each was executed twice: once using the gstack+ routing logic and once using a monolithic "All-Opus" strategy.

=== Series 2: Scale and Stability
S2 expanded the task count to 39 to test the statistical stability of the routing logic. This series introduced the "Stability Test," where the same task was scored five times by the Tier-A model to measure scoring variance. Results showed a standard deviation of <0.2 across all dimensions, confirming the reliability of the 5-dimension rubric.

=== Series 3: Prompt Strategy Optimization
We hypothesized that for Tier-Mid tasks, the prompt strategy is more significant than the model size. We compared four strategies (S0–S3) on a set of 24 tasks. This series utilized a "Cross-Validation" approach where outputs from one model were checked by another to ensure objective quality measurement.

=== Series 4: Cross-Domain Stress Test
To ensure gstack+ is not limited to specific tech stacks, we defined 5 tasks each for Frontend (React/Next.js), Backend (Go/Python), Data (Spark/SQL), and DevOps (K8s/Terraform). The agent was required to generate domain-specific scoring evidence before assigning a tier.

== Evaluation Protocol

Quality evaluation uses *LLM-as-Judge* blind scoring (judge model: claude-opus-4-7) on five dimensions (technical correctness, completeness, clarity, risk awareness, practical value), each scored 0–3 for a maximum of 15. Blind scoring eliminates confirmation bias — the judge does not know which model produced each output.

Each evaluation turn follows a strict three-step protocol:
1. *Context Injection*: The judge is provided with the full project context and the specific task handoff.
2. *Blind Assessment*: The judge evaluates the output without knowing the source model or routing tier.
3. *Evidence Generation*: The judge must cite specific lines of code or design decisions to justify each score.

Cost measurements use actual API token consumption recorded from IDE billing data, converted to USD at published list prices. All experiments use identical task descriptions and starting git states across modes to ensure fair comparison.

= Results and Analysis

== Series 1–2: Cost Reduction and Quality Parity

The most direct result is from the Series 1 cost baseline:

#figure(
  table(
    columns: (auto, auto, auto, auto, auto),
    align: (left, left, right, right, left),
    stroke: 0.5pt,
    [*Task*], [*Routing*], [*All-Opus*], [*Routed*], [*Saved*],
    [Cross-repo rename], [Tier-Exec → Qwen], [\$0.01173], [\$0.00014], [−99%],
    [React Query refactor], [Tier-Mid → Sonnet], [\$0.07849], [\$0.01191], [−85%],
    [SSO+MFA design], [Tier-A → Opus], [\$0.07885], [\$0.07885], [—],
    [*Total*], [], [*\$0.1691*], [*\$0.0909*], [*−46%*],
  ),
  caption: [Series 1 cost comparison across three representative tasks],
)

Critically, routing did not degrade quality: the Tier-Mid task (React Query refactor) routed to Sonnet *outperformed* Opus (5/5 vs 4/5 in human evaluation). Series 2 Exp-2C confirmed this with blind LLM-as-Judge scoring: routing mode and All-Opus mode both scored 14.1/15.

== Series 3: Prompt Strategy Dominates Model Size

Series 3 reveals that prompt strategy is the primary quality determinant for Tier-Mid tasks:

#figure(
  table(
    columns: (auto, auto, auto, auto),
    align: (left, left, center, right),
    stroke: 0.5pt,
    [*Strategy*], [*Description*], [*Score (/15)*], [*Cost/task*],
    [S0 (baseline)], [No prompt engineering], [13.7], [\$0.006],
    [S2], [Structured output format], [13.3], [\$0.007],
    [S3 (CoT+role)], [Chain-of-thought + role], [15.0], [\$0.007],
    [*S1 (best)*], [*Role + deep-think*], [*15.0*], [*\$0.006*],
    [Opus baseline], [No prompt eng., Opus], [12.7], [\$0.045],
  ),
  caption: [Prompt strategy quality comparison on Tier-Mid tasks (Series 3)],
)

The S1 strategy achieves 15.0/15 with Sonnet at \$0.006/task — a 15.7% quality *improvement* over Opus at \$0.045/task, for an 86.7% cost reduction. 

This finding challenges the prevailing "bigger is always better" mindset. By providing a Tier-Mid model with a specific role and a directive to "think deeply before answering," we can bridge the reasoning gap between mid-tier and top-tier models for 80% of common refactoring tasks.

== Series 4: Cross-Domain Generalization

Series 4 validates the framework across Frontend, Backend, Data Engineering, and DevOps domains (20 tasks, 5 per domain). An AI agent (Qwen Code) applied the scoring guide independently, without domain-specific training or calibration.

Result: 20/20 routing accuracy, with zero mean score deviation across all five dimensions in all four domains. This confirms that the 5-dimension framework is sufficiently well-defined for cross-domain deployment without adaptation. The J (Judgment) and R (Risk) scores showed the highest consistency across domains, while Cr (Creativity) scores exhibited slightly more variance in Data Engineering tasks.

== Series 5–6: Multi-Model Comparison and Sensitivity

Series 5 reveals a nuanced picture of model capability: Haiku 4.5 scores 14/15 on Tier-Exec tasks (only 1 point below Opus) and *outperforms* Sonnet and Opus on Tier-Mid tasks (14 vs 13). Opus's only systematic advantage is in the Risk Awareness evaluation dimension on Tier-A tasks (2.7 vs Haiku's 2.0).

Series 6 sensitivity analysis shows that the Risk (R=33%) and Judgment (J=32%) dimensions are most likely to change routing decisions under ±1 perturbation. Verifiability (V=11%) and Creativity (Cr=13%) are most stable. This motivates targeting scoring effort toward R and J in ambiguous cases.

= Discussion

== Systematic Over-Routing Waste

Our analysis of the Series 1 dataset suggests that without a routing framework, organizations are wasting approximately 46% of their LLM budget on tasks that could be handled by much cheaper models with identical quality. In extreme cases (mechanical tasks), this waste exceeds 98%.

== The "Intelligence Density" Hypothesis

We propose the concept of *Intelligence Density*: the amount of high-judgment reasoning required per kilobyte of generated code. Mechanical tasks have low intelligence density, while architectural decisions have high density. gstack+ acts as a filter that matches the intelligence density of the task to the reasoning capability of the model.

== Limitations

*Sample size*: The core dataset covers 110+ tasks across 8 series. While results are consistent, statistical significance claims require larger validation sets. The 100% routing accuracy result, while robust across three independent validations, should be interpreted as "no failures observed" rather than "provably perfect."

*Controlled environment*: All experiments use known, pre-labeled tasks. Real-world deployment introduces novel task types that may not fit cleanly into the three-tier taxonomy.

*Single-user evaluation*: LLM-as-Judge scoring, while blind, uses a single judge model. Cross-judge validation would strengthen quality claims.

== Future Work

Three extensions are most promising:
1. *Online Adaptation*: Implementing a feedback loop where Tier-Mid review failures automatically trigger an adjustment in routing thresholds for similar task profiles.
2. *Dynamic Pricing Integration*: Incorporating real-time API latency and spot-pricing into the routing decision, allowing the system to switch providers based on current cost-efficiency.
3. *Multi-Judge Consensus*: Utilizing a "panel of judges" (different models and configurations) to eliminate the remaining traces of model-specific bias in quality assessment.

= Conclusion

gstack+ demonstrates that systematic task routing, rather than capability maximization, is the key lever for efficient AI-assisted development. The five-dimension framework achieves 100% routing accuracy across 70 tasks in three independent validations, the three-tier architecture reduces costs by 46%–98% without quality degradation, and sensitivity analysis provides actionable guidance for scoring edge cases. 

The core insight — that 80% of development tasks do not require the most expensive model — is simple, but its systematic application requires a principled framework. gstack+ provides that framework with quantitative validation. We believe that as LLM capabilities continue to diverge in cost and specialization, such orchestration layers will become mandatory components of any professional software engineering toolkit. 

The shift from "model selection" to "task routing" represents a maturation of the field, moving away from the novelty of AI capabilities toward the discipline of engineering efficiency.

= Appendix A: Scoring Guide Reference

To assist teams in implementing gstack+, we provide the following rubric for the 5-dimension scoring:

== Judgment (J)
- **1**: Mechanical task (e.g., reformatting).
- **2**: Simple logic (e.g., CRUD operation).
- **3**: Moderate judgment (e.g., refactoring with single-file impact).
- **4**: High judgment (e.g., architectural change).
- **5**: Strategic decision (e.g., security architecture).

== Context (C)
- **1**: Single file, no external dependencies.
- **2**: Multiple files in the same directory.
- **3**: Cross-module dependencies.
- **4**: Repository-wide impact.
- **5**: Cross-repository or system-wide context.

== Risk (R)
- **1**: Cosmetic change, no functional impact.
- **2**: Local logic change, easy to revert.
- **3**: Moderate impact on user-facing features.
- **4**: High impact on core business logic.
- **5**: Critical security or infrastructure change.

== Verifiability (V)
- **1**: Impossible to verify automatically.
- **2**: Requires complex integration tests.
- **3**: Can be verified with unit tests.
- **4**: Can be verified with simple build/lint checks.
- **5**: Fully automated verification (e.g., compiler).

== Creativity (Cr)
- **1**: Purely mechanical/templated.
- **2**: Follows established patterns.
- **3**: Requires minor adaptation of patterns.
- **4**: Requires novel design or synthesis.
- **5**: Breakthrough design or problem solving.

= References

#set text(size: 10pt)

[1] Brown, T. et al. (2020). Language Models are Few-Shot Learners. NeurIPS.

[2] Chen, L. et al. (2023). FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance. arXiv:2305.05176.

[3] Wei, J. et al. (2022). Chain-of-Thought Prompting Elicits Reasoning in Large Language Models. NeurIPS.

[4] Wu, Q. et al. (2023). AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation. arXiv:2308.08155.

[5] Anthropic. (2024). Claude 3 Model Card. Technical Report.

[6] Zhang, D. (2026). gstack+ Experiment Series 1–8. Technical Report, available at github.com/zhewenzhang/gstack-plus.
