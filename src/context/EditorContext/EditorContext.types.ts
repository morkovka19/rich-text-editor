import { Dispatch, SetStateAction } from 'react';

import { IEditorState } from '../../components/Editor/EditorState/EditorState.types';
import { ActionWithTag } from '../../helpers/constants';
import { IStyleNode, LexicalNode, NodeKeyType } from '../../types/nodes';
import { StylePropType } from './hooks/useStyle';
import { TagType } from './hooks/useTags';

export interface IEditorContextProps {
    state: IEditorState;
    setState: Dispatch<SetStateAction<IEditorState>>;
    undo: () => void;
    redo: () => void;
    isUndoDisabled: boolean;
    isRedoDisabled: boolean;
    updateStyle: (value: string, type: StylePropType) => void;
    style: IStyleNode;
    updateLastTag: (value: string) => void;
    tag: TagType;
    activeNode: LexicalNode;
    focuseNode: Node | null;
    editLinkTag: (action: ActionWithTag, key: NodeKeyType, href?: string) => void;
}
