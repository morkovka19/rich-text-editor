import { mapForAddedNodes } from '../../helpers/constants';
import { generateKey } from '../../helpers/generateKey';
import { ChildType, NodeKeyType, ParentNode, TextNode } from '../../nodes';

type createTextNodeProps = {
    parent: NodeKeyType;
    text?: string;
};

type createParentNodeProps = {
    parent: NodeKeyType;
    type: string;
    children: Array<ChildType>;
};

type createLexicalNodeProps = createParentNodeProps & createTextNodeProps;

export const useCreateNode = () => {
    const createTextNode = ({ parent, text = '' }: createTextNodeProps) => {
        const node = new TextNode(parent, text);
        return node;
    };

    const createParentNode = ({ parent, children = [], type }: createParentNodeProps) => {
        const key = generateKey();
        const node = new ParentNode(key, type, parent, children);
        return node;
    };

    const createLexicalChildNode = ({ parent, children = [], type, text = '' }: createLexicalNodeProps) => {
        const childTag = mapForAddedNodes.get(type);
        if (childTag) {
            return createParentNode({ parent, children, type });
        }
        return createTextNode({ parent, text });
    };

    return {
        createTextNode,
        createParentNode,
        createLexicalChildNode,
    };
};
