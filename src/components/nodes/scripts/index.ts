import { ContentNodeType, ParentNodeType, RootNodeType } from '../Nodes.types';

export const isContentNodeType = (node: RootNodeType | ParentNodeType | ContentNodeType): node is ContentNodeType =>
    (node as ContentNodeType).content !== undefined;

export const isParentContentNodeType = (
    node: RootNodeType | ParentNodeType | ContentNodeType | ContentNodeType[]
): node is ParentNodeType => (node as ParentNodeType).parent !== undefined;

export const isRootNodeType = (node: ParentNodeType | ContentNodeType | RootNodeType): node is RootNodeType =>
    (node as RootNodeType).key === 'root';
