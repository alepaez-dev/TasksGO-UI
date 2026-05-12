import { useState, useMemo } from 'react';
import { useSelectorGroup } from '../../../hooks/useSelector';
import {
  type TaskItem,
  type DrawerFormState,
  initialForm,
  seedCompleted,
  defaultTasks,
  sortTasks,
} from './shared';

export function useTasksState(
  initialTasks: readonly TaskItem[] = defaultTasks,
) {
  const [sortBy, setSortBy] = useState('priority');

  const [completedIds, setCompletedIds] = useState<ReadonlySet<string>>(
    () =>
      new Set(
        initialTasks
          .filter((t) => seedCompleted.some((s) => s.id === t.id))
          .map((t) => t.id),
      ),
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | undefined>();
  const [form, setForm] = useState<DrawerFormState>(initialForm);
  const selectors = useSelectorGroup('assignee', 'priority', 'ticket');
  const [assigneeQuery, setAssigneeQuery] = useState('');
  const [ticketQuery, setTicketQuery] = useState('');

  const activeTasks = useMemo(() => {
    const filtered = initialTasks.filter((t) => !completedIds.has(t.id));
    return sortTasks(filtered, sortBy);
  }, [initialTasks, completedIds, sortBy]);

  const completedTasks = useMemo(
    () => initialTasks.filter((t) => completedIds.has(t.id)),
    [initialTasks, completedIds],
  );

  function handleCheck(taskId: string, checked: boolean) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(taskId);
      else next.delete(taskId);
      return next;
    });
  }

  function handleDrawerClose() {
    setDrawerOpen(false);
    setEditingTaskId(undefined);
    setForm(initialForm);
    setAssigneeQuery('');
    setTicketQuery('');
  }

  function handleTaskClick(task: TaskItem) {
    setEditingTaskId(task.id);
    setForm({
      title: task.title,
      description: '',
      assignee: 'alex',
      priority: task.priority ?? 'medium',
      linkedTicket: undefined,
    });
    setDrawerOpen(true);
  }

  const editingTask = editingTaskId
    ? initialTasks.find((t) => t.id === editingTaskId)
    : undefined;
  const drawerTitle = editingTask
    ? `Edit task \u00b7 ${editingTask.ticketId ?? editingTask.id}`
    : 'New task';
  const drawerSubmitLabel = editingTaskId ? 'Save' : 'Create Task';

  return {
    sortBy,
    setSortBy,
    completedIds,
    activeTasks,
    completedTasks,
    handleCheck,
    drawerOpen,
    setDrawerOpen,
    form,
    setForm,
    drawerTitle,
    drawerSubmitLabel,
    handleDrawerClose,
    handleTaskClick,
    selectors,
    assigneeQuery,
    setAssigneeQuery,
    ticketQuery,
    setTicketQuery,
  };
}
