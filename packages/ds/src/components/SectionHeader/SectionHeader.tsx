import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './SectionHeader.module.css';

// h1 is reserved for page titles; SectionHeader renders subsection headings
type HeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  subtitle?: ReactNode;
  headingLevel?: HeadingLevel;
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, children, subtitle, headingLevel = 3, ...rest }, ref) => {
    const Heading = `h${headingLevel}` as const;
    const hasSubtitle =
      subtitle != null && subtitle !== false && subtitle !== '';
    return (
      <div ref={ref} className={cn(styles.sectionHeader, className)} {...rest}>
        <Heading className={styles.title}>{children}</Heading>
        {hasSubtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
    );
  },
);

SectionHeader.displayName = 'SectionHeader';
