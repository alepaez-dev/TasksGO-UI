import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExternalLink } from './ExternalLink';

describe('ExternalLink', () => {
  it('renders a hardened external anchor', () => {
    render(<ExternalLink href="https://example.com">Docs</ExternalLink>);
    const link = screen.getByRole('link', { name: /Docs/ });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('sanitizes a javascript: href to #', () => {
    render(<ExternalLink href="javascript:alert(1)">x</ExternalLink>);
    expect(screen.getByRole('link', { name: /x/ })).toHaveAttribute(
      'href',
      '#',
    );
  });

  it('exposes the "opens in a new tab" affordance to screen readers', () => {
    render(<ExternalLink href="https://example.com">Repo</ExternalLink>);
    expect(
      screen.getByRole('link', { name: 'Repo (opens in a new tab)' }),
    ).toBeInTheDocument();
  });

  it('renders the trailing external icon by default', () => {
    const { container } = render(
      <ExternalLink href="https://example.com">Repo</ExternalLink>,
    );
    expect(
      container.querySelector('[data-icon-name="open_in_new"]'),
    ).toBeInTheDocument();
  });

  it('omits the trailing external icon when showExternalIcon is false', () => {
    const { container } = render(
      <ExternalLink href="https://example.com" showExternalIcon={false}>
        Repo
      </ExternalLink>,
    );
    expect(
      container.querySelector('[data-icon-name="open_in_new"]'),
    ).not.toBeInTheDocument();
  });

  it('renders a leading icon when provided', () => {
    const { container } = render(
      <ExternalLink href="https://example.com" icon="link">
        Repo
      </ExternalLink>,
    );
    expect(
      container.querySelector('[data-icon-name="link"]'),
    ).toBeInTheDocument();
  });

  it('applies the md size class with md-sized icons by default', () => {
    const { container } = render(
      <ExternalLink href="https://example.com">Repo</ExternalLink>,
    );
    expect(screen.getByRole('link', { name: /Repo/ })).toHaveClass('md');
    expect(
      container.querySelector('[data-icon-name="open_in_new"]'),
    ).toHaveClass('sm');
  });

  it('scales the link and both icons down when size is sm', () => {
    const { container } = render(
      <ExternalLink href="https://example.com" icon="link" size="sm">
        Repo
      </ExternalLink>,
    );
    expect(screen.getByRole('link', { name: /Repo/ })).toHaveClass('sm');
    expect(container.querySelector('[data-icon-name="link"]')).toHaveClass(
      'xs',
    );
    expect(
      container.querySelector('[data-icon-name="open_in_new"]'),
    ).toHaveClass('xs');
  });

  it('forwards ref to the anchor and spreads arbitrary props', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <ExternalLink ref={ref} href="https://example.com" data-testid="ext">
        x
      </ExternalLink>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(screen.getByTestId('ext')).toBe(ref.current);
  });
});
