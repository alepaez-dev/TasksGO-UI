import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TaskSection } from './TaskSection';
import { Selector } from '../Selector';
import { useSelectorState } from '../../hooks/useSelector';

const meta = {
  title: 'Components/TaskSection',
  component: TaskSection,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    count: { control: 'number' },
    badgeVariant: {
      control: 'select',
      options: ['default', 'progress', 'todo', 'done'],
    },
    open: { control: 'boolean' },
  },
} satisfies Meta<typeof TaskSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'ACTIVE TASKS',
    count: 2,
    badgeVariant: 'progress',
    open: true,
    children: <p>Section content goes here.</p>,
  },
};

export const Closed: Story = {
  args: {
    title: 'DONE',
    count: 5,
    badgeVariant: 'done',
    children: <p>Completed tasks would appear here.</p>,
  },
};

const sortOptions = [
  { value: 'priority', label: 'Priority' },
  { value: 'due-date', label: 'Due date' },
  { value: 'recently-updated', label: 'Recently updated' },
];

function WithOrderByRender() {
  const [sort, setSort] = useState('priority');
  const { ref, open, onOpenChange } = useSelectorState();
  const selected = sortOptions.find((o) => o.value === sort);

  return (
    <TaskSection
      title="Active Tasks"
      count={5}
      badgeVariant="progress"
      open
      trailing={
        <Selector
          ref={ref}
          variant="inline"
          dropdownAlign="end"
          options={sortOptions}
          value={sort}
          onValueChange={setSort}
          open={open}
          onOpenChange={onOpenChange}
          renderTriggerLabel={() => (
            <span>Order by: {selected?.label ?? 'Select'}</span>
          )}
          renderOptionIndicator={() => null}
          aria-label="Sort tasks by"
        />
      }
    >
      <p>Task rows would appear here, sorted by {sort}.</p>
    </TaskSection>
  );
}

export const WithOrderBy: Story = {
  args: { title: 'Active Tasks' },
  render: () => <WithOrderByRender />,
};

export const WithoutCount: Story = {
  args: {
    title: 'BACKLOG',
    open: true,
    children: <p>Tasks without a count badge.</p>,
  },
};
