import { useCallback, useMemo } from 'react';

import { useEditor } from '../../../context/LexicalContext';
import { useTooltip } from '../../../context/ToolbarContext';
import { StylePropsConst } from '../../../utils/styleUtils';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Counter from '../../controls/Counter';

const FontSizeBlock = () => {
    const { style, actualStyleRef, updateActualStyle } = useTooltip();
    const { editor } = useEditor();

    const handleUpdate = useCallback(
        (value: number) => {
            const newStyleProp = { [StylePropsConst.FONT_SIZE]: `${value}px` };
            updateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
        },
        [actualStyleRef, editor, updateActualStyle]
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
