import {
  forwardRef,
  useRef,
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { FileChip } from '../_internal/FileChip';
import {
  MarkdownToolbar,
  type MarkdownToolbarAction,
  type MarkdownToolbarGroup,
} from '../MarkdownToolbar';
import { cn } from '../../utils/cn';
import type { ActivityActor, ActivityAttachment } from '../../utils/activity';
import styles from './ActivityComposer.module.css';

export type ActivityComposerMode = 'comment' | 'ask';

export interface ActivityComposerAttachment extends Pick<
  ActivityAttachment,
  'id' | 'name' | 'kind'
> {
  readonly uploadFraction?: number;
}

const NO_ATTACHMENTS: readonly ActivityComposerAttachment[] = [];

const MODE_LABEL: Record<ActivityComposerMode, string> = {
  comment: 'Comment',
  ask: 'Ask',
};

const MODE_PLACEHOLDER: Record<ActivityComposerMode, string> = {
  comment: 'Write a comment…  Use @ to mention someone',
  ask: 'Ask a question…  Use @ to mention someone',
};

const MODE_ICON = {
  comment: 'comment_filled',
  ask: 'help',
} as const;

const FORMATTING: readonly MarkdownToolbarGroup[] = [
  ['bold', 'italic', 'code', 'link'],
];

export interface ActivityComposerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onSubmit' | 'children'
> {
  actor: ActivityActor;
  mode: ActivityComposerMode;
  value: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onModeChange: (mode: ActivityComposerMode) => void;
  onChange: (value: string) => void;
  onAction: (action: MarkdownToolbarAction) => void;
  onSubmit: () => void;
  onAttach?: (files: readonly File[]) => void;
  attachments?: readonly ActivityComposerAttachment[];
  onRemoveAttachment?: (id: string) => void;
  placeholder?: string;
  submitting?: boolean;
}

export const ActivityComposer = forwardRef<
  HTMLDivElement,
  ActivityComposerProps
>(
  (
    {
      actor,
      mode,
      value,
      textareaRef,
      onModeChange,
      onChange,
      onAction,
      onSubmit,
      onAttach,
      attachments = NO_ATTACHMENTS,
      onRemoveAttachment,
      placeholder,
      submitting = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const modeRefs = {
      comment: useRef<HTMLButtonElement>(null),
      ask: useRef<HTMLButtonElement>(null),
    };
    const uploading = attachments.some(
      (attachment) => attachment.uploadFraction !== undefined,
    );
    const canSubmit = value.trim() !== '' && !submitting && !uploading;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachmentsRef = useRef<HTMLDivElement>(null);
    const attachRef = useRef<HTMLButtonElement>(null);

    const removeAttachment = (id: string, index: number): void => {
      const focusIndexAfterRemoval = index > 0 ? index - 1 : 0;
      onRemoveAttachment?.(id);
      requestAnimationFrame(() => {
        const buttons =
          attachmentsRef.current?.querySelectorAll<HTMLButtonElement>(
            '[data-file-chip-remove]',
          );
        const next = buttons?.[focusIndexAfterRemoval];
        if (next) next.focus();
        else (attachRef.current ?? textareaRef.current)?.focus();
      });
    };

    const onFilesChosen = (event: ChangeEvent<HTMLInputElement>): void => {
      const chosen = event.target.files;
      if (chosen && chosen.length > 0) onAttach?.(Array.from(chosen));
      event.target.value = '';
    };

    const selectMode = (next: ActivityComposerMode): void => {
      onModeChange(next);
      modeRefs[next].current?.focus();
    };

    const onModeKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
      const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      selectMode(mode === 'comment' ? 'ask' : 'comment');
    };

    const onTextareaKeyDown = (
      event: KeyboardEvent<HTMLTextAreaElement>,
    ): void => {
      if (event.key !== 'Enter' || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      if (canSubmit) onSubmit();
    };

    return (
      <div ref={ref} className={cn(styles.composer, className)} {...rest}>
        <Avatar
          size="lg"
          variant="profile"
          initial={actor.initial}
          tint={actor.tint}
          aria-label={actor.name}
        />
        <div className={styles.box}>
          <div
            role="radiogroup"
            aria-label="What are you posting?"
            className={styles.modes}
          >
            {(['comment', 'ask'] as const).map((option) => (
              <button
                key={option}
                ref={modeRefs[option]}
                type="button"
                role="radio"
                aria-checked={mode === option}
                tabIndex={mode === option ? 0 : -1}
                className={cn(
                  styles.mode,
                  mode === option && styles.modeOn,
                  mode === option && option === 'ask' && styles.modeOnAsk,
                )}
                onClick={() => selectMode(option)}
                onKeyDown={onModeKeyDown}
              >
                <Icon name={MODE_ICON[option]} size="xs" />
                {MODE_LABEL[option]}
              </button>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            className={styles.area}
            aria-label={MODE_LABEL[mode]}
            value={value}
            placeholder={placeholder ?? MODE_PLACEHOLDER[mode]}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onTextareaKeyDown}
          />

          {attachments.length > 0 && (
            <div ref={attachmentsRef} className={styles.attachments}>
              {attachments.map((attachment, index) => (
                <FileChip
                  key={attachment.id}
                  label={attachment.name}
                  kind={attachment.kind}
                  uploadFraction={attachment.uploadFraction}
                  onRemove={
                    onRemoveAttachment
                      ? () => removeAttachment(attachment.id, index)
                      : undefined
                  }
                />
              ))}
            </div>
          )}

          <div className={styles.foot}>
            <MarkdownToolbar
              size="md"
              className={styles.toolbar}
              groups={FORMATTING}
              onAction={onAction}
              aria-label="Formatting"
            />
            {onAttach !== undefined && (
              <>
                <button
                  ref={attachRef}
                  type="button"
                  className={cn(
                    styles.attach,
                    attachments.length > 0 && styles.attachActive,
                  )}
                  aria-label={
                    attachments.length > 0
                      ? `Attach a file, ${attachments.length} attached`
                      : 'Attach a file'
                  }
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="attach_file" size="sm" />
                  {attachments.length > 0 && (
                    <span className={styles.attachCount}>
                      {attachments.length}
                    </span>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className={styles.fileInput}
                  onChange={onFilesChosen}
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </>
            )}
            <span className={styles.hint}>⌘↵ to send</span>
            <Button
              variant="primary"
              className={cn(mode === 'ask' && styles.submitAsk)}
              disabled={!canSubmit}
              onClick={onSubmit}
            >
              {MODE_LABEL[mode]}
            </Button>
          </div>
          <span role="status" className={styles.srOnly}>
            {attachments.length > 0
              ? `${attachments.length} file${attachments.length === 1 ? '' : 's'} attached`
              : ''}
          </span>
        </div>
      </div>
    );
  },
);

ActivityComposer.displayName = 'ActivityComposer';
