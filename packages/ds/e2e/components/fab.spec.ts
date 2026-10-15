import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'components-fab--extended-long-label';
const LABEL = /add a regression scenario/i;

test.describe('Fab — extended variant with a long label', () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await page
      .getByRole('button', { name: LABEL })
      .waitFor({ state: 'visible' });
  });

  test('stays within the viewport instead of growing off the left edge', async ({
    page,
  }) => {
    const fab = page.getByRole('button', { name: LABEL });

    const truncated = await fab
      .getByText(LABEL)
      .evaluate((label) => label.scrollWidth > label.clientWidth);
    expect(
      truncated,
      'label is not truncated; story is not exercising this',
    ).toBe(true);

    const box = await fab.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return { left: rect.left, right: rect.right, vw: window.innerWidth };
    });

    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(box.vw);
  });
});
