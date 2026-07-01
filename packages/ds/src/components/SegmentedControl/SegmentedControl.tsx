import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { useRovingTabList } from '../../hooks/useRovingTabList';
import styles from './SegmentedControl.module.css';

export interface SegmentedControlOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SegmentedControlSize = 'sm' | 'md';

export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  options: readonly SegmentedControlOption[];
  value: string;
  onValueChange: (value: string) => void;
  size?: SegmentedControlSize;
  idPrefix?: string;
  'aria-label'?: string;
}

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
        className={cn(styles.segmented, styles[size], className)}
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
                selected && styles.selected,
                option.disabled && styles.disabled,
              )}
              {...getTabProps(index)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  },
);

SegmentedControl.displayName = 'SegmentedControl';
