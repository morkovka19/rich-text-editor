import { useCallback } from 'react';

import { useEditor } from '../../../context/EditorContext/hooks/useEditor';
import { typeSelectOptions } from '../../../helpers/constants';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

export const TagsBlock = () => {
    const context = useEditor();

    const { updateLastTag } = context;

    const handleUpdateTag = useCallback(
        (value: string) => {
            updateLastTag(value);
        },
        [updateLastTag]
    );

    return (
        <ButtonsContainer>
            <Select options={typeSelectOptions} onChange={handleUpdateTag} />
        </ButtonsContainer>
    );
};
