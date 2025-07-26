import type { Meta } from '@storybook/react';

import { RichEditor } from './RichEditor.tsx';

const meta: Meta<typeof RichEditor> = {
    component: RichEditor,
};

export default meta;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Story = any;

export const MainApp: Story = {};
