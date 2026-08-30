import { cn } from '../../utils/cn';
import { DialogFieldLabel } from '../_internal/DialogField';
import { type NewScenarioStatus } from './scenarioDraft';
import styles from './AddScenarioDialog.module.css';

const STATUS_OPTIONS: readonly {
  value: NewScenarioStatus;
  label: string;
}[] = [
  { value: 'passed', label: 'Passed' },
  { value: 'failed', label: 'Failed' },
  { value: 'pending', label: 'Pending' },
];

export interface StatusChoiceProps {
  name: string;
  value: NewScenarioStatus;
  onValueChange: (status: NewScenarioStatus) => void;
}

export function StatusChoice({
  name,
  value,
  onValueChange,
}: StatusChoiceProps) {
  return (
    <fieldset className={styles.statusGroup}>
      <DialogFieldLabel as="legend">Initial status</DialogFieldLabel>
      <div className={styles.statusOptions}>
        {STATUS_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={cn(
              styles.statusOption,
              value === option.value && styles.statusSelected,
            )}
          >
            <input
              type="radio"
              className={styles.statusInput}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onValueChange(option.value)}
            />
            <span
              className={cn(styles.statusDot, styles[option.value])}
              aria-hidden="true"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
