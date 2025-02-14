import { useCallback, useContext } from 'react';

import { EditorContext } from '../../../context/EditorContext';
import { IEditorContextProps } from '../../../context/EditorContext/EditorContext.types';
import { StylePropType } from '../../../context/EditorContext/hooks/useStyle';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Counter from '../../controls/Counter';

const FontSizeBlock = () => {
    const context = useContext(EditorContext) as IEditorContextProps;
    const { setStyle } = context;

    const handleUpdate = useCallback(
        (value: number) => {
            setStyle(String(value), StylePropType.FONT_SIZE);
        },
        [setStyle]
    );

    return (
        <ButtonsContainer>
            <Counter handelUpdate={handleUpdate} />
        </ButtonsContainer>
    );
};

export default FontSizeBlock;
