import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import styles from './Popover.module.css';

type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

type PopoverLabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type PopoverProps = PopoverLabelProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'aria-labelledby'> & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    anchorRef: RefObject<HTMLElement | null>;
    placement?: PopoverPlacement;
    children: ReactNode;
  };

function setPosition(
  popoverEl: HTMLDivElement,
  anchorEl: HTMLElement,
  placement: PopoverPlacement,
) {
  const anchorRect = anchorEl.getBoundingClientRect();
  let top: number;
  let left: number;

  switch (placement) {
    case 'bottom-end':
      top = anchorRect.bottom;
      left = anchorRect.right - popoverEl.offsetWidth;
      break;
    case 'top-start':
      top = anchorRect.top - popoverEl.offsetHeight;
      left = anchorRect.left;
      break;
    case 'top-end':
      top = anchorRect.top - popoverEl.offsetHeight;
      left = anchorRect.right - popoverEl.offsetWidth;
      break;
    case 'bottom-start':
    default:
      top = anchorRect.bottom;
      left = anchorRect.left;
      break;
  }

  popoverEl.style.top = `${Math.round(top)}px`;
  popoverEl.style.left = `${Math.round(left)}px`;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      open,
      onOpenChange,
      anchorRef,
      placement = 'bottom-start',
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (!open) return;
      const popoverEl = innerRef.current;
      const anchorEl = anchorRef.current;
      if (!popoverEl || !anchorEl) return;
      setPosition(popoverEl, anchorEl, placement);
    }, [open, anchorRef, placement]);

    useEffect(() => {
      if (!open) return;
      const reposition = () => {
        const popoverEl = innerRef.current;
        const anchorEl = anchorRef.current;
        if (!popoverEl || !anchorEl) return;
        setPosition(popoverEl, anchorEl, placement);
      };
      window.addEventListener('scroll', reposition, true);
      window.addEventListener('resize', reposition);
      return () => {
        window.removeEventListener('scroll', reposition, true);
        window.removeEventListener('resize', reposition);
      };
    }, [open, anchorRef, placement]);

    useEffect(() => {
      if (!open) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onOpenChange(false);
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onOpenChange]);

    useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node;
        const popoverEl = innerRef.current;
        const anchorEl = anchorRef.current;
        if (popoverEl?.contains(target)) return;
        if (anchorEl?.contains(target)) return;
        onOpenChange(false);
      };
      document.addEventListener('pointerdown', onPointerDown);
      return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open, anchorRef, onOpenChange]);

    useEffect(() => {
      if (!open) return;
      const popoverEl = innerRef.current;
      const previouslyFocused = document.activeElement as HTMLElement | null;
      popoverEl?.focus();
      return () => {
        // Return focus to the previously focused element on close (typically the anchor).
        previouslyFocused?.focus();
      };
    }, [open]);

    if (!open) return null;
    if (typeof document === 'undefined') return null;

    const mergedRef = (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return createPortal(
      <div
        ref={mergedRef}
        role="dialog"
        tabIndex={-1}
        className={cn(styles.popover, className)}
        {...rest}
      >
        {children}
      </div>,
      document.body,
    );
  },
);

Popover.displayName = 'Popover';
