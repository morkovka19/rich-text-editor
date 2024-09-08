import { IEditorState } from '../../components/EditorState/EditorState.types';
import { ContentNodeType, LexicalNodeType, NodeKeyType } from '../../components/nodes/Nodes.types';
import { isContentNodeType, isRootNodeType } from '../../helpers/checkTypeNode';

export const useEditorState = () => {
    // const getNode = (state: IEditorState, key: NodeKeyType) => state.nodeMap.get(key);

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
            const children = newNodeMap.get(key)?.children;
            if (children) {
                children.forEach(child => {
                    removeNode(state, child);
                });
            }
            const node = state.nodeMap.get(key);
            newNodeMap.delete(key);
            if (node && !isRootNodeType(node)) {
                const index = newNodeMap.get(node.parent)?.children.indexOf(key);
                if (index && index >= 0) newNodeMap.get(node.parent)?.children.splice(index, 1);
            }
        }
        return { ...state, nodeMap: newNodeMap };
    };

    const addNodeToState = (state: IEditorState, node: LexicalNodeType, prevNodeKey?: NodeKeyType) => {
        const newMap = new Map(state.nodeMap);
        newMap.set(node.key, node);
        if (!isRootNodeType(node)) {
            const parentNode = newMap.get(node.parent);
            if (parentNode) {
                if (prevNodeKey) {
                    const index = parentNode.children.indexOf(prevNodeKey);
                    parentNode.children.splice(index + 1, 0, node.key);
                } else {
                    parentNode.children.push(node.key);
                }
            }
        }
        return { ...state, nodeMap: newMap };
    };

    const updateNodeToState = (state: IEditorState, key: NodeKeyType, content: string) => {
        const newMap = new Map(state.nodeMap);
        const node = newMap.get(key);
        if (node) {
            if (isContentNodeType(node)) {
                newMap.set(key, { ...node, content } as ContentNodeType);
            }
        }
        return {
            ...state,
            nodeMap: newMap,
        };
    };

    const getFirstParentNode = (key: string, state: IEditorState, childKey?: string) => {
        const node = state.nodeMap.get(key);
        if (node && !isRootNodeType(node) && isContentNodeType(node)) {
            return getFirstParentNode(node.parent, state, node.key);
        }
        return {
            key: node?.key,
            child: childKey,
        };
    };

    return {
        addNodeToState,
        removeNode,
        updateNodeToState,
        getFirstParentNode,
    };
};
