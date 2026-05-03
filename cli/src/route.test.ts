import { describe, it, expect } from 'vitest';
import { route } from './route.js';

describe('route()', () => {
  it('judgment=4 alone triggers Tier-A', () => {
    expect(route({ judgment:4, context:2, risk:2, verifiability:4, creativity:2 }).tier).toBe('Tier-A');
  });
  it('risk=5 alone triggers Tier-A', () => {
    expect(route({ judgment:2, context:1, risk:5, verifiability:5, creativity:1 }).tier).toBe('Tier-A');
  });
  it('creativity=4 alone triggers Tier-A', () => {
    expect(route({ judgment:1, context:1, risk:1, verifiability:5, creativity:4 }).tier).toBe('Tier-A');
  });
  it('low-risk verifiable task -> Tier-Exec', () => {
    expect(route({ judgment:1, context:1, risk:1, verifiability:5, creativity:1 }).tier).toBe('Tier-Exec');
  });
  it('borderline judgment=3 alone -> Tier-Mid (conservative does not promote)', () => {
    expect(route({ judgment:3, context:3, risk:3, verifiability:3, creativity:3 }).tier).toBe('Tier-Mid');
  });
  it('Tier-Exec requires all three conditions', () => {
    // verifiability=3 (< 4) breaks Exec criteria -> falls through to Mid
    expect(route({ judgment:2, context:2, risk:2, verifiability:3, creativity:2 }).tier).toBe('Tier-Mid');
  });
  it('Tier-A wins over Tier-Exec when both could trigger', () => {
    // creativity=4 triggers A; other dims would qualify for Exec
    expect(route({ judgment:1, context:1, risk:1, verifiability:5, creativity:4 }).tier).toBe('Tier-A');
  });
});
