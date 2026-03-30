import { useCallback, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Selector, type SelectorProps } from './Selector';
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
  argTypes: {
    options: { control: 'object' },
    action: { control: 'object' },
  },
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

type RenderProps = Pick<SelectorProps, 'options' | 'action'>;

function DefaultRender({ options }: RenderProps) {
  const [value, setValue] = useState('eng-core');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  const avatar = avatars[value];
  return (
    <Selector
      ref={ref}
      options={options}
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
  args: { options: projects },
  render: (args) => <DefaultRender options={args.options} />,
};

function WithActionRender({ options, action }: RenderProps) {
  const [value, setValue] = useState('eng-core');
  const [open, setOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  const avatar = avatars[value];
  return (
    <Selector
      ref={ref}
      options={options}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={setOpen}
      triggerPrefix={
        <Avatar initial={avatar.initial} aria-label={avatar.label} />
      }
      action={action}
    />
  );
}

export const WithAction: Story = {
  args: {
    options: projects,
    action: {
      label: 'Add project',
      icon: 'add',
      onClick: () => {},
    },
  },
  render: (args) => (
    <WithActionRender options={args.options} action={args.action} />
  ),
};

function NoSelectionRender({ options }: RenderProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  const avatar = value ? avatars[value] : undefined;
  return (
    <Selector
      ref={ref}
      options={options}
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
  args: { options: projects },
  render: (args) => <NoSelectionRender options={args.options} />,
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

function IconOptionsRender({ options }: RenderProps) {
  const [value, setValue] = useState('high');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  return (
    <Selector
      ref={ref}
      options={options}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={setOpen}
      aria-label="Select priority"
    />
  );
}

export const IconOptions: Story = {
  args: { options: priorityOptions },
  render: (args) => <IconOptionsRender options={args.options} />,
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
      size="sm"
      emptyState="No results found"
      aria-label="Linked ticket"
    />
  );
}

export const Searchable: Story = {
  render: () => <SearchableRender />,
};
