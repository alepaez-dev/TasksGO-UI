import { test, expect, type Locator, type Page } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';
import { backwardStops, focusOrderWithin } from '../helpers/focusOrder';

const STORY_ID = 'components-filepreviewoverlay--mobile';
const NO_PREVIEW_STORY_ID = 'components-filepreviewoverlay--mobile-no-preview';

const DIALOG = '[role="dialog"]';

/**
 * Dispatches a real one-finger drag across `target`. The listener sits on the
 * overlay backdrop, so a touch anywhere inside the overlay bubbles to it.
 */
async function swipeOn(target: Locator, fromX: number, toX: number) {
  await target.evaluate(
    (el, { startX, endX }) => {
      const makeTouchEvent = (type: string, x: number) => {
        const touch = new Touch({
          identifier: 1,
          target: el,
          clientX: x,
          clientY: 300,
        });
        const activeTouches = type === 'touchend' ? [] : [touch];
        return new TouchEvent(type, {
          bubbles: true,
          cancelable: true,
          touches: activeTouches,
          targetTouches: activeTouches,
          changedTouches: [touch],
        });
      };
      el.dispatchEvent(makeTouchEvent('touchstart', startX));
      el.dispatchEvent(makeTouchEvent('touchmove', endX));
      el.dispatchEvent(makeTouchEvent('touchend', endX));
    },
    { startX: fromX, endX: toX },
  );
}

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
      const strip = el.getBoundingClientRect();
      const thumb = active.getBoundingClientRect();
      return thumb.left >= strip.left - 1 && thumb.right <= strip.right + 1;
    });

    expect(visible).toBe(true);
  });

  test('swipes to change file, over the overlay and over the image', async ({
    page,
  }) => {
    const counter = page.getByText(/^\d+ \/ \d+$/);
    const overlay = page.getByRole('dialog');

    await expect(counter).toHaveText('1 / 7');

    // anywhere in the overlay, including the empty space beside the image
    await swipeOn(overlay, 320, 120);
    await expect(counter).toHaveText('2 / 7');

    await swipeOn(overlay, 120, 320);
    await expect(counter).toHaveText('1 / 7');

    // and over the image itself, addressed by its alt text
    await swipeOn(page.getByAltText('cleo.jpg'), 320, 120);
    await expect(counter).toHaveText('2 / 7');

    // but scoped to this overlay: a gesture outside it is ignored, so a
    // stacked overlay cannot drive the file underneath it
    await swipeOn(page.locator('body'), 320, 120);
    await expect(counter).toHaveText('2 / 7');
  });

  test('clamps at the first file and at the last', async ({ page }) => {
    const counter = page.getByText(/^\d+ \/ \d+$/);
    const overlay = page.getByRole('dialog');

    // first file: swiping back must not wrap to the last
    await expect(counter).toHaveText('1 / 7');
    await swipeOn(overlay, 120, 320);
    await expect(counter).toHaveText('1 / 7');

    // walk to the end. Note this asserts behaviour, not the guard: activeIndex
    // is clamped on read, so removing `index < lastIndex` still passes here.
    const next = page.getByRole('button', { name: 'Next file' });
    for (let i = 0; i < 6; i += 1) await next.click();
    await expect(counter).toHaveText('7 / 7');

    await swipeOn(overlay, 320, 120);
    await expect(counter).toHaveText('7 / 7');
  });

  test('a pinch does not navigate, even if a finger drifts sideways', async ({
    page,
  }) => {
    const counter = page.getByText(/^\d+ \/ \d+$/);
    await expect(counter).toHaveText('1 / 7');

    await page.getByRole('dialog').evaluate((el) => {
      const fingerAt = (x: number, identifier: number) =>
        new Touch({ identifier, target: el, clientX: x, clientY: 300 });
      const fire = (
        type: string,
        activeTouches: Touch[],
        changedTouches: Touch[],
      ) =>
        el.dispatchEvent(
          new TouchEvent(type, {
            bubbles: true,
            cancelable: true,
            touches: activeTouches,
            targetTouches: activeTouches,
            changedTouches,
          }),
        );

      const thumb = fingerAt(300, 1);
      fire('touchstart', [thumb], [thumb]);
      // second finger lands — a pinch begins
      const index = fingerAt(320, 2);
      fire('touchstart', [thumb, index], [index]);
      // the thumb drifts far enough left to clear the 56px threshold
      const thumbDrifted = fingerAt(100, 1);
      fire('touchmove', [thumbDrifted, index], [thumbDrifted]);
      // and the second finger lifts first, as it usually does
      fire('touchend', [thumbDrifted], [index]);
    });

    await expect(counter).toHaveText('1 / 7');
  });

  test('ignores gestures starting on either screen edge', async ({ page }) => {
    const counter = page.getByText(/^\d+ \/ \d+$/);
    const overlay = page.getByRole('dialog');
    await expect(counter).toHaveText('1 / 7');

    // both edges belong to the OS (iOS back/forward, Android gesture nav), so
    // a swipe starting there must not also drive the lightbox
    await swipeOn(overlay, 8, 200);
    await expect(counter).toHaveText('1 / 7');

    await swipeOn(overlay, 384, 184);
    await expect(counter).toHaveText('1 / 7');

    // and a gesture starting inboard of them still works
    await swipeOn(overlay, 320, 120);
    await expect(counter).toHaveText('2 / 7');
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
