import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket-overview--mobile';

async function loadStory(page: import('@playwright/test').Page) {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(storyUrl(STORY_ID));
  await page
    .getByRole('heading', { name: /Implement dynamic edge-caching/i })
    .waitFor({ state: 'visible' });
}

test.describe('Ticket Overview (mobile) — freeform markdown body', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('starts in template mode with no editor toolbar, QA summary inside the card', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'Description' }),
    ).toBeVisible();
    await expect(
      page.getByRole('toolbar', { name: 'Formatting' }),
    ).not.toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'QA Summary' }),
    ).toBeVisible();
  });

  test('switching to freeform reveals the editor and keeps QA inside the card', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Freeform' }).click();
    await expect(
      page.getByRole('toolbar', { name: 'Formatting' }),
    ).toBeVisible();
    const textarea = page.getByRole('textbox', { name: 'Markdown' });
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue(/## Description/);
    await expect(
      page.getByRole('heading', { name: 'QA Summary' }),
    ).toBeVisible();
  });

  test('switching back to template preserves the rendered body', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Freeform' }).click();
    await page.getByRole('button', { name: 'Template' }).click();
    await expect(
      page.getByRole('heading', { name: 'Description' }),
    ).toBeVisible();
  });
});
