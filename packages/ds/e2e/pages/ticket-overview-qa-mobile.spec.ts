import { test, expect, type Locator, type Page } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket--mobile-qa';

async function scrollOwnScrollerToEnd(target: Locator) {
  await target.evaluate((el) => {
    for (let node = el.parentElement; node; node = node.parentElement) {
      if (node.scrollHeight > node.clientHeight) {
        node.scrollTop = node.scrollHeight;
        return;
      }
    }
  });
}

const loadStory = async ({ page }: { page: Page }) => {
  await page.goto(storyUrl(STORY_ID));
  await page.getByRole('button', { name: 'Add scenario' }).waitFor({
    state: 'visible',
  });
};

test.describe('Ticket QA — mobile', () => {
  test.beforeEach(loadStory);

  test('switches environment from the sheet', async ({ page }) => {
    await page.getByRole('button', { name: /Switch environment/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('option', { name: /QA-02/ }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: /Switch environment/ }),
    ).toContainText('QA-02');
  });

  test('the fab opens the add-scenario sheet', async ({ page }) => {
    await page.getByRole('button', { name: 'Add scenario' }).click();
    await expect(
      page.getByRole('dialog', { name: /Add test scenario/i }),
    ).toBeVisible();
  });

  test('the fab clears the bottom tab bar', async ({ page }) => {
    const fab = page.getByRole('button', { name: 'Add scenario' });
    const tabBar = page.getByRole('navigation', { name: 'Main navigation' });
    const fabBox = await fab.boundingBox();
    const barBox = await tabBar.boundingBox();
    if (!fabBox || !barBox) {
      throw new Error('fab or bottom tab bar was not laid out');
    }
    expect(fabBox.y + fabBox.height).toBeLessThanOrEqual(barBox.y + 1);
  });

  test('a sheet places focus inside itself', async ({ page }) => {
    await page.getByRole('button', { name: /Switch environment/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    const focus = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const active = document.activeElement;
      return {
        hasDialog: dialog !== null,
        inside: dialog !== null && dialog.contains(active),
        active:
          active === null
            ? 'none'
            : `${active.tagName}[${active.getAttribute('aria-label') ?? ''}]`,
      };
    });
    expect(
      focus,
      `focus should land inside the sheet (active: ${focus.active})`,
    ).toMatchObject({
      hasDialog: true,
      inside: true,
    });
  });

  test('the env card is separated from the scenario list', async ({ page }) => {
    const promote = page.getByRole('button', { name: /Promote to/ });
    const header = page.getByText('Test scenarios', { exact: false }).first();
    const promoteBox = await promote.boundingBox();
    const headerBox = await header.boundingBox();
    if (!promoteBox || !headerBox) throw new Error('promote or header missing');
    expect(headerBox.y - (promoteBox.y + promoteBox.height)).toBeGreaterThan(
      28,
    );
  });

  test('the promote action spans the env card on mobile', async ({ page }) => {
    const promote = page.getByRole('button', { name: /Promote to/ });
    const trigger = page.getByRole('button', { name: /Switch environment/ });
    const promoteBox = await promote.boundingBox();
    const triggerBox = await trigger.boundingBox();
    if (!promoteBox || !triggerBox)
      throw new Error('promote or trigger missing');
    expect(promoteBox.width).toBeGreaterThan(triggerBox.width);
  });

  test('the fab never covers a scenario status control', async ({ page }) => {
    const pills = page.getByRole('button', { name: 'Set scenario status' });
    const lastPill = pills.last();
    await scrollOwnScrollerToEnd(lastPill);

    const fab = await page
      .getByRole('button', { name: 'Add scenario' })
      .boundingBox();
    const last = await lastPill.boundingBox();
    if (!fab || !last) throw new Error('fab or status pill missing');

    const overlapX =
      Math.min(fab.x + fab.width, last.x + last.width) -
      Math.max(fab.x, last.x);
    const overlapY =
      Math.min(fab.y + fab.height, last.y + last.height) -
      Math.max(fab.y, last.y);
    expect(
      Math.min(overlapX, overlapY),
      `fab overlaps the last status pill by ${overlapX}×${overlapY}px`,
    ).toBeLessThanOrEqual(0);
  });

  test('every editable control is large enough not to zoom iOS', async ({
    page,
  }) => {
    const tooSmall = async () =>
      page.evaluate(() =>
        [...document.querySelectorAll('textarea, input')]
          .filter((el) => {
            const type = (el.getAttribute('type') ?? el.tagName).toLowerCase();
            return !['checkbox', 'radio', 'file', 'hidden'].includes(type);
          })
          .map((el) => ({
            name: el.className.toString().split(' ')[0],
            size: parseFloat(getComputedStyle(el).fontSize),
          }))
          .filter((c) => c.size < 16),
      );

    await page
      .getByRole('button', { name: /expand scenario/i })
      .first()
      .click();
    await page
      .getByRole('button', { name: 'Edit Actual Result' })
      .first()
      .click();
    await expect(page.getByRole('textbox').first()).toBeVisible();
    expect(await tooSmall()).toEqual([]);

    await page.getByLabel('Edit', { exact: true }).first().click();
    await expect(
      page.getByRole('textbox', { name: 'Scenario title' }),
    ).toBeVisible();
    expect(await tooSmall()).toEqual([]);

    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('button', { name: 'Add scenario' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Add step' }).click();
    await expect(page.getByRole('textbox', { name: /Step 1/i })).toBeVisible();
    expect(await tooSmall()).toEqual([]);
  });
});
