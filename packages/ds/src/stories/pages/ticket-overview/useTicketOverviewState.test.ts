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

describe('useTicketOverviewState — status gating', () => {
  const statusOf = (
    result: { current: ReturnType<typeof useTicketOverviewState> },
    id: string,
  ) => result.current.qaScenarios.find((s) => s.id === id)?.status;

  const scenario = (
    result: { current: ReturnType<typeof useTicketOverviewState> },
    id: string,
  ) => result.current.qaScenarios.find((s) => s.id === id);

  it('applies an ungated move straight away', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.requestScenarioStatus('TC-418', 'passed'));
    expect(statusOf(result, 'TC-418')).toBe('passed');
    expect(result.current.statusPromptOpen).toBe(false);
  });

  it('holds a waive until its reason is given', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.requestScenarioStatus('TC-402', 'waived'));

    expect(statusOf(result, 'TC-402')).toBe('passed');
    expect(result.current.statusPromptOpen).toBe(true);
    expect(result.current.pendingStatusChange).toMatchObject({
      scenarioId: 'TC-402',
      kind: 'waived',
    });
  });

  it('commits the status and the reason in one update', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.requestScenarioStatus('TC-402', 'waived'));
    act(() => result.current.setStatusDraft('Out of scope; see ENG-2871.'));
    act(() => result.current.confirmStatusChange());

    expect(scenario(result, 'TC-402')).toMatchObject({
      status: 'waived',
      waiveReason: 'Out of scope; see ENG-2871.',
    });
    expect(result.current.statusPromptOpen).toBe(false);
  });

  it('leaves the scenario untouched when cancelled', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.requestScenarioStatus('TC-402', 'waived'));
    act(() => result.current.setStatusDraft('half a thought'));
    act(() => result.current.cancelStatusChange());

    expect(statusOf(result, 'TC-402')).toBe('passed');
    expect(scenario(result, 'TC-402')?.waiveReason).toBeUndefined();
    expect(result.current.statusPromptOpen).toBe(false);
  });

  it('keeps the prompt content while it closes, then reseeds on reopen', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.requestScenarioStatus('TC-402', 'waived'));
    act(() => result.current.setStatusDraft('half a thought'));
    act(() => result.current.cancelStatusChange());

    expect(result.current.statusPromptOpen).toBe(false);
    expect(result.current.pendingStatusChange).not.toBeNull();
    expect(result.current.statusDraft).toBe('half a thought');

    act(() => result.current.requestScenarioStatus('TC-402', 'waived'));
    expect(result.current.statusPromptOpen).toBe(true);
    expect(result.current.statusDraft).toBe('');
  });

  it('refuses to commit a blank justification', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.requestScenarioStatus('TC-402', 'waived'));
    act(() => result.current.setStatusDraft('   '));
    act(() => result.current.confirmStatusChange());

    expect(statusOf(result, 'TC-402')).toBe('passed');
    expect(result.current.pendingStatusChange).not.toBeNull();
  });

  it('holds a re-open from passed, offering the previous actual', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    const before = scenario(result, 'TC-402');
    act(() => result.current.requestScenarioStatus('TC-402', 'pending'));

    expect(statusOf(result, 'TC-402')).toBe('passed');
    expect(result.current.pendingStatusChange).toMatchObject({
      kind: 'pending',
      previousActual: before?.actual,
    });
  });

  it('lets a failed scenario re-open without a dialog', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.requestScenarioStatus('TC-418', 'pending'));

    expect(statusOf(result, 'TC-418')).toBe('pending');
    expect(result.current.statusPromptOpen).toBe(false);
  });

  it('drops the waive reason when a waived scenario is re-opened', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    expect(scenario(result, 'TC-409')?.waiveReason).toBeDefined();

    act(() => result.current.requestScenarioStatus('TC-409', 'pending'));
    act(() => result.current.setStatusDraft('Observed 3 drops in 60s.'));
    act(() => result.current.confirmStatusChange());

    expect(statusOf(result, 'TC-409')).toBe('pending');
    expect(scenario(result, 'TC-409')?.waiveReason).toBeUndefined();
  });

  it('drops the waive reason on an ungated move off waived', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.requestScenarioStatus('TC-409', 'passed'));

    expect(statusOf(result, 'TC-409')).toBe('passed');
    expect(scenario(result, 'TC-409')?.waiveReason).toBeUndefined();
  });

  it('ignores a request for the status it already has', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.requestScenarioStatus('TC-409', 'waived'));

    expect(result.current.statusPromptOpen).toBe(false);
    expect(scenario(result, 'TC-409')?.waiveReason).toBeDefined();
  });

  it('closes the status picker when a dialog takes over', () => {
    const { result } = renderHook(() => useTicketOverviewState());
    act(() => result.current.setStatusSelectOpen('TC-402', true));
    act(() => result.current.requestScenarioStatus('TC-402', 'waived'));

    expect(result.current.statusSelectScenarioId).toBeNull();
  });
});
