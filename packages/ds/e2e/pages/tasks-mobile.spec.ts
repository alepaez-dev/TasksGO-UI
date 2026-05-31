import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-tasks--mobile';

async function loadStory(page: import('@playwright/test').Page) {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(storyUrl(STORY_ID));
  await page
    .getByRole('banner')
    .getByText('Tasks')
    .waitFor({ state: 'visible' });
}

test.describe('Mobile tasks — Fab + drawer lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('Fab opens new-task drawer', async ({ page }) => {
    await page.getByRole('button', { name: 'New task' }).click();
    const dialog = page.getByRole('dialog', { name: 'New task' });
    await expect(dialog).toBeVisible();
  });

  test('Escape closes drawer', async ({ page }) => {
    await page.getByRole('button', { name: 'New task' }).click();
    const dialog = page.getByRole('dialog', { name: 'New task' });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});

test.describe('Mobile tasks — checkbox completion', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('checking a task moves it to completed section', async ({ page }) => {
    const taskTitle =
      'Refactor Kubernetes service discovery logic for edge nodes';
    const tasksSection = page.getByRole('group', { name: 'Tasks' });
    const completedSection = page.getByRole('group', { name: 'Completed' });

    const checkbox = page.getByRole('checkbox', {
      name: `Toggle ${taskTitle}`,
    });
    await expect(checkbox).not.toBeChecked();

    await checkbox.click();

    await expect(
      page.getByRole('checkbox', { name: `Toggle ${taskTitle}` }),
    ).toBeChecked();
    await expect(completedSection).toBeVisible();
    await expect(tasksSection).not.toContainText(taskTitle);
  });

  test('unchecking a completed task moves it back to active', async ({
    page,
  }) => {
    const taskTitle = 'Update root CA certificates for all build agents';
    const checkbox = page.getByRole('checkbox', {
      name: `Toggle ${taskTitle}`,
    });
    await expect(checkbox).toBeChecked();

    await checkbox.click();

    await expect(
      page.getByRole('checkbox', { name: `Toggle ${taskTitle}` }),
    ).not.toBeChecked();
    const tasksSection = page.getByRole('group', { name: 'Tasks' });
    await expect(tasksSection).toContainText(taskTitle);
  });
});

test.describe('Mobile tasks — click to edit', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('tapping a task opens edit drawer', async ({ page }) => {
    const taskTitle =
      'Refactor Kubernetes service discovery logic for edge nodes';
    const tasksSection = page.getByRole('group', { name: 'Tasks' });
    await tasksSection.getByText(taskTitle).click();

    const dialog = page.getByRole('dialog', { name: /edit task/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel('Task title')).toHaveValue(taskTitle);
  });
});

test.describe('Mobile tasks — search sheet', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('tapping search icon opens search sheet', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();
    const sheet = page.getByRole('dialog', { name: 'Search' });
    await expect(sheet).toBeVisible();
    await expect(page.getByPlaceholder('Jump to task')).toBeVisible();
  });

  test('opening search sheet auto-focuses the input', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByPlaceholder('Jump to task')).toBeFocused();
  });

  test('reopening the search sheet re-focuses the input', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByPlaceholder('Jump to task')).toBeFocused();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Search' }),
    ).not.toBeVisible();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByPlaceholder('Jump to task')).toBeFocused();
  });

  test('cancel closes search sheet', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('dialog', { name: 'Search' })).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Search' }),
    ).not.toBeVisible();
  });
});

test.describe('Mobile tasks — More menu', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('tapping More opens bottom sheet', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByText('More')
      .click();
    const sheet = page.getByRole('dialog', { name: 'More menu' });
    await expect(sheet).toBeVisible();
  });

  test('Escape closes More menu', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByText('More')
      .click();
    const sheet = page.getByRole('dialog', { name: 'More menu' });
    await expect(sheet).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(sheet).not.toBeVisible();
  });

  test('tapping project row switches to picker', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByText('More')
      .click();
    await expect(page.getByRole('dialog', { name: 'More menu' })).toBeVisible();

    await page.getByRole('button', { name: /Engineering Core/i }).click();
    await expect(
      page.getByRole('heading', { name: /switch project/i }),
    ).toBeVisible();
  });

  test('selecting a project updates the header', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByText('More')
      .click();
    await page.getByRole('button', { name: /Engineering Core/i }).click();
    await expect(
      page.getByRole('heading', { name: /switch project/i }),
    ).toBeVisible();

    await page.getByText('Mudatec').click();
    await page.keyboard.press('Escape');

    await expect(page.getByRole('banner').getByText('Tasks')).toBeVisible();
  });
});

