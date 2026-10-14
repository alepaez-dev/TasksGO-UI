import { createRef, useRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  ActivityComposer,
  type ActivityComposerProps,
} from './ActivityComposer';
import { JORDAN } from '../../utils/activity/testFixtures';

function setup(props: Partial<ActivityComposerProps> = {}) {
  const onSubmit = vi.fn();
  const onModeChange = vi.fn();
  const onChange = vi.fn();
  const onAction = vi.fn();
  const view = render(
    <ActivityComposer
      actor={JORDAN}
      mode="comment"
      value="a draft"
      textareaRef={createRef<HTMLTextAreaElement>()}
      onSubmit={onSubmit}
      onModeChange={onModeChange}
      onChange={onChange}
      onAction={onAction}
      {...props}
    />,
  );
  return {
    onSubmit,
    onModeChange,
    onChange,
    onAction,
    container: view.container,
    rerender: view.rerender,
  };
}

function StagedHarness({
  initial,
  withAttach = true,
}: {
  initial: readonly { id: string; name: string; kind: 'image' | 'file' }[];
  withAttach?: boolean;
}) {
  const [attachments, setAttachments] = useState(initial);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <ActivityComposer
      actor={JORDAN}
      mode="comment"
      value="a draft"
      textareaRef={textareaRef}
      onSubmit={vi.fn()}
      onModeChange={vi.fn()}
      onChange={vi.fn()}
      onAction={vi.fn()}
      onAttach={withAttach ? vi.fn() : undefined}
      attachments={attachments}
      onRemoveAttachment={(id) =>
        setAttachments((prev) => prev.filter((entry) => entry.id !== id))
      }
    />
  );
}

