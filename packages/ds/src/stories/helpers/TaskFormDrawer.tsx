import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Drawer } from '../../components/Drawer';
import { TaskDrawer, TaskDrawerField } from '../../components/TaskDrawer';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import type { DrawerFormState } from '../pages/tasks/shared';

export interface TaskFormDrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  form: DrawerFormState;
  setForm: Dispatch<SetStateAction<DrawerFormState>>;
  submitLabel?: string;
  children?: ReactNode;
}

export function TaskFormDrawer({
  open,
  title,
  onClose,
  form,
  setForm,
  submitLabel = 'Save',
  children,
}: TaskFormDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} side="right" aria-label={title}>
      <TaskDrawer
        title={title}
        onCancel={onClose}
        onSubmit={onClose}
        submitLabel={submitLabel}
      >
        <TaskDrawerField label="Task Title">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Describe the task..."
            aria-label="Task title"
          />
        </TaskDrawerField>

        <TaskDrawerField
          label="Description"
          action={
            <Button variant="ai" size="sm">
              <Icon name="auto_awesome" size="sm" />
              Generate with AI
            </Button>
          }
        >
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Add details..."
            rows={4}
            aria-label="Description"
          />
        </TaskDrawerField>

        {children}
      </TaskDrawer>
    </Drawer>
  );
}
