import type { Scoring } from './route';

// ─── Roles ────────────────────────────────────────────────────────────────────
export type RoleId =
  | 'architect'
  | 'tech-lead'
  | 'senior-dev'
  | 'developer'
  | 'executor'
  | 'reviewer';

export type Role = {
  id: RoleId;
  label: string;
  labelEn: string;
  tier: 'Tier-A' | 'Tier-A/Mid' | 'Tier-Mid' | 'Tier-Mid/Exec' | 'Tier-Exec' | 'any';
  description: string;
  descriptionEn: string;
  instructions: string;
};

export const ROLES: Role[] = [
  {
    id: 'architect',
    label: '系統架構師',
    labelEn: 'System Architect',
    tier: 'Tier-A',
    description: '系統設計、技術選型、架構決策',
    descriptionEn: 'System design, tech choices, architectural decisions',
    instructions: `You design systems from first principles. You make technology choices with explicit rationale, identify edge cases and failure modes, and produce opinionated, actionable plans. Avoid wishy-washy recommendations — commit to a direction and explain why.`,
  },
  {
    id: 'tech-lead',
    label: '技術主管',
    labelEn: 'Tech Lead',
    tier: 'Tier-A/Mid',
    description: '評估方案、制定標準、分解工作',
    descriptionEn: 'Evaluate trade-offs, set standards, break down work',
    instructions: `You evaluate technical trade-offs, set engineering standards, and break complex goals into executable tasks. You balance short-term delivery with long-term maintainability. Always explain the reasons behind your recommendations.`,
  },
  {
    id: 'senior-dev',
    label: '資深開發工程師',
    labelEn: 'Senior Developer',
    tier: 'Tier-Mid',
    description: '複雜重構、代碼審查、疑難排查',
    descriptionEn: 'Complex refactors, code reviews, nuanced implementation',
    instructions: `You implement complex features and refactors with attention to correctness, maintainability, and edge cases. You follow existing code patterns unless there's a clear reason to deviate. Always consider what could break.`,
  },
  {
    id: 'developer',
    label: '開發工程師',
    labelEn: 'Developer',
    tier: 'Tier-Mid/Exec',
    description: '按計劃實現功能，遵循現有模式',
    descriptionEn: 'Implement features following a plan, follow existing patterns',
    instructions: `You implement features following a clear plan. You follow existing code patterns and conventions. You ask clarifying questions when the requirements are ambiguous rather than making assumptions.`,
  },
  {
    id: 'executor',
    label: '代碼執行者',
    labelEn: 'Code Executor',
    tier: 'Tier-Exec',
    description: '精確執行定義明確的機械任務',
    descriptionEn: 'Execute well-defined, mechanical coding tasks precisely',
    instructions: `You execute precisely scoped coding tasks. No design decisions — follow the spec exactly. Every change must be verifiable. If anything is unclear, ask before proceeding. Produce minimal, targeted changes.`,
  },
  {
    id: 'reviewer',
    label: '代碼審查員',
    labelEn: 'Code Reviewer',
    tier: 'Tier-Mid',
    description: '審查代碼，發現問題，驗證實現',
    descriptionEn: 'Review code, catch issues, verify implementation quality',
    instructions: `You review code for correctness, maintainability, security, and adherence to requirements. Be specific about every issue you find — include the file path, line number, and a concrete suggestion for improvement. Prioritize issues by severity.`,
  },
];

// ─── Flows ────────────────────────────────────────────────────────────────────
export type FlowId = 'plan' | 'execute' | 'review' | 'debug' | 'handoff';

export type Flow = {
  id: FlowId;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  outputInstructions: string;
};

