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

async function tabBarBottom(page: import('@playwright/test').Page) {
  return page.getByRole('tablist').evaluate((el) => {
    const bar = el.parentElement;
    if (!bar) throw new Error('Expected the tablist to sit inside the bar');
    return bar.getBoundingClientRect().bottom;
  });
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

  test('the toolbar and tab bar both stay put while a line is edited', async ({
    page,
  }) => {
    await openDevTab(page);
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    const toolbar = page.getByRole('toolbar', { name: 'Formatting' });
    await expect(nav).toBeVisible();
    await expect(toolbar).toBeVisible();

    await page
      .getByRole('button', { name: /^Edit / })
      .first()
      .click();

    // The toolbar is persistent, so nothing has to move aside for it.
    await expect(toolbar).toBeVisible();
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

  test('dismissing the sheet clears the PR filter for the next open', async ({
    page,
  }) => {
    await openDevTab(page);
    await openDetails(page);
    await page.getByRole('button', { name: /Pull requests/ }).click();

    const list = page.getByRole('list', { name: 'Pull requests' });
    await page.getByLabel('Find pull request').fill('884');
    await expect(list.getByRole('link')).toHaveCount(1);

    // Dismiss the sheet (Escape → closeDetails), NOT "Back to details".
    await page.keyboard.press('Escape');
    await expect(page.getByLabel('Find pull request')).toHaveCount(0);

    // Reopening and drilling back in must show the full, unfiltered list.
    await openDetails(page);
    await page.getByRole('button', { name: /Pull requests/ }).click();
    await expect(list.getByRole('link')).toHaveCount(3);
  });

  test('clearing the PR search keeps focus inside the sheet', async ({
    page,
  }) => {
    await openDevTab(page);
    await openDetails(page);
    await page.getByRole('button', { name: /Pull requests/ }).click();

    const search = page.getByLabel('Find pull request');
    await search.fill('884');
    // Activating the clear button removes it from the DOM; focus must land back
    // on the search input, not <body> (which would let Tab escape the modal).
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(search).toBeFocused();
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

test.describe('Ticket mobile — scratchpad toolbar', () => {
  // 8 formatting actions plus the 2 token pills.
  const TOOLBAR_BUTTON_COUNT = 10;

  test.beforeEach(async ({ page }) => {
    await loadStory(page);
    await openDevTab(page);
  });

  test('adds a qa token line when nothing is being edited', async ({
    page,
  }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Formatting' });
    await expect(toolbar).toBeVisible();

    await page.getByRole('button', { name: 'Add QA scenario' }).click();
    await expect(page.getByRole('textbox', { name: 'Edit note' })).toHaveValue(
      '[qa]',
    );
  });

  test('sits flush beneath the tab bar at rest', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Formatting' });
    await expect(toolbar).toBeVisible();

    const barBottom = await tabBarBottom(page);
    const toolbarBox = await toolbar.boundingBox();
    if (!toolbarBox) {
      throw new Error('Expected the toolbar to be laid out');
    }
    expect(Math.abs(toolbarBox.y - barBottom)).toBeLessThan(2);
  });

  test('wraps so every button is reachable without scrolling the row', async ({
    page,
  }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Formatting' });
    await expect(toolbar).toBeVisible();

    const buttons = toolbar.getByRole('button');
    await expect(buttons).toHaveCount(TOOLBAR_BUTTON_COUNT);

    // Every button sits inside the row's own box — nothing is parked off-screen
    // behind a scroll the user gets no scrollbar to discover.
    for (let i = 0; i < TOOLBAR_BUTTON_COUNT; i += 1) {
      await expect(buttons.nth(i)).toBeInViewport();
    }
    const overflow = await toolbar.evaluate((el) => {
      const row = el.querySelector<HTMLElement>('[data-toolbar-row]');
      if (!row)
        throw new Error('Expected the toolbar to render its button row');
      return row.scrollWidth - row.clientWidth;
    });
    expect(overflow).toBe(0);
  });

  test('collapses pill labels to icons on a narrow screen', async ({
    page,
  }) => {
    const addTask = page.getByRole('button', { name: 'Add task' });
    await expect(addTask).toBeVisible();
    // The visible label collapses, but the accessible name survives it.
    await expect(addTask.getByText('Add task', { exact: true })).toBeHidden();
    await expect(page.getByText('Markdown supported')).toBeHidden();
  });
});

test.describe('Ticket mobile — scratchpad toolbar with long notes', () => {
  // The six-line default page cannot scroll far enough for any sticky element
  // to reach its threshold, so sticky behaviour is only observable here.
  const LONG_STORY_ID = 'pages-ticket--mobile-long-notes';

  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(LONG_STORY_ID));
    await page
      .getByRole('heading', { name: 'Description' })
      .waitFor({ state: 'visible' });
    await openDevTab(page);
  });

  test('holds its place under the tab bar while the notes scroll away', async ({
    page,
  }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Formatting' });
    const firstNote = page.getByText('Repro: cold-start cache miss');
    await expect(toolbar).toBeVisible();

    const noteBefore = await firstNote.boundingBox();
    await toolbar.hover();
    await page.mouse.wheel(0, 600);

    await expect(async () => {
      const noteAfter = await firstNote.boundingBox();
      if (!noteBefore || !noteAfter) {
        throw new Error('Expected the first note to be laid out');
      }
      // Past the tab bar's own sticky threshold, so both are truly pinned.
      expect(noteAfter.y).toBeLessThan(noteBefore.y - 250);
    }).toPass();

    await expect(toolbar).toBeInViewport();
    const barBottom = await tabBarBottom(page);
    const toolbarBox = await toolbar.boundingBox();
    if (!toolbarBox) {
      throw new Error('Expected the toolbar to be laid out');
    }
    // Measured against the bar's own bottom edge: the tablist sits inside the
    // bar, so comparing to it would miss the bar growing past the offset.
    expect(Math.abs(toolbarBox.y - barBottom)).toBeLessThan(2);
  });
});

test.describe('Ticket mobile — toolbar dividers', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
    await openDevTab(page);
  });

  test('drops dividers on the phone, where the button row wraps', async ({
    page,
  }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Formatting' });
    await expect(toolbar).toBeVisible();

    const layout = await toolbar.evaluate((el) => {
      const row = el.querySelector<HTMLElement>('[data-toolbar-row]');
      if (!row)
        throw new Error('Expected the toolbar to render its button row');
      const visible = [...row.children].filter(
        (child) => child.getBoundingClientRect().width > 0,
      );
      const lines = new Set(
        visible.map((child) => {
          const box = child.getBoundingClientRect();
          return Math.round((box.top + box.bottom) / 2 / 10);
        }),
      );
      return {
        lines: lines.size,
        dividers: visible.filter((child) =>
          child.hasAttribute('data-separator'),
        ).length,
      };
    });

    // The row genuinely wraps here — otherwise this would prove nothing.
    expect(layout.lines).toBeGreaterThan(1);
    expect(layout.dividers).toBe(0);
  });
});

