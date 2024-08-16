import { NodeKeyType } from '../../components/nodes/Nodes.types';

export interface IEditorCommandContextProps {
    addParagraph: (elKey: NodeKeyType, parant: NodeKeyType) => void;
    addDivRoot: () => void;
}
