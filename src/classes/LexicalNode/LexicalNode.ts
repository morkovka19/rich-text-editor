import { StyleProps } from '../../context/ToolbarContext';
import { getDOMElement } from '../../utils/DOMUtils';
import { NodeKey } from './types';

export abstract class LexicalNode {
    _key: NodeKey;
    _type: string;
    _parentKey?: NodeKey | null;

    constructor(key: NodeKey, type: string, parentKey?: NodeKey | null) {
        this._key = key;
        this._type = type;
        this._parentKey = parentKey;
    }

    setParent(parentKey: NodeKey) {
        this._parentKey = parentKey;
    }

    public abstract render(): HTMLElement;

    public abstract canHasText(): boolean;
    public abstract updateText(text: string): void;
    public abstract getChildType(): string;
    public abstract getChildren(): Array<NodeKey>;
    public abstract addChild(child: NodeKey, position?: number): void;
    public abstract clone(): LexicalNode;
    public abstract removeChild(key: NodeKey): void;
    public abstract getText(): string;
    public abstract setStyle(style: StyleProps): void;
    public abstract getStyle(): StyleProps;
    public abstract getChildIndex(key: NodeKey): number;
    public abstract setRange(range: number): void;
    public abstract getRange(): number | undefined;
    public abstract setTypeList(type: string): void;
    public abstract setHref(href: string): void;
    public abstract getHref(): string;
    public abstract removeChildElement(key: NodeKey): void;

    getType() {
        return this._type;
    }
    getKey() {
        return this._key;
    }

    getDomElement() {
        return getDOMElement(this._key);
    }

    getParent() {
        return this._parentKey;
    }
}
