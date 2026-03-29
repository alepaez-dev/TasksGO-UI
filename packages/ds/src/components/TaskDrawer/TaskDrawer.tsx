import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button';
import { cn } from '../../utils/cn';
import styles from './TaskDrawer.module.css';

export interface TaskDrawerProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  onCancel: () => void;
  onSubmit: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  submitDisabled?: boolean;
}

export const TaskDrawer = forwardRef<HTMLDivElement, TaskDrawerProps>(
  (
    {
      title,
      onCancel,
      onSubmit,
      cancelLabel = 'Cancel',
      submitLabel = 'Create Task',
      submitDisabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <div ref={ref} className={cn(styles.taskDrawer, className)} {...rest}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.body}>{children}</div>
      <div className={styles.footer}>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onSubmit}
          disabled={submitDisabled}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  ),
);

TaskDrawer.displayName = 'TaskDrawer';

export interface TaskDrawerFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  action?: ReactNode;
}

export const TaskDrawerField = forwardRef<HTMLDivElement, TaskDrawerFieldProps>(
  ({ label, action, className, children, ...rest }, ref) => (
    <div ref={ref} className={cn(styles.field, className)} {...rest}>
      <div className={styles.fieldHeader}>
        <span className={styles.drawerLabel}>{label}</span>
        {action}
      </div>
      {children}
    </div>
  ),
);

TaskDrawerField.displayName = 'TaskDrawerField';

export interface TaskDrawerSectionProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
}

export const TaskDrawerSection = forwardRef<
  HTMLDivElement,
  TaskDrawerSectionProps
>(({ label, className, children, ...rest }, ref) => (
  <div ref={ref} className={cn(styles.section, className)} {...rest}>
    <h3 className={cn(styles.drawerLabel, styles.sectionLabel)}>{label}</h3>
    {children}
  </div>
));

TaskDrawerSection.displayName = 'TaskDrawerSection';
