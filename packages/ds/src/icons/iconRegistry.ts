import type { ComponentType, SVGProps } from 'react';
import { AddIcon } from './add';
import { ArrowForwardIcon } from './arrowForward';
import { AttachFileIcon } from './attachFile';
import { AttachmentIcon } from './attachment';
import { AutoAwesomeIcon } from './autoAwesome';
import { BugReportIcon } from './bugReport';
import { CallMergeIcon } from './callMerge';
import { CancelIcon } from './cancel';
import { CheckIcon } from './check';
import { CheckCircleIcon } from './checkCircle';
import { ChevronLeftIcon } from './chevronLeft';
import { ChevronRightIcon } from './chevronRight';
import { CloseIcon } from './close';
import { CodeIcon } from './code';
import { CommentFilledIcon } from './commentFilled';
import { ConfirmationNumberIcon } from './confirmationNumber';
import { ConfirmationNumberFilledIcon } from './confirmationNumberFilled';
import { ContentCopyIcon } from './contentCopy';
import { DescriptionIcon } from './description';
import { DescriptionFilledIcon } from './descriptionFilled';
import { DownloadIcon } from './download';
import { DragIndicatorIcon } from './dragIndicator';
import { EditIcon } from './edit';
import { ExpandLessIcon } from './expandLess';
import { ExpandMoreIcon } from './expandMore';
import { FileUploadIcon } from './fileUpload';
import { FilterListIcon } from './filterList';
import { FlagIcon } from './flag';
import { FolderZipIcon } from './folderZip';
import { ForkRightIcon } from './forkRight';
import { FormatBoldIcon } from './formatBold';
import { FormatItalicIcon } from './formatItalic';
import { FormatListBulletedIcon } from './formatListBulleted';
import { FormatQuoteIcon } from './formatQuote';
import { HeadingIcon } from './heading';
import { HelpIcon } from './help';
import { ImageIcon } from './image';
import { LinkIcon } from './link';
import { LockIcon } from './lock';
import { MenuIcon } from './menu';
import { MoodIcon } from './mood';
import { MoreHorizIcon } from './moreHoriz';
import { OpenInFullIcon } from './openInFull';
import { OpenInNewIcon } from './openInNew';
import { PersonIcon } from './person';
import { PushPinFilledIcon } from './pushPinFilled';
import { ReplyIcon } from './reply';
import { ScheduleIcon } from './schedule';
import { ScienceIcon } from './science';
import { SearchIcon } from './search';
import { SettingsIcon } from './settings';
import { SignalCellularAltIcon } from './signalCellularAlt';
import { SignalCellularAlt1BarIcon } from './signalCellularAlt1Bar';
import { SignalCellularAlt2BarIcon } from './signalCellularAlt2Bar';
import { TagIcon } from './tag';
import { TaskAltIcon } from './taskAlt';
import { UnfoldMoreIcon } from './unfoldMore';
import { ViewKanbanIcon } from './viewKanban';
import { WarningIcon } from './warning';

export const iconRegistry = {
  add: AddIcon,
  arrow_forward: ArrowForwardIcon,
  attach_file: AttachFileIcon,
  attachment: AttachmentIcon,
  auto_awesome: AutoAwesomeIcon,
  bug_report: BugReportIcon,
  call_merge: CallMergeIcon,
  cancel: CancelIcon,
  check: CheckIcon,
  check_circle: CheckCircleIcon,
  chevron_left: ChevronLeftIcon,
  chevron_right: ChevronRightIcon,
  close: CloseIcon,
  code: CodeIcon,
  comment_filled: CommentFilledIcon,
  confirmation_number: ConfirmationNumberIcon,
  confirmation_number_filled: ConfirmationNumberFilledIcon,
  content_copy: ContentCopyIcon,
  description: DescriptionIcon,
  description_filled: DescriptionFilledIcon,
  download: DownloadIcon,
  drag_indicator: DragIndicatorIcon,
  edit: EditIcon,
  expand_less: ExpandLessIcon,
  expand_more: ExpandMoreIcon,
  file_upload: FileUploadIcon,
  filter_list: FilterListIcon,
  flag: FlagIcon,
  folder_zip: FolderZipIcon,
  fork_right: ForkRightIcon,
  format_bold: FormatBoldIcon,
  format_italic: FormatItalicIcon,
  format_list_bulleted: FormatListBulletedIcon,
  format_quote: FormatQuoteIcon,
  heading: HeadingIcon,
  help: HelpIcon,
  image: ImageIcon,
  link: LinkIcon,
  lock: LockIcon,
  menu: MenuIcon,
  mood: MoodIcon,
  more_horiz: MoreHorizIcon,
  open_in_full: OpenInFullIcon,
  open_in_new: OpenInNewIcon,
  person: PersonIcon,
  push_pin_filled: PushPinFilledIcon,
  reply: ReplyIcon,
  schedule: ScheduleIcon,
  science: ScienceIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  signal_cellular_alt: SignalCellularAltIcon,
  signal_cellular_alt_1_bar: SignalCellularAlt1BarIcon,
  signal_cellular_alt_2_bar: SignalCellularAlt2BarIcon,
  tag: TagIcon,
  task_alt: TaskAltIcon,
  unfold_more: UnfoldMoreIcon,
  view_kanban: ViewKanbanIcon,
  warning: WarningIcon,
} as const satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type IconName = keyof typeof iconRegistry;
