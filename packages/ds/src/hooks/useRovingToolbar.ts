import { useRef, useState, type KeyboardEvent } from 'react';
import {
  findFirstEnabledIndex,
  findLastEnabledIndex,
  findNextEnabledIndex,
  type MaybeDisabled,
} from '../utils/rovingIndex';

export interface RovingToolbarItemProps {
  ref: (el: HTMLButtonElement | null) => void;
  tabIndex: number;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onFocus: () => void;
}

export interface UseRovingToolbarResult {
  getItemProps: (index: number) => RovingToolbarItemProps;
}

export function useRovingToolbar(
  items: readonly MaybeDisabled[],
): UseRovingToolbarResult {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const focusIndex = (idx: number) => {
    if (idx < 0) return;
    setActiveIndex(idx);
    buttonRefs.current[idx]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        focusIndex(findNextEnabledIndex(items, currentIndex, 1));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusIndex(findNextEnabledIndex(items, currentIndex, -1));
        break;
      case 'Home':
        event.preventDefault();
        focusIndex(findFirstEnabledIndex(items));
        break;
      case 'End':
        event.preventDefault();
        focusIndex(findLastEnabledIndex(items));
        break;
    }
  };

  const activeEnabled =
    activeIndex >= 0 &&
    activeIndex < items.length &&
    !items[activeIndex].disabled;
  const tabbableIndex = activeEnabled
    ? activeIndex
    : findFirstEnabledIndex(items);

  const getItemProps = (index: number): RovingToolbarItemProps => ({
    ref: (el) => {
      buttonRefs.current[index] = el;
    },
    tabIndex: index === tabbableIndex ? 0 : -1,
    onKeyDown: (event) => handleKeyDown(event, index),
    onFocus: () => setActiveIndex(index),
  });

  return { getItemProps };
}
