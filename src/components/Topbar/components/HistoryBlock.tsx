import { useContext } from 'react';

import { EditorContext } from '../../../context/EditorContext';
import Redo from '../../../icons/topbar-history/redo.svg';
import Undo from '../../../icons/topbar-history/undo.svg';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';

export const HistoryBlock = () => {
    const context = useContext(EditorContext);

    if (!context) {
        return null;
    }

    const { undo, redo, isUndoDisabled, isRedoDisabled } = context;

    return (
        <ButtonsContainer>
            <Button theme="icon" Icon={Undo} onClick={undo} disabled={isUndoDisabled} title="Назад" />
            <Button theme="icon" Icon={Redo} onClick={redo} disabled={isRedoDisabled} title="Вперед" />
        </ButtonsContainer>
    );
};
