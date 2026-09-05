import { type HTMLAttributes } from 'react';
import { type TransitionDuration } from '../tokens/interaction';

export type DialogPresentation = 'dialog' | 'sheet';

// the shell owns its own dialog semantics; consumers never supply them
export interface DialogLifecycleProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | 'onChange'
  | 'title'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-modal'
> {
  open: boolean;
  onCancel: () => void;
  cancelLabel?: string;
  duration?: TransitionDuration;
  forceMount?: boolean;
  onOpened?: () => void;
  onClosed?: () => void;
}
