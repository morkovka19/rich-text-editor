import { TAGS } from '../../utils/constants';
import DecorateNode from './DecorateNode';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

class ImageNode extends DecorateNode {
    private _tag: string;
    private _imageUrl?: string;
    private _width?: string;
    private _height?: string;
    protected _alt?: string;

    getAlt(): string {
        return this._alt || ''
    }

    getWidth(): string {
        return this._width || ''
    }

    getHeight(): string {
        return this._height || ''
    }

    getSrc(){
        return this._imageUrl || '';
    }
    render(): HTMLElement {
        const img = document.createElement('img');
        img.src = this._imageUrl || '';
        img.id = this.getKey();
        img.contentEditable = 'false';

        if (this._width) img.style.width = this._width;
        if (this._height) img.style.height = this._height;
        if (this._alt) img.alt = this._alt;
        return img;
    }

    public canHasText(): boolean {
        return false;
    }
    public clone(key?: string): LexicalNode {
        const node = new ImageNode(key || this._key, this._type, this._tag);
        node.setAlt(this._alt);
        node.setHeight(this._height || '');
        node.setWidth(this._width || '');
        node.setHref(this._imageUrl || '');
        return node;
    }
    constructor(key: NodeKey, type: TAGS, tag: string) {
        super(key, type);
        this._tag = tag;
    }

    setImageUrl(imageUrl: string) {
        this._imageUrl = imageUrl;
    }

    getImageUrl() {
        return this._imageUrl || '';
    }

    setWidth(width: string) {
        this._width = width;
    }

    setHeight(height: string) {
        this._height = height;
    }

    setAlt(alt?: string) {
        this._alt = alt;
    }
}

export default ImageNode;
