/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, createContext, useCallback, useEffect, useRef } from 'react';
import { FC, ReactNode, useMemo, useState } from 'react';

import { IEditorState } from '../../components/Editor/EditorState/EditorState.types';
import { createInitialNodeMap } from '../../components/Editor/EditorState/getInitialState';
import { isParentTagType } from '../../helpers/checkTypeTag';
import { LexicalNode, NodeKeyType, Text } from '../../nodes';
import { initialScript } from '../../scripts/initialScript';
import { IEditorContextProps } from './EditorContext.types';
import { useCheckNodes } from './hooks/useCheckNodes';
import { useCreateNode } from './hooks/useCreateNode';
import { useDOMState } from './hooks/useDOMState';
import { useEditorState } from './hooks/useEditorState';
import { HistoryTypeEnum, IHistoryQueueItem, useHistory } from './hooks/useHistory';
import { useSelection } from './hooks/useSelection';
import useStyle, { StylePropType, initialStyle } from './hooks/useStyle';

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
    const { addNodeToState, removeNodeState, updateTextNode, updateStyleNode } = useEditorState();

    // DOM
    const { updateContent, addDOMNode, removeDOMNode, updateStyleDOMNode, getDOMNode, getLastTextChild } =
        useDOMState();

    // check node
    const { checkContentNodes } = useCheckNodes();

    // create node
    const { createLexicalChildNode } = useCreateNode();

    // selection
    const { setSelectionRange, collapseSelectionToEnd, setSelAfterEnter, getSelection, selection } = useSelection();

    // history
    const { isUndoDisabled, isRedoDisabled, undo, addToHistoryNotText, redo, history, addToHistoryText } = useHistory();

    // style
    const {
        styleRef,
        getStyleStr,
        updateFont,
        updateFontSize,
        updateColor,
        updateBackgroundColor,
        updateFontWeight,
        updateFontStyle,
        updateTextDecoration,
    } = useStyle();

    // helpers
    const setStyleNode = (key: NodeKeyType, lastStyle: string) => {
        const style = getStyleStr();
        // DOM
        updateStyleDOMNode(key, style);
        // state
        updateStyleNode(stateRef.current, styleRef.current, key);
        // history
        const historyItem: IHistoryQueueItem = {
            type: HistoryTypeEnum.STYLE,
            key,
            lastState: {
                last: lastStyle,
                new: style,
            },
        };
        addToHistoryNotText(historyItem);
    };

    const addNode = (parent: NodeKeyType, nodeType: string, isHistory: boolean, prevNode?: NodeKeyType) => {
        const node = createLexicalChildNode({
            parent: parent as NodeKeyType,
            type: nodeType,
            text: '',
            children: [],
        });
        // DOM
        const nodeElement = addDOMNode(node, prevNode) as Node;
        // state
        addNodeToState(stateRef.current, node);
        // style
        if (!isParentTagType(nodeType)) setStyleNode(node.getKey(), getStyleStr(node.getStyle() || styleRef.current));
        // selection
        setSelectionRange(nodeElement, 0, nodeElement, 0);
        collapseSelectionToEnd(nodeElement);
        if (!isHistory) {
            // history
            const historyItem: IHistoryQueueItem = {
                type: HistoryTypeEnum.BLOCK,
                key: node.getKey(),
                lastState: {
                    parent: node.getParent(),
                },
            };
            addToHistoryNotText(historyItem);
        }

        return node;
    };

    const updateNode = (key: NodeKeyType, text: string) => {
        const node = stateRef.current.nodeMap.get(key) as Text;
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
                last: lastText,
                new: text,
            },
        };
        addToHistoryText(historyItem);
    };

    const removeNode = (key: NodeKeyType, parentNode: HTMLElement, isHistory: boolean, lastTextNode?: Node) => {
        // DOM
        removeDOMNode(key);
        // selection
        if (lastTextNode) {
            collapseSelectionToEnd(lastTextNode);
        } else {
            collapseSelectionToEnd(parentNode.lastChild as HTMLElement);
        }
        // state
        removeNodeState(stateRef.current, key);
        if (!isHistory) {
            // history
            const historyItem: IHistoryQueueItem = {
                key,
                type: HistoryTypeEnum.REMOVE_BLOCK,
                lastState: {
                    parent: parentNode?.id,
                },
            };
            addToHistoryNotText(historyItem);
        }
    };

    const setStyle = useCallback(
        (value: string, type: StylePropType) => {
            switch (type) {
                case StylePropType.FONT_FAMILY: {
                    updateFont(value);
                    break;
                }
                case StylePropType.FONT_SIZE: {
                    updateFontSize(Number(value));
                    break;
                }
                case StylePropType.COLOR: {
                    updateColor(value);
                    break;
                }
                case StylePropType.BACKGROUND_COLOR: {
                    updateBackgroundColor(value);
                    break;
                }
                case StylePropType.FONT_WEIGHT: {
                    updateFontWeight(Number(value));
                    break;
                }
                case StylePropType.FONT_STYLE: {
                    updateFontStyle(value);
                    break;
                }
                case StylePropType.TEXT_DECORATION: {
                    updateTextDecoration(value);
                    break;
                }
                default:
                    break;
            }
            const { focusOffset, anchorOffset, focusNode } = selection;
            const parentNode = focusNode?.parentElement as HTMLElement;
            if (focusOffset === anchorOffset) {
                if (focusNode?.textContent) {
                    const parentStyleStr = getStyleStr((focusNode as HTMLElement).style);
                    if (parentStyleStr !== getStyleStr()) {
                        addNode(parentNode.id as NodeKeyType, focusNode.nodeName.toLocaleLowerCase(), false);
                    }
                } else {
                    const node = stateRef.current.nodeMap.get((focusNode as HTMLElement)?.id) as LexicalNode;
                    if (!isParentTagType(node?.getType()))
                        setStyleNode(node?.getKey(), getStyleStr(node?.getStyle() || initialStyle));
                }
            } else {
                setStyleNode(parentNode.id, getStyleStr(parentNode.style || initialStyle));
            }
        },
        [selection]
    );

    // selection event
    useEffect(() => {
        const { focusOffset, anchorOffset } = selection;
        if (focusOffset !== anchorOffset) {
            const focusNode = selection.focusNode as HTMLElement;
            const key = focusNode?.id;
            const nodeDOM = getDOMNode(key);
            setSelectionRange(nodeDOM, 0, nodeDOM, 0);
        }
    }, [selection]);

    // history event
    useEffect(() => {
        const actualState = history.historyQueue[history.index - 1];

        if (actualState) {
            const { type } = actualState;
            switch (type) {
                case HistoryTypeEnum.TEXT: {
                    const text =
                        history.side === 'undo'
                            ? String(actualState.lastState?.last)
                            : String(actualState.lastState?.new);
                    updateContent(actualState.key, String(text));
                    updateTextNode(actualState.key, String(text), stateRef.current);
                    break;
                }
                case HistoryTypeEnum.BLOCK: {
                    const { new: newKey, parent } = actualState.lastState;
                    const node = document.getElementById(newKey);
                    if (node) {
                        if (history.side === 'undo') {
                            removeDOMNode(newKey);
                            removeNodeState(stateRef.current, newKey);
                        } else {
                            addNode(parent || '', type, true);
                        }
                    }
                    break;
                }
                case HistoryTypeEnum.REMOVE_BLOCK: {
                    const parent = actualState.lastState.parent;
                    const newKey = actualState.lastState.new;
                    const node = document.getElementById(newKey);
                    if (node) {
                        if (history.side === 'undo') {
                            addNode(parent || '', type, true);
                        } else {
                            const parentNode = getDOMNode(parent || '');
                            removeNode(newKey, parentNode as HTMLElement, true);
                        }
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }, [history.index, history.historyQueue, stateRef.current]);

    // input
    const handleInput = useCallback(
        (e: Event) => {
            e.preventDefault();
            const { focusOffset, anchorOffset } = selection;
            const targetNode = e.target as HTMLElement;
            const textTargetNode = targetNode.textContent as string;
            const parent = targetNode.parentElement;
            const lastElement = parent?.lastChild as HTMLElement;
            // if parent has empty last child - update target
            const isNew =
                lastElement &&
                lastElement?.id !== targetNode.id &&
                !lastElement.textContent &&
                focusOffset === anchorOffset;
            const target = isNew ? lastElement : targetNode;
            const text = isNew ? textTargetNode[textTargetNode.length - 1] : textTargetNode;
            if (text !== textTargetNode) {
                updateNode(targetNode.id, textTargetNode.slice(0, textTargetNode.length - 1));
            }
            checkContentNodes({
                type: target.localName,
                keyParent: target.id,
                text,
                callbackUpdate: (key: string) => {
                    updateNode(key, text);
                },
                callbackAddNode: (keyParent: string, type: string) => {
                    updateContent(keyParent);
                    const node = addNode(keyParent, type, false);
                    return node.getKey();
                },
            });
        },
        [selection]
    );

    // keydown
    const handleKeydown = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'Enter': {
                e.preventDefault();
                const { firstNode: parent, focusNode } = setSelAfterEnter();
                addNode(parent.id, parent.firstElementChild?.localName as string, false, focusNode.id);
                break;
            }
            case 'Backspace': {
                e.preventDefault();
                const { focusNode, anchorOffset, focusOffset } = selection;
                const textNode = getLastTextChild(focusNode as HTMLElement);
                const range = anchorOffset - focusOffset;
                if (textNode) {
                    const { parentElement } = textNode;
                    const parentId = parentElement?.id;
                    const newContent = textNode.textContent?.slice(0, textNode.textContent.length - (range || 1));
                    if (parentId) {
                        updateNode(parentId, newContent || '');
                    }
                } else {
                    const key = (focusNode as HTMLElement).id;
                    const parentNode = focusNode?.parentNode as HTMLElement;
                    const lastTextNode = getLastTextChild(parentNode);
                    removeNode(key, parentNode, false, lastTextNode);
                }

                break;
            }
            default: {
                break;
            }
        }
    };

    // click
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
            state: stateRef.current,
            setState,
            undo,
            redo,
            isUndoDisabled,
            isRedoDisabled,
            setStyle,
            style: styleRef.current,
        }),
        [state, undo, redo, isUndoDisabled, isRedoDisabled, updateFont, setStyle, styleRef.current]
    );

    return <EditorContext.Provider value={editorContextValue}>{children}</EditorContext.Provider>;
};
