import { useEffect } from 'react';

const OVERLAY_MARKER = 'data-ds-overlay-portal';

let inertCount = 0;
let marked: {
  element: Element;
  ariaHidden: string | null;
  inert: boolean;
}[] = [];

function applyInert() {
  marked = Array.from(document.body.children)
    .filter((element) => !element.hasAttribute(OVERLAY_MARKER))
    .map((element) => ({
      element,
      ariaHidden: element.getAttribute('aria-hidden'),
      inert: element.hasAttribute('inert'),
    }));

  for (const { element } of marked) {
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('inert', '');
  }
}

function restore() {
  for (const { element, ariaHidden, inert } of marked) {
    if (ariaHidden === null) element.removeAttribute('aria-hidden');
    else element.setAttribute('aria-hidden', ariaHidden);
    if (!inert) element.removeAttribute('inert');
  }
  marked = [];
}

export function useInertBackground(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (inertCount === 0) applyInert();
    inertCount++;
    return () => {
      inertCount--;
      if (inertCount === 0) restore();
    };
  }, [active]);
}
