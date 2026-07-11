import type { Meta, StoryObj } from '@storybook/react';
import { ExternalLink } from './ExternalLink';

const meta = {
  title: 'Components/ExternalLink',
  component: ExternalLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A security-hardened link to an external resource that opens in a new tab. Sanitizes the href, adds `rel="noopener noreferrer"`, shows a trailing "open in new tab" icon (suppressible), and announces "(opens in a new tab)" to screen readers. Single inline style — the consumer owns layout (e.g. a Quick Links list).',
      },
    },
  },
  argTypes: {
    href: { control: 'text' },
    icon: { control: 'text', description: 'Optional leading icon (IconName).' },
    showExternalIcon: {
      control: 'boolean',
      description: 'Trailing open-in-new icon. Default true.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      description: 'Label and icon size, in lockstep. Default md.',
    },
    children: { control: 'text' },
  },
  args: {
    href: 'https://github.com/alepaez-dev/TasksGO-UI',
    children: 'GitHub Repository',
  },
} satisfies Meta<typeof ExternalLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLeadingIcon: Story = {
  args: {
    icon: 'link',
    children: 'GitHub Repository',
    size: 'md',
  },
};

export const Inline: Story = {
  args: { children: 'View all' },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-scale-sm)',
        alignItems: 'flex-start',
      }}
    >
      <ExternalLink
        href="https://github.com/alepaez-dev/TasksGO-UI"
        icon="link"
        size="md"
      >
        Medium (default)
      </ExternalLink>
      <ExternalLink
        href="https://github.com/alepaez-dev/TasksGO-UI"
        icon="link"
        size="sm"
      >
        Small
      </ExternalLink>
    </div>
  ),
};

export const WithoutExternalIcon: Story = {
  args: {
    icon: 'link',
    showExternalIcon: false,
    children: 'API Documentation',
  },
};

export const Truncated: Story = {
  args: {
    icon: 'link',
    children: 'feat/dynamic-edge-caching-for-api-gateway-responses',
  },
  render: (args) => (
    <div
      style={{
        width: 200,
        padding: 'var(--ds-space-scale-sm)',
        border: '1px solid var(--ds-color-border-default)',
        borderRadius: 'var(--ds-radius-md)',
      }}
    >
      <ExternalLink {...args} />
    </div>
  ),
};

export const QuickLinks: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-scale-sm)',
        maxWidth: 240,
      }}
    >
      <ExternalLink
        href="https://github.com/alepaez-dev/TasksGO-UI"
        icon="link"
      >
        GitHub Repository
      </ExternalLink>
      <ExternalLink href="https://example.com/docs" icon="description">
        API Documentation
      </ExternalLink>
      <ExternalLink href="https://example.com/console" icon="link">
        CloudFront Console
      </ExternalLink>
    </div>
  ),
};
