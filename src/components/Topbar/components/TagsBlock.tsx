import { useCallback, useMemo } from 'react';

import { useEditor } from '../../../context/LexicalContext';
import { useTooltip } from '../../../context/ToolbarContext';
import { typeSelectOptions } from '../../../utils/constants';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

export const TagsBlock = () => {
    const { editor } = useEditor();
    const { tag } = useTooltip();

    const handleUpdateTag = useCallback(
        (value: string) => {
            editor.triggerTagUpdate(value);
        },
        [editor]
    );

    const activeTag = useMemo(
        () => typeSelectOptions.find(op => op.value === tag) || typeSelectOptions.find(op => op.value === 'p'),
        [tag]
    );

    return (
        <ButtonsContainer>
            <Select options={typeSelectOptions} onChange={handleUpdateTag} value={activeTag} />
        </ButtonsContainer>
    );
};
