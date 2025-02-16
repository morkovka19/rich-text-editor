import { useCallback } from 'react';

import { useEditor } from '../../../context/EditorContext/hooks/useEditor';
import { StylePropType } from '../../../context/EditorContext/hooks/useStyle';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Counter from '../../controls/Counter';

const FontSizeBlock = () => {
    const { updateStyle } = useEditor();

    const handleUpdate = useCallback(
        (value: number) => {
            updateStyle(String(value), StylePropType.FONT_SIZE);
        },
        [updateStyle]
    );

    return (
        <ButtonsContainer>
            <Counter handelUpdate={handleUpdate} />
        </ButtonsContainer>
    );
};

export default FontSizeBlock;
