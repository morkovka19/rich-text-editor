import { LexicalNode, NodeKeyType } from '../../nodes';

export type NodeMapType<T> = Map<NodeKeyType, T>;

export interface IEditorState {
    nodeMap: NodeMapType<LexicalNode>;
}
