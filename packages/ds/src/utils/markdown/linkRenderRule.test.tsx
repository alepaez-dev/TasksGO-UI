import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Markdown } from '../../components/Markdown';

describe('linkRenderRule (via Markdown)', () => {
  it('renders a safe link with rel hardening', () => {
    render(<Markdown source="[docs](https://example.com)" />);
    const link = screen.getByRole('link', { name: 'docs' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('neutralizes a javascript: link to #', () => {
    render(<Markdown source="[x](javascript:alert(1))" />);
    expect(screen.getByRole('link', { name: 'x' })).toHaveAttribute(
      'href',
      '#',
    );
  });
});
