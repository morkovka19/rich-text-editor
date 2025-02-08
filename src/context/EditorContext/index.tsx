/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, createContext, useCallback, useEffect, useRef } from 'react';
import { FC, ReactNode, useMemo, useState } from 'react';

import { IEditorState } from '../../components/Editor/EditorState/EditorState.types';
import { createInitialNodeMap } from '../../components/Editor/EditorState/getInitialState';
import { NodeKeyType, Text } from '../../nodes';
import { initialScript } from '../../scripts/initialScript';
import { IEditorContextProps } from './EditorContext.types';
import { useCheckNodes } from './hooks/useCheckNodes';
import { useCreateNode } from './hooks/useCreateNode';
import { useDOMState } from './hooks/useDOMState';
import { useEditorState } from './hooks/useEditorState';
import { HistoryTypeEnum, IHistoryQueueItem, useHistory } from './hooks/useHistory';
import { useSelection } from './hooks/useSelection';
import useStyle from './hooks/useStyle';

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

    useEffect(() => {
        initialScript();
    }, []);

    // state
    const { addNodeToState, removeNode, updateTextNode, updateStyleNode } = useEditorState();

    // DOM
    const { updateContent, addDOMNode, removeDOMNode, updateStyleDOMNode, getDOMNode, getLastTextChild } =
        useDOMState();

    // check node
    const { checkContentNodes } = useCheckNodes();

    // create node
    const { createLexicalChildNode } = useCreateNode();

    // selection
    const { setSelectionRange, collapseSelectionToEnd, setSelAfterEnter, getSelection } = useSelection();

    // history
    const { isUndoDisabled, isRedoDisabled, undo, addToHistoryNotText, redo, history, addToHistoryText } = useHistory();

    // style
    const { styleRef, getStyleStr } = useStyle();

    /**
     * state
     */

    /**
     * style
     */

    const setStyleLocal = useCallback(
        (key: NodeKeyType) => {
            updateStyleNode(state, styleRef.current, key);
            updateStyleDOMNode(key, getStyleStr());
        },
        [styleRef.current.font]
    );

    /**
     * selection event
     */
    useEffect(() => {
        const selection = getSelection();
        const { focusOffset, anchorOffset } = selection;
        if (focusOffset !== anchorOffset) {
            const focusNode = selection.focusNode as HTMLElement;
            const key = focusNode?.id;
            const nodeDOM = getDOMNode(key);
            setSelectionRange(nodeDOM, 1, nodeDOM, 1);
            setStyleLocal(key);
        }
    }, [getSelection]);

    /**
     * history event
     */
    useEffect(() => {
        const actualState = history.historyQueue[history.index - 1];

        if (actualState) {
            const { type } = actualState;
            switch (type) {
                case HistoryTypeEnum.TEXT: {
                    const text =
                        history.side === 'undo'
                            ? String(actualState.lastState?.lastText)
                            : String(actualState.lastState?.newText);
                    updateContent(actualState.key, String(text));
                    updateTextNode(actualState.key, String(text), state);
                    break;
                }
                case HistoryTypeEnum.BLOCK: {
                    const { key, parentKey } = actualState.lastState;
                    const node = document.getElementById(key);
                    if (node) {
                        if (history.side === 'undo') {
                            removeDOMNode(key);
                            removeNode(stateRef.current, key);
                        } else {
                            const node = createLexicalChildNode({
                                parent: parentKey,
                                type,
                                children: [],
                            });
                            addDOMNode(node);
                            addNodeToState(stateRef.current, node);
                        }
                    }
                    break;
                }
                case HistoryTypeEnum.REMOVE_BLOCK: {
                    const { key, parentKey } = actualState.lastState;
                    const node = document.getElementById(key);
                    if (node) {
                        if (history.side === 'undo') {
                            const node = createLexicalChildNode({
                                parent: parentKey,
                                type,
                                children: [],
                            });
                            addDOMNode(node);
                            addNodeToState(stateRef.current, node);
                        } else {
                            removeDOMNode(key);
                            removeNode(stateRef.current, key);
                        }
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }, [history.index, history.historyQueue, state]);

    const handleInput = (e: Event) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const text = target.textContent as string;
        checkContentNodes({
            type: target.localName,
            keyParent: target.id,
            text,
            callbackUpdate: (key: string) => {
                const node = state.nodeMap.get(key) as Text;
                const lastText = node.getText();
                // DOM
                updateContent(node.getKey(), text);
                // selection
                const nodeElement = getDOMNode(node.getKey());
                collapseSelectionToEnd(nodeElement);
                // state
                updateTextNode(node.getKey(), text, stateRef.current);
                // history
                const historyItem: IHistoryQueueItem = {
                    type: HistoryTypeEnum.TEXT,
                    key: node.getKey(),
                    lastState: {
                        lastText,
                        newText: text,
                    },
                };
                addToHistoryText(historyItem);
            },
            callbackAddNode: (keyParent: string, type: string) => {
                // DOM
                updateContent(keyParent);
                const node = createLexicalChildNode({
                    parent: keyParent,
                    type,
                    children: [],
                });
                const nodeElement = addDOMNode(node) as HTMLElement;
                // selection
                collapseSelectionToEnd(nodeElement);
                // state
                addNodeToState(stateRef.current, node);
                // history
                const historyItem: IHistoryQueueItem = {
                    type: HistoryTypeEnum.BLOCK,
                    key: node.getKey(),
                    lastState: {
                        parentKey: keyParent,
                    },
                };
                addToHistoryNotText(historyItem);
                return node.getKey();
            },
        });
    };

    const handleKeydown = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'Enter': {
                e.preventDefault();
                const { firstNode: parent, focusNode } = setSelAfterEnter();
                // DOM
                const node = createLexicalChildNode({
                    parent: parent.id,
                    children: [],
                    type: parent.firstElementChild?.localName as string,
                });
                const nodeElement = addDOMNode(node, focusNode.id) as HTMLElement;
                // selection
                collapseSelectionToEnd(nodeElement);
                // state
                addNodeToState(stateRef.current, node, focusNode.id);
                // history
                const historyState: IHistoryQueueItem = {
                    type: HistoryTypeEnum.BLOCK,
                    key: node.getKey(),
                    lastState: {
                        type: node.getType(),
                        parentKey: node.getParent(),
                    },
                };
                addToHistoryNotText(historyState);
                break;
            }
            case 'Backspace': {
                e.preventDefault();
                const selection = getSelection();
                const { focusNode, anchorOffset, focusOffset } = selection;
                const textNode = getLastTextChild(focusNode as HTMLElement);
                const range = anchorOffset - focusOffset;
                if (textNode) {
                    const { parentElement } = textNode;
                    const parentId = parentElement?.id;
                    const newContent = textNode.textContent?.slice(0, textNode.textContent.length - (range || 1));
                    if (parentId) {
                        // DOM
                        updateContent(parentId, newContent);
                        // selection
                        collapseSelectionToEnd(parentElement);
                        // state
                        updateTextNode(parentId, newContent || '', stateRef.current);
                        // history
                        const historyItem: IHistoryQueueItem = {
                            key: parentId,
                            type: HistoryTypeEnum.TEXT,
                            lastState: {
                                newText: newContent,
                                lastText: textNode.textContent,
                            },
                        };
                        addToHistoryText(historyItem);
                    }
                } else {
                    const key = (focusNode as HTMLElement).id;
                    const parentNode = focusNode?.parentNode as HTMLElement;
                    const lastTextNode = getLastTextChild(parentNode);
                    // DOM
                    removeDOMNode(key);
                    // selection
                    if (lastTextNode) {
                        collapseSelectionToEnd(lastTextNode);
                    } else {
                        collapseSelectionToEnd(parentNode.lastChild as HTMLElement);
                    }
                    // state
                    removeNode(stateRef.current, key);
                    // history
                    const historyItem: IHistoryQueueItem = {
                        key,
                        type: HistoryTypeEnum.REMOVE_BLOCK,
                        lastState: {
                            parentKey: parentNode?.id,
                        },
                    };
                    addToHistoryNotText(historyItem);
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
        const { anchorOffset } = getSelection();
        const target = e.target as HTMLElement;
        // selection
        setSelectionRange(target.lastChild || target, anchorOffset, target.lastChild || target, anchorOffset);
    };

    // listeners
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
            undo,
            redo,
            isUndoDisabled,
            isRedoDisabled,
        }),
        [state, undo, redo, isUndoDisabled, isRedoDisabled]
    );

    return <EditorContext.Provider value={editorContextValue}>{children}</EditorContext.Provider>;
};
