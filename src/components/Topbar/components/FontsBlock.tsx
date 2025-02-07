import { useCallback } from 'react';

import useStyle from '../../../context/EditorContext/hooks/useStyle';
import FontIcon from '../../../icons/topbar-font/topbar-font.svg';
import { fontSelectOptions } from '../../../scripts/constants';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

export const FontsBlock = () => {
    const { updateFont } = useStyle();

    const onChangeFont = useCallback(
        (value: string) => {
            updateFont(value);
        },
        [updateFont]
    );

    return (
        <ButtonsContainer>
            <Select options={fontSelectOptions} Icon={FontIcon} onChange={onChangeFont} />
        </ButtonsContainer>
    );
};
