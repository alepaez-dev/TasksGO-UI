import { forwardRef, useRef, type HTMLAttributes } from 'react';
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

export interface PipelineHierarchyPanelProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect'
> {
  title: string;
  stages: readonly PipelineHierarchyStage[];
  activeValue?: string;
  onSelect?: (value: string) => void;
  onReorder?: (newStages: readonly PipelineHierarchyStage[]) => void;
  reorderHint?: string;
  addLabel?: string;
  onAddStage?: () => void;
}

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
      className,
      ...rest
    },
    ref,
  ) => {
    const listRef = useRef<HTMLUListElement>(null);
    const reorderable = onReorder !== undefined;

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
        {onAddStage && (
          <>
            <div className={styles.divider} aria-hidden="true" />
            <button
              type="button"
              className={styles.addButton}
              onClick={onAddStage}
            >
              <Icon name="add" size="sm" />
              <span>{addLabel ?? 'Add stage'}</span>
            </button>
          </>
        )}
      </div>
    );
  },
);

PipelineHierarchyPanel.displayName = 'PipelineHierarchyPanel';

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