describe('ActivityComposer', () => {
  it('offers the two things you can post as a single choice', () => {
    setup();
    const group = screen.getByRole('radiogroup');
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Comment' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Ask' })).not.toBeChecked();
  });

  it('reports a mode change when the other option is clicked', async () => {
    const { onModeChange } = setup();
    await userEvent.click(screen.getByRole('radio', { name: 'Ask' }));
    expect(onModeChange).toHaveBeenCalledExactlyOnceWith('ask');
  });

  it('selects with the arrow keys, as a radio group must', async () => {
    const { onModeChange } = setup();
    await userEvent.click(screen.getByRole('radio', { name: 'Comment' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(onModeChange).toHaveBeenLastCalledWith('ask');
  });

  it('moves focus with the selection, as the radio pattern requires', async () => {
    setup();
    await userEvent.click(screen.getByRole('radio', { name: 'Comment' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Ask' })).toHaveFocus();
  });

  it('keeps only the selected option in the tab order', () => {
    setup({ mode: 'ask' });
    expect(screen.getByRole('radio', { name: 'Ask' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('radio', { name: 'Comment' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('names the submit button after what it will post', () => {
    setup({ mode: 'ask' });
    expect(screen.getByRole('button', { name: 'Ask' })).toBeInTheDocument();
  });

  it('submits the draft', async () => {
    const { onSubmit } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Comment' }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('submits on the shortcut the hint advertises', async () => {
    const { onSubmit } = setup();
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.keyboard('{Meta>}{Enter}{/Meta}');
    await userEvent.keyboard('{Control>}{Enter}{/Control}');
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it('refuses to post an empty draft from either route', async () => {
    const { onSubmit } = setup({ value: '   ' });
    expect(screen.getByRole('button', { name: 'Comment' })).toBeDisabled();
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.keyboard('{Meta>}{Enter}{/Meta}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('offers attachment only when the caller can handle it', () => {
    setup();
    expect(
      screen.queryByRole('button', { name: 'Attach a file' }),
    ).not.toBeInTheDocument();
  });

  it('hands back the files chosen from the picker', async () => {
    const onAttach = vi.fn();
    const { container } = setup({ onAttach });
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).not.toBeNull();
    if (input === null) return;
    const file = new File(['trace'], 'trace.log', { type: 'text/plain' });
    await userEvent.upload(input, file);
    expect(onAttach).toHaveBeenCalledOnce();
    expect(onAttach.mock.calls[0][0][0]).toBe(file);
  });

  it('opens the picker from the attach button', async () => {
    const onAttach = vi.fn();
    const { container } = setup({ onAttach });
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]');
    const clicked = vi.spyOn(input as HTMLInputElement, 'click');
    await userEvent.click(screen.getByRole('button', { name: /attach/i }));
    expect(clicked).toHaveBeenCalledOnce();
  });

  it('lists attachments files and counts them on the attach button', () => {
    setup({
      onAttach: vi.fn(),
      attachments: [
        { id: 'a1', name: 'one.png', kind: 'image' },
        { id: 'a2', name: 'two.csv', kind: 'file' },
      ],
    });
    expect(screen.getByText('one.png')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /attach/i })).toHaveTextContent(
      '2',
    );
  });

  it('removes the right file when two share a name', async () => {
    const onRemoveAttachment = vi.fn();
    setup({
      onAttach: vi.fn(),
      onRemoveAttachment,
      attachments: [
        { id: 'a1', name: 'same.png', kind: 'image' },
        { id: 'a2', name: 'same.png', kind: 'image' },
      ],
    });
    const removes = screen.getAllByRole('button', { name: 'Remove same.png' });
    expect(removes).toHaveLength(2);
    await userEvent.click(removes[1]);
    expect(onRemoveAttachment).toHaveBeenCalledExactlyOnceWith('a2');
  });

  it('keeps focus on a sibling chip after one is removed', async () => {
    render(
      <StagedHarness
        initial={[
          { id: 'a1', name: 'a.png', kind: 'image' },
          { id: 'a2', name: 'b.log', kind: 'file' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove b.log' }));
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Remove a.png' }),
      ).toHaveFocus(),
    );
  });

  it('falls back to the attach button when the last chip goes', async () => {
    render(
      <StagedHarness
        initial={[{ id: 'a1', name: 'only.png', kind: 'image' }]}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove only.png' }),
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /attach/i })).toHaveFocus(),
    );
  });

  it('names the field for what the mode will post', () => {
    const { rerender } = render(
      <ActivityComposer
        actor={JORDAN}
        mode="comment"
        value=""
        textareaRef={createRef<HTMLTextAreaElement>()}
        onSubmit={vi.fn()}
        onModeChange={vi.fn()}
        onChange={vi.fn()}
        onAction={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('textbox', { name: 'Comment' }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();

    rerender(
      <ActivityComposer
        actor={JORDAN}
        mode="ask"
        value=""
        textareaRef={createRef<HTMLTextAreaElement>()}
        onSubmit={vi.fn()}
        onModeChange={vi.fn()}
        onChange={vi.fn()}
        onAction={vi.fn()}
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Ask' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ask/i)).toBeInTheDocument();
  });

  it('announces how many files are attachments', () => {
    setup({
      onAttach: vi.fn(),
      attachments: [{ id: 'a1', name: 'one.png', kind: 'image' }],
    });
    expect(screen.getByRole('status')).toHaveTextContent('1 file attached');
  });

  it('announces nothing while the composer has no files', () => {
    setup({ onAttach: vi.fn() });
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('falls back to the draft when the last file goes and there is no attach button', async () => {
    render(
      <StagedHarness
        initial={[{ id: 'a1', name: 'only.png', kind: 'image' }]}
        withAttach={false}
      />,
    );
    expect(
      screen.queryByRole('button', { name: /attach/i }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove only.png' }),
    );
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveFocus(),
    );
  });

  it('refuses to post while a file is still uploading', async () => {
    const { onSubmit } = setup({
      onAttach: vi.fn(),
      attachments: [
        { id: 'a1', name: 'done.png', kind: 'image' },
        { id: 'a2', name: 'busy.csv', kind: 'file', uploadFraction: 0.64 },
      ],
    });
    expect(screen.getByRole('button', { name: 'Comment' })).toBeDisabled();
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.keyboard('{Meta>}{Enter}{/Meta}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('posts once every upload has settled', () => {
    setup({
      onAttach: vi.fn(),
      attachments: [{ id: 'a1', name: 'done.png', kind: 'image' }],
    });
    expect(screen.getByRole('button', { name: 'Comment' })).toBeEnabled();
  });

  it('still requires text, so a file on its own cannot be posted', async () => {
    const { onSubmit } = setup({
      value: '',
      onAttach: vi.fn(),
      attachments: [{ id: 'a1', name: 'done.png', kind: 'image' }],
    });
    expect(screen.getByRole('button', { name: 'Comment' })).toBeDisabled();
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.keyboard('{Meta>}{Enter}{/Meta}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows a chip per attachment and none when there are none', () => {
    const { rerender } = setup({ onAttach: vi.fn() });
    expect(screen.queryByText('one.png')).not.toBeInTheDocument();

    rerender(
      <ActivityComposer
        actor={JORDAN}
        mode="comment"
        value="a draft"
        textareaRef={createRef<HTMLTextAreaElement>()}
        onSubmit={vi.fn()}
        onModeChange={vi.fn()}
        onChange={vi.fn()}
        onAction={vi.fn()}
        onAttach={vi.fn()}
        attachments={[{ id: 'a1', name: 'one.png', kind: 'image' }]}
      />,
    );
    expect(screen.getByText('one.png')).toBeInTheDocument();
  });

  it('passes a formatting action through to the caller', async () => {
    const { onAction } = setup();
    await userEvent.click(screen.getByRole('button', { name: /bold/i }));
    expect(onAction).toHaveBeenCalledExactlyOnceWith('bold');
  });

  it('reports what was typed', async () => {
    const { onChange } = setup({ value: '' });
    await userEvent.type(screen.getByRole('textbox'), 'x');
    expect(onChange).toHaveBeenCalledExactlyOnceWith('x');
  });
});
