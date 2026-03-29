import type { Preview } from '@storybook/react';
import '../src/tokens/tokens.css';
import '../src/tokens/typography.css';

const mobileViewports = {
  mobileSmall: {
    name: 'Small mobile',
    styles: { width: '320px', height: '568px' },
  },
  mobile: {
    name: 'Large mobile',
    styles: { width: '375px', height: '812px' },
  },
  tablet: {
    name: 'Tablet',
    styles: { width: '768px', height: '1024px' },
  },
};

const desktopViewports = {
  responsive: {
    name: 'Desktop',
    styles: { width: '100%', height: '100%' },
  },
};

const mobileViewportOptions = {
  ...mobileViewports,
  responsive: {
    name: 'Default',
    styles: mobileViewports.mobile.styles,
  },
};

const preview: Preview = {
  initialGlobals: {
    viewport: { value: 'responsive' },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: desktopViewports,
    },
    a11y: {
      config: {
        rules: [
          // Component stories render in isolation without page landmarks —
          // the consuming app provides <main>/<nav>/etc.
          { id: 'region', enabled: false },
        ],
      },
    },
  },
};

export default preview;
export { mobileViewports, mobileViewportOptions, desktopViewports };
