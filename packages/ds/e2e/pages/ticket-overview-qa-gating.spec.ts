import { test, expect, type Page } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket--qa';

const statusPills = (page: Page) =>
  page.getByRole('button', { name: 'Set scenario status' });

const statusPillsBehindModal = (page: Page) =>
  page.getByRole('button', {
    name: 'Set scenario status',
    includeHidden: true,
  });

async function expandScenario(page: Page, index: number) {
  await page
    .getByRole('button', { name: /expand scenario/i })
    .nth(index)
    .click();
}

test.describe('Ticket QA — status gating', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await statusPills(page).first().waitFor({ state: 'visible' });
  });

  test('waiving asks for a reason before it applies', async ({ page }) => {
    await expandScenario(page, 0);
    await expect(statusPills(page).first()).toHaveText('Passed');

    await page.getByRole('button', { name: 'Waive' }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(statusPillsBehindModal(page).first()).toHaveText('Passed');
    await expect(
      page.getByRole('button', { name: 'Waive scenario' }),
    ).toBeDisabled();

    await page.getByRole('textbox').last().fill('Out of scope — ENG-2871.');
    await page.getByRole('button', { name: 'Waive scenario' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(statusPills(page).first()).toHaveText('Waived');
    await expect(page.getByText('Out of scope — ENG-2871.')).toBeVisible();
  });

  test('cancelling leaves the scenario as it was', async ({ page }) => {
    await expandScenario(page, 0);

    await page.getByRole('button', { name: 'Waive' }).click();
    await page.getByRole('textbox').last().fill('half a thought');
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(statusPills(page).first()).toHaveText('Passed');
    await expect(page.getByText('half a thought')).toHaveCount(0);
  });

  test('re-opening a passed scenario asks for a fresh actual result', async ({
    page,
  }) => {
    await expandScenario(page, 0);

    await statusPills(page).first().click();
    await page.getByRole('option', { name: /Pending/ }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(statusPillsBehindModal(page).first()).toHaveText('Passed');

    await page.getByRole('textbox').last().fill('Zero 5xx during failover.');
    await page.getByRole('button', { name: 'Re-open as pending' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(statusPills(page).first()).toHaveText('Pending');
    await expect(page.getByText('Zero 5xx during failover.')).toBeVisible();
  });

  test('confirming a waive leaves focus on a real control', async ({
    page,
  }) => {
    await expandScenario(page, 0);

    await page.getByRole('button', { name: 'Waive' }).click();
    await page.getByRole('textbox').last().fill('Out of scope — ENG-2871.');
    await page.getByRole('button', { name: 'Waive scenario' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await expect(statusPills(page).first()).toHaveText('Waived');
    await expect(statusPills(page).first()).toBeFocused();
  });

  test('cancelling a waive returns focus to the button that opened it', async ({
    page,
  }) => {
    await expandScenario(page, 0);

    await page.getByRole('button', { name: 'Waive' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await expect(page.getByRole('button', { name: 'Waive' })).toBeFocused();
  });

  test('re-opening a failed scenario needs no dialog', async ({ page }) => {
    await expect(statusPills(page).nth(1)).toHaveText('Failed');

    await expandScenario(page, 1);
    await statusPills(page).nth(1).click();
    await page.getByRole('option', { name: /Pending/ }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(statusPills(page).nth(1)).toHaveText('Pending');
  });
});
