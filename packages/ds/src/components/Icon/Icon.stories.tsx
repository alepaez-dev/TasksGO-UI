import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    name: 'task_alt',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-scale-md)',
        alignItems: 'center',
      }}
    >
      <Icon name="task_alt" size="sm" />
      <Icon name="task_alt" size="md" />
    </div>
  ),
};
