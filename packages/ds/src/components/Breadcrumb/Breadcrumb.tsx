import { forwardRef, Fragment, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  segments: BreadcrumbSegment[];
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ segments, className, ...rest }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn(styles.breadcrumb, className)}
        {...rest}
      >
        <ol className={styles.list}>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;

            return (
              <Fragment key={index}>
                {index > 0 && (
                  <li className={styles.separator} aria-hidden="true">
                    /
                  </li>
                )}
                <li>
                  {segment.href && !isLast ? (
                    <a href={segment.href} className={styles.link}>
                      {segment.label}
                    </a>
                  ) : (
                    <span
                      className={cn(styles.link, isLast && styles.current)}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {segment.label}
                    </span>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumb.displayName = 'Breadcrumb';
