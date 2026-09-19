import {
  forwardRef,
  useCallback,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Avatar } from '../Avatar';
import { Badge, type BadgeProps } from '../Badge';
import { BottomSheet } from '../BottomSheet';
import { OptionList } from '../OptionList';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { SectionHeader } from '../SectionHeader';
import { Selector } from '../Selector';
import { TicketId } from '../TicketId';
import { cn } from '../../utils/cn';
import { EditableTitle } from '../EditableTitle';
import { EditableSection } from './EditableSection';
import { StepsSection } from './StepsSection';
import { EvidenceInput } from '../_internal/EvidenceInput';
import { breakpoints } from '../../tokens/interaction';
import { type EvidenceItem } from '../../types/evidence';
import controls from '../_internal/controls.module.css';
import styles from './TestScenarioCard.module.css';

export type TestScenarioStatus = 'passed' | 'failed' | 'pending' | 'waived';

export type TestScenarioCardPosition =
  | 'standalone'
  | 'first'
  | 'middle'
  | 'last';

export type TestScenarioSection =
  | 'title'
  | 'waiveReason'
  | 'description'
  | 'steps'
  | 'expected'
  | 'actual';

export type TestScenarioEvidence = EvidenceItem;

export interface TestScenarioCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  caseId: string;
  title: string;
  status: TestScenarioStatus;
  position?: TestScenarioCardPosition;
  byline: string;
  assigneeInitial: string;
  assigneeLabel: string;
  description: string;
  expected: string;
  assigneeColor?: string;
  steps?: readonly string[];
  evidence?: readonly TestScenarioEvidence[];
  actual?: string;
  waiveReason?: string;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  statusSelectOpen: boolean;
  onStatusSelectOpenChange: (open: boolean) => void;
  evidenceExpanded?: boolean;
  onEvidenceExpandedChange?: (expanded: boolean) => void;
  stepsExpanded?: boolean;
  onStepsExpandedChange?: (expanded: boolean) => void;

  editingSections?: readonly TestScenarioSection[];
  onEditingSectionsChange?: (sections: readonly TestScenarioSection[]) => void;
  onTitleChange?: (value: string) => void;
  onWaiveReasonChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onExpectedChange?: (value: string) => void;
  onActualChange?: (value: string) => void;
  onStepsChange?: (steps: readonly string[]) => void;

  onStatusChange?: (status: TestScenarioStatus) => void;
  onAddEvidence?: (files: readonly File[]) => void;
  onRemoveEvidence?: (index: number) => void;
  onOpenEvidence?: (index: number) => void;
  maxEvidence?: number;
  addEvidenceDisabled?: boolean;
  evidenceAccept?: string;
}

