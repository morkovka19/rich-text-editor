import { NodeKey } from '../classes/LexicalNode/types';

export const createRoot = () => {
    const root = document.createElement('div');
    root.id = 'root';
    return root;
};

export const createParagraphElement = (key: NodeKey) => {
    const p = document.createElement('p');
    p.id = key;
    return p;
};

export const createLinkElement = (key: NodeKey) => {
    const a = document.createElement('a');
    a.id = key;
    return a;
};

export const createHeadingElement = (key: NodeKey, range: number) => {
    const h = document.createElement(`h${range}`);
    h.id = key;
    return h;
};

export const createNewListElement = (key: NodeKey, typeList: 'ol' | 'ul') => {
    const list = document.createElement(typeList);
    list.id = key;
    return list;
};
export const createTextElement = (key: NodeKey) => {
    const p = document.createElement('span');
    p.id = key;
    return p;
};

export const getDOMElement = (key: NodeKey) => {
    return document.getElementById(key) as HTMLElement;
};

export const updateTextContent = (key: NodeKey, text: string) => {
    const textNode = document.getElementById(key) as HTMLElement;
    textNode.textContent = text;
    return textNode;
};

export const createLineBreak = () => {
    const br = document.createElement('br');

    return br;
};

export const setupMutationObserver = (container: HTMLElement, callback: (mutations: MutationRecord[]) => void) => {
    const observer = new MutationObserver(callback);
    observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true,
    });
    return observer;
};

export const createNewListItemElement = (key: NodeKey) => {
    const li = document.createElement('li');
    li.id = key;
    return li;
};

export const updateHrefLinkElement = (key: NodeKey, href: string) => {
    const a = getDOMElement(key) as HTMLElement;
    a.setAttribute('href', href);
};

export const removeChildElement = (parent: NodeKey, child: NodeKey) => {
    document.getElementById(parent)?.removeChild(document.getElementById(child) as Node);
};

export const getLastChild = (element: HTMLElement) => {
    if (element.localName === 'span') return element;
    if (element.childElementCount) {
        [...element.children].reverse().forEach(child => getLastChild(child as HTMLElement));
    }
    return undefined;
};

export const getMinElement = (element: HTMLElement | null | undefined) => {
    if (!element) return undefined;
    if (element.nodeType === 3) return element.parentElement as HTMLElement;
    return getLastChild(element);
};
