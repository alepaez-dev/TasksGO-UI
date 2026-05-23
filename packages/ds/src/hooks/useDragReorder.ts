import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

function moveItem<T>(
  arr: readonly T[],
  fromIndex: number,
  toIndex: number,
): readonly T[] {
  const next = [...arr];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

interface DragSession {
  fromIndex: number;
  offsetX: number;
  offsetY: number;
  toIndex: number | null;
  toAbove: boolean;
  pointerId: number;
  handle: HTMLButtonElement;
  sourceRow: HTMLLIElement;
  clone: HTMLLIElement;
  listEl: HTMLUListElement;
  onMove: (event: PointerEvent) => void;
  onUp: (event: PointerEvent) => void;
  onKey: (event: globalThis.KeyboardEvent) => void;
}

export interface UseDragReorderClasses {
  dragging: string;
  dropAbove: string;
  dropBelow: string;
  floatingClone: string;
  floatingCloneLifted: string;
}

export interface UseDragReorderOptions<T> {
  items: readonly T[];
  onReorder?: (next: readonly T[]) => void;
  listRef: RefObject<HTMLUListElement | null>;
  classes: UseDragReorderClasses;
}

export interface UseDragReorderHandlers {
  onPointerDown: (
    event: ReactPointerEvent<HTMLButtonElement>,
    index: number,
  ) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
}

export function useDragReorder<T>({
  items,
  onReorder,
  listRef,
  classes,
}: UseDragReorderOptions<T>): UseDragReorderHandlers {
  const sessionRef = useRef<DragSession | null>(null);

  const clearIndicators = (listEl: HTMLUListElement) => {
    listEl.querySelectorAll('li').forEach((row) => {
      row.classList.remove(classes.dropAbove, classes.dropBelow);
    });
  };

  const endSession = (commit: boolean) => {
    const session = sessionRef.current;
    if (!session) return;

    session.handle.removeEventListener('pointermove', session.onMove);
    session.handle.removeEventListener('pointerup', session.onUp);
    session.handle.removeEventListener('pointercancel', session.onUp);
    document.removeEventListener('keydown', session.onKey);
    if (session.handle.hasPointerCapture?.(session.pointerId)) {
      session.handle.releasePointerCapture(session.pointerId);
    }

    session.clone.remove();
    session.sourceRow.classList.remove(classes.dragging);
    clearIndicators(session.listEl);
    document.body.style.removeProperty('user-select');

    let to: number | null = null;
    if (commit && session.toIndex !== null) {
      // Source is removed before insert, so shift target down by one when dropping past it.
      let target = session.toAbove ? session.toIndex : session.toIndex + 1;
      if (session.fromIndex < target) target--;
      if (target !== session.fromIndex) to = target;
    }

    sessionRef.current = null;

    if (to !== null) {
      onReorder?.(moveItem(items, session.fromIndex, to));
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    const session = sessionRef.current;
    if (!session) return;

    const x = event.clientX - session.offsetX;
    const y = event.clientY - session.offsetY;
    session.clone.style.transform = `translate(${x}px, ${y}px)`;

    const rows = Array.from(
      session.listEl.querySelectorAll('li'),
    ) as HTMLLIElement[];
    clearIndicators(session.listEl);

    let hitIndex: number | null = null;
    for (let i = 0; i < rows.length; i++) {
      if (i === session.fromIndex) continue;
      const rect = rows[i].getBoundingClientRect();
      if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
        hitIndex = i;
        break;
      }
    }

    session.toIndex = hitIndex;
    if (hitIndex !== null) {
      session.toAbove = session.fromIndex > hitIndex;
      rows[hitIndex].classList.add(
        session.toAbove ? classes.dropAbove : classes.dropBelow,
      );
    }
  };

  const onPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.button) return;
    const handle = event.currentTarget;
    const row = handle.closest('li');
    const listEl = listRef.current;
    if (!row || !listEl) return;

    event.preventDefault();

    const rect = row.getBoundingClientRect();
    const clone = row.cloneNode(true) as HTMLLIElement;
    clone.classList.add(classes.floatingClone);
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    document.body.appendChild(clone);

    row.classList.add(classes.dragging);
    document.body.style.setProperty('user-select', 'none');

    requestAnimationFrame(() => {
      clone.classList.add(classes.floatingCloneLifted);
    });

    handle.setPointerCapture?.(event.pointerId);

    const session: DragSession = {
      fromIndex: index,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      toIndex: null,
      toAbove: false,
      pointerId: event.pointerId,
      handle,
      sourceRow: row,
      clone,
      listEl,
      onMove: (e) => handlePointerMove(e),
      onUp: (e) => {
        endSession(e.type === 'pointerup');
      },
      onKey: (e) => {
        if (e.key === 'Escape') endSession(false);
      },
    };
    sessionRef.current = session;

    handle.addEventListener('pointermove', session.onMove);
    handle.addEventListener('pointerup', session.onUp);
    handle.addEventListener('pointercancel', session.onUp);
    document.addEventListener('keydown', session.onKey);
  };

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (!event.altKey) return;
    if (event.key === 'ArrowUp' && index > 0) {
      event.preventDefault();
      onReorder?.(moveItem(items, index, index - 1));
    } else if (event.key === 'ArrowDown' && index < items.length - 1) {
      event.preventDefault();
      onReorder?.(moveItem(items, index, index + 1));
    }
  };

  const endSessionRef = useRef(endSession);
  useEffect(() => {
    endSessionRef.current = endSession;
  });

  useEffect(() => {
    return () => {
      if (sessionRef.current) endSessionRef.current(false);
    };
  }, []);

  return { onPointerDown, onKeyDown };
}
