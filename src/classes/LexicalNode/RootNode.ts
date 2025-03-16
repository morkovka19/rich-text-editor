import { STYLE, TAGS } from '../../utils/constants';
import { LexicalElement } from './LexicalElement';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class RootNode extends LexicalElement {
    constructor(key: NodeKey) {
        super(key, TAGS.ROOT);
    }

    render() {
        const rootElement = document.createElement(TAGS.BLOCK);
        rootElement.id = this._type;
        rootElement.setAttribute(STYLE, 'min-height: 400px');
        return rootElement;
    }

    public getChildType(): string {
        return TAGS.NORMAL;
    }

    public clone(key?: string): LexicalNode {
        return new RootNode(key || TAGS.ROOT);
    }
}
