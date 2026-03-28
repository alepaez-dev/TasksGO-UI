import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { checkA11y, injectAxe } from 'axe-playwright';
import type { Result } from 'axe-core';

function formatResults(label: string, results: Result[]): string {
  return results
    .map(
      (r) =>
        `  - [${r.impact}] ${r.id}: ${r.description} (${r.nodes.length} node(s))`,
    )
    .join('\n');
}

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

    const disabledRuleIds = new Set(disabledRules);

    const results = await page.evaluate(
      ({ selector, disabledIds }) => {
        type AxeRun = (
          context: string,
          options: Record<string, unknown>,
        ) => Promise<{ violations: Result[]; incomplete: Result[] }>;

        const axe = (window as unknown as { axe: { run: AxeRun } }).axe;
        const rules = Object.fromEntries(
          (disabledIds as string[]).map((id) => [id, { enabled: false }]),
        );
        return axe.run(selector, {
          rules,
          resultTypes: ['violations', 'incomplete'],
        });
      },
      { selector: '#storybook-root', disabledIds: [...disabledRuleIds] },
    );

    if (results.violations.length > 0) {
      throw new Error(
        `A11y violations:\n${formatResults('Violations', results.violations)}`,
      );
    }

    if (results.incomplete.length > 0) {
      throw new Error(
        `Inconclusive a11y checks:\n${formatResults('Inconclusive', results.incomplete)}`,
      );
    }
  },
};

export default config;
