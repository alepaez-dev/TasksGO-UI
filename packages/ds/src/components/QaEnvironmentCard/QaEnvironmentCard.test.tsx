import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { stubStacked } from '../../test-helpers';
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  QaEnvironmentCard,
  type QaEnvironmentOption,
} from './QaEnvironmentCard';

afterEach(() => {
  vi.unstubAllGlobals();
});

const envs: readonly QaEnvironmentOption[] = [
  {
    value: 'qa1',
    label: 'QA-01',
    reviewStatus: 'In review',
    lastDeployment: '24 mins ago',
    healthVariant: 'high',
    pipelineLabel: 'Unstable',
    pipelineVariant: 'high',
  },
  {
    value: 'qa2',
    label: 'QA-02',
    reviewStatus: 'Signed off',
    lastDeployment: '2 hours ago',
    healthVariant: 'active',
    pipelineLabel: 'Stable',
    pipelineVariant: 'active',
  },
];

const base = {
  environments: envs,
  activeValue: 'qa1',
  onValueChange: () => {},
  switcherOpen: false,
  onSwitcherOpenChange: () => {},
};

describe('QaEnvironmentCard', () => {
  it('renders nothing when there are no environments', () => {
    const { container } = render(
      <QaEnvironmentCard {...base} environments={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders no promote button without a label', () => {
    const { rerender } = render(<QaEnvironmentCard {...base} />);
    const withoutPromote = screen.getAllByRole('button').length;

    rerender(
      <QaEnvironmentCard
        {...base}
        promote={{ label: 'Promote to Staging', onClick: () => {} }}
      />,
    );
    expect(screen.getAllByRole('button')).toHaveLength(withoutPromote + 1);
    expect(
      screen.getByRole('button', { name: /Promote to Staging/ }),
    ).toBeInTheDocument();
  });

  it('renders the promote button and emits onPromote', async () => {
    const onPromote = vi.fn();
    render(
      <QaEnvironmentCard
        {...base}
        promote={{ label: 'Promote to Staging', onClick: onPromote }}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Promote to Staging/ }),
    );
    expect(onPromote).toHaveBeenCalledTimes(1);
  });

  it('tints the desktop pipeline status with the active variant', () => {
    const { rerender } = render(<QaEnvironmentCard {...base} />);
    expect(screen.getByText('Unstable')).toHaveClass('pipelineValue', 'high');

    rerender(<QaEnvironmentCard {...base} activeValue="qa2" />);
    expect(screen.getByText('Stable')).toHaveClass('pipelineValue', 'active');
  });

  it('falls back to the first environment when activeValue matches none', () => {
    render(<QaEnvironmentCard {...base} activeValue="nope" />);
    expect(
      screen.getByRole('button', { name: /Environment: QA-01/ }),
    ).toBeInTheDocument();
  });

  it('opens the switcher from the card when stacked', async () => {
    stubStacked();
    const onSwitcherOpenChange = vi.fn();
    render(
      <QaEnvironmentCard
        {...base}
        onSwitcherOpenChange={onSwitcherOpenChange}
      />,
    );

    expect(screen.getByText('QA-01')).toBeInTheDocument();
    expect(
      screen.getByText(/Last deployment: 24 mins ago/),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: /Switch environment/ }),
    );
    expect(onSwitcherOpenChange).toHaveBeenCalledWith(true);
  });

  it('lists environments in the sheet and emits the selection', async () => {
    stubStacked();
    const onValueChange = vi.fn();
    render(
      <QaEnvironmentCard
        {...base}
        switcherOpen
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole('option', { name: /QA-02/ }));
    expect(onValueChange).toHaveBeenCalledWith('qa2');
  });

  it('names the stacked trigger with the active environment', () => {
    stubStacked();
    render(<QaEnvironmentCard {...base} />);
    expect(screen.getByRole('button', { name: /QA-01/ })).toBeInTheDocument();
  });

  it('shows the pipeline status beside the dot when stacked', () => {
    stubStacked();
    render(<QaEnvironmentCard {...base} />);
    expect(screen.getByText('Unstable')).toBeInTheDocument();
    expect(screen.queryByText('In review')).not.toBeInTheDocument();
  });

  it('does not repeat the pipeline status to assistive tech', () => {
    stubStacked();
    render(<QaEnvironmentCard {...base} />);
    expect(screen.getByText('Unstable')).toBeInTheDocument();
    expect(
      screen.queryByRole('img', { name: /Unstable/ }),
    ).not.toBeInTheDocument();
  });

  it('offers Manage environments in the sheet like the wide dropdown does', () => {
    stubStacked();
    render(
      <QaEnvironmentCard
        {...base}
        switcherOpen
        onManageEnvironments={() => {}}
      />,
    );
    expect(
      screen.getByRole('button', { name: /Manage environments/ }),
    ).toBeInTheDocument();
  });

  it('omits Manage environments when no handler is given', () => {
    stubStacked();
    render(<QaEnvironmentCard {...base} switcherOpen />);
    expect(
      screen.queryByRole('button', { name: /Manage environments/ }),
    ).not.toBeInTheDocument();
  });

  it('emits onManageEnvironments from the sheet and closes it', async () => {
    stubStacked();
    const onManageEnvironments = vi.fn();
    const onSwitcherOpenChange = vi.fn();
    render(
      <QaEnvironmentCard
        {...base}
        switcherOpen
        onManageEnvironments={onManageEnvironments}
        onSwitcherOpenChange={onSwitcherOpenChange}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Manage environments/ }),
    );
    expect(onManageEnvironments).toHaveBeenCalledTimes(1);
    expect(onSwitcherOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders the promote button when stacked', async () => {
    stubStacked();
    const onPromote = vi.fn();
    render(
      <QaEnvironmentCard
        {...base}
        promote={{ label: 'Promote to Staging', onClick: onPromote }}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Promote to Staging/ }),
    );
    expect(onPromote).toHaveBeenCalledTimes(1);
  });
});
