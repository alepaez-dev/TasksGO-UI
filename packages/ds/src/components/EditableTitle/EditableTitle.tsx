import {
  forwardRef,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { EditToggle } from '../EditToggle';
import { useAutoGrowTextarea } from '../../hooks/useAutoGrowTextarea';
import { cn } from '../../utils/cn';
import styles from './EditableTitle.module.css';

type TitleElement = 'h1' | 'h2' | 'h3' | 'span';

export interface EditableTitleProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'title' | 'aria-label'
> {
  value: string;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  onChange: (value: string) => void;
  as?: TitleElement;
  titleClassName?: string;
  editButton?: 'none' | 'hover' | 'always';
  toggleClassName?: string;
  clickToEdit?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  /** Accessible name for the edit textbox. */
  'aria-label'?: string;
  editLabel?: string;
  doneLabel?: string;
}

export const EditableTitle = forwardRef<HTMLDivElement, EditableTitleProps>(
  (
    {
      value,
      editing,
      onEditingChange,
      onChange,
      as = 'span',
      titleClassName,
      editButton = 'hover',
      toggleClassName,
      clickToEdit = false,
      fullWidth = false,
      placeholder,
      'aria-label': ariaLabel = 'Title',
      editLabel,
      doneLabel,
      className,
      ...rest
    },
    ref,
  ): ReactNode => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const readButtonRef = useRef<HTMLButtonElement>(null);
    // '' while closed so the dep changes on re-entry — the remounted textarea must re-measure.
    useAutoGrowTextarea(textareaRef, editing ? value : '');

    useEffect(() => {
      if (!editing) return;
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      const end = el.value.length;
      el.setSelectionRange(end, end);
    }, [editing]);

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.nativeEvent.isComposing) return;
      if (event.key === 'Enter') {
        event.preventDefault();
        onEditingChange(false);
        requestAnimationFrame(() => {
          (readButtonRef.current ?? toggleRef.current)?.focus();
        });
      }
    };

    const ReadTag = as;
    const isHeading = as !== 'span';

    return (
      <div
        ref={ref}
        className={cn(styles.root, fullWidth && styles.fullWidth, className)}
        {...rest}
      >
        {editing ? (
          <>
            {isHeading && (
              <ReadTag className={styles.srOnly}>
                {value || placeholder || ariaLabel}
              </ReadTag>
            )}
            <textarea
              ref={textareaRef}
              rows={1}
              className={cn(styles.input, titleClassName)}
              aria-label={ariaLabel}
              value={value}
              placeholder={placeholder}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </>
        ) : (
          <ReadTag className={cn(styles.text, titleClassName)}>
            {clickToEdit ? (
              <button
                ref={readButtonRef}
                type="button"
                className={styles.textButton}
                aria-label={value || placeholder ? undefined : ariaLabel}
                onClick={() => onEditingChange(true)}
              >
                {value || placeholder}
              </button>
            ) : (
              value || placeholder
            )}
          </ReadTag>
        )}
        {editButton !== 'none' && (
          <EditToggle
            ref={toggleRef}
            className={cn(
              !editing && editButton === 'hover' && styles.toggleHidden,
              !editing && toggleClassName,
            )}
            editing={editing}
            onEditingChange={onEditingChange}
            editLabel={editLabel}
            doneLabel={doneLabel}
          />
        )}
      </div>
    );
  },
);

EditableTitle.displayName = 'EditableTitle';
