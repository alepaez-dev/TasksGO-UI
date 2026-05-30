import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './Avatar.module.css';

type AvatarVariant = 'project' | 'profile';
type AvatarSize = 'sm' | 'md';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  initial: string;
  variant?: AvatarVariant;
  size?: AvatarSize;
  /** Any CSS color string (hex, rgb, hsl, named). Overrides the variant's default background. */
  tint?: string;
  'aria-label': string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      initial,
      variant = 'project',
      size = 'md',
      tint,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const classes = cn(styles.avatar, styles[variant], styles[size], className);
    const mergedStyle: CSSProperties | undefined = tint
      ? ({ ...style, '--ds-color-avatar-tint': tint } as CSSProperties)
      : style;

    return (
      <span
        ref={ref}
        role="img"
        className={classes}
        style={mergedStyle}
        {...rest}
      >
        {initial}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';
