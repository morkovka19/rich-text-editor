/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDOMElement } from '../../utils/DOMUtils';
import { EMPTY_FOR_SELECT } from '../../utils/constants';
import { LexicalNode } from '../LexicalNode/LexicalNode';
import { NodeKey } from '../LexicalNode/types';

export class DomSync {
    static getSelection() {
        return window.getSelection();
    }

    _rootElement: HTMLElement;
    _triggerUpdateText: (key: NodeKey, text: string) => void;
    _removeNode: (node: LexicalNode) => void;
    _getNodeByKey: (key: NodeKey) => LexicalNode | undefined;

    constructor(
        triggerUpdateText: (key: NodeKey, text: string) => void,
        root: HTMLElement,
        removeNode: (node: LexicalNode) => void,
        getNodeByKey: (key: NodeKey) => LexicalNode | undefined
    ) {
        this._rootElement = root;
        this._triggerUpdateText = triggerUpdateText;
        this._removeNode = removeNode;
        this._getNodeByKey = getNodeByKey;
    }

    render(container: HTMLElement) {
        container.appendChild(this._rootElement);
        this.setupMutationObserver();
    }

    resetTextElement(key: NodeKey) {
        const element = getDOMElement(key) as HTMLElement;
        if (element && element?.textContent) element.textContent = '';
    }

    addNode = (parent: LexicalNode, child: LexicalNode, position?: { index: number; lastKey: NodeKey }) => {
        const parentElement = parent.getDomElement();
        const childElement = child.getDomElement() || child.render();

        parentElement.appendChild(childElement);
        if (!position) parentElement.appendChild(childElement);
        else {
            const element = document.getElementById(position.lastKey) as HTMLElement;
            element.after(childElement);
        }

        if (childElement.localName === 'span') childElement.textContent = EMPTY_FOR_SELECT;
    };

    updateTextContent = (key: NodeKey, text: string) => {
        const textNode = getDOMElement(key) as HTMLElement;
        if (textNode?.textContent) textNode.textContent = text;
        return textNode.childNodes[0] || textNode;
    };

    setSelection = (node: HTMLElement | ChildNode, offset: number) => {
        const newRange = document.createRange();
        newRange?.setStart(node, offset);
        newRange?.collapse(true);
        getSelection()?.removeAllRanges();
        getSelection()?.addRange(newRange);
    };

    private setupMutationObserver() {
        const observer = new MutationObserver(mutations => this.handleMutations(mutations));
        if (this._rootElement !== null)
            observer.observe(this._rootElement, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true,
            });
    }

    handleMutations(mutations: MutationRecord[]) {
        mutations.forEach(mutation => {
            if (mutation.type === 'characterData') {
                const target = mutation.target.parentElement as HTMLElement;
                const key = target?.id;
                if (key) {
                    const text = target.textContent;
                    this._triggerUpdateText(key, text || '');
                }
            } else if (mutation.type === 'childList') {
                mutation.removedNodes.forEach(element => {
                    const key = (element as HTMLElement)?.id;
                    const node = this._getNodeByKey(key);
                    const elementDocument = getDOMElement(key);
                    if (key && node && !elementDocument) {
                        this._removeNode(node);
                    }
                });
            }
        });
    }

    setAttribute(name: string, props: any, key: NodeKey) {
        const element = getDOMElement(key);
        element.setAttribute(name, props);
    }
}
