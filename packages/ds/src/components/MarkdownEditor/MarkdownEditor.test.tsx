import { useState, createRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MarkdownEditor } from './MarkdownEditor';
import { useMarkdownEditor } from '../../hooks/useMarkdownEditor';

function Harness({
  initialValue = '',
  withUpload = false,
  status,
}: {
  initialValue?: string;
  withUpload?: boolean;
  status?: 'idle' | 'saving' | 'saved';
}) {
  const [value, setValue] = useState(initialValue);
  const onImageUpload = withUpload
    ? () => Promise.resolve('https://cdn/vader.png')
    : undefined;
  const { wordCount, isUploading, textareaRef, applyAction, insertImageFiles } =
    useMarkdownEditor({ value, setValue, onImageUpload });
  return (
    <MarkdownEditor
      value={value}
      onChange={setValue}
      textareaRef={textareaRef}
      onAction={applyAction}
      wordCount={wordCount}
      status={status}
      isUploading={isUploading}
      onInsertImageFiles={onImageUpload ? insertImageFiles : undefined}
    />
  );
}

const pngFile = () => new File(['x'], 'pic.png', { type: 'image/png' });

describe('MarkdownEditor', () => {
  it('renders the formatting toolbar and the markdown textarea', () => {
    render(<Harness />);
    expect(
      screen.getByRole('toolbar', { name: 'Formatting' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Markdown' }),
    ).toBeInTheDocument();
  });

  it('renders the optional header slot', () => {
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
        textareaRef={createRef<HTMLTextAreaElement>()}
        onAction={() => {}}
        wordCount={0}
        header={<span>mode toggle</span>}
      />,
    );
    expect(screen.getByText('mode toggle')).toBeInTheDocument();
  });

  it('has no Write/Preview tabs and keeps the toolbar enabled', () => {
    render(<Harness initialValue="# Hi" />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bold' })).toBeEnabled();
  });

  it('shows a live word count', () => {
    render(<Harness />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Markdown' }), {
      target: { value: 'hello brave world' },
    });
    expect(screen.getByText('3 words')).toBeInTheDocument();
  });

  it('prepends the saved status as a live region, with the word count separate', () => {
    render(<Harness initialValue="one" status="saved" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    expect(screen.getByText('1 word')).toBeInTheDocument();
  });

  it('applies a toolbar action to the textarea selection', () => {
    render(<Harness initialValue="hello" />);
    const ta = screen.getByRole<HTMLTextAreaElement>('textbox', {
      name: 'Markdown',
    });
    ta.setSelectionRange(0, 5);
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(ta.value).toBe('**hello**');
  });

  it('opens the file picker when the image button is clicked (upload enabled)', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');
    render(<Harness withUpload />);
    fireEvent.click(screen.getByRole('button', { name: 'Image' }));
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('inserts an image skeleton when the image button is clicked (no upload)', () => {
    render(<Harness />);
    const ta = screen.getByRole<HTMLTextAreaElement>('textbox', {
      name: 'Markdown',
    });
    ta.setSelectionRange(0, 0);
    fireEvent.click(screen.getByRole('button', { name: 'Image' }));
    expect(ta.value).toBe('![alt](url)');
  });

  it('focuses the textarea and runs the upload flow on a dropped image', async () => {
    render(<Harness withUpload />);
    const ta = screen.getByRole<HTMLTextAreaElement>('textbox', {
      name: 'Markdown',
    });
    fireEvent.drop(ta, { dataTransfer: { files: [pngFile()] } });
    expect(ta).toHaveFocus();
    expect(ta.value).toContain('Uploading pic.png');
    expect(screen.getByRole('status')).toHaveTextContent('Uploading…');
    await waitFor(() => expect(ta.value).toContain('https://cdn/vader.png'));
  });

  it('does not hijack a non-image paste', () => {
    const onInsert = vi.fn();
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
        textareaRef={createRef<HTMLTextAreaElement>()}
        onAction={() => {}}
        wordCount={0}
        onInsertImageFiles={onInsert}
      />,
    );
    fireEvent.paste(screen.getByRole('textbox', { name: 'Markdown' }), {
      clipboardData: { files: [] },
    });
    expect(onInsert).not.toHaveBeenCalled();
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <div>
        <MarkdownEditor
          ref={ref}
          value=""
          onChange={() => {}}
          textareaRef={createRef<HTMLTextAreaElement>()}
          onAction={() => {}}
          wordCount={0}
          className="custom"
        />
      </div>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.querySelector('.custom')).not.toBeNull();
  });
});
