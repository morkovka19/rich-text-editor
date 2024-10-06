import type { Meta, StoryObj } from '@storybook/react';

import { IContentEditableBlock } from './ContentEditableBlock.types';
import EditableContentBlock from './index';

const meta: Meta<typeof EditableContentBlock> = {
    component: EditableContentBlock,
};

export default meta;
type Story = StoryObj<IContentEditableBlock>;

export const BaseRichTextEditor: Story = {
    args: {
        initialText: 'test',
        isEditable: true,
    },
};
