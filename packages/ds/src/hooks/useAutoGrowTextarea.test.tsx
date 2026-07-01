import { useRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';

import { useAutoGrowTextarea } from './useAutoGrowTextarea';

function Harness({ value }: { value: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useAutoGrowTextarea(ref, value);
  return <textarea ref={ref} value={value} readOnly aria-label="grow" />;
}

const proto = window.HTMLTextAreaElement.prototype;
let original: PropertyDescriptor | undefined;

function stubScrollHeight(px: number) {
  original = Object.getOwnPropertyDescriptor(proto, 'scrollHeight');
  Object.defineProperty(proto, 'scrollHeight', {
    configurable: true,
    get: () => px,
  });
}

afterEach(() => {
  if (original) Object.defineProperty(proto, 'scrollHeight', original);
  original = undefined;
});

describe('useAutoGrowTextarea', () => {
  it('sizes the textarea to its content height on mount', () => {
    stubScrollHeight(140);
    const { getByLabelText } = render(<Harness value="hello" />);
    const textarea = getByLabelText('grow') as HTMLTextAreaElement;
    expect(textarea.style.height).toBe('140px');
  });

  it('re-sizes when the value changes', () => {
    stubScrollHeight(80);
    const { getByLabelText, rerender } = render(<Harness value="a" />);
    const textarea = getByLabelText('grow') as HTMLTextAreaElement;
    expect(textarea.style.height).toBe('80px');

    if (original) Object.defineProperty(proto, 'scrollHeight', original);
    stubScrollHeight(220);
    rerender(<Harness value={'a\nb\nc\nd'} />);
    expect(textarea.style.height).toBe('220px');
  });
});
