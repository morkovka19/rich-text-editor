import { useEditor } from '../../../context/EditorContext/hooks/useEditor';
import Redo from '../../../icons/topbar-history/redo.svg';
import Undo from '../../../icons/topbar-history/undo.svg';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';

export const HistoryBlock = () => {
    const { undo, redo, isUndoDisabled, isRedoDisabled } = useEditor();

    return (
        <ButtonsContainer>
            <Button theme="icon" Icon={Undo} onClick={undo} disabled={isUndoDisabled} title="Назад" />
            <Button theme="icon" Icon={Redo} onClick={redo} disabled={isRedoDisabled} title="Вперед" />
        </ButtonsContainer>
    );
};
