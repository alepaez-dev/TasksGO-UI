import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectPicker, type ProjectPickerProject } from './ProjectPicker';

const projects: ProjectPickerProject[] = [
  { value: 'eng', label: 'Engineering Core', initial: 'E' },
  { value: 'mud', label: 'Mudatec', initial: 'M' },
  { value: 'tgo', label: 'TasksGo', initial: 'T' },
];

describe('ProjectPicker', () => {
  it('renders the back button and header', () => {
    render(
      <ProjectPicker
        projects={projects}
        value="eng"
        onSelect={vi.fn()}
        onBack={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Back to menu' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /switch project/i }),
    ).toBeInTheDocument();
  });

  it('renders all projects', () => {
    render(
      <ProjectPicker
        projects={projects}
        value="eng"
        onSelect={vi.fn()}
        onBack={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Engineering Core')).toBeInTheDocument();
    expect(screen.getByText('Mudatec')).toBeInTheDocument();
    expect(screen.getByText('TasksGo')).toBeInTheDocument();
  });

  it('marks the selected project with aria-selected', () => {
    render(
      <ProjectPicker
        projects={projects}
        value="mud"
        onSelect={vi.fn()}
        onBack={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />,
    );
    const selected = screen.getByRole('option', { selected: true });
    expect(selected).toHaveTextContent('Mudatec');
  });

  it('calls onSelect when a project is clicked', () => {
    const onSelect = vi.fn();
    render(
      <ProjectPicker
        projects={projects}
        value="eng"
        onSelect={onSelect}
        onBack={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText('TasksGo'));
    expect(onSelect).toHaveBeenCalledWith('tgo');
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(
      <ProjectPicker
        projects={projects}
        value="eng"
        onSelect={vi.fn()}
        onBack={onBack}
        query=""
        onQueryChange={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Back to menu' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('filters projects by query', () => {
    render(
      <ProjectPicker
        projects={projects}
        value="eng"
        onSelect={vi.fn()}
        onBack={vi.fn()}
        query="task"
        onQueryChange={vi.fn()}
      />,
    );
    expect(screen.queryByText('Engineering Core')).not.toBeInTheDocument();
    expect(screen.queryByText('Mudatec')).not.toBeInTheDocument();
    expect(screen.getByText('TasksGo')).toBeInTheDocument();
  });

  it('renders search input with placeholder', () => {
    render(
      <ProjectPicker
        projects={projects}
        value="eng"
        onSelect={vi.fn()}
        onBack={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />,
    );
    expect(screen.getByPlaceholderText('Find project...')).toBeInTheDocument();
  });

  it('forwards ref to root element', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(
      <ProjectPicker
        ref={ref}
        projects={projects}
        value="eng"
        onSelect={vi.fn()}
        onBack={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom avatar color when provided', () => {
    const colored: ProjectPickerProject[] = [
      { value: 'a', label: 'Alpha', initial: 'A', avatarColor: '#ff0000' },
    ];
    render(
      <ProjectPicker
        projects={colored}
        value="a"
        onSelect={vi.fn()}
        onBack={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />,
    );
    const avatar = screen.getByRole('img', { name: 'Alpha' });
    expect(avatar).toHaveStyle({ backgroundColor: '#ff0000' });
  });
});
