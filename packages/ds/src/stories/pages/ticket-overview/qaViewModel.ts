import type {
  QaScenarioByline,
  QaEnvironment,
  QaScenario,
  ChecklistItem,
} from './shared';

export function formatByline(byline: QaScenarioByline): string {
  if ('person' in byline) {
    return `${byline.action} ${byline.person} · ${byline.when}`;
  }
  return byline.action;
}

export function countFailed(scenarios: readonly QaScenario[]): number {
  return scenarios.filter((scenario) => scenario.status === 'failed').length;
}

export function toChecklistItems(
  scenarios: readonly QaScenario[],
): ChecklistItem[] {
  return scenarios.map((scenario) => ({
    id: scenario.id,
    status: scenario.status === 'waived' ? 'pending' : scenario.status,
    label: scenario.title,
    meta:
      scenario.status === 'failed'
        ? 'Failed'
        : scenario.status === 'waived'
          ? 'Waived'
          : scenario.status === 'pending'
            ? 'Not run yet'
            : 'person' in scenario.byline
              ? `Verified by ${scenario.byline.person}`
              : 'Verified',
    metaVariant:
      scenario.status === 'failed'
        ? 'critical'
        : scenario.status === 'waived'
          ? 'waived'
          : undefined,
  }));
}

export function healthDotVariant(
  health: QaEnvironment['health'],
): 'active' | 'high' | 'critical' {
  if (health === 'unstable') return 'high';
  if (health === 'degraded') return 'critical';
  return 'active';
}
