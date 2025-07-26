import { StyleProps } from '../../context/FormattingContext';
import { getDOMElement } from '../../utils/DOMUtils';
import { TAGS } from '../../utils/constants';
import { NodeKey } from './types';

export abstract class LexicalNode {
    _key: NodeKey;
    _type: TAGS;
    _parentKey?: NodeKey | null;

    constructor(key: NodeKey, type: TAGS, parentKey?: NodeKey | null) {
        this._key = key;
        this._type = type;
        this._parentKey = parentKey;
    }

    // Основные методы, которые есть у всех узлов
    getType(): TAGS {
        return this._type;
    }
    getKey(): NodeKey {
        return this._key;
    }
    getDomElement(): HTMLElement {
        return getDOMElement(this._key);
    }
    getParent(): NodeKey | null | undefined {
        return this._parentKey;
    }
    setParent(parentKey: NodeKey): void {
        this._parentKey = parentKey;
    }

    // Методы с дефолтными реализациями
    canHasText(): boolean {
        return false;
    }
    getText(): string {
        return this.throwNotImplemented('getText');
    }
    updateText(_text: string): void {
        this.throwNotImplemented('updateText');
    }

    getChildren(): NodeKey[] {
        return this.throwNotImplemented('getChildren');
    }
    addChild(_child: NodeKey, _position?: number): void {
        this.throwNotImplemented('addChild');
    }
    removeChild(_key: NodeKey): void {
        this.throwNotImplemented('removeChild');
    }

    getStyle(): StyleProps {
        return this.throwNotImplemented('getStyle');
    }
    setStyle(_style: StyleProps): void {
        this.throwNotImplemented('setStyle');
    }
    getChildIndex(_key: NodeKey): number {
        return this.throwNotImplemented('getChildIndex');
    }
    setHref(_href: string): void {
        this.throwNotImplemented('setHref');
    }
    setRange(_range: number): void {
        this.throwNotImplemented('setRange');
    }
    setTypeList(_tag: TAGS.OL | TAGS.UL): void {
        this.throwNotImplemented('setTypeList');
    }
    getChildType(): TAGS {
        this.throwNotImplemented('setTypeList');
    }
    setImageUrl(_imageUrl: string): void {
        this.throwNotImplemented('setImageUrl');
    }
    setAlt(_alt?: string): void {
        this.throwNotImplemented('setAlt');
    }
    getAlt(): string {this.throwNotImplemented('getAlt')};
    getWidth(): string {this.throwNotImplemented('getWidth')};
    getHeight(): string {this.throwNotImplemented('getHeight')};
    getSrc(): string {this.throwNotImplemented('getSrc')};
    getRange(): number | undefined {this.throwNotImplemented('getRange')}
    getHref():string{this.throwNotImplemented('')}

    // Остальные методы с дефолтными реализациями
    protected throwNotImplemented(method: string): never {
        throw new Error(`Method ${method} not implemented in ${this.constructor.name}`);
    }

    // Абстрактные методы, которые должны быть реализованы
    public abstract render(): HTMLElement;
    public abstract clone(key?: string): LexicalNode;
}
