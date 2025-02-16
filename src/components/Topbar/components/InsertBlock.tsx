import { insertOptions } from '../../../helpers/constants';
import Plus from '../../../icons/topbar-insert/plus.svg';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import Select from '../../controls/Select';

const InsertBlock = () => {
    return (
        <ButtonsContainer>
            <Select options={insertOptions} Icon={Plus} isStaticName name="Insert" />
        </ButtonsContainer>
    );
};

export default InsertBlock;
