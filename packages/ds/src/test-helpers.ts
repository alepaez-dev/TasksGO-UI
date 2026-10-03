import { vi } from 'vitest';

export function stubStacked() {
  vi.stubGlobal('matchMedia', (media: string) => ({
    media,
    matches: true,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}
