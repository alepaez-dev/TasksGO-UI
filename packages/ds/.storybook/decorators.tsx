import { useEffect, useRef } from 'react';
import type { Decorator } from '@storybook/react';
import { useGlobals } from 'storybook/preview-api';

export const VIEWPORT_APPLIED_ATTR = 'data-ds-viewport-applied';

export const withDefaultViewport =
  (viewport: string): Decorator =>
  (Story, context) => {
    const [, updateGlobals] = useGlobals();
    const applied = useRef(false);
    const isDocs = context.viewMode === 'docs';
    useEffect(() => {
      if (!applied.current && !isDocs) {
        applied.current = true;
        updateGlobals({ viewport: { value: viewport } });
        document.documentElement.setAttribute(VIEWPORT_APPLIED_ATTR, viewport);
      }
    }, [updateGlobals, isDocs]);
    return <Story />;
  };
