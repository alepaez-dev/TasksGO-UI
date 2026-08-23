import { useCallback, useEffect, useState } from 'react';

export function useIsTruncated<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const ref = useCallback((el: T | null) => setNode(el), []);

  useEffect(() => {
    if (!node) return;
    if (
      typeof ResizeObserver === 'undefined' ||
      typeof MutationObserver === 'undefined'
    ) {
      return;
    }

    // Sub-pixel rounding leaves a fractional gap on text that fits, so only a
    // whole pixel counts as truncation.
    const measure = () =>
      setIsTruncated(node.scrollWidth - node.clientWidth > 1);

    const resize = new ResizeObserver(measure);
    resize.observe(node);

    const mutation = new MutationObserver(measure);
    mutation.observe(node, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, [node]);

  return [ref, isTruncated] as const;
}
