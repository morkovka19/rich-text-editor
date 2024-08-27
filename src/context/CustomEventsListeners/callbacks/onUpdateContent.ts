import { IEditorState } from '../../../components/EditorState/EditorState.types';

export const onUpdateContent = (state: IEditorState) => {
    const { lastUpdate } = state;
    if (lastUpdate?.key) {
        const updatedElement = document.getElementById(lastUpdate.key) as HTMLElement;
        updatedElement!.textContent = lastUpdate.newContent || '';
    }
};
