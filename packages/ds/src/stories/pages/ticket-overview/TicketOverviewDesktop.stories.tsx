import type { Meta, StoryObj } from '@storybook/react';
import { desktopViewports } from '../../../../.storybook/preview';
import { Sidebar } from '../../../components/Sidebar';
import { Selector } from '../../../components/Selector';
import { NavItem } from '../../../components/NavItem';
import { SectionHeader } from '../../../components/SectionHeader';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Button } from '../../../components/Button';
import { IconButton } from '../../../components/IconButton';
import { cn } from '../../../utils/cn';
import { Avatar } from '../../../components/Avatar';
import { AvatarGroup } from '../../../components/AvatarGroup';
import { Badge } from '../../../components/Badge';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { TicketTitleBlock } from '../../../components/TicketTitleBlock';
import { Tabs, getTabId, getTabPanelId } from '../../../components/Tabs';
import { Card } from '../../../components/Card';
import { CollapsibleCard } from '../../../components/CollapsibleCard';
import { ChecklistRow } from '../../../components/ChecklistRow';
import { PropertyRow } from '../../../components/PropertyRow';
import { EditableRefField } from '../../../components/EditableRefField';
import { TicketId } from '../../../components/TicketId';
import { PipelineHierarchyPanel } from '../../../components/PipelineHierarchyPanel';
import {
  SidebarWorkspaceHeader,
  SidebarStatusLabel,
  LastEditedLabel,
} from '../../helpers/pageChrome';
import { useTicketOverviewState } from './useTicketOverviewState';
import {
  getPerson,
  getPriorityOption,
  getProject,
  getStatusOption,
  navItems,
  peopleOptions,
  priorityOptions,
  projectList,
  statusOptions,
  tabs,
  ticket,
} from './shared';
import styles from './TicketOverviewDesktop.module.css';

const TAB_ID_PREFIX = 'ticket-overview';

