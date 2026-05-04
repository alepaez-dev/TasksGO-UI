import { useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../.storybook/decorators';
import {
  desktopViewports,
  mobileViewportOptions,
} from '../../../.storybook/preview';
import { Header } from './Header';
import { Breadcrumb } from '../Breadcrumb';
import { SearchInput } from '../SearchInput';
import {
  SearchPalette,
  getSearchPaletteOptionId,
  type SearchPaletteGroup,
} from '../SearchPalette';
import { BottomSheet } from '../BottomSheet';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { NavItem } from '../NavItem';
import { SectionHeader } from '../SectionHeader';
import searchPillStyles from '../../stories/helpers/searchPill.module.css';
import headerLayoutStyles from '../../stories/helpers/headerLayout.module.css';

const allResults: SearchPaletteGroup[] = [
  {
    title: 'Tasks',
    results: [
      {
        id: 'r1',
        label: 'Refactor Kubernetes service discovery',
        badge: 'HIGH',
        subtitle: 'IN PROGRESS \u00b7 TODAY',
        type: 'task',
      },
      {
        id: 'r2',
        label: 'Kube-proxy iptables sync timeout',
        badge: 'MED',
        subtitle: 'OPEN \u00b7 DEC 23',
        type: 'task',
      },
    ],
  },
  {
    title: 'Docs',
    results: [
      {
        id: 'r4',
        label: 'Architecture \u00b7 Kubernetes topology',
        subtitle: 'EDITED 2D AGO',
        type: 'doc',
      },
    ],
  },
  {
    title: 'Tickets',
    results: [
      {
        id: 'r3',
        label: 'TGO-2891 \u2014 Kubelet eviction loop',
        subtitle: 'MARIA C \u00b7 YESTERDAY',
        type: 'ticket',
      },
    ],
  },
];

function filterGroups(query: string): SearchPaletteGroup[] {
  const q = query.toLowerCase();
  return allResults
    .map((group) => ({
      ...group,
      results: group.results.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          (r.badge?.toLowerCase().includes(q) ?? false),
      ),
    }))
    .filter((group) => group.results.length > 0);
}

function DefaultRender() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | undefined>();
  const groups = query.length > 0 ? filterGroups(query) : [];

  return (
    <Header
      left={
        <Breadcrumb
          segments={[
            { label: 'Tasks', href: '/tasks' },
            { label: 'Calm Execution' },
          ]}
        />
      }
      center={
        <>
          <SearchInput
            role="combobox"
            placeholder="Search or command..."
            shortcutHint="⌘K"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveId(undefined);
            }}
            aria-expanded={groups.length > 0}
            aria-controls={groups.length > 0 ? 'search-palette' : undefined}
            aria-activedescendant={
              activeId
                ? getSearchPaletteOptionId('search-palette', activeId)
                : undefined
            }
          />
          {groups.length > 0 && (
            <SearchPalette
              id="search-palette"
              groups={groups}
              activeResultId={activeId}
              onResultSelect={(result) => {
                setActiveId(result.id);
                setQuery(result.label);
              }}
              aria-label="Search results"
            />
          )}
        </>
      }
      right={
        <>
          <Button size="sm">
            <Icon name="add" size="sm" />
            New task
          </Button>
          <Avatar initial="AD" variant="profile" aria-label="Alejandra D" />
        </>
      }
    />
  );
}

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    compact: {
      description:
        'Mobile layout mode. Reduces padding and absolute-centers `center` so the title stays optically centered against the left and right slots.',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => <DefaultRender />,
  parameters: { viewport: { options: desktopViewports } },
};

export const LeftOnly: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: {
    left: (
      <Breadcrumb
        segments={[
          { label: 'Tasks', href: '/tasks' },
          { label: 'Calm Execution' },
        ]}
      />
    ),
    right: (
      <>
        <Button size="sm">
          <Icon name="add" size="sm" />
          New task
        </Button>
        <Avatar initial="AP" variant="profile" aria-label="Alejandra Paez" />
      </>
    ),
  },
};

function MobileRender() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useCallback((node: HTMLInputElement | null) => {
    node?.focus();
  }, []);

  const mobileGroups = query.length > 0 ? filterGroups(query) : [];

  function handleSearchClose() {
    setSearchOpen(false);
    setQuery('');
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header
        compact
        left={
          <div className={headerLayoutStyles.projectRow}>
            <Avatar
              initial="E"
              variant="project"
              aria-label="Engineering Core"
            />
            <span className={headerLayoutStyles.pageTitle}>Tasks</span>
          </div>
        }
        right={
          <>
            <IconButton
              icon="search"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            />
            <Avatar initial="AP" variant="profile" aria-label="Ale Paez" />
          </>
        }
      />

      <BottomSheet
        open={searchOpen}
        onClose={handleSearchClose}
        fullHeight
        aria-label="Search"
      >
        <div className={headerLayoutStyles.searchSheetHeader}>
          <SearchInput
            ref={searchRef}
            placeholder="Jump to task"
            size="sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={query ? () => setQuery('') : undefined}
            borderless
            className={searchPillStyles.searchPill}
            style={{ fontSize: 16 }}
          />
          <button
            type="button"
            className={headerLayoutStyles.cancelButton}
            onClick={handleSearchClose}
          >
            Cancel
          </button>
        </div>

        {mobileGroups.length > 0 ? (
          <SearchPalette
            groups={mobileGroups}
            onResultSelect={() => handleSearchClose()}
            variant="mobile"
            aria-label="Search results"
          />
        ) : (
          <>
            <SectionHeader headingLevel={3}>Jump to</SectionHeader>
            <nav aria-label="Jump to">
              <NavItem icon="task_alt" label="All tasks" href="#tasks" />
              <NavItem
                icon="confirmation_number"
                label="All tickets"
                href="#tickets"
              />
              <NavItem icon="description" label="All docs" href="#docs" />
            </nav>
          </>
        )}
      </BottomSheet>
    </div>
  );
}

export const Mobile: Story = {
  render: () => <MobileRender />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions,
    },
  },
};
