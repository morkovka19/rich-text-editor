import { IBaseSelection } from '../Selection/BaseSelection.types';
import { NodeMapType } from '../nodes/LexicalNode.types';

export interface IEditorState {
    nodeMap: NodeMapType;
    selection: IBaseSelection | null;
    flushSync: boolean;
    readOnly: boolean;
}