function TicketOverviewRender() {
  const {
    project,
    setProject,
    projectSelector: {
      ref: projectSelectorRef,
      open: projectSelectorOpen,
      onOpenChange: onProjectSelectorOpenChange,
    },
    activeNav,
    setActiveNav,
    activeTab,
    setActiveTab,
    assignee,
    setAssignee,
    assigneeSelector: {
      ref: assigneeSelectorRef,
      open: assigneeSelectorOpen,
      onOpenChange: onAssigneeSelectorOpenChange,
    },
    reporter,
    setReporter,
    reporterSelector: {
      ref: reporterSelectorRef,
      open: reporterSelectorOpen,
      onOpenChange: onReporterSelectorOpenChange,
    },
    status,
    setStatus,
    statusSelector: {
      ref: statusSelectorRef,
      open: statusSelectorOpen,
      onOpenChange: onStatusSelectorOpenChange,
    },
    priority,
    setPriority,
    prioritySelector: {
      ref: prioritySelectorRef,
      open: prioritySelectorOpen,
      onOpenChange: onPrioritySelectorOpenChange,
    },
    pipelineStages,
    setPipelineStages,
    activeStage,
    setActiveStage,
    pipelineOpen,
    togglePipelineOpen,
    branch,
    branchDraft,
    branchEditing,
    branchCopied,
    startEditBranch,
    changeBranchDraft,
    confirmBranch,
    cancelBranch,
    copyBranch,
    addingStage,
    addStageDraft,
    addStageMessage,
    openAddStage,
    setAddStageDraft,
    confirmAddStage,
    cancelAddStage,
  } = useTicketOverviewState();
  const activeProject = getProject(project);
  const activeAssignee = getPerson(assignee);
  const activeReporter = getPerson(reporter);
  const activeStatus = getStatusOption(status);
  const activePriority = getPriorityOption(priority);

  const navClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNav(id);
  };

  return (
    <div className={styles.shell}>
      <Sidebar
        aria-label="Sidebar navigation"
        header={
          <>
            <Selector
              ref={projectSelectorRef}
              options={projectList}
              value={project}
              onValueChange={setProject}
              open={projectSelectorOpen}
              onOpenChange={onProjectSelectorOpenChange}
              triggerPrefix={
                <Avatar
                  initial={activeProject.initial}
                  aria-label={activeProject.label}
                />
              }
              action={{ label: 'Add project', icon: 'add', onClick: () => {} }}
            />
            <SidebarWorkspaceHeader
              projectLabel={activeProject.label}
              version="v4.1.0-alpha"
              status={{ variant: 'active', label: 'Healthy' }}
            />
          </>
        }
        footer={
          <>
            <NavItem
              icon="settings"
              label="Settings"
              href="/settings"
              size="sm"
            />
            <NavItem icon="help" label="Support" href="/support" size="sm" />
            <SidebarStatusLabel>System Stable</SidebarStatusLabel>
          </>
        }
      >
        <SectionHeader>Project Artifacts</SectionHeader>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={activeNav === item.id}
            onClick={navClick(item.id)}
          />
        ))}
      </Sidebar>

      <div className={styles.workArea}>
        <Header
          left={<Breadcrumb segments={ticket.breadcrumb} />}
          right={
            <>
              <Button variant="ghost" size="sm">
                Ask
              </Button>
              <Button variant="ghost" size="sm">
                Comment
              </Button>
              <Button variant="primary" size="sm">
                Add scenario
              </Button>
              <IconButton icon="link" size="sm" aria-label="Share ticket" />
              <IconButton icon="flag" size="sm" aria-label="Star ticket" />
              <IconButton
                icon="more_horiz"
                size="sm"
                aria-label="More actions"
              />
              <Avatar initial="AP" variant="profile" aria-label="Ale Paez" />
            </>
          }
        />

        <div className={styles.body}>
          <div className={styles.titleAndTabs}>
            <div className={styles.titleSection}>
              <TicketTitleBlock
                title={ticket.title}
                badges={ticket.badges}
                avatar={
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
                }
              />
            </div>
            <div className={styles.tabsBar}>
              <Tabs
                className={styles.tabs}
                items={tabs}
                value={activeTab}
                onValueChange={setActiveTab}
                size="sm"
                idPrefix={TAB_ID_PREFIX}
                aria-label="Ticket sections"
              />
            </div>
          </div>

          <div className={styles.scrollArea}>
            <div className={styles.content}>
              <div
                role="tabpanel"
                id={getTabPanelId(TAB_ID_PREFIX, 'overview')}
                aria-labelledby={getTabId(TAB_ID_PREFIX, 'overview')}
                className={styles.overviewPanel}
                hidden={activeTab !== 'overview'}
              >
                <section className={styles.section}>
                  <SectionHeader headingLevel={2}>Description</SectionHeader>
                  <p className={styles.prose}>{ticket.description}</p>
                </section>

                <section className={styles.section}>
                  <SectionHeader headingLevel={2}>Why</SectionHeader>
                  <ul className={styles.bulletList}>
                    {ticket.why.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className={styles.section}>
                  <SectionHeader headingLevel={2}>Scope</SectionHeader>
                  <div className={styles.scopeGrid}>
                    <Card
                      header={
                        <span className={styles.scopeCardLabel}>
                          {ticket.scope.included.title}
                        </span>
                      }
                    >
                      <ul className={styles.scopeList}>
                        {ticket.scope.included.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </Card>
                    <Card
                      header={
                        <span className={styles.scopeCardLabel}>
                          {ticket.scope.excluded.title}
                        </span>
                      }
                    >
                      <ul className={styles.scopeList}>
                        {ticket.scope.excluded.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </section>

                <section className={styles.section}>
                  <SectionHeader headingLevel={2}>QA Summary</SectionHeader>
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
                        meta={
                          item.metaVariant ? (
                            <Badge variant={item.metaVariant}>
                              {item.meta}
                            </Badge>
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
                  className={styles.tabPanelEmpty}
                  hidden={activeTab !== tabValue}
                >
                  Nothing here yet.
                </div>
              ))}
            </div>
          </div>

          <aside aria-label="Ticket metadata" className={styles.rightRail}>
            <SectionHeader headingLevel={2}>Metadata</SectionHeader>
            <div className={styles.metadataList}>
              <PropertyRow icon="person" label="Assignee">
                <Selector
                  ref={assigneeSelectorRef}
                  className={styles.metadataSelector}
                  options={peopleOptions}
                  value={assignee}
                  onValueChange={setAssignee}
                  open={assigneeSelectorOpen}
                  onOpenChange={onAssigneeSelectorOpenChange}
                  variant="inline"
                  dropdownAlign="end"
                  triggerPrefix={
                    <Avatar
                      variant="profile"
                      size="sm"
                      initial={activeAssignee.initial}
                      aria-label={activeAssignee.label}
                      style={{ backgroundColor: activeAssignee.color }}
                    />
                  }
                  renderTriggerLabel={(opt) => opt.label}
                  renderOptionIndicator={(opt) => {
                    const person = peopleOptions.find(
                      (p) => p.value === opt.value,
                    );
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
                  aria-label="Select assignee"
                />
              </PropertyRow>
              <PropertyRow icon="person" label="Reporter">
                <Selector
                  ref={reporterSelectorRef}
                  className={styles.metadataSelector}
                  options={peopleOptions}
                  value={reporter}
                  onValueChange={setReporter}
                  open={reporterSelectorOpen}
                  onOpenChange={onReporterSelectorOpenChange}
                  variant="inline"
                  dropdownAlign="end"
                  triggerPrefix={
                    <Avatar
                      variant="profile"
                      size="sm"
                      initial={activeReporter.initial}
                      aria-label={activeReporter.label}
                      style={{ backgroundColor: activeReporter.color }}
                    />
                  }
                  renderTriggerLabel={(opt) => opt.label}
                  renderOptionIndicator={(opt) => {
                    const person = peopleOptions.find(
                      (p) => p.value === opt.value,
                    );
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
                  aria-label="Select reporter"
                />
              </PropertyRow>
              <PropertyRow icon="schedule" label="Status">
                <Selector
                  ref={statusSelectorRef}
                  className={styles.metadataSelector}
                  options={statusOptions}
                  value={status}
                  onValueChange={setStatus}
                  open={statusSelectorOpen}
                  onOpenChange={onStatusSelectorOpenChange}
                  variant="inline"
                  dropdownAlign="end"
                  renderTriggerLabel={() => (
                    <Badge variant={activeStatus.variant}>
                      {activeStatus.label}
                    </Badge>
                  )}
                  renderOptionIndicator={() => null}
                  aria-label="Select status"
                />
              </PropertyRow>
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
              <PropertyRow icon="signal_cellular_alt" label="Priority">
                <Selector
                  ref={prioritySelectorRef}
                  className={styles.metadataSelector}
                  options={priorityOptions}
                  value={priority}
                  onValueChange={setPriority}
                  open={prioritySelectorOpen}
                  onOpenChange={onPrioritySelectorOpenChange}
                  variant="inline"
                  dropdownAlign="end"
                  renderTriggerLabel={() => (
                    <span className={styles.priorityValue}>
                      {activePriority.label}
                    </span>
                  )}
                  aria-label="Select priority"
                />
              </PropertyRow>
              <PropertyRow icon="tag" label="Environments">
                <span className={styles.environments}>
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
                  <IconButton
                    icon="chevron_right"
                    size="sm"
                    className={cn(pipelineOpen && styles.envChevronOpen)}
                    onClick={togglePipelineOpen}
                    aria-expanded={pipelineOpen}
                    aria-controls="ticket-pipeline-hierarchy"
                    aria-label={
                      pipelineOpen
                        ? 'Close pipeline hierarchy'
                        : 'Open pipeline hierarchy'
                    }
                  />
                </span>
              </PropertyRow>
            </div>

            {pipelineOpen &&
              (() => {
                const panelBaseProps = {
                  id: 'ticket-pipeline-hierarchy',
                  title: ticket.pipeline.title,
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
          </aside>
        </div>

        <Footer
          left={
            <span className={styles.footerMeta}>
              <TicketId>{ticket.footer.ticketIdLabel}</TicketId>
              <LastEditedLabel>{ticket.footer.lastEdited}</LastEditedLabel>
            </span>
          }
        />
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Pages/Ticket Overview',
  parameters: {
    layout: 'fullscreen',
    viewport: { options: desktopViewports },
    a11y: {
      config: {
        rules: [
          // .titleAndTabs uses a horizontal linear-gradient bg. axe-core
          // can't compute color-contrast through gradients and returns
          // 'incomplete' for every text node sitting on it. Manually
          // verified: at peak 15% mix of accent-subtle over white the
          // effective bg is ≈ #fafaf3, giving text-primary (#1a1a1a)
          // a ~13.5:1 ratio — well above WCAG 2 AA's 4.5:1.
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <TicketOverviewRender />,
};
