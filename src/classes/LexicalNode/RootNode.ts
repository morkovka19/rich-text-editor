/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleProps } from '../../context/ToolbarContext';
import { generateKey } from '../../utils/generateKey';
import { LexicalElement } from './LexicalElement';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class RootNode extends LexicalElement {
    public setStyle(style: StyleProps): void {
        throw new Error('Method not implemented.');
    }
    public getStyle(): StyleProps {
        throw new Error('Method not implemented.');
    }
    public removeChild(key: NodeKey): void {
        this._children.filter(child => child !== key);
    }
    public getText(): string {
        throw new Error('Method not implemented.');
    }
    public getChildren(): Array<NodeKey> {
        return this._children;
    }
    constructor(key: NodeKey) {
        super(key, 'root');
    }

    render() {
        const rootElement = document.createElement('div');
        rootElement.id = this._type;
        rootElement.setAttribute('style', 'min-height: 100px');
        return rootElement;
    }

    public updateText(text: string): HTMLElement {
        throw new Error('Method not implemented.');
    }

    public getChildType(): string {
        return 'p';
    }

    public clone(): LexicalNode {
        return new RootNode(generateKey());
    }
}
