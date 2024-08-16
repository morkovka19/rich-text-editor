import { IEditorState } from '../../EditorState/EditorState.types';
import { NodeKeyType } from '../../nodes/Nodes.types';

export const addRoot = (
    state: IEditorState,
    addDivRoot: () => void,
    addParagraph: (elKey: NodeKeyType, parent: NodeKeyType) => void
) => {
    const stateNode = state.nodeMap.get('root');
    const root = document.createElement('div');
    root.id = stateNode?.key || '';
    const elKey = `node-${Date.now()}`;
    addDivRoot();
    addParagraph(elKey, 'root');
};
