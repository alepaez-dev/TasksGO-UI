import {
  forwardRef,
  useCallback,
  useRef,
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useAutoGrowTextarea } from '../../hooks/useAutoGrowTextarea';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Avatar } from '../Avatar';
import { Badge, type BadgeProps } from '../Badge';
import { Callout } from '../Callout';
import { EditToggle } from '../EditToggle';
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

export type TestScenarioSection =
  | 'waiveReason'
  | 'description'
  | 'steps'
  | 'expected'
  | 'actual';

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
  onAddEvidence?: (files: readonly File[]) => void;
  onRemoveEvidence?: (index: number) => void;
  maxEvidence?: number;
  evidenceAccept?: string;
  editingSections?: readonly TestScenarioSection[];
  onEditingSectionsChange?: (sections: readonly TestScenarioSection[]) => void;
  onWaiveReasonChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onExpectedChange?: (value: string) => void;
  onActualChange?: (value: string) => void;
  onStepsChange?: (steps: readonly string[]) => void;
  stepsExpanded?: boolean;
  onStepsExpandedChange?: (expanded: boolean) => void;
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
const STEPS_PREVIEW_COUNT = 3;

function toStatus(value: string): TestScenarioStatus | undefined {
  return STATUS_ORDER.find((status) => status === value);
}

function IndicatorGlyph({ status }: { status: TestScenarioStatus }): ReactNode {
  if (status === 'passed') return <Icon name="check" size="xs" />;
  if (status === 'failed') return <Icon name="close" size="xs" />;
  if (status === 'pending') return <Icon name="more_horiz" size="xs" />;
  return null;
}

interface StepEditorRowProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  onRemove: () => void;
}

