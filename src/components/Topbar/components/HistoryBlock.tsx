import Redo from '../../../icons/topbar-history/redo.svg';
import Undo from '../../../icons/topbar-history/undo.svg';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';

export const HistoryBlock = () => (
    <ButtonsContainer>
        <Button theme="icon" Icon={Undo} />
        <Button theme="icon" Icon={Redo} />
    </ButtonsContainer>
);
