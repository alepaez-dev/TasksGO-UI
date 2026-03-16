import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { checkA11y, injectAxe } from 'axe-playwright';

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    const a11yRules = storyContext.parameters?.a11y?.config?.rules ?? [];
    const disabledRules = a11yRules
      .filter((r: { enabled: boolean }) => r.enabled === false)
      .map((r: { id: string }) => r.id);

    await checkA11y(page, '#storybook-root', {
      axeOptions: {
        rules: Object.fromEntries(
          disabledRules.map((id: string) => [id, { enabled: false }]),
        ),
      },
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
