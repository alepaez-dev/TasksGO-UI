import { type HTMLAttributes } from 'react';
import { type TransitionDuration } from '../tokens/interaction';

export interface DialogLifecycleProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'title' | 'role'
> {
  open: boolean;
  onCancel: () => void;
  cancelLabel?: string;
  duration?: TransitionDuration;
  forceMount?: boolean;
  onOpened?: () => void;
  onClosed?: () => void;
}
