import { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMarkdownEditor } from './useMarkdownEditor';

function Harness({
  onImageUpload,
  files = [],
  initialValue = '',
}: {
  onImageUpload?: (file: File) => Promise<string>;
  files?: readonly File[];
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const { wordCount, isUploading, textareaRef, applyAction, insertImageFiles } =
    useMarkdownEditor({ value, setValue, onImageUpload });
  return (
    <div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="editor"
      />
      <button onClick={() => applyAction('bold')}>bold</button>
      <button onClick={() => applyAction('heading')}>heading</button>
      <button onClick={() => applyAction('link')}>link</button>
      <button onClick={() => insertImageFiles(files)}>upload</button>
      <output data-testid="words">{wordCount}</output>
      <output data-testid="uploading">{String(isUploading)}</output>
    </div>
  );
}

const select = (start: number, end: number) => {
  const ta = screen.getByLabelText<HTMLTextAreaElement>('editor');
  ta.setSelectionRange(start, end);
  return ta;
};

describe('useMarkdownEditor', () => {
  it('wraps the selected text when a toolbar action fires', () => {
    render(<Harness initialValue="hello world" />);
    select(0, 5);
    fireEvent.click(screen.getByText('bold'));
    expect(screen.getByLabelText<HTMLTextAreaElement>('editor').value).toBe(
      '**hello** world',
    );
  });

  it('prefixes the current line for a heading', () => {
    render(<Harness initialValue="Title" />);
    select(0, 0);
    fireEvent.click(screen.getByText('heading'));
    expect(screen.getByLabelText<HTMLTextAreaElement>('editor').value).toBe(
      '## Title',
    );
  });

  it('inserts a link skeleton', () => {
    render(<Harness />);
    select(0, 0);
    fireEvent.click(screen.getByText('link'));
    expect(screen.getByLabelText<HTMLTextAreaElement>('editor').value).toBe(
      '[text](url)',
    );
  });

  it('derives a word count from the value', () => {
    render(<Harness initialValue="one two three" />);
    expect(screen.getByTestId('words').textContent).toBe('3');
  });

  it('inserts an uploading placeholder then swaps in the uploaded url', async () => {
    const onImageUpload = vi.fn().mockResolvedValue('https://cdn/x.png');
    const file = new File(['x'], 'vader.png', { type: 'image/png' });
    render(<Harness onImageUpload={onImageUpload} files={[file]} />);
    fireEvent.click(screen.getByText('upload'));

    const ta = screen.getByLabelText<HTMLTextAreaElement>('editor');
    expect(ta.value).toContain('Uploading vader.png');
    await waitFor(() =>
      expect(ta.value).toContain('![vader](https://cdn/x.png)'),
    );
    expect(ta.value).not.toContain('Uploading');
    expect(screen.getByTestId('uploading').textContent).toBe('false');
  });

  it('inserts the uploaded url verbatim even when it contains $ patterns', async () => {
    const url = 'https://cdn/x.png?sig=$&a$$b';
    const onImageUpload = vi.fn().mockResolvedValue(url);
    const file = new File(['x'], 'vader.png', { type: 'image/png' });
    render(<Harness onImageUpload={onImageUpload} files={[file]} />);
    fireEvent.click(screen.getByText('upload'));
    const ta = screen.getByLabelText<HTMLTextAreaElement>('editor');
    await waitFor(() => expect(ta.value).toContain(`(${url})`));
  });

  it('removes the placeholder when the upload fails', async () => {
    const onImageUpload = vi.fn().mockRejectedValue(new Error('nope'));
    const file = new File(['x'], 'broken.png', { type: 'image/png' });
    render(<Harness onImageUpload={onImageUpload} files={[file]} />);
    fireEvent.click(screen.getByText('upload'));
    await waitFor(() =>
      expect(
        screen.getByLabelText<HTMLTextAreaElement>('editor').value,
      ).not.toContain('Uploading'),
    );
  });
});
