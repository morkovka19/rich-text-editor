import { IBaseSelection } from '../Selection/BaseSelection.types';
import {
    ContentNodeType,
    LexicalNodeType,
    NodeKeyType,
    NodeMapType,
    ParentNodeType,
    RootNodeType,
} from '../nodes/Nodes.types';

export type TypeUpdate = 'create' | 'updateChildren' | 'updateContent' | 'addChildren' | 'createRoot';
export interface ILastUpdate {
    key: NodeKeyType;
    typeUpdate: TypeUpdate;
    child?: LexicalNodeType;
    newContent?: string;
}

export interface IEditorState {
    nodeMap: NodeMapType<ParentNodeType | RootNodeType | ContentNodeType>;
    selection: IBaseSelection | null;
    flushSync: boolean;
    readOnly: boolean;
}
