import { textBlockOptions } from '../../../scripts/constants';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

const TextStyleBlock = () => {
    return (
        <ButtonsContainer>
            <Select options={textBlockOptions} />
        </ButtonsContainer>
    );
};

export default TextStyleBlock;
