import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Icon } from '../Icon';
import { useAutoGrowTextarea } from '../../hooks/useAutoGrowTextarea';
import styles from './TestScenarioCard.module.css';

interface StepEditorRowProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  onRemove: () => void;
}

function StepEditorRow({
  index,
  value,
  onChange,
  onEnter,
  onRemove,
}: StepEditorRowProps): ReactNode {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoGrowTextarea(textareaRef, value);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Backspace' && value === '') {
      event.preventDefault();
      onRemove();
      return;
    }
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const textarea = textareaRef.current;
    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      const start = textarea?.selectionStart ?? value.length;
      const end = textarea?.selectionEnd ?? value.length;
      onChange(`${value.slice(0, start)}\n${value.slice(end)}`);
      // rAF: the controlled value round-trips through the parent; restore the
      // caret after React re-commits it (a controlled update resets it to the end).
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) el.selectionStart = el.selectionEnd = start + 1;
      });
      return;
    }
    onEnter();
  };

  return (
    <div className={styles.stepRow}>
      <span className={styles.stepNumber} aria-hidden="true">
        {index + 1}
      </span>
      <textarea
        ref={textareaRef}
        rows={1}
        className={styles.stepInput}
        aria-label={`Step ${index + 1}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className={styles.removeButton}
        aria-label={`Remove step ${index + 1}`}
        onClick={onRemove}
      >
        <Icon name="close" size="xs" />
      </button>
    </div>
  );
}

export interface StepEditorProps {
  steps: readonly string[];
  onStepsChange: (steps: readonly string[]) => void;
}

export function StepEditor({
  steps,
  onStepsChange,
}: StepEditorProps): ReactNode {
  const editorRef = useRef<HTMLDivElement>(null);

  const removeAt = (index: number) => {
    const target = index > 0 ? index - 1 : 0;
    onStepsChange(steps.filter((_, i) => i !== index));
    // rAF: rows re-render after the parent commits; then focus the previous step
    // (or the Add step button if none remain) so keyboard flow continues.
    requestAnimationFrame(() => {
      const areas = editorRef.current?.querySelectorAll('textarea');
      const el = areas?.[target];
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      } else {
        editorRef.current?.querySelector('button')?.focus();
      }
    });
  };

  return (
    <div className={styles.stepEditor} ref={editorRef}>
      {steps.map((step, index) => (
        <StepEditorRow
          key={index}
          index={index}
          value={step}
          onChange={(value) =>
            onStepsChange(steps.map((s, i) => (i === index ? value : s)))
          }
          onEnter={() => {
            onStepsChange([
              ...steps.slice(0, index + 1),
              '',
              ...steps.slice(index + 1),
            ]);
            // rAF: the new row's textarea only exists after React commits the
            // inserted step; query by position since that row has no ref yet.
            requestAnimationFrame(() => {
              const areas = editorRef.current?.querySelectorAll('textarea');
              areas?.[index + 1]?.focus();
            });
          }}
          onRemove={() => removeAt(index)}
        />
      ))}
      <button
        type="button"
        className={styles.addStep}
        onClick={() => onStepsChange([...steps, ''])}
      >
        <Icon name="add" size="xs" />
        Add step
      </button>
    </div>
  );
}
