import { parentNodesTags } from '../../helpers/constants';
import { getAddedNodeType } from '../../helpers/getAddedNodeType';

export const useCheckNodes = () => {
    const checkContentNodes = (
        type: string,
        keyParent: string,
        content: string,
        callbackUpdate: (key: string, contentNew: string) => void,
        callbackAddNode: (keyParent: string, type: string) => string
    ) => {
        if (parentNodesTags.includes(type)) {
            const newType = getAddedNodeType(type);
            const newKey = callbackAddNode(keyParent, newType);

            checkContentNodes(newType, newKey, content, callbackUpdate, callbackAddNode);
        } else {
            callbackUpdate(keyParent, content);
        }
    };

    return {
        checkContentNodes,
    };
};
