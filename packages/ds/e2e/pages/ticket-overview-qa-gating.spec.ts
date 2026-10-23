import { test, expect, type Locator, type Page } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket--qa';

const scenarioCards = (page: Page) => page.locator('[data-status]');

async function expandFirstScenario(page: Page): Promise<Locator> {
  const card = scenarioCards(page).first();
  await card.getByRole('button', { name: /expand scenario/i }).click();
  return card;
}

test.describe('Ticket QA — status gating', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await scenarioCards(page).first().waitFor({ state: 'visible' });
  });

  test('waiving asks for a reason before it applies', async ({ page }) => {
    const card = await expandFirstScenario(page);
    await expect(card).toHaveAttribute('data-status', 'passed');

    await page.getByRole('button', { name: 'Waive' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(card).toHaveAttribute('data-status', 'passed');
    await expect(
      page.getByRole('button', { name: 'Waive scenario' }),
    ).toBeDisabled();

    await page.getByRole('textbox').last().fill('Out of scope — ENG-2871.');
    await page.getByRole('button', { name: 'Waive scenario' }).click();

    await expect(card).toHaveAttribute('data-status', 'waived');
    await expect(card).toContainText('ENG-2871');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('cancelling leaves the scenario as it was', async ({ page }) => {
    const card = await expandFirstScenario(page);

    await page.getByRole('button', { name: 'Waive' }).click();
    await page.getByRole('textbox').last().fill('half a thought');
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(card).toHaveAttribute('data-status', 'passed');
    await expect(card).not.toContainText('half a thought');
  });

  test('re-opening a passed scenario asks for a fresh actual result', async ({
    page,
  }) => {
    const card = await expandFirstScenario(page);

    await page
      .getByRole('button', { name: 'Set scenario status' })
      .first()
      .click();
    await page.getByRole('option', { name: /Pending/ }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(card).toHaveAttribute('data-status', 'passed');

    await page.getByRole('textbox').last().fill('Zero 5xx during failover.');
    await page.getByRole('button', { name: 'Re-open as pending' }).click();

    await expect(card).toHaveAttribute('data-status', 'pending');
    await expect(card).toContainText('Zero 5xx during failover');
  });

  test('confirming a waive leaves focus on a real control', async ({
    page,
  }) => {
    const card = await expandFirstScenario(page);

    await page.getByRole('button', { name: 'Waive' }).click();
    await page.getByRole('textbox').last().fill('Out of scope — ENG-2871.');
    await page.getByRole('button', { name: 'Waive scenario' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await expect(card).toHaveAttribute('data-status', 'waived');
    await expect(
      card.getByRole('button', { name: 'Set scenario status' }),
    ).toBeFocused();
  });

  test('cancelling a waive returns focus to the button that opened it', async ({
    page,
  }) => {
    const card = await expandFirstScenario(page);

    await page.getByRole('button', { name: 'Waive' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await expect(card.getByRole('button', { name: 'Waive' })).toBeFocused();
  });

  test('re-opening a failed scenario needs no dialog', async ({ page }) => {
    const card = scenarioCards(page).nth(1);
    await expect(card).toHaveAttribute('data-status', 'failed');

    await card.getByRole('button', { name: /expand scenario/i }).click();
    await page
      .getByRole('button', { name: 'Set scenario status' })
      .nth(1)
      .click();
    await page.getByRole('option', { name: /Pending/ }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(card).toHaveAttribute('data-status', 'pending');
  });
});
