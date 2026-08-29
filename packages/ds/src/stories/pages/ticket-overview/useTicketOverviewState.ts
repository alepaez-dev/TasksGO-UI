import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type {
  AddStageMessage,
  PipelineHierarchyStage,
} from '../../../components/PipelineHierarchyPanel';
import {
  useSelectorGroup,
  useSelectorState,
  type UseSelectorStateReturn,
  type SelectorGroupEntry,
} from '../../../hooks/useSelector';
import {
  useScratchpad,
  type UseScratchpadControls,
} from '../../../hooks/useScratchpad';
import type {
  ScratchpadLine,
  ScratchpadTaskRef,
} from '../../../components/Scratchpad';
import {
  type DrawerFormState,
  type TaskDrawerSelectors,
  initialForm,
} from '../tasks/shared';
import type {
  NewScenarioDraft,
  NewScenarioStatus,
} from '../../../components/AddScenarioDialog';
import { toStageValue } from '../../../utils/toStageValue';
import {
  countFailedScenarios,
  ticket,
  type ChecklistItem,
  type DevData,
} from './shared';
import { serializeTicketBody } from './serializeTicketBody';

const DEV_SCRATCHPAD_SEED: readonly ScratchpadLine[] = [
  { id: 'sp-1', text: '## Debug notes' },
  {
    id: 'sp-2',
    text: '[ ] Repro: cold-start cache miss on `/gateway` when SNS invalidation fires mid-write',
  },
  {
    id: 'sp-3',
    text: '[ ] Verify **TTL** headers inherited from origin — see [caching RFC](https://example.com/rfc/caching)',
  },
  {
    id: 'sp-4',
    text: 'Refactor the [task] edge-caching header mutation to handle multi-value headers',
  },
  { id: 'sp-5', text: '[x] Initial research on *CloudFront* function limits' },
  { id: 'sp-6', text: 'Debug: [qa] latency spikes in `us-west-2` staging' },
];

const BRANCH_COPIED_FLASH_MS = 2000;

const EMPTY_SCENARIO_DRAFT: NewScenarioDraft = {
  name: '',
  status: 'pending',
  description: '',
  expected: '',
  actual: '',
  steps: [],
  evidence: [],
};

const SCENARIO_META: Record<NewScenarioStatus, ChecklistItem['meta']> = {
  passed: 'Verified',
  failed: 'Failed',
  pending: 'Not verified',
};

// lossy on purpose: ChecklistItem has no home for description/expected/actual
// until the QA tab lands and scenarios become TestScenarioCard-shaped
// TODO: change this when QA tab story lands.
function toChecklistItem(draft: NewScenarioDraft, id: string): ChecklistItem {
  return {
    id,
    status: draft.status,
    label: draft.name.trim(),
    meta: SCENARIO_META[draft.status],
    metaVariant: draft.status === 'failed' ? 'critical' : undefined,
  };
}

function getAddStageMessage(
  draft: string,
  stages: readonly PipelineHierarchyStage[],
): AddStageMessage | undefined {
  const trimmed = draft.trim();
  if (trimmed.length === 0) return undefined;
  const draftValue = toStageValue(trimmed);
  if (draftValue === '') {
    return {
      kind: 'error',
      text: 'Stage name must include a letter or number',
    };
  }
  const exact = stages.find(
    (stage) =>
      stage.value === draftValue ||
      stage.label.toLowerCase() === trimmed.toLowerCase(),
  );
  if (exact) {
    return { kind: 'error', text: `"${exact.label}" already exists` };
  }
  const lower = trimmed.toLowerCase();
  const similar = stages.filter((stage) => {
    const other = stage.label.toLowerCase();
    return (
      lower.length >= 2 && (other.startsWith(lower) || lower.startsWith(other))
    );
  });
  if (similar.length > 0) {
    const list = similar.map((s) => `"${s.label}"`).join(' and ');
    return {
      kind: 'warning',
      text: `Similar to ${list} — still confirm?`,
    };
  }
  return undefined;
}

