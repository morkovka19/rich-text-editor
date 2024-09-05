/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, createContext, useEffect } from 'react';
import { FC, ReactNode, useCallback, useMemo, useState } from 'react';

import { IEditorState } from '../../components/EditorState/EditorState.types';
import { createInitialNodeMap } from '../../components/EditorState/getInitialState';
import { ContentNodeType, LineBreakNodeType } from '../../components/nodes/Nodes.types';
import { isContentNodeType, isRootNodeType } from '../../components/nodes/scripts';
import { parentNodesTags } from '../../helpers/constants';
import { generateKey } from '../../helpers/generateKey';
import { initialScript } from '../../scripts/initialScript';
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
        selection: null,
        flushSync: false,
        readOnly: false,
    });

    const { addNodeToState, updateNodeToState } = useEditorState();
    const { updateContent, addDOMNode, setFocus } = useDOMState();

    useEffect(() => {
        initialScript();
    }, []);

    const removeNode = useCallback((key: string) => {
        setState(prevState => {
            const newMap = new Map(prevState.nodeMap);
            const node = newMap.get(key);
            if (node && !isRootNodeType(node)) {
                const parentNode = newMap.get(node?.parent);
                if (parentNode && !isContentNodeType(parentNode)) {
                    parentNode.children = parentNode.children.filter(childKey => childKey !== key);
                }
            }

            return {
                ...prevState,
                nodeMap: newMap,
            };
        });
    }, []);

    const handleInput = useCallback(
        (e: Event) => {
            const target = e.target as HTMLElement;
            const content = target.textContent || '';
            if (parentNodesTags.includes(target.tagName) && content !== '') {
                const key = generateKey();
                const node: ContentNodeType = {
                    key,
                    parent: target.id,
                    content,
                    type: 'p',
                    prev: null,
                    next: null,
                };
                updateContent(target.id, '');
                setState(prev => addNodeToState(prev, node));
                addDOMNode(node);
                updateContent(key, content);
            } else {
                setState(prev => updateNodeToState(prev, target.id, content));
                updateContent(target.id, content);
            }
        },
        [state.nodeMap]
    );

    const handleKeydown = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            const focusNode = window.getSelection()?.focusNode?.parentElement;
            const parentFocusNode = focusNode?.parentElement;
            if (parentFocusNode) {
                const parentKey = parentFocusNode.id;
                const key = generateKey();
                const lineBreakNode: LineBreakNodeType = {
                    prev: null,
                    next: null,
                    parent: parentKey,
                    type: 'br',
                    key,
                };
                setState(prev => addNodeToState(prev, lineBreakNode));
                addDOMNode(lineBreakNode);
                setFocus(parentKey);
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
    });

    const editorContextValue: IEditorContextProps = useMemo(
        () => ({
            state,
            setState,
            removeNode,
        }),
        [state, removeNode]
    );

    return <EditorContext.Provider value={editorContextValue}>{children}</EditorContext.Provider>;
};
