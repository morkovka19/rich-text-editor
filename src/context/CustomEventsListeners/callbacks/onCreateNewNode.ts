import { IEditorState } from '../../../components/EditorState/EditorState.types';
import { isContentNodeType } from '../../../components/nodes/scripts';

export const onCreateNewNode = (state: IEditorState) => {
    const { lastUpdate } = state;
    if (lastUpdate?.key && lastUpdate.child) {
        const parentElement = document.getElementById(lastUpdate?.key) as HTMLElement;
        parentElement.textContent = null;

        const childElement = document.createElement(lastUpdate.child.type);
        childElement.id = lastUpdate.child.key;
        if (isContentNodeType(lastUpdate.child)) childElement.textContent = lastUpdate.child.content || '';

        parentElement?.appendChild(childElement);
        childElement.focus();
        const sel = window.getSelection();
        sel?.collapse(childElement.firstChild, childElement.innerText.length);
    }
};
