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
    public addChild(child: NodeKey, position?: number): void {
        if (position) {
            this._children.splice(position, 0, child);
        } else this._children.push(child);
    }
    public getChildIndex(key: NodeKey): number {
        return this._children.indexOf(key);
    }
}
