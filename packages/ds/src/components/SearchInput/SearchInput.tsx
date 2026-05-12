import { forwardRef, type InputHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import styles from './SearchInput.module.css';

type SearchInputSize = 'sm' | 'md';

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  shortcutHint?: string;
  size?: SearchInputSize;
  onClear?: () => void;
  borderless?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      shortcutHint,
      size = 'md',
      onClear,
      borderless = false,
      className,
      ...inputProps
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          styles.wrapper,
          styles[size],
          borderless && styles.borderless,
          className,
        )}
      >
        <Icon name="search" size="sm" className={styles.icon} />
        <input
          ref={ref}
          type="search"
          className={styles.input}
          {...inputProps}
        />
        {onClear ? (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
            aria-label="Clear search"
          >
            <Icon name="cancel" size="sm" />
          </button>
        ) : shortcutHint ? (
          <kbd className={styles.kbd}>{shortcutHint}</kbd>
        ) : null}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
