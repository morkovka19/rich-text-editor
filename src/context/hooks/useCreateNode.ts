import { ContentNodeType, NodeKeyType } from '../../components/nodes/Nodes.types';
import { generateKey } from '../../helpers/generateKey';

type createContentNodeProps = {
    type: string;
    parent: NodeKeyType;
    children?: NodeKeyType[];
    content?: '';
};

export const useCreateNode = () => {
    const createContentNode = ({ type, parent, children = [], content = '' }: createContentNodeProps) => {
        const key = generateKey();
        const node: ContentNodeType = {
            key,
            type,
            parent,
            content,
            children,
        };
        return node;
    };

    return {
        createContentNode,
    };
};
