/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';

import { ButtonsContainer } from '../../controls/ButtonsContainer';
import { Select } from '../../controls/Select';
import { TypeOptionsValues, typeOptins } from '../helpers/constants';

export const TypeBlock = ({
    activeValueType,
    onChange,
}: {
    activeValueType: TypeOptionsValues;
    onChange: () => void;
}) => {
    const handleChangeType = useCallback(() => onChange(), [onChange]);

    return (
        <ButtonsContainer>
            <Select options={typeOptins} selectedValue={activeValueType} onChange={handleChangeType} />
        </ButtonsContainer>
    );
};
