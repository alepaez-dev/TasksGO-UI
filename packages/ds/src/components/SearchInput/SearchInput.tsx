import { forwardRef, type InputHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import styles from './SearchInput.module.css';

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  shortcutHint?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ shortcutHint, className, ...inputProps }, ref) => {
    return (
      <div className={cn(styles.wrapper, className)}>
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
