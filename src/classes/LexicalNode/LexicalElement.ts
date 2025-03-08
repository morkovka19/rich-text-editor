/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleProps } from '../../context/ToolbarContext';
import { removeChildElement } from '../../utils/DOMUtils';
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

    public removeChild(key: NodeKey): void {
        this._children = this._children.filter(child => child !== key);
    }

    public getChildren(): Array<NodeKey> {
        return this._children;
    }

    public removeChildElement(key: NodeKey) {
        removeChildElement(this._key, key);
    }

    public setStyle(style: Record<string, string | number>): void {
        throw new Error('Method not implemented.');
    }
    public getStyle(): StyleProps {
        throw new Error('Method not implemented.');
    }
    public getText(): string {
        throw new Error('Method not implemented.');
    }

    public updateText(text: string): HTMLElement {
        throw new Error('Method not implemented.');
    }

    public getRange(): number | undefined {
        throw new Error('Method not implemented.');
    }

    public setRange(range: number): void {
        throw new Error('Method not implemented.');
    }

    public setTypeList(type: string): void {
        throw new Error('Method not implemented.');
    }

    public setHref(href: string): void {
        throw new Error('Method not implemented.');
    }
    public getHref(): string {
        throw new Error('Method not implemented.');
    }
}
