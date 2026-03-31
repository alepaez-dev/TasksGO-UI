import {
  forwardRef,
  useCallback,
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

type OptionBase = Readonly<{ value: string; label: string }>;
type DotOption = OptionBase & {
  icon?: never;
  iconColor?: never;
  prefix?: never;
};
type IconOption = OptionBase & {
  icon: IconName;
  iconColor?: string;
  prefix?: never;
};
type PrefixOption = OptionBase & {
  prefix: string;
  icon?: never;
  iconColor?: never;
};

export type SelectorOption = DotOption | IconOption | PrefixOption;

export type SelectorAction = Readonly<{
  label: string;
  icon: IconName;
  onClick: () => void;
}>;

type DropdownAlign = 'stretch' | 'end';

type SelectorOptions =
  | readonly DotOption[]
  | readonly IconOption[]
  | readonly PrefixOption[];

export interface SelectorProps extends HTMLAttributes<HTMLDivElement> {
  options: SelectorOptions;
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  triggerPrefix?: ReactNode;
  header?: ReactNode;
  emptyState?: ReactNode;
  action?: SelectorAction;
  dropdownAlign?: DropdownAlign;
  variant?: 'default' | 'inline';
  renderTriggerLabel?: (option: SelectorOption) => ReactNode;
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
      placeholder = 'Select\u2026',
      triggerPrefix,
      header,
      emptyState,
      action,
      dropdownAlign = 'stretch',
      variant = 'default',
      renderTriggerLabel: renderTriggerLabelProp,
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
    const hasIcons = options.some((o) => o.icon !== undefined);
    const hasPrefixes = options.some((o) => o.prefix !== undefined);
    const isInline = variant === 'inline';

    const handleDropdownMount = useCallback((el: HTMLDivElement | null) => {
      if (!el) return;
      const selectedEl = el.querySelector<HTMLElement>(
        '[aria-selected="true"]',
      );
      if (selectedEl) selectedEl.scrollIntoView?.({ block: 'nearest' });

      const activeElement = el.ownerDocument.activeElement;
      if (activeElement && el.contains(activeElement)) return;

      const headerInput = el.querySelector<HTMLElement>('input, textarea');
      const first = el.querySelector<HTMLElement>('[role="option"]');
      (headerInput ?? selectedEl ?? first)?.focus();
    }, []);

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

    function renderTriggerLabel() {
      if (!selected) return placeholder;
      if (renderTriggerLabelProp) return renderTriggerLabelProp(selected);
      if (hasPrefixes && selected.prefix) {
        return `${selected.prefix} \u00b7 ${selected.label}`;
      }
      return selected.label;
    }

    function renderOptionIndicator(option: SelectorOption) {
      if (option.icon) {
        return (
          <Icon
            name={option.icon}
            size="sm"
            className={styles.optionIcon}
            style={
              option.iconColor
                ? ({
                    '--selector-icon-color': option.iconColor,
                  } as React.CSSProperties)
                : undefined
            }
          />
        );
      }
      if (option.prefix) {
        return <span className={styles.optionPrefix}>{option.prefix}</span>;
      }
      const isSelected = option.value === value;
      return (
        <span
          className={cn(
            styles.dot,
            isSelected ? styles.dotActive : styles.dotInactive,
          )}
        />
      );
    }

    return (
      <div ref={ref} className={cn(styles.selector, className)} {...rest}>
        <button
          ref={triggerRef}
          type="button"
          className={cn(styles.trigger, isInline && styles.inlineTrigger)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-label={ariaLabel}
          onClick={() => onOpenChange?.(!open)}
          onKeyDown={handleTriggerKeyDown}
        >
          {triggerPrefix && (
            <span className={styles.triggerPrefix}>{triggerPrefix}</span>
          )}
          {hasIcons && selected?.icon && (
            <Icon
              name={selected.icon}
              size="sm"
              className={styles.optionIcon}
              style={
                selected.iconColor
                  ? ({
                      '--selector-icon-color': selected.iconColor,
                    } as React.CSSProperties)
                  : undefined
              }
            />
          )}
          <span className={styles.label}>{renderTriggerLabel()}</span>
          <Icon
            name={isInline ? 'expand_more' : 'unfold_more'}
            size={isInline ? 'sm' : 'md'}
            className={styles.chevron}
          />
        </button>

        {open && (
          <div
            ref={handleDropdownMount}
            className={cn(
              styles.dropdown,
              dropdownAlign === 'end' && styles.dropdownEnd,
            )}
          >
            {header && <div className={styles.header}>{header}</div>}
            {options.length === 0 && emptyState && (
              <div className={styles.emptyState}>{emptyState}</div>
            )}
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
                    {renderOptionIndicator(option)}
                    <span className={styles.optionLabel}>{option.label}</span>
                    {isSelected && (
                      <Icon
                        name="check_circle"
                        size={isInline ? 'sm' : 'md'}
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
                  onClick={() => {
                    action.onClick();
                    onOpenChange?.(false);
                  }}
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
