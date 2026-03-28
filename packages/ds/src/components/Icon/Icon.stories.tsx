import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { iconRegistry, type IconName } from '../../icons';

const iconNames = Object.keys(iconRegistry) as IconName[];

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
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
      <Icon name="task_alt" size="lg" />
    </div>
  ),
};

export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 80px)',
        gap: 'var(--ds-space-scale-md)',
        textAlign: 'center',
      }}
    >
      {iconNames.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--ds-space-scale-xs)',
          }}
        >
          <Icon name={name} size="md" />
          <span
            style={{
              fontSize: '10px',
              color: 'var(--ds-color-text-secondary)',
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};
