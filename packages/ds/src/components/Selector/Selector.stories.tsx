import { useCallback, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Selector } from './Selector';
import { Avatar } from '../Avatar';
import { SearchInput } from '../SearchInput';
import { useClickOutside } from '../../hooks/useClickOutside';

const projects = [
  { value: 'eng-core', label: 'Engineering Core' },
  { value: 'mudatec', label: 'Mudatec' },
  { value: 'tasksgo', label: 'TasksGo' },
];

const avatars: Record<string, { initial: string; label: string }> = {
  'eng-core': { initial: 'E', label: 'Engineering Core' },
  mudatec: { initial: 'M', label: 'Mudatec' },
  tasksgo: { initial: 'T', label: 'TasksGo' },
};

const meta: Meta<typeof Selector> = {
  title: 'Components/Selector',
  component: Selector,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '256px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Selector>;

function DefaultRender() {
  const [value, setValue] = useState('eng-core');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  const avatar = avatars[value];
  return (
    <Selector
      ref={ref}
      options={projects}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={setOpen}
      triggerPrefix={
        <Avatar initial={avatar.initial} aria-label={avatar.label} />
      }
    />
  );
}

export const Default: Story = {
  render: () => <DefaultRender />,
};

function WithActionRender() {
  const [value, setValue] = useState('eng-core');
  const [open, setOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  const avatar = avatars[value];
  return (
    <Selector
      ref={ref}
      options={projects}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={setOpen}
      triggerPrefix={
        <Avatar initial={avatar.initial} aria-label={avatar.label} />
      }
      action={{
        label: 'Add project',
        icon: 'add',
        onClick: () => {},
      }}
    />
  );
}

export const WithAction: Story = {
  render: () => <WithActionRender />,
};

function NoSelectionRender() {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  const avatar = value ? avatars[value] : undefined;
  return (
    <Selector
      ref={ref}
      options={projects}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={setOpen}
      placeholder="Choose project…"
      triggerPrefix={
        avatar ? (
          <Avatar initial={avatar.initial} aria-label={avatar.label} />
        ) : (
          <Avatar initial="?" aria-label="No project selected" />
        )
      }
    />
  );
}

export const NoSelection: Story = {
  render: () => <NoSelectionRender />,
};

const priorityOptions = [
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

function IconOptionsRender() {
  const [value, setValue] = useState('high');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  return (
    <Selector
      ref={ref}
      options={priorityOptions}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={setOpen}
      dropdownAlign="end"
      aria-label="Select priority"
    />
  );
}

export const IconOptions: Story = {
  render: () => <IconOptionsRender />,
};

const allTickets = [
  { value: 'T-42', label: 'Implement dynamic edge-caching...', prefix: 'T-42' },
  {
    value: 'T-104',
    label: 'Implement unit tests for cache logic',
    prefix: 'T-104',
  },
  {
    value: 'T-105',
    label: 'Update staging environment config',
    prefix: 'T-105',
  },
] as const;

function SearchableRender() {
  const [value, setValue] = useState('T-42');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  const filtered = query
    ? allTickets.filter(
        (t) =>
          t.label.toLowerCase().includes(query.toLowerCase()) ||
          t.prefix.toLowerCase().includes(query.toLowerCase()),
      )
    : [...allTickets];

  return (
    <Selector
      ref={ref}
      options={filtered}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        setQuery('');
      }}
      open={open}
      onOpenChange={setOpen}
      header={
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tickets..."
          size="sm"
        />
      }
      action={{
        label: 'Create new ticket',
        icon: 'add' as const,
        onClick: () => {},
      }}
      emptyState="No results found"
      aria-label="Linked ticket"
    />
  );
}

export const Searchable: Story = {
  render: () => <SearchableRender />,
};
