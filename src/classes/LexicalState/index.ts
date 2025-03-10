/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleProps } from '../../context/ToolbarContext';
import { getLastChild, getMinElement } from '../../utils/DOMUtils';
import { EMPTY_FOR_SELECT } from '../../utils/constants';
import { generateKey } from '../../utils/generateKey';
import { StylePropsConst, getStyleString } from '../../utils/styleUtils';
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

    handleUpdateSelect = (selection: Selection) => {
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
        }
        parent.addChild(child.getKey(), position?.index);
        child.setParent(parent.getKey());
        this._dom.addNode(parent, child, position);
    }

    checkElement = (selectionElement: HTMLElement | null | undefined) => {
        const element = getMinElement(selectionElement);
        if (!element || !element?.id) {
            const parentBuff = this.createLexicalNode(generateKey(), 'p');
            const nodeBuff = this.createLexicalNode(generateKey(), 'span');
            this.addNode(this.getNodeByKey('root') as LexicalNode, parentBuff);
            this.addNode(parentBuff, nodeBuff);
            nodeBuff.updateText(EMPTY_FOR_SELECT);
            this._dom.updateTextContent(nodeBuff.getKey(), EMPTY_FOR_SELECT);
            this._dom.setSelection(nodeBuff.getDomElement(), 1);
            return nodeBuff.getKey() as NodeKey;
        }
        return element.id as NodeKey;
    };

    updateStyle = (style: StyleProps) => {
        const selection = this._selection;
        const key = this.checkElement(selection?.anchorNode as HTMLElement);
        const node = this.getNodeByKey(key) as TextNode;
        const parent = this.getNodeByKey(node.getParent() as NodeKey) as LexicalNode;
        const newNode = node.clone() as TextNode;
        const position = selection?.anchorOffset || 0;

        const textBefore = node.getText().slice(0, position);
        const textAfter = node.getText().slice(position);

        this.addNode(parent, newNode, { index: position, lastKey: node.getKey() as NodeKey });

        newNode.updateText(EMPTY_FOR_SELECT);
        node.updateText(textBefore);

        this._dom.updateTextContent(node.getKey(), textBefore);
        this._dom.updateTextContent(newNode.getKey(), EMPTY_FOR_SELECT);

        if (textAfter.length > 0) {
            const nodeAfter = node.clone() as TextNode;
            this.addNode(parent, nodeAfter, { index: position + 1, lastKey: newNode.getKey() as NodeKey });
            nodeAfter.updateText(textAfter);
            this._dom.updateTextContent(nodeAfter.getKey(), textAfter);
        }

        newNode.setStyle(style);
        this._dom.setAttribute('style', getStyleString(style), newNode.getKey());
        this._dom.setSelection(newNode.getDomElement(), 1);
    };

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
        if (node?.canHasText() && node?.getText().length === 0 && parent.getType() === 'li') {
            const currentParent = this.getNodeByKey(currentParentKey) as LexicalNode;
            const index = currentParent.getChildIndex(parent.getKey());
            this.removeNode(parent);
            this._dom.removeElement(parent.getKey());
            const newParent = this.createLexicalNode(generateKey(), 'p');
            const styleNewParent = parent.getStyle() as StyleProps;

            this.addNode(this._rootNode, newParent, { index, lastKey: currentParent.getKey() });
            newParent.setStyle(styleNewParent);
            const newNode = this.createLexicalNode(generateKey(), 'span');
            this.addNode(newParent, newNode);
            newNode.updateText(EMPTY_FOR_SELECT);
            const element = this._dom.updateTextContent(newParent.getKey(), EMPTY_FOR_SELECT);

            if (styleNewParent[StylePropsConst.TEXT_ALIGN]) {
                this._dom?.setAttribute('style', getStyleString(styleNewParent), newParent.getKey());
            }
            this._dom.setSelection(element, 1);
            return;
        }
        const newParent = parent?.clone() as LexicalNode;
        const styleNewParent = parent.getStyle() as StyleProps;
        newParent.setStyle(styleNewParent);
        const newNode = node?.clone() as LexicalNode;
        this.addNode(this.getNodeByKey(currentParentKey) as LexicalNode, newParent, {
            index: position,
            lastKey: parent.getKey(),
        });
        if (styleNewParent[StylePropsConst.TEXT_ALIGN]) {
            this._dom?.setAttribute('style', getStyleString(styleNewParent), newParent.getKey());
        }
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

        this._dom.setSelection(element, 1);
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

    triggerLinkAction = (key: NodeKey, href?: string) => {
        const node = this.getNodeByKey(key) as LexicalNode;
        const parent = this.getNodeByKey(node?.getParent() as NodeKey) as LexicalNode;
        const index = parent?.getChildIndex(key);
        const lastKey = index ? parent?.getChildren()?.at(index - 1) : null;
        if (parent?.getType() !== 'a') {
            const newParent = this.createLexicalNode(generateKey(), 'a');
            if (href) newParent.setHref(href);
            this._dom.removeElement(key);
            this.addNode(parent, newParent, index && lastKey ? { index, lastKey } : undefined);
            this.addNode(newParent, node);
            this._dom.setAttribute('href', href, newParent.getKey());
            this._dom.setAttribute('target', '_blank', newParent.getKey());
            this._dom.updateTextContent(key, node.getText());
            const newNodeAfter = this.createLexicalNode(generateKey(), 'span');
            this.addNode(parent, newNodeAfter, { index: index + 1, lastKey: newParent.getKey() });
            newNodeAfter.updateText(EMPTY_FOR_SELECT);
            const element = this._dom.updateTextContent(newNodeAfter.getKey(), EMPTY_FOR_SELECT);
            this._dom.setSelection(element, 1);
        } else {
            if (href) {
                parent.setHref(href);
                this._dom.setAttribute('href', href, parent.getKey());
            } else {
                const keyLink = parent.getKey() as NodeKey;
                this._dom.removeElement(keyLink);
            }
        }
    };

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

    handleClick = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.localName !== 'span') {
            this._dom.setSelection(this._selection?.anchorNode as HTMLElement, this._selection?.anchorOffset as number);
        }
    };

    handleDecorateParent = (style: StyleProps) => {
        const parent = this.getNodeByKey(
            (((this._selection?.anchorNode as HTMLElement).parentElement as HTMLElement)?.parentElement as HTMLElement)
                .id as NodeKey
        ) as LexicalNode;
        parent.setStyle(style);
        this._dom.setAttribute('style', getStyleString(style), parent.getKey() as NodeKey);
    };
}
