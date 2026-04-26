import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders children text', () => {
    render(<SectionHeader>Project Artifacts</SectionHeader>);
    expect(screen.getByText('Project Artifacts')).toBeInTheDocument();
  });

  it('renders the heading as an h3 by default', () => {
    render(<SectionHeader>Label</SectionHeader>);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Label' }),
    ).toBeInTheDocument();
  });

  it('renders the heading at the specified headingLevel', () => {
    render(<SectionHeader headingLevel={2}>Label</SectionHeader>);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Label' }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the container div element', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<SectionHeader ref={ref}>Label</SectionHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className onto the container', () => {
    const { container } = render(
      <SectionHeader className="custom">Label</SectionHeader>,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('spreads additional HTML attributes', () => {
    render(<SectionHeader data-testid="section">Label</SectionHeader>);
    expect(screen.getByTestId('section')).toBeInTheDocument();
  });

  it('does not render the subtitle when it is not provided', () => {
    render(<SectionHeader>Label</SectionHeader>);
    expect(
      screen.getByRole('heading', { name: 'Label' }).nextElementSibling,
    ).toBeNull();
  });

  it('does not render the subtitle when it is an empty string', () => {
    render(<SectionHeader subtitle="">Label</SectionHeader>);
    expect(
      screen.getByRole('heading', { name: 'Label' }).nextElementSibling,
    ).toBeNull();
  });

  it('renders the subtitle when it is the number 0', () => {
    render(<SectionHeader subtitle={0}>Label</SectionHeader>);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('does not render the subtitle when it is false', () => {
    render(<SectionHeader subtitle={false}>Label</SectionHeader>);
    expect(
      screen.getByRole('heading', { name: 'Label' }).nextElementSibling,
    ).toBeNull();
  });

  it('does not render the subtitle when it is null', () => {
    render(<SectionHeader subtitle={null}>Label</SectionHeader>);
    expect(
      screen.getByRole('heading', { name: 'Label' }).nextElementSibling,
    ).toBeNull();
  });

  it('renders the subtitle when provided', () => {
    render(
      <SectionHeader subtitle="12 open · 3 in progress">
        My tasks
      </SectionHeader>,
    );
    expect(screen.getByText('12 open · 3 in progress')).toBeInTheDocument();
  });

  it('accepts ReactNode for subtitle', () => {
    render(
      <SectionHeader
        subtitle={
          <>
            <strong>12 open</strong> · 3 in progress
          </>
        }
      >
        My tasks
      </SectionHeader>,
    );
    expect(screen.getByText('12 open')).toBeInTheDocument();
    expect(screen.getByText(/3 in progress/)).toBeInTheDocument();
  });

  it('renders the heading above the subtitle in document order', () => {
    render(<SectionHeader subtitle="meta">Title</SectionHeader>);
    const heading = screen.getByRole('heading', { level: 3, name: 'Title' });
    const subtitle = screen.getByText('meta');
    expect(
      heading.compareDocumentPosition(subtitle) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
