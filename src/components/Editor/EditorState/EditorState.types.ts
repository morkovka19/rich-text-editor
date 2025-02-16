import { LexicalNode, NodeKeyType } from '../../../types/nodes';

export type NodeMapType<T> = Map<NodeKeyType, T>;

export interface IEditorState {
    nodeMap: NodeMapType<LexicalNode>;
}
