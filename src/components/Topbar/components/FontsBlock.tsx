import { useCallback, useMemo } from 'react';

import { useEditor } from '../../../context/LexicalContext';
import { useTooltip } from '../../../context/ToolbarContext';
import FontIcon from '../../../icons/topbar-font/topbar-font.svg';
import { fontSelectOptions } from '../../../utils/constants';
import { StylePropsConst } from '../../../utils/styleUtils';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

export const FontsBlock = () => {
    const { style, actualStyleRef, updateActualStyle } = useTooltip();
    const { editor } = useEditor();
    const fontFamily = useMemo(() => style.fontFamily, [style.fontFamily]);
    const activeOption = useMemo(() => fontSelectOptions.find(val => val.value === fontFamily), [fontFamily]);

    const onChangeFont = useCallback(
        (value: string) => {
            const newStyleProp = { [StylePropsConst.FONT_FAMILY]: value };
            updateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
        },
        [actualStyleRef, editor, updateActualStyle]
    );

    return (
        <ButtonsContainer>
            <Select options={fontSelectOptions} Icon={FontIcon} onChange={onChangeFont} value={activeOption} />
        </ButtonsContainer>
    );
};
