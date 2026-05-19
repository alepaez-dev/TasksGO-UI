import { Fragment, forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './PipelineStageIndicator.module.css';

export interface PipelineStage {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PipelineStageIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  items: readonly PipelineStage[];
  value: string;
  'aria-label': string;
}

function getVisibleItems(
  items: readonly PipelineStage[],
  value: string,
): readonly PipelineStage[] {
  if (items.length <= 3) return items;
  const first = items[0];
  const last = items[items.length - 1];
  const activeIndex = items.findIndex((it) => it.value === value);
  const middleIndex =
    activeIndex > 0 && activeIndex < items.length - 1
      ? activeIndex
      : Math.floor(items.length / 2);
  return [first, items[middleIndex], last];
}

export const PipelineStageIndicator = forwardRef<
  HTMLDivElement,
  PipelineStageIndicatorProps
>(({ items, value, 'aria-label': ariaLabel, className, ...rest }, ref) => {
  const visibleItems = getVisibleItems(items, value);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={cn(styles.group, className)}
      {...rest}
    >
      {visibleItems.map((item, index) => {
        const active = item.value === value;
        return (
          <Fragment key={item.value}>
            {index > 0 && (
              <span className={styles.separator} aria-hidden="true">
                ·····
              </span>
            )}
            <span
              aria-current={active ? 'step' : undefined}
              aria-disabled={item.disabled || undefined}
              className={cn(
                styles.stage,
                active && styles.active,
                item.disabled && styles.disabled,
              )}
            >
              {item.label}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
});

PipelineStageIndicator.displayName = 'PipelineStageIndicator';
