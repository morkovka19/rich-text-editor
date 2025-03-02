/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleProps } from '../../context/ToolbarContext';
import { createParagraphElement } from '../../utils/DOMUtils';
import { generateKey } from '../../utils/generateKey';
import { LexicalElement } from './LexicalElement';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class ParagraphNode extends LexicalElement {
    public setStyle(style: Record<string, string | number>): void {
        throw new Error('Method not implemented.');
    }
    public getStyle(): StyleProps {
        throw new Error('Method not implemented.');
    }
    public getText(): string {
        throw new Error('Method not implemented.');
    }
    public removeChild(key: NodeKey): void {
        this._children.filter(child => child !== key);
    }
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
    public updateText(text: string): HTMLElement {
        throw new Error('Method not implemented.');
    }
    public getChildType(): string {
        return 'span';
    }
}
