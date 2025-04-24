/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleProps } from '../../context/StylesContext';
import { createTextElement } from '../../utils/DOMUtils';
import { TAGS } from '../../utils/constants';
import { generateKey } from '../../utils/generateKey';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class TextNode extends LexicalNode {
    public removeChildren(_maxIndex: number, _isStart: boolean): Array<string> {
        throw new Error('Method not implemented.');
    }
    public addChildren(_children: Array<NodeKey>): void {
        throw new Error('Method not implemented.');
    }
    public removeChildElement(_key: NodeKey): void {
        throw new Error('Method not implemented.');
    }
    public setHref(_href: string): void {
        throw new Error('Method not implemented.');
    }
    public getHref(): string {
        throw new Error('Method not implemented.');
    }
    public setTypeList(_type: string): void {
        throw new Error('Method not implemented.');
    }
    public setRange(_range: number): void {
        throw new Error('Method not implemented.');
    }
    public getRange(): number {
        throw new Error('Method not implemented.');
    }
    public getChildIndex(_key: NodeKey): number {
        throw new Error('Method not implemented.');
    }
    public removeChild(_key: NodeKey): void {
        throw new Error('Method not implemented.');
    }
    _text: string;
    _style: StyleProps;

    constructor(key: NodeKey) {
        super(key, TAGS.TEXT);
        this._text = '';
        this._style = {};
    }

    canHasText(): boolean {
        return true;
    }

    public render(): HTMLElement {
        return createTextElement(this._key);
    }

    updateText(text: string) {
        this._text = text;
    }

    public getChildType(): string {
        throw new Error('Method not implemented.');
    }
    public addChild(_child: NodeKey): void {
        throw new Error('Method not implemented.');
    }
    public getChildren(): Array<NodeKey> {
        return [];
    }

    getText() {
        return this._text;
    }

    public clone(key?: string): LexicalNode {
        const node = new TextNode(key || generateKey());
        node.setStyle(this._style);
        return node;
    }

    public setStyle(style: StyleProps): void {
        this._style = { ...this._style, ...style };
    }
    public getStyle(): StyleProps {
        return this._style;
    }
}
