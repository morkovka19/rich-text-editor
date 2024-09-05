import { MAIN_DIV_ID } from '../../helpers/constants';

export type NodeKeyType = string;
export type NodeMapType<T> = Map<NodeKeyType, T>;

export type BaseNodeType = {
    key: string;
    type: string;
    prev: null | NodeKeyType;
    next: null | NodeKeyType;
};
export type ParentNodeType = BaseNodeType & {
    parent: NodeKeyType;
    children: NodeKeyType[];
};

export type ContentNodeType = BaseNodeType & {
    parent: NodeKeyType;
    content?: string;
};

export type RootNodeType = Omit<ParentNodeType, 'parent'> & {
    key: typeof MAIN_DIV_ID;
    type: 'div';
};

export type LineBreakNodeType = BaseNodeType & {
    type: 'br';
    parent: NodeKeyType;
};

export type LexicalNodeType = ContentNodeType | RootNodeType | ParentNodeType;
