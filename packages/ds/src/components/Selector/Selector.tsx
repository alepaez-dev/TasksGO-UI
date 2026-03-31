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
  size?: 'sm' | 'md';
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
      header,
      emptyState,
      action,
      dropdownAlign = 'stretch',
      size = 'md',
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
    const isSmall = size === 'sm';

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
      if (hasPrefixes && selected.prefix) {
        return `${selected.prefix} · ${selected.label}`;
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
          className={cn(styles.trigger, isSmall && styles.iconTrigger)}
          aria-haspopup="listbox"
          aria-expanded={open}
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
            name={isSmall ? 'expand_more' : 'unfold_more'}
            size={isSmall ? 'sm' : 'md'}
            className={styles.chevron}
          />
        </button>

        {open && (
          <div
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
                    ref={
                      isSelected
                        ? (el) => el?.scrollIntoView?.({ block: 'nearest' })
                        : undefined
                    }
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
                        size={isSmall ? 'sm' : 'md'}
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
