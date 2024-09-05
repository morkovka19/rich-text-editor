import { useCallback } from 'react';

import { IEditorState } from '../../components/EditorState/EditorState.types';
import { ContentNodeType, LexicalNodeType, NodeKeyType } from '../../components/nodes/Nodes.types';
import { isContentNodeType, isRootNodeType } from '../../components/nodes/scripts';

export const useEditorState = () => {
    const addNodeToState = useCallback((state: IEditorState, node: LexicalNodeType) => {
        const newMap = new Map(state.nodeMap);
        newMap.set(node.key, node);
        if (!isRootNodeType(node)) {
            const parentNode = newMap.get(node.parent);
            if (parentNode && !isContentNodeType(parentNode)) {
                parentNode.children.push(node.key);
            }
        }
        return { ...state, nodeMap: newMap };
    }, []);

    const removeNode = useCallback(() => {}, []);

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

    return {
        addNodeToState,
        removeNode,
        updateNodeToState,
    };
};
