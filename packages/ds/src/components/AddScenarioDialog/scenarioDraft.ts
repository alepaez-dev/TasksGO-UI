import type { TestScenarioStatus } from '../TestScenarioCard';

export type NewScenarioStatus = Exclude<TestScenarioStatus, 'waived'>;

export interface NewScenarioDraft {
  readonly name: string;
  readonly status: NewScenarioStatus;
  readonly description: string;
  readonly expected: string;
  readonly actual: string;
  readonly steps: readonly string[];
  /**
   * Raw picks from the file input. The consumer owns upload and must validate
   * type, size and content server-side — the 6-file cap is a UX affordance,
   * not a security boundary.
   */
  readonly evidence: readonly File[];
}

export type NewScenarioTextField = Exclude<
  keyof NewScenarioDraft,
  'status' | 'steps' | 'evidence'
>;

const ALWAYS_REQUIRED: readonly NewScenarioTextField[] = [
  'name',
  'description',
  'expected',
];

export function isScenarioFieldRequired(
  field: NewScenarioTextField,
  status: NewScenarioStatus,
): boolean {
  if (field === 'actual') return status === 'failed';
  return ALWAYS_REQUIRED.includes(field);
}

export function getMissingScenarioFields(
  draft: NewScenarioDraft,
): readonly NewScenarioTextField[] {
  return [...ALWAYS_REQUIRED, 'actual' as const].filter(
    (field) =>
      isScenarioFieldRequired(field, draft.status) &&
      draft[field].trim().length === 0,
  );
}
