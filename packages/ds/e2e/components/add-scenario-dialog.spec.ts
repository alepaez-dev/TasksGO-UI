import { test, expect } from '@playwright/test';
import { storyUrl } from '../helpers/storyUrl';

const STORY_ID = 'components-addscenariodialog--consumer-blocks-executables';

test.describe('AddScenarioDialog — evidence rejection notice', () => {
  test('the live region is mounted and empty before anything is rejected', async ({
    page,
  }) => {
    await page.goto(storyUrl(STORY_ID));
    await page
      .getByRole('dialog', { name: 'Add test scenario' })
      .waitFor({ state: 'visible' });

    // a region that arrives already populated is not announced: the screen
    // reader was not watching it when the text appeared. It has to exist first.
    await expect(page.getByRole('status')).toHaveCount(1);
    await expect(page.getByRole('status')).toHaveText('');
  });
});
