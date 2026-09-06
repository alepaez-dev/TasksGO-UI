import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTicketOverviewState } from './useTicketOverviewState';
import {
  devScratchpadTask,
  peopleOptions,
  priorityOptions,
  ticket,
} from './shared';

const DRAFT = {
  name: 'Purge honours cache tags',
  status: 'passed' as const,
  description: 'Tag purge clears matching keys.',
  expected: 'Tagged keys evict at once.',
  actual: '',
  steps: [],
  evidence: [],
};

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

describe('useTicketOverviewState — add scenario', () => {
  it('keeps the draft intact while the dialog closes', () => {
    const { result } = renderHook(() => useTicketOverviewState());

    act(() => result.current.openAddScenario());
    act(() => result.current.setScenarioDraft(DRAFT));
    act(() => result.current.cancelAddScenario());

    expect(result.current.addScenarioOpen).toBe(false);
    expect(result.current.scenarioDraft).toEqual(DRAFT);
  });

  it('keeps the submitted draft intact while the dialog closes', () => {
    const { result } = renderHook(() => useTicketOverviewState());

    act(() => result.current.openAddScenario());
    act(() => result.current.setScenarioDraft(DRAFT));
    act(() => result.current.confirmAddScenario(DRAFT));

    expect(result.current.addScenarioOpen).toBe(false);
    expect(result.current.scenarioDraft).toEqual(DRAFT);
  });

  it('resets the draft when the dialog is opened again', () => {
    const { result } = renderHook(() => useTicketOverviewState());

    act(() => result.current.openAddScenario());
    act(() => result.current.setScenarioDraft(DRAFT));
    act(() => result.current.cancelAddScenario());
    act(() => result.current.openAddScenario());

    expect(result.current.scenarioDraft.name).toBe('');
    expect(result.current.scenarioDraft.status).toBe('pending');
  });

  it('appends a confirmed scenario and recounts failures', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    const before = result.current.qaScenarios.length;

    act(() =>
      result.current.confirmAddScenario({ ...DRAFT, status: 'failed' }),
    );

    const added = result.current.qaScenarios[before];
    expect(result.current.qaScenarios).toHaveLength(before + 1);
    expect(added.title).toBe(DRAFT.name);
    expect(result.current.qaFailedCount).toBe(2);
  });
});
