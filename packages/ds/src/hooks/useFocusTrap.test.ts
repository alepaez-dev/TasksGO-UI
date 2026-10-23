import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFocusTrap } from './useFocusTrap';

function createContainer() {
  const container = document.createElement('div');
  container.innerHTML = `
    <button>First</button>
    <input type="text" />
    <button>Last</button>
  `;
  document.body.appendChild(container);
  return container;
}

describe('useFocusTrap', () => {
  it('focuses first focusable element on activation', () => {
    const container = createContainer();
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));
    expect(document.activeElement).toBe(container.querySelector('button'));
    document.body.removeChild(container);
  });

  it('does not focus when inactive', () => {
    const container = createContainer();
    const ref = { current: container };
    const before = document.activeElement;
    renderHook(() => useFocusTrap(ref, false));
    expect(document.activeElement).toBe(before);
    document.body.removeChild(container);
  });

  it('restores focus on deactivation', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const container = createContainer();
    const ref = { current: container };
    const { unmount } = renderHook(() => useFocusTrap(ref, true));
    unmount();
    expect(document.activeElement).toBe(trigger);

    document.body.removeChild(container);
    document.body.removeChild(trigger);
  });

  it('falls back to restoreTo when the trigger was removed while open', () => {
    const trigger = document.createElement('button');
    const survivor = document.createElement('button');
    document.body.append(trigger, survivor);
    trigger.focus();

    const container = createContainer();
    const ref = { current: container };
    const { unmount } = renderHook(() =>
      useFocusTrap(ref, true, { restoreTo: () => survivor }),
    );
    trigger.remove();
    unmount();
    expect(document.activeElement).toBe(survivor);
    expect(document.activeElement).not.toBe(document.body);

    document.body.removeChild(container);
    document.body.removeChild(survivor);
  });

  it('resolves restoreTo when focus is restored, not when the trap opened', () => {
    const trigger = document.createElement('button');
    const early = document.createElement('button');
    document.body.append(trigger, early);
    trigger.focus();

    let target: HTMLElement | null = early;
    const container = createContainer();
    const ref = { current: container };
    const { unmount } = renderHook(() =>
      useFocusTrap(ref, true, { restoreTo: () => target }),
    );

    const later = document.createElement('button');
    document.body.append(later);
    early.remove();
    target = later;
    trigger.remove();
    unmount();

    expect(document.activeElement).toBe(later);

    document.body.removeChild(container);
    document.body.removeChild(later);
  });

  it('prefers the still-connected trigger over restoreTo', () => {
    const trigger = document.createElement('button');
    const survivor = document.createElement('button');
    document.body.append(trigger, survivor);
    trigger.focus();

    const container = createContainer();
    const ref = { current: container };
    const { unmount } = renderHook(() =>
      useFocusTrap(ref, true, { restoreTo: () => survivor }),
    );
    unmount();
    expect(document.activeElement).toBe(trigger);

    document.body.removeChild(container);
    document.body.removeChild(trigger);
    document.body.removeChild(survivor);
  });

  it('wraps focus forward from last to first element', () => {
    const container = createContainer();
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));

    const buttons = container.querySelectorAll('button');
    const last = buttons[buttons.length - 1];
    last.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
    });
    document.dispatchEvent(event);
    expect(document.activeElement).toBe(buttons[0]);

    document.body.removeChild(container);
  });

  it('wraps focus backward from first to last element', () => {
    const container = createContainer();
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));

    const buttons = container.querySelectorAll('button');
    const first = buttons[0];
    first.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);

    document.body.removeChild(container);
  });
});
