/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleProps } from '../../context/ToolbarContext';
import { EMPTY_FOR_SELECT } from '../../utils/constants';
import { generateKey } from '../../utils/generateKey';
import { LexicalNode } from '../LexicalNode/LexicalNode';
import { ParagraphNode } from '../LexicalNode/ParagraphNode';
import { RootNode } from '../LexicalNode/RootNode';
import { TextNode } from '../LexicalNode/TextNode';
import { NodeKey } from '../LexicalNode/types';
import { SelectionManager } from '../SelectionManager';

export class LexicalState {
    _nodeMap: Map<NodeKey, LexicalNode>;
    _rootNode: RootNode;
    _selection: SelectionManager;

    constructor(selection: SelectionManager) {
        this._rootNode = new RootNode('root');
        this._nodeMap = new Map();
        this._nodeMap.set('root', this._rootNode);
        this._selection = selection;
    }

    getNodeByKey(key: NodeKey) {
        return this._nodeMap.get(key);
    }

    createLexicalNode(key: NodeKey, childType: string) {
        switch (childType) {
            case 'span':
                return new TextNode(key);
            case 'p':
                return new ParagraphNode(key);
            case 'root':
                return new RootNode('root');
            default:
                return new ParagraphNode(key);
        }
    }

    addNode(parent: LexicalNode, child: LexicalNode, position?: { index: number; lastElement: HTMLElement }) {
        if (!this._nodeMap.get(child?.getKey())) {
            this._nodeMap.set(child?.getKey(), child);
            parent.addChild(child.getKey(), position?.index);
            child.setParent(parent.getKey());

            const parentElement = parent.getDomElement();
            const childElement = child.render();
            if (!position) parentElement.appendChild(childElement);
            else {
                position.lastElement.after(childElement);
            }
        }
    }

    updateNodeText(key: NodeKey, text: string) {
        const selection = this._selection.getDefSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const startOffset = range.startOffset; // Сохраняем текущую позицию курсора

        const checkAndUpdate = (node: LexicalNode) => {
            const element = node.getDomElement();
            if (element?.textContent) element.textContent = '';
            if (node.canHasText()) {
                const element = node.getDomElement();
                if (!element) return;

                // Сохраняем текущий текст до обновления
                const currentText = node.getText();

                // Обновляем текст узла
                node.updateText(text);
                // Восстанавливаем позицию курсора
                const textNode = element?.childNodes[0] || element;
                this._selection.setSelection(textNode, Math.min(startOffset, text.length));
                return;
            } else {
                const childType = node.getChildType();
                const key = generateKey();
                const childNode = this.createLexicalNode(key, childType);
                this.addNode(node, childNode);
                return checkAndUpdate(childNode);
            }
        };
        const node = this._nodeMap.get(key);
        if (node) return checkAndUpdate(node);
        else return;
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

    removeNode(node: LexicalNode) {
        const parent = this.getNodeByKey(node.getParent() as NodeKey) as LexicalNode;
        if (parent.getChildren().includes(node.getKey())) parent.removeChild(node.getKey());
        this._nodeMap.delete(node.getKey());
    }

    createAfterEnter() {}

    handleSimpleEnter(key: NodeKey) {
        const node = this._nodeMap.get(key);
        const newParent = this.getNodeByKey(node?.getParent() as NodeKey)?.clone() as LexicalNode;
        const newNode = node?.clone() as LexicalNode;
        const currentParentKey = (
            this.getNodeByKey(node?.getParent() as NodeKey) as LexicalNode
        )?.getParent() as NodeKey;
        this.addNodeWithKey(currentParentKey, newParent);
        this.addNode(newParent, newNode);
        newNode.updateText('\n');
        this._selection.setSelection(newNode.getDomElement(), 1);
        return newNode;
    }

    handleEnterInText(key: NodeKey, position: number) {
        const newNode = this.handleSimpleEnter(key);
        const node = this.getNodeByKey(key) as TextNode;
        const text = node.getText() || '';
        const textBefore = text.slice(0, position);
        const textAfter = text.slice(position);
        newNode.updateText(textAfter);
        node.updateText(textBefore);

        const elenent = newNode.getDomElement()?.childNodes[0] || newNode.getDomElement();
        this._selection.setSelection(elenent, 0);
    }

    handleSimpleUpdateStyle(key: NodeKey, style: StyleProps) {
        const node = this.getNodeByKey(key) as TextNode;
        const parent = this.getNodeByKey(node.getParent() as NodeKey) as LexicalNode;
        const newNode = node.clone() as TextNode;
        this.addNode(parent, newNode);
        newNode.updateText(EMPTY_FOR_SELECT);
        newNode.setStyle(style);
        this._selection.setSelection(newNode.getDomElement(), 1);
    }

    handleUpdateStyleInText(key: NodeKey, position: number, style: StyleProps) {
        const nodeBefore = this.getNodeByKey(key) as TextNode;
        const parent = this.getNodeByKey(nodeBefore.getParent() as NodeKey) as LexicalNode;
        const indexNode = parent.getChildIndex(key);
        const newNodeInsert = nodeBefore.clone() as TextNode;
        const nodeAfter = nodeBefore.clone() as TextNode;
        const text = nodeBefore.getText() || '';
        const textBefore = text.slice(0, position);
        const textAfter = text.slice(position);
        nodeBefore.updateText(textBefore);
        this.addNode(parent, newNodeInsert, { index: indexNode, lastElement: nodeBefore.getDomElement() });
        newNodeInsert.updateText(EMPTY_FOR_SELECT);
        newNodeInsert.setStyle(style);
        this.addNode(parent, nodeAfter, { index: indexNode + 1, lastElement: newNodeInsert.getDomElement() });
        nodeAfter.updateText(textAfter);
        this._selection.setSelection(newNodeInsert.getDomElement(), 1);
    }
}
