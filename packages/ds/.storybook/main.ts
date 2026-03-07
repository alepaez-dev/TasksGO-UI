import type { StorybookConfig } from '@storybook/react-vite';
import { dsTokensPlugin } from '../vite-plugin-ds-tokens.ts';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(config) {
    config.plugins = config.plugins || [];
    config.plugins.push(dsTokensPlugin());
    return config;
  },
};

export default config;
