import { type ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import styles from './DialogField.module.css';

export type DialogFieldControl = 'input' | 'textarea';

export type DialogFieldLabelProps =
  | {
      as?: 'label';
      htmlFor: string;
      required?: boolean;
      hint?: string;
      children: ReactNode;
    }
  | { as: 'legend'; required?: boolean; hint?: string; children: ReactNode };

export function DialogFieldLabel(props: DialogFieldLabelProps) {
  const { required = false, hint, children } = props;
  const className = cn(styles.label, required && styles.required);
  const body = (
    <>
      {children}
      {hint && <span className={styles.hint}>{` ${hint}`}</span>}
    </>
  );

  if (props.as === 'legend') {
    return <legend className={className}>{body}</legend>;
  }
  return (
    <label htmlFor={props.htmlFor} className={className}>
      {body}
    </label>
  );
}

export interface DialogFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  as?: DialogFieldControl;
  required?: boolean;
  placeholder?: string;
  describedBy?: string;
}

export function DialogField({
  id,
  label,
  value,
  onChange,
  as = 'textarea',
  required = false,
  placeholder,
  describedBy,
}: DialogFieldProps) {
  const controlClassName = cn(
    styles.control,
    as === 'textarea' && styles.textarea,
  );

  return (
    <div className={styles.field}>
      <DialogFieldLabel htmlFor={id} required={required}>
        {label}
      </DialogFieldLabel>
      {as === 'input' ? (
        <input
          id={id}
          type="text"
          className={controlClassName}
          value={value}
          required={required}
          placeholder={placeholder}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <textarea
          id={id}
          className={controlClassName}
          value={value}
          required={required}
          placeholder={placeholder}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
