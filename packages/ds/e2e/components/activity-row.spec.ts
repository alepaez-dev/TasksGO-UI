import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'components-activityrow--pull-request';
const LINK = /add dark-mode toggle/i;

test.describe('ActivityRow — title link focus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('link', { name: LINK }).waitFor({ state: 'visible' });
  });

  test('keyboard focus lands on the title link and its ring is not clipped', async ({
    page,
  }) => {
    const link = page.getByRole('link', { name: LINK });

    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();

    const ringClipped = await link.evaluate((el) => {
      const ring =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--ds-focus-ring-width',
          ),
        ) || 3;
      const box = el.getBoundingClientRect();
      for (
        let node = el.parentElement;
        node && node.tagName !== 'LI';
        node = node.parentElement
      ) {
        const cs = getComputedStyle(node);
        const clips = [cs.overflow, cs.overflowX, cs.overflowY].some(
          (v) => v === 'hidden' || v === 'clip',
        );
        if (!clips) continue;
        const a = node.getBoundingClientRect();
        if (
          box.left - ring < a.left - 0.5 ||
          box.top - ring < a.top - 0.5 ||
          box.right + ring > a.right + 0.5 ||
          box.bottom + ring > a.bottom + 0.5
        ) {
          return true;
        }
      }
      return false;
    });

    expect(ringClipped).toBe(false);
  });
});
