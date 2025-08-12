import type { Meta, StoryObj } from '@storybook/react';

import Editor from './index';
import { IEditor } from './types';

const meta: Meta<typeof Editor> = {
    component: Editor,
};

export default meta;
type Story = StoryObj<IEditor>;

export const BaseRichTextEditor: Story = {
    args: {
        initialText: 'test',
        isEditable: true,
    },
};