export interface UseTicketOverviewState {
  project: string;
  setProject: (value: string) => void;
  projectSelector: UseSelectorStateReturn;
  activeNav: string;
  setActiveNav: (id: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  body: string;
  setBody: Dispatch<SetStateAction<string>>;
  bodyEditing: boolean;
  setBodyEditing: Dispatch<SetStateAction<boolean>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  titleEditing: boolean;
  setTitleEditing: Dispatch<SetStateAction<boolean>>;
  assignee: string;
  setAssignee: (value: string) => void;
  assigneeSelector: SelectorGroupEntry;
  reporter: string;
  setReporter: (value: string) => void;
  reporterSelector: SelectorGroupEntry;
  status: string;
  setStatus: (value: string) => void;
  statusSelector: SelectorGroupEntry;
  priority: string;
  setPriority: (value: string) => void;
  prioritySelector: SelectorGroupEntry;
  pipelineStages: readonly PipelineHierarchyStage[];
  setPipelineStages: (stages: readonly PipelineHierarchyStage[]) => void;
  activeStage: string;
  setActiveStage: (value: string) => void;
  pipelineOpen: boolean;
  togglePipelineOpen: () => void;
  branch: string;
  branchCopied: boolean;
  copyBranch: () => void;
  dev: DevData;
  scratchpad: UseScratchpadControls;
  devDetailsOpen: boolean;
  toggleDevDetails: () => void;
  addingStage: boolean;
  addStageDraft: string;
  addStageMessage: AddStageMessage | undefined;
  openAddStage: () => void;
  setAddStageDraft: (value: string) => void;
  confirmAddStage: (label: string) => void;
  cancelAddStage: () => void;
  viewingTask: ScratchpadTaskRef | null;
  taskForm: DrawerFormState;
  setTaskForm: Dispatch<SetStateAction<DrawerFormState>>;
  openTaskDrawer: (task: ScratchpadTaskRef) => void;
  closeTaskDrawer: () => void;
  taskDrawerTitle: string;
  taskSelectors: TaskDrawerSelectors;
  qaScenarios: readonly ChecklistItem[];
  qaFailedCount: number;
  addScenarioOpen: boolean;
  scenarioDraft: NewScenarioDraft;
  setScenarioDraft: (draft: NewScenarioDraft) => void;
  openAddScenario: () => void;
  cancelAddScenario: () => void;
  confirmAddScenario: (draft: NewScenarioDraft) => void;
}

export function useTicketOverviewState(
  scratchpadSeed: readonly ScratchpadLine[] = DEV_SCRATCHPAD_SEED,
): UseTicketOverviewState {
  const [project, setProject] = useState('eng-core');
  const projectSelector = useSelectorState();
  const [activeNav, setActiveNav] = useState('tickets');
  const [activeTab, setActiveTab] = useState('overview');
  const [bodyEditing, setBodyEditing] = useState(false);
  const [body, setBody] = useState(() => serializeTicketBody(ticket));
  const [title, setTitle] = useState(ticket.title);
  const [titleEditing, setTitleEditing] = useState(false);
  const [assignee, setAssignee] = useState(ticket.metadata.assigneeValue);
  const [reporter, setReporter] = useState(ticket.metadata.reporterValue);
  const [status, setStatus] = useState(ticket.metadata.statusValue);
  const [priority, setPriority] = useState(ticket.metadata.priorityValue);
  const metadataSelectors = useSelectorGroup(
    'assignee',
    'reporter',
    'status',
    'priority',
  );
  const [pipelineStages, setPipelineStages] = useState<
    readonly PipelineHierarchyStage[]
  >(ticket.pipeline.stages);
  const [activeStage, setActiveStage] = useState(
    ticket.pipeline.initialActiveStage,
  );
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [addingStage, setAddingStage] = useState(false);
  const [addStageDraft, setAddStageDraft] = useState('');
  const openAddStage = () => {
    setAddStageDraft('');
    setAddingStage(true);
  };
  const cancelAddStage = () => {
    setAddingStage(false);
    setAddStageDraft('');
  };
  const togglePipelineOpen = () => {
    if (pipelineOpen) cancelAddStage();
    setPipelineOpen((current) => !current);
  };
  const addStageMessage = addingStage
    ? getAddStageMessage(addStageDraft, pipelineStages)
    : undefined;
  const confirmAddStage = (label: string) => {
    if (getAddStageMessage(label, pipelineStages)?.kind === 'error') return;
    setPipelineStages((current) => {
      if (getAddStageMessage(label, current)?.kind === 'error') return current;
      return [
        ...current,
        { value: toStageValue(label), label, status: 'idle' },
      ];
    });
    setAddingStage(false);
    setAddStageDraft('');
  };

  const [viewingTask, setViewingTask] = useState<ScratchpadTaskRef | null>(
    null,
  );
  const [taskForm, setTaskForm] = useState<DrawerFormState>(initialForm);
  const taskSelectors = useSelectorGroup('assignee', 'priority', 'ticket');

  const openTaskDrawer = useCallback((task: ScratchpadTaskRef) => {
    setTaskForm({
      title: task.title,
      description: task.description ?? '',
      assignee: ticket.metadata.assigneeValue,
      priority: 'medium',
      linkedTicket: ticket.id,
    });
    setViewingTask(task);
  }, []);

  const closeTaskDrawer = useCallback(() => {
    taskSelectors.assignee.onOpenChange(false);
    setViewingTask(null);
  }, [taskSelectors]);

  const taskDrawerTitle = viewingTask
    ? `Edit task · ${viewingTask.id}`
    : 'Edit task';

  const [qaScenarios, setQaScenarios] = useState<readonly ChecklistItem[]>(
    ticket.qaSummary.items,
  );
  const [addScenarioOpen, setAddScenarioOpen] = useState(false);
  const [scenarioDraft, setScenarioDraft] =
    useState<NewScenarioDraft>(EMPTY_SCENARIO_DRAFT);
  const openAddScenario = () => {
    setScenarioDraft(EMPTY_SCENARIO_DRAFT);
    setAddScenarioOpen(true);
  };
  // resetting here would blank the fields during the close transition
  const cancelAddScenario = () => setAddScenarioOpen(false);
  const confirmAddScenario = (draft: NewScenarioDraft) => {
    setQaScenarios((current) => [
      ...current,
      toChecklistItem(draft, `scenario-${current.length + 1}`),
    ]);
    setAddScenarioOpen(false);
  };
  const qaFailedCount = countFailedScenarios(qaScenarios);

  const branch = ticket.dev.repository.branch;
  const [branchCopied, setBranchCopied] = useState(false);
  const [branchCopyTick, setBranchCopyTick] = useState(0);
  const scratchpad = useScratchpad(scratchpadSeed);

  const [devDetailsOpen, setDevDetailsOpen] = useState(false);
  useEffect(() => {
    setDevDetailsOpen(activeTab === 'dev');
  }, [activeTab]);
  const toggleDevDetails = useCallback(
    () => setDevDetailsOpen((prev) => !prev),
    [],
  );

  const copyBranch = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(branch).then(
      () => {
        setBranchCopied(true);
        setBranchCopyTick((tick) => tick + 1);
      },
      () => {},
    );
  }, [branch]);

  useEffect(() => {
    if (!branchCopied) return;
    const timer = setTimeout(
      () => setBranchCopied(false),
      BRANCH_COPIED_FLASH_MS,
    );
    return () => clearTimeout(timer);
  }, [branchCopied, branchCopyTick]);

  return {
    project,
    setProject,
    projectSelector,
    activeNav,
    setActiveNav,
    activeTab,
    setActiveTab,
    body,
    setBody,
    bodyEditing,
    setBodyEditing,
    title,
    setTitle,
    titleEditing,
    setTitleEditing,
    assignee,
    setAssignee,
    assigneeSelector: metadataSelectors.assignee,
    reporter,
    setReporter,
    reporterSelector: metadataSelectors.reporter,
    status,
    setStatus,
    statusSelector: metadataSelectors.status,
    priority,
    setPriority,
    prioritySelector: metadataSelectors.priority,
    pipelineStages,
    setPipelineStages,
    activeStage,
    setActiveStage,
    pipelineOpen,
    togglePipelineOpen,
    branch,
    branchCopied,
    copyBranch,
    dev: ticket.dev,
    scratchpad,
    devDetailsOpen,
    toggleDevDetails,
    addingStage,
    addStageDraft,
    addStageMessage,
    openAddStage,
    setAddStageDraft,
    confirmAddStage,
    cancelAddStage,
    viewingTask,
    taskForm,
    setTaskForm,
    openTaskDrawer,
    closeTaskDrawer,
    taskDrawerTitle,
    taskSelectors,
    qaScenarios,
    qaFailedCount,
    addScenarioOpen,
    scenarioDraft,
    setScenarioDraft,
    openAddScenario,
    cancelAddScenario,
    confirmAddScenario,
  };
}
