import { describe, it, expect } from 'vitest';
import type { TestScenarioStatus } from './TestScenarioCard';
import { statusChangePrompt } from './statusGating';

const ALL: readonly TestScenarioStatus[] = [
  'passed',
  'failed',
  'pending',
  'waived',
];

describe('statusChangePrompt', () => {
  it('gates waiving from every other status', () => {
    for (const from of ALL.filter((s) => s !== 'waived')) {
      expect(statusChangePrompt(from, 'waived')).toBe('waived');
    }
  });

  it('gates re-opening from passed or waived', () => {
    expect(statusChangePrompt('passed', 'pending')).toBe('pending');
    expect(statusChangePrompt('waived', 'pending')).toBe('pending');
  });

  it('lets a failed scenario re-open freely', () => {
    expect(statusChangePrompt('failed', 'pending')).toBeNull();
  });

  it('never gates a move to passed or failed', () => {
    for (const from of ALL) {
      expect(statusChangePrompt(from, 'passed')).toBeNull();
      expect(statusChangePrompt(from, 'failed')).toBeNull();
    }
  });

  it('treats a no-op as ungated, including waived to waived', () => {
    for (const status of ALL) {
      expect(statusChangePrompt(status, status)).toBeNull();
    }
  });
});
