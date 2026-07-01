import { useLayoutEffect, type RefObject } from 'react';

function nearestScrollableAncestor(el: HTMLElement): HTMLElement {
  let node = el.parentElement;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return (
    (document.scrollingElement as HTMLElement | null) ??
    document.documentElement
  );
}

export function useAutoGrowTextarea(
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string,
): void {
  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    const scroller = nearestScrollableAncestor(textarea);
    const { scrollTop } = scroller;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    scroller.scrollTop = scrollTop;
  }, [ref, value]);
}
