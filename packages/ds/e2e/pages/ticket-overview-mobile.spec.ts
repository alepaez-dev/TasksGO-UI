import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket--mobile';

async function loadStory(page: import('@playwright/test').Page) {
  await page.goto(storyUrl(STORY_ID));
  await page
    .getByRole('heading', { name: 'Description' })
    .waitFor({ state: 'visible' });
}

test.describe('Ticket Overview mobile — inline body editor', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
  });

  test('coarse-pointer styles apply, giving the edit pencil a 44px touch target', async ({
    page,
  }) => {
    const coarse = await page.evaluate(
      () => matchMedia('(pointer: coarse)').matches,
    );
    expect(coarse).toBe(true);

    const box = await page
      .getByRole('button', { name: 'Edit ticket template' })
      .boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
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
