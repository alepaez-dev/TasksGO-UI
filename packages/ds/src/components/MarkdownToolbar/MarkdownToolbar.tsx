import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import {
  useRovingToolbar,
  type RovingToolbarItemProps,
} from '../../hooks/useRovingToolbar';
import type { MarkdownAction } from '../../utils/markdown/applyMarkdownAction';
import { cn } from '../../utils/cn';
import styles from './MarkdownToolbar.module.css';

export type MarkdownToolbarAction = MarkdownAction;

interface ToolbarItemBase {
  action: MarkdownAction;
  icon: IconName;
  label: string;
}

type ToolbarItem =
  | (ToolbarItemBase & { appearance: 'icon' })
  | (ToolbarItemBase & { appearance: 'pill'; iconClass: string });

const ITEMS: readonly ToolbarItem[] = [
  { action: 'heading', icon: 'heading', label: 'Heading', appearance: 'icon' },
  { action: 'bold', icon: 'format_bold', label: 'Bold', appearance: 'icon' },
  {
    action: 'italic',
    icon: 'format_italic',
    label: 'Italic',
    appearance: 'icon',
  },
  {
    action: 'list',
    icon: 'format_list_bulleted',
    label: 'Bulleted list',
    appearance: 'icon',
  },
  { action: 'quote', icon: 'format_quote', label: 'Quote', appearance: 'icon' },
  { action: 'code', icon: 'code', label: 'Code', appearance: 'icon' },
  { action: 'link', icon: 'link', label: 'Link', appearance: 'icon' },
  { action: 'image', icon: 'image', label: 'Image', appearance: 'icon' },
  {
    action: 'checkbox',
    icon: 'task_alt',
    label: 'Checklist item',
    appearance: 'icon',
  },
  {
    action: 'task',
    icon: 'task_alt',
    label: 'Add task',
    appearance: 'pill',
    iconClass: styles.taskIconTint,
  },
  {
    action: 'qa',
    icon: 'bug_report',
    label: 'Add QA scenario',
    appearance: 'pill',
    iconClass: styles.qaIconTint,
  },
];

export type MarkdownToolbarGroup = readonly MarkdownAction[];

const DEFAULT_GROUPS: readonly MarkdownToolbarGroup[] = [
  [
    'heading',
    'bold',
    'italic',
    'list',
    'quote',
    'code',
    'link',
    'image',
    'checkbox',
  ],
];

type MarkdownToolbarSize = 'sm' | 'md';

export interface MarkdownToolbarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  onAction: (action: MarkdownToolbarAction) => void;
  disabled?: boolean;
  size?: MarkdownToolbarSize;
  groups?: readonly MarkdownToolbarGroup[];
  hint?: ReactNode;
  'aria-label'?: string;
}

interface ToolbarItemButtonProps {
  item: ToolbarItem;
  size: MarkdownToolbarSize;
  disabled: boolean;
  onAction: (action: MarkdownToolbarAction) => void;
  itemProps: RovingToolbarItemProps;
}

function ToolbarItemButton({
  item,
  size,
  disabled,
  onAction,
  itemProps,
}: ToolbarItemButtonProps) {
  if (item.appearance === 'pill') {
    return (
      <button
        type="button"
        className={styles.pill}
        aria-label={item.label}
        disabled={disabled}
        onClick={() => onAction(item.action)}
        {...itemProps}
      >
        <Icon name={item.icon} size={size} className={item.iconClass} />
        <span className={styles.pillLabel}>{item.label}</span>
      </button>
    );
  }
  return (
    <IconButton
      icon={item.icon}
      size={size}
      aria-label={item.label}
      disabled={disabled}
      onClick={() => onAction(item.action)}
      {...itemProps}
    />
  );
}

export const MarkdownToolbar = forwardRef<HTMLDivElement, MarkdownToolbarProps>(
  (
    {
      onAction,
      disabled = false,
      size = 'sm',
      groups,
      hint,
      'aria-label': ariaLabel = 'Formatting',
      className,
      ...rest
    },
    ref,
  ) => {
    let nextIndex = 0;
    const resolvedGroups = (groups ?? DEFAULT_GROUPS).map((group) =>
      group.flatMap((action) => {
        const item = ITEMS.find((candidate) => candidate.action === action);
        return item ? [{ ...item, index: nextIndex++ }] : [];
      }),
    );

    const { getItemProps } = useRovingToolbar(
      resolvedGroups.flat().map(() => ({ disabled })),
    );

    const content = resolvedGroups.flatMap((group, groupIndex) => {
      const nodes = group.map((item) => (
        <ToolbarItemButton
          key={item.action}
          item={item}
          size={size}
          disabled={disabled}
          onAction={onAction}
          itemProps={getItemProps(item.index)}
        />
      ));
      if (groupIndex === resolvedGroups.length - 1) return nodes;
      return [
        ...nodes,
        <span
          key={`sep-${groupIndex}`}
          data-separator=""
          aria-hidden="true"
          className={styles.separator}
        />,
      ];
    });

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={cn(styles.toolbar, className)}
        onPointerDown={(e) => e.preventDefault()}
        {...rest}
      >
        <div data-toolbar-row="" className={styles.row}>
          {content}
        </div>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
    );
  },
);

MarkdownToolbar.displayName = 'MarkdownToolbar';
