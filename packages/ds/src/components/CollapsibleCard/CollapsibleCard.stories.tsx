import type { Meta, StoryObj } from '@storybook/react';
import { CollapsibleCard } from './CollapsibleCard';
import { Badge } from '../Badge';
import { ChecklistRow } from '../ChecklistRow';
import { Icon } from '../Icon';

const meta: Meta<typeof CollapsibleCard> = {
  title: 'Components/CollapsibleCard',
  component: CollapsibleCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A card surface with a clickable header that toggles a body panel. Built on the native `<details>`/`<summary>` element — disclosure state is browser-managed, keyboard activation (Enter/Space) works for free, and screen readers announce the expanded/collapsed state without extra ARIA. Pass `defaultOpen` to set the initial state. Disclosure is uncontrolled by design; for a fully controlled card, render your own `<details>` with `open` + `onToggle`.',
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
      <div style={{ width: '640px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CollapsibleCard>;

export const Default: Story = {
  render: () => (
    <CollapsibleCard header="Scenarios Checklist">
      <div style={{ padding: '0 var(--ds-space-scale-md)' }}>
        <p>Click the header to expand and see the contents.</p>
      </div>
    </CollapsibleCard>
  ),
};

export const Open: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'CollapsibleCard intentionally leaves horizontal padding to the consumer so children like `ChecklistRow` can render edge-to-edge. For prose bodies, wrap the content in a padded container as shown here.',
      },
    },
  },
  render: () => (
    <CollapsibleCard header="Scenarios Checklist" defaultOpen>
      <div style={{ padding: '0 var(--ds-space-scale-md)' }}>
        <p>This card starts in the open state via the `defaultOpen` prop.</p>
      </div>
    </CollapsibleCard>
  ),
};

const headerWithBadge = (
  badge: React.ReactNode,
  metaText: string,
): React.ReactNode => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--ds-space-scale-sm)',
    }}
  >
    <strong>Scenarios Checklist</strong>
    {badge}
    <span
      aria-hidden="true"
      style={{
        width: '1px',
        height: '14px',
        backgroundColor: 'var(--ds-color-border-default)',
      }}
    />
    <Icon
      name="schedule"
      size="sm"
      style={{ color: 'var(--ds-color-text-secondary)' }}
    />
    <span
      style={{
        fontFamily: 'var(--ds-text-metadata-font-family)',
        fontSize: 'var(--ds-text-metadata-font-size)',
        color: 'var(--ds-color-text-secondary)',
      }}
    >
      {metaText}
    </span>
  </span>
);

export const ScenariosChecklist: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Full QA Summary composition: a rich header (title + critical badge + vertical separator + clock icon + meta) above a stack of ChecklistRows. Rows fill the card width edge-to-edge — the consumer is responsible for any per-row padding (ChecklistRow already provides it).',
      },
    },
  },
  render: () => (
    <CollapsibleCard
      defaultOpen
      header={headerWithBadge(
        <Badge variant="critical">1 Failed</Badge>,
        'Last checked 2h ago',
      )}
    >
      <ChecklistRow
        status="passed"
        label="Cache hit ratio check on US-East-1 staging"
        meta="Verified by JD"
        onClick={() => {}}
      />
      <ChecklistRow
        status="failed"
        label="Invalidation latency under 200ms"
        meta={
          <span
            style={{
              color: 'var(--ds-color-status-critical)',
              fontWeight: 700,
            }}
          >
            FAILED
          </span>
        }
        onClick={() => {}}
      />
      <ChecklistRow
        status="pending"
        label="Browser-side TTL override persistence"
        meta="Not verified"
        onClick={() => {}}
      />
      <ChecklistRow
        status="passed"
        label="WAF integration compatibility"
        meta="Verified by JD"
        onClick={() => {}}
      />
    </CollapsibleCard>
  ),
};

export const AllPassed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'All scenarios passed: header uses the green `success` Badge variant, all rows show a passed status.',
      },
    },
  },
  render: () => (
    <CollapsibleCard
      defaultOpen
      header={headerWithBadge(
        <Badge variant="success">4/4 Passed</Badge>,
        'Verified 5m ago',
      )}
    >
      <ChecklistRow
        status="passed"
        label="Cache hit ratio check on US-East-1 staging"
        meta="Verified by JD"
        onClick={() => {}}
      />
      <ChecklistRow
        status="passed"
        label="Invalidation latency under 200ms"
        meta="Verified by JD"
        onClick={() => {}}
      />
      <ChecklistRow
        status="passed"
        label="Browser-side TTL override persistence"
        meta="Verified by AM"
        onClick={() => {}}
      />
      <ChecklistRow
        status="passed"
        label="WAF integration compatibility"
        meta="Verified by JD"
        onClick={() => {}}
      />
    </CollapsibleCard>
  ),
};

export const PartiallyVerified: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Partial verification: header uses the gray `todo` Badge variant; rows mix passed and pending statuses.',
      },
    },
  },
  render: () => (
    <CollapsibleCard
      defaultOpen
      header={headerWithBadge(
        <Badge variant="todo">2/4 Verified</Badge>,
        'Last verified 30m ago',
      )}
    >
      <ChecklistRow
        status="passed"
        label="Cache hit ratio check on US-East-1 staging"
        meta="Verified by JD"
        onClick={() => {}}
      />
      <ChecklistRow
        status="pending"
        label="Invalidation latency under 200ms"
        meta="Not verified"
        onClick={() => {}}
      />
      <ChecklistRow
        status="pending"
        label="Browser-side TTL override persistence"
        meta="Not verified"
        onClick={() => {}}
      />
      <ChecklistRow
        status="passed"
        label="WAF integration compatibility"
        meta="Verified by JD"
        onClick={() => {}}
      />
    </CollapsibleCard>
  ),
};

export const NotStarted: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'No scenarios verified yet: header uses the gray `todo` Badge variant and the meta shows that testing is still underway. All rows are pending.',
      },
    },
  },
  render: () => (
    <CollapsibleCard
      defaultOpen
      header={headerWithBadge(
        <Badge variant="todo">0/4 Verified</Badge>,
        'Testing in Progress',
      )}
    >
      <ChecklistRow
        status="pending"
        label="Cache hit ratio check on US-East-1 staging"
        meta="Not verified"
        onClick={() => {}}
      />
      <ChecklistRow
        status="pending"
        label="Invalidation latency under 200ms"
        meta="Not verified"
        onClick={() => {}}
      />
      <ChecklistRow
        status="pending"
        label="Browser-side TTL override persistence"
        meta="Not verified"
        onClick={() => {}}
      />
      <ChecklistRow
        status="pending"
        label="WAF integration compatibility"
        meta="Not verified"
        onClick={() => {}}
      />
    </CollapsibleCard>
  ),
};