test.describe('Mobile tasks — sort sheet', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('sort sheet opens, selects option, and closes', async ({ page }) => {
    const sortButton = page.getByRole('button', { name: /priority/i });
    await sortButton.click();

    const sheet = page.getByRole('dialog', { name: 'Sort by' });
    await expect(sheet).toBeVisible();

    await sheet.getByRole('button', { name: 'Due date' }).click();
    await expect(sheet).not.toBeVisible();
  });
});

test.describe('Mobile tasks — metadata picker sheets', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
    await page.getByRole('button', { name: 'New task' }).click();
    await expect(page.getByRole('dialog', { name: 'New task' })).toBeVisible();
  });

  test('assignee: open sheet, select a member, value updates and sheet closes', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Assignee: Alex H.' }).click();

    const sheet = page.getByRole('dialog', { name: 'Select assignee' });
    await expect(sheet).toBeVisible();

    await sheet.getByRole('option', { name: /Cleo H\./ }).click();

    await expect(sheet).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Assignee: Cleo H.' }),
    ).toBeVisible();
  });

  test('assignee: search filters the member list', async ({ page }) => {
    await page.getByRole('button', { name: 'Assignee: Alex H.' }).click();
    const sheet = page.getByRole('dialog', { name: 'Select assignee' });

    await sheet.getByRole('searchbox', { name: 'Search members' }).fill('cleo');

    await expect(sheet.getByRole('option', { name: /Cleo H\./ })).toBeVisible();
    await expect(sheet.getByRole('option', { name: /Vader P\./ })).toHaveCount(
      0,
    );
  });

  test('priority: open sheet, select an option, value updates and sheet closes', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Priority: High' }).click();

    const sheet = page.getByRole('dialog', { name: 'Select priority' });
    await expect(sheet).toBeVisible();

    await sheet.getByRole('option', { name: 'Critical' }).click();

    await expect(sheet).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Priority: Critical' }),
    ).toBeVisible();
  });

  test('priority: selecting returns focus to the trigger', async ({ page }) => {
    await page.getByRole('button', { name: 'Priority: High' }).click();
    const sheet = page.getByRole('dialog', { name: 'Select priority' });

    await sheet.getByRole('option', { name: 'Low' }).click();

    await expect(sheet).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Priority: Low' }),
    ).toBeFocused();
  });

  test('linked ticket: search and select updates the value', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Linked ticket: None' }).click();

    const sheet = page.getByRole('dialog', { name: 'Select linked ticket' });
    await expect(sheet).toBeVisible();

    await sheet
      .getByRole('searchbox', { name: 'Search tickets' })
      .fill('T-104');
    await sheet.getByRole('option', { name: /T-104/ }).click();

    await expect(sheet).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: /Linked ticket: T-104/ }),
    ).toBeVisible();
  });

  test('linked ticket: "Create new ticket" action closes the sheet', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Linked ticket: None' }).click();
    const sheet = page.getByRole('dialog', { name: 'Select linked ticket' });
    await expect(sheet).toBeVisible();

    await sheet.getByRole('button', { name: 'Create new ticket' }).click();

    await expect(sheet).not.toBeVisible();
  });

  test('Escape closes the picker sheet but keeps the drawer open', async ({
    page,
  }) => {
    const drawer = page.getByRole('dialog', { name: 'New task' });

    await page.getByRole('button', { name: 'Priority: High' }).click();
    const sheet = page.getByRole('dialog', { name: 'Select priority' });
    await expect(sheet).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(sheet).not.toBeVisible();
    await expect(drawer).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
  });
});

test.describe('Mobile tasks — empty state', () => {
  test('shows empty message when no tasks', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(storyUrl('pages-tasks--mobile-empty-state'));
    await page
      .getByRole('banner')
      .getByText('Tasks')
      .waitFor({ state: 'visible' });

    await expect(page.getByText('No tasks yet')).toBeVisible();
  });
});
