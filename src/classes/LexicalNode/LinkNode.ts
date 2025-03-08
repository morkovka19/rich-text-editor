import { createLinkElement, updateHrefLinkElement } from '../../utils/DOMUtils';
import { generateKey } from '../../utils/generateKey';
import { LexicalElement } from './LexicalElement';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class LinkNode extends LexicalElement {
    public render(): HTMLElement {
        return createLinkElement(this._key);
    }
    public getChildType(): string {
        throw new Error('Method not implemented.');
    }
    public clone(): LexicalNode {
        return new LinkNode(generateKey());
    }
    _href: string;

    constructor(key: NodeKey) {
        super(key, 'a');
        this._href = '';
    }

    getHref() {
        return this._href;
    }

    setHrefElementDOM() {
        const element = this.getDomElement();
        if (element) updateHrefLinkElement(this._key, this._href);
    }

    setHref(href: string) {
        this._href = href;
        this.setHrefElementDOM();
    }
}
