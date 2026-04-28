import type { CSSProperties } from 'react';

export const orderByLabelStyle: CSSProperties = {
  fontFamily: 'var(--ds-text-section-header-font-family)',
  fontSize: 'var(--ds-text-section-header-font-size)',
  letterSpacing: 'var(--ds-text-section-header-letter-spacing)',
  textTransform: 'uppercase',
  lineHeight: 'var(--ds-text-section-header-line-height)',
};

export const orderByPrefixStyle: CSSProperties = {
  color: 'var(--ds-color-text-secondary)',
  fontWeight: 'var(--ds-font-weight-medium)',
};

export const orderByValueStyle: CSSProperties = {
  fontWeight: 'var(--ds-font-weight-bold)',
};
