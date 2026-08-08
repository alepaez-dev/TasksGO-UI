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

test.describe('Ticket — Dev Details card closing window', () => {
  test.beforeEach(async ({ page }) => {
    // No transition means transitionend never fires, so the body stays mounted
    // for the hook's full fallback window — the widest version of the gap.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).waitFor({ state: 'visible' });
  });

  test('panel content leaves the tab order as soon as the card reports collapsed', async ({
    page,
  }) => {
    const header = page.getByRole('button', { name: /dev details/i });
    const repoLink = page.getByRole('link', { name: /edge-gateway-service/i });

    await page.getByRole('tab', { name: 'Dev' }).click();
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(repoLink).toBeVisible();

    await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'false');

    // Focus reachability has to be probed synchronously while the body is still
    // mounted mid-close; stillMounted proves we were inside that window.
    const probe = await page.evaluate(() => {
      const link = document.querySelector<HTMLElement>(
        'a[href$="/edge-gateway-service"]',
      );
      if (!link) return { stillMounted: false, focused: false };
      link.focus();
      return { stillMounted: true, focused: document.activeElement === link };
    });

    expect(probe.stillMounted).toBe(true);
    expect(probe.focused).toBe(false);
  });
});
