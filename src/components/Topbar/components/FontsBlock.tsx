import { useCallback, useContext } from 'react';

import { EditorContext } from '../../../context/EditorContext';
import { IEditorContextProps } from '../../../context/EditorContext/EditorContext.types';
import { StylePropType } from '../../../context/EditorContext/hooks/useStyle';
import FontIcon from '../../../icons/topbar-font/topbar-font.svg';
import { fontSelectOptions } from '../../../scripts/constants';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

export const FontsBlock = () => {
    const context = useContext(EditorContext) as IEditorContextProps;
    const { setStyle } = context;

    const onChangeFont = useCallback(
        (value: string) => {
            setStyle(value, StylePropType.FONT_FAMILY);
        },
        [setStyle]
    );

    return (
        <ButtonsContainer>
            <Select options={fontSelectOptions} Icon={FontIcon} onChange={onChangeFont} />
        </ButtonsContainer>
    );
};
