import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket-overview--default';

async function loadStory(page: import('@playwright/test').Page) {
  await page.goto(storyUrl(STORY_ID));
  await page
    .getByRole('heading', {
      name: /implement dynamic edge-caching/i,
    })
    .waitFor({ state: 'visible' });
}

test.describe('Ticket Overview page — tab navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('Overview tab is selected by default and shows Description', async ({
    page,
  }) => {
    const overviewTab = page.getByRole('tab', { name: 'Overview' });
    await expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    await expect(
      page.getByRole('heading', { name: 'Description' }),
    ).toBeVisible();
  });

  test('clicking another tab switches selection and renders placeholder', async ({
    page,
  }) => {
    const devTab = page.getByRole('tab', { name: 'Dev' });
    await devTab.click();
    await expect(devTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    await expect(page.getByRole('tabpanel', { name: 'Dev' })).toContainText(
      'Nothing here yet.',
    );
    await expect(
      page.getByRole('heading', { name: 'Description' }),
    ).not.toBeVisible();
  });

  test('arrow keys move between tabs', async ({ page }) => {
    const overviewTab = page.getByRole('tab', { name: 'Overview' });
    await overviewTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Dev' })).toBeFocused();
    await expect(page.getByRole('tab', { name: 'Dev' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});

test.describe('Ticket Overview page — overview content', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('renders Description, Why and Scope sections', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Description' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Why' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scope' })).toBeVisible();
  });

  test('Why list shows the three reasons', async ({ page }) => {
    await expect(
      page.getByText(/Current TTFB for \/v1\/assets exceeds 400ms/),
    ).toBeVisible();
    await expect(
      page.getByText(/Database CPU peaks at 85% during morning sync windows/),
    ).toBeVisible();
    await expect(
      page.getByText(/Projected cost savings of \$2\.4k\/mo/),
    ).toBeVisible();
  });

  test('Scope shows Included and Excluded cards with items', async ({
    page,
  }) => {
    await expect(page.getByText('Included')).toBeVisible();
    await expect(page.getByText('Excluded')).toBeVisible();
    await expect(page.getByText('GET /v1/assets/*')).toBeVisible();
    await expect(page.getByText('WebSocket streams')).toBeVisible();
  });

  test('QA Summary shows scenarios checklist with 1 Failed', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'QA Summary' }),
    ).toBeVisible();
    await expect(page.getByText('Scenarios Checklist')).toBeVisible();
    await expect(page.getByText('1 Failed')).toBeVisible();
    await expect(
      page.getByText('Cache hit ratio check on US-East-1 staging'),
    ).toBeVisible();
    await expect(
      page.getByText('Invalidation latency under 200ms'),
    ).toBeVisible();
  });
});

test.describe('Ticket Overview page — metadata editing', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('clicking Status opens a dropdown to change it', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Select status' });
    await trigger.click();
    const listbox = page.getByRole('listbox', { name: 'Select status' });
    await expect(listbox).toBeVisible();
    await listbox.getByRole('option', { name: 'Done' }).click();
    await expect(listbox).not.toBeVisible();
    await expect(trigger).toContainText('Done');
  });

  test('clicking Priority opens a dropdown to change it', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Select priority' });
    await trigger.click();
    const listbox = page.getByRole('listbox', { name: 'Select priority' });
    await expect(listbox).toBeVisible();
    await listbox.getByRole('option', { name: 'Critical' }).click();
    await expect(listbox).not.toBeVisible();
    await expect(trigger).toContainText('Critical');
  });
});

test.describe('Ticket Overview page — pipeline hierarchy', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('pipeline panel is hidden by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^qa2/i })).not.toBeVisible();
  });

  test('clicking the chevron opens the pipeline panel', async ({ page }) => {
    const chevron = page.getByRole('button', {
      name: 'Open pipeline hierarchy',
    });
    await chevron.click();
    await expect(
      page.getByRole('button', { name: 'Close pipeline hierarchy' }),
    ).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('button', { name: /^qa2/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /add environment/i }),
    ).toBeVisible();
  });

  test('clicking the chevron again closes the panel', async ({ page }) => {
    await page.getByRole('button', { name: 'Open pipeline hierarchy' }).click();
    await expect(page.getByRole('button', { name: /^qa2/i })).toBeVisible();
    await page
      .getByRole('button', { name: 'Close pipeline hierarchy' })
      .click();
    await expect(page.getByRole('button', { name: /^qa2/i })).not.toBeVisible();
  });

  test('selecting another stage updates the active state', async ({ page }) => {
    await page.getByRole('button', { name: 'Open pipeline hierarchy' }).click();
    const staging = page.getByRole('button', { name: /^staging/i });
    await staging.click();
    await expect(staging).toHaveAttribute('aria-current', 'true');
    await expect(
      page.getByRole('button', { name: /^qa2/i }),
    ).not.toHaveAttribute('aria-current', 'true');
  });
});

test.describe('Ticket Overview page — header actions', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('renders Ask, Comment, and Add scenario buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Ask' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Comment' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Add scenario' }),
    ).toBeVisible();
  });

  test('renders share / star / more icon buttons with accessible labels', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: 'Share ticket' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Star ticket' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'More actions' }),
    ).toBeVisible();
  });
});

test.describe('Ticket Overview page — freeform markdown body', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('starts in template mode with no editor toolbar', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Description' }),
    ).toBeVisible();
    await expect(
      page.getByRole('toolbar', { name: 'Formatting' }),
    ).not.toBeVisible();
  });

  test('switching to freeform reveals the editor seeded with the markdown and moves focus there', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Freeform' }).click();
    await expect(
      page.getByRole('toolbar', { name: 'Formatting' }),
    ).toBeVisible();
    const textarea = page.getByRole('textbox', { name: 'Markdown' });
    await expect(textarea).toBeVisible();
    await expect(textarea).toBeFocused();
    await expect(textarea).toHaveValue(/## Description/);
    // QA Summary stays inside the same card in freeform mode
    await expect(
      page.getByRole('heading', { name: 'QA Summary' }),
    ).toBeVisible();
  });

  test('switching back to template preserves content and restores focus', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Freeform' }).click();
    await page.getByRole('button', { name: 'Template' }).click();
    await expect(
      page.getByRole('heading', { name: 'Description' }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Freeform' })).toBeFocused();
  });

  test('Create scenario navigates to the QA tab', async ({ page }) => {
    await page.getByRole('button', { name: /create scenario/i }).click();
    await expect(page.getByRole('tab', { name: 'QA' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
