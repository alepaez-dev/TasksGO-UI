import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { readableTextOn, type ReadableText } from '../../utils/readableTextOn';
import styles from './Avatar.module.css';

const TINT_TEXT: Record<ReadableText, string> = {
  light: 'var(--ds-color-avatar-tint-text-light)',
  dark: 'var(--ds-color-avatar-tint-text-dark)',
};

type AvatarVariant = 'project' | 'profile';
type AvatarSize = 'sm' | 'md' | 'lg';

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
    const readable = tint === undefined ? null : readableTextOn(tint);
    const tintStyle: Record<string, string> = {};
    if (tint !== undefined) tintStyle['--ds-color-avatar-tint'] = tint;
    if (readable !== null) {
      tintStyle['--ds-color-avatar-tint-text'] = TINT_TEXT[readable];
    }
    const mergedStyle: CSSProperties | undefined =
      tint === undefined
        ? style
        : ({ ...style, ...tintStyle } as CSSProperties);

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
