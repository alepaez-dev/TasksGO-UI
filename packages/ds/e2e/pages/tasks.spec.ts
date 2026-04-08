import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-tasks--default';

async function loadStory(page: import('@playwright/test').Page) {
  await page.goto(storyUrl(STORY_ID));
  await page.getByRole('button', { name: /new task/i }).waitFor({ state: 'visible' });
}

test.describe('Tasks page — drawer lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('opens drawer on "New task" click', async ({ page }) => {
    await page.getByRole('button', { name: /new task/i }).click();
    const dialog = page.getByRole('dialog', { name: 'New task' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'New task' })).toBeVisible();
  });

  test('cancel closes drawer and resets form state', async ({ page }) => {
    await page.getByRole('button', { name: /new task/i }).click();
    const dialog = page.getByRole('dialog', { name: 'New task' });
    await expect(dialog).toBeVisible();

    const titleInput = dialog.getByLabel('Task title');
    const descriptionInput = dialog.getByLabel('Description');
    await titleInput.fill('My test task');
    await descriptionInput.fill('Some description');
    await expect(titleInput).toHaveValue('My test task');

    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).not.toBeVisible();

    await page.getByRole('button', { name: /new task/i }).click();
    const reopenedDialog = page.getByRole('dialog', { name: 'New task' });
    await expect(reopenedDialog).toBeVisible();
    await expect(reopenedDialog.getByLabel('Task title')).toHaveValue('');
    await expect(reopenedDialog.getByLabel('Description')).toHaveValue('');
  });

  test('escape key closes drawer', async ({ page }) => {
    await page.getByRole('button', { name: /new task/i }).click();
    const dialog = page.getByRole('dialog', { name: 'New task' });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});

test.describe('Tasks page — checkbox completion', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('checking a task moves it to completed section', async ({ page }) => {
    const taskTitle = 'Refactor Kubernetes service discovery logic for edge nodes';
    const checkbox = page.getByRole('checkbox', { name: `Toggle ${taskTitle}` });

    const activeSummary = page.getByText('Active Tasks').first();
    const completedSummary = page.getByText('Completed Tasks').first();

    await expect(activeSummary).toBeVisible();
    await expect(checkbox).not.toBeChecked();

    await checkbox.click();

    await expect(page.getByRole('checkbox', { name: `Toggle ${taskTitle}` })).toBeChecked();
    await expect(completedSummary).toBeVisible();
  });

  test('unchecking a completed task moves it back to active', async ({ page }) => {
    const taskTitle = 'Update root CA certificates for all build agents';
    const checkbox = page.getByRole('checkbox', { name: `Toggle ${taskTitle}` });

    await expect(checkbox).toBeChecked();
    await checkbox.click();
    await expect(
      page.getByRole('checkbox', { name: `Toggle ${taskTitle}` }),
    ).not.toBeChecked();
  });
});

test.describe('Tasks page — click to edit', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('clicking a task opens drawer with pre-filled data', async ({ page }) => {
    const taskTitle = 'Refactor Kubernetes service discovery logic for edge nodes';
    const taskRow = page.getByText(taskTitle);
    await taskRow.click();

    const dialog = page.getByRole('dialog', { name: /edit task · eng-902/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel('Task title')).toHaveValue(taskTitle);
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeVisible();
  });

  test('clicking checkbox does not open edit drawer', async ({ page }) => {
    const taskTitle = 'Refactor Kubernetes service discovery logic for edge nodes';
    const checkbox = page.getByRole('checkbox', { name: `Toggle ${taskTitle}` });
    await checkbox.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).not.toBeVisible();
  });
});

