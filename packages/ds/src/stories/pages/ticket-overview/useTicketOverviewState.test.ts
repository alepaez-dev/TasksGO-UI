import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTicketOverviewState } from './useTicketOverviewState';
import {
  devScratchpadTask,
  peopleOptions,
  priorityOptions,
  ticket,
} from './shared';

describe('useTicketOverviewState — task drawer', () => {
  it('starts closed', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    expect(result.current.viewingTask).toBeNull();
  });

  it('opens with the task and seeds the form from it', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.openTaskDrawer(devScratchpadTask));
    expect(result.current.viewingTask).toEqual(devScratchpadTask);
    expect(result.current.taskForm.title).toBe(devScratchpadTask.title);
    expect(result.current.taskForm.description).toBe(
      devScratchpadTask.description,
    );
    // A task opened from this page's notes belongs to this ticket.
    expect(result.current.taskForm.linkedTicket).toBe(ticket.id);
    expect(result.current.taskDrawerTitle).toBe(
      `Edit task · ${devScratchpadTask.id}`,
    );
  });

  it("seeds the fields the task does not carry from this page's own lists", () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.openTaskDrawer(devScratchpadTask));
    // Borrowing a value from another page renders as "No assignee": the two
    // pages option lists do not overlap.
    expect(
      peopleOptions.some((p) => p.value === result.current.taskForm.assignee),
    ).toBe(true);
    expect(
      priorityOptions.some((o) => o.value === result.current.taskForm.priority),
    ).toBe(true);
  });

  it('closes without persisting anything', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.openTaskDrawer(devScratchpadTask));
    act(() => result.current.closeTaskDrawer());
    expect(result.current.viewingTask).toBeNull();
  });

  it('keeps a matching accessible name while the drawer animates out', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.openTaskDrawer(devScratchpadTask));
    act(() => result.current.closeTaskDrawer());
    // The e2e unmount assertions locate the drawer by /Edit task/. If this name
    // blanks on close they stop waiting for unmount and pass vacuously.
    expect(result.current.taskDrawerTitle).toMatch(/Edit task/);
  });
});
