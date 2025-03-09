/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleProps } from '../../context/ToolbarContext';
import { ActionWithTag, EMPTY_FOR_SELECT } from '../../utils/constants';
import { generateKey } from '../../utils/generateKey';
import { getStyleString } from '../../utils/styleUtils';
import { DomSync } from '../DomSync';
import { HeadingNode } from '../LexicalNode/HeadingNode';
import { LexicalNode } from '../LexicalNode/LexicalNode';
import { LinkNode } from '../LexicalNode/LinkNode';
import { ListItemNode, ListNode } from '../LexicalNode/ListNode';
import { ParagraphNode } from '../LexicalNode/ParagraphNode';
import { RootNode } from '../LexicalNode/RootNode';
import { TextNode } from '../LexicalNode/TextNode';
import { NodeKey } from '../LexicalNode/types';

export class LexicalState {
    _nodeMap: Map<NodeKey, LexicalNode>;
    _rootNode: RootNode;
    _dom: DomSync;
    _selection: Selection | null;

    constructor() {
        this._rootNode = new RootNode('root');
        this._nodeMap = new Map();
        this._nodeMap.set('root', this._rootNode);
        this._dom = new DomSync(this.updateNodeText, this._rootNode.render(), this.removeNode, this.getNodeByKey);
        this._selection = null;
    }

    start(container: HTMLElement) {
        this._dom.render(container);
    }

    setSelection = (selection: Selection) => {
        this._selection = selection;
    };

    getNodeByKey = (key: NodeKey) => {
        return this._nodeMap.get(key);
    };

    updateNodeText = (key: NodeKey, text: string) => {
        const selection = this._selection;
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        const startOffset = range.startOffset;
        const checkAndUpdate = (node: LexicalNode) => {
            if (node.canHasText()) {
                node.updateText(text);
                const element = this._dom.updateTextContent(node.getKey() as NodeKey, text);
                this._dom.setSelection(element, Math.min(startOffset, text.length));
                return;
            } else {
                this._dom.resetTextElement(node.getKey());
                const childType = node.getChildType();
                const key = generateKey();
                const childNode = this.createLexicalNode(key, childType);
                this.addNode(node, childNode);
                return checkAndUpdate(childNode);
            }
        };
        const node = this._nodeMap?.get(key);
        if (node) return checkAndUpdate(node);
        else return;
    };

    createLexicalNode(key: NodeKey, childType: string) {
        switch (childType) {
            case 'span':
                return new TextNode(key);
            case 'p':
                return new ParagraphNode(key);
            case 'root':
                return new RootNode('root');
            case 'h':
                return new HeadingNode(key);
            case 'list':
                return new ListNode(key);
            case 'li':
                return new ListItemNode(key);
            case 'a':
                return new LinkNode(key);
            default:
                return new ParagraphNode(key);
        }
    }

    addNode(parent: LexicalNode, child: LexicalNode, position?: { index: number; lastKey: NodeKey }) {
        if (!this._nodeMap.get(child?.getKey())) {
            this._nodeMap.set(child?.getKey(), child);
            parent.addChild(child.getKey(), position?.index);
            child.setParent(parent.getKey());
            this._dom.addNode(parent, child, position);
        }
    }

    updateStyle(style: StyleProps) {
        const selection = this._selection;
        const key = selection?.anchorNode?.parentElement!.id as NodeKey;
        const node = this.getNodeByKey(key) as TextNode;
        const parent = this.getNodeByKey(node.getParent() as NodeKey) as LexicalNode;
        const newNode = node.clone() as TextNode;
        const position = selection?.anchorOffset || 0;
        const nodeAfter = node.clone() as TextNode;
        const textBefore = node.getText().slice(0, position);
        const textAfter = node.getText().slice(position);
        this.addNode(parent, newNode, { index: position, lastKey: node.getKey() as NodeKey });
        this.addNode(parent, nodeAfter, { index: position + 1, lastKey: newNode.getKey() as NodeKey });
        newNode.updateText(EMPTY_FOR_SELECT);
        node.updateText(textBefore);
        nodeAfter.updateText(textAfter);
        this._dom.updateTextContent(node.getKey(), textBefore);
        this._dom.updateTextContent(newNode.getKey(), EMPTY_FOR_SELECT);
        this._dom.updateTextContent(nodeAfter.getKey(), textAfter);
        newNode.setStyle(style);
        this._dom.setAttribute('style', getStyleString(style), newNode.getKey());
        this._dom.setSelection(newNode.getDomElement(), 1);
    }

