/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, createContext, useEffect, useRef } from 'react';
import { FC, ReactNode, useMemo, useState } from 'react';

import { LexicalNode } from '../../nodes';
import { initialScript } from '../../scripts/initialScript';
import { TAGS } from '../../types';
import { IEditorState } from '../EditorState/EditorState.types';
import { createInitialNodeMap } from '../EditorState/getInitialState';
import { useCheckNodes } from '../hooks/useCheckNodes';
import { useCreateNode } from '../hooks/useCreateNode';
import { useDOMState } from '../hooks/useDOMState';
import { useEditorState } from '../hooks/useEditorState';
import { IEditorContextProps } from './EditorContext.types';

export const EditorContext = createContext<IEditorContextProps | undefined>(undefined);

export const EditorProvider: FC<{
    children: ReactNode;
    editor: RefObject<HTMLDivElement>;
}> = ({ children, editor }) => {
    const [state, setState] = useState<IEditorState>({
        nodeMap: new Map(createInitialNodeMap()),
    });

    const stateRef = useRef(state);
    stateRef.current = state;

    const { addNodeToState, getFirstParentNode, removeNode, addTextNodeToState } = useEditorState();
    const { updateContent, addDOMNode, removeDOMNode, setSel, createTextDONNode } = useDOMState();
    const { checkContentNodes } = useCheckNodes();
    const { createTextNode, createLexicalChildNode } = useCreateNode();

    useEffect(() => {
        initialScript();
    }, []);

    const handleInput = (e: Event) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const text = target.textContent as string;
        checkContentNodes({
            type: target.localName,
            keyParent: target.id,
            text,
            callbackUpdate: (key: string) => {
                const node = state.nodeMap.get(key);
                const textNodes = node?.getTextChild();
                if (textNodes && textNodes.length > 0) {
                    textNodes[0]?.setText(text);
                    updateContent(key, text);
                } else {
                    const newTextNode = createTextNode({ parent: key, text: text });
                    addTextNodeToState(state, newTextNode);
                    createTextDONNode(key, text);
                }
            },
            callbackAddNode: (keyParent: string, type: string) => {
                updateContent(target.id);
                const node = createLexicalChildNode({
                    parent: keyParent,
                    type,
                    children: [],
                });
                addNodeToState(stateRef.current, node);
                addDOMNode(node);
                return node.getKey();
            },
        });
    };

    const handleKeydown = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'Enter': {
                e.preventDefault();
                const focusNode = window.getSelection()?.focusNode as HTMLElement;
                const firstParentNode = getFirstParentNode(focusNode.id, stateRef.current);
                if (firstParentNode.key) {
                    const node = createLexicalChildNode({
                        parent: firstParentNode?.key,
                        type: TAGS.PARAGRAPH,
                        children: [],
                    });
                    addNodeToState(stateRef.current, node);
                    addDOMNode(node as LexicalNode, firstParentNode.child);
                }
                break;
            }
            case 'Backspace': {
                e.preventDefault();
                const focusNode = window.getSelection()?.focusNode as HTMLElement;
                if (focusNode.textContent?.length !== 0) {
                    const content = focusNode.textContent?.slice(0, -1) || '';
                    updateContent(focusNode.id, content);
                } else {
                    setState(prev => removeNode(prev, focusNode.id));
                    removeDOMNode(focusNode.id);
                }
                break;
            }
            default: {
                break;
            }
        }
    };

    const handleClick = (e: Event) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        target.focus();
        setSel(target);
    };

    useEffect(() => {
        editor.current?.addEventListener('inputEditor', handleInput);
        return () => editor.current?.removeEventListener('inputEditor', handleInput);
    }, []);

    useEffect(() => {
        editor.current?.addEventListener('keydown', handleKeydown, false);
        return () => editor.current?.removeEventListener('keydown', handleKeydown);
    }, []);

    useEffect(() => {
        editor.current?.addEventListener('click', handleClick);
        return () => editor.current?.removeEventListener('click', handleClick);
    }, []);

    const editorContextValue: IEditorContextProps = useMemo(
        () => ({
            state,
            setState,
        }),
        [state]
    );

    return <EditorContext.Provider value={editorContextValue}>{children}</EditorContext.Provider>;
};
