import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket--default';

async function loadQaTab(page: import('@playwright/test').Page) {
  await page.goto(storyUrl(STORY_ID));
  await page.getByRole('tab', { name: 'QA' }).click();
  await page
    .getByRole('button', { name: /promote to qa-02/i })
    .waitFor({ state: 'visible' });
}

test.describe('QA tab', () => {
  test.beforeEach(async ({ page }) => {
    await loadQaTab(page);
  });

  test('switching environment updates deployment, pipeline, and promote target', async ({
    page,
  }) => {
    const qa = page.getByRole('tabpanel', { name: 'QA' });

    await expect(qa.getByText('ENVIRONMENT: QA-01')).toBeVisible();
    await expect(qa.getByText('Last deployment: 24 mins ago')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /promote to qa-02/i }),
    ).toBeVisible();

    // the trigger's accessible name carries the current value, not a static label
    await page
      .getByRole('button', { name: 'Environment: QA-01', exact: true })
      .click();
    await expect(page.getByText('Manage environments')).toBeVisible();
    await page.getByRole('option', { name: /STAGING/ }).click();
    await expect(qa.getByText('ENVIRONMENT: STAGING')).toBeVisible();
    await expect(qa.getByText('Last deployment: 3h ago')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /promote to production/i }),
    ).toBeVisible();

    await page
      .getByRole('button', { name: 'Environment: STAGING', exact: true })
      .click();
    await page.getByRole('option', { name: /PRODUCTION/ }).click();
    await expect(qa.getByText('ENVIRONMENT: PRODUCTION')).toBeVisible();
    await expect(qa.getByText('Last deployment: 2d ago')).toBeVisible();
    await expect(page.getByRole('button', { name: /promote to/i })).toHaveCount(
      0,
    );
  });

  test('expands a scenario and unmounts its body when collapsed', async ({
    page,
  }) => {
    const bodyText = /Requests exceeding the burst threshold/;
    await expect(page.getByText(bodyText)).toHaveCount(0);
    await page
      .getByRole('button', { name: 'Expand scenario Rate Limit Edge Case' })
      .click();
    await expect(page.getByText(bodyText)).toBeVisible();
    await page
      .getByRole('button', { name: 'Collapse scenario Rate Limit Edge Case' })
      .click();
    await expect(page.getByText(bodyText)).toHaveCount(0);
  });

  test('marking a scenario passed updates its pill and the passing count', async ({
    page,
  }) => {
    const statusPills = page.getByRole('button', {
      name: 'Set scenario status',
    });
    await expect(statusPills.filter({ hasText: /passed/i })).toHaveCount(2);
    await expect(page.getByText(/2 of 5 Passing/)).toBeVisible();

    await statusPills.filter({ hasText: /pending/i }).click();
    await page.getByRole('option', { name: 'Passed' }).click();

    await expect(statusPills.filter({ hasText: /passed/i })).toHaveCount(3);
    await expect(statusPills.filter({ hasText: /pending/i })).toHaveCount(0);
    await expect(page.getByText(/3 of 5 Passing/)).toBeVisible();
  });

  test('an open status dropdown paints above the rows beneath it', async ({
    page,
  }) => {
    const statusPills = page.getByRole('button', {
      name: 'Set scenario status',
    });
    await statusPills.first().click();
    await expect(page.getByRole('listbox')).toBeVisible();

    // no web-first equivalent: occlusion is a paint-order question, so probe
    // what is actually topmost where the dropdown overlaps the cards below.
    const covering = await page.evaluate(() => {
      const listbox = document.querySelector('[role="listbox"]');
      if (!listbox) return ['no listbox'];
      const panel = listbox.parentElement as HTMLElement;
      const pr = panel.getBoundingClientRect();
      return [
        ...document.querySelectorAll('[aria-label="Set scenario status"]'),
      ]
        .slice(1)
        .flatMap((pill) => {
          const r = pill.getBoundingClientRect();
          const x = r.left + r.width / 2;
          const y = r.top + r.height / 2;
          if (y <= pr.top || y >= pr.bottom || x <= pr.left || x >= pr.right) {
            return [];
          }
          const top = document.elementFromPoint(x, y);
          return panel.contains(top) ? [] : [(pill.textContent ?? '').trim()];
        });
    });

    expect(covering).toEqual([]);
  });

  test('inline-edits a scenario title and it persists', async ({ page }) => {
    const qaPanel = page.getByRole('tabpanel', { name: 'QA' });
    await qaPanel.getByRole('button', { name: 'Edit' }).first().click();
    const titleBox = qaPanel.getByRole('textbox', { name: 'Scenario title' });
    await titleBox.fill('Renamed scenario');
    await titleBox.press('Enter');
    await expect(qaPanel.getByText('Renamed scenario')).toBeVisible();
  });
});
