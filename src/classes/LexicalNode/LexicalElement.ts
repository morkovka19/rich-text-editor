import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export abstract class LexicalElement extends LexicalNode {
    _children: Array<NodeKey>;

    constructor(key: NodeKey, type: string) {
        super(key, type);
        this._children = [];
    }

    addChildren(child: Array<NodeKey>) {
        this._children.push(...child);
    }

    public abstract render(): HTMLElement;
    public addChild(child: NodeKey): void {
        this._children.push(child);
    }
}
