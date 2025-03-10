import { useCallback, useMemo } from 'react';

import { useEditor } from '../../../context/LexicalContext';
import { useTooltip } from '../../../context/ToolbarContext';
import { StylePropsConst } from '../../../utils/styleUtils';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Counter from '../../controls/Counter';

const FontSizeBlock = () => {
    const { style, actualStyleRef, handleUpdateActualStyle } = useTooltip();
    const { editor } = useEditor();

    const handleUpdate = useCallback(
        (value: number) => {
            const newStyleProp = { [StylePropsConst.FONT_SIZE]: `${value}px` };
            handleUpdateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
        },
        [actualStyleRef, editor, handleUpdateActualStyle]
    );

    const activeSize = useMemo(() => {
        const styleSize = style[StylePropsConst.FONT_SIZE];
        return Number(styleSize.replace('px', ''));
    }, [style]);

    return (
        <ButtonsContainer>
            <Counter handelUpdate={handleUpdate} value={activeSize} />
        </ButtonsContainer>
    );
};

export default FontSizeBlock;
