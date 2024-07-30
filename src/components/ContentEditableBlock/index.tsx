import { FC } from 'react';

import { IEditableContentBlock } from './ContentEditableBlock.types';

const ContentEditableBlock: FC<IEditableContentBlock> = ({
    isEditable,
    initialText,
    editorRef,
}: IEditableContentBlock) => {
    return (
        <div
            contentEditable={isEditable}
            className="content-block_base"
            suppressContentEditableWarning={isEditable}
            ref={editorRef}
        >
            {initialText}
        </div>
    );
};

export default ContentEditableBlock;
