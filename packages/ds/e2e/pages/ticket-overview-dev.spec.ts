import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'pages-ticket--default';

test.describe('Ticket — Dev Details card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).waitFor({ state: 'visible' });
  });

  test('collapsible card sits in every tab and auto-opens on the Dev tab', async ({
    page,
  }) => {
    const header = page.getByRole('button', { name: /dev details/i });
    const repository = page.getByRole('heading', { name: 'Repository' });

    // Header is present even on the Overview tab, collapsed (body hidden).
    await expect(header).toBeVisible();
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await expect(repository).not.toBeVisible();
    await expect(page.getByText('Branch', { exact: true })).not.toBeVisible();

    // Switching to Dev auto-opens the card.
    await page.getByRole('tab', { name: 'Dev' }).click();
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(repository).toBeVisible();
    await expect(page.getByText('Branch', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /add edge-caching layer/i }),
    ).toBeVisible();

    // The Scratchpad is the Dev tab's main content.
    await expect(
      page.getByRole('tabpanel', { name: 'Dev' }).getByLabel('Dev scratchpad'),
    ).toBeVisible();

    // The header toggles the card manually.
    await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await expect(repository).not.toBeVisible();
  });
});

test.describe('Ticket — Dev Details card closing window', () => {
  test.beforeEach(async ({ page }) => {
    // No transition means transitionend never fires, so the body stays mounted
    // for the hook's full fallback window — the widest version of the gap.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).waitFor({ state: 'visible' });
  });

  test('panel content leaves the tab order as soon as the card reports collapsed', async ({
    page,
  }) => {
    const header = page.getByRole('button', { name: /dev details/i });
    const repoLink = page.getByRole('link', { name: /edge-gateway-service/i });

    await page.getByRole('tab', { name: 'Dev' }).click();
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(repoLink).toBeVisible();

    await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'false');

    // Focus reachability has to be probed synchronously while the body is still
    // mounted mid-close; stillMounted proves we were inside that window.
    const probe = await page.evaluate(() => {
      const link = document.querySelector<HTMLElement>(
        'a[href$="/edge-gateway-service"]',
      );
      if (!link) return { stillMounted: false, focused: false };
      link.focus();
      return { stillMounted: true, focused: document.activeElement === link };
    });

    expect(probe.stillMounted).toBe(true);
    expect(probe.focused).toBe(false);
  });
});

test.describe('Ticket — Dev tab scratchpad toolbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).waitFor({ state: 'visible' });
    await page.getByRole('tab', { name: 'Dev' }).click();
  });

  test('adds a task token line when nothing is being edited', async ({
    page,
  }) => {
    const panel = page.getByRole('tabpanel', { name: 'Dev' });
    await expect(
      panel.getByRole('toolbar', { name: 'Formatting' }),
    ).toBeVisible();

    await panel.getByRole('button', { name: 'Add task' }).click();
    await expect(panel.getByRole('textbox', { name: 'Edit note' })).toHaveValue(
      '[task]',
    );
  });

  test('inserts the token into the focused line instead of a new one', async ({
    page,
  }) => {
    const panel = page.getByRole('tabpanel', { name: 'Dev' });
    const rows = panel.getByRole('listitem');
    const before = await rows.count();

    await panel.getByRole('button', { name: 'Edit note' }).first().click();
    const editor = panel.getByRole('textbox', { name: 'Edit note' });
    await expect(editor).toBeFocused();
    const original = await editor.inputValue();

    await panel.getByRole('button', { name: 'Add task' }).click();

    // The press must not blur the line: the token lands in it, no row is added.
    await expect(editor).toHaveValue(`${original}[task]`);
    await expect(rows).toHaveCount(before);
  });

  test('shows pill labels and the markdown hint at desktop width', async ({
    page,
  }) => {
    const panel = page.getByRole('tabpanel', { name: 'Dev' });
    await expect(
      panel.getByRole('button', { name: 'Add QA scenario' }),
    ).toHaveText('Add QA scenario');
    await expect(panel.getByText('Markdown supported')).toBeVisible();
  });
});

