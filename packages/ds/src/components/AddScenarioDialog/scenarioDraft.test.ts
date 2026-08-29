import { describe, it, expect } from 'vitest';
import {
  getMissingScenarioFields,
  type NewScenarioDraft,
} from './scenarioDraft';

const filled: NewScenarioDraft = {
  name: 'Verify cache hit on /v1/assets',
  status: 'passed',
  description: 'Edge cache serves a warm asset on the second request.',
  expected: 'Response carries X-Cache: HIT',
  actual: '',
  steps: [],
  evidence: [],
};

describe('getMissingScenarioFields', () => {
  it('reports nothing missing for a passed scenario with no actual result', () => {
    expect(getMissingScenarioFields(filled)).toEqual([]);
  });

  it('requires name, description and expected on every status', () => {
    const empty = {
      name: '',
      description: '',
      expected: '',
      actual: '',
      steps: [],
      evidence: [],
    };
    expect(getMissingScenarioFields({ ...empty, status: 'passed' })).toEqual([
      'name',
      'description',
      'expected',
    ]);
    expect(getMissingScenarioFields({ ...empty, status: 'pending' })).toEqual([
      'name',
      'description',
      'expected',
    ]);
  });

  it('additionally requires an actual result when the status is failed', () => {
    expect(getMissingScenarioFields({ ...filled, status: 'failed' })).toEqual([
      'actual',
    ]);
  });

  it('accepts a failed scenario once the actual result is filled in', () => {
    expect(
      getMissingScenarioFields({
        ...filled,
        status: 'failed',
        actual: 'Response carried X-Cache: MISS',
      }),
    ).toEqual([]);
  });

  it('treats whitespace-only values as missing', () => {
    expect(getMissingScenarioFields({ ...filled, name: '   ' })).toEqual([
      'name',
    ]);
  });

  it('ignores steps and evidence, which are always optional', () => {
    expect(
      getMissingScenarioFields({
        ...filled,
        steps: ['', '   '],
        evidence: [],
      }),
    ).toEqual([]);
  });
});
