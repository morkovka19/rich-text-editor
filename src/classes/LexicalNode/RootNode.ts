import { generateKey } from '../../utils/generateKey';
import { LexicalElement } from './LexicalElement';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class RootNode extends LexicalElement {
    constructor(key: NodeKey) {
        super(key, 'root');
    }

    render() {
        const rootElement = document.createElement('div');
        rootElement.id = this._type;
        rootElement.setAttribute('style', 'min-height: 400px');
        return rootElement;
    }

    public getChildType(): string {
        return 'p';
    }

    public clone(): LexicalNode {
        return new RootNode(generateKey());
    }
}
