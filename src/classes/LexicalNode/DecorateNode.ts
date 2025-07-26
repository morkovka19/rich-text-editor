import { TAGS } from '../../utils/constants';
import { LexicalNode } from './LexicalNode';
import { NodeKey } from './types';

class DecorateNode extends LexicalNode {
    public render(): HTMLElement {
        throw new Error('Method not implemented.');
    }
    public clone(): LexicalNode {
        throw new Error('Method not implemented.');
    }

    public canHasText(): boolean {
        return false;
    }

    constructor(key: NodeKey, type: TAGS) {
        super(key, type);
        this._parentKey = 'root'
    }


}

export default DecorateNode;
