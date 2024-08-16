import { Dispatch, SetStateAction } from 'react';

import { IEditorState } from '../../components/EditorState/EditorState.types';
import {
    ContentNodeType,
    LexicalNodeType,
    NodeKeyType,
    ParentNodeType,
    RootNodeType,
} from '../../components/nodes/Nodes.types';

export interface IEditorContextProps {
    state: IEditorState;
    setState: Dispatch<SetStateAction<IEditorState>>;
    addNode: (node: ContentNodeType | RootNodeType | ParentNodeType, parentKey?: NodeKeyType) => void;
    removeNode: (key: string) => void;
    getNode: (key: string) => LexicalNodeType | undefined;
    getChildren: (elKey: string) => NodeKeyType[] | undefined;
    updateNode: (key: string, updateNode: Partial<LexicalNodeType>) => void;
}
