import { LexicalNode } from '../LexicalNode/LexicalNode';
import { TextNode } from '../LexicalNode/TextNode';

export class SelectionManager {
    public getSelection(): { startKey: string; startOffset: number; endKey: string; endOffset: number } | null {
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

    public setSelection(node: LexicalNode, offset: number) {
        console.log(node, offset);
        if (node && node instanceof TextNode) {
            const range = document.createRange();
            const element = node.getDomElement();
            range.setStart(element, offset);
            range.collapse(true);

            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    getDefSelection() {
        return window.getSelection();
    }
}
