import { test, expect, type Page } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';
import { backwardStops, focusOrderWithin } from '../helpers/focusOrder';

const STORY_ID = 'components-testscenariocard--mobile';
const CARD = '[class*="_card_"]';

const statusTrigger = (page: Page) =>
  page.getByRole('button', { name: 'Set scenario status' });

/**
 * The stacked layout must actually be active or these tests prove nothing: the
 * wide layout opens a listbox from the status pill, stacked opens a sheet.
 */
async function expectStackedLayout(page: Page) {
  await expect(statusTrigger(page)).toHaveAttribute('aria-haspopup', 'dialog');
}

test.describe('TestScenarioCard — stacked layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await statusTrigger(page).waitFor({ state: 'visible' });
  });

  test('tab order follows the stacked visual order', async ({ page }) => {
    await expectStackedLayout(page);

    const stops = await focusOrderWithin(page, CARD);
    expect(backwardStops(stops)).toEqual([]);
  });

  test('sets status through the sheet, not an inline action row', async ({
    page,
  }) => {
    await expectStackedLayout(page);

    // the wide layout's Mark as Passed / Failed / Waive row is not rendered
    await expect(
      page.getByRole('group', { name: 'Set status' }),
    ).toHaveCount(0);

    await statusTrigger(page).tap();

    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('option', { name: /Passed/ })).toBeVisible();
    // the sheet explains each status, which the wide dropdown has no room for
    await expect(
      sheet.getByText('Scenario verified as working'),
    ).toBeVisible();

    await sheet.getByRole('option', { name: /Passed/ }).tap();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(statusTrigger(page)).toContainText('Passed');
  });

  test('closes the sheet without changing status', async ({ page }) => {
    await expectStackedLayout(page);
    await statusTrigger(page).tap();

    await page.getByRole('button', { name: 'Close status picker' }).tap();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(statusTrigger(page)).toContainText('Failed');
  });

  test('shows edit pencils without hover, at a thumb-sized target', async ({
    page,
  }) => {
    await expectStackedLayout(page);

    const pencils = page.locator('[class*="_iconOnly_"]');
    await expect(pencils).toHaveCount(5);

    const boxes = await pencils.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          w: Math.round(r.width),
          h: Math.round(r.height),
          opacity: getComputedStyle(el).opacity,
        };
      }),
    );

    for (const box of boxes) {
      expect(box.w).toBeGreaterThanOrEqual(44);
      expect(box.h).toBeGreaterThanOrEqual(44);
      // no hover on touch, so they must be visible at rest
      expect(box.opacity).toBe('1');
    }
  });

  test('lays evidence two-up with thumb-sized controls', async ({ page }) => {
    await expectStackedLayout(page);

    const columns = await page
      .locator('[class*="_evidence_"]')
      .first()
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(2);

    const remove = page.locator('[class*="_evidenceRemove_"]').first();
    const box = await remove.boundingBox();
    if (box === null) throw new Error('no evidence remove control');
    expect(box.width).toBeGreaterThanOrEqual(44);
  });

  test('drops the avatar, keeping the assignee in the byline', async ({
    page,
  }) => {
    await expectStackedLayout(page);

    await expect(page.locator('[class*="_assignee_"]')).toHaveCount(0);
    await expect(page.getByText(/Failed by Jordan D\./)).toBeVisible();
  });
});
