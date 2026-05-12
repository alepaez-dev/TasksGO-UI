import { forwardRef, type HTMLAttributes, type KeyboardEvent } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import styles from './SearchPalette.module.css';

type SearchPaletteResultType = 'task' | 'ticket' | 'doc';

export type SearchPaletteResult = Readonly<{
  id: string;
  label: string;
  badge?: string;
  subtitle?: string;
  type: SearchPaletteResultType;
}>;

export type SearchPaletteGroup = Readonly<{
  title: string;
  results: readonly SearchPaletteResult[];
}>;

export function getSearchPaletteOptionId(
  paletteId: string,
  resultId: string,
): string {
  return `${paletteId}-${resultId}`;
}

const resultTypeIcon: Record<SearchPaletteResultType, IconName> = {
  task: 'check_circle',
  doc: 'description',
  ticket: 'confirmation_number',
};

type SearchPaletteVariant = 'default' | 'mobile';

export interface SearchPaletteProps extends HTMLAttributes<HTMLDivElement> {
  groups: readonly SearchPaletteGroup[];
  activeResultId?: string;
  onResultSelect?: (result: SearchPaletteResult) => void;
  variant?: SearchPaletteVariant;
}

export const SearchPalette = forwardRef<HTMLDivElement, SearchPaletteProps>(
  (
    {
      groups,
      activeResultId,
      onResultSelect,
      variant = 'default',
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const isMobile = variant === 'mobile';
    const paletteId = id ?? 'search-palette';
    const optionId = (resultId: string) =>
      getSearchPaletteOptionId(paletteId, resultId);

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
        id={id}
        role="listbox"
        className={cn(styles.palette, isMobile && styles.mobile, className)}
        {...rest}
      >
        {groups.map((group) => (
          <div key={group.title} role="group" aria-label={group.title}>
            <div
              className={cn(
                styles.groupHeader,
                isMobile && styles.mobileGroupHeader,
              )}
            >
              {group.title}
            </div>
            {group.results.map((result) => {
              const isActive = result.id === activeResultId;
              return (
                <div
                  key={result.id}
                  id={optionId(result.id)}
                  role="option"
                  tabIndex={-1}
                  aria-selected={isActive}
                  className={cn(
                    styles.result,
                    isMobile && styles.mobileResult,
                    isActive && styles.resultActive,
                  )}
                  onClick={() => onResultSelect?.(result)}
                  onKeyDown={handleResultKeyDown(result)}
                >
                  {isMobile && (
                    <Icon
                      name={resultTypeIcon[result.type]}
                      size="sm"
                      className={cn(styles.resultIcon, styles[result.type])}
                    />
                  )}
                  <div className={styles.resultBody}>
                    <span className={styles.resultLabel}>{result.label}</span>
                    {isMobile && result.subtitle && (
                      <span className={styles.resultSubtitle}>
                        {result.subtitle}
                      </span>
                    )}
                  </div>
                  {result.badge && (
                    <span className={cn(styles.resultRef, styles[result.type])}>
                      {result.badge}
                    </span>
                  )}
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
