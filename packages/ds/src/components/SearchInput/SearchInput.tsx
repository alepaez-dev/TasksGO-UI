import { forwardRef, useRef, type InputHTMLAttributes } from 'react';
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
    const inputRef = useRef<HTMLInputElement>(null);

    const setInputRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) Object.assign(ref, { current: node });
    };

    const handleClear = () => {
      inputRef.current?.focus();
      onClear?.();
    };

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
          ref={setInputRef}
          type="search"
          className={styles.input}
          {...inputProps}
        />
        {onClear ? (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
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
