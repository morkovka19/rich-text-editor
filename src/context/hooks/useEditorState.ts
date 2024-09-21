import { isParentTagType } from '../../helpers/checkTypeTag';
import { TEXT_KEY } from '../../helpers/constants';
import { LexicalNode, NodeKeyType, TextNode } from '../../nodes';
import { IEditorState } from '../EditorState/EditorState.types';

export const useEditorState = () => {
    const getNode = (state: IEditorState, key: NodeKeyType) => state.nodeMap.get(key);

    // const getChildNodeMap = (node: ContentNodeType | ParentNodeType | RootNodeType, state: IEditorState) =>
    //     node.children.map((key: NodeKeyType) => getNode(state, key));

    // const removeLineBreak = (state: IEditorState, node: LineBreakNodeType) => {
    //     const parentNode = state.nodeMap.get(node.parent);
    //     if (parentNode && isContentNodeType(parentNode)) {
    //         const newNodeMap = state.nodeMap;
    //         const newParentNode = { ...parentNode, children: parentNode.children.filter(key => key !== node.key) };
    //         newNodeMap.set(newParentNode.key, newParentNode);
    //         newNodeMap.delete(node.key);
    //         return {
    //             ...state,
    //             nodeMap: newNodeMap,
    //         };
    //     }
    //     return state;
    // };

    const removeNode = (state: IEditorState, key?: NodeKeyType) => {
        const newNodeMap = new Map(state.nodeMap);
        if (key) {
            const children = newNodeMap.get(key)?.getChildList();
            if (children) {
                children.forEach(child => {
                    if (typeof child === 'string') removeNode(state, child);
                });
            }
            const node = state.nodeMap.get(key);
            newNodeMap.delete(key);
            const index = newNodeMap
                .get(node?.getParent() || '')
                ?.getChildList()
                ?.indexOf(key);
            if (index && index >= 0)
                newNodeMap
                    .get(node?.getParent() || '')
                    ?.getChildList()
                    ?.splice(index, 1);
        }
        return { ...state, nodeMap: newNodeMap };
    };

    const addNodeToState = (state: IEditorState, node: LexicalNode /*prevNodeKey?: NodeKeyType*/) => {
        const { nodeMap } = state;
        nodeMap.set(node.getKey(), node);
        const parentNode: LexicalNode = nodeMap.get(node.getParent() as string) as LexicalNode;
        parentNode?.addChild(node.getKey() !== TEXT_KEY ? node.getKey() : (node as TextNode));
        // if (prevNodeKey) {
        //     const index = parentNode.getChildList()?.indexOf(prevNodeKey);
        //     // parentNode.().splice(index + 1, 0, node.getKey());
        // } else {
    };

    const addTextNodeToState = (state: IEditorState, node: TextNode /*prevNodeKey?: NodeKeyType*/) => {
        const { nodeMap } = state;
        const parent = nodeMap.get(node?.getParent());
        parent?.addChild(node);
    };

    const getFirstParentNode = (key: string, state: IEditorState, childKey?: string) => {
        const { nodeMap } = state;
        const node = nodeMap.get(key);
        const parent = node?.getParent() as string;
        const parentNode = nodeMap.get(parent) as LexicalNode;
        if (!isParentTagType(parentNode?.getType())) {
            getFirstParentNode(parent, state, node?.getKey());
        }

        return {
            key: parentNode?.getKey(),
            child: childKey,
        };
    };

    return {
        getNode,
        addNodeToState,
        removeNode,
        getFirstParentNode,
        addTextNodeToState,
    };
};
