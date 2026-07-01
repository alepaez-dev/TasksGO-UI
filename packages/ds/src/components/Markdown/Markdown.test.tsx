import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('renders headings at the right level', () => {
    render(<Markdown source={'# Title\n\n## Section'} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Title' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Section' }),
    ).toBeInTheDocument();
  });

  it('renders inline formatting as semantic elements', () => {
    render(<Markdown source={'Text with **bold** and `code`.'} />);
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByText('code').tagName).toBe('CODE');
  });

  it('sanitizes dangerous link hrefs and preserves safe ones', () => {
    render(
      <Markdown source={'[bad](javascript:alert(1)) and [good](/path)'} />,
    );
    expect(screen.getByRole('link', { name: 'bad' })).toHaveAttribute(
      'href',
      '#',
    );
    expect(screen.getByRole('link', { name: 'good' })).toHaveAttribute(
      'href',
      '/path',
    );
  });

  it('adds rel="noopener noreferrer" to links', () => {
    render(<Markdown source={'[x](https://example.com)'} />);
    expect(screen.getByRole('link', { name: 'x' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
  });

  it('renders raw HTML as inert text, not live elements', () => {
    const { container } = render(
      <Markdown source={'<script>alert(1)</script>'} />,
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('alert(1)');
  });

  it('does not create an image element from raw HTML', () => {
    const { container } = render(
      <Markdown source={'<img src=x onerror="alert(1)">'} />,
    );
    expect(container.querySelector('img')).toBeNull();
  });

  it('renders markdown images with a safe src', () => {
    render(<Markdown source={'![logo](/logo.png)'} />);
    expect(screen.getByRole('img', { name: 'logo' })).toHaveAttribute(
      'src',
      '/logo.png',
    );
  });

  it('drops a dangerous markdown image src', () => {
    render(<Markdown source={'![x](javascript:alert(1))'} />);
    expect(screen.getByRole('img', { name: 'x' })).not.toHaveAttribute('src');
  });

  it('renders GFM task lists as labelled checkboxes reflecting completion', () => {
    render(<Markdown source={'- [x] done\n- [ ] todo'} />);
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(2);
    expect(boxes[0]).toBeChecked();
    expect(boxes[1]).not.toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Completed' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Not completed' }),
    ).toBeInTheDocument();
  });

  it('renders GFM tables', () => {
    render(<Markdown source={'| A | B |\n| --- | --- |\n| 1 | 2 |'} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '1' })).toBeInTheDocument();
  });

  it('renders fenced code blocks inside a pre element', () => {
    const { container } = render(
      <Markdown source={'```\nconst a = 1;\n```'} />,
    );
    const pre = container.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toContain('const a = 1;');
  });

  it('forwards ref to the wrapper div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Markdown source="x" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a custom className onto the wrapper', () => {
    const { container } = render(<Markdown source="x" className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('renders a scope fenced block as Included/Excluded cards', () => {
    const source = [
      '```scope',
      'included:',
      '- GET /v1/assets/*',
      'excluded:',
      '- WebSocket streams',
      '```',
    ].join('\n');
    render(<Markdown source={source} />);
    expect(screen.getByText('Included')).toBeInTheDocument();
    expect(screen.getByText('Excluded')).toBeInTheDocument();
    expect(screen.getByText('GET /v1/assets/*')).toBeInTheDocument();
    expect(screen.getByText('WebSocket streams')).toBeInTheDocument();
  });

  it('falls back to a code block for a scope fence with no items', () => {
    const { container } = render(
      <Markdown source={'```scope\njust text\n```'} />,
    );
    expect(screen.queryByText('Included')).not.toBeInTheDocument();
    const pre = container.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toContain('just text');
  });
});