function StepEditorRow({
  index,
  value,
  onChange,
  onEnter,
  onRemove,
}: StepEditorRowProps): ReactNode {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoGrowTextarea(textareaRef, value);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    const textarea = textareaRef.current;
    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      const start = textarea?.selectionStart ?? value.length;
      const end = textarea?.selectionEnd ?? value.length;
      onChange(`${value.slice(0, start)}\n${value.slice(end)}`);
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) el.selectionStart = el.selectionEnd = start + 1;
      });
      return;
    }
    onEnter();
  };

  return (
    <div className={styles.stepRow}>
      <span className={styles.stepNumber} aria-hidden="true">
        {index + 1}
      </span>
      <textarea
        ref={textareaRef}
        rows={1}
        className={styles.stepInput}
        aria-label={`Step ${index + 1}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className={styles.evidenceRemove}
        aria-label={`Remove step ${index + 1}`}
        onClick={onRemove}
      >
        <Icon name="close" size="xs" />
      </button>
    </div>
  );
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
      onAddEvidence,
      onRemoveEvidence,
      maxEvidence,
      evidenceAccept,
      editingSections = [],
      onEditingSectionsChange,
      onWaiveReasonChange,
      onDescriptionChange,
      onExpectedChange,
      onActualChange,
      onStepsChange,
      stepsExpanded = false,
      onStepsExpandedChange,
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
    const evidenceLimit =
      maxEvidence != null && maxEvidence >= 1 ? maxEvidence : undefined;
    const limitReached =
      evidenceLimit != null && evidenceItems.length >= evidenceLimit;
    const stepItems = steps ?? [];
    const canToggleSteps = stepItems.length > STEPS_PREVIEW_COUNT;
    const visibleSteps = stepsExpanded
      ? stepItems
      : stepItems.slice(0, STEPS_PREVIEW_COUNT);
    const hiddenStepsCount = stepItems.length - STEPS_PREVIEW_COUNT;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const stepEditorRef = useRef<HTMLDivElement>(null);
    const statusSelectRef = useRef<HTMLDivElement>(null);
    const closeStatusSelect = useCallback(
      () => onStatusSelectOpenChange?.(false),
      [onStatusSelectOpenChange],
    );
    useClickOutside(statusSelectRef, closeStatusSelect, statusSelectOpen);

    const handleEvidenceFiles = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) onAddEvidence?.(Array.from(files));
      event.target.value = '';
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
              <span className={styles.bylineSep} aria-hidden="true" />
              <span>{byline}</span>
            </span>
          </span>

          <Avatar
            variant="profile"
            size="sm"
            className={styles.assignee}
            initial={assigneeInitial}
            aria-label={assigneeLabel}
            tint={assigneeColor}
          />

          <Selector
            ref={statusSelectRef}
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
            className={cn(
              styles.chevron,
              styles.headerChevron,
              open && styles.chevronOpen,
            )}
          />
        </div>

        {open && (
          <div id={bodyId} className={styles.body}>
            {status === 'waived' && (waiveReason || onWaiveReasonChange) && (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <SectionHeader headingLevel={3}>Waive Reason</SectionHeader>
                  {onWaiveReasonChange &&
                    (isEditing('waiveReason') || waiveReason) && (
                      <EditToggle
                        className={
                          isEditing('waiveReason')
                            ? undefined
                            : styles.sectionEdit
                        }
                        editing={isEditing('waiveReason')}
                        onEditingChange={(next) =>
                          setSectionEditing('waiveReason', next)
                        }
                      />
                    )}
                </div>
                {isEditing('waiveReason') && onWaiveReasonChange ? (
                  <div className={cn(styles.calloutEditor, styles.toneWarning)}>
                    <textarea
                      className={styles.editorTextarea}
                      aria-label="Waive Reason"
                      value={waiveReason ?? ''}
                      onChange={(e) => onWaiveReasonChange(e.target.value)}
                    />
                  </div>
                ) : waiveReason ? (
                  <Callout variant="warning">
                    <Markdown source={waiveReason} />
                  </Callout>
                ) : onWaiveReasonChange ? (
                  <button
                    type="button"
                    className={styles.addStep}
                    onClick={() => setSectionEditing('waiveReason', true)}
                  >
                    <Icon name="add" size="xs" />
                    Add reason
                  </button>
                ) : null}
              </section>
            )}

            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <SectionHeader headingLevel={3}>Description</SectionHeader>
                {onDescriptionChange && (
                  <EditToggle
                    className={
                      isEditing('description') ? undefined : styles.sectionEdit
                    }
                    editing={isEditing('description')}
                    onEditingChange={(next) =>
                      setSectionEditing('description', next)
                    }
                  />
                )}
              </div>
              {isEditing('description') && onDescriptionChange ? (
                <textarea
                  className={styles.editorTextarea}
                  aria-label="Description"
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                />
              ) : (
                <Markdown source={description} />
              )}
            </section>

            {((steps && steps.length > 0) || onStepsChange) && (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <SectionHeader headingLevel={3}>
                    Steps to Reproduce
                  </SectionHeader>
                  {onStepsChange &&
                    (isEditing('steps') || stepItems.length > 0) && (
                      <EditToggle
                        className={
                          isEditing('steps') ? undefined : styles.sectionEdit
                        }
                        editing={isEditing('steps')}
                        onEditingChange={(next) =>
                          setSectionEditing('steps', next)
                        }
                      />
                    )}
                </div>
                {isEditing('steps') && onStepsChange ? (
                  <div className={styles.stepEditor} ref={stepEditorRef}>
                    {(steps ?? []).map((step, index) => (
                      <StepEditorRow
                        key={index}
                        index={index}
                        value={step}
                        onChange={(value) =>
                          onStepsChange(
                            (steps ?? []).map((s, i) =>
                              i === index ? value : s,
                            ),
                          )
                        }
                        onEnter={() => {
                          const src = steps ?? [];
                          onStepsChange([
                            ...src.slice(0, index + 1),
                            '',
                            ...src.slice(index + 1),
                          ]);
                          requestAnimationFrame(() => {
                            const areas =
                              stepEditorRef.current?.querySelectorAll(
                                'textarea',
                              );
                            areas?.[index + 1]?.focus();
                          });
                        }}
                        onRemove={() =>
                          onStepsChange(
                            (steps ?? []).filter((_, i) => i !== index),
                          )
                        }
                      />
                    ))}
                    <button
                      type="button"
                      className={styles.addStep}
                      onClick={() => onStepsChange([...(steps ?? []), ''])}
                    >
                      <Icon name="add" size="xs" />
                      Add step
                    </button>
                  </div>
                ) : stepItems.length > 0 ? (
                  <>
                    <StepList steps={visibleSteps} dividers />
                    {canToggleSteps && (
                      <button
                        type="button"
                        className={styles.stepsToggle}
                        aria-expanded={stepsExpanded}
                        onClick={() => onStepsExpandedChange?.(!stepsExpanded)}
                      >
                        <Icon
                          name="expand_more"
                          size="xs"
                          className={cn(
                            styles.chevron,
                            stepsExpanded && styles.chevronOpen,
                          )}
                        />
                        {stepsExpanded
                          ? 'Show less'
                          : `Show ${hiddenStepsCount} more`}
                      </button>
                    )}
                  </>
                ) : onStepsChange ? (
                  <button
                    type="button"
                    className={styles.addStep}
                    onClick={() => {
                      onStepsChange(['']);
                      setSectionEditing('steps', true);
                    }}
                  >
                    <Icon name="add" size="xs" />
                    Add step
                  </button>
                ) : null}
              </section>
            )}

            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <SectionHeader headingLevel={3}>Expected Result</SectionHeader>
                {onExpectedChange && (
                  <EditToggle
                    className={
                      isEditing('expected') ? undefined : styles.sectionEdit
                    }
                    editing={isEditing('expected')}
                    onEditingChange={(next) =>
                      setSectionEditing('expected', next)
                    }
                  />
                )}
              </div>
              {isEditing('expected') && onExpectedChange ? (
                <div className={cn(styles.calloutEditor, styles.tonePositive)}>
                  <textarea
                    className={styles.editorTextarea}
                    aria-label="Expected Result"
                    value={expected}
                    onChange={(e) => onExpectedChange(e.target.value)}
                  />
                </div>
              ) : (
                <Callout variant="positive">
                  <Markdown source={expected} />
                </Callout>
              )}
            </section>

            {(actual || onActualChange) && (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <SectionHeader headingLevel={3}>Actual Result</SectionHeader>
                  {onActualChange && (isEditing('actual') || actual) && (
                    <EditToggle
                      className={
                        isEditing('actual') ? undefined : styles.sectionEdit
                      }
                      editing={isEditing('actual')}
                      onEditingChange={(next) =>
                        setSectionEditing('actual', next)
                      }
                    />
                  )}
                </div>
                {isEditing('actual') && onActualChange ? (
                  <div
                    className={cn(
                      styles.calloutEditor,
                      actualTone === 'critical'
                        ? styles.toneCritical
                        : styles.toneNeutral,
                    )}
                  >
                    <textarea
                      className={styles.editorTextarea}
                      aria-label="Actual Result"
                      value={actual ?? ''}
                      onChange={(e) => onActualChange(e.target.value)}
                    />
                  </div>
                ) : actual ? (
                  <Callout variant={actualTone}>
                    <Markdown source={actual} />
                  </Callout>
                ) : onActualChange ? (
                  <button
                    type="button"
                    className={styles.addStep}
                    onClick={() => setSectionEditing('actual', true)}
                  >
                    <Icon name="add" size="xs" />
                    Add actual result
                  </button>
                ) : null}
              </section>
            )}

            {(hasEvidence || onAddEvidence) && (
              <section className={styles.section}>
                <div className={styles.evidenceHeader}>
                  <SectionHeader headingLevel={3}>
                    {`Evidence (${evidenceItems.length})`}
                  </SectionHeader>
                  {evidenceLimit != null && (
                    <span
                      className={cn(
                        styles.evidenceCount,
                        limitReached && styles.evidenceCountFull,
                      )}
                    >
                      {evidenceItems.length}/{evidenceLimit}
                    </span>
                  )}
                </div>
                <div className={styles.evidence}>
                  {visibleEvidence.map((item, index) => (
                    <span key={index} className={styles.evidenceChip}>
                      <RefLabel
                        variant={item.kind === 'image' ? 'attachment' : 'doc'}
                        icon={item.kind === 'image' ? 'image' : 'description'}
                      >
                        {item.label}
                      </RefLabel>
                      {onRemoveEvidence && (
                        <button
                          type="button"
                          className={styles.evidenceRemove}
                          aria-label={`Remove ${item.label}`}
                          onClick={() => onRemoveEvidence(index)}
                        >
                          <Icon name="close" size="xs" />
                        </button>
                      )}
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
                  {onAddEvidence && (
                    <>
                      <button
                        type="button"
                        className={styles.addEvidence}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={limitReached}
                      >
                        <Icon name="file_upload" size="xs" />
                        {limitReached ? 'Limit reached' : 'Add evidence'}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={evidenceAccept}
                        multiple
                        className={styles.addEvidenceInput}
                        onChange={handleEvidenceFiles}
                        aria-hidden="true"
                        tabIndex={-1}
                      />
                    </>
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
