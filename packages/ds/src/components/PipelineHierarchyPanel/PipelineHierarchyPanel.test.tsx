import { createRef } from 'react';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  PipelineHierarchyPanel,
  type PipelineHierarchyStage,
} from './PipelineHierarchyPanel';

type PointerEventName = 'pointerDown' | 'pointerMove' | 'pointerUp';

function firePointer(
  target: Element,
  type: PointerEventName,
  props: {
    clientY: number;
    clientX?: number;
    button?: number;
    pointerId?: number;
  },
) {
  const event = createEvent[type](target);
  for (const [key, value] of Object.entries(props)) {
    Object.defineProperty(event, key, { get: () => value });
  }
  fireEvent(target, event);
}

const stages: readonly PipelineHierarchyStage[] = [
  { value: 'qa1', label: 'QA1', status: 'success' },
  { value: 'qa2', label: 'QA2', status: 'in-progress' },
  { value: 'staging', label: 'Staging', status: 'idle' },
  { value: 'prod', label: 'Prod', status: 'idle' },
];

const ROW_HEIGHT = 40;

function mockRowRects(container: HTMLElement) {
  const rows = container.querySelectorAll('li');
  rows.forEach((row, i) => {
    Object.defineProperty(row, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        top: i * ROW_HEIGHT,
        bottom: i * ROW_HEIGHT + ROW_HEIGHT,
        left: 0,
        right: 200,
        width: 200,
        height: ROW_HEIGHT,
        x: 0,
        y: i * ROW_HEIGHT,
        toJSON: () => ({}),
      }),
    });
  });
}

function midOf(index: number) {
  return index * ROW_HEIGHT + ROW_HEIGHT / 2;
}

