/* eslint-disable @typescript-eslint/no-explicit-any */
import { createNewListElement, createNewListItemElement } from '../../utils/DOMUtils';
import { TAGS } from '../../utils/constants';
import { generateKey } from '../../utils/generateKey';
import { LexicalElement } from './LexicalElement';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

export class ListNode extends LexicalElement {
    public render(): HTMLElement {
        return createNewListElement(this._key, this._typeList || TAGS.UL);
    }
    public getChildType() {
        return TAGS.LI;
    }
    public clone(key?: string) {
        return new ListNode(key || generateKey(), this._typeList as any);
    }
    _typeList: undefined | TAGS.UL | TAGS.OL;

    constructor(key: NodeKey, typeList?: TAGS.OL | TAGS.UL) {
        super(key, TAGS.LIST);
        this._typeList = typeList;
    }

    getTypeList() {
        return this._typeList;
    }

    setTypeList(type: TAGS.OL | TAGS.UL) {
        this._typeList = type;
    }
}

export class ListItemNode extends LexicalElement {
    public render(): HTMLElement {
        return createNewListItemElement(this._key);
    }
    public getChildType() {
        return TAGS.TEXT;
    }
    public clone(): LexicalNode {
        return new ListItemNode(generateKey());
    }
    constructor(key: NodeKey) {
        super(key, TAGS.LI);
    }
}
