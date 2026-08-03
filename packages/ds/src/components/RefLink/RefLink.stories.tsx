import type { Meta, StoryObj } from '@storybook/react';
import { RefLink } from './RefLink';

const meta = {
  title: 'Components/RefLink',
  component: RefLink,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    href: { control: 'text' },
    boxed: { control: 'boolean' },
    copied: { control: 'boolean' },
    copiedLabel: { control: 'text' },
  },
  args: {
    value: 'feat/dynamic-edge-caching',
    href: 'https://github.com/example/edge-gateway-service/tree/feat/dynamic-edge-caching',
    onCopy: () => {},
    copyAriaLabel: 'Copy branch',
  },
} satisfies Meta<typeof RefLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Boxed: Story = {
  args: { boxed: true },
};

export const LongValueTruncates: Story = {
  args: {
    boxed: true,
    value:
      'feat/dynamic-edge-caching-for-api-gateway-responses-with-ttl-inheritance',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 240 }}>
        <Story />
      </div>
    ),
  ],
};

export const Copied: Story = {
  args: { boxed: true, copied: true },
};

export const WithoutCopy: Story = {
  args: { boxed: true, onCopy: undefined },
};
