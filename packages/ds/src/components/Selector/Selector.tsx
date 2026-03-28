import {
  forwardRef,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import styles from './Selector.module.css';

export type SelectorOption = Readonly<{
  value: string;
  label: string;
}>;

export type SelectorAction = Readonly<{
  label: string;
  icon: IconName;
  onClick: () => void;
}>;

export interface SelectorProps extends HTMLAttributes<HTMLDivElement> {
  options: readonly SelectorOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  triggerPrefix?: ReactNode;
  action?: SelectorAction;
}

function focusSibling(current: EventTarget, direction: 'next' | 'prev') {
  if (!(current instanceof HTMLElement)) return;
  const sibling =
    direction === 'next'
      ? current.nextElementSibling
      : current.previousElementSibling;
  if (sibling instanceof HTMLElement) {
    sibling.focus();
  }
}

export const Selector = forwardRef<HTMLDivElement, SelectorProps>(
  (
    {
      options,
      value,
      onValueChange,
      open = false,
      onOpenChange,
      placeholder = 'Select…',
      triggerPrefix,
      action,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const reactId = useId();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const selected = options.find((o) => o.value === value);
    const listboxId = `${rest.id ?? reactId}-listbox`;

    const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        if (!open) {
          e.preventDefault();
          onOpenChange?.(true);
        }
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange?.(false);
      }
    };

    const handleOptionKeyDown =
      (optionValue: string) => (e: KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            onValueChange?.(optionValue);
            onOpenChange?.(false);
            triggerRef.current?.focus();
            break;
          case 'ArrowDown':
            e.preventDefault();
            focusSibling(e.target, 'next');
            break;
          case 'ArrowUp':
            e.preventDefault();
            focusSibling(e.target, 'prev');
            break;
          case 'Escape':
            e.preventDefault();
            onOpenChange?.(false);
            triggerRef.current?.focus();
            break;
        }
      };

    return (
      <div ref={ref} className={cn(styles.selector, className)} {...rest}>
        <button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => onOpenChange?.(!open)}
          onKeyDown={handleTriggerKeyDown}
        >
          {triggerPrefix && (
            <span className={styles.triggerPrefix}>{triggerPrefix}</span>
          )}
          <span className={styles.label}>
            {selected ? selected.label : placeholder}
          </span>
          <Icon name="unfold_more" size="md" className={styles.chevron} />
        </button>

        {open && (
          <div className={styles.dropdown}>
            <div
              id={listboxId}
              role="listbox"
              className={styles.options}
              aria-label={ariaLabel ?? 'Options'}
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.value}
                    role="option"
                    tabIndex={0}
                    aria-selected={isSelected}
                    className={cn(
                      styles.option,
                      isSelected && styles.optionSelected,
                    )}
                    onClick={() => {
                      onValueChange?.(option.value);
                      onOpenChange?.(false);
                    }}
                    onKeyDown={handleOptionKeyDown(option.value)}
                  >
                    <span
                      className={cn(
                        styles.dot,
                        isSelected ? styles.dotActive : styles.dotInactive,
                      )}
                    />
                    <span className={styles.optionLabel}>{option.label}</span>
                    {isSelected && (
                      <Icon
                        name="check_circle"
                        size="md"
                        className={styles.checkIcon}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {action && (
              <div className={styles.actionWrapper}>
                <button
                  type="button"
                  className={styles.action}
                  onClick={action.onClick}
                >
                  <Icon name={action.icon} size="sm" />
                  <span>{action.label}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

Selector.displayName = 'Selector';
