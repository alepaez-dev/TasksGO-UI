import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket--default';

test.describe('Ticket — Dev Details card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).waitFor({ state: 'visible' });
  });

  test('collapsible card sits in every tab and auto-opens on the Dev tab', async ({
    page,
  }) => {
    const header = page.getByRole('button', { name: /dev details/i });
    const repository = page.getByRole('heading', { name: 'Repository' });

    // Header is present even on the Overview tab, collapsed (body hidden).
    await expect(header).toBeVisible();
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await expect(repository).not.toBeVisible();
    await expect(page.getByText('Branch', { exact: true })).not.toBeVisible();

    // Switching to Dev auto-opens the card.
    await page.getByRole('tab', { name: 'Dev' }).click();
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(repository).toBeVisible();
    await expect(page.getByText('Branch', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /add edge-caching layer/i }),
    ).toBeVisible();

    // The Scratchpad is the Dev tab's main content.
    await expect(
      page.getByRole('tabpanel', { name: 'Dev' }).getByLabel('Dev scratchpad'),
    ).toBeVisible();

    // The header toggles the card manually.
    await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await expect(repository).not.toBeVisible();
  });
});
