/* eslint-disable @typescript-eslint/no-explicit-any */

export class SelectionManager {
    public getSelection(): {
        startKey: string;
        startOffset: number;
        endKey: string;
        endOffset: number;
    } | null {
        const selection = this.getDefSelection();
        if (!selection || selection.rangeCount === 0) return null;

        const range = selection.getRangeAt(0);
        const startNode = range.startContainer as HTMLElement;
        const endNode = range.endContainer as HTMLElement;

        return {
            startKey: startNode.dataset.nodeId || '',
            startOffset: range.startOffset,
            endKey: endNode.dataset.nodeId || '',
            endOffset: range.endOffset,
        };
    }

    public setSelection(node: any, offset: number) {
        const newRange = document.createRange();
        newRange.setStart(node, offset);
        newRange.collapse(true);
        this.getDefSelection()?.removeAllRanges();
        this.getDefSelection()?.addRange(newRange);
    }

    getDefSelection() {
        return window.getSelection();
    }
}
