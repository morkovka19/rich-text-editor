import { MAIN_DIV_ID } from '../../../helpers/constants';
import { LexicalNode, NodeKeyType } from '../../../nodes';

export const useDOMState = () => {
    const addDOMNode = (node: LexicalNode, prevNodeKey?: NodeKeyType) => {
        if (node.canHaveText() && node.getParent()) {
            return updateContent(node.getParent() as string);
        }
        const parent = document.getElementById(node.getParent() as string);
        const child = document.createElement(node.getType());
        child.id = node.getKey();
        if (prevNodeKey) {
            const prevNode = document.getElementById(prevNodeKey);
            if (prevNode) parent?.insertBefore(child, prevNode.nextSibling);
        } else parent?.appendChild(child);
        return child;
    };

    const removeDOMNode = (key: NodeKeyType) => {
        const node = document.getElementById(key) as HTMLElement;
        if (node.id !== MAIN_DIV_ID) {
            node.remove();
        }
    };

    const createTextDONNode = (keyParent: NodeKeyType, content = '') => {
        const text = document.createTextNode(content);
        document.getElementById(keyParent)?.appendChild(text);
        return text;
    };

    const updateContent = (key?: NodeKeyType, content?: string, node?: HTMLElement) => {
        if (key) {
            const updatedElement = document.getElementById(key) as HTMLElement;
            updatedElement.textContent = content || '';
        } else if (node) {
            node.textContent = content || '';
        }
    };

    return {
        addDOMNode,
        removeDOMNode,
        updateContent,
        createTextDONNode,
    };
};
