export type NodeKeyType = string;
export interface ILexicalNode {
    type: string;
    key: string;
    parent: null | NodeKeyType;
    prev: null | NodeKeyType;
    next: null | NodeKeyType;
    children: NodeKeyType[];
    content?: string;
}

export type NodeMapType = Map<NodeKeyType, ILexicalNode>;
