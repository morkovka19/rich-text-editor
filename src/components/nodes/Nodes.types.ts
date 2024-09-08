import { MAIN_DIV_ID } from '../../helpers/constants';
import { TAGS } from '../../types';

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
    type: TAGS.BLOCK;
};

// export type LineBreakNodeType = Omit<BaseNodeType, 'children'> & {
//     parent: NodeKeyType;
//     type: 'br';
// };

export type LexicalNodeType = ContentNodeType | RootNodeType | ParentNodeType;
