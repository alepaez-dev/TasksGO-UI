import {
  forwardRef,
  type ForwardedRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '../IconButton';
import { Button } from '../Button';
import type { IconName } from '../../icons';
import { useRovingToolbar } from '../../hooks/useRovingToolbar';
import { useKeyboardInset } from '../../hooks/useKeyboardInset';
import type { MarkdownAction } from '../../utils/markdown/applyMarkdownAction';
import { cn } from '../../utils/cn';
import styles from './MarkdownToolbar.module.css';

export type MarkdownToolbarAction = MarkdownAction;

interface ToolbarItem {
  action: MarkdownAction;
  icon: IconName;
  label: string;
}

const ITEMS: readonly ToolbarItem[] = [
  { action: 'heading', icon: 'heading', label: 'Heading' },
  { action: 'bold', icon: 'format_bold', label: 'Bold' },
  { action: 'italic', icon: 'format_italic', label: 'Italic' },
  { action: 'list', icon: 'format_list_bulleted', label: 'Bulleted list' },
  { action: 'quote', icon: 'format_quote', label: 'Quote' },
  { action: 'code', icon: 'code', label: 'Code' },
  { action: 'link', icon: 'link', label: 'Link' },
  { action: 'image', icon: 'image', label: 'Image' },
  { action: 'checkbox', icon: 'task_alt', label: 'Checklist item' },
];

type MarkdownToolbarSize = 'sm' | 'md';
type MarkdownToolbarVariant = 'inline' | 'accessory';

export interface MarkdownToolbarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  onAction: (action: MarkdownToolbarAction) => void;
  disabled?: boolean;
  size?: MarkdownToolbarSize;
  variant?: MarkdownToolbarVariant;
  onDone?: () => void;
  actions?: readonly MarkdownAction[];
  'aria-label'?: string;
}

interface AccessoryShellProps extends HTMLAttributes<HTMLDivElement> {
  ariaLabel: string;
  toolbarRef?: ForwardedRef<HTMLDivElement>;
  children: ReactNode;
}

function AccessoryShell({
  ariaLabel,
  toolbarRef,
  className,
  children,
  ...rest
}: AccessoryShellProps) {
  const { viewportBottom } = useKeyboardInset();
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={cn(styles.accessory, className)}
      style={{ transform: `translateY(calc(${viewportBottom}px - 100%))` }}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  );
}

export const MarkdownToolbar = forwardRef<HTMLDivElement, MarkdownToolbarProps>(
  (
    {
      onAction,
      disabled = false,
      size = 'sm',
      variant = 'inline',
      onDone,
      actions,
      'aria-label': ariaLabel = 'Formatting',
      className,
      ...rest
    },
    ref,
  ) => {
    const items = actions
      ? actions.flatMap(
          (action) => ITEMS.find((item) => item.action === action) ?? [],
        )
      : ITEMS;

    const { getItemProps } = useRovingToolbar(items.map(() => ({ disabled })));

    const suppressBlur =
      variant === 'accessory'
        ? (e: ReactPointerEvent) => e.preventDefault()
        : undefined;

    const buttons = items.map((item, index) => (
      <IconButton
        key={item.action}
        icon={item.icon}
        size={size}
        aria-label={item.label}
        disabled={disabled}
        onPointerDown={suppressBlur}
        onClick={() => onAction(item.action)}
        {...getItemProps(index)}
      />
    ));

    if (variant === 'accessory') {
      return (
        <AccessoryShell
          ariaLabel={ariaLabel}
          toolbarRef={ref}
          className={className}
          {...rest}
        >
          <div className={styles.accessoryScroll}>{buttons}</div>
          {onDone && (
            <Button
              variant="ghost"
              size="sm"
              className={styles.done}
              onPointerDown={suppressBlur}
              onClick={onDone}
            >
              Done
            </Button>
          )}
        </AccessoryShell>
      );
    }

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={cn(styles.toolbar, className)}
        {...rest}
      >
        {buttons}
      </div>
    );
  },
);

MarkdownToolbar.displayName = 'MarkdownToolbar';
