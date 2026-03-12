import type { Meta, StoryObj } from '@storybook/react';
import { TicketId } from './TicketId';

const meta = {
  title: 'Components/TicketId',
  component: TicketId,
  tags: ['autodocs'],
  argTypes: {
    ticketId: { control: 'text' },
  },
  args: {
    ticketId: 'ENG-902',
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
      <TicketId ticketId="ENG-902" />
      <TicketId ticketId="INFRA-441" />
      <TicketId ticketId="OPS-112" />
      <TicketId ticketId="DOC-42" />
    </div>
  ),
};
