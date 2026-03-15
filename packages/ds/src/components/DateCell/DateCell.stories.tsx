import type { Meta, StoryObj } from '@storybook/react';
import { DateCell } from './DateCell';

const meta = {
  title: 'Components/DateCell',
  component: DateCell,
  tags: ['autodocs'],
  argTypes: {
    date: { control: 'text' },
    urgent: { control: 'boolean' },
    dateTime: { control: 'text' },
  },
  args: {
    date: 'Oct 28',
    dateTime: '2026-10-28',
  },
} satisfies Meta<typeof DateCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Urgent: Story = {
  args: { date: 'Today', dateTime: '2026-03-11', urgent: true },
};

export const WithDateTime: Story = {
  args: { date: 'Nov 5', dateTime: '2026-11-05' },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-scale-sm)',
      }}
    >
      <DateCell date="Oct 28" dateTime="2026-10-28" />
      <DateCell date="Nov 2" dateTime="2026-11-02" />
      <DateCell date="Today" urgent dateTime="2026-03-11" />
    </div>
  ),
};
