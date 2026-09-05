import {
  TestScenarioCard,
  type TestScenarioCardPosition,
} from '../../../components/TestScenarioCard';
import { Selector } from '../../../components/Selector';
import { SectionHeader } from '../../../components/SectionHeader';
import { StatusDot } from '../../../components/StatusDot';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import type { UseSelectorStateReturn } from '../../../hooks/useSelector';
import type { TestScenarioSection } from '../../../components/TestScenarioCard';
import { formatByline, healthDotVariant } from './qaViewModel';
import type { QaEnvironment, QaScenario } from './shared';
import styles from './QaPanel.module.css';

export interface QaPanelProps {
  environments: readonly QaEnvironment[];
  activeEnvironment: string;
  onEnvironmentChange: (value: string) => void;
  envSelector: UseSelectorStateReturn;
  scenarios: readonly QaScenario[];
  onUpdateScenario: (
    id: string,
    patch: Partial<QaScenario> | ((prev: QaScenario) => Partial<QaScenario>),
  ) => void;
  expandedScenarioId: string | null;
  onToggleScenario: (id: string) => void;
  statusSelectScenarioId: string | null;
  onStatusSelectOpenChange: (id: string, open: boolean) => void;
  editingSectionsById: Record<string, readonly TestScenarioSection[]>;
  onEditingSectionsChange: (
    id: string,
    sections: readonly TestScenarioSection[],
  ) => void;
}

function listPosition(index: number, total: number): TestScenarioCardPosition {
  if (total === 1) return 'standalone';
  if (index === 0) return 'first';
  if (index === total - 1) return 'last';
  return 'middle';
}

