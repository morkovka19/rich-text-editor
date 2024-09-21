import { MAIN_DIV_ID } from '../helpers/constants';
import { TAGS } from '../types';
import { LexicalNode, NodeKeyType } from './LexicalNode';

export class RootNode extends LexicalNode {
    __parent: null;
    __children: NodeKeyType[];

    constructor(children?: NodeKeyType[]) {
        super(MAIN_DIV_ID, TAGS.BLOCK, '');
        this.__parent = null;
        this.__children = children || [];
    }

    isRoot() {
        return true;
    }
}
