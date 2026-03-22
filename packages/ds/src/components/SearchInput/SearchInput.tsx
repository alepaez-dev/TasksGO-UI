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
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ shortcutHint, size = 'md', className, ...inputProps }, ref) => {
    return (
      <div className={cn(styles.wrapper, styles[size], className)}>
        <Icon name="search" size="sm" className={styles.icon} />
        <input
          ref={ref}
          type="search"
          className={styles.input}
          {...inputProps}
        />
        {shortcutHint && <kbd className={styles.kbd}>{shortcutHint}</kbd>}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
