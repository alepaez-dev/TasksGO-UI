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
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import storyStyles from './Header.stories.module.css';

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
        'Mobile layout mode. Reduces padding and changes how `center` renders: absolute-centered title when `right` is present, or full-width (e.g. search takeover) when `right` is absent.',
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
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useCallback((node: HTMLInputElement | null) => {
    node?.focus();
  }, []);

  const mobileGroups = query.length > 0 ? filterGroups(query) : [];

  return (
    <div style={{ minHeight: '100vh' }}>
      {searching ? (
        <>
          <Header
            compact
            left={
              <IconButton
                icon="chevron_left"
                size="md"
                aria-label="Close search"
                onClick={() => {
                  setSearching(false);
                  setQuery('');
                }}
              />
            }
            center={
              <SearchInput
                ref={searchRef}
                placeholder="Search..."
                size="sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={query ? () => setQuery('') : undefined}
                className={storyStyles.searchPill}
                style={{ fontSize: 16 }}
              />
            }
          />
          {mobileGroups.length > 0 && (
            <SearchPalette
              groups={mobileGroups}
              onResultSelect={() => {}}
              variant="mobile"
              aria-label="Search results"
            />
          )}
        </>
      ) : (
        <Header
          compact
          left={
            <div className={storyStyles.projectRow}>
              <Avatar
                initial="E"
                variant="project"
                aria-label="Engineering Core"
              />
              <span className={storyStyles.pageTitle}>Tasks</span>
            </div>
          }
          right={
            <>
              <IconButton
                icon="search"
                aria-label="Search"
                onClick={() => setSearching(true)}
              />
              <Avatar initial="AP" variant="profile" aria-label="Ale Paez" />
            </>
          }
        />
      )}
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
