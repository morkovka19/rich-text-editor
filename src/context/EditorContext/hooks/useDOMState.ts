import { MAIN_DIV_ID } from '../../../helpers/constants';
import { LexicalNode, NodeKeyType } from '../../../types/nodes';

export const useDOMState = () => {
    const getDOMElement = (key: NodeKeyType) => document.getElementById(key) as HTMLElement;

    const addDOMNode = (node: LexicalNode, prevNodeKey?: NodeKeyType) => {
        const parent = getDOMElement(node.getParent() as string);
        const child = document.createElement(node.getType());
        child.id = node.getKey();
        const { link } = node.getProps();
        if (link) {
            child.setAttribute('href', link.href);
            child.setAttribute('target', link.target);
        }
        if (prevNodeKey) {
            const prevNode = getDOMElement(prevNodeKey);
            if (prevNode) parent?.insertBefore(child, prevNode.nextSibling);
        } else parent?.appendChild(child);
        return child;
    };

    const removeDOMNode = (key: NodeKeyType) => {
        const node = getDOMElement(key);
        if (node.id !== MAIN_DIV_ID) {
            node.remove();
        }
    };

    const createTextDONNode = (keyParent: NodeKeyType, content = '') => {
        const text = document.createTextNode(content);
        getDOMElement(keyParent)?.appendChild(text);
        return text;
    };

    const updateContent = (key?: NodeKeyType, content?: string, node?: HTMLElement) => {
        if (key) {
            const updatedElement = getDOMElement(key);
            if (updatedElement.textContent !== null) updatedElement.textContent = content || '';
        } else if (node) {
            node.textContent = content || '';
        }
    };

    const updateStyleDOMNode = (key: NodeKeyType, styleStr: string) => {
        const updatenNode = getDOMElement(key);
        if (updatenNode) {
            updatenNode.style.cssText = styleStr;
        }
    };

    const getDOMNode = (key: NodeKeyType) => document.getElementById(key) as Node;

    const getLastTextChild = (node: HTMLElement) => {
        if (!node) return;
        if (node?.nodeName === '#text') return node;
        return getLastTextChild(node?.lastChild as HTMLElement);
    };

    return {
        addDOMNode,
        removeDOMNode,
        updateContent,
        createTextDONNode,
        updateStyleDOMNode,
        getDOMNode,
        getLastTextChild,
    };
};
