import { NodeKeyType } from '../../components/nodes/Nodes.types';

export interface IDomCommandContextProps {
    createP: (elKey: NodeKeyType, parentKey: NodeKeyType) => void;
    createRootDiv: () => void;
}