describe('PipelineHierarchyPanel', () => {
  it('renders the title and each stage label', () => {
    render(
      <PipelineHierarchyPanel title="Pipeline Hierarchy" stages={stages} />,
    );
    expect(screen.getByText('Pipeline Hierarchy')).toBeInTheDocument();
    stages.forEach((stage) => {
      expect(screen.getByText(stage.label)).toBeInTheDocument();
    });
  });

  it('renders the reorder hint when provided', () => {
    render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        reorderHint="Drag to reorder"
      />,
    );
    expect(screen.getByText('Drag to reorder')).toBeInTheDocument();
  });

  it('marks the active stage with aria-current="true"', () => {
    render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        activeValue="qa2"
        onSelect={() => {}}
      />,
    );
    const activeButton = screen.getByRole('button', {
      name: /QA2/,
    });
    expect(activeButton).toHaveAttribute('aria-current', 'true');
  });

  it('fires onSelect when a row is clicked', () => {
    const onSelect = vi.fn();
    render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /QA2/ }));
    expect(onSelect).toHaveBeenCalledWith('qa2');
  });

  it('renders no row buttons when onSelect is omitted', () => {
    render(
      <PipelineHierarchyPanel title="Pipeline Hierarchy" stages={stages} />,
    );
    expect(
      screen.queryByRole('button', { name: /QA1/ }),
    ).not.toBeInTheDocument();
  });

  it('does not render drag handles when onReorder is omitted', () => {
    render(
      <PipelineHierarchyPanel title="Pipeline Hierarchy" stages={stages} />,
    );
    expect(
      screen.queryByRole('button', { name: /Reorder/ }),
    ).not.toBeInTheDocument();
  });

  it('renders a drag handle per row when onReorder is provided', () => {
    render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        onReorder={() => {}}
      />,
    );
    expect(screen.getAllByRole('button', { name: /Reorder/ })).toHaveLength(
      stages.length,
    );
  });

  it('reorders downward: dragging row 0 past row 2 places it after row 2', () => {
    const onReorder = vi.fn();
    const { container } = render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        onReorder={onReorder}
      />,
    );
    mockRowRects(container);
    const handles = screen.getAllByRole('button', { name: /Reorder/ });

    firePointer(handles[0], 'pointerDown', {
      button: 0,
      pointerId: 1,
      clientX: 10,
      clientY: midOf(0),
    });
    firePointer(handles[0], 'pointerMove', {
      pointerId: 1,
      clientX: 10,
      clientY: midOf(2),
    });
    firePointer(handles[0], 'pointerUp', {
      pointerId: 1,
      clientX: 10,
      clientY: midOf(2),
    });

    expect(onReorder).toHaveBeenCalledTimes(1);
    const newOrder = onReorder.mock.calls[0][0] as PipelineHierarchyStage[];
    expect(newOrder.map((s) => s.value)).toEqual([
      'qa2',
      'staging',
      'qa1',
      'prod',
    ]);
  });

  it('reorders upward: dragging row 3 onto row 1 places it before row 1', () => {
    const onReorder = vi.fn();
    const { container } = render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        onReorder={onReorder}
      />,
    );
    mockRowRects(container);
    const handles = screen.getAllByRole('button', { name: /Reorder/ });

    firePointer(handles[3], 'pointerDown', {
      button: 0,
      pointerId: 1,
      clientX: 10,
      clientY: midOf(3),
    });
    firePointer(handles[3], 'pointerMove', {
      pointerId: 1,
      clientX: 10,
      clientY: midOf(1),
    });
    firePointer(handles[3], 'pointerUp', {
      pointerId: 1,
      clientX: 10,
      clientY: midOf(1),
    });

    expect(onReorder).toHaveBeenCalledTimes(1);
    const newOrder = onReorder.mock.calls[0][0] as PipelineHierarchyStage[];
    expect(newOrder.map((s) => s.value)).toEqual([
      'qa1',
      'prod',
      'qa2',
      'staging',
    ]);
  });

  it('does not fire onReorder when releasing on the source row', () => {
    const onReorder = vi.fn();
    const { container } = render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        onReorder={onReorder}
      />,
    );
    mockRowRects(container);
    const handles = screen.getAllByRole('button', { name: /Reorder/ });

    firePointer(handles[1], 'pointerDown', {
      button: 0,
      pointerId: 1,
      clientX: 10,
      clientY: midOf(1),
    });
    firePointer(handles[1], 'pointerMove', {
      pointerId: 1,
      clientX: 10,
      clientY: midOf(1),
    });
    firePointer(handles[1], 'pointerUp', {
      pointerId: 1,
      clientX: 10,
      clientY: midOf(1),
    });

    expect(onReorder).not.toHaveBeenCalled();
  });

  it('cancels the drag on Escape without firing onReorder', () => {
    const onReorder = vi.fn();
    const { container } = render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        onReorder={onReorder}
      />,
    );
    mockRowRects(container);
    const handles = screen.getAllByRole('button', { name: /Reorder/ });

    firePointer(handles[0], 'pointerDown', {
      button: 0,
      pointerId: 1,
      clientX: 10,
      clientY: midOf(0),
    });
    firePointer(handles[0], 'pointerMove', {
      pointerId: 1,
      clientX: 10,
      clientY: midOf(2),
    });
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onReorder).not.toHaveBeenCalled();
  });

  it('fires onReorder on Alt+ArrowUp on the drag handle', () => {
    const onReorder = vi.fn();
    render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        onReorder={onReorder}
      />,
    );
    const handles = screen.getAllByRole('button', { name: /Reorder/ });
    fireEvent.keyDown(handles[2], { key: 'ArrowUp', altKey: true });
    expect(onReorder).toHaveBeenCalledTimes(1);
    const newOrder = onReorder.mock.calls[0][0] as PipelineHierarchyStage[];
    expect(newOrder.map((s) => s.value)).toEqual([
      'qa1',
      'staging',
      'qa2',
      'prod',
    ]);
  });

  it('fires onReorder on Alt+ArrowDown on the drag handle', () => {
    const onReorder = vi.fn();
    render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        onReorder={onReorder}
      />,
    );
    const handles = screen.getAllByRole('button', { name: /Reorder/ });
    fireEvent.keyDown(handles[1], { key: 'ArrowDown', altKey: true });
    expect(onReorder).toHaveBeenCalledTimes(1);
    const newOrder = onReorder.mock.calls[0][0] as PipelineHierarchyStage[];
    expect(newOrder.map((s) => s.value)).toEqual([
      'qa1',
      'staging',
      'qa2',
      'prod',
    ]);
  });

  it('does not move beyond array bounds via keyboard', () => {
    const onReorder = vi.fn();
    render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        onReorder={onReorder}
      />,
    );
    const handles = screen.getAllByRole('button', { name: /Reorder/ });
    fireEvent.keyDown(handles[0], { key: 'ArrowUp', altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
    fireEvent.keyDown(handles[stages.length - 1], {
      key: 'ArrowDown',
      altKey: true,
    });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('ignores arrow keys without Alt modifier', () => {
    const onReorder = vi.fn();
    render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        onReorder={onReorder}
      />,
    );
    const handles = screen.getAllByRole('button', { name: /Reorder/ });
    fireEvent.keyDown(handles[1], { key: 'ArrowUp' });
    fireEvent.keyDown(handles[1], { key: 'ArrowDown' });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('renders the add stage button when onAddStage is provided', () => {
    const onAddStage = vi.fn();
    render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        addLabel="Add environment"
        onAddStage={onAddStage}
      />,
    );
    fireEvent.click(screen.getByText('Add environment'));
    expect(onAddStage).toHaveBeenCalledTimes(1);
  });

  it('omits the add stage button when onAddStage is not provided', () => {
    render(
      <PipelineHierarchyPanel title="Pipeline Hierarchy" stages={stages} />,
    );
    expect(screen.queryByText('Add environment')).not.toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PipelineHierarchyPanel
        ref={ref}
        title="Pipeline Hierarchy"
        stages={stages}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(
      <PipelineHierarchyPanel
        title="Pipeline Hierarchy"
        stages={stages}
        className="custom"
      />,
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});
