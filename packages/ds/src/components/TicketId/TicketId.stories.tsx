import type { Meta, StoryObj } from '@storybook/react';
import { TicketId } from './TicketId';

const meta = {
  title: 'Components/TicketId',
  component: TicketId,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
  args: {
    children: 'ENG-902',
  },
} satisfies Meta<typeof TicketId>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllExamples: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-scale-sm)',
        alignItems: 'center',
      }}
    >
      <TicketId>ENG-902</TicketId>
      <TicketId>INFRA-441</TicketId>
      <TicketId>OPS-112</TicketId>
      <TicketId>DOC-42</TicketId>
    </div>
  ),
};
