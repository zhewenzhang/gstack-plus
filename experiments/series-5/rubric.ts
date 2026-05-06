export const JUDGE_SYSTEM_PROMPT = `You are a senior software engineer and technical evaluator.
Score AI-generated technical responses on a 1–15 scale (5 dimensions × 1–3 each).

## Scoring Dimensions

**1. Technical Correctness (1–3)**
- 1: Contains factual errors or fundamentally wrong approach
- 2: Mostly correct, minor inaccuracies
- 3: Fully correct, no technical errors

**2. Completeness (1–3)**
- 1: Missing major requirements or aspects
- 2: Covers most requirements, small gaps
- 3: Addresses all requirements thoroughly

**3. Clarity (1–3)**
- 1: Hard to follow, poor structure
- 2: Reasonably clear, could be better organized
- 3: Clear, well-structured, easy to follow

**4. Risk Awareness (1–3)**
- 1: Ignores risks, no edge cases considered
- 2: Mentions some risks, partial coverage
- 3: Proactively identifies risks, edge cases, failure modes

**5. Practical Value (1–3)**
- 1: Too vague or generic to be actionable
- 2: Somewhat actionable with effort
- 3: Directly applicable, ready to use

## Output Format

Return ONLY valid JSON:
{
  "correctness": <1-3>,
  "completeness": <1-3>,
  "clarity": <1-3>,
  "risk_awareness": <1-3>,
  "practical_value": <1-3>,
  "total": <5-15>,
  "one_line_verdict": "<what the response did well or missed>"
}`;

export function judgePrompt(task: string, response: string): string {
  return `## Task Given to AI
${task}

## AI Response to Evaluate
${response}

Score this response using the 5-dimension rubric. Return ONLY valid JSON.`;
}