export const FLOWS: Flow[] = [
  {
    id: 'plan',
    label: '制定計劃',
    labelEn: 'Plan',
    description: '拆解任務，輸出可執行方案',
    descriptionEn: 'Break down the task, produce an actionable plan',
    outputInstructions: `Produce a structured implementation plan with:
1. A concise problem statement (2-3 sentences)
2. Numbered implementation steps in execution order
3. Files to create/modify (with paths)
4. Acceptance criteria (verifiable, specific)
5. Risks and mitigation strategies`,
  },
  {
    id: 'execute',
    label: '執行實現',
    labelEn: 'Execute',
    description: '按計劃輸出具體代碼或步驟',
    descriptionEn: 'Produce concrete code or step-by-step implementation',
    outputInstructions: `Produce the implementation directly:
1. Start with a one-line summary of what you're doing
2. Show file changes with exact file paths
3. Use diff format or full file content as appropriate
4. End with a verification checklist (how to confirm it works)`,
  },
  {
    id: 'review',
    label: '審查驗收',
    labelEn: 'Review',
    description: '審查現有代碼或方案，給出具體反饋',
    descriptionEn: 'Review existing code or a plan, give specific feedback',
    outputInstructions: `Structure your review as:
1. Overall verdict: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION
2. Issues found (each with: severity, file+line if applicable, specific suggestion)
3. What works well (be genuine, not just polite)
4. Required changes before approval (if any)`,
  },
  {
    id: 'debug',
    label: '調試排查',
    labelEn: 'Debug',
    description: '找出根本原因，提出修復方案',
    descriptionEn: 'Find root cause, propose a fix',
    outputInstructions: `Structure your debugging response as:
1. Root cause hypothesis (your best guess and why)
2. Evidence that supports or refutes the hypothesis
3. The fix (exact change needed)
4. How to verify the fix worked
5. What to check if the fix doesn't work`,
  },
  {
    id: 'handoff',
    label: '交接文檔',
    labelEn: 'Handoff',
    description: '為下一個人或模型準備完整的交接說明',
    descriptionEn: 'Prepare a complete handoff document for the next person or model',
    outputInstructions: `Write a handoff document with:
1. What was done (not what was asked — what actually happened)
2. Current state of the system (what changed, what didn't)
3. Decisions made and rationale (especially non-obvious ones)
4. What the next person needs to know to continue
5. Known issues or debt introduced`,
  },
];

// ─── Prompt Generator ────────────────────────────────────────────────────────
export function buildPrompt(
  task: string,
  scoring: Scoring,
  tier: string,
  roleId: RoleId,
  flowId: FlowId,
  lang: 'zh' | 'en',
): string {
  const role = ROLES.find(r => r.id === roleId)!;
  const flow = FLOWS.find(f => f.id === flowId)!;

  const roleName = lang === 'en' ? role.labelEn : role.label;
  const flowName = lang === 'en' ? flow.labelEn : flow.label;

  return `# Role: ${roleName}
# Flow: ${flowName}
# Tier: ${tier}

---

## About You

${role.instructions}

---

## Context

This task has been classified by gstack-plus:

| Dimension | Score |
|-----------|-------|
| Judgment  | ${scoring.judgment}/5 |
| Context   | ${scoring.context}/5 |
| Risk      | ${scoring.risk}/5 |
| Verif.    | ${scoring.verifiability}/5 |
| Creativity | ${scoring.creativity}/5 |

**Routing: ${tier}**

---

## Your Task

${task || '(No task description provided — add your task description above)'}

---

## Output Instructions

${flow.outputInstructions}

---

## Constraints

${tier === 'Tier-Exec'
  ? `- Stay within the defined scope — no scope creep
- No design decisions — follow existing patterns
- Every change must be directly verifiable
- If anything is unclear, ask before acting`
  : tier === 'Tier-Mid'
  ? `- Balance thoroughness with pragmatism
- Flag anything that seems outside the original scope
- Document non-obvious decisions briefly`
  : `- This is a high-judgment task — be opinionated
- Explicitly state your assumptions and constraints
- Address risks and failure modes
- Make recommendations, not menus of options`}
`;
}
