import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Avatar } from '../Avatar';
import { Badge, type BadgeProps } from '../Badge';
import { Callout } from '../Callout';
import { Icon } from '../Icon';
import { Markdown } from '../Markdown';
import { RefLabel } from '../RefLabel';
import { SectionHeader } from '../SectionHeader';
import { Selector } from '../Selector';
import { StepList } from '../StepList';
import { TicketId } from '../TicketId';
import { cn } from '../../utils/cn';
import styles from './TestScenarioCard.module.css';

export type TestScenarioStatus = 'passed' | 'failed' | 'pending' | 'waived';

export interface TestScenarioEvidence {
  label: string;
  kind: 'image' | 'file';
}

export interface TestScenarioCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  caseId: string;
  title: string;
  status: TestScenarioStatus;
  byline: string;
  assigneeInitial: string;
  assigneeLabel: string;
  assigneeColor?: string;
  description: string;
  steps?: readonly string[];
  evidence?: readonly TestScenarioEvidence[];
  expected: string;
  actual?: string;
  waiveReason?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  statusSelectOpen?: boolean;
  onStatusSelectOpenChange?: (open: boolean) => void;
  onStatusChange?: (status: TestScenarioStatus) => void;
  evidenceExpanded?: boolean;
  onEvidenceExpandedChange?: (expanded: boolean) => void;
}

const STATUS_ORDER: readonly TestScenarioStatus[] = [
  'passed',
  'failed',
  'pending',
  'waived',
];

const STATUS_LABEL: Record<TestScenarioStatus, string> = {
  passed: 'Passed',
  failed: 'Failed',
  pending: 'Pending',
  waived: 'Waived',
};

const STATUS_BADGE: Record<TestScenarioStatus, BadgeProps['variant']> = {
  passed: 'success',
  failed: 'critical',
  pending: 'default',
  waived: 'waived',
};

const STATUS_OPTIONS = STATUS_ORDER.map((value) => ({
  value,
  label: STATUS_LABEL[value],
}));

const EVIDENCE_PREVIEW_COUNT = 3;

function toStatus(value: string): TestScenarioStatus | undefined {
  return STATUS_ORDER.find((status) => status === value);
}

function IndicatorGlyph({ status }: { status: TestScenarioStatus }): ReactNode {
  if (status === 'passed') return <Icon name="check" size="xs" />;
  if (status === 'failed') return <Icon name="close" size="xs" />;
  if (status === 'pending') return <Icon name="more_horiz" size="xs" />;
  return null;
}

export const TestScenarioCard = forwardRef<
  HTMLDivElement,
  TestScenarioCardProps
