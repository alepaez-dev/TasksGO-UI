import type { Meta, StoryObj } from '@storybook/react';
import { ActivityRow } from './ActivityRow';
import { ExternalLink } from '../ExternalLink';
import { Badge } from '../Badge';

const meta = {
  title: 'Components/ActivityRow',
  component: ActivityRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A flexible two-line list row for dev activity (pull requests, commits, deployments). Slots take DS primitives directly: an ExternalLink title, a mono meta line, and trailing Badge(s). Renders an `<li>` — wrap rows in a `<ul>`. The `tone` prop tints the leading icon as visual reinforcement only (the icon is `aria-hidden`); pair danger/warning with a Badge or text so status is never conveyed by color alone.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ul
        style={{
          margin: 0,
          padding: 0,
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Story />
      </ul>
    ),
  ],
  argTypes: {
    icon: { control: 'text' },
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
      description:
        'Tints the leading icon. Visual reinforcement only — the icon is aria-hidden, so pair danger/warning with a Badge or text so status is not color-only (WCAG 1.4.1).',
    },
  },
  args: {
    icon: 'call_merge',
    children: 'Add dark-mode toggle',
  },
} satisfies Meta<typeof ActivityRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PullRequest: Story = {
  args: {
    icon: 'call_merge',
    tone: 'success',
    meta: ['#142', 'alex', '2h ago'],
    trailing: <Badge variant="count">2/13</Badge>,
    children: (
      <ExternalLink href="https://github.com/example/pr/142">
        Add dark-mode toggle
      </ExternalLink>
    ),
  },
};

export const Commit: Story = {
  args: {
    icon: 'code',
    meta: ['a1b9f2c', 'sam', '5h ago'],
    children: (
      <ExternalLink href="https://github.com/example/commit/a1b9f2c">
        Fix flaky viewport test
      </ExternalLink>
    ),
  },
};

export const Deployment: Story = {
  args: {
    icon: 'check_circle',
    tone: 'danger',
    meta: ['production', 'ci-bot', '1d ago'],
    trailing: <Badge variant="critical">Failed</Badge>,
    children: 'Deploy v4.1.0',
  },
};

export const Minimal: Story = {
  args: {
    icon: 'code',
    children: 'A row with no meta and no trailing',
  },
};

export const TruncatedTitle: Story = {
  args: {
    icon: 'call_merge',
    tone: 'info',
    meta: ['#88', 'jordan', '3d ago'],
    trailing: <Badge variant="progress">Open</Badge>,
    children: (
      <ExternalLink href="https://github.com/example/pr/88">
        feat: dynamic edge caching for API gateway responses across all regions
      </ExternalLink>
    ),
  },
};

export const AllTones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <ActivityRow icon="call_merge" tone="neutral" meta={['neutral']}>
        Neutral tone
      </ActivityRow>
      <ActivityRow icon="call_merge" tone="info" meta={['info']}>
        Info tone
      </ActivityRow>
      <ActivityRow icon="call_merge" tone="success" meta={['success']}>
        Success tone
      </ActivityRow>
      <ActivityRow icon="call_merge" tone="warning" meta={['warning']}>
        Warning tone
      </ActivityRow>
      <ActivityRow icon="call_merge" tone="danger" meta={['danger']}>
        Danger tone
      </ActivityRow>
    </>
  ),
};
