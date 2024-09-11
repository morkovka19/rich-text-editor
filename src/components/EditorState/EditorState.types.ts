import { LexicalNodeType, NodeMapType } from '../nodes/Nodes.types';

export interface IEditorState {
    nodeMap: NodeMapType<LexicalNodeType>;
}
