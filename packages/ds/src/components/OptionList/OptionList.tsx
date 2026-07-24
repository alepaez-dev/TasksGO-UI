import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import styles from './OptionList.module.css';

type OptionBase = Readonly<{ value: string; label: string; meta?: ReactNode }>;
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

export type OptionListOption = DotOption | IconOption | PrefixOption;

export type OptionListAction = Readonly<{
  label: string;
  icon: IconName;
  onClick: () => void;
}>;

export type OptionListOptions =
  | readonly DotOption[]
  | readonly IconOption[]
  | readonly PrefixOption[];

export interface OptionListProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'aria-label'
> {
  options: OptionListOptions;
  value?: string;
  onSelect: (value: string) => void;
  header?: ReactNode;
  emptyState?: ReactNode;
  action?: OptionListAction;
  listboxId?: string;
  renderOptionIndicator?: (option: OptionListOption) => ReactNode;
  'aria-label': string;
}

function defaultOptionIndicator(option: OptionListOption, value?: string) {
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
              } as CSSProperties)
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

export const OptionList = forwardRef<HTMLDivElement, OptionListProps>(
  (
    {
      options,
      value,
      onSelect,
      header,
      emptyState,
      action,
      listboxId,
      renderOptionIndicator,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const renderIndicator =
      renderOptionIndicator ??
      ((option: OptionListOption) => defaultOptionIndicator(option, value));

    const handleOptionKeyDown =
      (optionValue: string) => (e: KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            onSelect(optionValue);
            break;
          case 'ArrowDown':
            e.preventDefault();
            focusSibling(e.target, 'next');
            break;
          case 'ArrowUp':
            e.preventDefault();
            focusSibling(e.target, 'prev');
            break;
        }
      };

    return (
      <div ref={ref} className={cn(styles.list, className)} {...rest}>
        {header && <div className={styles.header}>{header}</div>}
        {options.length === 0 && emptyState && (
          <div className={styles.emptyState}>{emptyState}</div>
        )}
        <div
          id={listboxId}
          role="listbox"
          className={styles.options}
          aria-label={ariaLabel}
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
                onClick={() => onSelect(option.value)}
                onKeyDown={handleOptionKeyDown(option.value)}
              >
                {renderIndicator(option)}
                <span className={styles.optionLabel}>{option.label}</span>
                {option.meta != null && !isSelected && (
                  <span className={styles.optionMeta}>{option.meta}</span>
                )}
                {isSelected && (
                  <Icon
                    name="check_circle"
                    size="sm"
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
    );
  },
);

OptionList.displayName = 'OptionList';
