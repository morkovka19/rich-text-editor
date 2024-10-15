import redo from '../../../icons/topbar-history/redo.svg';
import undo from '../../../icons/topbar-history/undo.svg';
import { Button } from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';

export const HistoryBlock = () => (
    <ButtonsContainer>
        <Button Icon={undo} onClick={() => {}} />
        <Button Icon={redo} onClick={() => {}} />
    </ButtonsContainer>
);
