/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, createContext, useEffect, useRef } from 'react';
import { FC, ReactNode, useMemo, useState } from 'react';

import { IEditorState } from '../../components/EditorState/EditorState.types';
import { createInitialNodeMap } from '../../components/EditorState/getInitialState';
import { initialScript } from '../../scripts/initialScript';
import { TAGS } from '../../types';
import { useCheckNodes } from '../hooks/useCheckNodes';
import { useCreateNode } from '../hooks/useCreateNode';
import { useDOMState } from '../hooks/useDOMState';
import { useEditorState } from '../hooks/useEditorState';
import { IEditorContextProps } from './EditorContext.types';

export const EditorContext = createContext<IEditorContextProps | undefined>(undefined);

export const EditorProvider: FC<{ children: ReactNode; editor: RefObject<HTMLDivElement> }> = ({
    children,
    editor,
}) => {
    const [state, setState] = useState<IEditorState>({
        nodeMap: new Map(createInitialNodeMap()),
    });

    const stateRef = useRef(state);
    stateRef.current = state;

    const { addNodeToState, updateNodeToState, getFirstParentNode, removeNode } = useEditorState();
    const { updateContent, addDOMNode, removeDOMNode, setSel } = useDOMState();
    const { checkContentNodes } = useCheckNodes();
    const { createContentNode } = useCreateNode();

    useEffect(() => {
        initialScript();
    }, []);

    const handleInput = (e: Event) => {
        const target = e.target as HTMLElement;
        const content = target.textContent;

        if (content) {
            checkContentNodes({
                type: target.localName,
                keyParent: target.id,
                content,
                callbackUpdate: (key: string, contentNew: string) => {
                    setState(prev => updateNodeToState(prev, key, contentNew));
                    updateContent(key, contentNew);
                },
                callbackAddNode: (keyParent: string, type: string) => {
                    updateContent(target.id);
                    const node = createContentNode({ parent: keyParent, type });
                    setState(prev => addNodeToState(prev, node));
                    addDOMNode(node);
                    return node.key;
                },
            });
        }
    };

    const handleKeydown = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'Enter': {
                e.preventDefault();
                const focusNode = window.getSelection()?.focusNode as HTMLElement;
                const firstParentNode = getFirstParentNode(focusNode.id, stateRef.current);
                if (firstParentNode.key) {
                    const node = createContentNode({ parent: firstParentNode?.key, type: TAGS.PARAGRAPH });
                    setState(prev => addNodeToState(prev, node, firstParentNode.child));
                    addDOMNode(node, firstParentNode.child);
                }
                break;
            }
            case 'Backspace': {
                e.preventDefault();
                const focusNode = window.getSelection()?.focusNode as HTMLElement;
                if (focusNode.textContent?.length !== 0) {
                    const content = focusNode.textContent?.slice(0, -1) || '';
                    setState(prev => updateNodeToState(prev, focusNode.id, content));
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
