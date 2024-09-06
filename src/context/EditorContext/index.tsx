/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, createContext, useEffect, useRef } from 'react';
import { FC, ReactNode, useCallback, useMemo, useState } from 'react';

import { IEditorState } from '../../components/EditorState/EditorState.types';
import { createInitialNodeMap } from '../../components/EditorState/getInitialState';
import { ContentNodeType, LineBreakNodeType } from '../../components/nodes/Nodes.types';
import { generateKey } from '../../helpers/generateKey';
import { initialScript } from '../../scripts/initialScript';
import { useCheckNodes } from '../hooks/useCheckNodes';
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

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const { addNodeToState, updateNodeToState, getFirstParentNode } = useEditorState();
    const { updateContent, addDOMNode } = useDOMState();
    const { checkContentNodes } = useCheckNodes();

    useEffect(() => {
        initialScript();
    }, []);

    const handleInput = useCallback(
        (e: Event) => {
            const target = e.target as HTMLElement;
            const content = target.textContent || '';
            updateContent(target.id);
            checkContentNodes(
                target.localName,
                target.id,
                content,
                (key: string, contentNew: string) => {
                    setState(prev => updateNodeToState(prev, key, contentNew));
                    updateContent(key, contentNew);
                },
                (keyParent: string, type: string) => {
                    const key = generateKey();
                    const node: ContentNodeType = {
                        key,
                        parent: keyParent,
                        content: '',
                        type,
                        children: [],
                    };
                    setState(prev => addNodeToState(prev, node));
                    addDOMNode(node);
                    return key;
                }
            );
        },
        [state.nodeMap]
    );

    const handleKeydown = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            const focusNode = window.getSelection()?.focusNode as HTMLElement;
            const parentNode = getFirstParentNode(focusNode.id, stateRef.current);
            if (parentNode) {
                const keyParent = generateKey();

                const node: ContentNodeType = {
                    key: keyParent,
                    content: '',
                    parent: parentNode?.key,
                    type: 'p',
                    children: [],
                };
                setState(prev => addNodeToState(prev, node));
                addDOMNode(node);
                const keyLineBreak = generateKey();

                const nodeLineBreak: LineBreakNodeType = {
                    key: keyLineBreak,
                    parent: keyParent,
                    type: 'br',
                };
                setState(prev => addNodeToState(prev, nodeLineBreak));
                addDOMNode(nodeLineBreak);
            }
        }
    }, []);

    useEffect(() => {
        editor.current?.addEventListener('inputEditor', handleInput);
        return () => editor.current?.removeEventListener('inputEditor', handleInput);
    }, []);

    useEffect(() => {
        editor.current?.addEventListener('keydown', handleKeydown, false);
        return () => editor.current?.removeEventListener('keydown', handleKeydown);
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
