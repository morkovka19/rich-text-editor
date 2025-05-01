/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleProps } from '../../context/FormattingContext';
import { createTextElement } from '../../utils/DOMUtils';
import { TAGS } from '../../utils/constants';
import { generateKey } from '../../utils/generateKey';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class TextNode extends LexicalNode {
    public removeChildren(maxIndex: number, isStart: boolean): Array<string> {
        throw new Error('Method not implemented.');
    }
    public addChildren(children: Array<NodeKey>): void {
        throw new Error('Method not implemented.');
    }
    public removeChildElement(key: NodeKey): void {
        throw new Error('Method not implemented.');
    }
    public setHref(href: string): void {
        throw new Error('Method not implemented.');
    }
    public getHref(): string {
        throw new Error('Method not implemented.');
    }
    public setTypeList(type: string): void {
        throw new Error('Method not implemented.');
    }
    public setRange(range: number): void {
        throw new Error('Method not implemented.');
    }
    public getRange(): number {
        throw new Error('Method not implemented.');
    }
    public getChildIndex(key: NodeKey): number {
        throw new Error('Method not implemented.');
    }
    public removeChild(key: NodeKey): void {
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
    public addChild(child: NodeKey): void {
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
