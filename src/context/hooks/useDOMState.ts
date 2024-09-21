import { MAIN_DIV_ID } from '../../helpers/constants';
import { LexicalNode, NodeKeyType } from '../../nodes';

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
        setSel(child);
    };

    const removeDOMNode = (key: NodeKeyType) => {
        const node = document.getElementById(key) as HTMLElement;
        const prevNode = node.previousSibling as HTMLElement;
        if (node.id !== MAIN_DIV_ID) {
            node.remove();
            if (prevNode) setSel(prevNode);
        }
    };

    const createTextDONNode = (keyParent: NodeKeyType, content = '') => {
        const text = document.createTextNode(content);
        document.getElementById(keyParent)?.appendChild(text);
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
        createTextDONNode,
    };
};
