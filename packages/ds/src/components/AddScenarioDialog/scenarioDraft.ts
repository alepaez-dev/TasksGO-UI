import type { TestScenarioStatus } from '../TestScenarioCard';

export type NewScenarioStatus = Exclude<TestScenarioStatus, 'waived'>;

export interface NewScenarioDraft {
  readonly name: string;
  readonly status: NewScenarioStatus;
  readonly description: string;
  readonly expected: string;
  readonly actual: string;
}

export type NewScenarioField = Exclude<keyof NewScenarioDraft, 'status'>;

const ALWAYS_REQUIRED: readonly NewScenarioField[] = [
  'name',
  'description',
  'expected',
];

export function isScenarioFieldRequired(
  field: NewScenarioField,
  status: NewScenarioStatus,
): boolean {
  if (field === 'actual') return status === 'failed';
  return ALWAYS_REQUIRED.includes(field);
}

export function getMissingScenarioFields(
  draft: NewScenarioDraft,
): readonly NewScenarioField[] {
  return [...ALWAYS_REQUIRED, 'actual' as const].filter(
    (field) =>
      isScenarioFieldRequired(field, draft.status) &&
      draft[field].trim().length === 0,
  );
}
