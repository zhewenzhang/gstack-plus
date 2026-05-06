export interface Task7 {
  id: string;
  description: string;
  scores: { j: number; c: number; r: number; v: number; cr: number };
  correctTier: 'Tier-Exec' | 'Tier-Mid' | 'Tier-A';
  experimentTier: 'Tier-Exec' | 'Tier-Mid' | 'Tier-A';
  errorType: 'over-routing' | 'under-routing';
}

export const TASKS_7: Task7[] = [
  {
    id: 'E1',
    description: 'Add type annotations to utility functions',
    scores: { j: 1, c: 2, r: 1, v: 5, cr: 1 },
    correctTier: 'Tier-Exec',
    experimentTier: 'Tier-Mid',
    errorType: 'over-routing',
  },
  {
    id: 'E2',
    description: 'Update environment variables in CI pipeline',
    scores: { j: 2, c: 2, r: 2, v: 3, cr: 1 },
    correctTier: 'Tier-Exec',
    experimentTier: 'Tier-Mid',
    errorType: 'over-routing',
  },
  {
    id: 'E3',
    description: 'Add database index for frequently queried field',
    scores: { j: 1, c: 1, r: 3, v: 5, cr: 1 },
    correctTier: 'Tier-Exec',
    experimentTier: 'Tier-Mid',
    errorType: 'over-routing',
  },
  {
    id: 'M1',
    description: 'Refactor auth middleware to use JWT',
    scores: { j: 3, c: 3, r: 3, v: 3, cr: 2 },
    correctTier: 'Tier-Mid',
    experimentTier: 'Tier-A',
    errorType: 'over-routing',
  },
  {
    id: 'M2',
    description: 'Add pagination to user list API',
    scores: { j: 2, c: 3, r: 2, v: 4, cr: 2 },
    correctTier: 'Tier-Mid',
    experimentTier: 'Tier-A',
    errorType: 'over-routing',
  },
  {
    id: 'M3',
    description: 'Write integration tests for payment service',
    scores: { j: 3, c: 2, r: 3, v: 4, cr: 2 },
    correctTier: 'Tier-Mid',
    experimentTier: 'Tier-Exec',
    errorType: 'under-routing',
  },
  {
    id: 'A1',
    description: 'Design database sharding strategy',
    scores: { j: 4, c: 3, r: 4, v: 2, cr: 3 },
    correctTier: 'Tier-A',
    experimentTier: 'Tier-Mid',
    errorType: 'under-routing',
  },
  {
    id: 'A2',
    description: 'Plan OAuth2 + SSO integration architecture',
    scores: { j: 5, c: 4, r: 5, v: 2, cr: 4 },
    correctTier: 'Tier-A',
    experimentTier: 'Tier-Mid',
    errorType: 'under-routing',
  },
  {
    id: 'A3',
    description: 'Evaluate and recommend caching strategy',
    scores: { j: 4, c: 2, r: 3, v: 3, cr: 4 },
    correctTier: 'Tier-A',
    experimentTier: 'Tier-Mid',
    errorType: 'under-routing',
  },
];
