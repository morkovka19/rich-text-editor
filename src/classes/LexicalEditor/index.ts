import { createLineBreak } from '../../utils/DOMUtils';
import { DomSync } from '../DomSync';
import { TextNode } from '../LexicalNode/TextNode';
import { NodeKey } from '../LexicalNode/types';
import { LexicalState } from '../LexicalState';
import { SelectionManager } from '../SelectionManager';

export class LexicalEditor {
    _state: LexicalState;
    _dom: DomSync;
    _container: HTMLElement | null;
    _rootElement: HTMLElement | null;
    _selection: SelectionManager;

    constructor() {
        this._selection = new SelectionManager();
        this._state = new LexicalState(this._selection);
        this._rootElement = null;
        this._container = null;
        this._dom = new DomSync(this._state);
    }

    start(container: HTMLElement) {
        this._container = container;
        const rootElement = this._dom.render(container);
        this._rootElement = rootElement;
    }

    registerKeydownListener() {
        this._rootElement?.addEventListener('keydown', this.handleKeydown);
        return () => this._rootElement?.removeEventListener('keydown', this.handleKeydown);
    }

    private handleKeydown(e: KeyboardEvent) {
        const key = e.key;
        switch (key) {
            case 'Enter':
                this.handleEnter(e);
        }
    }

    private handleEnter(e: KeyboardEvent) {
        e.preventDefault();
        const selection = this._selection.getDefSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const startNode = range.startContainer as HTMLElement;
            const startOffset = range.startOffset;

            // Если курсор внутри текста
            if (startNode.nodeType === Node.TEXT_NODE) {
                const textNode = this._state.getNodeByKey(startNode.parentElement!.id);
                if (textNode && textNode instanceof TextNode) {
                    const textBefore = textNode.getText().slice(0, startOffset);
                    // const textAfter = textNode.getText().slice(startOffset);
                    textNode.updateText(textBefore);
                    textNode.getDomElement().textContent = textBefore;

                    const parent = textNode.getParent() as NodeKey;
                    const parentNode = this._state.getNodeByKey(parent);
                    const newNode = parentNode?.clone();
                    const newNodeElement = newNode?.render() as Node;
                    const parentElement = parentNode?.getDomElement();
                    parentElement?.parentElement!.insertBefore(parentElement, newNodeElement);
                    newNode?.setParent(parentElement!.parentElement!.id);
                    // Создаем <br>
                    const br = createLineBreak();
                    startNode.parentElement!.insertBefore(br, startNode);
                }

                // // Если курсор внутри списка
                // if (startNode.closest('li')) {
                //     const listItem = startNode.closest('li') as HTMLLIElement;
                //     const list = listItem.parentElement as HTMLOListElement | HTMLUListElement;

                //     // Если список пустой, удаляем его и создаем <br>
                //     if (listItem.textContent === '') {
                //         listItem.remove();
                //         const br = document.createElement('br');
                //         list.parentElement!.insertBefore(br, list);
                //     } else {
                //         // Создаем новый <li>
                //         const newListItem = new ListItemNode();
                //         const newTextNode = new TextNode();
                //         newListItem.appendChild(newTextNode);
                //         this.nodeMap.addNode(getNodeId(newListItem), newListItem, getNodeId(list));
                //         this.nodeMap.addNode(getNodeId(newTextNode), newTextNode, getNodeId(newListItem));

                //         list.appendChild(newListItem.render());
                //     }
            }
        }
    }

    setBaseEventListeners() {
        if (this._rootElement) {
            this.registerKeydownListener();
        }
    }
}
