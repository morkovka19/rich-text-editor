import { IEditorState } from '../../../components/Editor/EditorState/EditorState.types';
import { isParentTagType } from '../../../helpers/checkTypeTag';
import { TEXT_KEY } from '../../../helpers/constants';
import { LexicalNode, NodeKeyType, Text } from '../../../nodes';

export const useEditorState = () => {
    const getNode = (state: IEditorState, key: NodeKeyType) => state.nodeMap.get(key);

    const removeNode = (state: IEditorState, key?: NodeKeyType) => {
        const { nodeMap } = state;
        if (key) {
            const children = nodeMap.get(key)?.getChildList();
            if (children) {
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

    const removeTextNode = (state: IEditorState, position: number, key: NodeKeyType) => {
        const parentNode = state.nodeMap.get(key) as LexicalNode;
        const newChildList = [
            ...parentNode.getChildList()!.slice(0, position),
            ...parentNode.getChildList()!.slice(position + 1),
        ];
        parentNode.setChildList(newChildList);
    };

    const addNodeToState = (state: IEditorState, node: LexicalNode, prevNodeKey?: NodeKeyType) => {
        const { nodeMap } = state;
        nodeMap.set(node.getKey(), node);
        const parentNode: LexicalNode = nodeMap.get(node.getParent() as string) as LexicalNode;
        const index = parentNode.getChildList()?.indexOf(prevNodeKey || '');
        parentNode?.addChild(
            node.getKey() !== TEXT_KEY ? node.getKey() : (node as Text),
            index ? index + 1 : undefined
        );
    };

    const addTextToState = (state: IEditorState, node: Text, prevNodeKey?: NodeKeyType) => {
        const { nodeMap } = state;
        const parent = nodeMap.get(node?.getParent());

        if (prevNodeKey) {
            const index = parent?.getChildList()?.indexOf(prevNodeKey);
            parent?.addChild(
                node.getKey() !== TEXT_KEY ? node.getKey() : (node as Text),
                index ? index + 1 : undefined
            );
        } else parent?.addChild(node.getKey() !== TEXT_KEY ? node.getKey() : (node as Text));
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

    const updateTextNode = (key: NodeKeyType, prevText: string, newText: string, state: IEditorState) => {
        const { nodeMap } = state;
        const node = nodeMap.get(key) as LexicalNode;
        const texts = node.getTextChild();
        if (texts) {
            let index = 0;
            const textNodeUpdated = texts?.find((child, i) => {
                if (child.getText() === prevText) {
                    index = i;
                    return child;
                }
            });
            if (newText.length > 0) textNodeUpdated?.setText(newText);
            else removeTextNode(state, index, key);
        }
    };

    return {
        getNode,
        addNodeToState,
        removeNode,
        getFirstNode,
        addTextToState,
        updateTextNode,
    };
};
