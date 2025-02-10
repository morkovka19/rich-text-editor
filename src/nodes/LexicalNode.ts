import { MAIN_DIV_ID } from '../helpers/constants';
import { PARENT_NODE_TYPE } from '../helpers/regex';
import { KlassConstructor } from '../types';

export type NodeKeyType = string;

export type ChildType = NodeKeyType;

export interface IStyleNode {
    fontFamily: string;
    fontSize: number;
}

export class LexicalNode {
    ['constructor']!: KlassConstructor<typeof LexicalNode>;
    __type: string;
    __key: string;
    __parent: NodeKeyType | null;
    __children: ChildType[] | null | undefined;
    __style: IStyleNode | null | undefined;

    constructor(
        key: NodeKeyType,
        type: string,
        parent?: NodeKeyType,
        children?: ChildType[] | null,
        style?: IStyleNode
    ) {
        this.__key = key;
        this.__parent = parent || null;
        this.__type = type;
        this.__children = children;
        this.__style = style;
    }

    getType() {
        return this.__type;
    }

    getKey() {
        return this.__key;
    }

    getStyle() {
        return this.__style;
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

    haveTextChild() {
        return Boolean(this.getTextChild()?.length);
    }

    setText(_text: string) {
        console.log(_text);
    }

    getParent() {
        return this.__parent;
    }

    getChildList() {
        return this.__children;
    }

    setChildList(childList: ChildType[] | null | undefined) {
        this.__children = childList;
    }

    setStyle(newStyle: IStyleNode) {
        this.__style = newStyle;
    }

    addChild(child: ChildType, position?: number) {
        if (position && position !== this.__children?.length)
            this.__children = [
                ...(this.__children?.slice(0, position) || []),
                child,
                ...(this.__children?.slice(position) || []),
            ];
        else this.__children?.push(child);
    }

    getTextLength() {
        return 0;
    }
}
