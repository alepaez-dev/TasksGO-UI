import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A boxed surface for grouping related content. Optional `header` slot renders a small caps label above the body. `variant="subtle"` switches the background from the default surface (white) to the secondary surface (light gray).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subtle'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <p>A basic card with only body content and no header.</p>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card header="Included">
      <ul>
        <li>GET /v1/assets/*</li>
        <li>GET /v1/metadata/*</li>
        <li>Cache invalidation via SNS</li>
      </ul>
    </Card>
  ),
};

export const Subtle: Story = {
  render: () => (
    <Card variant="subtle" header="Included">
      <ul>
        <li>GET /v1/assets/*</li>
        <li>GET /v1/metadata/*</li>
        <li>Cache invalidation via SNS</li>
      </ul>
    </Card>
  ),
};

export const TwoColumn: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '640px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--ds-space-scale-md)',
      }}
    >
      <Card variant="subtle" header="Included">
        <ul>
          <li>GET /v1/assets/*</li>
          <li>GET /v1/metadata/*</li>
          <li>Cache invalidation via SNS</li>
        </ul>
      </Card>
      <Card header="Excluded">
        <ul>
          <li>WebSocket streams</li>
          <li>POST/PUT operations</li>
        </ul>
      </Card>
    </div>
  ),
};
