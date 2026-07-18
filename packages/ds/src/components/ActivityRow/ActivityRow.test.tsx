import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ActivityRow } from './ActivityRow';

describe('ActivityRow', () => {
  it('renders the primary/title content', () => {
    render(
      <ul>
        <ActivityRow icon="call_merge">Add dark-mode toggle</ActivityRow>
      </ul>,
    );
    expect(screen.getByText('Add dark-mode toggle')).toBeInTheDocument();
  });

  it('renders as a list item', () => {
    const { container } = render(
      <ul>
        <ActivityRow icon="call_merge">Title</ActivityRow>
      </ul>,
    );
    expect(container.querySelector('li')).toBeInTheDocument();
  });

  it('renders the leading icon', () => {
    const { container } = render(
      <ul>
        <ActivityRow icon="call_merge">Title</ActivityRow>
      </ul>,
    );
    expect(
      container.querySelector('[data-icon-name="call_merge"]'),
    ).toBeInTheDocument();
  });

  it('applies the neutral tone class by default', () => {
    const { container } = render(
      <ul>
        <ActivityRow icon="call_merge">Title</ActivityRow>
      </ul>,
    );
    expect(container.querySelector('.toneNeutral')).toBeInTheDocument();
  });

  it('applies the given tone class', () => {
    const { container } = render(
      <ul>
        <ActivityRow icon="call_merge" tone="success">
          Title
        </ActivityRow>
      </ul>,
    );
    expect(container.querySelector('.toneSuccess')).toBeInTheDocument();
  });

  it('renders meta items with a separator only between them', () => {
    const { container } = render(
      <ul>
        <ActivityRow icon="code" meta={['#142', 'alex', '2h ago']}>
          Title
        </ActivityRow>
      </ul>,
    );
    const metaLine = container.querySelector('.meta');
    expect(metaLine).toHaveTextContent('#142');
    expect(metaLine).toHaveTextContent('alex');
    expect(metaLine).toHaveTextContent('2h ago');
    // 3 items -> 2 separators between them (the · nodes are aria-hidden)
    expect(screen.getAllByText('·')).toHaveLength(2);
  });

  it('omits the meta line when meta is absent', () => {
    const { container } = render(
      <ul>
        <ActivityRow icon="code">Title</ActivityRow>
      </ul>,
    );
    expect(container.querySelector('.meta')).not.toBeInTheDocument();
  });

  it('omits the meta line when meta is empty', () => {
    const { container } = render(
      <ul>
        <ActivityRow icon="code" meta={[]}>
          Title
        </ActivityRow>
      </ul>,
    );
    expect(container.querySelector('.meta')).not.toBeInTheDocument();
  });

  it('renders the trailing slot', () => {
    render(
      <ul>
        <ActivityRow icon="call_merge" trailing={<span>badge</span>}>
          Title
        </ActivityRow>
      </ul>,
    );
    expect(screen.getByText('badge')).toBeInTheDocument();
  });

  it('omits the trailing slot when absent', () => {
    const { container } = render(
      <ul>
        <ActivityRow icon="call_merge">Title</ActivityRow>
      </ul>,
    );
    expect(container.querySelector('.trailing')).not.toBeInTheDocument();
  });

  it('forwards ref to the li element', () => {
    const ref = createRef<HTMLLIElement>();
    render(
      <ul>
        <ActivityRow ref={ref} icon="call_merge">
          Title
        </ActivityRow>
      </ul>,
    );
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });
});
