import { forwardRef, type InputHTMLAttributes } from 'react';
import { SearchInput } from '../SearchInput';
import { cn } from '../../utils/cn';
import styles from './FloatingSearch.module.css';

export interface FloatingSearchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  shortcutHint?: string;
  onClear?: () => void;
}

export const FloatingSearch = forwardRef<HTMLInputElement, FloatingSearchProps>(
  ({ shortcutHint, onClear, className, ...inputProps }, ref) => {
    return (
      <div className={styles.positioner}>
        <div className={cn(styles.bar, className)}>
          <SearchInput
            ref={ref}
            shortcutHint={shortcutHint}
            onClear={onClear}
            className={styles.searchInput}
            {...inputProps}
          />
        </div>
      </div>
    );
  },
);

FloatingSearch.displayName = 'FloatingSearch';
