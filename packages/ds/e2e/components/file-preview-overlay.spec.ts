import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';
import { backwardStops, focusOrderWithin } from '../helpers/focusOrder';

const STORY_ID = 'components-filepreviewoverlay--default';

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
