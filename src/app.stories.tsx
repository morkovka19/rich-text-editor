import type { Meta } from '@storybook/react';

import { App } from './App.tsx';

const meta: Meta<typeof App> = {
    component: App,
};

export default meta;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Story = any;

export const MainApp: Story = {};
