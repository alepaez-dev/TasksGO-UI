import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../.storybook/preview';
import { BottomTabBar, type BottomTabBarProps } from './BottomTabBar';
import { Fab } from '../Fab';
import { NavItem } from '../NavItem';
import type { IconName } from '../../icons';

const meta: Meta<typeof BottomTabBar> = {
  title: 'Components/BottomTabBar',
  component: BottomTabBar,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Main navigation',
  },
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    layout: 'fullscreen',
    viewport: { options: mobileViewportOptions },
    docs: {
      description: {
        component:
          'Fixed-bottom mobile navigation bar. Intended for mobile viewports only — consumers are responsible for conditionally mounting it (e.g. via a media query or a mobile layout route), since the component itself does not hide on larger screens. BottomTabBar and Sidebar are mutually exclusive per viewport: a page should render one or the other, not both, since they create parallel navigation landmarks and represent the same concept for different form factors. Designed to host 3–5 vertical NavItems; behavior with more tabs is shown in the ManyTabs story.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BottomTabBar>;

interface Tab {
  id: string;
  icon: IconName;
  activeIcon?: IconName;
  label: string;
}

function InteractiveBar({
  tabs,
  ...args
}: BottomTabBarProps & { tabs: readonly Tab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  return (
    <BottomTabBar {...args}>
      {tabs.map((tab) => (
        <NavItem
          key={tab.id}
          icon={tab.icon}
          activeIcon={tab.activeIcon}
          label={tab.label}
          href={`#${tab.id}`}
          orientation="vertical"
          active={tab.id === activeId}
          onClick={(e) => {
            e.preventDefault();
            setActiveId(tab.id);
          }}
        />
      ))}
    </BottomTabBar>
  );
}

const defaultTabs: readonly Tab[] = [
  {
    id: 'tasks',
    icon: 'task_alt',
    activeIcon: 'check_circle',
    label: 'Tasks',
  },
  {
    id: 'tickets',
    icon: 'confirmation_number',
    activeIcon: 'confirmation_number_filled',
    label: 'Tickets',
  },
  {
    id: 'docs',
    icon: 'description',
    activeIcon: 'description_filled',
    label: 'Docs',
  },
  {
    id: 'more',
    icon: 'more_horiz',
    label: 'More',
  },
];

const longLabelTabs: readonly Tab[] = [
  {
    id: 'notifications',
    icon: 'task_alt',
    activeIcon: 'check_circle',
    label: 'Notifications',
  },
  {
    id: 'tickets',
    icon: 'confirmation_number',
    activeIcon: 'confirmation_number_filled',
    label: 'Support Tickets',
  },
  {
    id: 'docs',
    icon: 'description',
    activeIcon: 'description_filled',
    label: 'Documentation',
  },
  {
    id: 'more',
    icon: 'more_horiz',
    label: 'More',
  },
];

export const Default: Story = {
  render: (args) => <InteractiveBar {...args} tabs={defaultTabs} />,
};

export const WithLongLabels: Story = {
  render: (args) => <InteractiveBar {...args} tabs={longLabelTabs} />,
};

const manyTabs: readonly Tab[] = [
  {
    id: 'tasks',
    icon: 'task_alt',
    activeIcon: 'check_circle',
    label: 'Tasks',
  },
  {
    id: 'tickets',
    icon: 'confirmation_number',
    activeIcon: 'confirmation_number_filled',
    label: 'Tickets',
  },
  {
    id: 'docs',
    icon: 'description',
    activeIcon: 'description_filled',
    label: 'Docs',
  },
  {
    id: 'search',
    icon: 'search',
    label: 'Search',
  },
  {
    id: 'settings',
    icon: 'settings',
    label: 'Settings',
  },
  {
    id: 'more',
    icon: 'more_horiz',
    label: 'More',
  },
];

export const ManyTabs: Story = {
  render: (args) => <InteractiveBar {...args} tabs={manyTabs} />,
};

const fabOffsetOverride = {
  '--ds-space-fab-bottom-offset':
    'calc(var(--ds-space-bottom-tab-bar-height) + 24px)',
} as CSSProperties;

export const WithFab: Story = {
  render: (args) => (
    <div style={{ minHeight: '100vh', ...fabOffsetOverride }}>
      <Fab aria-label="New task" />
      <InteractiveBar {...args} tabs={defaultTabs} />
    </div>
  ),
};
