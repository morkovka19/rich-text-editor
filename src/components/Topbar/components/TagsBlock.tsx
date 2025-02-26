import { useCallback, useMemo } from 'react';

import { useEditor } from '../../../context/EditorContext/hooks/useEditor';
import { typeSelectOptions } from '../../../utils/constants';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

export const TagsBlock = () => {
    const context = useEditor();

    const { updateLastTag, activeNode, tag } = context;

    const handleUpdateTag = useCallback(
        (value: string) => {
            updateLastTag(value);
        },
        [updateLastTag]
    );

    const activeTag = useMemo(
        () =>
            typeSelectOptions.find(type => type.label === (activeNode?.getType() || tag.lastTag)) ||
            typeSelectOptions[0],
        [activeNode, tag.lastTag]
    );

    return (
        <ButtonsContainer>
            <Select options={typeSelectOptions} onChange={handleUpdateTag} value={activeTag} />
        </ButtonsContainer>
    );
};
