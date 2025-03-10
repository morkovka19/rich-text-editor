import { useHistory } from '../../../context/HistoryContext';
import Redo from '../../../icons/topbar-history/redo.svg';
import Undo from '../../../icons/topbar-history/undo.svg';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';

export const HistoryBlock = () => {
    const { canRedo, canUndo, undo, redo } = useHistory();
    return (
        <ButtonsContainer>
            <Button theme="icon" Icon={Undo} onClick={undo} disabled={!canUndo} title="Назад" />
            <Button theme="icon" Icon={Redo} onClick={redo} disabled={!canRedo} title="Вперед" />
        </ButtonsContainer>
    );
};
