import { forwardRef, useId } from 'react';
import { DialogShell } from '../_internal/DialogShell';
import { DialogField } from '../_internal/DialogField';
import { type DialogLifecycleProps } from '../../types/dialog';
import { Icon } from '../Icon';
import { StatusChoice } from './StatusChoice';
import {
  getMissingScenarioFields,
  isScenarioFieldRequired,
  type NewScenarioDraft,
  type NewScenarioField,
} from './scenarioDraft';
import styles from './AddScenarioDialog.module.css';

const FAILED_HINT = 'Actual result is required for failed scenarios.';

export interface AddScenarioDialogProps extends DialogLifecycleProps {
  value: NewScenarioDraft;
  onValueChange: (next: NewScenarioDraft) => void;
  onConfirm: (value: NewScenarioDraft) => void;
}

export const AddScenarioDialog = forwardRef<
  HTMLDivElement,
  AddScenarioDialogProps
>(({ value, onValueChange, onConfirm, ...rest }, ref) => {
  const nameId = useId();
  const descriptionId = useId();
  const expectedId = useId();
  const actualId = useId();
  const hintId = useId();
  const statusName = useId();

  const actualRequired = isScenarioFieldRequired('actual', value.status);

  function changeHandlerFor(field: NewScenarioField) {
    return (next: string) => onValueChange({ ...value, [field]: next });
  }

  return (
    <DialogShell
      ref={ref}
      {...rest}
      icon={<Icon name="add" size="xs" />}
      iconTone="accent"
      title="Add test scenario"
      description="Define the scenario and its initial status. Every scenario must document what will be verified."
      size="lg"
      confirmLabel="Add scenario"
      confirmDisabled={getMissingScenarioFields(value).length > 0}
      onConfirm={() => onConfirm(value)}
    >
      <div className={styles.body}>
        <DialogField
          id={nameId}
          as="input"
          label="Scenario name"
          value={value.name}
          onChange={changeHandlerFor('name')}
          required
          placeholder="e.g. Verify cache hit on /v1/assets"
        />

        <StatusChoice
          name={statusName}
          value={value.status}
          onValueChange={(status) => onValueChange({ ...value, status })}
        />

        <DialogField
          id={descriptionId}
          label="Description"
          value={value.description}
          onChange={changeHandlerFor('description')}
          required
          placeholder="What behavior is being verified?"
        />

        <div className={styles.row}>
          <DialogField
            id={expectedId}
            label="Expected result"
            value={value.expected}
            onChange={changeHandlerFor('expected')}
            required
            placeholder="What should happen"
          />
          <DialogField
            id={actualId}
            label="Actual result"
            value={value.actual}
            onChange={changeHandlerFor('actual')}
            required={actualRequired}
            describedBy={actualRequired ? hintId : undefined}
            placeholder="What was observed"
          />
        </div>

        {actualRequired && (
          <p id={hintId} className={styles.hint}>
            <Icon name="warning" size="sm" className={styles.hintIcon} />
            {FAILED_HINT}
          </p>
        )}
      </div>
    </DialogShell>
  );
});

AddScenarioDialog.displayName = 'AddScenarioDialog';
