import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EditToggle } from './EditToggle';

describe('EditToggle', () => {
  it('shows the Edit affordance when not editing and requests edit on click', async () => {
    const onEditingChange = vi.fn();
    render(<EditToggle editing={false} onEditingChange={onEditingChange} />);
    const btn = screen.getByRole('button', { name: 'Edit' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(btn);
    expect(onEditingChange).toHaveBeenCalledWith(true);
  });

  it('shows the Done affordance when editing and requests exit on click', async () => {
    const onEditingChange = vi.fn();
    render(<EditToggle editing onEditingChange={onEditingChange} />);
    const btn = screen.getByRole('button', { name: 'Done' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(btn);
    expect(onEditingChange).toHaveBeenCalledWith(false);
  });

  it('runs a consumer onClick without swallowing the toggle', async () => {
    const onEditingChange = vi.fn();
    const onClick = vi.fn();
    render(
      <EditToggle
        editing={false}
        onEditingChange={onEditingChange}
        onClick={onClick}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onClick).toHaveBeenCalled();
    expect(onEditingChange).toHaveBeenCalledWith(true);
  });

  it('forwards disabled and does not request a change on click', async () => {
    const onEditingChange = vi.fn();
    render(
      <EditToggle editing={false} onEditingChange={onEditingChange} disabled />,
    );
    const btn = screen.getByRole('button', { name: 'Edit' });
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onEditingChange).not.toHaveBeenCalled();
  });

  it('supports custom labels', () => {
    render(
      <EditToggle
        editing={false}
        onEditingChange={() => {}}
        editLabel="Edit steps"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Edit steps' }),
    ).toBeInTheDocument();
  });
});
