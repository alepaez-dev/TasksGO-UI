import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { cn } from '../../utils/cn';
import styles from './AvatarGroup.module.css';

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  'aria-label': string;
}

type ChildWithStyle = ReactElement<{ style?: CSSProperties }>;

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, className, ...rest }, ref) => {
    const items = Children.toArray(children).filter(isValidElement);

    return (
      <div
        ref={ref}
        role="group"
        className={cn(styles.group, className)}
        {...rest}
      >
        {items.map((child, index) => {
          const typed = child as ChildWithStyle;
          return cloneElement(typed, {
            style: {
              ...typed.props.style,
              '--ds-avatar-group-index': index,
            } as CSSProperties,
          });
        })}
      </div>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';
