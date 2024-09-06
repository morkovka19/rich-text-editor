import { forwardRef } from 'react';

import './ContentEditableBlock.styles.scss';
import { IContentEditableBlock } from './ContentEditableBlock.types';

const ContentEditableBlock = forwardRef<IContentEditableBlock & HTMLDivElement>(
    ({ isEditable = true, children }: IContentEditableBlock, ref) => {
        return (
            <div
                id="editor"
                contentEditable={isEditable}
                className="content-block"
                suppressContentEditableWarning={isEditable}
                ref={ref}
            >
                {children}
            </div>
        );
    }
);

export default ContentEditableBlock;
