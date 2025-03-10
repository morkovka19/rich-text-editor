import Redo from '../../../icons/topbar-history/redo.svg';
import Undo from '../../../icons/topbar-history/undo.svg';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';

export const HistoryBlock = () => {
    return (
        <ButtonsContainer>
            <Button theme="icon" Icon={Undo} onClick={() => {}} disabled={true} title="Назад" />
            <Button theme="icon" Icon={Redo} onClick={() => {}} disabled={true} title="Вперед" />
        </ButtonsContainer>
    );
};
