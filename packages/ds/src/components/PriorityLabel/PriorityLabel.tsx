import { forwardRef, type HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import styles from './PriorityLabel.module.css';

type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type PriorityLabelAppearance = 'text' | 'icon-text' | 'icon';

export interface PriorityLabelProps extends HTMLAttributes<HTMLSpanElement> {
  priority: PriorityLevel;
  appearance?: PriorityLabelAppearance;
}

const GLYPH = {
  critical: 'warning',
  high: 'signal_cellular_alt',
  medium: 'signal_cellular_alt_2_bar',
  low: 'signal_cellular_alt_1_bar',
} as const satisfies Record<PriorityLevel, IconName>;

const APPEARANCE_CLASS: Record<PriorityLabelAppearance, string> = {
  text: styles.text,
  'icon-text': styles.iconText,
  icon: styles.iconOnly,
};

export const PriorityLabel = forwardRef<HTMLSpanElement, PriorityLabelProps>(
  ({ priority, appearance = 'text', className, ...rest }, ref) => {
    const classes = cn(
      styles.priorityLabel,
      styles[priority],
      APPEARANCE_CLASS[appearance],
      priority === 'critical' && appearance === 'icon-text' && styles.chip,
      className,
    );

    return (
      <span ref={ref} className={classes} {...rest}>
        {appearance !== 'text' && <Icon name={GLYPH[priority]} size="sm" />}
        {appearance === 'icon' ? (
          <span className={styles.srOnly}>{priority}</span>
        ) : (
          priority
        )}
      </span>
    );
  },
);

PriorityLabel.displayName = 'PriorityLabel';
