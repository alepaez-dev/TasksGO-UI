import type { Locator } from '@playwright/test';

const SAME_ROW_TOLERANCE = 24;

export interface FocusStop {
  readonly label: string;
  readonly y: number;
}

export async function focusOrderWithin(root: Locator): Promise<FocusStop[]> {
  return root.evaluate((element) => {
    const candidates = element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]',
    );
    // sequential focus only: tabindex="-1" is programmatic, and a display:none
    // control (a file input behind a button, say) has no visual position to
    // compare against
    const focusable = [...candidates].filter(
      (el) => el.tabIndex >= 0 && el.getClientRects().length > 0,
    );
    return focusable.map((el) => ({
      label: (
        el.getAttribute('aria-label') ??
        el.textContent ??
        el.tagName
      ).trim(),
      y: Math.round(el.getBoundingClientRect().y),
    }));
  });
}

/** Stops that sit visually above the stop before them. */
export function backwardStops(stops: readonly FocusStop[]): FocusStop[] {
  return stops.filter(
    (stop, i) => i > 0 && stop.y < stops[i - 1].y - SAME_ROW_TOLERANCE,
  );
}
