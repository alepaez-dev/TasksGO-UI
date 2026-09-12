import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PreviewStage } from './PreviewStage';

describe('PreviewStage', () => {
  it('renders an image preview with the label as alt text', () => {
    render(
      <PreviewStage
        file={{
          label: 'socket_log.png',
          kind: 'image',
          url: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
        }}
      />,
    );
    const img = screen.getByRole('img', { name: 'socket_log.png' });
    expect(img).toHaveAttribute(
      'src',
      'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
    );
  });

  it('renders pretty-printed JSON in the text panel', () => {
    render(
      <PreviewStage
        file={{
          label: 'cache_metrics.json',
          kind: 'file',
          text: '{"hits":12}',
        }}
      />,
    );
    expect(screen.getByText(/"hits": 12/)).toBeInTheDocument();
  });

  it('renders markdown through the Markdown component', () => {
    render(
      <PreviewStage
        file={{ label: 'notes.md', kind: 'file', text: '# Cache notes' }}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Cache notes' }),
    ).toBeInTheDocument();
  });

  it('renders plain text files', () => {
    render(
      <PreviewStage
        file={{
          label: 'thread_dump.txt',
          kind: 'file',
          text: 'thread 1 waiting',
        }}
      />,
    );
    expect(screen.getByText('thread 1 waiting')).toBeInTheDocument();
  });

  it('makes scrollable text previews keyboard-focusable named regions', () => {
    render(
      <PreviewStage
        file={{
          label: 'thread_dump.txt',
          kind: 'file',
          text: 'thread 1 waiting',
        }}
      />,
    );
    expect(
      screen.getByRole('region', { name: 'thread_dump.txt' }),
    ).toHaveAttribute('tabindex', '0');
  });

  it('makes scrollable markdown previews keyboard-focusable named regions', () => {
    render(
      <PreviewStage
        file={{ label: 'notes.md', kind: 'file', text: '# Cache notes' }}
      />,
    );
    expect(screen.getByRole('region', { name: 'notes.md' })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  it('renders the fallback card when there is no content', () => {
    render(<PreviewStage file={{ label: 'trace.zip', kind: 'file' }} />);
    expect(screen.getByText('trace.zip')).toBeInTheDocument();
    expect(
      screen.getByText('No preview available for this file.'),
    ).toBeInTheDocument();
  });

  it('renders the fallback card for an image without a url', () => {
    render(<PreviewStage file={{ label: 'screen_02.png', kind: 'image' }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(
      screen.getByText('No preview available for this file.'),
    ).toBeInTheDocument();
  });
});
