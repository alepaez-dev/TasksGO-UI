import type { Page } from '@playwright/test';

export const editToggles = (page: Page) =>
  page.getByRole('button', { name: /^Edit/ });

export async function evidenceRowCounts(page: Page): Promise<number[]> {
  const tops = await page
    .getByRole('button', { name: /^Remove / })
    .evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().y)),
    );
  const perRow = new Map<number, number>();
  for (const top of tops) perRow.set(top, (perRow.get(top) ?? 0) + 1);
  return [...perRow.values()];
}
