import { type ReactNode } from 'react';
import { EditToggle } from '../EditToggle';
import { Icon } from '../Icon';
import { SectionHeader } from '../SectionHeader';
import { StepList } from '../StepList';
import { cn } from '../../utils/cn';
import { StepEditor } from './StepEditor';
import styles from './TestScenarioCard.module.css';

const STEPS_PREVIEW_COUNT = 3;

export interface StepsSectionProps {
  steps: readonly string[];
  onStepsChange?: (steps: readonly string[]) => void;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  expanded: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function StepsSection({
  steps,
  onStepsChange,
  editing,
  onEditingChange,
  expanded,
  onExpandedChange,
}: StepsSectionProps): ReactNode {
  if (steps.length === 0 && !onStepsChange) return null;

  const canToggle = steps.length > STEPS_PREVIEW_COUNT;
  const visible = expanded ? steps : steps.slice(0, STEPS_PREVIEW_COUNT);
  const hiddenCount = steps.length - STEPS_PREVIEW_COUNT;

  let body: ReactNode = null;
  if (editing && onStepsChange) {
    body = <StepEditor steps={steps} onStepsChange={onStepsChange} />;
  } else if (steps.length > 0) {
    body = (
      <>
        <StepList steps={visible} dividers />
        {canToggle && (
          <button
            type="button"
            className={styles.stepsToggle}
            aria-expanded={expanded}
            onClick={() => onExpandedChange?.(!expanded)}
          >
            <Icon
              name="expand_more"
              size="xs"
              className={cn(styles.chevron, expanded && styles.chevronOpen)}
            />
            {expanded ? 'Show less' : `Show ${hiddenCount} more`}
          </button>
        )}
      </>
    );
  } else if (onStepsChange) {
    body = (
      <button
        type="button"
        className={styles.addStep}
        onClick={() => {
          onStepsChange(['']);
          onEditingChange(true);
        }}
      >
        <Icon name="add" size="xs" />
        Add step
      </button>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <SectionHeader headingLevel={3}>Steps to Reproduce</SectionHeader>
        {onStepsChange && (editing || steps.length > 0) && (
          <EditToggle
            className={editing ? undefined : styles.sectionEdit}
            editing={editing}
            onEditingChange={onEditingChange}
          />
        )}
      </div>
      {body}
    </section>
  );
}
