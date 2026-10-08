import type { Page } from '@playwright/test';

const SAME_ROW_TOLERANCE = 24;

export interface FocusStop {
  readonly label: string;
  readonly y: number;
}

export async function focusOrderWithin(
  page: Page,
  selector: string,
): Promise<FocusStop[]> {
  return page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (root === null) throw new Error(`no element matches ${sel}`);
    const focusable = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    return [...focusable].map((el) => ({
      label: (
        el.getAttribute('aria-label') ??
        el.textContent ??
        el.tagName
      ).trim(),
      y: Math.round(el.getBoundingClientRect().y),
    }));
  }, selector);
}

/** Stops that sit visually above the stop before them. */
export function backwardStops(stops: readonly FocusStop[]): FocusStop[] {
  return stops.filter(
    (stop, i) => i > 0 && stop.y < stops[i - 1].y - SAME_ROW_TOLERANCE,
  );
}
