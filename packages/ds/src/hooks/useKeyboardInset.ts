import { useEffect, useState } from 'react';

export interface KeyboardInset {
  /**
   * Y position (px, in layout-viewport coordinates) of the visual viewport's
   * bottom edge — i.e. the top of the on-screen keyboard when one is open.
   * Anchor a bottom-docked bar's bottom here with
   * `top: <viewportBottom>px; transform: translateY(-100%)`.
   *
   * Derived only from `visualViewport` (never `window.innerHeight`, which
   * shrinks with the keyboard on iOS and would collapse the offset to 0).
   */
  viewportBottom: number;
}

function readInset(): KeyboardInset {
  if (typeof window === 'undefined') return { viewportBottom: 0 };
  const vv = window.visualViewport;
  if (!vv) return { viewportBottom: window.innerHeight };
  return { viewportBottom: vv.offsetTop + vv.height };
}

export function useKeyboardInset(): KeyboardInset {
  const [inset, setInset] = useState<KeyboardInset>(readInset);

  useEffect(() => {
    const vv = typeof window === 'undefined' ? null : window.visualViewport;
    if (!vv) return;
    const update = () => setInset(readInset());
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  return inset;
}
