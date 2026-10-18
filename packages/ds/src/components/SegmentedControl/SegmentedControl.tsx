import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { useRovingTabList } from '../../hooks/useRovingTabList';
import styles from './SegmentedControl.module.css';

export interface SegmentedControlOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

type SegmentedControlSize = 'sm' | 'md';
type SegmentedControlVariant = 'toggle' | 'filter';

export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  options: readonly SegmentedControlOption[];
  value: string;
  onValueChange: (value: string) => void;
  size?: SegmentedControlSize;
  variant?: SegmentedControlVariant;
  idPrefix?: string;
  'aria-label'?: string;
}

const variantClasses = {
  toggle: {
    list: styles.toggleList,
    segment: styles.toggle,
    selected: styles.toggleSelected,
  },
  filter: {
    list: styles.filterList,
    segment: styles.filter,
    selected: styles.filterSelected,
  },
} as const;

export function getSegmentId(idPrefix: string, value: string): string {
  return `${idPrefix}-segment-${value}`;
}

export function getSegmentPanelId(idPrefix: string, value: string): string {
  return `${idPrefix}-panel-${value}`;
}

export const SegmentedControl = forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(
  (
    {
      options,
      value,
      onValueChange,
      size = 'md',
      variant = 'toggle',
      idPrefix,
      'aria-label': ariaLabel,
      className,
      ...rest
    },
    ref,
  ) => {
    const { selectedIndex, getTabProps } = useRovingTabList(
      options,
      value,
      onValueChange,
    );

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={cn(
          styles.segmented,
          variant === 'toggle' && styles[size],
          variantClasses[variant].list,
          className,
        )}
        {...rest}
      >
        {options.map((option, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              id={idPrefix ? getSegmentId(idPrefix, option.value) : undefined}
              aria-controls={
                selected && idPrefix
                  ? getSegmentPanelId(idPrefix, option.value)
                  : undefined
              }
              className={cn(
                styles.segment,
                variantClasses[variant].segment,
                selected && styles.selected,
                selected && variantClasses[variant].selected,
                option.disabled && styles.disabled,
              )}
              {...getTabProps(index)}
            >
              {option.label}
              {option.count !== undefined && (
                <span className={styles.count}>{option.count}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  },
);

SegmentedControl.displayName = 'SegmentedControl';
