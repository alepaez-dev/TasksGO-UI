import { forwardRef, useId } from 'react';
import { DialogShell } from '../_internal/DialogShell';
import { DialogField, DialogFieldLabel } from '../_internal/DialogField';
import { StepEditor } from '../_internal/StepEditor';
import { EvidenceInput } from '../_internal/EvidenceInput';
import { type DialogLifecycleProps } from '../../types/dialog';
import { Icon } from '../Icon';
import { StatusChoice } from './StatusChoice';
import {
  getMissingScenarioFields,
  isScenarioFieldRequired,
  type NewScenarioDraft,
  type NewScenarioTextField,
} from './scenarioDraft';
import styles from './AddScenarioDialog.module.css';

const FAILED_HINT = 'Actual result is required for failed scenarios.';
const DEFAULT_MAX_EVIDENCE = 6;

export interface AddScenarioDialogProps extends DialogLifecycleProps {
  value: NewScenarioDraft;
  onValueChange: (next: NewScenarioDraft) => void;
  onConfirm: (value: NewScenarioDraft) => void;
  maxEvidence?: number;
  addEvidenceDisabled?: boolean;
  evidenceAccept?: string;
  isEvidenceAllowed?: (file: File) => boolean;
  onEvidenceRejected?: (
    files: readonly File[],
    reason: 'limit' | 'filtered',
  ) => void;
}

export const AddScenarioDialog = forwardRef<
  HTMLDivElement,
  AddScenarioDialogProps
>(
  (
    {
      value,
      onValueChange,
      onConfirm,
      maxEvidence = DEFAULT_MAX_EVIDENCE,
      addEvidenceDisabled = false,
      evidenceAccept,
      isEvidenceAllowed,
      onEvidenceRejected,
      ...rest
    },
    ref,
  ) => {
    const nameId = useId();
    const descriptionId = useId();
    const expectedId = useId();
    const actualId = useId();
    const hintId = useId();
    const statusName = useId();

    const actualRequired = isScenarioFieldRequired('actual', value.status);
    const evidenceLimit = Math.max(0, maxEvidence);

    function changeHandlerFor(field: NewScenarioTextField) {
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
            <div className={styles.actualColumn}>
              <DialogField
                id={actualId}
                label="Actual result"
                value={value.actual}
                onChange={changeHandlerFor('actual')}
                required={actualRequired}
                describedBy={actualRequired ? hintId : undefined}
                placeholder="What was observed"
              />
              {actualRequired && (
                <p id={hintId} className={styles.hint}>
                  <Icon name="warning" size="sm" className={styles.hintIcon} />
                  {FAILED_HINT}
                </p>
              )}
            </div>
          </div>

          <fieldset className={styles.optionalSection}>
            <DialogFieldLabel as="legend" hint="optional">
              Steps to reproduce
            </DialogFieldLabel>
            <StepEditor
              steps={value.steps}
              onStepsChange={(steps) => onValueChange({ ...value, steps })}
            />
          </fieldset>

          <fieldset className={styles.optionalSection}>
            <DialogFieldLabel
              as="legend"
              hint={`optional · up to ${evidenceLimit}`}
            >
              Evidence
            </DialogFieldLabel>
            <EvidenceInput
              items={value.evidence.map((file) => ({
                label: file.name,
                kind: file.type.startsWith('image/') ? 'image' : 'file',
              }))}
              limitLabel={evidenceLimit}
              accept={evidenceAccept}
              addDisabled={
                addEvidenceDisabled || value.evidence.length >= evidenceLimit
              }
              onAddFiles={(files) => {
                const allowed = isEvidenceAllowed
                  ? files.filter((file) => isEvidenceAllowed(file))
                  : files;
                const filtered = files.filter((f) => !allowed.includes(f));
                if (filtered.length > 0) {
                  onEvidenceRejected?.(filtered, 'filtered');
                }
                const picked = [...value.evidence, ...allowed];
                if (picked.length > evidenceLimit) {
                  onEvidenceRejected?.(picked.slice(evidenceLimit), 'limit');
                }
                onValueChange({
                  ...value,
                  evidence: picked.slice(0, evidenceLimit),
                });
              }}
              onRemove={(index) =>
                onValueChange({
                  ...value,
                  evidence: value.evidence.filter((_, i) => i !== index),
                })
              }
            />
          </fieldset>
        </div>
      </DialogShell>
    );
  },
);

AddScenarioDialog.displayName = 'AddScenarioDialog';
