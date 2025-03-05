/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleProps } from '../../context/ToolbarContext';
import { createTextElement, updateTextContent } from '../../utils/DOMUtils';
import { generateKey } from '../../utils/generateKey';
import { getStyleString } from '../../utils/styleUtils';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class TextNode extends LexicalNode {
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
        super(key, 'span');
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
        return this.renderMutate();
    }

    renderMutate() {
        return updateTextContent(this._key, this._text);
    }

    public getChildType(): string {
        throw new Error('Method not implemented.');
    }
    public addChild(child: NodeKey): void {
        throw new Error('Method not implemented.');
    }
    public getChildren(): Array<NodeKey> {
        throw new Error('Method not implemented.');
    }

    getText() {
        return this._text;
    }

    public clone(): LexicalNode {
        return new TextNode(generateKey());
    }

    public setStyle(style: StyleProps): void {
        this._style = { ...this._style, ...style };
        this.setStyleThisElement();
    }
    public getStyle(): StyleProps {
        return this._style;
    }

    setStyleThisElement() {
        const element = this.getDomElement();
        element.setAttribute('style', getStyleString(this._style));
    }
}
