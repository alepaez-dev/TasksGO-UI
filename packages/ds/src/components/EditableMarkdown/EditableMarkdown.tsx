import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react';
import { Markdown } from '../Markdown';
import { MarkdownEditor } from '../MarkdownEditor';
import type { MarkdownToolbarAction } from '../MarkdownToolbar';
import { IconButton } from '../IconButton';
import { cn } from '../../utils/cn';
import styles from './EditableMarkdown.module.css';

export interface EditableMarkdownProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  value: string;
  editing: boolean;
  onRequestEdit: () => void;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  editButtonRef?: RefObject<HTMLButtonElement | null>;
  onAction: (action: MarkdownToolbarAction) => void;
  wordCount: number;
  isUploading?: boolean;
  onInsertImageFiles?: (files: readonly File[]) => void;
  editLabel?: string;
  editButton?: 'none' | 'hover' | 'always';
  cancelLabel?: string;
  saveLabel?: string;
  stickyHeader?: boolean;
}

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, label';

export const EditableMarkdown = forwardRef<
  HTMLDivElement,
  EditableMarkdownProps
>(
  (
    {
      value,
      editing,
      onRequestEdit,
      onChange,
      onCancel,
      onSave,
      textareaRef,
      editButtonRef,
      onAction,
      wordCount,
      isUploading,
      onInsertImageFiles,
      editLabel = 'Edit',
      editButton = 'hover',
      cancelLabel = 'Cancel',
      saveLabel = 'Save',
      stickyHeader = true,
      className,
      ...rest
    },
    ref,
  ) => {
    if (editing) {
      const handleEditorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onCancel();
        } else if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
          event.preventDefault();
          onSave();
        }
      };
      return (
        <MarkdownEditor
          ref={ref}
          className={cn(styles.editZone, className)}
          onKeyDown={handleEditorKeyDown}
          value={value}
          onChange={onChange}
          stickyHeader={stickyHeader}
          textareaRef={textareaRef}
          onAction={onAction}
          wordCount={wordCount}
          isUploading={isUploading}
          onInsertImageFiles={onInsertImageFiles}
          toolbarActions={
            <>
              <IconButton
                icon="close"
                aria-label={cancelLabel}
                size="sm"
                className={styles.editAction}
                onClick={onCancel}
              />
              <IconButton
                icon="check"
                aria-label={saveLabel}
                size="sm"
                className={styles.editAction}
                onClick={onSave}
              />
            </>
          }
          {...rest}
        />
      );
    }

    const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;
      // A drag-select ends in a click — don't hijack it; let users select/copy.
      if (window.getSelection()?.toString()) return;
      onRequestEdit();
    };

    return (
      <div ref={ref} className={cn(styles.wrapper, className)} {...rest}>
        {/* Mouse-only shortcut; keyboard and AT users edit via the Edit button. */}
        <Markdown
          source={value}
          className={styles.content}
          onClick={handleContentClick}
        />
        {editButton !== 'none' ? (
          <IconButton
            ref={editButtonRef}
            icon="edit"
            aria-label={editLabel}
            size="sm"
            className={cn(
              styles.editButton,
              editButton === 'always' && styles.editButtonVisible,
            )}
            onClick={onRequestEdit}
          />
        ) : null}
      </div>
    );
  },
);

EditableMarkdown.displayName = 'EditableMarkdown';
