import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecentTaskList } from './RecentTaskList';

const items = [
  { ticketId: 'TSK-104', title: 'Implement cache logic', timeAgo: '2h ago' },
  { ticketId: 'TSK-105', title: 'Update staging config', timeAgo: '1d ago' },
];

describe('RecentTaskList', () => {
  it('renders as a semantic list', () => {
    render(<RecentTaskList items={items} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders all items', () => {
    render(<RecentTaskList items={items} />);
    expect(screen.getByText('TSK-104')).toBeInTheDocument();
    expect(screen.getByText('Implement cache logic')).toBeInTheDocument();
    expect(screen.getByText('2h ago')).toBeInTheDocument();
    expect(screen.getByText('TSK-105')).toBeInTheDocument();
    expect(screen.getByText('Update staging config')).toBeInTheDocument();
    expect(screen.getByText('1d ago')).toBeInTheDocument();
  });

  it('renders empty when items is empty', () => {
    const { container } = render(<RecentTaskList items={[]} />);
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLUListElement | null>;
    render(<RecentTaskList ref={ref} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });

  it('merges custom className', () => {
    const { container } = render(
      <RecentTaskList items={items} className="custom" />,
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});
