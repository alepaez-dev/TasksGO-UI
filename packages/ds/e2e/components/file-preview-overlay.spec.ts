import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';
import { backwardStops, focusOrderWithin } from '../helpers/focusOrder';

const STORY_ID = 'components-filepreviewoverlay--default';

test.describe('FilePreviewOverlay — reduced motion', () => {
  test('the dialog renders without a fade, fully opaque from the start', async ({
    page,
  }) => {
    // imperative emulation: test.use({ reducedMotion }) does not reach the
    // page in this project setup, and this mirrors what the a11y runner does
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(storyUrl(STORY_ID));
    const dialog = page.getByRole('dialog', {
      name: 'socket_log.png, file 1 of 6',
    });
    await dialog.waitFor({ state: 'visible' });

    // The a11y CI job audits the reduced-motion rendering. A re-enabled
    // entrance fade would let axe snapshot semi-transparent text over the
    // light page again (the mid-fade contrast race) — pin the contract.
    await expect(dialog).toHaveCSS('transition-duration', '0s');
    await expect(dialog).toHaveCSS('opacity', '1');
  });
});

test.describe('FilePreviewOverlay — wide layout', () => {
  test('tab order follows the top-bar visual order', async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('dialog').waitFor({ state: 'visible' });

    // the wide layout must actually be active: Download belongs in the top bar
    await expect
      .poll(
        async () => {
          const box = await page
            .getByRole('link', { name: /download/i })
            .boundingBox();
          return box?.y ?? Number.MAX_SAFE_INTEGER;
        },
        { message: 'Download should sit in the top bar in the wide layout' },
      )
      .toBeLessThan(200);

    const stops = await focusOrderWithin(page, '[role="dialog"]');
    expect(backwardStops(stops)).toEqual([]);
  });
});
