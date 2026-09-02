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
import type { NewScenarioDraft } from '../../../components/AddScenarioDialog';
import { toStageValue } from '../../../utils/toStageValue';
import { TEXT_LIKE_EVIDENCE } from '../../helpers/evidenceFixtures';
import {
  countFailedScenarios,
  ticket,
  type ChecklistItem,
  type DevData,
  type QaScenario,
} from './shared';
import type { TestScenarioSection } from '../../../components/TestScenarioCard';
import { toChecklistItems } from './qaViewModel';
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

const NEW_SCENARIO_AUTHOR = {
  assigneeInitial: 'AP',
  assigneeLabel: 'Ale P.',
  assigneeColor: 'var(--ds-color-avatar-tone-profile-plum)',
} as const;

function toQaScenario(draft: NewScenarioDraft, id: string): QaScenario {
  return {
    id,
    title: draft.name.trim(),
    status: draft.status,
    byline: { action: 'Added just now' },
    ...NEW_SCENARIO_AUTHOR,
    description: draft.description.trim(),
    steps: draft.steps,
    evidence: draft.evidence.map((file) => ({
      label: file.name,
      kind: file.type.startsWith('image/')
        ? ('image' as const)
        : ('file' as const),
      url: URL.createObjectURL(file),
    })),
    expected: draft.expected.trim(),
    actual: draft.actual.trim() || undefined,
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
  qaScenarios: readonly QaScenario[];
  qaChecklist: readonly ChecklistItem[];
  viewingTask: ScratchpadTaskRef | null;
  taskForm: DrawerFormState;
  setTaskForm: Dispatch<SetStateAction<DrawerFormState>>;
  openTaskDrawer: (task: ScratchpadTaskRef) => void;
  closeTaskDrawer: () => void;
  taskDrawerTitle: string;
  taskSelectors: TaskDrawerSelectors;
  qaFailedCount: number;
  addScenarioOpen: boolean;
  scenarioDraft: NewScenarioDraft;
  setScenarioDraft: (draft: NewScenarioDraft) => void;
  openAddScenario: () => void;
  cancelAddScenario: () => void;
  confirmAddScenario: (draft: NewScenarioDraft) => void;
  updateScenario: (
    id: string,
    patch: Partial<QaScenario> | ((prev: QaScenario) => Partial<QaScenario>),
  ) => void;
  editingSectionsById: Record<string, readonly TestScenarioSection[]>;
  setScenarioEditingSections: (
    id: string,
    sections: readonly TestScenarioSection[],
  ) => void;
  expandedScenarioId: string | null;
  toggleScenario: (id: string) => void;
  activeEnvironment: string;
  setActiveEnvironment: (value: string) => void;
  envSelector: UseSelectorStateReturn;
  statusSelectScenarioId: string | null;
  setStatusSelectOpen: (id: string, open: boolean) => void;
  evidencePreview: { scenarioId: string; index: number } | null;
  openEvidencePreview: (scenarioId: string, index: number) => void;
  closeEvidencePreview: () => void;
  setEvidencePreviewIndex: (index: number) => void;
}

export function useTicketOverviewState(
  scratchpadSeed: readonly ScratchpadLine[] = DEV_SCRATCHPAD_SEED,
  initialActiveTab = 'overview',
): UseTicketOverviewState {
  const [project, setProject] = useState('eng-core');
  const projectSelector = useSelectorState();
  const [activeNav, setActiveNav] = useState('tickets');
  const [activeTab, setActiveTab] = useState(initialActiveTab);
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
    const id = `scenario-${qaScenarios.length + 1}`;
    setQaScenarios((current) => [...current, toQaScenario(draft, id)]);
    // read text-like files after commit so their inline preview works too
    draft.evidence.forEach((file) => {
      if (file.type.startsWith('text/') || TEXT_LIKE_EVIDENCE.test(file.name)) {
        void file.text().then((text) =>
          setQaScenarios((current) =>
            current.map((scenario) =>
              scenario.id === id
                ? {
                    ...scenario,
                    evidence: scenario.evidence?.map((item) =>
                      item.label === file.name ? { ...item, text } : item,
                    ),
                  }
                : scenario,
            ),
          ),
        );
      }
    });
    setAddScenarioOpen(false);
  };

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

  const [qaScenarios, setQaScenarios] = useState<readonly QaScenario[]>(
    ticket.qa.scenarios,
  );
  const qaChecklist = toChecklistItems(qaScenarios);
  const qaFailedCount = countFailedScenarios(qaChecklist);
  const updateScenario = useCallback(
    (
      id: string,
      patch: Partial<QaScenario> | ((prev: QaScenario) => Partial<QaScenario>),
    ) => {
      setQaScenarios((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, ...(typeof patch === 'function' ? patch(s) : patch) }
            : s,
        ),
      );
    },
    [],
  );
  const [editingSectionsById, setEditingSectionsById] = useState<
    Record<string, readonly TestScenarioSection[]>
  >({});
  const setScenarioEditingSections = useCallback(
    (id: string, sections: readonly TestScenarioSection[]) => {
      setEditingSectionsById((prev) => ({ ...prev, [id]: sections }));
    },
    [],
  );
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>(
    null,
  );
  const toggleScenario = useCallback((id: string) => {
    setExpandedScenarioId((prev) => (prev === id ? null : id));
  }, []);
  const [activeEnvironment, setActiveEnvironment] = useState(
    ticket.qa.activeEnvironment,
  );
  const envSelector = useSelectorState();
  const [statusSelectScenarioId, setStatusSelectScenarioId] = useState<
    string | null
  >(null);
  const setStatusSelectOpen = useCallback((id: string, open: boolean) => {
    setStatusSelectScenarioId(open ? id : null);
  }, []);

  const [evidencePreview, setEvidencePreview] = useState<{
    scenarioId: string;
    index: number;
  } | null>(null);
  const openEvidencePreview = useCallback(
    (scenarioId: string, index: number) => {
      setEvidencePreview({ scenarioId, index });
    },
    [],
  );
  const closeEvidencePreview = useCallback(() => setEvidencePreview(null), []);
  const setEvidencePreviewIndex = useCallback((index: number) => {
    setEvidencePreview((prev) => (prev ? { ...prev, index } : prev));
  }, []);

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
    qaScenarios,
    qaChecklist,
    viewingTask,
    taskForm,
    setTaskForm,
    openTaskDrawer,
    closeTaskDrawer,
    taskDrawerTitle,
    taskSelectors,
    qaFailedCount,
    addScenarioOpen,
    scenarioDraft,
    setScenarioDraft,
    openAddScenario,
    cancelAddScenario,
    confirmAddScenario,
    updateScenario,
    editingSectionsById,
    setScenarioEditingSections,
    expandedScenarioId,
    toggleScenario,
    activeEnvironment,
    setActiveEnvironment,
    envSelector,
    statusSelectScenarioId,
    setStatusSelectOpen,
    evidencePreview,
    openEvidencePreview,
    closeEvidencePreview,
    setEvidencePreviewIndex,
  };
}
