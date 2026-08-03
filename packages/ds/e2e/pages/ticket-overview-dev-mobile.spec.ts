import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket--mobile';

async function loadStory(page: import('@playwright/test').Page) {
  await page.goto(storyUrl(STORY_ID));
  await page
    .getByRole('heading', { name: 'Description' })
    .waitFor({ state: 'visible' });
}

async function openDevTab(page: import('@playwright/test').Page) {
  await page.getByRole('tab', { name: 'Dev' }).click();
}

async function openDetails(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /Details/ }).click();
}

test.describe('Ticket mobile — Dev tab scratchpad', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('the scratchpad is absent until the Dev tab is selected', async ({
    page,
  }) => {
    const scratchpad = page.getByLabel('Dev scratchpad');
    await expect(scratchpad).toHaveCount(0);

    await openDevTab(page);
    await expect(scratchpad).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Add a line…' }),
    ).toBeVisible();
  });

  test('the Add scenario bar gives way to the scratchpad on Dev', async ({
    page,
  }) => {
    const addScenario = page.getByRole('button', { name: 'Add scenario' });
    await expect(addScenario).toBeVisible();

    await openDevTab(page);
    await expect(addScenario).toHaveCount(0);

    await page.getByRole('tab', { name: 'Overview' }).click();
    await expect(addScenario).toBeVisible();
  });

  test('editing a line swaps the tab bar for the formatting toolbar', async ({
    page,
  }) => {
    await openDevTab(page);
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();

    await page
      .getByRole('button', { name: /^Edit / })
      .first()
      .click();

    const toolbar = page.getByRole('toolbar', { name: 'Formatting' });
    await expect(toolbar).toBeVisible();
    await expect(nav).toHaveCount(0);

    await page.getByRole('button', { name: 'Done' }).click();
    await expect(toolbar).toHaveCount(0);
    await expect(nav).toBeVisible();
  });
});

test.describe('Ticket mobile — Dev details sheet', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('the Dev section is scoped to the Dev tab', async ({ page }) => {
    await openDetails(page);
    await expect(page.getByRole('heading', { name: 'Metadata' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Dev', exact: true }),
    ).toHaveCount(0);
    await expect(page.getByText('Branch', { exact: true })).toHaveCount(0);

    await page.getByRole('button', { name: 'Close details' }).click();
    await openDevTab(page);
    await openDetails(page);

    await expect(
      page.getByRole('heading', { name: 'Dev', exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Branch', { exact: true })).toBeVisible();
    await expect(page.getByText('Repository', { exact: true })).toBeVisible();
  });

  test('the branch is a read-only link with a copy affordance', async ({
    page,
  }) => {
    await openDevTab(page);
    await openDetails(page);

    const branch = page.getByRole('link', {
      name: /feat\/dynamic-edge-caching/,
    });
    await expect(branch).toHaveAttribute('target', '_blank');
    await expect(page.getByRole('button', { name: 'Edit branch' })).toHaveCount(
      0,
    );

    const copy = page.getByRole('button', { name: 'Copy branch' });
    await expect(copy).toBeVisible();
    const box = await copy.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('pull requests drill in, filter, and return', async ({ page }) => {
    await openDevTab(page);
    await openDetails(page);
    await page.getByRole('button', { name: /Pull requests/ }).click();

    const list = page.getByRole('list', { name: 'Pull requests' });
    await expect(list.getByRole('link')).toHaveCount(3);

    await page.getByLabel('Find pull request').fill('884');
    await expect(list.getByRole('link')).toHaveCount(1);

    await page.getByLabel('Find pull request').fill('nothing-matches');
    await expect(list.getByRole('link')).toHaveCount(0);
    await expect(page.getByText(/No pull requests match/)).toBeVisible();

    await page.getByRole('button', { name: 'Back to details' }).click();
    await expect(
      page.getByRole('heading', { name: 'Dev', exact: true }),
    ).toBeVisible();
  });

  test('drilling in keeps focus in the sheet and restores it on back', async ({
    page,
  }) => {
    await openDevTab(page);
    await openDetails(page);

    const prRow = page.getByRole('button', { name: /Pull requests/ });
    await prRow.click();

    const back = page.getByRole('button', { name: 'Back to details' });
    await expect(back).toBeFocused();

    // Tab stays inside the sub-view: Shift+Tab off Back wraps to the last PR
    // link instead of escaping into the inert metadata panel behind it.
    await page.keyboard.press('Shift+Tab');
    await expect(
      page
        .getByRole('list', { name: 'Pull requests' })
        .getByRole('link')
        .last(),
    ).toBeFocused();

    await back.click();
    await expect(prRow).toBeFocused();
  });

  test('commits drill in and show the branch summary', async ({ page }) => {
    await openDevTab(page);
    await openDetails(page);
    await page.getByRole('button', { name: /Commits/ }).click();

    await expect(page.getByText('37 commits')).toBeVisible();
    await expect(
      page.getByRole('list', { name: 'Commits' }).getByRole('link'),
    ).toHaveCount(3);

    await page.getByRole('button', { name: 'Back to details' }).click();
    await expect(
      page.getByRole('heading', { name: 'Dev', exact: true }),
    ).toBeVisible();
  });
});
