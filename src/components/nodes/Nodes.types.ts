import { MAIN_DIV_ID } from '../../helpers/constants';

export type NodeKeyType = string;
export type NodeMapType<T> = Map<NodeKeyType, T>;

export type BaseNodeType = {
    key: string;
    type: string;
};
export type ParentNodeType = BaseNodeType & {
    parent: NodeKeyType;
    children: NodeKeyType[];
};

export type ContentNodeType = ParentNodeType & {
    content?: string;
};

export type RootNodeType = Omit<ParentNodeType, 'parent'> & {
    key: typeof MAIN_DIV_ID;
    type: 'div';
};

export type LineBreakNodeType = Omit<BaseNodeType, 'children'> & {
    parent: NodeKeyType;
    type: 'br';
};

export type LexicalNodeType = ContentNodeType | RootNodeType | ParentNodeType | LineBreakNodeType;
