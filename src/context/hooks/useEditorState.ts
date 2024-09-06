import { useCallback } from 'react';

import { IEditorState } from '../../components/EditorState/EditorState.types';
import {
    ContentNodeType,
    LexicalNodeType,
    LineBreakNodeType,
    NodeKeyType,
    ParentNodeType,
    RootNodeType,
} from '../../components/nodes/Nodes.types';
import { isContentNodeType, isLineBreakNodeType, isRootNodeType } from '../../components/nodes/scripts';

export const useEditorState = () => {
    const getNode = useCallback((state: IEditorState, key: NodeKeyType) => state.nodeMap.get(key), []);

    const getChildNodeMap = useCallback(
        (node: ContentNodeType | ParentNodeType | RootNodeType, state: IEditorState) =>
            node.children.map((key: NodeKeyType) => getNode(state, key)),
        [getNode]
    );

    const removeLineBreak = useCallback((state: IEditorState, node: LineBreakNodeType) => {
        const parentNode = state.nodeMap.get(node.parent);
        if (parentNode && isContentNodeType(parentNode)) {
            const newNodeMap = state.nodeMap;
            const newParentNode = { ...parentNode, children: parentNode.children.filter(key => key !== node.key) };
            newNodeMap.set(newParentNode.key, newParentNode);
            newNodeMap.delete(node.key);
            return {
                ...state,
                nodeMap: newNodeMap,
            };
        }
        return state;
    }, []);

    const removeNode = useCallback(
        (state: IEditorState, key?: NodeKeyType) => {
            if (key) {
                const newMap = state.nodeMap;
                const node = newMap.get(key);
                if (node && isLineBreakNodeType(node)) {
                    return {
                        ...state,
                        nodeMap: removeLineBreak(state, node).nodeMap,
                    };
                }
            }
            return state;
        },
        [removeLineBreak]
    );

    const addNodeToState = useCallback(
        (state: IEditorState, node: LexicalNodeType) => {
            const newMap = new Map(state.nodeMap);
            newMap.set(node.key, node);
            if (!isRootNodeType(node)) {
                const parentNode = newMap.get(node.parent);
                if (parentNode && !isLineBreakNodeType(parentNode)) {
                    const childrenNodes = getChildNodeMap(parentNode, state);
                    const lastChild = childrenNodes[childrenNodes.length - 1];
                    if (lastChild && isLineBreakNodeType(lastChild)) {
                        newMap.delete(lastChild.key);
                        const newParentNode = removeNode(state, lastChild.key).nodeMap.get(parentNode.key);
                        if (newParentNode && !isLineBreakNodeType(newParentNode)) {
                            newParentNode.children.push(node.key);
                            newMap.set(parentNode.key, newParentNode);
                        }
                    } else {
                        parentNode.children.push(node.key);
                    }
                }
            }
            return { ...state, nodeMap: newMap };
        },
        [getChildNodeMap, removeNode]
    );

    const updateNodeToState = useCallback((state: IEditorState, key: NodeKeyType, content: string) => {
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
    }, []);

    const getFirstParentNode = useCallback((key: string, state: IEditorState) => {
        const node = state.nodeMap.get(key);
        if (node && !isRootNodeType(node)) {
            if (!isContentNodeType(node) && !isLineBreakNodeType(node)) {
                return node;
            } else {
                return getFirstParentNode(node.parent, state);
            }
        }
        return node;
    }, []);

    return {
        addNodeToState,
        removeNode,
        updateNodeToState,
        getFirstParentNode,
    };
};
