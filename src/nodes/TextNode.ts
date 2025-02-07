/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeMapType } from '../components/Editor/EditorState/EditorState.types';
import { TEXT_KEY, TEXT_TAG } from '../helpers/constants';
import { TAGS } from '../types';
import { ChildType, LexicalNode, NodeKeyType } from './LexicalNode';

export class Text extends LexicalNode {
    __children: null;
    __text: string | null;
    __parent: NodeKeyType;
    __key: NodeKeyType;

    constructor(parent: NodeKeyType, text: string | null, key: NodeKeyType) {
        super(TEXT_KEY, TEXT_TAG);
        this.__parent = parent;
        this.__text = text;
        this.__children = null;
        this.__key = key;
        this.__type = TAGS.TEXT;
    }

    setText(newText: string) {
        this.__text = newText;
    }

    getText(_nodeMap: NodeMapType<LexicalNode>) {
        return this.__text || '';
    }

    getChildList(): ChildType[] | null | undefined {
        return [];
    }

    haveTextChild() {
        return Boolean(this.__text?.length);
    }

    getTextLength() {
        return this.__text?.length || 0;
    }

    canHaveText() {
        return true;
    }

    getParent() {
        return this.__parent;
    }

    getKey() {
        return this.__key;
    }
}
