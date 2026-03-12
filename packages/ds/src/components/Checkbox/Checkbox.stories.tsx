import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'completed'],
    },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    'aria-label': { control: 'text' },
  },
  args: {
    'aria-label': 'Toggle task',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true, onChange: () => {} },
};

export const Completed: Story = {
  args: { variant: 'completed', checked: true, onChange: () => {} },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-scale-md)',
        alignItems: 'center',
      }}
    >
      <Checkbox aria-label="Unchecked task" />
      <Checkbox aria-label="Active task" checked onChange={() => {}} />
      <Checkbox
        aria-label="Completed task"
        variant="completed"
        checked
        onChange={() => {}}
      />
      <Checkbox aria-label="Disabled task" disabled />
    </div>
  ),
};
