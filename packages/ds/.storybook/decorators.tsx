import { useEffect, useRef } from 'react';
import type { Decorator } from '@storybook/react';
import { useGlobals } from 'storybook/preview-api';
import { mobileViewportOptions } from './preview';

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

// spread into a story that presents as a bottom sheet on a phone viewport
export const mobileSheetStory = {
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    layout: 'fullscreen',
    viewport: { options: mobileViewportOptions },
  },
};
