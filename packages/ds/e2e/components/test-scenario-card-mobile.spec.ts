import { test, expect, type Page } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';
import { backwardStops, focusOrderWithin } from '../helpers/focusOrder';
import { editToggles, evidenceRowCounts } from '../helpers/scenarioCard';

const STORY_ID = 'components-testscenariocard--mobile';

const TITLE_PENCIL_MIN_PX = 36;
const SECTION_PENCIL_MIN_PX = 44;

const TITLE_PENCIL_LABEL = 'Edit';
const SECTION_PENCIL_LABELS: readonly string[] = [
  'Edit Description',
  'Edit Steps to Reproduce',
  'Edit Expected Result',
  'Edit Actual Result',
];

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

    const stops = await focusOrderWithin(page.locator('body'));
    expect(backwardStops(stops)).toEqual([]);
  });

  test('sets status through the sheet, not an inline action row', async ({
    page,
  }) => {
    await expectStackedLayout(page);

    // the wide layout's Mark as Passed / Failed / Waive row is not rendered
    await expect(page.getByRole('group', { name: 'Set status' })).toHaveCount(
      0,
    );

    await statusTrigger(page).tap();

    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('option', { name: /Passed/ })).toBeVisible();
    // the sheet explains each status, which the wide dropdown has no room for
    await expect(sheet.getByText('Scenario verified as working')).toBeVisible();

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

    const pencils = editToggles(page);
    await expect(pencils).toHaveCount(SECTION_PENCIL_LABELS.length + 1);

    const boxes = await pencils.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          label: el.getAttribute('aria-label') ?? '',
          text: (el.textContent ?? '').trim(),
          w: Math.round(r.width),
          h: Math.round(r.height),
          opacity: getComputedStyle(el).opacity,
        };
      }),
    );

    expect(boxes.filter((b) => b.text !== '')).toEqual([]);

    for (const box of boxes) {
      const min = SECTION_PENCIL_LABELS.includes(box.label)
        ? SECTION_PENCIL_MIN_PX
        : TITLE_PENCIL_MIN_PX;
      expect(box.w).toBeGreaterThanOrEqual(min);
      expect(box.h).toBeGreaterThanOrEqual(min);
      // no hover on touch, so they must be visible at rest
      expect(box.opacity).toBe('1');
    }

    expect(boxes.map((b) => b.label).sort()).toEqual(
      [TITLE_PENCIL_LABEL, ...SECTION_PENCIL_LABELS].sort(),
    );
    expect(
      boxes
        .filter((b) => b.w >= SECTION_PENCIL_MIN_PX)
        .map((b) => b.label)
        .sort(),
    ).toEqual([...SECTION_PENCIL_LABELS].sort());
  });

  test('lays evidence two-up with thumb-sized controls', async ({ page }) => {
    await expectStackedLayout(page);

    await page.getByRole('button', { name: /more/i }).tap();
    expect(await evidenceRowCounts(page)).toEqual([2, 2, 2, 1]);

    const remove = page.getByRole('button', { name: /^Remove / }).first();
    const box = await remove.boundingBox();
    if (box === null) throw new Error('no evidence remove control');
    expect(box.width).toBeGreaterThanOrEqual(44);
  });

  test('drops the avatar, keeping the assignee in the byline', async ({
    page,
  }) => {
    await expectStackedLayout(page);

    await expect(page.getByRole('img', { name: 'Jordan D.' })).toHaveCount(0);
    await expect(page.getByText(/Failed by Jordan D\./)).toBeVisible();
  });
});
