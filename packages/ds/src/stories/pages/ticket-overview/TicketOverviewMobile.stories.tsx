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
import { Markdown } from '../../../components/Markdown';
import { MarkdownEditor } from '../../../components/MarkdownEditor';
import { CollapsibleCard } from '../../../components/CollapsibleCard';
import { ChecklistRow } from '../../../components/ChecklistRow';
import { BottomTabBar } from '../../../components/BottomTabBar';
import { NavItem } from '../../../components/NavItem';
import { BottomSheet } from '../../../components/BottomSheet';
import { PropertyRow } from '../../../components/PropertyRow';
import { EditableRefField } from '../../../components/EditableRefField';
import { OptionList } from '../../../components/OptionList';
import { PipelineHierarchyPanel } from '../../../components/PipelineHierarchyPanel';
import { useMarkdownEditor } from '../../../hooks/useMarkdownEditor';
import { useTicketOverviewState } from './useTicketOverviewState';
import {
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

const uploadImage = (file: File) => Promise.resolve(URL.createObjectURL(file));

type DetailsView = 'metadata' | 'pipeline';

function TicketOverviewMobileRender() {
  const {
    activeTab,
    setActiveTab,
    body,
    setBody,
    bodyMode,
    setBodyMode,
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
    branchDraft,
    branchEditing,
    branchCopied,
    startEditBranch,
    changeBranchDraft,
    confirmBranch,
    cancelBranch,
    copyBranch,
  } = useTicketOverviewState();
  const activeProject = getProject('eng-core');
  const activeAssignee = getPerson(assignee);
  const activeReporter = getPerson(reporter);
  const activeStatus = getStatusOption(status);
  const activePriority = getPriorityOption(priority);

  const { wordCount, isUploading, textareaRef, applyAction, insertImageFiles } =
    useMarkdownEditor({
      value: body,
      setValue: setBody,
      onImageUpload: uploadImage,
    });

  const freeformButtonRef = useRef<HTMLButtonElement>(null);
  const didMountRef = useRef(false);
  useEffect(() => {
    // Skip the initial render so we don't steal focus on page load
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (bodyMode === 'freeform') {
      textareaRef.current?.focus();
    } else {
      freeformButtonRef.current?.focus();
    }
  }, [bodyMode, textareaRef]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsView, setDetailsView] = useState<DetailsView>('metadata');

  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [condensed, setCondensed] = useState(false);

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
    setDetailsOpen(false);
  }

  function backToMetadata() {
    cancelAddStage();
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
            <span className={headerLayoutStyles.pageTitle}>Tickets</span>
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
            {condensed && (
              <div className={styles.condensedReveal} aria-hidden="true">
                <div className={styles.condensedTitle}>
                  <span className={styles.condensedId}>{ticket.id}</span>
                  <span className={styles.condensedName}>{ticket.title}</span>
                </div>
              </div>
            )}
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
            <div className={styles.bodyCard}>
              {bodyMode === 'template' ? (
                <>
                  <div className={styles.bodyBar}>
                    <span className={styles.bodyModeLabel}>
                      <Icon name="description" size="sm" />
                      Template
                    </span>
                    <button
                      ref={freeformButtonRef}
                      type="button"
                      className={styles.bodySwitch}
                      onClick={() => setBodyMode('freeform')}
                    >
                      Freeform
                      <Icon name="chevron_right" size="sm" />
                    </button>
                  </div>
                  <Markdown source={body} className={styles.bodyContent} />
                </>
              ) : (
                <MarkdownEditor
                  stickyHeader={false}
                  header={
                    <div className={styles.bodyBar}>
                      <span className={styles.bodyModeLabel}>
                        <Icon name="description" size="sm" />
                        Freeform
                      </span>
                      <button
                        type="button"
                        className={styles.bodySwitch}
                        onClick={() => setBodyMode('template')}
                      >
                        <Icon name="chevron_left" size="sm" />
                        Template
                      </button>
                    </div>
                  }
                  value={body}
                  onChange={setBody}
                  textareaRef={textareaRef}
                  onAction={applyAction}
                  wordCount={wordCount}
                  isUploading={isUploading}
                  onInsertImageFiles={insertImageFiles}
                />
              )}

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
          </div>

          {(['dev', 'qa', 'activity'] as const).map((tabValue) => (
            <div
              key={tabValue}
              role="tabpanel"
              id={getTabPanelId(TAB_ID_PREFIX, tabValue)}
              aria-labelledby={getTabId(TAB_ID_PREFIX, tabValue)}
              className={styles.tabPanelEmpty}
              hidden={activeTab !== tabValue}
            >
              Nothing here yet.
            </div>
          ))}
        </div>
      </div>

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
        aria-label={detailsView === 'metadata' ? 'Ticket details' : 'Pipeline'}
      >
        <div style={{ overflowX: 'clip' }}>
          <div
            className={styles.slider}
            style={{
              transform:
                detailsView === 'pipeline'
                  ? 'translateX(-100%)'
                  : 'translateX(0)',
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
                <PropertyRow icon="fork_right" label="Branch">
                  <EditableRefField
                    className={styles.metadataBranchField}
                    icon="fork_right"
                    value={branch}
                    placeholder="Add branch"
                    editing={branchEditing}
                    draftValue={branchDraft}
                    copied={branchCopied}
                    onStartEdit={startEditBranch}
                    onDraftChange={changeBranchDraft}
                    onConfirm={confirmBranch}
                    onCancel={cancelBranch}
                    onCopy={copyBranch}
                    editAriaLabel="Edit branch"
                    inputAriaLabel="Branch name"
                    copyAriaLabel="Copy branch"
                  />
                </PropertyRow>
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
                  onClick={() => setDetailsView('pipeline')}
                >
                  <span className={styles.pipelineSummary}>
                    {pipelineSummary}
                  </span>
                  <Icon name="chevron_right" size="sm" />
                </PropertyRow>
              </div>
            </div>

            <div
              className={styles.panel}
              inert={detailsView !== 'pipeline' || undefined}
            >
              <div className={styles.sheetHeader}>
                <div className={styles.sheetHeaderLeft}>
                  <IconButton
                    icon="chevron_left"
                    aria-label="Back to details"
                    onClick={backToMetadata}
                  />
                  <span className={styles.sheetTitle}>Pipeline</span>
                </div>
                <span className={styles.sheetTicketId}>{ticket.id}</span>
              </div>

              {(() => {
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
    </div>
  );
}

const meta: Meta = {
  title: 'Pages/Ticket Overview',
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