const STATUS_VALUES: readonly TestScenarioStatus[] = [
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

const STATUS_OPTIONS = STATUS_VALUES.map((value) => ({
  value,
  label: STATUS_LABEL[value],
}));

const STATUS_DESCRIPTION: Record<TestScenarioStatus, string> = {
  passed: 'Scenario verified as working',
  failed: 'Defect observed — record the actual result',
  pending: 'Re-open — requires a fresh actual result',
  waived: 'Skip — requires an explanation',
};

const STATUS_SHEET_OPTIONS = STATUS_VALUES.map((value) => ({
  value,
  label: STATUS_LABEL[value],
  description: STATUS_DESCRIPTION[value],
}));

const EVIDENCE_PREVIEW_COUNT = 3;

function toStatus(value: string): TestScenarioStatus | undefined {
  return STATUS_VALUES.find((status) => status === value);
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
      position = 'standalone',
      byline,
      assigneeInitial,
      assigneeLabel,
      description,
      expected,
      assigneeColor,
      steps = [],
      evidence = [],
      actual,
      waiveReason,

      open = false,
      onOpenChange,
      statusSelectOpen,
      onStatusSelectOpenChange,
      evidenceExpanded = false,
      onEvidenceExpandedChange,
      stepsExpanded = false,
      onStepsExpandedChange,

      editingSections = [],
      onEditingSectionsChange,
      onTitleChange,
      onWaiveReasonChange,
      onDescriptionChange,
      onExpectedChange,
      onActualChange,
      onStepsChange,

      onStatusChange,
      onAddEvidence,
      onRemoveEvidence,
      onOpenEvidence,
      maxEvidence,
      addEvidenceDisabled = false,
      evidenceAccept,

      className,
      ...rest
    },
    ref,
  ) => {
    const bodyId = `${caseId}-body`;
    const statusSheetTitleId = `${caseId}-status-sheet`;
    const actualTone = status === 'failed' ? 'critical' : 'neutral';
    const hasEvidence = evidence.length > 0;
    // maxEvidence is display-only — the consumer owns the array and the Add control
    const evidenceLimit =
      maxEvidence != null ? Math.max(0, maxEvidence) : undefined;
    const atEvidenceLimit =
      evidenceLimit != null && evidence.length >= evidenceLimit;
    const bodyRef = useRef<HTMLDivElement>(null);
    const statusSelectRef = useRef<HTMLDivElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const closeStatusSelect = useCallback(
      () => onStatusSelectOpenChange(false),
      [onStatusSelectOpenChange],
    );
    const stacked = useMediaQuery(breakpoints.stacked);
    useClickOutside(
      statusSelectRef,
      closeStatusSelect,
      statusSelectOpen && !stacked,
    );

    const applyStatus = (next: TestScenarioStatus) => {
      onStatusChange?.(next);
      requestAnimationFrame(() => {
        const action =
          actionsRef.current?.querySelector<HTMLButtonElement>('button');
        if (action) action.focus();
        else
          statusSelectRef.current
            ?.querySelector<HTMLButtonElement>('button')
            ?.focus();
      });
    };

    const statusBadge = (
      <Badge variant={STATUS_BADGE[status]}>
        <span className={cn(styles.pillDot, styles[status])} />
        {STATUS_LABEL[status]}
        <Icon name="expand_more" size="xs" className={styles.pillCaret} />
      </Badge>
    );

    const renderStatusDot = (option: { value: string }) => {
      const optionStatus = toStatus(option.value);
      return (
        <span
          className={cn(styles.optionDot, optionStatus && styles[optionStatus])}
        />
      );
    };

    const isEditing = (key: TestScenarioSection) =>
      editingSections.includes(key);
    const setSectionEditing = (key: TestScenarioSection, next: boolean) => {
      const without = editingSections.filter((k) => k !== key);
      onEditingSectionsChange?.(next ? [...without, key] : without);
    };

    return (
      <div
        ref={ref}
        {...rest}
        className={cn(styles.card, className)}
        data-status={status}
        data-position={position}
        data-stacked={stacked || undefined}
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
            {onTitleChange ? (
              <EditableTitle
                as="span"
                titleClassName={styles.title}
                editButton={stacked ? 'always-icon' : 'always'}
                toggleClassName={styles.titleEdit}
                aria-label="Scenario title"
                value={title}
                editing={isEditing('title')}
                onEditingChange={(next) => setSectionEditing('title', next)}
                onChange={onTitleChange}
              />
            ) : (
              <span className={styles.title}>{title}</span>
            )}
            <span className={styles.byline}>
              <TicketId>{caseId}</TicketId>
              <span className={styles.bylineSep} aria-hidden="true" />
              <span>{byline}</span>
            </span>
          </span>

          {!stacked && (
            <Avatar
              variant="profile"
              size="sm"
              className={styles.assignee}
              initial={assigneeInitial}
              aria-label={assigneeLabel}
              tint={assigneeColor}
            />
          )}

          {stacked ? (
            <button
              type="button"
              className={cn(styles.statusSelect, styles.statusTrigger)}
              aria-haspopup="dialog"
              aria-expanded={statusSelectOpen}
              aria-label="Set scenario status"
              onClick={() => onStatusSelectOpenChange(true)}
            >
              {statusBadge}
            </button>
          ) : (
            <Selector
              ref={statusSelectRef}
              className={cn(
                styles.statusSelect,
                statusSelectOpen && styles.statusSelectOpen,
              )}
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
              renderTriggerLabel={() => statusBadge}
              renderOptionIndicator={renderStatusDot}
              aria-label="Set scenario status"
            />
          )}

          <Icon
            name="expand_more"
            size="sm"
            className={cn(
              controls.chevron,
              styles.headerChevron,
              open && controls.chevronOpen,
            )}
          />
        </div>

        {open && (
          <div ref={bodyRef} id={bodyId} className={styles.body} tabIndex={-1}>
            <div className={styles.bodyInner}>
              {status === 'waived' && (waiveReason || onWaiveReasonChange) && (
                <EditableSection
                  editIconOnly={stacked}
                  title="Waive Reason"
                  value={waiveReason ?? ''}
                  editing={isEditing('waiveReason')}
                  onEditingChange={(next) =>
                    setSectionEditing('waiveReason', next)
                  }
                  onChange={onWaiveReasonChange}
                  tone="warning"
                  addLabel="Add reason"
                />
              )}

              <EditableSection
                editIconOnly={stacked}
                title="Description"
                value={description}
                editing={isEditing('description')}
                onEditingChange={(next) =>
                  setSectionEditing('description', next)
                }
                onChange={onDescriptionChange}
              />

              <StepsSection
                editIconOnly={stacked}
                steps={steps}
                onStepsChange={onStepsChange}
                editing={isEditing('steps')}
                onEditingChange={(next) => setSectionEditing('steps', next)}
                expanded={stepsExpanded}
                onExpandedChange={onStepsExpandedChange}
              />

              <EditableSection
                editIconOnly={stacked}
                title="Expected Result"
                value={expected}
                editing={isEditing('expected')}
                onEditingChange={(next) => setSectionEditing('expected', next)}
                onChange={onExpectedChange}
                tone="positive"
              />

              {(actual || onActualChange) && (
                <EditableSection
                  editIconOnly={stacked}
                  title="Actual Result"
                  value={actual ?? ''}
                  editing={isEditing('actual')}
                  onEditingChange={(next) => setSectionEditing('actual', next)}
                  onChange={onActualChange}
                  tone={actualTone}
                  addLabel="Add actual result"
                />
              )}

              {(hasEvidence || onAddEvidence) && (
                <section className={styles.section}>
                  <div className={styles.evidenceHeader}>
                    <SectionHeader headingLevel={3}>
                      {`Evidence (${evidence.length})`}
                    </SectionHeader>
                    {evidenceLimit != null && (
                      <span
                        className={cn(
                          styles.evidenceCount,
                          atEvidenceLimit && styles.evidenceCountFull,
                        )}
                      >
                        {evidence.length}/{evidenceLimit}
                      </span>
                    )}
                  </div>
                  <EvidenceInput
                    stacked={stacked}
                    items={evidence}
                    onAddFiles={onAddEvidence}
                    onRemove={onRemoveEvidence}
                    onOpenItem={onOpenEvidence}
                    limitLabel={evidenceLimit}
                    accept={evidenceAccept}
                    addDisabled={addEvidenceDisabled}
                    previewCount={EVIDENCE_PREVIEW_COUNT}
                    expanded={evidenceExpanded}
                    onExpandedChange={onEvidenceExpandedChange}
                    onFocusFallback={() => bodyRef.current?.focus()}
                  />
                </section>
              )}

              {!stacked && (
                <div
                  className={styles.actions}
                  role="group"
                  aria-label="Set status"
                  ref={actionsRef}
                >
                  <span className={styles.actionsLabel}>Set Status</span>
                  {status !== 'passed' && (
                    <button
                      type="button"
                      className={cn(styles.action, styles.actionPass)}
                      onClick={() => applyStatus('passed')}
                    >
                      <Icon name="check" size="sm" />
                      Mark as Passed
                    </button>
                  )}
                  {status !== 'failed' && (
                    <button
                      type="button"
                      className={cn(styles.action, styles.actionFail)}
                      onClick={() => applyStatus('failed')}
                    >
                      <Icon name="close" size="sm" />
                      Mark as Failed
                    </button>
                  )}
                  {status !== 'waived' && (
                    <button
                      type="button"
                      className={cn(styles.action, styles.actionWaive)}
                      onClick={() => applyStatus('waived')}
                    >
                      <span className={styles.waiveIcon} aria-hidden="true" />
                      Waive
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {stacked && (
          <BottomSheet
            open={statusSelectOpen}
            onClose={() => onStatusSelectOpenChange(false)}
            aria-labelledby={statusSheetTitleId}
          >
            <div className={styles.statusSheet}>
              <div className={styles.statusSheetHead}>
                <h2 id={statusSheetTitleId} className={styles.statusSheetTitle}>
                  Set status
                  <TicketId>{caseId}</TicketId>
                </h2>
                <IconButton
                  icon="close"
                  aria-label="Close status picker"
                  onClick={() => onStatusSelectOpenChange(false)}
                />
              </div>
              <OptionList
                options={STATUS_SHEET_OPTIONS}
                value={status}
                onSelect={(value) => {
                  const next = toStatus(value);
                  if (next && next !== status) onStatusChange?.(next);
                  onStatusSelectOpenChange(false);
                }}
                renderOptionIndicator={renderStatusDot}
                aria-label="Scenario status"
              />
            </div>
          </BottomSheet>
        )}
      </div>
    );
  },
);

TestScenarioCard.displayName = 'TestScenarioCard';
