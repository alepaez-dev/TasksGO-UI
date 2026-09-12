import { test, expect, type Page } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';
import { backwardStops, focusOrderWithin } from '../helpers/focusOrder';

const STORY_ID = 'components-filepreviewoverlay--mobile';
const NO_PREVIEW_STORY_ID = 'components-filepreviewoverlay--mobile-no-preview';

const DIALOG = '[role="dialog"]';

async function openStory(page: Page, storyId: string) {
  await page.goto(storyUrl(storyId));
  await page.getByRole('dialog').waitFor({ state: 'visible' });
}

/**
 * The stacked layout must actually be active or these tests prove nothing:
 * wide renders Download beside Close in the top bar, stacked puts it below
 * the stage. Polled rather than read once, so it survives a slow first paint.
 */
async function expectStackedLayout(page: Page) {
  await expect
    .poll(
      async () => {
        const box = await page
          .getByRole('link', { name: /download/i })
          .boundingBox();
        return box?.y ?? 0;
      },
      { message: 'Download should sit below the stage in the stacked layout' },
    )
    .toBeGreaterThan(200);
}

test.describe('FilePreviewOverlay — stacked layout', () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, STORY_ID);
  });

  test('keeps every control inside the viewport', async ({ page }) => {
    await expectStackedLayout(page);

    const overflowing = await page.locator(DIALOG).evaluate((dialog) => {
      const limit = window.innerWidth + 0.5;
      const insideScroller = (el: Element) => {
        for (
          let p = el.parentElement;
          p !== null && p !== dialog.parentElement;
          p = p.parentElement
        ) {
          const overflowX = getComputedStyle(p).overflowX;
          if (overflowX === 'auto' || overflowX === 'scroll') return true;
        }
        return false;
      };
      return [...dialog.querySelectorAll('*')]
        .filter((el) => !insideScroller(el))
        .filter((el) => el.getBoundingClientRect().right > limit)
        .map((el) => `${el.tagName}.${el.getAttribute('class') ?? ''}`);
    });

    expect(overflowing).toEqual([]);
  });

  test('tab order follows the stacked visual order', async ({ page }) => {
    await expectStackedLayout(page);

    const stops = await focusOrderWithin(page, DIALOG);
    expect(backwardStops(stops)).toEqual([]);
  });

  test('lays the nav row above the counter row', async ({ page }) => {
    await expectStackedLayout(page);

    const boxes = await page.locator(DIALOG).evaluate((dialog) => {
      const y = (sel: string) => {
        const el = dialog.querySelector(sel);
        return el === null ? null : Math.round(el.getBoundingClientRect().y);
      };
      return {
        prev: y('[aria-label="Previous file"]'),
        next: y('[aria-label="Next file"]'),
        download: y('a[download]'),
        downloadAll: y('button:has(> span[data-icon-name="download"])'),
      };
    });

    // prev / Download / next share row 4
    expect(Math.abs((boxes.prev ?? 0) - (boxes.next ?? 0))).toBeLessThan(24);
    expect(Math.abs((boxes.prev ?? 0) - (boxes.download ?? 0))).toBeLessThan(24);
    // Download all sits on its own row underneath
    expect(boxes.downloadAll ?? 0).toBeGreaterThan(boxes.download ?? 0);
  });

  test('keeps the active thumbnail in view when the strip overflows', async ({
    page,
  }) => {
    // 390 fits seven files with nothing to spare; narrow enough to overflow
    await page.setViewportSize({ width: 320, height: 800 });
    await page.getByRole('dialog').waitFor({ state: 'visible' });

    const strip = page.getByRole('group', { name: 'All files' });
    await expect
      .poll(() => strip.evaluate((el) => el.scrollWidth > el.clientWidth), {
        message: 'filmstrip must overflow or this test proves nothing',
      })
      .toBe(true);

    const next = page.getByRole('button', { name: 'Next file' });
    const total = await strip.evaluate(
      (el) => el.querySelectorAll('button').length,
    );
    for (let i = 0; i < total - 1; i += 1) {
      await next.click();
    }
    await expect(next).toHaveAttribute('aria-disabled', 'true');

    const visible = await strip.evaluate((el) => {
      const active = el.querySelector('[aria-current="true"]');
      if (active === null) throw new Error('no active thumbnail');
      const s = el.getBoundingClientRect();
      const a = active.getBoundingClientRect();
      return a.left >= s.left - 1 && a.right <= s.right + 1;
    });

    expect(visible).toBe(true);
  });

  test('close stays reachable and dismisses the overlay', async ({ page }) => {
    await expectStackedLayout(page);

    await page.getByRole('button', { name: /close preview/i }).tap();

    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

test.describe('FilePreviewOverlay — stacked, no inline preview', () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, NO_PREVIEW_STORY_ID);
  });

  test('still offers download for a file it cannot render', async ({
    page,
  }) => {
    await expectStackedLayout(page);

    await expect(
      page.getByText('No inline preview for this file. Download to open it.'),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /download/i })).toBeVisible();
  });
});
