import { useCallback } from 'react';

import FontsIcon from '../../../icons/topbar-font/topbar-font.svg';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import { Select } from '../../controls/Select';
import { fontOptions } from '../helpers/constants';

export const FontsBlock = ({ activeValueFont, onChange }: { activeValueFont: string; onChange: () => void }) => {
    const handleChangeType = useCallback(() => onChange(), [onChange]);

    return (
        <ButtonsContainer>
            <Select
                options={fontOptions}
                selectedValue={activeValueFont}
                onChange={handleChangeType}
                Icon={FontsIcon}
            />
        </ButtonsContainer>
    );
};
