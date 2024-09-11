import type { Meta, StoryObj } from '@storybook/react';

import { IEditableContentBlock } from './ContentEditableBlock.types';
import EditableContentBlock from './index';

const meta: Meta<typeof EditableContentBlock> = {
    component: EditableContentBlock,
};

export default meta;
type Story = StoryObj<IEditableContentBlock>;

export const BaseRichTextEditor: Story = {
    args: {
        initialText: 'test',
        isEditable: true,
    },
};
