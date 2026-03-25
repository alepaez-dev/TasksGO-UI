import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders a header element', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders left slot when provided', () => {
    render(<Header left={<span>Breadcrumb</span>} />);
    expect(screen.getByText('Breadcrumb')).toBeInTheDocument();
  });

  it('renders center slot when provided', () => {
    render(<Header center={<span>Search</span>} />);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('renders right slot when provided', () => {
    render(<Header right={<span>Avatar</span>} />);
    expect(screen.getByText('Avatar')).toBeInTheDocument();
  });

  it('does not render left wrapper when left is not provided', () => {
    const { container } = render(<Header center={<span>Search</span>} />);
    const leftDiv = container.querySelector('[class*="left"]');
    expect(leftDiv).not.toBeInTheDocument();
  });

  it('does not render center wrapper when center is not provided', () => {
    const { container } = render(<Header left={<span>Nav</span>} />);
    const centerDiv = container.querySelector('[class*="center"]');
    expect(centerDiv).not.toBeInTheDocument();
  });

  it('does not render right wrapper when right is not provided', () => {
    const { container } = render(<Header left={<span>Nav</span>} />);
    const rightDiv = container.querySelector('[class*="right"]');
    expect(rightDiv).not.toBeInTheDocument();
  });

  it('forwards ref to header element', () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    render(<Header ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('HEADER');
  });

  it('applies custom className', () => {
    render(<Header className="custom-class" />);
    const header = screen.getByRole('banner');
    expect(header.className).toContain('custom-class');
  });

  it('spreads additional HTML attributes', () => {
    render(<Header data-testid="my-header" />);
    expect(screen.getByTestId('my-header')).toBeInTheDocument();
  });

  it('renders center inside content in default flow mode', () => {
    const { container } = render(<Header center={<span>Title</span>} />);
    const content = container.querySelector('[class*="content"]');
    const center = container.querySelector('[class*="center"]');
    expect(content).toContainElement(center as HTMLElement);
  });

  it('renders center absolutely and applies compact class when compact', () => {
    const { container } = render(
      <Header center={<span>Title</span>} compact />,
    );
    const header = screen.getByRole('banner');
    expect(header.className).toContain('compact');
    const content = container.querySelector('[class*="content"]');
    const centerAbsolute = container.querySelector('[class*="centerAbsolute"]');
    expect(centerAbsolute).toBeInTheDocument();
    expect(content).not.toContainElement(centerAbsolute as HTMLElement);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});
