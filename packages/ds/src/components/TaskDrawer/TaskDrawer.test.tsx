import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskDrawer, TaskDrawerField, TaskDrawerSection } from './TaskDrawer';

describe('TaskDrawer', () => {
  it('renders the title', () => {
    render(
      <TaskDrawer title="New task" onCancel={vi.fn()} onSubmit={vi.fn()}>
        content
      </TaskDrawer>,
    );
    expect(
      screen.getByRole('heading', { name: 'New task' }),
    ).toBeInTheDocument();
  });

  it('renders children in the body', () => {
    render(
      <TaskDrawer title="New task" onCancel={vi.fn()} onSubmit={vi.fn()}>
        <p>Form content</p>
      </TaskDrawer>,
    );
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('renders Cancel and Create Task buttons by default', () => {
    render(
      <TaskDrawer title="New task" onCancel={vi.fn()} onSubmit={vi.fn()}>
        content
      </TaskDrawer>,
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create Task' }),
    ).toBeInTheDocument();
  });

  it('uses custom button labels', () => {
    render(
      <TaskDrawer
        title="Edit"
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
        cancelLabel="Discard"
        submitLabel="Save"
      >
        content
      </TaskDrawer>,
    );
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    render(
      <TaskDrawer title="New task" onCancel={onCancel} onSubmit={vi.fn()}>
        content
      </TaskDrawer>,
    );
    screen.getByRole('button', { name: 'Cancel' }).click();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when submit button is clicked', () => {
    const onSubmit = vi.fn();
    render(
      <TaskDrawer title="New task" onCancel={vi.fn()} onSubmit={onSubmit}>
        content
      </TaskDrawer>,
    );
    screen.getByRole('button', { name: 'Create Task' }).click();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables submit button when submitDisabled is true', () => {
    render(
      <TaskDrawer
        title="New task"
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
        submitDisabled
      >
        content
      </TaskDrawer>,
    );
    expect(screen.getByRole('button', { name: 'Create Task' })).toBeDisabled();
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(
      <TaskDrawer ref={ref} title="Test" onCancel={vi.fn()} onSubmit={vi.fn()}>
        content
      </TaskDrawer>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(
      <TaskDrawer
        title="Test"
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
        className="custom"
      >
        content
      </TaskDrawer>,
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});

describe('TaskDrawerField', () => {
  it('renders label and children', () => {
    render(
      <TaskDrawerField label="Task Title">
        <input aria-label="title" />
      </TaskDrawerField>,
    );
    expect(screen.getByText('Task Title')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'title' })).toBeInTheDocument();
  });

  it('renders action slot', () => {
    render(
      <TaskDrawerField
        label="Description"
        action={<button>Generate with AI</button>}
      >
        <textarea aria-label="description" />
      </TaskDrawerField>,
    );
    expect(
      screen.getByRole('button', { name: 'Generate with AI' }),
    ).toBeInTheDocument();
  });
});

describe('TaskDrawerSection', () => {
  it('renders label as heading and children', () => {
    render(
      <TaskDrawerSection label="Properties">
        <p>Section content</p>
      </TaskDrawerSection>,
    );
    expect(
      screen.getByRole('heading', { name: 'Properties' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });
});
