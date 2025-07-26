import { createParagraphElement } from '../../utils/DOMUtils';
import { TAGS } from '../../utils/constants';
import { generateKey } from '../../utils/generateKey';
import { LexicalElement } from './LexicalElement';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class ParagraphNode extends LexicalElement {
    public clone(key?: string): LexicalNode {
        return new ParagraphNode(key || generateKey());
    }
    public getChildren(): Array<NodeKey> {
        return this._children;
    }

    constructor(key: NodeKey) {
        super(key, TAGS.NORMAL);
        this._children = [];
    }

    public render(): HTMLElement {
        return createParagraphElement(this._key);
    }

    public getChildType() {
        return TAGS.TEXT;
    }
}
