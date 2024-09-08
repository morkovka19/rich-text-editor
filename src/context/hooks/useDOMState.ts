import { LexicalNodeType, NodeKeyType } from '../../components/nodes/Nodes.types';
import { isContentNodeType, isRootNodeType } from '../../helpers/checkTypeNode';
import { MAIN_DIV_ID } from '../../helpers/constants';

export const useDOMState = () => {
    const setSel = (node: HTMLElement) => {
        const range = document.createRange();
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        sel?.collapseToEnd();
    };

    const setFocus = (key: NodeKeyType) => {
        const node = document.getElementById(key);
        if (node) setSel(node);
    };

    const addDOMNode = (node: LexicalNodeType, prevNodeKey?: NodeKeyType) => {
        if (!isRootNodeType(node)) {
            const parent = document.getElementById(node.parent);
            const child = document.createElement(node.type);
            child.id = node.key;
            if (isContentNodeType(node) && node.content) child.textContent = node.content;
            if (prevNodeKey) {
                const prevNode = document.getElementById(prevNodeKey);
                if (prevNode) parent?.insertBefore(child, prevNode.nextSibling);
            } else parent?.appendChild(child);
            setSel(child);
        }
    };

    const removeDOMNode = (key: NodeKeyType) => {
        const node = document.getElementById(key) as HTMLElement;
        const prevNode = node.previousSibling as HTMLElement;
        if (node.id !== MAIN_DIV_ID) {
            node.remove();
            if (prevNode) setSel(prevNode);
        }
    };

    const updateContent = (key: NodeKeyType, content?: string) => {
        const updatedElement = document.getElementById(key) as HTMLElement;
        updatedElement.textContent = content || '';
        setFocus(key);
    };

    return {
        addDOMNode,
        removeDOMNode,
        updateContent,
        setFocus,
        setSel,
    };
};
