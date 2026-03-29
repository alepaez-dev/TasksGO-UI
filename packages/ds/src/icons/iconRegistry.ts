import type { ComponentType, SVGProps } from 'react';
import { AddIcon } from './add';
import { AttachFileIcon } from './attachFile';
import { AttachmentIcon } from './attachment';
import { CheckCircleIcon } from './checkCircle';
import { ChevronRightIcon } from './chevronRight';
import { CloseIcon } from './close';
import { ConfirmationNumberIcon } from './confirmationNumber';
import { DescriptionIcon } from './description';
import { HelpIcon } from './help';
import { LinkIcon } from './link';
import { MenuIcon } from './menu';
import { SearchIcon } from './search';
import { SettingsIcon } from './settings';
import { TaskAltIcon } from './taskAlt';
import { UnfoldMoreIcon } from './unfoldMore';

export const iconRegistry = {
  add: AddIcon,
  attach_file: AttachFileIcon,
  attachment: AttachmentIcon,
  check_circle: CheckCircleIcon,
  chevron_right: ChevronRightIcon,
  close: CloseIcon,
  confirmation_number: ConfirmationNumberIcon,
  description: DescriptionIcon,
  help: HelpIcon,
  link: LinkIcon,
  menu: MenuIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  task_alt: TaskAltIcon,
  unfold_more: UnfoldMoreIcon,
} as const satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type IconName = keyof typeof iconRegistry;
