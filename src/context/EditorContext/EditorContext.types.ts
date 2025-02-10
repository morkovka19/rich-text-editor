import { Dispatch, SetStateAction } from 'react';

import { IEditorState } from '../../components/Editor/EditorState/EditorState.types';
import { StylePropType } from './hooks/useStyle';

export interface IEditorContextProps {
    state: IEditorState;
    setState: Dispatch<SetStateAction<IEditorState>>;
    undo: () => void;
    redo: () => void;
    isUndoDisabled: boolean;
    isRedoDisabled: boolean;
    setStyle: (value: string, type: StylePropType) => void;
}
