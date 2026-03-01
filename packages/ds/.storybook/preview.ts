import type { Preview } from '@storybook/react';
import '../src/tokens/tokens.css';
import '../src/tokens/typography.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
