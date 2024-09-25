import { TEXT_KEY, TEXT_TAG } from '../helpers/constants';
import { LexicalNode, NodeKeyType } from './LexicalNode';

export class Text extends LexicalNode {
    __children: null;
    __text: string | null;
    __parent: NodeKeyType;

    constructor(parent: NodeKeyType, text: string | null) {
        super(TEXT_KEY, TEXT_TAG);
        this.__parent = parent;
        this.__text = text;
        this.__children = null;
    }

    setText(newText: string) {
        this.__text = newText;
    }

    getText() {
        return this.__text;
    }

    canHaveText() {
        return true;
    }

    addChild(/*child: ChildType, position?: number*/) {
        return null;
    }

    getParent() {
        return this.__parent;
    }
}
