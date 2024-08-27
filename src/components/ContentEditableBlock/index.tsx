import { FC } from 'react';

import './ContentEditableBlock.styles.scss';
import { IEditableContentBlock } from './ContentEditableBlock.types';

const ContentEditableBlock: FC<IEditableContentBlock> = ({
    isEditable,
    editorRef,
    children,
}: IEditableContentBlock) => {
    return (
        <div
            id="editor"
            contentEditable={isEditable}
            className="content-block"
            suppressContentEditableWarning={isEditable}
            ref={editorRef}
        >
            {children}
        </div>
    );
};

export default ContentEditableBlock;
