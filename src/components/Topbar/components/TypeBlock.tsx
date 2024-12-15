import { typeSelectOptions } from '../../../scripts/constants';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

export const TypeBlock = () => {
    return (
        <ButtonsContainer>
            <Select options={typeSelectOptions} />
        </ButtonsContainer>
    );
};
