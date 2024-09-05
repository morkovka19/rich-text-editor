import { useCallback } from 'react';

import { LexicalNodeType, NodeKeyType } from '../../components/nodes/Nodes.types';
import { isRootNodeType } from '../../components/nodes/scripts';

export const useDOMState = () => {
    const setSel = useCallback((node: HTMLElement) => {
        const sel = window.getSelection();
        console.log(sel);
        if (sel?.focusNode?.nodeName !== '#text') sel?.collapse(node, node.innerText.length);
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
                parent?.appendChild(child);
                child.focus();
                setSel(child);
            }
        },
        [setSel]
    );

    const removeDOMNode = useCallback(() => {}, []);

    const updateContent = useCallback(
        (key: NodeKeyType, content?: string) => {
            const updatedElement = document.getElementById(key) as HTMLElement;
            updatedElement.textContent = content || '';
            setSel(updatedElement);
        },
        [setSel]
    );

    return {
        addDOMNode,
        removeDOMNode,
        updateContent,
        setFocus,
    };
};
