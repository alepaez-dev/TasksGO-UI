import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import styles from './Badge.module.css';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'progress',
        'todo',
        'done',
        'high',
        'critical',
        'success',
        'waived',
        'reference',
        'count',
        'previous',
      ],
      description:
        'Visual style. Status variants (progress/todo/done/high/critical/success/waived) tint the badge by state; "reference" is a mono-styled chip for technical reference values like version IDs, build numbers, or short hashes; "count" is a neutral mono tally for numbers and fractions (e.g. 37, 2/13); "previous" is the struck-through left half of a value change, drained of colour so the new value carries it; it also prefixes a visually hidden "was" for assistive tech, so pass the bare value.',
    },
    children: { control: 'text' },
  },
  args: {
    children: 'v4.1.0-alpha',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Previous: Story = {
  args: { variant: 'previous', children: 'To Do' },
  parameters: {
    docs: {
      description: {
        story:
          'The superseded half of a value change. Carries no status colour — a previous "To Do", "Medium" and "Blocked" all look alike, because the colour belongs to the new value. Strike-through is visual only, so the badge also announces "was" to assistive tech.',
      },
    },
  },
};

export const StatusChange: Story = {
  render: () => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--ds-space-scale-sm)',
        fontFamily: 'var(--ds-font-family-sans)',
        fontSize: 'var(--ds-text-timeline-event-font-size)',
        color: 'var(--ds-color-text-secondary)',
      }}
    >
      changed status <Badge variant="previous">To Do</Badge>{' '}
      <span aria-hidden="true">→</span>
      <span className={styles.srOnly}>to</span>{' '}
      <Badge variant="progress">In Progress</Badge>
    </span>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'How the pair reads in a feed row. The arrow and the sentence belong to the page — Badge renders one chip. The arrow is decorative, so the page supplies a hidden "to" beside it: a screen reader hears "changed status was To Do to In Progress".',
      },
    },
  },
};

export const Progress: Story = {
  args: { variant: 'progress', children: 'In Progress' },
};

export const Todo: Story = {
  args: { variant: 'todo', children: 'To Do' },
};

export const Done: Story = {
  args: { variant: 'done', children: 'Done' },
};

export const High: Story = {
  args: { variant: 'high', children: 'High Prio' },
};

export const Critical: Story = {
  args: { variant: 'critical', children: '1 Failed' },
};

export const Success: Story = {
  args: { variant: 'success', children: '4/4 Passed' },
};

export const Waived: Story = {
  args: { variant: 'waived', children: 'Waived' },
};

export const Reference: Story = {
  args: { variant: 'reference', children: 'v4.1.0-alpha' },
};

export const Count: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A neutral mono tally for numbers (`37`) and fractions (`2/13`). Dumb container — pass the content as children; the badge only supplies the look. A bare fraction is ambiguous to a screen reader; to give it a spoken label, pass `role="img"` alongside `aria-label` (`aria-label` alone is prohibited on a plain span). See the third example below.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-scale-sm)',
        alignItems: 'center',
      }}
    >
      <Badge variant="count">37</Badge>
      <Badge variant="count">2/13</Badge>
      <Badge variant="count" role="img" aria-label="2 of 13 checks passing">
        2/13
      </Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-scale-sm)',
        alignItems: 'center',
      }}
    >
      <Badge>v4.1.0-alpha</Badge>
      <Badge variant="progress">In Progress</Badge>
      <Badge variant="todo">To Do</Badge>
      <Badge variant="done">Done</Badge>
      <Badge variant="high">High Prio</Badge>
      <Badge variant="critical">1 Failed</Badge>
      <Badge variant="success">4/4 Passed</Badge>
      <Badge variant="waived">Waived</Badge>
      <Badge variant="reference">v4.1.0-alpha</Badge>
      <Badge variant="count">37</Badge>
      <Badge variant="count">2/13</Badge>
      <Badge variant="previous">To Do</Badge>
    </div>
  ),
};
