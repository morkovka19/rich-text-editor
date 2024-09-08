import { isParentTagType } from '../../helpers/checkTypeTag';
import { getAddedNodeType } from '../../helpers/getAddedNodeType';

export type checkContentNodesProps = {
    type: string;
    keyParent: string;
    content: string;
    callbackUpdate: (key: string, contentNew: string) => void;
    callbackAddNode: (keyParent: string, type: string) => string;
};

export const useCheckNodes = () => {
    const checkContentNodes = ({
        type,
        keyParent,
        content,
        callbackUpdate,
        callbackAddNode,
    }: checkContentNodesProps) => {
        if (isParentTagType(type)) {
            const newType = getAddedNodeType(type);
            const newKey = callbackAddNode(keyParent, newType);

            checkContentNodes({ type: newType, keyParent: newKey, content, callbackUpdate, callbackAddNode });
        } else {
            callbackUpdate(keyParent, content);
        }
    };

    return {
        checkContentNodes,
    };
};
