import { test, expect, type Page } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';
import { backwardStops, focusOrderWithin } from '../helpers/focusOrder';
import { editToggles, evidenceRowCounts } from '../helpers/scenarioCard';

const STORY_ID = 'components-testscenariocard--all-evidence-types';

const statusTrigger = (page: Page) =>
  page.getByRole('button', { name: 'Set scenario status' });

/**
 * The wide layout must actually be active or these tests prove nothing: it
 * opens a listbox from the status pill, where stacked opens a sheet.
 */
async function expectWideLayout(page: Page) {
  await expect(statusTrigger(page)).toHaveAttribute('aria-haspopup', 'listbox');
}

test.describe('TestScenarioCard — wide layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await statusTrigger(page).waitFor({ state: 'visible' });
  });

  test('tab order follows the visual order', async ({ page }) => {
    await expectWideLayout(page);

    const stops = await focusOrderWithin(page.locator('body'));
    expect(backwardStops(stops)).toEqual([]);
  });

  test('keeps the inline action row and the avatar', async ({ page }) => {
    await expectWideLayout(page);

    // the mobile work must not have removed the wide layout's own paths
    await expect(page.getByRole('group', { name: 'Set status' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Mark as Passed' }),
    ).toBeVisible();
    await expect(page.getByRole('img', { name: 'Jordan D.' })).toHaveCount(1);
  });

  test('labels its edit toggles with text, not a bare pencil', async ({
    page,
  }) => {
    await expectWideLayout(page);

    const labelled = await editToggles(page).evaluateAll((els) =>
      els.map((el) => (el.textContent ?? '').trim()),
    );
    expect(labelled).toHaveLength(5);
    expect(labelled.filter((text) => text === '')).toEqual([]);
    await expect(
      page.getByRole('button', { name: 'Edit Description' }),
    ).toContainText('Edit');
  });

  test('lays evidence three-up', async ({ page }) => {
    await expectWideLayout(page);

    await page.getByRole('button', { name: /more/i }).click();
    expect(await evidenceRowCounts(page)).toEqual([3, 3, 1]);
  });
});
