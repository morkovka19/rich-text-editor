import { mapForAddedNodes } from '../../../helpers/constants';
import { generateKey } from '../../../helpers/generateKey';
import { ChildType, Node, NodeKeyType, Text } from '../../../nodes';

type createTextProps = {
    parent: NodeKeyType;
    text?: string;
};

type createNodeProps = {
    parent: NodeKeyType;
    type: string;
    children: Array<ChildType>;
};

type createLexicalNodeProps = createNodeProps & createTextProps;

export const useCreateNode = () => {
    const createText = ({ parent, text = '' }: createTextProps) => {
        const key = generateKey();
        const node = new Text(parent, text, key);
        return node;
    };

    const createNode = ({ parent, children = [], type }: createNodeProps) => {
        const key = generateKey();
        const node = new Node(key, type, parent, children);
        return node;
    };

    const createLexicalChildNode = ({ parent, children = [], type, text = '' }: createLexicalNodeProps) => {
        const childTag = mapForAddedNodes.get(type);
        if (childTag) {
            return createNode({ parent, children, type });
        }
        return createText({ parent, text });
    };

    return {
        createText,
        createNode,
        createLexicalChildNode,
    };
};
