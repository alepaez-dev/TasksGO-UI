import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './SectionHeader.module.css';

export type SectionHeaderProps = HTMLAttributes<HTMLHeadingElement>;

export const SectionHeader = forwardRef<HTMLHeadingElement, SectionHeaderProps>(
  ({ className, children, ...rest }, ref) => {
    const classes = cn(styles.sectionHeader, className);

    return (
      <h3 ref={ref} className={classes} {...rest}>
        {children}
      </h3>
    );
  },
);

SectionHeader.displayName = 'SectionHeader';
