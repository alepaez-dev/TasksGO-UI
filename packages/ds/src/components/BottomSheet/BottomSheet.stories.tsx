import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../.storybook/preview';
import { BottomSheet } from './BottomSheet';
import { BottomTabBar } from '../BottomTabBar';
import { NavItem } from '../NavItem';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { SectionHeader } from '../SectionHeader';
import { StatusDot } from '../StatusDot';
import { ProjectPicker, type ProjectPickerProject } from '../ProjectPicker';
import styles from './BottomSheet.stories.module.css';

const meta: Meta<typeof BottomSheet> = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    layout: 'fullscreen',
    viewport: { options: mobileViewportOptions },
    docs: {
      description: {
        component:
          'A modal dialog that slides up from the bottom edge. Content-driven height with a max-height cap. Closes via backdrop tap, Escape key, or drag-down gesture. Renders via a portal with focus trap and scroll lock. Use for mobile menus, action sheets, and contextual content that does not warrant a full-screen takeover.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BottomSheet>;

function Wrapper({
  children,
}: {
  children: (open: boolean, toggle: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  return <>{children(open, toggle)}</>;
}

export const Default: Story = {
  render: () => (
    <Wrapper>
      {(open, toggle) => (
        <>
          <div style={{ padding: 24 }}>
            <button type="button" onClick={toggle}>
              Open sheet
            </button>
          </div>
          <BottomSheet open={open} onClose={toggle} aria-label="Demo sheet">
            <p style={{ margin: 0 }}>Sheet content goes here.</p>
          </BottomSheet>
        </>
      )}
    </Wrapper>
  ),
};

const moreMenuProjects: ProjectPickerProject[] = [
  {
    value: 'eng-core',
    label: 'Engineering Core',
    initial: 'E',
    avatarColor: '#4f6f8f',
  },
  {
    value: 'mudatec',
    label: 'Mudatec',
    initial: 'M',
    avatarColor: '#856D4A',
  },
  {
    value: 'tasksgo',
    label: 'TasksGo',
    initial: 'T',
    avatarColor: '#5e778f',
  },
];

type MoreMenuView = 'menu' | 'picker';

function MoreMenuContent({
  onSwitchProject,
  projectLabel,
  projectInitial,
  projectColor,
}: {
  onSwitchProject: () => void;
  projectLabel: string;
  projectInitial: string;
  projectColor?: string;
}) {
  return (
    <>
      <div className={styles.section}>
        <SectionHeader headingLevel={3}>Project</SectionHeader>
        <button
          type="button"
          className={styles.projectRow}
          onClick={onSwitchProject}
        >
          <Avatar
            initial={projectInitial}
            variant="project"
            aria-label={projectLabel}
            style={projectColor ? { backgroundColor: projectColor } : undefined}
          />
          <span className={styles.projectLabel}>{projectLabel}</span>
          <Icon name="chevron_right" size="sm" />
        </button>
      </div>

      <div className={styles.section}>
        <SectionHeader headingLevel={3}>Account</SectionHeader>
        <div className={styles.profileRow}>
          <Avatar initial="AP" variant="profile" aria-label="Ale Paez" />
          <div className={styles.nameBlock}>
            <span className={styles.name}>Ale Paez</span>
            <span className={styles.email}>ale@example.com</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <SectionHeader headingLevel={3}>Workspace</SectionHeader>
        <nav aria-label="Workspace navigation" className={styles.workspaceNav}>
          <NavItem icon="settings" label="Settings" href="#settings" />
          <NavItem icon="help" label="Support" href="#support" />
        </nav>
      </div>

      <div>
        <SectionHeader headingLevel={3}>System Status</SectionHeader>
        <div className={styles.statusRow}>
          <StatusDot variant="active" label="Operational" />
          <span className={styles.statusLabel}>Stable</span>
        </div>
      </div>
    </>
  );
}

function MoreMenuWithPicker({
  projects = moreMenuProjects,
}: {
  projects?: ProjectPickerProject[];
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<MoreMenuView>('menu');
  const [project, setProject] = useState('eng-core');
  const [query, setQuery] = useState('');

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (!next) {
      setView('menu');
      setQuery('');
    }
  };

  const activeProject = projects.find((p) => p.value === project);

  return (
    <>
      <BottomTabBar aria-label="Main navigation">
        <NavItem
          icon="task_alt"
          activeIcon="check_circle"
          label="Tasks"
          href="#tasks"
          orientation="vertical"
          active
        />
        <NavItem
          icon="confirmation_number"
          activeIcon="confirmation_number_filled"
          label="Tickets"
          href="#tickets"
          orientation="vertical"
        />
        <NavItem
          icon="description"
          activeIcon="description_filled"
          label="Docs"
          href="#docs"
          orientation="vertical"
        />
        <NavItem
          icon="more_horiz"
          label="More"
          href="#more"
          orientation="vertical"
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
        />
      </BottomTabBar>
      <BottomSheet
        open={open}
        onClose={toggle}
        aria-label={view === 'menu' ? 'More menu' : 'Switch project'}
      >
        <div style={{ overflowX: 'clip' }}>
          <div
            className={styles.slider}
            style={{
              transform:
                view === 'picker' ? 'translateX(-100%)' : 'translateX(0)',
            }}
          >
            <div className={styles.panel} inert={view !== 'menu' || undefined}>
              <MoreMenuContent
                onSwitchProject={() => setView('picker')}
                projectLabel={activeProject?.label ?? ''}
                projectInitial={activeProject?.initial ?? ''}
                projectColor={activeProject?.avatarColor}
              />
            </div>
            <div
              className={styles.panel}
              inert={view !== 'picker' || undefined}
            >
              {view === 'picker' && (
                <ProjectPicker
                  projects={projects}
                  value={project}
                  onSelect={setProject}
                  onBack={() => {
                    setView('menu');
                    setQuery('');
                  }}
                  query={query}
                  onQueryChange={setQuery}
                />
              )}
            </div>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

export const MoreMenu: Story = {
  render: () => <MoreMenuWithPicker />,
};

const manyProjects: ProjectPickerProject[] = [
  {
    value: 'eng-core',
    label: 'Engineering Core',
    initial: 'E',
    avatarColor: '#4f6f8f',
  },
  { value: 'mudatec', label: 'Mudatec', initial: 'M', avatarColor: '#856D4A' },
  { value: 'tasksgo', label: 'TasksGo', initial: 'T', avatarColor: '#5e778f' },
  {
    value: 'atlas',
    label: 'Atlas Platform',
    initial: 'A',
    avatarColor: '#6B8E5A',
  },
  {
    value: 'beacon',
    label: 'Beacon Analytics',
    initial: 'B',
    avatarColor: '#8B6F4E',
  },
  {
    value: 'coral',
    label: 'Coral Design System',
    initial: 'C',
    avatarColor: '#C46B5A',
  },
  {
    value: 'delta',
    label: 'Delta Infra',
    initial: 'D',
    avatarColor: '#5A7B8C',
  },
  {
    value: 'echo',
    label: 'Echo Notifications',
    initial: 'E',
    avatarColor: '#7B6B8E',
  },
  {
    value: 'falcon',
    label: 'Falcon Deploys',
    initial: 'F',
    avatarColor: '#5E8B6A',
  },
  {
    value: 'granite',
    label: 'Granite Storage',
    initial: 'G',
    avatarColor: '#8E7B5A',
  },
  {
    value: 'harbor',
    label: 'Harbor Gateway',
    initial: 'H',
    avatarColor: '#6A5E8B',
  },
  {
    value: 'iris',
    label: 'Iris Identity',
    initial: 'I',
    avatarColor: '#5A8E7B',
  },
  {
    value: 'jade',
    label: 'Jade Observability',
    initial: 'J',
    avatarColor: '#8B5E6A',
  },
  { value: 'kite', label: 'Kite Mobile', initial: 'K', avatarColor: '#5A6B8E' },
  {
    value: 'lunar',
    label: 'Lunar Billing',
    initial: 'L',
    avatarColor: '#8E5A7B',
  },
];

export const MoreMenuManyProjects: Story = {
  render: () => <MoreMenuWithPicker projects={manyProjects} />,
};

function LongContent() {
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className={styles.section}>
          Item {i + 1}
        </div>
      ))}
    </>
  );
}

export const WithLongContent: Story = {
  render: () => (
    <Wrapper>
      {(open, toggle) => (
        <>
          <div style={{ padding: 24 }}>
            <button type="button" onClick={toggle}>
              Open sheet with scrollable content
            </button>
          </div>
          <BottomSheet
            open={open}
            onClose={toggle}
            aria-label="Scrollable sheet"
          >
            <LongContent />
          </BottomSheet>
        </>
      )}
    </Wrapper>
  ),
};
