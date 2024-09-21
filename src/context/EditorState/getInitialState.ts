import { LexicalNode, RootNode } from '../../nodes';
import { IEditorState, NodeMapType } from './EditorState.types';

export const createInitialNodeMap = () => {
    const map = new Map() as NodeMapType<LexicalNode>;
    const root = new RootNode();
    map.set(root.getKey(), root);
    return map;
};

export const getIntialState = () =>
    ({
        nodeMap: new Map() as NodeMapType<LexicalNode>,
    }) as IEditorState;
