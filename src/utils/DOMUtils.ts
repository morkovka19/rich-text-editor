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
