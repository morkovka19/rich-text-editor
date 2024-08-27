import { MAIN_DIV_ID } from '../../helpers/constants';
import { ContentNodeType, NodeMapType, ParentNodeType, RootNodeType } from '../nodes/Nodes.types';
import { IEditorState } from './EditorState.types';

export const createInitialNodeMap = () => {
    const map = new Map() as NodeMapType<ContentNodeType | ParentNodeType | RootNodeType>;
    const root: RootNodeType = {
        key: MAIN_DIV_ID,
        type: 'div',
        children: [],
        next: null,
        prev: null,
    };
    map.set(root.key, root);
    return map;
};

export const getIntialState = () =>
    ({
        nodeMap: new Map() as NodeMapType<ParentNodeType | ContentNodeType | RootNodeType>,
        selection: null,
        flushSync: false,
        readOnly: false,
    }) as IEditorState;
