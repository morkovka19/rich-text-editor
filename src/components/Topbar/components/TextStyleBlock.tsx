import { useCallback, useMemo } from 'react';

import { useEditor } from '../../../context/LexicalContext';
import { useTooltip } from '../../../context/ToolbarContext';
import { textBlockOptions } from '../../../utils/constants';
import { StylePropsConst } from '../../../utils/styleUtils';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

const TextStyleBlock = () => {
    const { styleParent } = useTooltip();
    const { editor } = useEditor();

    const value = useMemo(
        () => textBlockOptions.find(op => op.value === styleParent[StylePropsConst.TEXT_ALIGN]) || textBlockOptions[0],
        [styleParent]
    );

    const handleChange = useCallback(
        (value: string) => {
            editor.triggerDecorateParent({ [StylePropsConst.TEXT_ALIGN]: value });
        },
        [editor]
    );

    return (
        <ButtonsContainer>
            <Select options={textBlockOptions} value={value} onChange={handleChange} />
        </ButtonsContainer>
    );
};

export default TextStyleBlock;
