/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleProps } from '../../context/ToolbarContext';
import { createParagraphElement } from '../../utils/DOMUtils';
import { generateKey } from '../../utils/generateKey';
import { LexicalElement } from './LexicalElement';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class ParagraphNode extends LexicalElement {
    public clone(): LexicalNode {
        return new ParagraphNode(generateKey());
    }
    public getChildren(): Array<NodeKey> {
        return this._children;
    }

    constructor(key: NodeKey) {
        super(key, 'p');
        this._children = [];
    }

    public render(): HTMLElement {
        return createParagraphElement(this._key);
    }

    public getChildType(): string {
        return 'span';
    }
}
