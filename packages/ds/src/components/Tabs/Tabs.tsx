import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { useRovingTabList } from '../../hooks/useRovingTabList';
import styles from './Tabs.module.css';

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

type TabsSize = 'sm' | 'md';

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  items: readonly TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  size?: TabsSize;
  idPrefix?: string;
  'aria-label'?: string;
}

export function getTabId(idPrefix: string, value: string): string {
  return `${idPrefix}-tab-${value}`;
}

export function getTabPanelId(idPrefix: string, value: string): string {
  return `${idPrefix}-panel-${value}`;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      items,
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
      items,
      value,
      onValueChange,
    );

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={cn(styles.tablist, styles[size], className)}
        {...rest}
      >
        {items.map((item, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={idPrefix ? getTabId(idPrefix, item.value) : undefined}
              aria-controls={
                idPrefix && selected
                  ? getTabPanelId(idPrefix, item.value)
                  : undefined
              }
              className={cn(
                styles.tab,
                selected && styles.selected,
                item.disabled && styles.disabled,
              )}
              {...getTabProps(index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  },
);

Tabs.displayName = 'Tabs';
