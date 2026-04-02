import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Selector, type SelectorProps } from './Selector';
import { Avatar } from '../Avatar';
import { SearchInput } from '../SearchInput';
import { useSelectorState } from '../../hooks/useSelector';

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
  parameters: {
    docs: {
      description: {
        component: [
          'Selector is fully controlled — pair it with a state hook:',
          '- **`useSelectorState`** — standalone selector with click-outside detection.',
          '- **`useSelectorGroup`** — multiple selectors with mutual exclusion (only one open at a time). Use `useSelectorState` instead when selectors are independent and may open simultaneously.',
        ].join('\n'),
      },
    },
  },
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
  const { ref, open, onOpenChange } = useSelectorState();
  const avatar = avatars[value];
  return (
    <Selector
      ref={ref}
      options={options}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={onOpenChange}
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
  const { ref, open, onOpenChange } = useSelectorState();
  const avatar = avatars[value];
  return (
    <Selector
      ref={ref}
      options={options}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={onOpenChange}
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
  const { ref, open, onOpenChange } = useSelectorState();
  const avatar = value ? avatars[value] : undefined;
  return (
    <Selector
      ref={ref}
      options={options}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={onOpenChange}
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
  const { ref, open, onOpenChange } = useSelectorState();
  return (
    <Selector
      ref={ref}
      options={options}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={onOpenChange}
      variant="inline"
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
  const [query, setQuery] = useState('');
  const { ref, open, onOpenChange } = useSelectorState();

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
      onOpenChange={onOpenChange}
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
      variant="inline"
      emptyState="No results found"
      aria-label="Linked ticket"
    />
  );
}

export const Searchable: Story = {
  render: () => <SearchableRender />,
};

const manyOptions = Array.from({ length: 20 }, (_, i) => ({
  value: `opt-${i + 1}`,
  label: `Option ${i + 1}`,
}));

function ManyOptionsRender({ options }: RenderProps) {
  const [value, setValue] = useState('opt-1');
  const { ref, open, onOpenChange } = useSelectorState();
  return (
    <Selector
      ref={ref}
      options={options}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={onOpenChange}
      aria-label="Many options"
    />
  );
}

export const ManyOptions: Story = {
  args: { options: manyOptions },
  render: (args) => <ManyOptionsRender options={args.options} />,
};

const members = [
  { value: 'ale', label: 'Ale H.', initial: 'AH', color: '#7D9B84' },
  { value: 'cleo', label: 'Cleo H.', initial: 'CH', color: '#C38E70' },
  { value: 'vader', label: 'Vader P.', initial: 'VP', color: '#6C89A8' },
  { value: 'loki', label: 'Loki P.', initial: 'LP', color: '#7B6FA0' },
];

function AvatarOptionsRender() {
  const [value, setValue] = useState('ale');
  const [query, setQuery] = useState('');
  const { ref, open, onOpenChange } = useSelectorState();

  const filtered = query
    ? members.filter((m) => m.label.toLowerCase().includes(query.toLowerCase()))
    : members;

  const selected = members.find((m) => m.value === value);

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
      onOpenChange={onOpenChange}
      header={
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members..."
          size="sm"
        />
      }
      triggerPrefix={
        <Avatar
          variant="profile"
          initial={selected?.initial ?? '?'}
          aria-label={selected?.label ?? 'No assignee'}
          style={
            selected?.color ? { backgroundColor: selected.color } : undefined
          }
        />
      }
      renderTriggerLabel={(opt) => opt.label}
      renderOptionIndicator={(opt) => {
        const member = members.find((m) => m.value === opt.value);
        return member ? (
          <Avatar
            variant="profile"
            size="sm"
            initial={member.initial}
            aria-label={member.label}
            style={{ backgroundColor: member.color }}
          />
        ) : null;
      }}
      variant="inline"
      emptyState="No members found"
      aria-label="Select assignee"
    />
  );
}

export const AvatarOptions: Story = {
  render: () => <AvatarOptionsRender />,
};
