import { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../src/components/**/*.stories.tsx'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: '@storybook/react-vite',
};

export default config;