>(
  (
    {
      caseId,
      title,
      status,
      byline,
      assigneeInitial,
      assigneeLabel,
      assigneeColor,
      description,
      steps,
      evidence,
      expected,
      actual,
      waiveReason,
      open = false,
      onOpenChange,
      statusSelectOpen = false,
      onStatusSelectOpenChange,
      onStatusChange,
      evidenceExpanded = false,
      onEvidenceExpandedChange,
      className,
      ...rest
    },
    ref,
  ) => {
    const bodyId = `${caseId}-body`;
    const actualTone = status === 'failed' ? 'critical' : 'neutral';
    const evidenceItems = evidence ?? [];
    const hasEvidence = evidenceItems.length > 0;
    const canToggleEvidence = evidenceItems.length > EVIDENCE_PREVIEW_COUNT;
    const visibleEvidence = evidenceExpanded
      ? evidenceItems
      : evidenceItems.slice(0, EVIDENCE_PREVIEW_COUNT);
    const hiddenEvidenceCount = evidenceItems.length - EVIDENCE_PREVIEW_COUNT;

    return (
      <div
        ref={ref}
        className={cn(styles.card, className)}
        data-status={status}
        {...rest}
      >
        <div className={styles.header}>
          <button
            type="button"
            className={styles.headerToggle}
            aria-expanded={open}
            aria-controls={open ? bodyId : undefined}
            aria-label={
              open ? `Collapse scenario ${title}` : `Expand scenario ${title}`
            }
            onClick={() => onOpenChange?.(!open)}
          />
          <span
            className={cn(styles.indicator, styles[status])}
            aria-hidden="true"
          >
            <IndicatorGlyph status={status} />
          </span>
          <span className={styles.srOnly}>{STATUS_LABEL[status]}:</span>

          <span className={styles.titleBlock}>
            <span className={styles.title}>{title}</span>
            <span className={styles.byline}>
              <TicketId>{caseId}</TicketId>
              <span className={styles.bylineSep} aria-hidden="true">
                &middot;
              </span>
              <span>{byline}</span>
            </span>
          </span>

          <Avatar
            variant="profile"
            size="sm"
            initial={assigneeInitial}
            aria-label={assigneeLabel}
            tint={assigneeColor}
          />

          <Selector
            className={styles.statusSelect}
            showChevron={false}
            options={STATUS_OPTIONS}
            value={status}
            onValueChange={(value) => {
              const next = toStatus(value);
              if (next) onStatusChange?.(next);
            }}
            open={statusSelectOpen}
            onOpenChange={onStatusSelectOpenChange}
            variant="inline"
            dropdownAlign="end"
            renderTriggerLabel={() => (
              <Badge variant={STATUS_BADGE[status]}>
                {STATUS_LABEL[status]}
                <Icon
                  name="expand_more"
                  size="xs"
                  className={styles.pillCaret}
                />
              </Badge>
            )}
            renderOptionIndicator={(option) => {
              const optionStatus = toStatus(option.value);
              return (
                <span
                  className={cn(
                    styles.optionDot,
                    optionStatus && styles[optionStatus],
                  )}
                />
              );
            }}
            aria-label="Set scenario status"
          />

          <Icon
            name="expand_more"
            size="md"
            className={cn(styles.chevron, open && styles.chevronOpen)}
          />
        </div>

        {open && (
          <div id={bodyId} className={styles.body}>
            {status === 'waived' && waiveReason && (
              <section className={styles.section}>
                <SectionHeader headingLevel={3}>Waive Reason</SectionHeader>
                <Callout variant="warning">
                  <Markdown source={waiveReason} />
                </Callout>
              </section>
            )}

            <section className={styles.section}>
              <SectionHeader headingLevel={3}>Description</SectionHeader>
              <Markdown source={description} />
            </section>

            {steps && steps.length > 0 && (
              <section className={styles.section}>
                <SectionHeader headingLevel={3}>
                  Steps to Reproduce
                </SectionHeader>
                <StepList steps={steps} dividers />
              </section>
            )}

            <section className={styles.section}>
              <SectionHeader headingLevel={3}>Expected Result</SectionHeader>
              <Callout variant="positive">
                <Markdown source={expected} />
              </Callout>
            </section>

            {actual && (
              <section className={styles.section}>
                <SectionHeader headingLevel={3}>Actual Result</SectionHeader>
                <Callout variant={actualTone}>
                  <Markdown source={actual} />
                </Callout>
              </section>
            )}

            {hasEvidence && (
              <section className={styles.section}>
                <SectionHeader headingLevel={3}>
                  {`Evidence (${evidenceItems.length})`}
                </SectionHeader>
                <div className={styles.evidence}>
                  {visibleEvidence.map((item, index) => (
                    <span key={index} className={styles.evidenceChip}>
                      <RefLabel
                        variant={item.kind === 'image' ? 'attachment' : 'doc'}
                        icon={item.kind === 'image' ? 'image' : 'description'}
                      >
                        {item.label}
                      </RefLabel>
                    </span>
                  ))}
                  {canToggleEvidence && (
                    <button
                      type="button"
                      className={styles.evidenceMore}
                      aria-expanded={evidenceExpanded}
                      onClick={() =>
                        onEvidenceExpandedChange?.(!evidenceExpanded)
                      }
                    >
                      <Icon
                        name="expand_more"
                        size="xs"
                        className={cn(
                          styles.chevron,
                          evidenceExpanded && styles.chevronOpen,
                        )}
                      />
                      {evidenceExpanded
                        ? 'Show less'
                        : `+${hiddenEvidenceCount} more`}
                    </button>
                  )}
                </div>
              </section>
            )}

            <div
              className={styles.actions}
              role="group"
              aria-label="Set status"
            >
              <span className={styles.actionsLabel}>Set Status</span>
              <button
                type="button"
                className={cn(styles.action, styles.actionPass)}
                onClick={() => onStatusChange?.('passed')}
              >
                <Icon name="check" size="sm" />
                Mark as Passed
              </button>
              <button
                type="button"
                className={cn(styles.action, styles.actionFail)}
                onClick={() => onStatusChange?.('failed')}
              >
                <Icon name="close" size="sm" />
                Mark as Failed
              </button>
              <button
                type="button"
                className={cn(styles.action, styles.actionWaive)}
                onClick={() => onStatusChange?.('waived')}
              >
                <span className={styles.waiveIcon} aria-hidden="true" />
                Waive
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

TestScenarioCard.displayName = 'TestScenarioCard';
