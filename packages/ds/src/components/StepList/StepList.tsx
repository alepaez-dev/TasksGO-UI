import { forwardRef, type HTMLAttributes } from 'react';
import { Markdown } from '../Markdown';
import { cn } from '../../utils/cn';
import styles from './StepList.module.css';

export interface StepListProps extends HTMLAttributes<HTMLOListElement> {
  steps: readonly string[];
  dividers?: boolean;
}

export const StepList = forwardRef<HTMLOListElement, StepListProps>(
  ({ steps, dividers = false, className, ...rest }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn(styles.stepList, dividers && styles.dividers, className)}
        {...rest}
      >
        {steps.map((step, index) => (
          <li key={index} className={styles.step}>
            <Markdown source={step} className={styles.stepBody} />
          </li>
        ))}
      </ol>
    );
  },
);

StepList.displayName = 'StepList';
