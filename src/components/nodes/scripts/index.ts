import { ContentNodeType, LineBreakNodeType, ParentNodeType, RootNodeType } from '../Nodes.types';

export const isContentNodeType = (
    node: RootNodeType | ParentNodeType | ContentNodeType | LineBreakNodeType
): node is ContentNodeType => (node as ContentNodeType).content !== undefined;

export const isLineBreakNodeType = (
    node: RootNodeType | ParentNodeType | ContentNodeType | LineBreakNodeType
): node is LineBreakNodeType => (node as LineBreakNodeType).type === 'br';

export const isRootNodeType = (
    node: ParentNodeType | ContentNodeType | RootNodeType | LineBreakNodeType
): node is RootNodeType => (node as RootNodeType).key === 'root-div';