test.describe('Ticket mobile — View Task opens the edit drawer', () => {
  test.beforeEach(async ({ page }) => {
    await loadStory(page);
    await openDevTab(page);
  });

  test('swaps the task sheet for the drawer and restores focus on close', async ({
    page,
  }) => {
    const chip = page
      .getByRole('tabpanel', { name: 'Dev' })
      .getByRole('button', { name: /^Linked task/ })
      .first();
    await chip.click();

    const sheet = page.getByRole('dialog', { name: /^Linked task/ });
    await expect(sheet).toBeVisible();

    await page.getByRole('link', { name: 'View Task' }).click();

    // The sheet must unmount rather than stack behind the drawer — two live
    // focus traps is the failure mode this pins.
    await expect(sheet).toHaveCount(0);
    const drawer = page.getByRole('dialog', { name: /Edit task/ });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByLabel('Task title')).toHaveValue(
      'Add multi-value header support to edge cache',
    );

    // Checked after the sheet has unmounted, so its focus-trap teardown has
    // already run: it must not have pulled focus back out of the drawer.
    const focusHeld = await drawer.evaluate((el) =>
      el.contains(document.activeElement),
    );
    expect(focusHeld).toBe(true);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(drawer).toHaveCount(0);
    await expect(chip).toBeFocused();
  });
});
