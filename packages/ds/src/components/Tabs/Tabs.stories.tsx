import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, type TabItem } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Stateless, controlled tablist. Renders only the tab buttons — consumers render the panels based on `value`. Implements WAI-ARIA tablist keyboard pattern (Arrow keys move focus & activate, Home/End jump to first/last, disabled tabs are skipped).',
          '',
          "**The component does not draw a bottom border under the tablist.** The active tab's underline visually merges with whatever bottom border the consumer adds to the wrapping element (a 1px negative margin handles the overlap). See the `WithParentBorder` story.",
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '480px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const ticketTabs: readonly TabItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'dev', label: 'Dev' },
  { value: 'qa', label: 'QA' },
  { value: 'activity', label: 'Activity' },
];

function ControlledTabs({
  items,
  initial,
  ariaLabel,
}: {
  items: readonly TabItem[];
  initial: string;
  ariaLabel: string;
}) {
  const [active, setActive] = useState(initial);
  return (
    <Tabs
      items={items}
      value={active}
      onValueChange={setActive}
      aria-label={ariaLabel}
    />
  );
}

export const Default: Story = {
  render: () => (
    <ControlledTabs
      items={ticketTabs}
      initial="overview"
      ariaLabel="Ticket sections"
    />
  ),
};

export const WithParentBorder: Story = {
  render: () => (
    <div
      style={{
        borderBottom: '1px solid var(--ds-color-border-default)',
      }}
    >
      <ControlledTabs
        items={ticketTabs}
        initial="overview"
        ariaLabel="Ticket sections"
      />
    </div>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <ControlledTabs
      items={[
        { value: 'overview', label: 'Overview' },
        { value: 'dev', label: 'Dev' },
        { value: 'qa', label: 'QA', disabled: true },
        { value: 'activity', label: 'Activity' },
      ]}
      initial="overview"
      ariaLabel="Ticket sections"
    />
  ),
};

export const TwoTabs: Story = {
  render: () => (
    <ControlledTabs
      items={[
        { value: 'active', label: 'Active' },
        { value: 'archived', label: 'Archived' },
      ]}
      initial="active"
      ariaLabel="Task lists"
    />
  ),
};

export const LongLabels: Story = {
  render: () => (
    <ControlledTabs
      items={[
        { value: 'overview', label: 'Project overview' },
        { value: 'env', label: 'Environments and infrastructure' },
        { value: 'audit', label: 'Audit log' },
      ]}
      initial="overview"
      ariaLabel="Project sections"
    />
  ),
};
