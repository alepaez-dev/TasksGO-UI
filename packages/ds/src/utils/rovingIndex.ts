export interface MaybeDisabled {
  disabled?: boolean;
}

export function findFirstEnabledIndex(items: readonly MaybeDisabled[]): number {
  return items.findIndex((item) => !item.disabled);
}

export function findLastEnabledIndex(items: readonly MaybeDisabled[]): number {
  for (let i = items.length - 1; i >= 0; i--) {
    if (!items[i].disabled) return i;
  }
  return -1;
}

export function findNextEnabledIndex(
  items: readonly MaybeDisabled[],
  start: number,
  step: 1 | -1,
): number {
  const n = items.length;
  for (let i = 1; i <= n; i++) {
    const idx = (start + step * i + n) % n;
    if (!items[idx].disabled) return idx;
  }
  return start;
}
