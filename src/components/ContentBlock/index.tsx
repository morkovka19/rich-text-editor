/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, RefObject, forwardRef, useLayoutEffect, useState } from 'react';

import { useFormatting } from '../../context/FormattingContext';
import { useEditor } from '../../context/LexicalContext';
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
        const { style } = useFormatting();

        useLayoutEffect(() => {
            if (ref && 'current' in ref) {
                editor.start(ref.current as HTMLElement);
                (ref.current as HTMLElement).setAttribute(STYLE, getStyleString(style));
            }
        }, []);

        const [isAcrtive, setIsActive] = useState(false);

        return (
            <div
                id="editor"
                contentEditable={isEditable}
                className="content-block"
                suppressContentEditableWarning={isEditable}
                ref={ref}
                onClick={() => setIsActive(true)}
            >
                {children}
                {!children && !isAcrtive && <p className="content-block__placeholder">Enter some rich text...</p>}
            </div>
        );
    }
);

export default ContentBlock;
