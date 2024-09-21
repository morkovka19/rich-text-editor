import { MAIN_DIV_ID } from '../helpers/constants';
import { PARENT_NODE_TYPE } from '../helpers/regex';
import { KlassConstructor } from '../types';
import { TextNode } from './TextNode';

export type NodeKeyType = string;

export type ChildType = NodeKeyType | TextNode;

export class LexicalNode {
    ['constructor']!: KlassConstructor<typeof LexicalNode>;
    __type: string;
    __key: string;
    __parent: NodeKeyType | null;
    __children: ChildType[] | null | undefined;

    constructor(key: NodeKeyType, type: string, parent?: NodeKeyType, children?: ChildType[] | null) {
        this.__key = key;
        this.__parent = parent || null;
        this.__type = type;
        this.__children = children;
    }

    getType() {
        return this.__type;
    }

    getKey() {
        return this.__key;
    }

    isRoot() {
        return this.__key === MAIN_DIV_ID;
    }

    isParent() {
        return PARENT_NODE_TYPE.test(this.__type);
    }

    canHaveText() {
        return false;
    }

    getTextChild() {
        return this.__children?.filter(child => typeof child !== 'string');
    }

    setText(text: string) {
        console.log(text);
    }
    getParent() {
        return this.__parent;
    }

    getChildList() {
        return this.__children;
    }

    addChild(child: ChildType /*position?: number*/) {
        this.__children?.push(child);
    }
}
