import { useCallback, useEffect, useRef, useState } from 'react';
import { useClickOutside } from './useClickOutside';

export interface UseSelectorStateReturn {
  readonly ref: React.RefObject<HTMLDivElement | null>;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function useSelectorState(): UseSelectorStateReturn {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  return { ref, open, onOpenChange: setOpen };
}

export interface SelectorGroupEntry {
  readonly ref: (el: HTMLDivElement | null) => void;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

/**
 * Manages mutual exclusion for multiple `Selector` components — only one
 * can be open at a time. Opening one (via mouse or keyboard) automatically
 * closes any other. Includes click-outside detection.
 *
 * Use `useSelectorState` instead when selectors are independent and may open
 * simultaneously.
 *
 * @example
 * ```tsx
 * const selectors = useSelectorGroup('priority', 'ticket', 'status');
 * const { ref, open, onOpenChange } = selectors.priority;
 *
 * <Selector ref={ref} open={open} onOpenChange={onOpenChange} ... />
 * ```
 */
export function useSelectorGroup<K extends string>(
  ...keys: K[]
): Record<K, SelectorGroupEntry> {
  const [openKey, setOpenKey] = useState<K | null>(null);
  const elements = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!openKey) return;
    const onMouseDown = (e: MouseEvent) => {
      const el = elements.current[openKey];
      if (el && !el.contains(e.target as Node)) {
        setOpenKey(null);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [openKey]);

  const result = {} as Record<K, SelectorGroupEntry>;
  for (const key of keys) {
    result[key] = {
      ref: (el: HTMLDivElement | null) => {
        elements.current[key] = el;
      },
      open: openKey === key,
      onOpenChange: (v: boolean) => setOpenKey(v ? key : null),
    };
  }
  return result;
}
