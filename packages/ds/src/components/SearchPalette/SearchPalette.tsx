import { forwardRef, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import styles from './SearchPalette.module.css';

type SearchPaletteResultType = 'task' | 'ticket' | 'doc';

export type SearchPaletteResult = Readonly<{
  id: string;
  label: string;
  refId: string;
  type: SearchPaletteResultType;
}>;

export type SearchPaletteGroup = Readonly<{
  title: string;
  results: readonly SearchPaletteResult[];
}>;

export interface SearchPaletteProps extends HTMLAttributes<HTMLDivElement> {
  groups: readonly SearchPaletteGroup[];
  activeResultId?: string;
  onResultSelect?: (result: SearchPaletteResult) => void;
}

export const SearchPalette = forwardRef<HTMLDivElement, SearchPaletteProps>(
  ({ groups, activeResultId, onResultSelect, className, ...rest }, ref) => {
    const handleResultKeyDown =
      (result: SearchPaletteResult) => (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onResultSelect?.(result);
        }
      };

    return (
      <div
        ref={ref}
        role="listbox"
        className={cn(styles.palette, className)}
        {...rest}
      >
        {groups.map((group) => (
          <div key={group.title} role="group" aria-label={group.title}>
            <div className={styles.groupHeader}>{group.title}</div>
            {group.results.map((result) => {
              const isActive = result.id === activeResultId;
              return (
                <div
                  key={result.id}
                  id={result.id}
                  role="option"
                  tabIndex={-1}
                  aria-selected={isActive}
                  className={cn(styles.result, isActive && styles.resultActive)}
                  onClick={() => onResultSelect?.(result)}
                  onKeyDown={handleResultKeyDown(result)}
                >
                  <span className={styles.resultLabel}>{result.label}</span>
                  <span className={cn(styles.resultRef, styles[result.type])}>
                    {result.refId}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
);

SearchPalette.displayName = 'SearchPalette';
