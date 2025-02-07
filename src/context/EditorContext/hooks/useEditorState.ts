import { IEditorState } from '../../../components/Editor/EditorState/EditorState.types';
import { isParentTagType } from '../../../helpers/checkTypeTag';
import { IStyleNode, LexicalNode, NodeKeyType, Text } from '../../../nodes';

export const useEditorState = () => {
    const getNode = (state: IEditorState, key: NodeKeyType) => state.nodeMap.get(key);

    const removeNode = (state: IEditorState, key?: NodeKeyType) => {
        const { nodeMap } = state;
        if (key) {
            const children = nodeMap.get(key)?.getChildList();
            if (children?.length) {
                children.forEach(child => {
                    if (typeof child === 'string') removeNode(state, child);
                });
            }
            const node = state.nodeMap.get(key);
            nodeMap.delete(key);
            const index = nodeMap
                .get(node?.getParent() || '')
                ?.getChildList()
                ?.indexOf(key);
            if (index && index >= 0)
                nodeMap
                    .get(node?.getParent() || '')
                    ?.getChildList()
                    ?.splice(index, 1);
        }
    };
    const addNodeToState = (state: IEditorState, node: LexicalNode, prevNodeKey?: NodeKeyType) => {
        const { nodeMap } = state;
        nodeMap.set(node.getKey(), node);
        const parentNode: LexicalNode = nodeMap.get(node.getParent() as string) as LexicalNode;
        const index = parentNode?.getChildList()?.indexOf(prevNodeKey || '');
        parentNode?.addChild(node.getKey(), index);
    };

    const getFirstNode = (key: NodeKeyType, state: IEditorState, childKey?: string) => {
        const { nodeMap } = state;
        const node = nodeMap.get(key);
        const parent = node?.getParent() as string;
        const Node = nodeMap.get(parent) as LexicalNode;
        if (!isParentTagType(Node?.getType())) {
            getFirstNode(parent, state, node?.getKey());
        }

        return {
            key: Node?.getKey(),
            child: childKey,
        };
    };

    const updateTextNode = (key: NodeKeyType, newText: string, state: IEditorState) => {
        const { nodeMap } = state;
        const node = nodeMap.get(key) as Text;
        if (newText) node.setText(newText);
        else removeNode(state, key);
    };

    const updateStyleNode = (editorState: IEditorState, styleState: IStyleNode, key: NodeKeyType) => {
        const node = editorState.nodeMap.get(key);
        if (node) {
            node.setStyle({ ...node.getStyle(), font: styleState.font });
        }
    };

    return {
        getNode,
        addNodeToState,
        removeNode,
        getFirstNode,
        updateTextNode,
        updateStyleNode,
    };
};
