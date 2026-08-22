import { useEffect, useRef, useState, type TouchEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../../.storybook/preview';
import { Header } from '../../../components/Header';
import { Avatar } from '../../../components/Avatar';
import { AvatarGroup } from '../../../components/AvatarGroup';
import { IconButton } from '../../../components/IconButton';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { Badge } from '../../../components/Badge';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { TicketTitleBlock } from '../../../components/TicketTitleBlock';
import { Tabs, getTabId, getTabPanelId } from '../../../components/Tabs';
import { SectionHeader } from '../../../components/SectionHeader';
import { CollapsibleCard } from '../../../components/CollapsibleCard';
import { EditableMarkdown } from '../../../components/EditableMarkdown';
import { ChecklistRow } from '../../../components/ChecklistRow';
import { BottomTabBar } from '../../../components/BottomTabBar';
import { NavItem } from '../../../components/NavItem';
import { BottomSheet } from '../../../components/BottomSheet';
import { PropertyRow } from '../../../components/PropertyRow';
import { RefLink } from '../../../components/RefLink';
import { TaskEditDrawer } from '../../helpers/TaskEditDrawer';
import {
  Scratchpad,
  type ScratchpadLine,
} from '../../../components/Scratchpad';
import { OptionList } from '../../../components/OptionList';
import { PipelineHierarchyPanel } from '../../../components/PipelineHierarchyPanel';
import { SearchInput } from '../../../components/SearchInput';
import { ExternalLink } from '../../../components/ExternalLink';
import { useMarkdownEditor } from '../../../hooks/useMarkdownEditor';
import { cn } from '../../../utils/cn';
import { sanitizeHref } from '../../../utils/sanitizeHref';
import type { IconName } from '../../../icons';
import { useTicketOverviewState } from './useTicketOverviewState';
import { filterPullRequests } from './filterPullRequests';
import {
  PR_BADGE,
  devScratchpadTask,
  type DevData,
  getPerson,
  getPriorityOption,
  getProject,
  getStatusOption,
  peopleOptions,
  priorityOptions,
  statusOptions,
  tabs,
  ticket,
} from './shared';
import headerLayoutStyles from '../../helpers/headerLayout.module.css';
import styles from './TicketOverviewMobile.module.css';

const TAB_ID_PREFIX = 'ticket-overview-mobile';

type TicketCiStatus = DevData['repository']['ci']['status'];

const uploadImage = (file: File) => Promise.resolve(URL.createObjectURL(file));

type DetailsView = 'metadata' | 'pipeline' | 'pullRequests' | 'commits';

const DETAILS_VIEW_LABEL = {
  metadata: 'Ticket details',
  pipeline: 'Pipeline',
  pullRequests: 'Pull requests',
  commits: 'Commits',
} as const satisfies Record<DetailsView, string>;

const CI_ICON = {
  passing: 'check_circle',
  failing: 'cancel',
  running: 'schedule',
} as const satisfies Record<TicketCiStatus, IconName>;

const CI_CLASS: Record<TicketCiStatus, string> = {
  passing: styles.ciPassing,
  failing: styles.ciFailing,
  running: styles.ciRunning,
};

function TicketOverviewMobileRender({
  scratchpadSeed,
}: {
  scratchpadSeed?: readonly ScratchpadLine[];
}) {
  const {
    activeTab,
    setActiveTab,
    body,
    setBody,
    bodyEditing,
    setBodyEditing,
    assignee,
    setAssignee,
    assigneeSelector: {
      open: assigneeOpen,
      onOpenChange: onAssigneeOpenChange,
    },
    reporter,
    setReporter,
    reporterSelector: {
      open: reporterOpen,
      onOpenChange: onReporterOpenChange,
    },
    status,
    setStatus,
    statusSelector: { open: statusOpen, onOpenChange: onStatusOpenChange },
    priority,
    setPriority,
    prioritySelector: {
      open: priorityOpen,
      onOpenChange: onPriorityOpenChange,
    },
    pipelineStages,
    setPipelineStages,
    activeStage,
    setActiveStage,
    addingStage,
    addStageDraft,
    addStageMessage,
    openAddStage,
    setAddStageDraft,
    confirmAddStage,
    cancelAddStage,
    branch,
    branchCopied,
    copyBranch,
    scratchpad,
    viewingTask,
    taskForm,
    setTaskForm,
    openTaskDrawer,
    closeTaskDrawer,
    taskDrawerTitle,
    taskSelectors,
  } = useTicketOverviewState(scratchpadSeed);
  const activeProject = getProject('eng-core');
  const activeAssignee = getPerson(assignee);
  const activeReporter = getPerson(reporter);
  const activeStatus = getStatusOption(status);
  const activePriority = getPriorityOption(priority);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsView, setDetailsView] = useState<DetailsView>('metadata');
  const [prQuery, setPrQuery] = useState('');
  const filteredPullRequests = filterPullRequests(
    ticket.dev.pullRequests,
    prQuery,
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [condensed, setCondensed] = useState(false);

  const backButtonRef = useRef<HTMLButtonElement>(null);
  const drillOriginRef = useRef<HTMLElement | null>(null);
  const restoreDrillOrigin = useRef(false);

  const { wordCount, isUploading, textareaRef, applyAction, insertImageFiles } =
    useMarkdownEditor({
      value: body,
      setValue: setBody,
      onImageUpload: uploadImage,
    });
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const bodySnapshot = useRef(body);
  const hasMounted = useRef(false);
  useEffect(() => {
    // Only move focus on edit-mode transitions, not the initial mount.
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (bodyEditing) {
      textareaRef.current?.focus();
    } else {
      editButtonRef.current?.focus();
    }
  }, [bodyEditing, textareaRef]);

  useEffect(() => {
    const root = scrollRef.current;
    const target = titleRef.current;
    if (!root || !target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { root, threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (detailsView !== 'metadata') {
      backButtonRef.current?.focus();
    } else if (restoreDrillOrigin.current) {
      restoreDrillOrigin.current = false;
      drillOriginRef.current?.focus();
    }
  }, [detailsView]);

  const activeStageLabel = pipelineStages.find(
    (stage) => stage.value === activeStage,
  )?.label;
  const pipelineSummary = activeStageLabel
    ? `${pipelineStages.length} stages · ${activeStageLabel} active`
    : `${pipelineStages.length} stages`;

  function openDetails() {
    setDetailsView('metadata');
    setDetailsOpen(true);
  }

  function closeDetails() {
    cancelAddStage();
    setPrQuery('');
    setDetailsOpen(false);
  }

  function backToMetadata() {
    cancelAddStage();
    setPrQuery('');
    restoreDrillOrigin.current = true;
    setDetailsView('metadata');
  }

  return (
    <div className={styles.shell}>
      <Header
        compact
        left={
          <div className={headerLayoutStyles.projectRow}>
            <Avatar
              initial={activeProject.initial}
              variant="project"
              aria-label={activeProject.label}
              style={
                activeProject.avatarColor
                  ? { backgroundColor: activeProject.avatarColor }
                  : undefined
              }
            />
            {condensed ? (
              <span className={styles.headerCondensedTitle}>
                <span className={styles.condensedId}>{ticket.id}</span>
                <span className={styles.condensedName}>{ticket.title}</span>
              </span>
            ) : (
              <span className={headerLayoutStyles.pageTitle}>Tickets</span>
            )}
          </div>
        }
        right={
          <>
            <IconButton icon="search" aria-label="Search" />
            <Avatar initial="AP" variant="profile" aria-label="Ale Paez" />
          </>
        }
      />

      <div className={styles.scrollArea} ref={scrollRef}>
        <div className={styles.content}>
          <Breadcrumb segments={ticket.breadcrumb} />

          <div className={styles.titleBlock} ref={titleRef}>
            <TicketTitleBlock title={ticket.title} badges={ticket.badges} />
            <div className={styles.identityRow}>
              <AvatarGroup aria-label="Assignee and reporter">
                <Avatar
                  variant="profile"
                  size="sm"
                  initial={activeAssignee.initial}
                  aria-label={activeAssignee.label}
                  style={{ backgroundColor: activeAssignee.color }}
                />
                <Avatar
                  variant="profile"
                  size="sm"
                  initial={activeReporter.initial}
                  aria-label={activeReporter.label}
                  style={{ backgroundColor: activeReporter.color }}
                />
              </AvatarGroup>
              <Button
                variant="secondary"
                size="sm"
                className={styles.detailsButton}
                onClick={openDetails}
              >
                Details
                <Icon name="chevron_right" size="sm" />
              </Button>
            </div>
          </div>

          <div className={styles.stickyBar}>
            <Tabs
              items={tabs}
              value={activeTab}
              onValueChange={setActiveTab}
              size="sm"
              idPrefix={TAB_ID_PREFIX}
              aria-label="Ticket sections"
            />
          </div>

          <div
            role="tabpanel"
            id={getTabPanelId(TAB_ID_PREFIX, 'overview')}
            aria-labelledby={getTabId(TAB_ID_PREFIX, 'overview')}
            className={styles.overviewPanel}
            hidden={activeTab !== 'overview'}
          >
            <section className={styles.section}>
              <EditableMarkdown
                editing={bodyEditing}
                value={body}
                onChange={setBody}
                onRequestEdit={() => {
                  bodySnapshot.current = body;
                  setBodyEditing(true);
                }}
                onCancel={() => {
                  setBody(bodySnapshot.current);
                  setBodyEditing(false);
                }}
                onSave={() => setBodyEditing(false)}
                textareaRef={textareaRef}
                editButtonRef={editButtonRef}
                onAction={applyAction}
                wordCount={wordCount}
                isUploading={isUploading}
                onInsertImageFiles={insertImageFiles}
                editLabel="Edit ticket template"
                editButton="always"
                stickyHeader={false}
              />
            </section>

            <section className={styles.section}>
              <div className={styles.qaHeader}>
                <SectionHeader headingLevel={2}>QA Summary</SectionHeader>
                <span className={styles.autoGenerated}>
                  <Icon name="lock" size="sm" />
                  auto-generated
                </span>
              </div>
              <CollapsibleCard
                defaultOpen
                header={
                  <span className={styles.qaCardHeader}>
                    <span className={styles.qaCardTitle}>
                      {ticket.qaSummary.title}
                    </span>
                    <Badge variant="critical">
                      {ticket.qaSummary.failedCount} Failed
                    </Badge>
                    <span className={styles.qaCardMeta}>
                      {ticket.qaSummary.lastChecked}
                    </span>
                  </span>
                }
              >
                {ticket.qaSummary.items.map((item) => (
                  <ChecklistRow
                    key={item.id}
                    status={item.status}
                    label={item.label}
                    onClick={() => {}}
                    meta={
                      item.metaVariant ? (
                        <Badge variant={item.metaVariant}>{item.meta}</Badge>
                      ) : (
                        item.meta
                      )
                    }
                  />
                ))}
              </CollapsibleCard>
            </section>
          </div>

          {(['dev', 'qa', 'activity'] as const).map((tabValue) => (
            <div
              key={tabValue}
              role="tabpanel"
              id={getTabPanelId(TAB_ID_PREFIX, tabValue)}
              aria-labelledby={getTabId(TAB_ID_PREFIX, tabValue)}
              className={
                tabValue === 'dev' ? styles.devPanel : styles.tabPanelEmpty
              }
              hidden={activeTab !== tabValue}
            >
              {activeTab === tabValue &&
                (tabValue === 'dev' ? (
                  <Scratchpad
                    className={styles.devScratchpad}
                    aria-label="Dev scratchpad"
                    title="Scratchpad / Debug notes"
                    status="Auto-saved · 2m"
                    addLineLabel="Add a line…"
                    highlightBadges
                    formattingToolbar
                    toolbarPosition="above-header"
                    taskCardPresentation="sheet"
                    taskBadgeInfo={devScratchpadTask}
                    lines={scratchpad.lines}
                    onReorder={scratchpad.onReorder}
                    onLineTextChange={scratchpad.onLineTextChange}
                    onLineToggle={scratchpad.onLineToggle}
                    onLineDelete={scratchpad.onLineDelete}
                    onAddLine={scratchpad.onAddLine}
                    autoFocusLineId={scratchpad.autoFocusLineId}
                    editingLineId={scratchpad.editingLineId}
                    onLineStartEdit={scratchpad.onLineStartEdit}
                    onLineStopEdit={scratchpad.onLineStopEdit}
                    openBadgeId={scratchpad.openBadgeId}
                    openBadgeManagesFocus={scratchpad.openBadgeManagesFocus}
                    onBadgeOpenChange={scratchpad.onBadgeOpenChange}
                    onViewTask={openTaskDrawer}
                  />
                ) : (
                  'Nothing here yet.'
                ))}
            </div>
          ))}
        </div>
      </div>

      {activeTab !== 'dev' && (
        <div className={styles.actionBar}>
          <Button
            variant="primary"
            size="md"
            className={styles.addScenarioButton}
          >
            Add scenario
          </Button>
          <IconButton
            icon="more_horiz"
            aria-label="More actions"
            className={styles.moreButton}
          />
        </div>
      )}

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
        />
      </BottomTabBar>

      <BottomSheet
        open={detailsOpen}
        onClose={closeDetails}
        aria-label={DETAILS_VIEW_LABEL[detailsView]}
      >
        <div className={styles.sheetViewport}>
          <div
            className={styles.slider}
            style={{
              transform:
                detailsView === 'metadata'
                  ? 'translateX(0)'
                  : 'translateX(-100%)',
            }}
          >
            <div
              className={styles.panel}
              inert={detailsView !== 'metadata' || undefined}
            >
              <div className={styles.sheetHeader}>
                <span className={styles.sheetTitle}>Details</span>
                <div className={styles.sheetHeaderRight}>
                  <span className={styles.sheetTicketId}>{ticket.id}</span>
                  <IconButton
                    icon="close"
                    aria-label="Close details"
                    onClick={closeDetails}
                  />
                </div>
              </div>

              <SectionHeader headingLevel={2}>Metadata</SectionHeader>
              <div className={styles.metadataList}>
                <PropertyRow
                  icon="person"
                  label="Assignee"
                  onClick={() => onAssigneeOpenChange(true)}
                  valueLabel={`Assignee: ${activeAssignee.label}`}
                >
                  <Avatar
                    variant="profile"
                    size="sm"
                    initial={activeAssignee.initial}
                    aria-label={activeAssignee.label}
                    style={{ backgroundColor: activeAssignee.color }}
                  />
                  <span>{activeAssignee.label}</span>
                  <Icon name="expand_more" size="sm" />
                </PropertyRow>
                <PropertyRow
                  icon="person"
                  label="Reporter"
                  onClick={() => onReporterOpenChange(true)}
                  valueLabel={`Reporter: ${activeReporter.label}`}
                >
                  <Avatar
                    variant="profile"
                    size="sm"
                    initial={activeReporter.initial}
                    aria-label={activeReporter.label}
                    style={{ backgroundColor: activeReporter.color }}
                  />
                  <span>{activeReporter.label}</span>
                  <Icon name="expand_more" size="sm" />
                </PropertyRow>
                <PropertyRow
                  icon="schedule"
                  label="Status"
                  onClick={() => onStatusOpenChange(true)}
                  valueLabel={`Status: ${activeStatus.label}`}
                >
                  <Badge variant={activeStatus.variant}>
                    {activeStatus.label}
                  </Badge>
                  <Icon name="expand_more" size="sm" />
                </PropertyRow>
                <PropertyRow
                  icon="signal_cellular_alt"
                  label="Priority"
                  onClick={() => onPriorityOpenChange(true)}
                  valueLabel={`Priority: ${activePriority.label}`}
                >
                  <span
                    className={styles.priorityValue}
                    style={{
                      color: `var(--ds-color-status-${activePriority.value})`,
                    }}
                  >
                    {activePriority.label}
                  </span>
                  <Icon name="expand_more" size="sm" />
                </PropertyRow>
                <PropertyRow icon="tag" label="Environments">
                  <span
                    className={styles.envChips}
                    tabIndex={0}
                    role="region"
                    aria-label="Pipeline environments"
                  >
                    {pipelineStages.map((stage) => (
                      <Badge
                        key={stage.value}
                        variant={
                          stage.value === activeStage ? 'progress' : 'default'
                        }
                      >
                        {stage.label}
                      </Badge>
                    ))}
                  </span>
                </PropertyRow>
                <PropertyRow
                  icon="tag"
                  label="Pipeline"
                  onClick={(event) => {
                    drillOriginRef.current = event.currentTarget;
                    setDetailsView('pipeline');
                  }}
                >
                  <span className={styles.pipelineSummary}>
                    {pipelineSummary}
                  </span>
                  <Icon name="chevron_right" size="sm" />
                </PropertyRow>
              </div>

              {activeTab === 'dev' && (
                <>
                  <SectionHeader
                    headingLevel={2}
                    className={styles.devSectionHeader}
                  >
                    Dev
                  </SectionHeader>
                  <div className={styles.metadataList}>
                    <PropertyRow icon="code" label="Repository">
                      <ExternalLink href={ticket.dev.repository.url} size="sm">
                        {ticket.dev.repository.name}
                      </ExternalLink>
                    </PropertyRow>
                    <PropertyRow icon="fork_right" label="Branch">
                      <RefLink
                        boxed
                        value={branch}
                        href={ticket.dev.repository.branchUrl}
                        copied={branchCopied}
                        onCopy={copyBranch}
                        copyAriaLabel="Copy branch"
                      />
                    </PropertyRow>
                    <PropertyRow icon="check_circle" label="CI / Build">
                      <span
                        className={cn(
                          styles.ciValue,
                          CI_CLASS[ticket.dev.repository.ci.status],
                        )}
                      >
                        <Icon
                          name={CI_ICON[ticket.dev.repository.ci.status]}
                          size="sm"
                        />
                        {ticket.dev.repository.ci.label}
                      </span>
                      <span className={styles.ciBuild}>
                        {ticket.dev.repository.ci.build}
                      </span>
                    </PropertyRow>
                    <PropertyRow
                      icon="call_merge"
                      label="Pull requests"
                      valueLabel={`Pull requests: ${ticket.dev.pullRequests.length}`}
                      onClick={(event) => {
                        drillOriginRef.current = event.currentTarget;
                        setDetailsView('pullRequests');
                      }}
                    >
                      <Badge variant="count">
                        {String(ticket.dev.pullRequests.length)}
                      </Badge>
                      <Icon name="chevron_right" size="sm" />
                    </PropertyRow>
                    <PropertyRow
                      icon="code"
                      label="Commits"
                      valueLabel={`Commits: ${ticket.dev.commits.total}`}
                      onClick={(event) => {
                        drillOriginRef.current = event.currentTarget;
                        setDetailsView('commits');
                      }}
                    >
                      <Badge variant="count">
                        {String(ticket.dev.commits.total)}
                      </Badge>
                      <Icon name="chevron_right" size="sm" />
                    </PropertyRow>
                  </div>
                </>
              )}
            </div>

            <div
              className={styles.panel}
              inert={detailsView === 'metadata' || undefined}
            >
              {detailsView !== 'metadata' && (
                <div className={styles.sheetHeader}>
                  <div className={styles.sheetHeaderLeft}>
                    <IconButton
                      ref={backButtonRef}
                      icon="chevron_left"
                      aria-label="Back to details"
                      onClick={backToMetadata}
                    />
                    <span className={styles.sheetTitle}>
                      {DETAILS_VIEW_LABEL[detailsView]}
                    </span>
                  </div>
                  <span className={styles.sheetTicketId}>{ticket.id}</span>
                </div>
              )}

              {detailsView === 'pipeline' &&
                (() => {
                  const panelBaseProps = {
                    title: 'Stages',
                    style: { border: 'none', padding: 0 },
                    // Stop reorder touch-drags from bubbling to the BottomSheet's
                    // drag-to-dismiss (it tracks touch; reorder uses pointer).
                    onTouchStart: (e: TouchEvent<HTMLDivElement>) =>
                      e.stopPropagation(),
                    onTouchMove: (e: TouchEvent<HTMLDivElement>) =>
                      e.stopPropagation(),
                    stages: pipelineStages,
                    activeValue: activeStage,
                    onSelect: setActiveStage,
                    onReorder: setPipelineStages,
                    reorderHint: ticket.pipeline.reorderHint,
                    addLabel: ticket.pipeline.addLabel,
                    addStagePlaceholder: ticket.pipeline.addStagePlaceholder,
                    onAddStage: openAddStage,
                  };
                  if (addingStage) {
                    return (
                      <PipelineHierarchyPanel
                        {...panelBaseProps}
                        addingStage
                        addStageValue={addStageDraft}
                        addStageMessage={addStageMessage}
                        onAddStageValueChange={setAddStageDraft}
                        onAddStageConfirm={confirmAddStage}
                        onAddStageCancel={cancelAddStage}
                      />
                    );
                  }
                  return <PipelineHierarchyPanel {...panelBaseProps} />;
                })()}

              {detailsView === 'pullRequests' && (
                <>
                  <div className={styles.subViewSearch}>
                    <SearchInput
                      placeholder="Find pull request..."
                      aria-label="Find pull request"
                      size="sm"
                      value={prQuery}
                      onChange={(e) => setPrQuery(e.target.value)}
                      onClear={prQuery ? () => setPrQuery('') : undefined}
                    />
                  </div>
                  <ul className={styles.devList} aria-label="Pull requests">
                    {filteredPullRequests.map((pr) => (
                      <li key={pr.id}>
                        <a
                          className={styles.devRowLink}
                          href={sanitizeHref(pr.href)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon
                            name="call_merge"
                            size="sm"
                            className={styles.devRowLeading}
                          />
                          <span className={styles.devRowBody}>
                            <span className={styles.devRowTitle}>
                              {pr.title}
                            </span>
                            <span className={styles.devRowMeta}>
                              <span>{pr.number}</span>
                              <Badge variant={PR_BADGE[pr.state]}>
                                {pr.state}
                              </Badge>
                              <span aria-hidden="true">·</span>
                              <span>{pr.author}</span>
                              <span aria-hidden="true">·</span>
                              <span>{pr.when}</span>
                            </span>
                          </span>
                          <Icon
                            name="open_in_new"
                            size="sm"
                            className={styles.devRowTrailing}
                          />
                          <span className={styles.srOnly}>
                            {' '}
                            (opens in a new tab)
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  {filteredPullRequests.length === 0 && (
                    <p className={styles.subViewEmpty}>
                      No pull requests match “{prQuery}”.
                    </p>
                  )}
                </>
              )}

              {detailsView === 'commits' && (
                <>
                  <div className={styles.subViewSummary}>
                    <Badge variant="reference">{branch}</Badge>
                    <span className={styles.subViewCount}>
                      {ticket.dev.commits.total} commits
                    </span>
                  </div>
                  <ul className={styles.devList} aria-label="Commits">
                    {ticket.dev.commits.items.map((commit) => (
                      <li key={commit.sha}>
                        <a
                          className={styles.devRowLink}
                          href={sanitizeHref(commit.href)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Avatar
                            variant="profile"
                            size="sm"
                            initial={commit.author.initial}
                            aria-label={commit.author.name}
                            style={{ backgroundColor: commit.author.color }}
                          />
                          <span className={styles.devRowBody}>
                            <span className={styles.devRowTitle}>
                              {commit.title}
                            </span>
                            <span className={styles.devRowMeta}>
                              <Badge variant="reference">{commit.sha}</Badge>
                              <span aria-hidden="true">·</span>
                              <span>{commit.when}</span>
                            </span>
                          </span>
                          <Icon
                            name="open_in_new"
                            size="sm"
                            className={styles.devRowTrailing}
                          />
                          <span className={styles.srOnly}>
                            {' '}
                            (opens in a new tab)
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        open={assigneeOpen}
        onClose={() => onAssigneeOpenChange(false)}
        aria-label="Select assignee"
      >
        <SectionHeader headingLevel={3}>Assignee</SectionHeader>
        <OptionList
          options={peopleOptions}
          value={assignee}
          onSelect={(v) => {
            setAssignee(v);
            onAssigneeOpenChange(false);
          }}
          renderOptionIndicator={(opt) => {
            const person = peopleOptions.find((p) => p.value === opt.value);
            return person ? (
              <Avatar
                variant="profile"
                size="sm"
                initial={person.initial}
                aria-label={person.label}
                style={{ backgroundColor: person.color }}
              />
            ) : null;
          }}
          aria-label="Assignees"
        />
      </BottomSheet>

      <BottomSheet
        open={reporterOpen}
        onClose={() => onReporterOpenChange(false)}
        aria-label="Select reporter"
      >
        <SectionHeader headingLevel={3}>Reporter</SectionHeader>
        <OptionList
          options={peopleOptions}
          value={reporter}
          onSelect={(v) => {
            setReporter(v);
            onReporterOpenChange(false);
          }}
          renderOptionIndicator={(opt) => {
            const person = peopleOptions.find((p) => p.value === opt.value);
            return person ? (
              <Avatar
                variant="profile"
                size="sm"
                initial={person.initial}
                aria-label={person.label}
                style={{ backgroundColor: person.color }}
              />
            ) : null;
          }}
          aria-label="Reporters"
        />
      </BottomSheet>

      <BottomSheet
        open={statusOpen}
        onClose={() => onStatusOpenChange(false)}
        aria-label="Select status"
      >
        <SectionHeader headingLevel={3}>Status</SectionHeader>
        <OptionList
          options={statusOptions}
          value={status}
          onSelect={(v) => {
            setStatus(v);
            onStatusOpenChange(false);
          }}
          aria-label="Statuses"
        />
      </BottomSheet>

      <BottomSheet
        open={priorityOpen}
        onClose={() => onPriorityOpenChange(false)}
        aria-label="Select priority"
      >
        <SectionHeader headingLevel={3}>Priority</SectionHeader>
        <OptionList
          options={priorityOptions}
          value={priority}
          onSelect={(v) => {
            setPriority(v);
            onPriorityOpenChange(false);
          }}
          aria-label="Priorities"
        />
      </BottomSheet>

      <TaskEditDrawer
        open={viewingTask !== null}
        title={taskDrawerTitle}
        onClose={closeTaskDrawer}
        form={taskForm}
        setForm={setTaskForm}
        selectors={taskSelectors}
        assigneeOptions={peopleOptions}
        priorityOptions={priorityOptions}
        ticketOptions={[
          { value: ticket.id, label: ticket.title, prefix: ticket.id },
        ]}
      />
    </div>
  );
}

const meta: Meta = {
  title: 'Pages/Ticket',
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    layout: 'fullscreen',
    viewport: { options: mobileViewportOptions },
  },
};
export default meta;

type Story = StoryObj;

export const Mobile: Story = {
  render: () => <TicketOverviewMobileRender />,
};

// Enough notes to scroll the page well past the sticky threshold, which the
// six-line default never reaches.
const LONG_SCRATCHPAD_SEED: readonly ScratchpadLine[] = [
  { id: 'long-1', text: '## Debug notes' },
  {
    id: 'long-2',
    text: '[ ] Repro: cold-start cache miss on `/gateway` when SNS invalidation fires mid-write',
  },
  { id: 'long-3', text: '[ ] Verify **TTL** headers inherited from origin' },
  { id: 'long-4', text: 'Refactor the [task] edge-caching header mutation' },
  {
    id: 'long-5',
    text: '[x] Initial research on *CloudFront* function limits',
  },
  { id: 'long-6', text: 'Debug: [qa] latency spikes in `us-west-2` staging' },
  { id: 'long-7', text: '## Invalidation' },
  { id: 'long-8', text: '[ ] Confirm SNS fan-out ordering under retry' },
  { id: 'long-9', text: '[ ] Measure purge latency at p99' },
  { id: 'long-10', text: 'Cache keys collide when the vary header is absent' },
  { id: 'long-11', text: '[x] Ruled out clock skew between edge nodes' },
  { id: 'long-12', text: '## Rollout' },
  { id: 'long-13', text: '[ ] Shadow traffic for one full peak cycle' },
  { id: 'long-14', text: '[ ] Alert on origin error rate above baseline' },
  { id: 'long-15', text: 'Staging bake needs a week before the next stage' },
  { id: 'long-16', text: '[ ] Document the rollback switch' },
  { id: 'long-17', text: '## Open questions' },
  { id: 'long-18', text: 'Do stale-while-revalidate hits count toward quota?' },
  { id: 'long-19', text: '[ ] Ask platform about per-tenant limits' },
  { id: 'long-20', text: 'Follow up on the [task] multi-value header work' },
];

export const MobileLongNotes: Story = {
  render: () => (
    <TicketOverviewMobileRender scratchpadSeed={LONG_SCRATCHPAD_SEED} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A scratchpad long enough for the page to scroll, so the formatting toolbar stays parked beneath the tab bar instead of scrolling away.',
      },
    },
  },
};
