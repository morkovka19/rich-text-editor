import { useCallback, useMemo } from 'react';

import { useEditor } from '../../../context/EditorContext/hooks/useEditor';
import { StylePropType } from '../../../context/EditorContext/hooks/useStyle';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Counter from '../../controls/Counter';

const FontSizeBlock = () => {
    const { updateStyle, activeNode, style } = useEditor();

    const handleUpdate = useCallback(
        (value: number) => {
            updateStyle(String(value), StylePropType.FONT_SIZE);
        },
        [updateStyle]
    );

    const activeSize = useMemo(() => {
        const styleSize = activeNode?.getStyle()?.fontSize || style.fontSize || 14;
        return styleSize;
    }, [style.fontSize, activeNode]);

    return (
        <ButtonsContainer>
            <Counter handelUpdate={handleUpdate} value={activeSize} />
        </ButtonsContainer>
    );
};

export default FontSizeBlock;
