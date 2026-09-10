import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'components-fab--extended-long-label';
const LABEL = /add a regression scenario/i;

test.describe('Fab — extended variant with a long label', () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('button', { name: LABEL }).waitFor({ state: 'visible' });
  });

  test('stays within the viewport instead of growing off the left edge', async ({
    page,
  }) => {
    const box = await page
      .getByRole('button', { name: LABEL })
      .evaluate((fab) => {
        const label = fab.querySelector('[class*="_label_"]');
        if (label === null) throw new Error('label element not found');
        // the label must actually be too long, or this proves nothing
        if (label.scrollWidth <= label.clientWidth) {
          throw new Error('label is not truncated; story is not exercising this');
        }
        const rect = fab.getBoundingClientRect();
        return { left: rect.left, right: rect.right, vw: window.innerWidth };
      });

    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(box.vw);
  });
});
