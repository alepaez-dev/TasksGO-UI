import type { Dispatch, SetStateAction } from 'react';
import { TaskDrawerSection } from '../../components/TaskDrawer';
import { Selector } from '../../components/Selector';
import { TaskFormDrawer } from './TaskFormDrawer';
import { PropertyRow } from '../../components/PropertyRow';
import { Avatar } from '../../components/Avatar';
import type { OptionListOptions } from '../../components/OptionList';
import type {
  DrawerFormState,
  PersonOption,
  TaskDrawerSelectors,
} from '../pages/tasks/shared';

export interface TaskEditDrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  form: DrawerFormState;
  setForm: Dispatch<SetStateAction<DrawerFormState>>;
  selectors: TaskDrawerSelectors;
  assigneeOptions: readonly PersonOption[];
  priorityOptions: OptionListOptions;
  ticketOptions: OptionListOptions;
}

export function TaskEditDrawer({
  open,
  title,
  onClose,
  form,
  setForm,
  selectors,
  assigneeOptions,
  priorityOptions,
  ticketOptions,
}: TaskEditDrawerProps) {
  const {
    ref: assigneeRef,
    open: assigneeOpen,
    onOpenChange: onAssigneeOpenChange,
  } = selectors.assignee;
  const {
    ref: priorityRef,
    open: priorityOpen,
    onOpenChange: onPriorityOpenChange,
  } = selectors.priority;
  const {
    ref: ticketRef,
    open: ticketOpen,
    onOpenChange: onTicketOpenChange,
  } = selectors.ticket;

  const selectedAssignee = assigneeOptions.find(
    (member) => member.value === form.assignee,
  );

  return (
    <TaskFormDrawer
      open={open}
      title={title}
      onClose={onClose}
      form={form}
      setForm={setForm}
    >
      <TaskDrawerSection label="Properties">
        <PropertyRow icon="person" label="Assignee">
          <Selector
            ref={assigneeRef}
            options={assigneeOptions}
            value={form.assignee}
            onValueChange={(v) => setForm((f) => ({ ...f, assignee: v }))}
            open={assigneeOpen}
            onOpenChange={onAssigneeOpenChange}
            dropdownAlign="end"
            variant="inline"
            aria-label="Select assignee"
            triggerPrefix={
              <Avatar
                variant="profile"
                initial={selectedAssignee?.initial ?? '?'}
                aria-label={selectedAssignee?.label ?? 'No assignee'}
                style={
                  selectedAssignee?.color
                    ? { backgroundColor: selectedAssignee.color }
                    : undefined
                }
              />
            }
            renderTriggerLabel={(opt) => opt.label}
            renderOptionIndicator={(opt) => {
              const member = assigneeOptions.find((m) => m.value === opt.value);
              return member ? (
                <Avatar
                  variant="profile"
                  size="sm"
                  initial={member.initial}
                  aria-label={member.label}
                  style={{ backgroundColor: member.color }}
                />
              ) : null;
            }}
          />
        </PropertyRow>

        <PropertyRow icon="signal_cellular_alt" label="Priority">
          <Selector
            ref={priorityRef}
            options={priorityOptions}
            value={form.priority}
            onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
            open={priorityOpen}
            onOpenChange={onPriorityOpenChange}
            dropdownAlign="end"
            variant="inline"
            aria-label="Select priority"
          />
        </PropertyRow>

        <PropertyRow icon="confirmation_number" label="Linked Ticket">
          <Selector
            ref={ticketRef}
            options={ticketOptions}
            value={form.linkedTicket}
            onValueChange={(v) => setForm((f) => ({ ...f, linkedTicket: v }))}
            open={ticketOpen}
            onOpenChange={onTicketOpenChange}
            placeholder="Search ticket..."
            variant="inline"
            dropdownAlign="end"
            emptyState="No results found"
            aria-label="Linked ticket"
          />
        </PropertyRow>
      </TaskDrawerSection>
    </TaskFormDrawer>
  );
}
