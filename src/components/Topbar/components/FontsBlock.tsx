import FontIcon from '../../../icons/topbar-font/topbar-font.svg';
import { fontSelectOptions } from '../../../scripts/constants';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

export const FontsBlock = () => {
    return (
        <ButtonsContainer>
            <Select options={fontSelectOptions} Icon={FontIcon} />
        </ButtonsContainer>
    );
};
