import { forwardRef, useId, type RefObject } from 'react';
import { Selector } from '../Selector';
import { BottomSheet } from '../BottomSheet';
import { OptionList } from '../OptionList';
import { StatusDot, type StatusDotVariant } from '../StatusDot';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { breakpoints } from '../../tokens/interaction';
import styles from './QaEnvironmentCard.module.css';

export type QaEnvironmentOption = Readonly<{
  value: string;
  label: string;
  reviewStatus: string;
  lastDeployment: string;
  healthVariant: StatusDotVariant;
  pipelineLabel: string;
  pipelineVariant: StatusDotVariant;
}>;

export interface QaEnvironmentCardProps {
  environments: readonly QaEnvironmentOption[];
  activeValue: string;
  onValueChange: (value: string) => void;
  switcherOpen: boolean;
  onSwitcherOpenChange: (open: boolean) => void;
  wideSelectorRef?: RefObject<HTMLDivElement | null>;
  promote?: Readonly<{ label: string; onClick: () => void }>;
  onManageEnvironments?: () => void;
}

export const QaEnvironmentCard = forwardRef<
  HTMLDivElement,
  QaEnvironmentCardProps
>(
  (
    {
      environments,
      activeValue,
      onValueChange,
      switcherOpen,
      onSwitcherOpenChange,
      wideSelectorRef,
      promote,
      onManageEnvironments,
    },
    ref,
  ) => {
    const stacked = useMediaQuery(breakpoints.stacked);
    const sheetTitleId = useId();
    const active =
      environments.find((env) => env.value === activeValue) ?? environments[0];
    if (!active) return null;

    const renderPromote = (className: string) =>
      promote ? (
        <Button
          variant="secondary"
          size="sm"
          className={className}
          onClick={promote.onClick}
        >
          {promote.label}
          <Icon name="chevron_right" size="sm" />
        </Button>
      ) : null;

    if (stacked) {
      return (
        <div ref={ref} className={styles.stackedCard}>
          <div className={styles.cardHead}>
            <span className={styles.cardIcon}>
              <Icon name="hourglass" size="md" />
            </span>
            <button
              type="button"
              className={styles.cardTrigger}
              aria-haspopup="dialog"
              aria-expanded={switcherOpen}
              aria-label={`Switch environment, current: ${active.label}`}
              onClick={() => onSwitcherOpenChange(true)}
            >
              <span className={styles.cardName}>
                {active.label}
                <Icon name="expand_more" size="xs" />
              </span>
              <span className={styles.envDeploy}>
                Last deployment: {active.lastDeployment}
              </span>
            </button>
            <span
              className={cn(
                styles.cardPipeline,
                styles[active.pipelineVariant],
              )}
            >
              <StatusDot variant={active.pipelineVariant} label="" />
              {active.pipelineLabel}
            </span>
          </div>
          {renderPromote(styles.cardPromote)}
          <BottomSheet
            open={switcherOpen}
            onClose={() => onSwitcherOpenChange(false)}
            aria-labelledby={sheetTitleId}
          >
            <div className={styles.sheet}>
              <h2 id={sheetTitleId} className={styles.sheetTitle}>
                Switch environment
              </h2>
              <OptionList
                className={styles.sheetOptions}
                options={environments.map((env) => ({
                  value: env.value,
                  label: env.label,
                  description: `Last deployment: ${env.lastDeployment}`,
                  meta: env.reviewStatus,
                }))}
                value={active.value}
                onSelect={(value) => {
                  onValueChange(value);
                  onSwitcherOpenChange(false);
                }}
                action={
                  onManageEnvironments
                    ? {
                        label: 'Manage environments',
                        icon: 'settings',
                        onClick: () => {
                          onManageEnvironments();
                          onSwitcherOpenChange(false);
                        },
                      }
                    : undefined
                }
                renderOptionIndicator={(option) => {
                  const env = environments.find(
                    (e) => e.value === option.value,
                  );
                  return (
                    <StatusDot
                      variant={env ? env.healthVariant : 'info'}
                      label=""
                    />
                  );
                }}
                aria-label="Environment"
              />
            </div>
          </BottomSheet>
        </div>
      );
    }

    return (
      <div ref={ref} className={styles.wideBar}>
        <Selector
          ref={wideSelectorRef}
          variant="inline"
          triggerPrefix={
            <span className={styles.envIcon}>
              <Icon name="hourglass" size="md" />
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
          value={active.value}
          onValueChange={onValueChange}
          open={switcherOpen}
          onOpenChange={onSwitcherOpenChange}
          action={
            onManageEnvironments
              ? {
                  label: 'Manage environments',
                  icon: 'settings',
                  onClick: onManageEnvironments,
                }
              : undefined
          }
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
                variant={env ? env.healthVariant : 'info'}
                label={env ? env.reviewStatus : ''}
              />
            );
          }}
          aria-label={`Environment: ${active.label}`}
        />
        <span className={styles.pipelineStatus}>
          <span className={styles.pipelineLabel}>Pipeline status</span>
          <span
            className={cn(styles.pipelineValue, styles[active.pipelineVariant])}
          >
            <StatusDot variant={active.pipelineVariant} label="" />
            {active.pipelineLabel}
          </span>
        </span>
        {renderPromote(styles.promote)}
      </div>
    );
  },
);

QaEnvironmentCard.displayName = 'QaEnvironmentCard';
