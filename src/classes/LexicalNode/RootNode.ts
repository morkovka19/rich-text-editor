import { STYLE, TAGS } from '../../utils/constants';
import { generateKey } from '../../utils/generateKey';
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

    public clone(): LexicalNode {
        return new RootNode(generateKey());
    }
}
