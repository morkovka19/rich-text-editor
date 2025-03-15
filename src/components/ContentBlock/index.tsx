/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, RefObject, forwardRef, useLayoutEffect } from 'react';

import { useEditor } from '../../context/LexicalContext';
import { useTooltip } from '../../context/ToolbarContext';
import { STYLE } from '../../utils/constants';
import { getStyleString } from '../../utils/styleUtils';
import './styles.scss';

export type ContentBlockProps = PropsWithChildren<{
    editorRef?: RefObject<HTMLDivElement>;
    isEditable?: boolean;
}>;

const ContentBlock = forwardRef<ContentBlockProps & HTMLDivElement>(
    ({ isEditable = true, children }: ContentBlockProps, ref) => {
        const { editor } = useEditor();
        const { style } = useTooltip();

        useLayoutEffect(() => {
            if (ref && 'current' in ref) {
                editor.start(ref.current as HTMLElement);
                (ref.current as HTMLElement).setAttribute(STYLE, getStyleString(style));
            }
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
