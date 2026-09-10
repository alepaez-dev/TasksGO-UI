import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { iconRegistry, type IconName } from '../../icons';
import { Fab } from './Fab';
import { BottomTabBar } from '../BottomTabBar';
import { NavItem } from '../NavItem';
import { withDefaultViewport } from '../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../.storybook/preview';

const fabOffsetOverride = {
  '--ds-space-fab-bottom-offset':
    'var(--ds-space-fab-bottom-offset-above-tab-bar)',
} as CSSProperties;

const iconNames = Object.keys(iconRegistry) as IconName[];

const meta = {
  title: 'Components/Fab',
  component: Fab,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'select', options: iconNames },
    disabled: { control: 'boolean' },
  },
  args: {
    icon: 'add',
    'aria-label': 'New task',
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomIcon: Story = {
  args: { icon: 'auto_awesome', 'aria-label': 'Generate with AI' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Extended: Story = {
  render: () => <Fab label="Add scenario" />,
};

export const ExtendedLongLabel: Story = {
  name: 'Extended (label longer than the viewport)',
  decorators: [withDefaultViewport('mobileSmall')],
  parameters: { viewport: { options: mobileViewportOptions } },
  render: () => <Fab label="Add a regression scenario for the gateway" />,
};

export const ExtendedAboveTabBar: Story = {
  decorators: [withDefaultViewport('mobile')],
  parameters: { viewport: { options: mobileViewportOptions } },
  render: () => (
    <div style={{ minHeight: '100vh', ...fabOffsetOverride }}>
      <Fab label="Add scenario" />
      <BottomTabBar aria-label="Main navigation">
        <NavItem
          icon="task_alt"
          activeIcon="check_circle"
          label="Tasks"
          href="#tasks"
          orientation="vertical"
        />
        <NavItem
          icon="confirmation_number"
          activeIcon="confirmation_number_filled"
          label="Tickets"
          href="#tickets"
          orientation="vertical"
          active
        />
      </BottomTabBar>
    </div>
  ),
};
