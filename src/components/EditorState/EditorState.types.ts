import { IBaseSelection } from '../Selection/BaseSelection.types';
import { ContentNodeType, NodeMapType, ParentNodeType, RootNodeType } from '../nodes/Nodes.types';

export interface IEditorState {
    nodeMap: NodeMapType<ParentNodeType | RootNodeType | ContentNodeType>;
    selection: IBaseSelection | null;
    flushSync: boolean;
    readOnly: boolean;
}
