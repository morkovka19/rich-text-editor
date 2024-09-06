import { useCallback } from 'react';

import { LexicalNodeType, NodeKeyType } from '../../components/nodes/Nodes.types';
import { isContentNodeType, isRootNodeType } from '../../components/nodes/scripts';

export const useDOMState = () => {
    const setSel = useCallback((node: HTMLElement) => {
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        sel?.removeAllRanges();
        sel?.addRange(range);
        sel?.collapseToEnd();
        sel?.addRange(range);
    }, []);

    const setFocus = useCallback(
        (key: NodeKeyType) => {
            const node = document.getElementById(key);
            if (node) setSel(node);
        },
        [setSel]
    );

    const addDOMNode = useCallback(
        (node: LexicalNodeType) => {
            if (!isRootNodeType(node)) {
                const parent = document.getElementById(node.parent);
                const child = document.createElement(node.type);
                child.id = node.key;
                if (isContentNodeType(node) && node.content) child.textContent = node.content;
                parent?.appendChild(child);

                if (parent) {
                    child.focus();
                    setSel(parent);
                }
            }
        },
        [setSel]
    );

    const removeDOMNode = useCallback(() => {}, []);

    const updateContent = useCallback(
        (key: NodeKeyType, content?: string) => {
            const updatedElement = document.getElementById(key) as HTMLElement;
            updatedElement.textContent = content || '';
            setFocus(key);
        },
        [setFocus]
    );

    return {
        addDOMNode,
        removeDOMNode,
        updateContent,
        setFocus,
    };
};
