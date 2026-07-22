import {
  forwardRef,
  useCallback,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Icon } from '../Icon';
import {
  OptionList,
  type OptionListOption as SelectorOption,
  type OptionListAction as SelectorAction,
  type OptionListOptions as SelectorOptions,
} from '../OptionList';
import { cn } from '../../utils/cn';
import styles from './Selector.module.css';

export type { SelectorOption, SelectorAction };

type DropdownAlign = 'stretch' | 'end';

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
  showChevron?: boolean;
  renderTriggerLabel?: (option: SelectorOption) => ReactNode;
  renderOptionIndicator?: (option: SelectorOption) => ReactNode;
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
      showChevron = true,
      renderTriggerLabel: renderTriggerLabelProp,
      renderOptionIndicator: renderOptionIndicatorProp,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const selected = options.find((o) => o.value === value);
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

    function renderTriggerLabel() {
      if (!selected) return placeholder;
      if (renderTriggerLabelProp) return renderTriggerLabelProp(selected);
      if (hasPrefixes && selected.prefix) {
        return `${selected.prefix} \u00b7 ${selected.label}`;
      }
      return selected.label;
    }

    return (
      <div ref={ref} className={cn(styles.selector, className)} {...rest}>
        <button
          ref={triggerRef}
          type="button"
          className={cn(styles.trigger, isInline && styles.inlineTrigger)}
          aria-haspopup="listbox"
          aria-expanded={open}
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
              className={styles.triggerIcon}
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
          {showChevron && (
            <Icon
              name={isInline ? 'expand_more' : 'unfold_more'}
              size={isInline ? 'sm' : 'md'}
              className={styles.chevron}
            />
          )}
        </button>

        {open && (
          <div
            ref={handleDropdownMount}
            role="presentation"
            className={cn(
              styles.dropdown,
              dropdownAlign === 'end' && styles.dropdownEnd,
            )}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && !e.defaultPrevented) {
                e.preventDefault();
                onOpenChange?.(false);
                triggerRef.current?.focus();
              }
            }}
          >
            <OptionList
              options={options}
              value={value}
              aria-label={ariaLabel ?? 'Options'}
              header={header}
              emptyState={emptyState}
              renderOptionIndicator={renderOptionIndicatorProp}
              action={
                action
                  ? {
                      ...action,
                      onClick: () => {
                        action.onClick();
                        onOpenChange?.(false);
                      },
                    }
                  : undefined
              }
              onSelect={(optionValue) => {
                onValueChange?.(optionValue);
                onOpenChange?.(false);
                triggerRef.current?.focus();
              }}
            />
          </div>
        )}
      </div>
    );
  },
);

Selector.displayName = 'Selector';
