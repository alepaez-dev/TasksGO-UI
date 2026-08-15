import { type ReactNode } from 'react';
import { Callout } from '../Callout';
import { EditToggle } from '../EditToggle';
import { Icon } from '../Icon';
import { Markdown } from '../Markdown';
import { SectionHeader } from '../SectionHeader';
import { cn } from '../../utils/cn';
import styles from './TestScenarioCard.module.css';

export type SectionTone = 'warning' | 'positive' | 'critical' | 'neutral';

const TONE_EDITOR_CLASS: Record<SectionTone, string> = {
  warning: styles.toneWarning,
  positive: styles.tonePositive,
  critical: styles.toneCritical,
  neutral: styles.toneNeutral,
};

export interface EditableSectionProps {
  title: string;
  value: string;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  onChange?: (value: string) => void;
  tone?: SectionTone;
  addLabel?: string;
}

export function EditableSection({
  title,
  value,
  editing,
  onEditingChange,
  onChange,
  tone,
  addLabel,
}: EditableSectionProps): ReactNode {
  const editable = onChange != null;
  const showToggle =
    editable && (addLabel == null || editing || value.length > 0);

  const editor = (
    <textarea
      className={styles.editorTextarea}
      aria-label={title}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <SectionHeader headingLevel={3}>{title}</SectionHeader>
        {showToggle && (
          <EditToggle
            className={editing ? undefined : styles.sectionEdit}
            editing={editing}
            onEditingChange={onEditingChange}
          />
        )}
      </div>
      {editing && editable ? (
        tone ? (
          <div className={cn(styles.calloutEditor, TONE_EDITOR_CLASS[tone])}>
            {editor}
          </div>
        ) : (
          editor
        )
      ) : value ? (
        tone ? (
          <Callout variant={tone}>
            <Markdown source={value} className={styles.sectionBody} />
          </Callout>
        ) : (
          <Markdown source={value} className={styles.sectionBody} />
        )
      ) : editable && addLabel ? (
        <button
          type="button"
          className={styles.addStep}
          onClick={() => onEditingChange(true)}
        >
          <Icon name="add" size="xs" />
          {addLabel}
        </button>
      ) : null}
    </section>
  );
}
