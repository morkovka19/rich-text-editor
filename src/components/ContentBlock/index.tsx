/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, RefObject, forwardRef, useLayoutEffect } from 'react';

import { useEditor } from '../../context/LexicalContext';
import './styles.scss';

export type ContentBlockProps = PropsWithChildren<{
    editorRef?: RefObject<HTMLDivElement>;
    isEditable?: boolean;
}>;

const ContentBlock = forwardRef<ContentBlockProps & HTMLDivElement>(
    ({ isEditable = true, children }: ContentBlockProps, ref) => {
        const { editor } = useEditor();

        useLayoutEffect(() => {
            if (ref && 'current' in ref) editor.start(ref.current as HTMLElement);
        }, []);

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

export default ContentBlock;
