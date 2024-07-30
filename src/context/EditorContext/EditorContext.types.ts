import { Dispatch, SetStateAction } from 'react';

import { IEditorState } from '../../components/EditorState/EditorState.types';
import { ILexicalNode, NodeKeyType } from '../../components/nodes/LexicalNode.types';

export interface IEditorContextProps {
    state: IEditorState;
    setState: Dispatch<SetStateAction<IEditorState>>;
    addNode: (node: ILexicalNode, parentKey?: NodeKeyType) => void;
    removeNode: (key: string) => void;
    getNode: (key: string) => ILexicalNode | undefined;
    getChildren: (key: string) => ILexicalNode[];
    updateNode: (key: string, updateNode: Partial<ILexicalNode>) => void;
}
