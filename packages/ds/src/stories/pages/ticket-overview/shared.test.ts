import { describe, it, expect } from 'vitest';
import { countFailedScenarios, ticket, type ChecklistItem } from './shared';
import { toChecklistItems } from './qaViewModel';

const item = (status: ChecklistItem['status'], id: string): ChecklistItem => ({
  id,
  status,
  label: id,
  meta: '',
});

describe('countFailedScenarios', () => {
  it('counts nothing in an empty list', () => {
    expect(countFailedScenarios([])).toBe(0);
  });

  it('counts nothing when no scenario failed', () => {
    expect(
      countFailedScenarios([item('passed', 'a'), item('pending', 'b')]),
    ).toBe(0);
  });

  it('counts only the failed scenarios in a mixed list', () => {
    expect(
      countFailedScenarios([
        item('passed', 'a'),
        item('failed', 'b'),
        item('pending', 'c'),
        item('failed', 'd'),
      ]),
    ).toBe(2);
  });

  it('matches the seeded ticket data the pages render', () => {
    // the checklist is now a projection of the QA-tab scenarios
    expect(countFailedScenarios(toChecklistItems(ticket.qa.scenarios))).toBe(1);
  });
});