test.describe('Tasks page — selector mutual exclusion', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
    await page.getByRole('button', { name: /new task/i }).click();
    await expect(page.getByRole('dialog', { name: 'New task' })).toBeVisible();
  });

  test('opening one selector closes another', async ({ page }) => {
    const assigneeButton = page.getByRole('button', { name: 'Select assignee' });
    const priorityButton = page.getByRole('button', { name: 'Select priority' });

    // Open priority first (compact dropdown, won't overlay assignee above)
    await priorityButton.click();
    const priorityListbox = page.getByRole('listbox', { name: 'Select priority' });
    await expect(priorityListbox).toBeVisible();

    // Opening assignee should auto-close priority via useSelectorGroup
    await assigneeButton.click();
    const assigneeListbox = page.getByRole('listbox', { name: 'Select assignee' });
    await expect(assigneeListbox).toBeVisible();
    await expect(priorityListbox).not.toBeVisible();
  });
});

test.describe('Tasks page — order by', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('sort selector does not collapse the section', async ({ page }) => {
    const sortButton = page.getByRole('button', { name: 'Sort tasks by' });
    await sortButton.click();
    await expect(page.getByRole('listbox', { name: 'Sort tasks by' })).toBeVisible();

    // Close by clicking the trigger again — section should stay open
    await sortButton.click();
    await expect(page.getByText('Refactor Kubernetes')).toBeVisible();
  });

  test('sorting by priority shows critical before medium', async ({ page }) => {
    const priorities = page.getByText(/^(critical|high|medium|low)$/i);
    const labels = await priorities.allTextContents();
    const criticalIndex = labels.findIndex((l) => l.toLowerCase() === 'critical');
    const mediumIndex = labels.findIndex((l) => l.toLowerCase() === 'medium');
    expect(criticalIndex).toBeLessThan(mediumIndex);
  });

  test('sorting by due date shows latest date first', async ({ page }) => {
    const activeSection = page.getByRole('group', { name: 'Active Tasks' });
    const times = activeSection.getByRole('time');

    // Capture second item before sort — it will change when sort applies
    const preSortSecond = await times.nth(1).getAttribute('datetime');

    const sortButton = page.getByRole('button', { name: 'Sort tasks by' });
    await sortButton.click();
    await page.getByRole('option', { name: 'Due date' }).click();

    // Web-first wait: second date changes after sort flushes
    await expect(times.nth(1)).not.toHaveAttribute('datetime', preSortSecond ?? '');

    const dateTimes = await times.evaluateAll((els) =>
      els.map((el) => el.getAttribute('datetime')),
    );
    expect(dateTimes.length).toBeGreaterThan(1);
    const isSortedDesc = dateTimes.every(
      (d, i) => i === 0 || (d ?? '') <= (dateTimes[i - 1] ?? ''),
    );
    expect(isSortedDesc).toBe(true);
  });
});

test.describe('Tasks page — focus trap', () => {
  test('Tab cycles within drawer and Escape returns focus to trigger', async ({ page }) => {
    await loadStory(page);

    const trigger = page.getByRole('button', { name: /new task/i });
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'New task' });
    await expect(dialog).toBeVisible();

    const firstFocusable = dialog.getByRole('button', { name: 'Close' });
    await expect(firstFocusable).toBeFocused();

    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const insideDialog = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return false;
        return el.closest('[role="dialog"]') !== null;
      });
      expect(insideDialog).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});

test.describe('Tasks page — filter', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('typing in filter input shows only matching tasks', async ({ page }) => {
    const filterInput = page.getByPlaceholder('Filter tasks...');
    const kubernetesTask = page.getByText('Refactor Kubernetes service discovery logic for edge nodes');
    const iamTask = page.getByText('Audit IAM permissions for the staging database cluster');

    await expect(kubernetesTask).toBeVisible();
    await expect(iamTask).toBeVisible();

    await filterInput.fill('Kubernetes');
    await expect(kubernetesTask).toBeVisible();
    await expect(iamTask).not.toBeVisible();
  });

  test('clearing filter shows all tasks again', async ({ page }) => {
    const filterInput = page.getByPlaceholder('Filter tasks...');
    const allCheckboxes = page.getByRole('checkbox');

    const countBefore = await allCheckboxes.count();
    expect(countBefore).toBeGreaterThan(1);

    await filterInput.fill('Kubernetes');
    await expect(allCheckboxes).toHaveCount(1);

    await filterInput.fill('');
    await expect(allCheckboxes).toHaveCount(countBefore);
  });
});
