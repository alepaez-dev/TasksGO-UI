import { useCallback, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Selector } from './Selector';
import { Avatar } from '../Avatar';
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
  component: Selector,
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
