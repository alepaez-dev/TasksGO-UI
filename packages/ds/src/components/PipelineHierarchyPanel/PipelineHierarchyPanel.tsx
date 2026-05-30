import {
  forwardRef,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { Icon } from '../Icon';
import { StatusDot } from '../StatusDot';
import { cn } from '../../utils/cn';
import { useDragReorder } from '../../hooks/useDragReorder';
import styles from './PipelineHierarchyPanel.module.css';

export type PipelineHierarchyStageStatus =
  | 'success'
  | 'in-progress'
  | 'idle'
  | 'critical';

export interface PipelineHierarchyStage {
  value: string;
  label: string;
  status?: PipelineHierarchyStageStatus;
}

type PipelineHierarchyPanelBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect'
> & {
  title: string;
  stages: readonly PipelineHierarchyStage[];
  activeValue?: string;
  onSelect?: (value: string) => void;
  onReorder?: (newStages: readonly PipelineHierarchyStage[]) => void;
  reorderHint?: string;
  addLabel?: string;
  onAddStage?: () => void;
  addStagePlaceholder?: string;
};

export type AddStageMessage =
  | { kind: 'error'; text: string }
  | { kind: 'warning'; text: string };

// Consumers own validation (duplicate detection, format, allowed values, etc).
// onAddStageConfirm receives the trimmed value, the panel only guards empty/whitespace
// and addStageMessage.kind === 'error'.
type AddStageEditorState =
  | {
      addingStage?: false;
      addStageValue?: never;
      onAddStageValueChange?: never;
      onAddStageConfirm?: never;
      onAddStageCancel?: never;
      addStageMessage?: never;
    }
  | {
      addingStage: true;
      addStageValue: string;
      onAddStageValueChange: (value: string) => void;
      onAddStageConfirm: (value: string) => void;
      onAddStageCancel: () => void;
      addStageMessage?: AddStageMessage;
    };

export type PipelineHierarchyPanelProps = PipelineHierarchyPanelBaseProps &
  AddStageEditorState;

const statusVariant: Record<
  PipelineHierarchyStageStatus,
  'active' | 'info' | 'low' | 'critical'
> = {
  success: 'active',
  'in-progress': 'info',
  idle: 'low',
  critical: 'critical',
};

const statusLabel: Record<PipelineHierarchyStageStatus, string> = {
  success: 'Passing',
  'in-progress': 'In progress',
  idle: 'Idle',
  critical: 'Failing',
};

const DEFAULT_ADD_LABEL = 'Add stage';

export const PipelineHierarchyPanel = forwardRef<
  HTMLDivElement,
  PipelineHierarchyPanelProps
>(
  (
    {
      title,
      stages,
      activeValue,
      onSelect,
      onReorder,
      reorderHint,
      addLabel,
      onAddStage,
      addingStage = false,
      addStageValue = '',
      addStagePlaceholder,
      onAddStageValueChange,
      onAddStageConfirm,
      onAddStageCancel = () => {},
      addStageMessage,
      className,
      ...rest
    },
    ref,
  ) => {
    const listRef = useRef<HTMLUListElement>(null);
    const reorderable = onReorder !== undefined;
    const trimmedAddStageValue = addStageValue.trim();
    const canConfirmAddStage =
      trimmedAddStageValue.length > 0 && addStageMessage?.kind !== 'error';
    const showAddRegion = onAddStage !== undefined || addingStage;

    const { onPointerDown, onKeyDown } = useDragReorder({
      items: stages,
      onReorder,
      listRef,
      classes: {
        dragging: styles.dragging,
        dropAbove: styles.dropAbove,
        dropBelow: styles.dropBelow,
        floatingClone: styles.floatingClone,
        floatingCloneLifted: styles.floatingCloneLifted,
      },
    });

    return (
      <div ref={ref} className={cn(styles.panel, className)} {...rest}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {reorderHint && <span className={styles.hint}>{reorderHint}</span>}
        </div>
        <ul ref={listRef} className={styles.list}>
          {stages.map((stage, index) => {
            const isActive = stage.value === activeValue;
            const selectable = onSelect !== undefined;
            const rowContent = (
              <RowContents stage={stage} isActive={isActive} />
            );
            return (
              <li
                key={stage.value}
                className={cn(
                  styles.row,
                  selectable && styles.selectable,
                  isActive && styles.rowActive,
                )}
              >
                {reorderable && (
                  <button
                    type="button"
                    className={styles.dragHandle}
                    aria-label={`Reorder ${stage.label}`}
                    onPointerDown={(e) => onPointerDown(e, index)}
                    onKeyDown={(e) => onKeyDown(e, index)}
                  >
                    <Icon name="drag_indicator" size="sm" />
                  </button>
                )}
                {selectable ? (
                  <button
                    type="button"
                    className={styles.rowButton}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => onSelect?.(stage.value)}
                  >
                    {rowContent}
                  </button>
                ) : (
                  <div
                    className={styles.rowStatic}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {rowContent}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {showAddRegion && (
          <>
            <div className={styles.divider} aria-hidden="true" />
            {addingStage ? (
              <AddStageEditor
                reorderable={reorderable}
                value={addStageValue}
                placeholder={addStagePlaceholder}
                ariaLabel={addLabel ?? DEFAULT_ADD_LABEL}
                canConfirm={canConfirmAddStage}
                message={addStageMessage}
                onValueChange={onAddStageValueChange}
                onConfirm={() => {
                  if (canConfirmAddStage) {
                    onAddStageConfirm?.(trimmedAddStageValue);
                  }
                }}
                onCancel={onAddStageCancel}
              />
            ) : (
              <button
                type="button"
                className={styles.addButton}
                onClick={onAddStage}
              >
                <Icon name="add" size="sm" />
                <span>{addLabel ?? DEFAULT_ADD_LABEL}</span>
              </button>
            )}
          </>
        )}
      </div>
    );
  },
);

PipelineHierarchyPanel.displayName = 'PipelineHierarchyPanel';

function AddStageEditor({
  reorderable,
  value,
  placeholder,
  ariaLabel,
  canConfirm,
  message,
  onValueChange,
  onConfirm,
  onCancel,
}: {
  reorderable: boolean;
  value: string;
  placeholder?: string;
  ariaLabel: string;
  canConfirm: boolean;
  message?: AddStageMessage;
  onValueChange?: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (canConfirm) onConfirm();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  }

  return (
    <div className={styles.editor}>
      <div className={styles.editorRow}>
        {reorderable && (
          <span className={styles.editorSpacer} aria-hidden="true" />
        )}
        <input
          ref={inputRef}
          type="text"
          className={styles.editorInput}
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-invalid={message?.kind === 'error' || undefined}
          onChange={(event) => onValueChange?.(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={styles.editorAction}
          aria-label="Cancel"
          onClick={onCancel}
        >
          <Icon name="close" size="sm" />
        </button>
        <button
          type="button"
          className={cn(styles.editorAction, styles.editorConfirm)}
          aria-label="Confirm"
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          <Icon name="check" size="sm" />
        </button>
      </div>
      {message && (
        <div
          className={cn(
            styles.editorMessage,
            message.kind === 'error'
              ? styles.editorMessageError
              : styles.editorMessageWarning,
          )}
          role={message.kind === 'error' ? 'alert' : 'status'}
        >
          {reorderable && (
            <span className={styles.editorSpacer} aria-hidden="true" />
          )}
          <Icon
            name={message.kind === 'error' ? 'cancel' : 'warning'}
            size="sm"
          />
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}

function RowContents({
  stage,
  isActive,
}: {
  stage: PipelineHierarchyStage;
  isActive: boolean;
}) {
  return (
    <>
      <span className={styles.label}>{stage.label}</span>
      <span className={styles.indicators}>
        {stage.status && (
          <StatusDot
            variant={statusVariant[stage.status]}
            label={statusLabel[stage.status]}
          />
        )}
        {isActive && (
          <Icon name="check_circle" size="sm" className={styles.activeMark} />
        )}
      </span>
    </>
  );
}
