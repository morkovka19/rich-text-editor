/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, createContext, useEffect, useRef } from 'react';
import { FC, ReactNode, useMemo, useState } from 'react';

import { IEditorState } from '../../components/Editor/EditorState/EditorState.types';
import { createInitialNodeMap } from '../../components/Editor/EditorState/getInitialState';
import { TEXT_KEY } from '../../helpers/constants';
import { initialScript } from '../../scripts/initialScript';
import { IEditorContextProps } from './EditorContext.types';
import { useCheckNodes } from './hooks/useCheckNodes';
import { useCreateNode } from './hooks/useCreateNode';
import { useDOMState } from './hooks/useDOMState';
import { useEditorState } from './hooks/useEditorState';
import { HistoryTypeEnum, IHistoryQueueItem, useHistory } from './hooks/useHistory';
import { useSelection } from './hooks/useSelection';

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
    const { setSelectionRange, collapseSelectionToEnd, setSelAfterEnter, getSelection } = useSelection();

    const { isUndoDisabled, isRedoDisabled, addToHistoryText, undo, addToHistoryNotText, redo, history } = useHistory();

    useEffect(() => {
        initialScript();
    }, []);

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
                    updateTextNode(actualState.key, '', String(text), state);
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
                const stateHistory = {
                    type: HistoryTypeEnum.TEXT,
                    key,
                    lastState: {
                        newText: text,
                        lastText: texts?.reduce((str, cur) => `${str}${cur.getText()}`, '') || '',
                    },
                };
                addToHistoryText(stateHistory);
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
                const historyState: IHistoryQueueItem = {
                    type: HistoryTypeEnum.BLOCK,
                    key: node.getKey(),
                    lastState: {
                        type: node.getType(),
                        parentKey: node.getParent(),
                    },
                };
                addToHistoryNotText(historyState);
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
                const focusNode = selection.focusNode as HTMLElement;
                const content = focusNode.nodeValue || focusNode.textContent || '';
                const updatedNode = focusNode.parentElement!;
                if (focusNode.nodeName === TEXT_KEY) {
                    const { focusOffset, anchorOffset } = selection;
                    const minOffset = Math.min(focusOffset, anchorOffset);
                    const maxOffset = Math.max(focusOffset, anchorOffset);
                    const isRange = minOffset !== maxOffset;
                    if (minOffset === 0 && !isRange && content.length) {
                        const newFocusNode = updatedNode.previousElementSibling!;
                        const prevContent = newFocusNode.textContent || '';
                        updateTextNode(newFocusNode.id, prevContent, `${prevContent}${content}`, stateRef.current);
                        updateContent(newFocusNode.id, `${prevContent}${content}`);
                        removeDOMNode(updatedNode.id);
                        removeNode(stateRef.current, updatedNode.id);
                        const selPosition = newFocusNode.textContent
                            ? newFocusNode.textContent.length - content.length
                            : 0;
                        setSelectionRange(newFocusNode.firstChild!, selPosition, newFocusNode.firstChild!, selPosition);
                    } else {
                        const newContent = !isRange
                            ? content.slice(0, minOffset - 1)
                            : content.slice(0, minOffset) + content.slice(maxOffset + 1);

                        updateContent(updatedNode.id, newContent);
                        updateTextNode(updatedNode.id, content, newContent, stateRef.current);
                        setSelectionRange(
                            updatedNode.lastChild || updatedNode,
                            isRange ? minOffset : minOffset - 1,
                            updatedNode.lastChild || updatedNode,
                            isRange ? minOffset : minOffset - 1
                        );
                    }
                } else {
                    collapseSelectionToEnd(
                        focusNode.previousElementSibling!.lastChild || focusNode.previousElementSibling!
                    );
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

        const { anchorOffset } = getSelection();
        const target = e.target as HTMLElement;
        setSelectionRange(target.lastChild || target, anchorOffset, target.lastChild || target, anchorOffset);
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
            undo,
            redo,
            isUndoDisabled,
            isRedoDisabled,
        }),
        [state, undo, redo, isUndoDisabled, isRedoDisabled]
    );

    return <EditorContext.Provider value={editorContextValue}>{children}</EditorContext.Provider>;
};
