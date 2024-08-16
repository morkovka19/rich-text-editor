import type { Meta, StoryObj } from '@storybook/react';

import { IEditor } from './Editor.types';
import Editor from './index';

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
