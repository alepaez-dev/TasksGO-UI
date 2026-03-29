import type { JestExpect } from '@jest/expect';
import type { TestRunnerConfig } from '@storybook/test-runner';

declare const expect: JestExpect;
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe } from 'axe-playwright';
import type { Result } from 'axe-core';

function formatResults(results: Result[]): string {
  return results
    .map(
      (r) =>
        `  - [${r.impact}] ${r.id}: ${r.description} (${r.nodes.length} node(s))\n` +
        r.nodes.map((n) => `    HTML: ${n.html}`).join('\n'),
    )
    .join('\n');
}

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    await page.waitForLoadState('networkidle');

    const storyContext = await getStoryContext(page, context);
    const a11yRules = storyContext.parameters?.a11y?.config?.rules ?? [];
    const disabledRules = a11yRules
      .filter((r: { enabled: boolean }) => r.enabled === false)
      .map((r: { id: string }) => r.id);

    // region: component stories render without page landmarks — the app provides those
    const disabledRuleIds = new Set([...disabledRules, 'region']);

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
      { selector: 'body', disabledIds: [...disabledRuleIds] },
    );

    if (results.violations.length > 0) {
      throw new Error(
        `A11y violations:\n${formatResults(results.violations)}`,
      );
    }

    if (results.incomplete.length > 0) {
      throw new Error(
        `Inconclusive a11y checks:\n${formatResults(results.incomplete)}`,
      );
    }

    if (storyContext.parameters?.scrollLock) {
      const before = await page.evaluate(() => window.scrollY);
      await page.mouse.wheel(0, 500);
      const after = await page.evaluate(() => window.scrollY);
      expect(after).toBe(before);
    }
  },
};

export default config;
