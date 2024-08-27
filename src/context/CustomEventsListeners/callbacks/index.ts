import { IEditorState } from '../../../components/EditorState/EditorState.types';
import { EDITOR_ID, MAIN_DIV_ID } from '../../../helpers/constants';
import { createMutationObserver } from '../../../helpers/createMutationObserver';
import { onCreateNewNode } from './onCreateNewNode';
import { onUpdateContent } from './onUpdateContent';

export const onUpdateState = (state: IEditorState) => {
    if (state.lastUpdate) {
        const { lastUpdate } = state;
        switch (lastUpdate.typeUpdate) {
            case 'addChildren': {
                onCreateNewNode(state);
                break;
            }
            case 'updateContent': {
                onUpdateContent(state);
            }
        }
    } else if (!document.getElementById(MAIN_DIV_ID)) {
        const parentElement = document.getElementById(EDITOR_ID);
        const root = document.createElement('div');
        root.id = MAIN_DIV_ID;
        parentElement?.appendChild(root);
        root.style.minHeight = '10px';
        root.focus();

        createMutationObserver(MAIN_DIV_ID);
    }
};
