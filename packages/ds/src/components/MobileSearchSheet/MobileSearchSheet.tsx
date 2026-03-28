import {
  forwardRef,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  SearchPalette,
  type SearchPaletteGroup,
  type SearchPaletteResult,
} from '../SearchPalette';
import { cn } from '../../utils/cn';
import {
  transitionDurations,
  type TransitionDuration,
} from '../../tokens/interaction';
import styles from './MobileSearchSheet.module.css';

export interface MobileSearchSheetProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  groups: readonly SearchPaletteGroup[];
  activeResultId?: string;
  onResultSelect?: (result: SearchPaletteResult) => void;
  emptyState?: ReactNode;
  duration?: TransitionDuration;
}

export const MobileSearchSheet = forwardRef<
  HTMLDivElement,
  MobileSearchSheetProps
>(
  (
    {
      open,
      onClose,
      groups,
      activeResultId,
      onResultSelect,
      emptyState,
      duration = 'slow',
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    useEffect(() => {
      if (!open) return;
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          onClose();
        }
      }
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (typeof document === 'undefined') return null;

    const durationStyle = {
      '--sheet-duration': transitionDurations[duration],
    } as React.CSSProperties;

    return createPortal(
      <div
        className={cn(styles.backdrop, open && styles.open)}
        style={durationStyle}
      >
        <button
          type="button"
          className={styles.backdropClose}
          onClick={onClose}
          tabIndex={-1}
          aria-hidden="true"
        />
        <div
          ref={ref}
          role="region"
          aria-label="Search results"
          className={cn(styles.sheet, open && styles.open, className)}
          style={{ ...durationStyle, ...style }}
          {...rest}
        >
          <div className={styles.scrollArea}>
            {groups.length > 0 ? (
              <SearchPalette
                groups={groups}
                activeResultId={activeResultId}
                onResultSelect={onResultSelect}
                variant="mobile"
                aria-label="Search results"
              />
            ) : emptyState ? (
              <div className={styles.emptyState}>{emptyState}</div>
            ) : null}
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

MobileSearchSheet.displayName = 'MobileSearchSheet';
