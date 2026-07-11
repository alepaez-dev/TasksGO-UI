import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket-overview--mobile';

async function loadStory(page: import('@playwright/test').Page) {
  await page.goto(storyUrl(STORY_ID));
  await page
    .getByRole('heading', { name: 'Description' })
    .waitFor({ state: 'visible' });
}

test.describe('Ticket Overview mobile — inline body editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loadStory(page);
  });

  test('the edit pencil is visible without hover and opens the editor', async ({
    page,
  }) => {
    const edit = page.getByRole('button', { name: 'Edit ticket template' });
    await expect(edit).toBeVisible();
    await edit.click();
    const textarea = page.getByRole('textbox', { name: 'Markdown' });
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue(/## Description/);
  });

  test('Save commits and Cancel reverts, restoring focus to the pencil', async ({
    page,
  }) => {
    const editButton = page.getByRole('button', {
      name: 'Edit ticket template',
    });
    await editButton.click();
    const textarea = page.getByRole('textbox', { name: 'Markdown' });
    await textarea.fill('## Saved on mobile');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(
      page.getByRole('heading', { name: 'Saved on mobile' }),
    ).toBeVisible();
    await expect(editButton).toBeFocused();

    await editButton.click();
    await textarea.fill('## Discarded');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(
      page.getByRole('heading', { name: 'Saved on mobile' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Discarded' })).toHaveCount(
      0,
    );
    await expect(editButton).toBeFocused();
  });
});
