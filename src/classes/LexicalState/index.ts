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

    addNode(parent: LexicalNode, child: LexicalNode) {
        parent.addChild(child.getKey());
        child.setParent(parent.getKey());
        const childElement = child.render();
        const parentElement = parent.getDomElement();
        parentElement?.appendChild(childElement);
    }

    updateNodeText(key: NodeKey, text: string) {
        const checkAndUpdate = (node: LexicalNode) => {
            const element = node.getDomElement();
            if (element?.textContent) element.textContent = '';
            if (node.canHasText()) {
                node.updateText(text);
                this._selection.setSelection(node, 1);
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
}
