import type { StorybookConfig } from '@storybook/react-vite';
import { dsTokensPlugin } from '../vite-plugin-ds-tokens.ts';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(config) {
    config.base = process.env.STORYBOOK_BASE_PATH || '/';
    config.plugins = config.plugins || [];
    config.plugins.push(dsTokensPlugin());
    return config;
  },
};

export default config;
