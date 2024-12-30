import { Dispatch, SetStateAction } from 'react';

import { IEditorState } from '../../components/Editor/EditorState/EditorState.types';

export interface IEditorContextProps {
    state: IEditorState;
    setState: Dispatch<SetStateAction<IEditorState>>;
}
