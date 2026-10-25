import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CommentCard } from './CommentCard';
import { ALEX, JORDAN, reply } from '../../utils/activity/testFixtures';

const replies = [
  { ...reply(ALEX, 30, { body: 'Go with fan-out.' }), timestamp: '1h ago' },
];

const base = {
  actor: JORDAN,
  body: 'Looking into **edge-caching**.',
  timestamp: '4h ago',
} as const;

describe('CommentCard', () => {
  it('renders as a list item so it sits in the feed', () => {
    const { container } = render(<CommentCard kind="comment" {...base} />);
    expect(container.querySelector('li')).toBeInTheDocument();
  });

  it('renders the author, the timestamp and the body as markdown', () => {
    render(<CommentCard kind="comment" {...base} />);
    expect(screen.getByText('Jordan D.')).toBeInTheDocument();
    expect(screen.getByText('4h ago')).toBeInTheDocument();
    expect(screen.getByText('edge-caching').tagName).toBe('STRONG');
  });

  it('highlights a search term in the body', () => {
    const { container } = render(
      <CommentCard kind="comment" {...base} query="caching" />,
    );
    expect(container.querySelector('mark')).toHaveTextContent('caching');
  });

  it('highlights a search term in the author name', () => {
    render(<CommentCard kind="comment" {...base} query="jordan" />);
    const marks = screen.getAllByText(
      (_, el) => el?.tagName === 'MARK' && /jordan/i.test(el.textContent ?? ''),
    );
    expect(marks.length).toBeGreaterThan(0);
  });

  it('labels a comment and an ask differently', () => {
    const { rerender } = render(<CommentCard kind="comment" {...base} />);
    expect(screen.getByText('Comment')).toBeInTheDocument();
    rerender(<CommentCard kind="ask" {...base} />);
    expect(screen.getByText('Asked')).toBeInTheDocument();
    expect(screen.queryByText('Comment')).not.toBeInTheDocument();
  });

  it('names who answered an ask', () => {
    render(<CommentCard kind="ask" {...base} answeredBy={ALEX} />);
    expect(screen.getByText('Answered')).toBeInTheDocument();
    expect(screen.getByText(/Answered by Alex M\./)).toBeInTheDocument();
  });

  it('offers to resolve an open ask', async () => {
    const onMarkAnswered = vi.fn();
    render(
      <CommentCard kind="ask" {...base} onMarkAnswered={onMarkAnswered} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Mark as answered' }),
    );
    expect(onMarkAnswered).toHaveBeenCalledOnce();
  });

  it('does not offer to resolve an ask that is already answered', () => {
    render(
      <CommentCard
        kind="ask"
        {...base}
        answeredBy={ALEX}
        onMarkAnswered={vi.fn()}
      />,
    );
    expect(
      screen.queryByRole('button', { name: 'Mark as answered' }),
    ).not.toBeInTheDocument();
  });

  it('reports a reply request', async () => {
    const onReply = vi.fn();
    render(<CommentCard kind="comment" {...base} onReply={onReply} />);
    await userEvent.click(screen.getByRole('button', { name: /reply/i }));
    expect(onReply).toHaveBeenCalledOnce();
  });

  it('renders the reply thread', () => {
    render(<CommentCard kind="comment" {...base} replies={replies} />);
    const thread = screen.getByRole('list', { name: 'Replies' });
    expect(within(thread).getByText('Alex M.')).toBeInTheDocument();
    expect(within(thread).getByText('Go with fan-out.')).toBeInTheDocument();
  });

  it('shows the reply time the caller formatted, never a raw timestamp', () => {
    render(<CommentCard kind="comment" {...base} replies={replies} />);
    const thread = screen.getByRole('list', { name: 'Replies' });
    expect(within(thread).getByText('1h ago')).toBeInTheDocument();
    expect(within(thread).queryByText(/\d{4}-\d{2}-\d{2}T/)).toBeNull();
  });

  it('renders no thread when there are no replies', () => {
    render(<CommentCard kind="comment" {...base} />);
    expect(
      screen.queryByRole('list', { name: 'Replies' }),
    ).not.toBeInTheDocument();
  });

  it('shows reactions and reports a toggle', async () => {
    const onToggleReaction = vi.fn();
    render(
      <CommentCard
        kind="comment"
        {...base}
        reactions={[
          {
            emoji: '👍',
            count: 2,
            reactedByViewer: false,
            actors: [
              { id: 'sk', name: 'Sam K.' },
              { id: 'am', name: 'Alex M.' },
            ],
          },
        ]}
        onToggleReaction={onToggleReaction}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /👍/ }));
    expect(onToggleReaction).toHaveBeenCalledExactlyOnceWith('👍');
  });

  it('lists the files attached to the comment', () => {
    render(
      <CommentCard
        kind="comment"
        {...base}
        attachments={[
          { id: 'a1', name: 'cache-hit-ratio-grafana.png', kind: 'image' },
          { id: 'a2', name: 'SNS-invalidation-RFC.pdf', kind: 'file' },
        ]}
      />,
    );
    expect(screen.getByText('cache-hit-ratio-grafana.png')).toBeInTheDocument();
    expect(screen.getByText('SNS-invalidation-RFC.pdf')).toBeInTheDocument();
  });

  it('shows a chip per attachment and none when there are none', () => {
    const { rerender } = render(<CommentCard kind="comment" {...base} />);
    expect(screen.queryByText('one.png')).not.toBeInTheDocument();

    rerender(
      <CommentCard
        kind="comment"
        {...base}
        attachments={[{ id: 'a1', name: 'one.png', kind: 'image' }]}
      />,
    );
    expect(screen.getByText('one.png')).toBeInTheDocument();
  });

  it('reports which attachment was opened', async () => {
    const onOpenAttachment = vi.fn();
    render(
      <CommentCard
        kind="comment"
        {...base}
        attachments={[
          { id: 'a1', name: 'one.png', kind: 'image' },
          { id: 'a2', name: 'two.pdf', kind: 'file' },
        ]}
        onOpenAttachment={onOpenAttachment}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /two\.pdf/ }));
    expect(onOpenAttachment).toHaveBeenCalledExactlyOnceWith('a2');
  });

  it('offers a pin button when the caller can handle pinning', async () => {
    const onPin = vi.fn();
    render(<CommentCard kind="comment" {...base} onPin={onPin} />);
    await userEvent.click(screen.getByRole('button', { name: /pin/i }));
    expect(onPin).toHaveBeenCalledOnce();
  });

  it('names the pin button by its author, not by the whole comment', () => {
    render(<CommentCard kind="comment" {...base} onPin={vi.fn()} />);
    const pin = screen.getByRole('button', { name: /^Pin/ });
    const name = pin.getAttribute('aria-label') ?? '';
    expect(name).toBe('Pin comment by Jordan D.');
    expect(name).not.toContain('edge-caching');
  });

  it('says ask, not comment, when pinning an ask', () => {
    render(<CommentCard kind="ask" {...base} onPin={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Pin ask by Jordan D.' }),
    ).toBeInTheDocument();
  });

  it('marks only the mention handles the caller knows', () => {
    const { container } = render(
      <CommentCard
        kind="comment"
        {...base}
        body="ping @jordan about @tasksgo"
        mentions={['jordan']}
      />,
    );
    expect(
      [...container.querySelectorAll('.mention')].map((n) => n.textContent),
    ).toEqual(['@jordan']);
  });

  it('carries no pin control once pinned, because unpinning lives in the toolbar', () => {
    render(<CommentCard kind="comment" {...base} pinned />);
    expect(
      screen.queryByRole('button', { name: /pin/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Pinned')).toBeInTheDocument();
  });
});
