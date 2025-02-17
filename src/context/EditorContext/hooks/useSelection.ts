import { canHasThisChild } from '../../../helpers/canHasThisChild';
import { isBlockParenTagType, isParentTagType } from '../../../helpers/checkTypeTag';

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
        range?.selectNodeContents(node);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const collapseSelectionToStart = (node: Node) => {
        const sel = getSelection();
        const range = getRange();
        if (node) {
            range?.selectNodeContents(node);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    const collapseSelectionToEnd = (node: Node) => {
        const sel = getSelection();
        const range = getRange();
        range?.selectNodeContents(node);
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

    const getFirstParentNode = (focusNode: HTMLElement) => {
        if (isBlockParenTagType(focusNode?.localName)) {
            return focusNode;
        }
        if (isParentTagType(focusNode?.localName) && focusNode.parentNode) {
            return focusNode.parentNode as HTMLElement;
        }
        return getFirstParentNode(focusNode?.parentElement as HTMLElement);
    };

    const getFirstParentNodeForTag = (focusNode: HTMLElement, tag: string) => {
        if (canHasThisChild(focusNode.localName, tag)) return focusNode;
        return getFirstParentNodeForTag(focusNode.parentNode as HTMLElement, tag);
    };

    const setSelAfterEnter = (tag?: string) => {
        const selection = getSelection();
        const focusNode = (
            selection?.focusNode?.nodeName === '#text' ? selection.focusNode.parentElement : selection?.focusNode
        ) as HTMLElement;
        const firstNode = tag ? getFirstParentNodeForTag(focusNode, tag) : getFirstParentNode(focusNode);
        collapseSelectionToEnd(firstNode);
        return {
            firstNode,
            focusNode,
        };
    };

    const selection = getSelection();

    return {
        setSelectionRange,
        setSelectionToNode,
        collapseSelectionToStart,
        collapseSelectionToEnd,
        getSelectedText,
        getSelection,
        clearSelection,
        setSelAfterEnter,
        selection,
    };
};
