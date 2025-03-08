/* eslint-disable @typescript-eslint/no-unused-vars */
import { createHeadingElement } from '../../utils/DOMUtils';
import { generateKey } from '../../utils/generateKey';
import { LexicalElement } from './LexicalElement';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class HeadingNode extends LexicalElement {
    _range: number | undefined;

    constructor(key?: NodeKey, range?: number) {
        super(key || generateKey(), 'h');
        this._range = range;
    }

    public render(): HTMLElement {
        return createHeadingElement(this._key, this._range as number);
    }

    public getChildType(): string {
        return 'span';
    }
    public getChildren(): Array<NodeKey> {
        return this._children;
    }
    public clone(): LexicalNode {
        return new HeadingNode(generateKey(), this._range);
    }

    public setRange(range: number) {
        this._range = range;
    }

    public getRange() {
        return this._range;
    }
}
