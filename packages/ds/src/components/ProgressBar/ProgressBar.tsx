import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './ProgressBar.module.css';

type ProgressBarSize = 'sm' | 'md';
type ProgressBarTone = 'neutral' | 'success' | 'warning' | 'critical';

export interface ProgressBarProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  value: number;
  max: number;
  'aria-label': string;
  size?: ProgressBarSize;
  tone?: ProgressBarTone;
}

export const ProgressBar = forwardRef<HTMLSpanElement, ProgressBarProps>(
  (
    { value, max, size = 'sm', tone = 'neutral', className, style, ...rest },
    ref,
  ) => {
    const safeMax = Number.isFinite(max) ? Math.max(max, 0) : 0;
    const safeValue = Number.isFinite(value) ? value : 0;
    const clampedValue = Math.min(Math.max(safeValue, 0), safeMax);
    const percent =
      safeMax > 0 ? Math.round((clampedValue / safeMax) * 100) : 0;
    const mergedStyle = {
      ...style,
      '--ds-progress-bar-fill': `${percent}%`,
    } as CSSProperties;

    return (
      <span
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clampedValue}
        className={cn(styles.track, styles[size], styles[tone], className)}
        style={mergedStyle}
        {...rest}
      >
        <span className={styles.fill} />
      </span>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';
