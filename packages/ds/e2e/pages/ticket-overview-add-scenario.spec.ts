import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket--default';

async function loadStory(page: import('@playwright/test').Page) {
  await page.goto(storyUrl(STORY_ID));
  await page
    .getByRole('button', { name: 'Add scenario' })
    .waitFor({ state: 'visible' });
}

async function openDialog(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Add scenario' }).click();
  const dialog = page.getByRole('dialog', { name: 'Add test scenario' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe('Ticket Overview page — add test scenario', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('no dialog is mounted until the header button is used', async ({
    page,
  }) => {
    await expect(
      page.getByRole('dialog', { name: 'Add test scenario' }),
    ).toHaveCount(0);
    await openDialog(page);
  });

  test('opening the dialog moves focus to the scenario name field', async ({
    page,
  }) => {
    await openDialog(page);
    await expect(page.getByLabel('Scenario name')).toBeFocused();
  });

  test('submit stays disabled until every required field is filled', async ({
    page,
  }) => {
    const dialog = await openDialog(page);
    const submit = dialog.getByRole('button', { name: 'Add scenario' });

    await expect(submit).toBeDisabled();
    await page.getByLabel('Scenario name').fill('Purge honours cache tags');
    await expect(submit).toBeDisabled();
    await page
      .getByLabel('Description')
      .fill('Tag purge clears matching keys.');
    await expect(submit).toBeDisabled();
    await page.getByLabel('Expected result').fill('Tagged keys evict at once.');
    await expect(submit).toBeEnabled();
  });

  test('choosing Failed additionally requires an actual result', async ({
    page,
  }) => {
    const dialog = await openDialog(page);
    const submit = dialog.getByRole('button', { name: 'Add scenario' });

    await page.getByLabel('Scenario name').fill('Purge honours cache tags');
    await page
      .getByLabel('Description')
      .fill('Tag purge clears matching keys.');
    await page.getByLabel('Expected result').fill('Tagged keys evict at once.');
    await expect(submit).toBeEnabled();

    // the radio input is visually hidden, so the label is the real click target
    await dialog.getByText('Failed', { exact: true }).click();
    await expect(page.getByRole('radio', { name: 'Failed' })).toBeChecked();
    await expect(
      page.getByText('Actual result is required for failed scenarios.'),
    ).toBeVisible();
    await expect(submit).toBeDisabled();

    await page
      .getByLabel('Actual result')
      .fill('Stale keys survived the purge.');
    await expect(submit).toBeEnabled();
  });

  test('submitting appends the scenario to the checklist and unmounts the dialog', async ({
    page,
  }) => {
    const dialog = await openDialog(page);
    await page.getByLabel('Scenario name').fill('Purge honours cache tags');
    await page
      .getByLabel('Description')
      .fill('Tag purge clears matching keys.');
    await page.getByLabel('Expected result').fill('Tagged keys evict at once.');
    await dialog.getByRole('button', { name: 'Add scenario' }).click();

    await expect(
      page.getByRole('dialog', { name: 'Add test scenario' }),
    ).toHaveCount(0);
    await expect(page.getByText('Purge honours cache tags')).toBeVisible();
  });

  test('adding a failed scenario increments the Failed badge count', async ({
    page,
  }) => {
    await expect(page.getByText('1 Failed')).toBeVisible();

    const dialog = await openDialog(page);
    await page.getByLabel('Scenario name').fill('Purge honours cache tags');
    await page
      .getByLabel('Description')
      .fill('Tag purge clears matching keys.');
    await page.getByLabel('Expected result').fill('Tagged keys evict at once.');
    await dialog.getByText('Failed', { exact: true }).click();
    await page
      .getByLabel('Actual result')
      .fill('Stale keys survived the purge.');
    await dialog.getByRole('button', { name: 'Add scenario' }).click();

    await expect(page.getByText('2 Failed')).toBeVisible();
  });

  test('cancelling discards the draft', async ({ page }) => {
    await openDialog(page);
    await page.getByLabel('Scenario name').fill('Discarded scenario');
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(
      page.getByRole('dialog', { name: 'Add test scenario' }),
    ).toHaveCount(0);
    await expect(page.getByText('Discarded scenario')).toHaveCount(0);

    await openDialog(page);
    await expect(page.getByLabel('Scenario name')).toHaveValue('');
  });
});
