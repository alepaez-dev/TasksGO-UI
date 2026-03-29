import type { ComponentType, SVGProps } from 'react';
import { AddIcon } from './add';
import { AttachFileIcon } from './attachFile';
import { AttachmentIcon } from './attachment';
import { AutoAwesomeIcon } from './autoAwesome';
import { CheckCircleIcon } from './checkCircle';
import { ChevronRightIcon } from './chevronRight';
import { CloseIcon } from './close';
import { ConfirmationNumberIcon } from './confirmationNumber';
import { DescriptionIcon } from './description';
import { ExpandMoreIcon } from './expandMore';
import { FlagIcon } from './flag';
import { HelpIcon } from './help';
import { LinkIcon } from './link';
import { MenuIcon } from './menu';
import { PersonIcon } from './person';
import { SearchIcon } from './search';
import { SettingsIcon } from './settings';
import { SignalCellularAltIcon } from './signalCellularAlt';
import { TagIcon } from './tag';
import { TaskAltIcon } from './taskAlt';
import { UnfoldMoreIcon } from './unfoldMore';

export const iconRegistry = {
  add: AddIcon,
  attach_file: AttachFileIcon,
  attachment: AttachmentIcon,
  auto_awesome: AutoAwesomeIcon,
  check_circle: CheckCircleIcon,
  chevron_right: ChevronRightIcon,
  close: CloseIcon,
  confirmation_number: ConfirmationNumberIcon,
  description: DescriptionIcon,
  expand_more: ExpandMoreIcon,
  flag: FlagIcon,
  help: HelpIcon,
  link: LinkIcon,
  menu: MenuIcon,
  person: PersonIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  signal_cellular_alt: SignalCellularAltIcon,
  tag: TagIcon,
  task_alt: TaskAltIcon,
  unfold_more: UnfoldMoreIcon,
} as const satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type IconName = keyof typeof iconRegistry;
