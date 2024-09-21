import { ChildType, LexicalNode, NodeKeyType } from './LexicalNode';

export class ParentNode extends LexicalNode {
    __children: ChildType[];
    __parent: NodeKeyType;

    constructor(key: NodeKeyType, type: string, parent: NodeKeyType, children?: ChildType[]) {
        super(key, type);
        this.__parent = parent;
        this.__children = children || [];
    }

    getParent() {
        return this.__parent;
    }

    findChildByKey(key: NodeKeyType) {
        return this.__children.find(item => item === key);
    }
}
