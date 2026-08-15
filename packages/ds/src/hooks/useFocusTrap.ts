import { useEffect, useRef } from 'react';

export const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

function focusablesIn(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => !el.closest('[inert]'));
}

export interface UseFocusTrapOptions {
  autoFocus?: boolean;
}

export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  options: UseFocusTrapOptions = {},
): void {
  const { autoFocus = true } = options;
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    previouslyFocused.current = document.activeElement as HTMLElement;

    if (autoFocus) {
      const focusables = focusablesIn(ref.current);
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !ref.current) return;

      const currentFocusables = focusablesIn(ref.current);
      if (currentFocusables.length === 0) return;

      const first = currentFocusables[0];
      const last = currentFocusables[currentFocusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [active, ref, autoFocus]);
}
