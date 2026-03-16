import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

const segments = [
  { label: 'Projects', href: '/projects' },
  { label: 'Engineering Core' },
];

describe('Breadcrumb', () => {
  it('renders a nav with Breadcrumb label', () => {
    render(<Breadcrumb segments={segments} />);
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toBeInTheDocument();
  });

  it('renders all segment labels', () => {
    render(<Breadcrumb segments={segments} />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Engineering Core')).toBeInTheDocument();
  });

  it('renders segments with href as links', () => {
    render(<Breadcrumb segments={segments} />);
    const link = screen.getByRole('link', { name: 'Projects' });
    expect(link).toHaveAttribute('href', '/projects');
  });

  it('marks the last segment with aria-current="page"', () => {
    render(<Breadcrumb segments={segments} />);
    expect(screen.getByText('Engineering Core')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('renders separators between segments', () => {
    const { container } = render(<Breadcrumb segments={segments} />);
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators).toHaveLength(1);
    expect(separators[0].textContent).toBe('/');
  });

  it('forwards ref to the nav element', () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    render(<Breadcrumb ref={ref} segments={segments} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('NAV');
  });

  it('merges custom className', () => {
    render(<Breadcrumb segments={segments} className="custom" />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveClass(
      'custom',
    );
  });
});
