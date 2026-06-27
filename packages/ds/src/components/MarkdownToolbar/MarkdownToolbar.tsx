import { forwardRef, type HTMLAttributes } from 'react';
import { IconButton } from '../IconButton';
import type { IconName } from '../../icons';
import { useRovingToolbar } from '../../hooks/useRovingToolbar';
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
];

type MarkdownToolbarSize = 'sm' | 'md';

export interface MarkdownToolbarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  onAction: (action: MarkdownToolbarAction) => void;
  disabled?: boolean;
  size?: MarkdownToolbarSize;
  'aria-label'?: string;
}

export const MarkdownToolbar = forwardRef<HTMLDivElement, MarkdownToolbarProps>(
  (
    {
      onAction,
      disabled = false,
      size = 'sm',
      'aria-label': ariaLabel = 'Formatting',
      className,
      ...rest
    },
    ref,
  ) => {
    const { getItemProps } = useRovingToolbar(ITEMS.map(() => ({ disabled })));

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={cn(styles.toolbar, className)}
        {...rest}
      >
        {ITEMS.map((item, index) => (
          <IconButton
            key={item.action}
            icon={item.icon}
            size={size}
            aria-label={item.label}
            disabled={disabled}
            onClick={() => onAction(item.action)}
            {...getItemProps(index)}
          />
        ))}
      </div>
    );
  },
);

MarkdownToolbar.displayName = 'MarkdownToolbar';
