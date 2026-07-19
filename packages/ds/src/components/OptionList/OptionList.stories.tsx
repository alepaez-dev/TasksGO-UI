import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OptionList } from './OptionList';
import { SearchInput } from '../SearchInput';

const people = [
  { value: 'alex', label: 'Alex H.' },
  { value: 'cleo', label: 'Cleo H.' },
  { value: 'vader', label: 'Vader P.' },
];

const priorities = [
  {
    value: 'critical',
    label: 'Critical',
    icon: 'flag' as const,
    iconColor: 'var(--ds-color-status-critical)',
  },
  {
    value: 'high',
    label: 'High',
    icon: 'flag' as const,
    iconColor: 'var(--ds-color-status-high)',
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: 'flag' as const,
    iconColor: 'var(--ds-color-status-medium)',
  },
  {
    value: 'low',
    label: 'Low',
    icon: 'flag' as const,
    iconColor: 'var(--ds-color-status-low)',
  },
];

const tickets = [
  { value: 'T-42', label: 'Implement dynamic edge-caching', prefix: 'T-42' },
  { value: 'T-104', label: 'Unit tests for cache logic', prefix: 'T-104' },
  { value: 'T-105', label: 'Update staging config', prefix: 'T-105' },
];

const environments = [
  { value: 'qa-01', label: 'QA-01', meta: 'Unstable' },
  { value: 'qa-02', label: 'QA-02', meta: 'Stable' },
  { value: 'staging', label: 'Staging', meta: 'Stable' },
  { value: 'production', label: 'Production', meta: 'Healthy' },
];

const meta: Meta<typeof OptionList> = {
  title: 'Components/OptionList',
  component: OptionList,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 320,
          padding: 'var(--ds-space-scale-xs) 0',
          border: '1px solid var(--ds-color-border-default)',
          borderRadius: 'var(--ds-radius-2xl)',
          background: 'var(--ds-color-surface-primary)',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OptionList>;

function DefaultRender() {
  const [value, setValue] = useState('alex');
  return (
    <OptionList
      options={people}
      value={value}
      onSelect={setValue}
      aria-label="Members"
    />
  );
}

function IconOptionsRender() {
  const [value, setValue] = useState('high');
  return (
    <OptionList
      options={priorities}
      value={value}
      onSelect={setValue}
      aria-label="Priority"
    />
  );
}

function WithSearchHeaderRender() {
  const [value, setValue] = useState('alex');
  const [query, setQuery] = useState('');
  const filtered = query
    ? people.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
    : people;
  return (
    <OptionList
      options={filtered}
      value={value}
      onSelect={setValue}
      header={
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members..."
          aria-label="Search members"
          size="sm"
        />
      }
      emptyState="No members found"
      aria-label="Members"
    />
  );
}

function WithActionRender() {
  const [value, setValue] = useState('T-42');
  return (
    <OptionList
      options={tickets}
      value={value}
      onSelect={setValue}
      action={{ label: 'Create new ticket', icon: 'add', onClick: () => {} }}
      aria-label="Linked ticket"
    />
  );
}

function WithMetaRender() {
  const [value, setValue] = useState('qa-02');
  return (
    <OptionList
      options={environments}
      value={value}
      onSelect={setValue}
      action={{
        label: 'Manage environments',
        icon: 'settings',
        onClick: () => {},
      }}
      aria-label="Switch environment"
    />
  );
}

export const Default: Story = { render: () => <DefaultRender /> };
export const IconOptions: Story = { render: () => <IconOptionsRender /> };
export const WithSearchHeader: Story = {
  render: () => <WithSearchHeaderRender />,
};
export const WithAction: Story = { render: () => <WithActionRender /> };
export const WithMeta: Story = { render: () => <WithMetaRender /> };

export const EmptyState: Story = {
  render: () => (
    <OptionList
      options={[]}
      onSelect={() => {}}
      emptyState="No results found"
      aria-label="Results"
    />
  ),
};
