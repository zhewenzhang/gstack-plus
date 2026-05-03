import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = {
      create: vi.fn().mockResolvedValue({
        content: [{ type: 'text', text: '{"judgment":4,"context":3,"risk":4,"verifiability":2,"creativity":2}' }],
      }),
    };
  },
}));

describe('autoScore()', () => {
  beforeEach(() => vi.clearAllMocks());

  it('parses valid JSON response into Scoring', async () => {
    const { autoScore } = await import('./auto-score.js');
    const result = await autoScore('Design new auth system', 'fake-key');
    expect(result.judgment).toBe(4);
    expect(result.risk).toBe(4);
  });
});
