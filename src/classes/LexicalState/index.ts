/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { HistoryItem } from '../../context/HistoryContext';
import { StyleProps } from '../../context/ToolbarContext';
import { getDOMElement, getMinElement } from '../../utils/DOMUtils';
import { EMPTY_FOR_SELECT, HREF, NODE_TYPE_TEXT, STYLE, TAGS, TARGET } from '../../utils/constants';
import { inlineTags } from '../../utils/constants/index';
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
        this._rootNode = new RootNode(TAGS.ROOT);
        this._nodeMap = new Map();
        this._nodeMap.set(TAGS.ROOT, this._rootNode);
        this._dom = new DomSync(this.updateNodeText, this._rootNode.render(), this.removeNode, this.getNodeByKey);
        this._selection = null;
    }

    start(container: HTMLElement) {
        this._dom.render(container);
    }

    getNodeByKey = (key: NodeKey) => {
        return this._nodeMap.get(key);
    };

    updateText = (node: LexicalNode, text?: string) => {
        if (node.canHasText()) {
            node.updateText(text || EMPTY_FOR_SELECT);
            const key = node.getKey();
            this._dom.handleUpdateTextContent(key, text || EMPTY_FOR_SELECT);
        }
    };

    updateStyle = (node: LexicalNode, style: StyleProps) => {
        node.setStyle(style);
        this._dom.handleSetAttribute(STYLE, getStyleString(style), node.getKey());
    };

    updateNodeText = (key: NodeKey, text: string) => {
        const selection = this._selection;
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        const startOffset = range.startOffset;
        const checkAndUpdate = (node: LexicalNode) => {
            if (node.canHasText()) {
                this.updateText(node, text);
                this._dom.handleSetSelection(node.getDomElement(), Math.min(startOffset, text.length));
                return;
            } else {
                this._dom.handleResetTextElement(node.getKey());
                const key = generateKey();
                const childNode = this.createLexicalNode(key, node.getChildType() as TAGS);
                this.addNode(node, childNode);
                return checkAndUpdate(childNode);
            }
        };
        const node = this._nodeMap?.get(key);
        if (node) return checkAndUpdate(node);
        else return;
    };

    createLexicalNode(key: NodeKey, childType: TAGS) {
        switch (childType) {
            case TAGS.TEXT:
                return new TextNode(key);
            case TAGS.NORMAL:
                return new ParagraphNode(key);
            case TAGS.ROOT:
                return new RootNode(TAGS.ROOT);
            case TAGS.H1:
            case TAGS.H2:
            case TAGS.H3:
                return new HeadingNode(key);
            case TAGS.OL:
            case TAGS.UL:
                return new ListNode(key);
            case TAGS.LI:
                return new ListItemNode(key);
            case TAGS.LINK:
                return new LinkNode(key);
            default:
                return new ParagraphNode(key);
        }
    }

    addNode(parent: LexicalNode, child: LexicalNode, position?: { index: number; lastKey?: NodeKey }) {
        if (!this._nodeMap.get(child?.getKey())) {
            this._nodeMap.set(child?.getKey(), child);
        }
        parent.addChild(child.getKey(), position?.index);
        child.setParent(parent.getKey());
        this._dom.handleAddNode(parent, child, position);
    }

    getChildForParentNode = (selectionElement: HTMLElement | null | undefined) => {
        const element = getMinElement(selectionElement);
        if (!element || !element?.id) {
            const parentBuff = this.createLexicalNode(generateKey(), TAGS.NORMAL);
            const nodeBuff = this.createLexicalNode(generateKey(), parentBuff.getChildType() as TAGS);
            this.addNode(this.getNodeByKey(TAGS.ROOT) as LexicalNode, parentBuff);
            this.addNode(parentBuff, nodeBuff);
            this.updateText(nodeBuff);
            this._dom.handleSetSelection(nodeBuff.getDomElement(), 1);
            return nodeBuff.getKey() as NodeKey;
        }
        return element.id as NodeKey;
    };

    getParentForChildNode(node: HTMLElement): any {
        if (node.nodeType !== NODE_TYPE_TEXT && !inlineTags.includes(node.localName)) {
            const key = node?.id;
            if (!key) return;
            return this.getNodeByKey(key);
        }
        const parent = node.parentElement;
        if (!parent) return;
        return this.getParentForChildNode(parent);
    }

    getNodeForText(element: HTMLElement): any {
        if (element.nodeType === NODE_TYPE_TEXT) {
            const parentElement = element.parentElement;
            if (!parentElement) return;
            return this.getNodeForText(parentElement);
        } else {
            const node = this.getNodeByKey(element.id as NodeKey);
            return node;
        }
    }

    removeChildNodes = (node: LexicalNode): LexicalNode | undefined => {
        const children = node.canHasText() ? [] : node.getChildren();
        const key = node.getKey();
        if (children.length)
            for (const child in children) {
                const node = this.getNodeByKey(child);
                if (!node) return;
                return this.removeChildNodes(node);
            }
        const parent = node.getParent();

        this._nodeMap.delete(key);
        this._dom.handleRemoveElement(key);
        if (!parent) return;
        const parentNode = this.getNodeByKey(parent);
        parentNode?.removeChild(key);
        return parentNode;
    };

    removeNode = (node: LexicalNode) => {
        const parent = this.removeChildNodes(node);
        if (!parent || parent.getKey() === TAGS.ROOT) return;
        if (parent.getChildren().length === 0) {
            this.removeNode(parent);
        }
    };

    triggerHandleEnter = () => {
        const anchorNode = this._selection?.anchorNode as HTMLElement | null;
        if (!anchorNode) return;
        const parent = this.getParentForChildNode(anchorNode);
        const node = this.getNodeByKey(
            anchorNode.nodeType === NODE_TYPE_TEXT
                ? (anchorNode.parentElement?.id as NodeKey)
                : (anchorNode?.id as NodeKey)
        );
        if (!parent || !node) return;
        const position = this._selection?.anchorOffset || 0;
        this.handleEnter(node, parent, position);
    };

    triggerHandleBackspace(e: KeyboardEvent) {
        const selection = this._selection;
        const focusNode = selection?.focusNode;
        const parent = focusNode?.parentElement as HTMLElement;
        if (parent.textContent === EMPTY_FOR_SELECT) this._dom.handleUpdateTextContent(parent.id, '');
        if (
            (parent.id as string) === TAGS.ROOT &&
            focusNode?.textContent?.length === 0 &&
            parent.children.length === 1
        ) {
            e.preventDefault();
        }
    }

    handleEnter = (child: LexicalNode, parent: LexicalNode, position: number): any => {
        const node = this.getNodeByKey(this.getChildForParentNode(child.getDomElement())) as LexicalNode;
        const currentParentKey = parent?.getParent() as NodeKey;
        if (node?.canHasText() && node?.getText().length === 0 && parent.getType() === 'li') {
            const currentParent = this.getNodeByKey(currentParentKey) as LexicalNode;
            const index = currentParent.getChildIndex(parent.getKey());
            this.removeNode(parent);
            this._dom.handleRemoveElement(parent.getKey());
            const newParent = this.createLexicalNode(generateKey(), TAGS.NORMAL);
            const styleNewParent = parent?.getStyle() as StyleProps;

            this.addNode(this._rootNode, newParent, { index, lastKey: currentParent.getKey() });
            newParent.setStyle(styleNewParent);
            const newNode = this.createLexicalNode(generateKey(), newParent.getChildType() as TAGS);
            this.addNode(newParent, newNode);
            this.updateText(newNode);
            if (styleNewParent[StylePropsConst.TEXT_ALIGN]) {
                this._dom?.handleSetAttribute(STYLE, getStyleString(styleNewParent), newParent.getKey());
            }
            this._dom.handleSetSelection(newNode.getDomElement(), 1);
            return;
        }
        const newParent = parent?.clone() as LexicalNode;
        const styleNewParent = parent?.getStyle() as StyleProps;
        newParent.setStyle(styleNewParent);
        const newNode = node?.clone() as LexicalNode;
        this.addNode(this.getNodeByKey(currentParentKey) as LexicalNode, newParent, {
            index: position,
            lastKey: parent.getKey(),
        });
        if (styleNewParent[StylePropsConst.TEXT_ALIGN]) {
            this._dom?.handleSetAttribute(STYLE, getStyleString(styleNewParent), newParent.getKey());
        }
        this.addNode(newParent, newNode);
        this.updateText(newNode);
        if (node.getStyle()) this._dom.handleSetAttribute(STYLE, getStyleString(node.getStyle()), newNode.getKey());
        this._dom.handleSetSelection(newNode.getDomElement(), 1);
        const text = node.getText() || '';
        const textBefore = text.slice(0, position);
        const textAfter = text.slice(position);
        this.updateText(newNode, textAfter);
        this.updateText(node, textBefore);
        newNode.updateText(textAfter);
        node.updateText(textBefore);
        const element = newNode.getDomElement()?.childNodes[0] || newNode.getDomElement();

        this._dom.handleSetSelection(element, 0);
    };

    handleDecorate = (style: StyleProps) => {
        const selection = this._selection;
        if (!selection) return;
        if (selection.type === 'Range') {
            const nodes = this.getNodesInRange();

            if (!Array.isArray(nodes) && nodes) {
                nodes.getChildren().forEach(child => {
                    const childNode = this.getNodeByKey(child);
                    if (!childNode) return;
                    this.updateStyle(childNode, style);
                    this._dom.handleSetSelection(childNode.getDomElement(), 1);
                });
                return;
            }
        }
        const key = this.getChildForParentNode(selection?.anchorNode as HTMLElement);
        const node = this.getNodeByKey(key) as TextNode;
        const oldStyle = node.getStyle();
        const parent = this.getNodeByKey(node.getParent() as NodeKey) as LexicalNode;
        const newNode = node.getText().length > 0 ? (node.clone() as TextNode) : node;
        const position = selection?.anchorOffset || 0;

        const textBefore = node.getText().slice(0, position);
        const textAfter = node.getText().slice(position);

        this.addNode(parent, newNode, { index: position, lastKey: node.getKey() as NodeKey });

        newNode.updateText(EMPTY_FOR_SELECT);
        if (textBefore.length === 0) {
            this.removeNode(node);
            this._dom.handleSetSelection(newNode.getDomElement(), 1);
        }
        node.updateText(textBefore);

        this._dom.handleUpdateTextContent(node.getKey(), textBefore);

        if (textAfter.length > 0) {
            const nodeAfter = node.clone() as TextNode;
            this.addNode(parent, nodeAfter, { index: position + 1, lastKey: newNode.getKey() as NodeKey });
            this.updateText(nodeAfter, textAfter);
            nodeAfter.setStyle(oldStyle);
            this._dom.handleSetAttribute(STYLE, getStyleString(oldStyle), nodeAfter.getKey());
        }

        newNode.setStyle(style);
        this._dom.handleSetAttribute(STYLE, getStyleString(style), newNode.getKey());
        this._dom.handleSetSelection(newNode.getDomElement(), 1);
    };

    getNodesInRange = () => {
        const selection = this._selection;
        const anchorOffset = selection?.anchorOffset || 0;
        const focusOffset = selection?.focusOffset || 0;
        const anchorNodeParent = this.getParentForChildNode(selection?.anchorNode as HTMLElement) as LexicalNode;
        const focuseNodeParent = this.getParentForChildNode(selection?.focusNode as HTMLElement) as LexicalNode;
        const anchorNode = this.getNodeForText(selection?.anchorNode as HTMLElement) as LexicalNode;
        const focuseNode = this.getNodeForText(selection?.focusNode as HTMLElement) as LexicalNode;

        if (
            anchorNode.getKey() === focuseNode.getKey() &&
            anchorOffset === anchorNode.getText().length &&
            focusOffset === 0 &&
            focuseNodeParent.getKey() === anchorNodeParent.getKey()
        ) {
            return anchorNodeParent;
        }
    };

    handleUpdateTag = (tag: string) => {
        const selection = this._selection;
        if (selection?.type === 'Range') {
            const nodes = this.getNodesInRange();
            const initialParent = this.getParentForChildNode(selection.focusNode as HTMLElement);

            if (!Array.isArray(nodes) && nodes) {
                const key = nodes.getKey();
                const children = nodes.getChildren();
                const parent = nodes.getParent();
                if (!parent) return;
                const style = nodes.getStyle();
                this._nodeMap.delete(key);
                let newNode = this.createLexicalNode(key, tag as TAGS);
                this._nodeMap.set(key, newNode);
                newNode.setParent(parent);
                if (tag.startsWith('h')) {
                    newNode.setRange(Number(tag.split('').pop()));
                }

                if (tag === TAGS.UL || tag === TAGS.OL) {
                    newNode.setTypeList(tag as TAGS.OL | TAGS.UL);

                    const childItem = this.createLexicalNode(generateKey(), TAGS.LI);
                    this.addNode(newNode, childItem);
                    newNode = childItem;
                }
                this._dom.handleReplaceTag(newNode);
                children.forEach((child: NodeKey) => {
                    const childNode = this.getNodeByKey(child);
                    if (!childNode) return;
                    this.addNode(newNode, childNode);
                    this.updateText(childNode, childNode.getText());
                    this._dom.handleSetSelection(childNode.getDomElement(), childNode.getText()?.length || 0);
                });
                this.updateStyle(newNode, style);
                this._dom.handleSetSelection(newNode.getDomElement(), 1);
            } else {
                if (!initialParent) return;
                const newParent = this.createLexicalNode(generateKey(), tag as TAGS);
                const currentParent = this.getNodeByKey(initialParent.getParent());
                if (!currentParent) return;
                this.addNode(currentParent, newParent, {
                    index: currentParent.getChildIndex(initialParent) || 0,
                    lastKey: initialParent.getKey(),
                });
                this.updateStyle(newParent, initialParent?.getStyle());
                nodes?.forEach(node => {
                    this.addNode(newParent, this.getNodeByKey(node) as LexicalNode);
                    this._dom.handleSetSelection(this.getNodeByKey(node)?.getDomElement() as HTMLElement, 1);
                });
            }
        } else {
            const node = this.getNodeByKey(selection?.anchorNode?.parentElement?.id as NodeKey) as LexicalNode;
            const parent = this.getNodeByKey(node?.getParent() as NodeKey) as LexicalNode;
            const currentParent = this.getNodeByKey(parent.getParent() as NodeKey) as LexicalNode;
            const position = selection?.anchorOffset || 0;
            const lastElement = { index: position, lastKey: parent.getKey() };
            if (tag === TAGS.NORMAL) {
                const newParent = this.createLexicalNode(generateKey(), tag);
                this.addNode(currentParent, newParent, lastElement);
                const newNode = this.createLexicalNode(generateKey(), newParent.getChildType() as TAGS);
                this.addNode(newParent, newNode);
                this.updateText(newNode);
                this._dom.handleSetSelection(newNode.getDomElement(), 1);
            } else if (tag.startsWith('h')) {
                const newParent = this.createLexicalNode(generateKey(), tag as TAGS);
                newParent.setRange(Number(tag.split('').pop()));
                this.addNode(currentParent, newParent, lastElement);
                const newNode = this.createLexicalNode(generateKey(), newParent.getChildType() as TAGS);
                this.addNode(newParent, newNode);
                this.updateText(newNode);
                this._dom.handleSetSelection(newNode.getDomElement(), 1);
            } else if (tag === TAGS.OL || tag === TAGS.UL) {
                const newParent = this.createLexicalNode(generateKey(), tag);
                newParent.setTypeList(tag);
                this.addNode(currentParent, newParent, lastElement);
                const newNodeItem = this.createLexicalNode(generateKey(), newParent.getChildType() as TAGS);
                this.addNode(newParent, newNodeItem);
                const newNode = this.createLexicalNode(generateKey(), newNodeItem.getChildType() as TAGS);
                this.addNode(newNodeItem, newNode);
                this.updateText(newNode);
                this._dom.handleSetSelection(newNode.getDomElement(), 1);
            }
        }
    };

    handleSelect = (selection: Selection) => {
        this._selection = selection;
    };

    handleLinkAction = (key: NodeKey, href?: string) => {
        const node = this.getNodeByKey(key) as LexicalNode;
        const parent = this.getNodeByKey(node?.getParent() as NodeKey) as LexicalNode;
        const index = parent?.getChildIndex(key);
        const lastKey = index ? parent?.getChildren()?.at(index - 1) : null;
        if (parent?.getType() !== TAGS.LINK) {
            const newParent = this.createLexicalNode(generateKey(), TAGS.LINK);
            if (href) newParent.setHref(href);
            this._dom.handleRemoveElement(key);
            this.addNode(parent, newParent, index && lastKey ? { index, lastKey } : undefined);
            this.addNode(newParent, node);
            this._dom.handleSetAttribute(HREF, href, newParent.getKey());
            this._dom.handleSetAttribute(TARGET, '_blank', newParent.getKey());
            this._dom.handleUpdateTextContent(key, node.getText());
            const newNodeAfter = this.createLexicalNode(generateKey(), TAGS.LINK);
            this.addNode(parent, newNodeAfter, { index: index + 1, lastKey: newParent.getKey() });
            this.updateText(newNodeAfter);
            this._dom.handleSetSelection(newNodeAfter.getDomElement(), 1);
        } else {
            if (href) {
                parent.setHref(href);
                this._dom.handleSetAttribute('href', href, parent.getKey());
            } else {
                const keyLink = parent.getKey() as NodeKey;
                this._dom.handleRemoveElement(keyLink);
            }
        }
    };

    handleClick = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.localName !== TAGS.ROOT) {
            this._dom.handleSetSelection(
                this._selection?.anchorNode as HTMLElement,
                this._selection?.anchorOffset as number,
                this._selection?.type
            );
        }
    };

    handleDecorateParent = (style: StyleProps) => {
        const anchorNode = this._selection?.anchorNode as HTMLElement | null;
        if (!anchorNode) return;
        const parentNode = this.getParentForChildNode(anchorNode);
        if (!parentNode) return;
        parentNode.setStyle(style);
        this._dom.handleSetAttribute(STYLE, getStyleString(style), parentNode.getKey() as NodeKey);
    };

    getNodeMap = () => new Map(this._nodeMap);

    handleRedo = (state: HistoryItem) => {
        const node = this.getNodeByKey(state.id);
        if (node) {
            this.updateText(node, state.after);
            this._dom.handleSetSelection(node.getDomElement(), 1);
            return;
        }

        const getNewNode = (key: string) => {
            const copyNode = state.branch.get(key) as LexicalNode;
            const parentKey = copyNode?.getParent();
            const parentNode = this.getNodeByKey(parentKey as NodeKey) || getNewNode(parentKey as NodeKey);
            const newNode = copyNode.clone(key);
            const copyParent = state.branch.get(parentKey as NodeKey) as LexicalNode;
            const position = copyParent.getChildIndex(key);
            const lastKey = copyParent.getChildren().at(position);
            this.addNode(parentNode, newNode, { index: position + 1, lastKey });
            if (newNode.getType() === TAGS.TEXT) {
                this.updateText(newNode);
            }
            if (copyNode.getStyle()) {
                this.updateStyle(newNode, copyNode.getStyle());
            }
            return newNode;
        };
        const newNode = getNewNode(state.id);
        this.updateText(newNode, state.after);
        this._dom.handleSetSelection(newNode.getDomElement(), 1);
    };

    handleUndo = (state: HistoryItem) => {
        const node = this.getNodeByKey(state.id);
        if (node && node.getType() === TAGS.TEXT) {
            this.updateText(node, state.before);
            if (state.before === '' || state.before === EMPTY_FOR_SELECT) {
                this.removeNode(node);
            }
        }
    };
}