    findNodeById(key: string): LexicalNode | null {
        const search = (node: LexicalNode): LexicalNode | null => {
            if (node.getKey() === key) return node;
            for (const child of node.getChildren()) {
                const node = this.getNodeByKey(child) as LexicalNode;
                const result = search(node);
                if (result) return result;
            }
            return null;
        };
        return search(this._rootNode);
    }

    addNodeWithKey(parent: NodeKey, child: LexicalNode) {
        const parentNode = this.getNodeByKey(parent) as LexicalNode;
        this.addNode(parentNode, child);
    }

    removeNode = (node: LexicalNode) => {
        const parent = this.getNodeByKey(node.getParent() as NodeKey) as LexicalNode;
        if (parent?.getChildren().includes(node.getKey())) parent.removeChild(node.getKey());
        this._nodeMap.delete(node.getKey());
        if (node.getType() !== 'span') {
            for (let i = 0; i < node?.getChildren().length; i++) {
                this.removeNode(this.getNodeByKey(node?.getChildren()[i]) as LexicalNode);
            }
        }
    };

    handleEnter = (key: NodeKey, position: number): any => {
        const node = this.getNodeByKey(key) as LexicalNode;
        const parent = this.getNodeByKey(node?.getParent() as NodeKey) as LexicalNode;
        const currentParentKey = parent?.getParent() as NodeKey;
        if (node?.canHasText() && node?.getText().length === 0) {
            const currentParent = this.getNodeByKey(currentParentKey) as LexicalNode;
            const index = currentParent.getChildIndex(parent.getKey());
            this.removeNode(parent);
            this._dom.removeElement(parent.getKey());
            const newParent = this.createLexicalNode(generateKey(), 'p');
            this.addNode(this._rootNode, newParent, { index, lastKey: currentParent.getKey() });
            const newNode = this.createLexicalNode(generateKey(), 'span');
            this.addNode(newParent, newNode);
            newNode.updateText(EMPTY_FOR_SELECT);
            const element = this._dom.updateTextContent(newNode.getKey(), EMPTY_FOR_SELECT);
            this._dom.setSelection(element, 1);

            return;
        }
        const newParent = parent?.clone() as LexicalNode;
        const newNode = node?.clone() as LexicalNode;
        this.addNode(this.getNodeByKey(currentParentKey) as LexicalNode, newParent, {
            index: position,
            lastKey: parent.getKey(),
        });
        this.addNode(newParent, newNode);
        newNode.updateText(EMPTY_FOR_SELECT);
        if (node.getStyle()) this._dom.setAttribute('style', getStyleString(node.getStyle()), newNode.getKey());
        this._dom.updateTextContent(newNode.getKey() as NodeKey, EMPTY_FOR_SELECT);
        this._dom.setSelection(newNode.getDomElement(), 1);
        const text = node.getText() || '';
        const textBefore = text.slice(0, position);
        const textAfter = text.slice(position);
        newNode.updateText(textAfter);
        node.updateText(textBefore);
        this._dom.updateTextContent(newNode.getKey(), textAfter || EMPTY_FOR_SELECT);
        this._dom.updateTextContent(node.getKey(), textBefore || EMPTY_FOR_SELECT);
        const element = newNode.getDomElement()?.childNodes[0] || newNode.getDomElement();
        this._dom.setSelection(element, 0);
    };

