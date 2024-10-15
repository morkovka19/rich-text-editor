import { isParentTagType } from '../../../helpers/checkTypeTag';
import { getAddedNodeType } from '../../../helpers/getAddedNodeType';

export type checkContentNodesProps = {
    type: string;
    keyParent: string;
    text: string;
    callbackUpdate: (key: string, contentNew: string) => void;
    callbackAddNode: (keyParent: string, type: string) => string;
};

export const useCheckNodes = () => {
    const checkContentNodes = ({ type, keyParent, text, callbackUpdate, callbackAddNode }: checkContentNodesProps) => {
        if (isParentTagType(type)) {
            const newType = getAddedNodeType(type);
            const newKey = callbackAddNode(keyParent, newType);
            checkContentNodes({ type: newType, keyParent: newKey, text, callbackUpdate, callbackAddNode });
        } else {
            callbackUpdate(keyParent, text);
        }
    };

    return {
        checkContentNodes,
    };
};
