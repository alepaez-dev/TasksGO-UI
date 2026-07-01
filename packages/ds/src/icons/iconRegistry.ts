import type { ComponentType, SVGProps } from 'react';
import { AddIcon } from './add';
import { AttachFileIcon } from './attachFile';
import { AttachmentIcon } from './attachment';
import { AutoAwesomeIcon } from './autoAwesome';
import { CallMergeIcon } from './callMerge';
import { CancelIcon } from './cancel';
import { CheckIcon } from './check';
import { CheckCircleIcon } from './checkCircle';
import { ChevronLeftIcon } from './chevronLeft';
import { ChevronRightIcon } from './chevronRight';
import { CloseIcon } from './close';
import { CodeIcon } from './code';
import { ConfirmationNumberIcon } from './confirmationNumber';
import { ConfirmationNumberFilledIcon } from './confirmationNumberFilled';
import { ContentCopyIcon } from './contentCopy';
import { DescriptionIcon } from './description';
import { DescriptionFilledIcon } from './descriptionFilled';
import { DragIndicatorIcon } from './dragIndicator';
import { ExpandMoreIcon } from './expandMore';
import { FlagIcon } from './flag';
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
import { MoreHorizIcon } from './moreHoriz';
import { OpenInNewIcon } from './openInNew';
import { PersonIcon } from './person';
import { ScheduleIcon } from './schedule';
import { SearchIcon } from './search';
import { SettingsIcon } from './settings';
import { SignalCellularAltIcon } from './signalCellularAlt';
import { TagIcon } from './tag';
import { TaskAltIcon } from './taskAlt';
import { UnfoldMoreIcon } from './unfoldMore';
import { WarningIcon } from './warning';

export const iconRegistry = {
  add: AddIcon,
  attach_file: AttachFileIcon,
  attachment: AttachmentIcon,
  auto_awesome: AutoAwesomeIcon,
  call_merge: CallMergeIcon,
  cancel: CancelIcon,
  check: CheckIcon,
  check_circle: CheckCircleIcon,
  chevron_left: ChevronLeftIcon,
  chevron_right: ChevronRightIcon,
  close: CloseIcon,
  code: CodeIcon,
  confirmation_number: ConfirmationNumberIcon,
  confirmation_number_filled: ConfirmationNumberFilledIcon,
  content_copy: ContentCopyIcon,
  description: DescriptionIcon,
  description_filled: DescriptionFilledIcon,
  drag_indicator: DragIndicatorIcon,
  expand_more: ExpandMoreIcon,
  flag: FlagIcon,
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
  more_horiz: MoreHorizIcon,
  open_in_new: OpenInNewIcon,
  person: PersonIcon,
  schedule: ScheduleIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  signal_cellular_alt: SignalCellularAltIcon,
  tag: TagIcon,
  task_alt: TaskAltIcon,
  unfold_more: UnfoldMoreIcon,
  warning: WarningIcon,
} as const satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type IconName = keyof typeof iconRegistry;
