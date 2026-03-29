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

    const disabledRuleIds = new Set(disabledRules);

    const results = await page.evaluate(
      async ({ selector, disabledIds }) => {
        type AxeRun = (
          context: string,
          options: Record<string, unknown>,
        ) => Promise<{ violations: Result[]; incomplete: Result[] }>;

        const axe = (window as unknown as { axe: { run: AxeRun } }).axe;
        const rules = Object.fromEntries(
          (disabledIds as string[]).map((id) => [id, { enabled: false }]),
        );
        const opts = { rules, resultTypes: ['violations', 'incomplete'] };

        // Wait up to 5s for any in-progress addon axe run to finish before starting ours
        const maxWaitMs = 5000;
        const intervalMs = 100;
        let waited = 0;

        while (waited < maxWaitMs) {
          try {
            return await axe.run(selector, opts);
          } catch (e) {
            if (
              e instanceof Error &&
              e.message.includes('already running') &&
              waited + intervalMs <= maxWaitMs
            ) {
              await new Promise((r) => setTimeout(r, intervalMs));
              waited += intervalMs;
              continue;
            }
            throw e;
          }
        }

        return axe.run(selector, opts);
      },
      { selector: '#storybook-root', disabledIds: [...disabledRuleIds] },
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
