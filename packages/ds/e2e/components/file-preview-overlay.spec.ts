import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'components-filepreviewoverlay--default';

test.describe('FilePreviewOverlay — reduced motion', () => {
  test('the dialog renders without a fade, fully opaque from the start', async ({
    page,
  }) => {
    // imperative emulation: test.use({ reducedMotion }) does not reach the
    // page in this project setup, and this mirrors what the a11y runner does
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(storyUrl(STORY_ID));
    const dialog = page.getByRole('dialog', {
      name: 'socket_log.png, file 1 of 6',
    });
    await dialog.waitFor({ state: 'visible' });

    // The a11y CI job audits the reduced-motion rendering. A re-enabled
    // entrance fade would let axe snapshot semi-transparent text over the
    // light page again (the mid-fade contrast race) — pin the contract.
    await expect(dialog).toHaveCSS('transition-duration', '0s');
    await expect(dialog).toHaveCSS('opacity', '1');
  });
});
