import { describe, it, expect } from 'vitest';
import { generateTokensCSS } from './generate-css';

describe('generateTokensCSS', () => {
  const css = generateTokensCSS();

  it('keeps derived white tokens aliased to surface-primary', () => {
    expect(css).toContain(
      '--ds-color-nav-active-bg: var(--ds-color-surface-primary);',
    );
    expect(css).toContain(
      '--ds-color-avatar-text: var(--ds-color-surface-primary);',
    );
    expect(css).toContain(
      '--ds-color-button-primary-text: var(--ds-color-surface-primary);',
    );
  });

  it('emits text-inverse as an independent base token', () => {
    expect(css).toContain('--ds-color-text-inverse: #ffffff;');
  });
});
