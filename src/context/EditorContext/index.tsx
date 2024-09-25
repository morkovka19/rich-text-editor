/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, createContext, useEffect, useRef } from 'react';
import { FC, ReactNode, useMemo, useState } from 'react';

import { TEXT_KEY } from '../../helpers/constants';
import { initialScript } from '../../scripts/initialScript';
import { IEditorState } from '../EditorState/EditorState.types';
import { createInitialNodeMap } from '../EditorState/getInitialState';
import { useCheckNodes } from '../hooks/useCheckNodes';
import { useCreateNode } from '../hooks/useCreateNode';
import { useDOMState } from '../hooks/useDOMState';
import { useEditorState } from '../hooks/useEditorState';
import { useSelection } from '../hooks/useSelection';
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

    const { addNodeToState, removeNode, addTextToState, updateTextNode } = useEditorState();
    const { updateContent, addDOMNode, removeDOMNode, createTextDONNode } = useDOMState();
    const { checkContentNodes } = useCheckNodes();
    const { createText, createLexicalChildNode } = useCreateNode();
    const {
        // setSelectionRange,
        // setSelectionToNode,
        // collapseSelectionToStart,
        collapseSelectionToEnd,
        setSelAfterEnter,
        getSelection,
        // getSelectedText,
        // clearSelection,
    } = useSelection();

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
                const texts = node?.getTextChild();
                if (texts && texts.length > 0) {
                    const stateNode = texts[texts.length - 1];
                    stateNode?.setText(text);
                    updateContent(key, text);
                } else {
                    const newText = createText({ parent: key, text: text });
                    addTextToState(stateRef.current, newText);
                    updateContent(key, '');
                    const node = createTextDONNode(key, text);
                    collapseSelectionToEnd(node);
                }
            },
            callbackAddNode: (keyParent: string, type: string) => {
                updateContent(keyParent);
                const node = createLexicalChildNode({
                    parent: keyParent,
                    type,
                    children: [],
                });
                updateContent(keyParent);
                addNodeToState(stateRef.current, node);
                const nodeElement = addDOMNode(node) as HTMLElement;
                collapseSelectionToEnd(nodeElement);
                return node.getKey();
            },
        });
    };

    const handleKeydown = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'Enter': {
                e.preventDefault();
                const { firstNode: parent, focusNode } = setSelAfterEnter();
                const node = createLexicalChildNode({
                    parent: parent.id,
                    children: [],
                    type: parent.firstElementChild?.localName as string,
                });
                addNodeToState(stateRef.current, node, focusNode.id);
                const nodeElement = addDOMNode(node, focusNode.id) as HTMLElement;
                collapseSelectionToEnd(nodeElement);
                break;
            }
            case 'Backspace': {
                e.preventDefault();
                const selection = getSelection();
                console.log(selection);
                const focusNode = selection.focusNode as HTMLElement;
                if (focusNode.textContent?.length !== 0) {
                    const prevContent = focusNode.textContent!;
                    const content = focusNode.textContent?.slice(0, -1) || '';
                    const updatedNode = focusNode.nodeName === TEXT_KEY ? focusNode.parentElement! : focusNode;
                    updateContent(updatedNode.id, content);
                    collapseSelectionToEnd(updatedNode);
                    updateTextNode(updatedNode.id, prevContent, content, stateRef.current);
                } else {
                    collapseSelectionToEnd(focusNode.previousElementSibling!);
                    removeDOMNode(focusNode.id);
                    removeNode(stateRef.current, focusNode.id);
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
        collapseSelectionToEnd(target);
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
