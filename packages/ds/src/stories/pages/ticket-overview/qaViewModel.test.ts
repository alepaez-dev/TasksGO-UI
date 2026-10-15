import { describe, it, expect } from 'vitest';
import {
  formatByline,
  healthDotVariant,
  countFailed,
  toChecklistItems,
  toEnvironmentOptions,
} from './qaViewModel';
import type { QaScenario } from './shared';
import { ticket } from './shared';

const scenario = (overrides: Partial<QaScenario>): QaScenario => ({
  id: 'TC-1',
  title: 'Scenario',
  status: 'pending',
  byline: { action: 'Not run yet' },
  assigneeInitial: 'AB',
  assigneeLabel: 'A B',
  description: 'desc',
  expected: 'expected',
  ...overrides,
});

describe('qa helpers', () => {
  it('formats a full byline', () => {
    expect(
      formatByline({
        action: 'Verified by',
        person: 'Sarah K.',
        when: '2h ago',
      }),
    ).toBe('Verified by Sarah K. · 2h ago');
  });

  it('formats an action-only byline (pending)', () => {
    expect(formatByline({ action: 'Not run yet' })).toBe('Not run yet');
  });

  it('maps env health to a StatusDot variant', () => {
    expect(healthDotVariant('stable')).toBe('active');
    expect(healthDotVariant('unstable')).toBe('high');
    expect(healthDotVariant('degraded')).toBe('critical');
  });

  it('counts only failed scenarios', () => {
    expect(
      countFailed([
        scenario({ id: 'a', status: 'passed' }),
        scenario({ id: 'b', status: 'failed' }),
        scenario({ id: 'c', status: 'waived' }),
        scenario({ id: 'd', status: 'pending' }),
      ]),
    ).toBe(1);
  });

  it('projects scenarios into checklist rows, folding waived to pending', () => {
    const items = toChecklistItems([
      scenario({
        id: 'a',
        title: 'Passed one',
        status: 'passed',
        byline: { action: 'Verified by', person: 'Sarah K.', when: '2h ago' },
      }),
      scenario({ id: 'b', title: 'Failed one', status: 'failed' }),
      scenario({ id: 'c', title: 'Pending one', status: 'pending' }),
      scenario({ id: 'd', title: 'Waived one', status: 'waived' }),
    ]);

    expect(items).toEqual([
      {
        id: 'a',
        status: 'passed',
        label: 'Passed one',
        meta: 'Verified by Sarah K.',
        metaVariant: undefined,
      },
      {
        id: 'b',
        status: 'failed',
        label: 'Failed one',
        meta: 'Failed',
        metaVariant: 'critical',
      },
      {
        id: 'c',
        status: 'pending',
        label: 'Pending one',
        meta: 'Not run yet',
        metaVariant: undefined,
      },
      {
        id: 'd',
        status: 'pending',
        label: 'Waived one',
        meta: 'Waived',
        metaVariant: 'waived',
      },
    ]);
  });
});

describe('toEnvironmentOptions', () => {
  it('maps QA environments onto card options', () => {
    const [first] = toEnvironmentOptions(ticket.qa.environments);
    expect(first).toMatchObject({
      value: 'qa-01',
      label: 'QA-01',
      reviewStatus: 'In review',
      healthVariant: 'high',
    });
    expect(first.lastDeployment).toBe('24 mins ago');
    expect(first.pipelineLabel).toBe('Unstable');
    expect(first.pipelineVariant).toBe('high');
  });

  it('marks a passing pipeline active', () => {
    const [option] = toEnvironmentOptions([
      {
        value: 'staging',
        label: 'STAGING',
        health: 'stable',
        reviewStatus: 'Healthy',
        lastDeployment: '1 day ago',
        pipeline: { label: 'Healthy', status: 'passing' },
      },
    ]);
    expect(option.pipelineVariant).toBe('active');
    expect(option.healthVariant).toBe('active');
    expect(option.reviewStatus).toBe('Healthy');
  });
});
