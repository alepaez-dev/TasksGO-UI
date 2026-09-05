import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const SHEET_STORY_ID = 'components-addscenariodialog--sheet';
const DIALOG_STORY_ID = 'components-addscenariodialog--default';

test.describe('DialogShell sheet presentation — scrolling form', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(SHEET_STORY_ID));
    await page.getByRole('dialog').waitFor({ state: 'visible' });
  });

  test('the footer covers the full bottom edge so content cannot scroll through beneath it', async ({
    page,
  }) => {
    const gap = await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Add scenario' })
      .evaluate((confirmButton) => {
        // DialogShell renders the footer as the confirm button's direct parent,
        // inside BottomSheet's scrolling .content
        const footer = confirmButton.parentElement;
        if (footer === null) {
          throw new Error('expected the confirm button to sit in a footer');
        }
        const scroller = footer.parentElement;
        if (scroller === null) {
          throw new Error('expected the footer to sit in a scroll container');
        }
        // the form must actually overflow, or this proves nothing
        if (scroller.scrollHeight <= scroller.clientHeight) {
          throw new Error('form does not scroll; story is not exercising this');
        }
        return (
          scroller.getBoundingClientRect().bottom -
          footer.getBoundingClientRect().bottom
        );
      });

    // signed: a positive gap leaks content beneath, a negative one drops the
    // footer below the fold. 1px absorbs sub-pixel rounding.
    expect(Math.abs(gap)).toBeLessThanOrEqual(1);
  });
});

test.describe('DialogShell dialog presentation — viewport shorter than the panel', () => {
  test.use({ viewport: { width: 500, height: 420 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(DIALOG_STORY_ID));
    await page.getByRole('dialog').waitFor({ state: 'visible' });
  });

  test('the panel stays within the viewport instead of being clipped', async ({
    page,
  }) => {
    const box = await page.getByRole('dialog').evaluate((panel) => {
      // the panel must actually overflow, or this proves nothing
      if (panel.scrollHeight <= panel.clientHeight) {
        throw new Error('panel does not scroll; story is not exercising this');
      }
      const rect = panel.getBoundingClientRect();
      return {
        top: rect.top,
        bottom: rect.bottom,
        viewportHeight: window.innerHeight,
      };
    });

    expect(box.top).toBeGreaterThanOrEqual(0);
    expect(box.bottom).toBeLessThanOrEqual(box.viewportHeight);
  });

  test('the confirm button can be scrolled into view', async ({ page }) => {
    const confirm = page
      .getByRole('dialog')
      .getByRole('button', { name: 'Add scenario' });

    await confirm.scrollIntoViewIfNeeded();

    const visible = await confirm.evaluate((button) => {
      const rect = button.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });

    expect(visible).toBe(true);
  });
});