    updateTag = (tag: string) => {
        const selection = this._selection;
        const node = this.getNodeByKey(selection?.anchorNode?.parentElement?.id as NodeKey) as LexicalNode;
        const parent = this.getNodeByKey(node?.getParent() as NodeKey) as LexicalNode;
        const currentParent = this.getNodeByKey(parent.getParent() as NodeKey) as LexicalNode;
        if (tag === 'p') {
            const newParent = this.createLexicalNode(generateKey(), 'p');
            this.addNode(currentParent, newParent);
            const newNode = this.createLexicalNode(generateKey(), 'span');
            this.addNode(newParent, newNode);
            newNode.updateText(EMPTY_FOR_SELECT);
            const element = this._dom.updateTextContent(newNode.getKey(), EMPTY_FOR_SELECT);
            this._dom.setSelection(element, 1);
        } else if (tag.startsWith('h')) {
            const newParent = this.createLexicalNode(generateKey(), 'h');
            newParent.setRange(Number(tag.split('').pop()));
            this.addNode(currentParent, newParent);
            const newNode = this.createLexicalNode(generateKey(), 'span');
            this.addNode(newParent, newNode);
            newNode.updateText(EMPTY_FOR_SELECT);
            const element = this._dom.updateTextContent(newNode.getKey(), EMPTY_FOR_SELECT);
            this._dom.setSelection(element, 1);
        } else if (tag === 'ul' || tag === 'ol') {
            const newParent = this.createLexicalNode(generateKey(), 'list');
            newParent.setTypeList(tag);
            this.addNode(currentParent, newParent);
            const newNodeItem = this.createLexicalNode(generateKey(), 'li');
            this.addNode(newParent, newNodeItem);
            const newNode = this.createLexicalNode(generateKey(), 'span');
            this.addNode(newNodeItem, newNode);
            newNode.updateText(EMPTY_FOR_SELECT);
            const element = this._dom.updateTextContent(newNode.getKey(), EMPTY_FOR_SELECT);
            this._dom.setSelection(element, 1);
        }
    };

    handleEnterInEmptyLi() {
        const nodeElement = this._selection?.focusNode as HTMLElement;
        const parentElement = nodeElement.parentElement as HTMLElement;
        const parentNode = this.getNodeByKey(parentElement?.id as NodeKey) as LexicalNode;
        this.removeNode(parentNode);
        const currentParrent = this.getNodeByKey(parentNode.getParent() as NodeKey) as LexicalNode;
        currentParrent.getDomElement().removeChild(parentElement);
        const newParent = this.createLexicalNode(generateKey(), 'p');
        this.addNode(this.getNodeByKey(currentParrent.getParent() as NodeKey) as LexicalNode, newParent);
        const newChild = this.createLexicalNode(generateKey(), 'span');
        this.addNode(newParent, newChild);
        newChild.updateText(EMPTY_FOR_SELECT);
        this._dom.setSelection(newChild.getDomElement(), 1);
    }

    // insertNewParentNode = (child: LexicalNode, parent: LexicalNode, newParent: LexicalNode) => {
    //     const childElement = child.getDomElement() as HTMLElement;
    //     const newNodeElement = newParent.getDomElement();
    //     parent.removeChild(child.getKey());
    //     newParent.addChild(child.getKey());
    //     child.setParent(newParent.getKey());
    //     newNodeElement.appendChild(childElement);
    // };

    // triggerActionWithLink(action: ActionWithTag, key: NodeKey, href?: string) {
    //     if (action === ActionWithTag.CREATE) {
    //         const node = this.getNodeByKey(key) as LexicalNode;
    //         const parentNode = this.getNodeByKey(node.getParent() as NodeKey) as LexicalNode;
    //         const newNode = this.createLexicalNode(generateKey(), 'a');
    //         this.addNode(parentNode, newNode);
    //         newNode.setHref(href || '');
    //         this.insertNewParentNode(node, parentNode, newNode);
    //         const newChild = node.clone();
    //         this.addNode(parentNode, newChild);
    //         newChild.updateText(EMPTY_FOR_SELECT);
    //         this._dom.setSelection(newChild.getDomElement(), 1);
    //     }
    // }

    triggerHandleEnter = () => {
        const selection = this._selection;
        const anchorNode = selection?.anchorNode as HTMLElement;
        this.handleEnter(anchorNode.parentElement!.id as NodeKey, selection?.anchorOffset as number);
    };

    triggerHandleBackspace(e: KeyboardEvent) {
        const selection = this._selection;
        const focusNode = selection?.focusNode;
        const parent = focusNode?.parentElement as HTMLElement;
        if (parent.textContent === EMPTY_FOR_SELECT) this._dom.updateTextContent(parent.id, '');
        if ((parent.id as string) === 'root' && focusNode?.textContent?.length === 0 && parent.children.length === 1) {
            e.preventDefault();
        }
    }
}
