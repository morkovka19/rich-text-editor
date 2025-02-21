import { KlassConstructor } from '..';
import { MAIN_DIV_ID } from '../../helpers/constants';
import { PARENT_NODE_TYPE } from '../../helpers/regex';

export type NodeKeyType = string;

export type ChildType = NodeKeyType;

export interface IStyleNode {
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    fontWeight?: number;
    fontStyle?: string;
    textDecoration?: string;
}

export interface IProps {
    link?: {
        href: string;
        target: string;
    };
}

export class LexicalNode {
    ['constructor']!: KlassConstructor<typeof LexicalNode>;
    __type: string;
    __key: string;
    __parent: NodeKeyType | null;
    __children: ChildType[] | null | undefined;
    __style: IStyleNode | null | undefined;
    __props: IProps;

    constructor(
        key: NodeKeyType,
        type: string,
        parent?: NodeKeyType,
        children?: ChildType[] | null,
        style?: IStyleNode,
        props?: IProps
    ) {
        this.__key = key;
        this.__parent = parent || null;
        this.__type = type;
        this.__children = children;
        this.__style = style;
        this.__props = { ...props };
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

    replaceChild(oldChild: NodeKeyType, newChild: NodeKeyType) {
        if (this.__children && this.__children.length > 0) {
            this.__children.splice(
                this.__children.findIndex(item => item === oldChild),
                1,
                newChild
            );
        }
    }

    setProps(newProps: IProps) {
        this.__props = { ...this.__props, ...newProps };
    }

    getProps() {
        return this.__props;
    }

    getTextLength() {
        return 0;
    }
}
