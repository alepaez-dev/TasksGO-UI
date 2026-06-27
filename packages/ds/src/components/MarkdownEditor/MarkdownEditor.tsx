import {
  forwardRef,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  MarkdownToolbar,
  type MarkdownToolbarAction,
} from '../MarkdownToolbar';
import { useAutoGrowTextarea } from '../../hooks/useAutoGrowTextarea';
import { cn } from '../../utils/cn';
import styles from './MarkdownEditor.module.css';

export type MarkdownEditorStatus = 'idle' | 'saving' | 'saved';

export interface MarkdownEditorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  value: string;
  onChange: (value: string) => void;
  header?: ReactNode;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onAction: (action: MarkdownToolbarAction) => void;
  wordCount: number;
  status?: MarkdownEditorStatus;
  isUploading?: boolean;
  onInsertImageFiles?: (files: readonly File[]) => void;
  placeholder?: string;
}

const STATUS_TEXT: Record<MarkdownEditorStatus, string | null> = {
  idle: null,
  saving: 'Saving…',
  saved: 'Saved',
};

function imageFilesFrom(list: FileList | null): File[] {
  if (!list) return [];
  return Array.from(list).filter((file) => file.type.startsWith('image/'));
}

export const MarkdownEditor = forwardRef<HTMLDivElement, MarkdownEditorProps>(
  (
    {
      value,
      onChange,
      header,
      textareaRef,
      onAction,
      wordCount,
      status = 'idle',
      isUploading = false,
      onInsertImageFiles,
      placeholder = 'Start writing.',
      className,
      ...rest
    },
    ref,
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    useAutoGrowTextarea(textareaRef, value);

    const handleAction = (action: MarkdownToolbarAction) => {
      if (action === 'image' && onInsertImageFiles) {
        fileInputRef.current?.click();
        return;
      }
      onAction(action);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = imageFilesFrom(event.target.files);
      if (files.length > 0) onInsertImageFiles?.(files);
      event.target.value = '';
    };

    const handleDrop = (event: DragEvent<HTMLTextAreaElement>) => {
      if (!onInsertImageFiles) return;
      const files = imageFilesFrom(event.dataTransfer.files);
      if (files.length === 0) return;
      event.preventDefault();
      textareaRef.current?.focus();
      onInsertImageFiles(files);
    };

    const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
      if (!onInsertImageFiles) return;
      const files = imageFilesFrom(event.clipboardData.files);
      if (files.length === 0) return;
      event.preventDefault();
      onInsertImageFiles(files);
    };

    const statusText = isUploading ? 'Uploading…' : STATUS_TEXT[status];
    const words = `${wordCount} ${wordCount === 1 ? 'word' : 'words'}`;

    return (
      <div ref={ref} className={cn(styles.editor, className)} {...rest}>
        <div className={styles.head}>
          {header}
          <div className={styles.toolbarRow}>
            <MarkdownToolbar onAction={handleAction} size="md" />
            <span className={styles.status}>
              {statusText ? (
                <>
                  <span role="status">{statusText}</span>
                  <span aria-hidden="true">·</span>
                </>
              ) : null}
              <span>{words}</span>
            </span>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onDrop={handleDrop}
          onPaste={handlePaste}
          placeholder={placeholder}
          aria-label="Markdown"
        />

        {onInsertImageFiles ? (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className={styles.fileInput}
            onChange={handleFileChange}
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : null}
      </div>
    );
  },
);

MarkdownEditor.displayName = 'MarkdownEditor';
