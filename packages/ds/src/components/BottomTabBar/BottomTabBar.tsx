import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './BottomTabBar.module.css';

export interface BottomTabBarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'aria-label'
> {
  'aria-label': string;
}

export const BottomTabBar = forwardRef<HTMLElement, BottomTabBarProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <nav ref={ref} className={cn(styles.bar, className)} {...rest}>
        {children}
      </nav>
    );
  },
);

BottomTabBar.displayName = 'BottomTabBar';
