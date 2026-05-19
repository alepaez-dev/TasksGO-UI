import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  PipelineStageIndicator,
  type PipelineStage,
} from './PipelineStageIndicator';

const items: readonly PipelineStage[] = [
  { value: 'qa1', label: 'QA1' },
  { value: 'qa2', label: 'QA2' },
  { value: 'prod', label: 'Prod' },
];

describe('PipelineStageIndicator', () => {
  it('renders each visible stage label', () => {
    render(
      <PipelineStageIndicator
        items={items}
        value="qa2"
        aria-label="Environment"
      />,
    );
    expect(screen.getByText('QA1')).toBeInTheDocument();
    expect(screen.getByText('QA2')).toBeInTheDocument();
    expect(screen.getByText('Prod')).toBeInTheDocument();
  });

  it('marks the active stage with aria-current="step"', () => {
    render(
      <PipelineStageIndicator
        items={items}
        value="qa2"
        aria-label="Environment"
      />,
    );
    expect(screen.getByText('QA2')).toHaveAttribute('aria-current', 'step');
  });

  it('does not set aria-current on inactive stages', () => {
    render(
      <PipelineStageIndicator
        items={items}
        value="qa2"
        aria-label="Environment"
      />,
    );
    expect(screen.getByText('QA1')).not.toHaveAttribute('aria-current');
    expect(screen.getByText('Prod')).not.toHaveAttribute('aria-current');
  });

  it('renders no aria-current when value matches no item', () => {
    render(
      <PipelineStageIndicator
        items={items}
        value="nonexistent"
        aria-label="Environment"
      />,
    );
    items.forEach((item) => {
      expect(screen.getByText(item.label)).not.toHaveAttribute('aria-current');
    });
  });

  it('exposes a labelled group role to assistive tech', () => {
    render(
      <PipelineStageIndicator
        items={items}
        value="qa1"
        aria-label="Environment"
      />,
    );
    expect(
      screen.getByRole('group', { name: 'Environment' }),
    ).toBeInTheDocument();
  });

  it('shows all items when items.length is 2', () => {
    const twoItems: readonly PipelineStage[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ];
    render(
      <PipelineStageIndicator items={twoItems} value="a" aria-label="Stages" />,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('shows all items when items.length is 3', () => {
    render(
      <PipelineStageIndicator items={items} value="qa1" aria-label="Stages" />,
    );
    expect(screen.getAllByText(/QA1|QA2|Prod/)).toHaveLength(3);
  });

  it('abbreviates to first + computed middle + last when items.length is 4 and active is first', () => {
    const fourItems: readonly PipelineStage[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D' },
    ];
    render(
      <PipelineStageIndicator
        items={fourItems}
        value="a"
        aria-label="Stages"
      />,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    // Math.floor(4 / 2) = 2 — middle is C
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
  });

  it('abbreviates to first + computed middle + last when items.length is 5 and active is first', () => {
    const fiveItems: readonly PipelineStage[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D' },
      { value: 'e', label: 'E' },
    ];
    render(
      <PipelineStageIndicator
        items={fiveItems}
        value="a"
        aria-label="Stages"
      />,
    );
    // Math.floor(5 / 2) = 2 — middle is C
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('abbreviates to first + computed middle + last when items.length is 6 and active is first', () => {
    const sixItems: readonly PipelineStage[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D' },
      { value: 'e', label: 'E' },
      { value: 'f', label: 'F' },
    ];
    render(
      <PipelineStageIndicator items={sixItems} value="a" aria-label="Stages" />,
    );
    // Math.floor(6 / 2) = 3 — middle is D
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
  });

  it('puts the active item in the middle slot when it would otherwise be hidden (length=5, active=B)', () => {
    const fiveItems: readonly PipelineStage[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D' },
      { value: 'e', label: 'E' },
    ];
    render(
      <PipelineStageIndicator
        items={fiveItems}
        value="b"
        aria-label="Stages"
      />,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
    expect(screen.queryByText('D')).not.toBeInTheDocument();
    expect(screen.getByText('B')).toHaveAttribute('aria-current', 'step');
  });

  it('puts the active item in the middle slot when it would otherwise be hidden (length=5, active=D)', () => {
    const fiveItems: readonly PipelineStage[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D' },
      { value: 'e', label: 'E' },
    ];
    render(
      <PipelineStageIndicator
        items={fiveItems}
        value="d"
        aria-label="Stages"
      />,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
    expect(screen.getByText('D')).toHaveAttribute('aria-current', 'step');
  });

  it('keeps the default middle when the active item is the first', () => {
    const fiveItems: readonly PipelineStage[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D' },
      { value: 'e', label: 'E' },
    ];
    render(
      <PipelineStageIndicator
        items={fiveItems}
        value="a"
        aria-label="Stages"
      />,
    );
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('A')).toHaveAttribute('aria-current', 'step');
  });

  it('keeps the default middle when the active item is the last', () => {
    const fiveItems: readonly PipelineStage[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D' },
      { value: 'e', label: 'E' },
    ];
    render(
      <PipelineStageIndicator
        items={fiveItems}
        value="e"
        aria-label="Stages"
      />,
    );
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('E')).toHaveAttribute('aria-current', 'step');
  });

  it('renders no stage labels when items is empty', () => {
    const { container } = render(
      <PipelineStageIndicator items={[]} value="" aria-label="Stages" />,
    );
    expect(screen.getByRole('group', { name: 'Stages' })).toBeInTheDocument();
    // No stage spans rendered — only the root div
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  it('renders a single stage with no separator when items.length is 1', () => {
    render(
      <PipelineStageIndicator
        items={[{ value: 'only', label: 'Only' }]}
        value="only"
        aria-label="Stages"
      />,
    );
    expect(screen.getByText('Only')).toBeInTheDocument();
    expect(screen.getByText('Only')).toHaveAttribute('aria-current', 'step');
  });

  it('sets aria-disabled on disabled stages', () => {
    const withDisabled: readonly PipelineStage[] = [
      { value: 'qa1', label: 'QA1' },
      { value: 'qa2', label: 'QA2', disabled: true },
      { value: 'prod', label: 'Prod' },
    ];
    render(
      <PipelineStageIndicator
        items={withDisabled}
        value="qa1"
        aria-label="Stages"
      />,
    );
    expect(screen.getByText('QA2')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('QA1')).not.toHaveAttribute('aria-disabled');
  });

  it('renders no buttons or interactive elements', () => {
    render(
      <PipelineStageIndicator
        items={items}
        value="qa2"
        aria-label="Environment"
      />,
    );
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PipelineStageIndicator
        ref={ref}
        items={items}
        value="qa1"
        aria-label="Environment"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(
      <PipelineStageIndicator
        items={items}
        value="qa1"
        aria-label="Environment"
        className="custom"
      />,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('spreads additional HTML attributes onto the root element', () => {
    render(
      <PipelineStageIndicator
        items={items}
        value="qa1"
        aria-label="Environment"
        data-testid="pipeline"
      />,
    );
    expect(screen.getByTestId('pipeline')).toBeInTheDocument();
  });
});