test.describe('Ticket — toolbar dividers', () => {
  // A divider only means anything between items sharing a line. The row never
  // wraps at these widths, so dividers must be present and never stranded;
  // the wrapping half of this invariant is covered on mobile.
  const WIDTHS = [1280, 1440, 1600, 1920];

  for (const width of WIDTHS) {
    test(`keeps dividers unstranded at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(storyUrl(STORY_ID));
      await page.getByRole('tab', { name: 'Dev' }).click();
      const toolbar = page
        .getByRole('tabpanel', { name: 'Dev' })
        .getByRole('toolbar', { name: 'Formatting' });
      await expect(toolbar).toBeVisible();

      const layout = await toolbar.evaluate((el) => {
        const row = el.querySelector<HTMLElement>('[data-toolbar-row]');
        if (!row)
          throw new Error('Expected the toolbar to render its button row');
        const visible = [...row.children].filter(
          (child) => child.getBoundingClientRect().width > 0,
        );
        // Bucket by vertical centre: pills are a different height to icon
        // buttons, so their top edges differ on the very same line.
        const lines = new Map<number, { divider: boolean; right: number }[]>();
        for (const child of visible) {
          const box = child.getBoundingClientRect();
          const key = Math.round((box.top + box.bottom) / 2 / 10);
          const bucket = lines.get(key) ?? [];
          bucket.push({
            divider: child.hasAttribute('data-separator'),
            right: box.right,
          });
          lines.set(key, bucket);
        }
        let stranded = 0;
        for (const items of lines.values()) {
          const last = items.reduce((a, b) => (b.right > a.right ? b : a));
          if (last.divider) stranded += 1;
        }
        const dividers = visible.filter((child) =>
          child.hasAttribute('data-separator'),
        ).length;
        return { dividers, stranded, lines: lines.size };
      });

      if (layout.lines > 1) {
        expect(layout.dividers).toBe(0);
      } else {
        // Guard against a vacuous pass: the query must not hide dividers at
        // widths where the row comfortably fits on one line.
        expect(layout.dividers).toBeGreaterThan(0);
      }
      expect(layout.stranded).toBe(0);
    });
  }

  test('does show dividers when the row fits on one line', async ({ page }) => {
    // Pins the other half: the query must not hide dividers everywhere, which
    // would make the sweep above pass for the wrong reason.
    await page.setViewportSize({ width: 1920, height: 900 });
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).click();
    const toolbar = page
      .getByRole('tabpanel', { name: 'Dev' })
      .getByRole('toolbar', { name: 'Formatting' });
    await expect(toolbar).toBeVisible();

    const dividers = await toolbar.evaluate(
      (el) =>
        [...(el.querySelector('[data-toolbar-row]')?.children ?? [])].filter(
          (child) =>
            child.hasAttribute('data-separator') &&
            child.getBoundingClientRect().width > 0,
        ).length,
    );
    expect(dividers).toBeGreaterThan(0);
  });
});

test.describe('Ticket — View Task opens the edit drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).click();
  });

  test('opens the drawer for the hovered task and restores focus on close', async ({
    page,
  }) => {
    const chip = page
      .getByRole('tabpanel', { name: 'Dev' })
      .getByRole('button', { name: /^Linked task/ })
      .first();
    await chip.hover();

    await page.getByRole('link', { name: 'View Task' }).click();

    const drawer = page.getByRole('dialog', { name: /Edit task/ });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByLabel('Task title')).toHaveValue(
      'Add multi-value header support to edge cache',
    );

    const lingering = await page.evaluate(
      () =>
        document.querySelectorAll('[role="dialog"][aria-label^="Linked task"]')
          .length,
    );
    expect(lingering).toBe(0);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(drawer).toHaveCount(0);
    // useFocusTrap restores focus on close; assert it because it is inherited.
    await expect(chip).toBeFocused();
  });
});

test.describe('Ticket — task drawer selector state', () => {
  test('reopening with the pointer never restores a dropdown left open', async ({
    page,
  }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).click();
    const chip = page
      .getByRole('tabpanel', { name: 'Dev' })
      .getByRole('button', { name: /^Linked task/ })
      .first();
    await chip.hover();
    await page.getByRole('link', { name: 'View Task' }).click();
    const drawer = page.getByRole('dialog', { name: /Edit task/ });
    await expect(drawer).toBeVisible();

    await drawer.getByRole('button', { name: 'Select priority' }).click();
    await expect(drawer.getByRole('listbox')).toBeVisible();

    // Two tabs move focus out of the dropdown while it stays open; one is not
    // enough, and the Selector would swallow the Escape below. Escape is also
    // the only dismissal that fires no mousedown, which is what the group's
    // outside-click handler listens for.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    await expect(drawer).toHaveCount(0);

    await chip.hover();
    await page.getByRole('link', { name: 'View Task' }).click();
    await expect(page.getByRole('dialog', { name: /Edit task/ })).toBeVisible();
    await expect(page.getByRole('listbox')).toHaveCount(0);
  });

  // The pointer case above is cleared by the group's outside-mousedown
  // handler. A keyboard-only user never fires one, so this covers the other
  // half: the drawer must reset the group when it closes.
  test('reopening with the keyboard never restores a dropdown left open', async ({
    page,
  }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).click();
    const chip = page
      .getByRole('tabpanel', { name: 'Dev' })
      .getByRole('button', { name: /^Linked task/ })
      .first();
    const openByKeyboard = async () => {
      await chip.focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
    };

    await openByKeyboard();
    const drawer = page.getByRole('dialog', { name: /Edit task/ });
    await expect(drawer).toBeVisible();

    await drawer.getByRole('button', { name: 'Select priority' }).click();
    await expect(drawer.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    await expect(drawer).toHaveCount(0);

    await openByKeyboard();
    await expect(page.getByRole('dialog', { name: /Edit task/ })).toBeVisible();
    await expect(page.getByRole('listbox')).toHaveCount(0);
  });
});

test.describe('Ticket — truncated selector labels', () => {
  test('only the cut-off value advertises a hover title', async ({ page }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).click();
    await page
      .getByRole('tabpanel', { name: 'Dev' })
      .getByRole('button', { name: /^Linked task/ })
      .first()
      .hover();
    await page.getByRole('link', { name: 'View Task' }).click();
    const drawer = page.getByRole('dialog', { name: /Edit task/ });
    await expect(drawer).toBeVisible();

    const titles = await drawer.evaluate((d) => {
      const read = (label: string) => {
        const btn = d.querySelector(`button[aria-label="${label}"]`);
        const span = btn?.querySelector('span');
        if (!(span instanceof HTMLElement)) return null;
        return {
          title: span.getAttribute('title'),
          overflowPx: span.scrollWidth - span.clientWidth,
        };
      };
      return {
        ticket: read('Linked ticket'),
        priority: read('Select priority'),
      };
    });

    // The long ticket label is cut off, so it earns a tooltip; "Medium" fits,
    // so it must not get one.
    expect(titles.ticket?.overflowPx).toBeGreaterThan(1);
    expect(titles.ticket?.title).toContain('Implement dynamic edge-caching');
    expect(titles.priority?.overflowPx).toBeLessThanOrEqual(1);
    expect(titles.priority?.title).toBeNull();
  });

  test('a multi-word property label is never the one that wraps', async ({
    page,
  }) => {
    await page.goto(storyUrl(STORY_ID));
    await page.getByRole('tab', { name: 'Dev' }).click();
    await page
      .getByRole('tabpanel', { name: 'Dev' })
      .getByRole('button', { name: /^Linked task/ })
      .first()
      .hover();
    await page.getByRole('link', { name: 'View Task' }).click();
    const drawer = page.getByRole('dialog', { name: /Edit task/ });
    await expect(drawer).toBeVisible();

    // "Linked Ticket" sits beside the only value long enough to compete for
    // width, so it is the row that wraps if the label absorbs any shrink.
    const label = drawer.getByText('Linked Ticket', { exact: true });
    const lines = await label.evaluate((el) => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '17');
      return Math.round(el.getBoundingClientRect().height / lineHeight);
    });
    expect(lines).toBe(1);
  });
});
