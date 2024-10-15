import { isParentTagType } from '../../../helpers/checkTypeTag';
import { TEXT_KEY } from '../../../helpers/constants';

export const useSelection = () => {
    const getSelection = () => {
        const selection = window.getSelection() as Selection;
        return selection;
    };

    const getRange = () => {
        const range = document.createRange();
        return range;
    };

    const setSelectionRange = (startNode: Node, startOffset: number, endNode: Node, endOffset: number) => {
        const sel = getSelection();
        const range = getRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const setSelectionToNode = (node: Node) => {
        const sel = getSelection();
        const range = getRange();
        range.selectNodeContents(node);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const collapseSelectionToStart = (node: Node) => {
        const sel = getSelection();
        const range = getRange();
        range.selectNodeContents(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const collapseSelectionToEnd = (node: Node) => {
        const sel = getSelection();
        const range = getRange();
        range.selectNodeContents(node);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const getSelectedText = () => {
        const sel = getSelection();
        return sel.toString();
    };

    const clearSelection = () => {
        const sel = getSelection() as Selection;
        sel.removeAllRanges();
    };

    const getFirstNode = (focusNode: HTMLElement) => {
        if (isParentTagType(focusNode?.localName)) {
            return focusNode;
        }
        return getFirstNode(focusNode?.parentElement as HTMLElement);
    };

    const setSelAfterEnter = () => {
        const selection = getSelection();
        const focusNode = (
            selection?.focusNode?.nodeName === TEXT_KEY ? selection.focusNode.parentElement : selection?.focusNode
        ) as HTMLElement;
        const firstNode = getFirstNode(focusNode);
        collapseSelectionToEnd(firstNode);
        return {
            firstNode,
            focusNode,
        };
    };

    return {
        setSelectionRange,
        setSelectionToNode,
        collapseSelectionToStart,
        collapseSelectionToEnd,
        getSelectedText,
        getSelection,
        clearSelection,
        setSelAfterEnter,
    };
};
