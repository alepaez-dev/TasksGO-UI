import type { TestScenarioStatus } from './TestScenarioCard';

export type StatusChangePrompt = Extract<
  TestScenarioStatus,
  'waived' | 'pending'
>;

/**
 * Which dialog a status change owes the user before it can be committed.
 *
 * Waiving skips execution, so it owes an explanation. Re-opening from passed or
 * waived discards a verdict, so it owes a fresh actual result — but a failed
 * scenario already carries one, and re-running a known failure should not
 * demand the result be retyped first.
 *
 * This chooses a dialog; it does not decide who may change a status. `null`
 * means "no extra input needed", not "permitted" — enforce the justification
 * server-side, where the record is actually written.
 */
export function statusChangePrompt(
  from: TestScenarioStatus,
  to: TestScenarioStatus,
): StatusChangePrompt | null {
  if (to === from) return null;
  if (to === 'waived') return 'waived';
  if (to === 'pending' && (from === 'passed' || from === 'waived')) {
    return 'pending';
  }
  return null;
}
