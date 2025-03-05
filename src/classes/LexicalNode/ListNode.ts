import { createNewListElement, createNewListItemElement } from '../../utils/DOMUtils';
import { generateKey } from '../../utils/generateKey';
import { LexicalElement } from './LexicalElement';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class ListNode extends LexicalElement {
    public render(): HTMLElement {
        return createNewListElement(this._key, this._typeList || 'ul');
    }
    public getChildType(): string {
        return 'li';
    }
    public clone(): LexicalNode {
        return new ListNode(generateKey(), this._typeList);
    }
    _typeList: 'ol' | 'ul' | undefined;

    constructor(key: NodeKey, typeList?: 'ol' | 'ul') {
        super(key, 'list');
        this._typeList = typeList;
    }

    getTypeList() {
        return this._typeList;
    }

    setTypeList(type: 'ol' | 'ul') {
        this._typeList = type;
    }
}

export class ListItemNode extends LexicalElement {
    public render(): HTMLElement {
        return createNewListItemElement(this._key);
    }
    public getChildType(): string {
        return 'span';
    }
    public clone(): LexicalNode {
        return new ListItemNode(generateKey());
    }
    constructor(key: NodeKey) {
        super(key, 'li');
    }
}
