import { useRef, type KeyboardEvent } from 'react';
import {
  findFirstEnabledIndex,
  findLastEnabledIndex,
  findNextEnabledIndex,
} from '../utils/rovingIndex';

export interface RovingTabListItem {
  value: string;
  disabled?: boolean;
}

export interface RovingTabProps {
  ref: (el: HTMLButtonElement | null) => void;
  tabIndex: number;
  'aria-selected': boolean;
  disabled: boolean | undefined;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

export interface UseRovingTabListResult {
  selectedIndex: number;
  focusableIndex: number;
  getTabProps: (index: number) => RovingTabProps;
}

export function useRovingTabList(
  items: readonly RovingTabListItem[],
  value: string,
  onValueChange: (value: string) => void,
): UseRovingTabListResult {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activateIndex = (idx: number) => {
    if (idx < 0) return;
    const target = items[idx];
    buttonRefs.current[idx]?.focus();
    if (target.value !== value) onValueChange(target.value);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        activateIndex(findNextEnabledIndex(items, currentIndex, 1));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        activateIndex(findNextEnabledIndex(items, currentIndex, -1));
        break;
      case 'Home':
        event.preventDefault();
        activateIndex(findFirstEnabledIndex(items));
        break;
      case 'End':
        event.preventDefault();
        activateIndex(findLastEnabledIndex(items));
        break;
    }
  };

  const matchedIndex = items.findIndex((it) => it.value === value);
  const isMatchActive = matchedIndex !== -1 && !items[matchedIndex].disabled;
  const selectedIndex = isMatchActive ? matchedIndex : -1;
  const focusableIndex = isMatchActive
    ? matchedIndex
    : findFirstEnabledIndex(items);

  const getTabProps = (index: number): RovingTabProps => ({
    ref: (el) => {
      buttonRefs.current[index] = el;
    },
    tabIndex: index === focusableIndex ? 0 : -1,
    'aria-selected': index === selectedIndex,
    disabled: items[index].disabled,
    onClick: () => {
      const item = items[index];
      if (item.disabled) return;
      if (item.value !== value) onValueChange(item.value);
    },
    onKeyDown: (event) => handleKeyDown(event, index),
  });

  return { selectedIndex, focusableIndex, getTabProps };
}
