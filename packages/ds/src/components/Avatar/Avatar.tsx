import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './Avatar.module.css';

type AvatarSize = 'sm' | 'md';

interface AvatarBaseProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
  'aria-label': string;
}

type AvatarVariantProps =
  | {
      variant?: 'project' | 'profile';
      initial: string;
      /** Any CSS color string (hex, rgb, hsl, named). Overrides the variant's default background. */
      tint?: string;
    }
  | {
      variant: 'empty';
      initial?: never;
      tint?: never;
    };

export type AvatarProps = AvatarBaseProps & AvatarVariantProps;

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
    const isEmpty = variant === 'empty';
    const classes = cn(styles.avatar, styles[variant], styles[size], className);
    const mergedStyle: CSSProperties | undefined =
      tint && !isEmpty
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
        {isEmpty ? null : initial}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';
