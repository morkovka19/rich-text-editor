import { useCallback, useMemo } from 'react';

import { useEditor } from '../../../context/EditorContext/hooks/useEditor';
import { StylePropType } from '../../../context/EditorContext/hooks/useStyle';
import { fontSelectOptions } from '../../../helpers/constants';
import FontIcon from '../../../icons/topbar-font/topbar-font.svg';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

export const FontsBlock = () => {
    const { updateStyle, style, activeNode } = useEditor();

    const onChangeFont = useCallback(
        (value: string) => {
            updateStyle(value, StylePropType.FONT_FAMILY);
        },
        [updateStyle]
    );

    const activeFont = useMemo(() => {
        const styleActual = activeNode?.getStyle()?.fontFamily || style.fontFamily;
        return fontSelectOptions.find(font => font.value === styleActual) || fontSelectOptions[0];
    }, [style.fontFamily, activeNode]);

    return (
        <ButtonsContainer>
            <Select options={fontSelectOptions} Icon={FontIcon} onChange={onChangeFont} value={activeFont} />
        </ButtonsContainer>
    );
};
