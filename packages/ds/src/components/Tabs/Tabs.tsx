import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cn } from '../../utils/cn';
import styles from './Tabs.module.css';

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  items: readonly TabItem[];
  value: string;
  onValueChange: (value: string) => void;
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
      idPrefix,
      'aria-label': ariaLabel,
      className,
      ...rest
    },
    ref,
  ) => {
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const findNextEnabled = (start: number, step: 1 | -1): number => {
      const n = items.length;
      for (let i = 1; i <= n; i++) {
        const idx = (start + step * i + n) % n;
        if (!items[idx].disabled) return idx;
      }
      return start;
    };

    const findFirstEnabled = (): number => {
      const i = items.findIndex((it) => !it.disabled);
      return i === -1 ? -1 : i;
    };

    const findLastEnabled = (): number => {
      for (let i = items.length - 1; i >= 0; i--) {
        if (!items[i].disabled) return i;
      }
      return -1;
    };

    const activateIndex = (idx: number) => {
      if (idx < 0) return;
      const target = items[idx];
      buttonRefs.current[idx]?.focus();
      if (target.value !== value) {
        onValueChange(target.value);
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      currentIndex: number,
    ) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          activateIndex(findNextEnabled(currentIndex, 1));
          break;
        case 'ArrowLeft':
          event.preventDefault();
          activateIndex(findNextEnabled(currentIndex, -1));
          break;
        case 'Home':
          event.preventDefault();
          activateIndex(findFirstEnabled());
          break;
        case 'End':
          event.preventDefault();
          activateIndex(findLastEnabled());
          break;
      }
    };

    const selectedIndex = items.findIndex((it) => it.value === value);
    const focusableIndex =
      selectedIndex !== -1 && !items[selectedIndex].disabled
        ? selectedIndex
        : findFirstEnabled();

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={cn(styles.tablist, className)}
        {...rest}
      >
        {items.map((item, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              key={item.value}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={idPrefix ? getTabId(idPrefix, item.value) : undefined}
              aria-controls={
                idPrefix ? getTabPanelId(idPrefix, item.value) : undefined
              }
              aria-selected={selected}
              disabled={item.disabled}
              tabIndex={index === focusableIndex ? 0 : -1}
              className={cn(
                styles.tab,
                selected && styles.selected,
                item.disabled && styles.disabled,
              )}
              onClick={() => {
                if (item.disabled) return;
                if (item.value !== value) onValueChange(item.value);
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
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
