import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useIsTruncated } from './useIsTruncated';

// jsdom has no layout and no ResizeObserver, so both are stubbed: the observer
// reports once on observe, the metrics decide what it sees.
function stubLayout(scrollWidth: number, clientWidth: number) {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(private cb: () => void) {}
      observe() {
        this.cb();
      }
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(
    scrollWidth,
  );
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(
    clientWidth,
  );
}

function Probe() {
  const [ref, isTruncated] = useIsTruncated<HTMLSpanElement>();
  return (
    <span ref={ref} data-testid="probe">
      {String(isTruncated)}
    </span>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('useIsTruncated', () => {
  it('reports truncation when content overflows the box', () => {
    stubLayout(400, 260);
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('true');
  });

  it('reports no truncation when the content fits', () => {
    stubLayout(260, 260);
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('false');
  });

  it('ignores a sub-pixel difference', () => {
    stubLayout(261, 260);
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('false');
  });

  it('stays false when ResizeObserver is unavailable', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(260);
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('false');
  });
});