export function QaPanel({
  environments,
  activeEnvironment,
  onEnvironmentChange,
  envSelector: {
    ref: envSelectorRef,
    open: envSelectorOpen,
    onOpenChange: onEnvSelectorOpenChange,
  },
  scenarios,
  onUpdateScenario,
  expandedScenarioId,
  onToggleScenario,
  statusSelectScenarioId,
  onStatusSelectOpenChange,
  editingSectionsById,
  onEditingSectionsChange,
}: QaPanelProps) {
  const activeEnvIndex = environments.findIndex(
    (env) => env.value === activeEnvironment,
  );
  const activeEnv = environments[activeEnvIndex] ?? environments[0];
  const nextEnv =
    activeEnvIndex >= 0 && activeEnvIndex + 1 < environments.length
      ? environments[activeEnvIndex + 1]
      : undefined;

  const passingScenarioCount = scenarios.filter(
    (s) => s.status === 'passed',
  ).length;
  const totalScenarioCount = scenarios.length;
  const passingPercent =
    totalScenarioCount === 0
      ? 0
      : Math.round((passingScenarioCount / totalScenarioCount) * 100);

  return (
    <>
      <div className={styles.envBar}>
        <Selector
          ref={envSelectorRef}
          variant="inline"
          triggerPrefix={
            <span className={styles.envIcon}>
              <Icon name="science" size="md" />
            </span>
          }
          header={
            <span className={styles.envMenuHeader}>Switch environment</span>
          }
          options={environments.map((env) => ({
            value: env.value,
            label: env.label,
            meta: env.reviewStatus,
          }))}
          value={activeEnvironment}
          onValueChange={onEnvironmentChange}
          open={envSelectorOpen}
          onOpenChange={onEnvSelectorOpenChange}
          action={{
            label: 'Manage environments',
            icon: 'settings',
            onClick: () => {},
          }}
          renderTriggerLabel={(option) => {
            const env = environments.find((e) => e.value === option.value);
            return (
              <span className={styles.envTrigger}>
                <span className={styles.envName}>
                  ENVIRONMENT: {option.label}
                </span>
                <span className={styles.envDeploy}>
                  Last deployment: {env?.lastDeployment}
                </span>
              </span>
            );
          }}
          renderOptionIndicator={(option) => {
            const env = environments.find((e) => e.value === option.value);
            return (
              <StatusDot
                variant={env ? healthDotVariant(env.health) : 'info'}
                label={env ? env.reviewStatus : ''}
              />
            );
          }}
          aria-label={`Environment: ${activeEnv.label}`}
        />
        <span className={styles.pipelineStatus}>
          <span className={styles.pipelineLabel}>Pipeline status</span>
          <span className={styles.pipelineValue}>
            <StatusDot
              variant={
                activeEnv.pipeline.status === 'passing' ? 'active' : 'high'
              }
              label={`Pipeline ${activeEnv.pipeline.label}`}
            />
            {activeEnv.pipeline.label}
          </span>
        </span>
        {nextEnv && (
          <Button variant="secondary" size="sm" className={styles.promote}>
            Promote to {nextEnv.label}
            <Icon name="chevron_right" size="sm" />
          </Button>
        )}
      </div>

      <div className={styles.scenariosSection}>
        <div className={styles.scenariosHead}>
          <SectionHeader headingLevel={2}>Test Scenarios</SectionHeader>
          {totalScenarioCount > 0 && (
            <span className={styles.scenariosMeter}>
              <span className={styles.passingCount}>
                <strong>{passingScenarioCount}</strong> of {totalScenarioCount}{' '}
                Passing
              </span>
              <span
                className={styles.progressTrack}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={totalScenarioCount}
                aria-valuenow={passingScenarioCount}
                aria-label={`${passingScenarioCount} of ${totalScenarioCount} scenarios passing`}
              >
                <span
                  className={styles.progressFill}
                  style={{ width: `${passingPercent}%` }}
                />
              </span>
            </span>
          )}
        </div>

        {scenarios.length === 0 ? (
          <p className={styles.scenariosEmpty}>No test scenarios yet.</p>
        ) : (
          <div className={styles.scenarioList}>
            {scenarios.map((scenario, index) => (
              <TestScenarioCard
                key={scenario.id}
                position={listPosition(index, scenarios.length)}
                caseId={scenario.id}
                title={scenario.title}
                status={scenario.status}
                byline={formatByline(scenario.byline)}
                assigneeInitial={scenario.assigneeInitial}
                assigneeLabel={scenario.assigneeLabel}
                assigneeColor={scenario.assigneeColor}
                description={scenario.description}
                steps={scenario.steps}
                evidence={scenario.evidence}
                expected={scenario.expected}
                actual={scenario.actual}
                waiveReason={scenario.waiveReason}
                open={expandedScenarioId === scenario.id}
                onOpenChange={() => onToggleScenario(scenario.id)}
                statusSelectOpen={statusSelectScenarioId === scenario.id}
                onStatusSelectOpenChange={(open) =>
                  onStatusSelectOpenChange(scenario.id, open)
                }
                onStatusChange={(next) =>
                  onUpdateScenario(scenario.id, { status: next })
                }
                editingSections={editingSectionsById[scenario.id] ?? []}
                onEditingSectionsChange={(sections) =>
                  onEditingSectionsChange(scenario.id, sections)
                }
                onTitleChange={(value) =>
                  onUpdateScenario(scenario.id, { title: value })
                }
                onDescriptionChange={(value) =>
                  onUpdateScenario(scenario.id, {
                    description: value,
                  })
                }
                onExpectedChange={(value) =>
                  onUpdateScenario(scenario.id, { expected: value })
                }
                onActualChange={(value) =>
                  onUpdateScenario(scenario.id, { actual: value })
                }
                onWaiveReasonChange={(value) =>
                  onUpdateScenario(scenario.id, {
                    waiveReason: value,
                  })
                }
                onStepsChange={(steps) =>
                  onUpdateScenario(scenario.id, { steps })
                }
                onAddEvidence={(files) =>
                  onUpdateScenario(scenario.id, (prev) => ({
                    evidence: [
                      ...(prev.evidence ?? []),
                      ...files.map((file) => ({
                        label: file.name,
                        kind: file.type.startsWith('image/')
                          ? ('image' as const)
                          : ('file' as const),
                      })),
                    ],
                  }))
                }
                onRemoveEvidence={(index) =>
                  onUpdateScenario(scenario.id, (prev) => ({
                    evidence: (prev.evidence ?? []).filter(
                      (_, i) => i !== index,
                    ),
                  }))
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
