/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, createContext, useEffect } from 'react';
import { FC, ReactNode, useCallback, useMemo, useState } from 'react';

import { IEditorState, ILastUpdate } from '../../components/EditorState/EditorState.types';
import { createInitialNodeMap } from '../../components/EditorState/getInitialState';
import {
    ContentNodeType,
    LexicalNodeType,
    NodeKeyType,
    ParentNodeType,
    RootNodeType,
} from '../../components/nodes/Nodes.types';
import { isContentNodeType, isParentContentNodeType, isRootNodeType } from '../../components/nodes/scripts';
import { MAIN_DIV_ID } from '../../helpers/constants';
import { createEvent } from '../../helpers/createEvent';
import { IEditorContextProps } from './EditorContext.types';

export const EditorContext = createContext<IEditorContextProps | undefined>(undefined);

export const EditorProvider: FC<{ children: ReactNode; editor: RefObject<HTMLDivElement> }> = ({
    children,
    editor,
}) => {
    const [state, setState] = useState<IEditorState>({
        nodeMap: new Map(),
        selection: null,
        flushSync: false,
        readOnly: false,
        editor: editor,
        lastUpdate: undefined,
    });

    const setLastUpdate = useCallback(
        (update: ILastUpdate) => {
            state.lastUpdate = update;
            state.editor.current?.dispatchEvent(createEvent('updateState'));
        },
        [state]
    );

    const addNode = useCallback((node: LexicalNodeType, parentKey?: NodeKeyType) => {
        setState(prevState => {
            const newMap = new Map(prevState.nodeMap);
            newMap.set(node.key, node);
            if (parentKey) {
                const parentNode = newMap.get(parentKey);
                if (parentNode && !isContentNodeType(parentNode)) {
                    parentNode.children.push(node.key);
                }
            }
            return {
                ...prevState,
                nodeMap: newMap,
            };
        });
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

    const getNode = useCallback((key: string) => state.nodeMap.get(key), [state.nodeMap]);

    const getChildren = useCallback(
        (elKey: string) => {
            setState(prevState => {
                const newMap = new Map(prevState.nodeMap);
                return {
                    ...prevState,
                    nodeMap: newMap,
                };
            });
            const parentNode = state.nodeMap.get(elKey);
            if (parentNode && !isContentNodeType(parentNode)) {
                return parentNode.children;
            }
            return [];
        },
        [state]
    );

    const updateNode = useCallback(
        (key: string, updateNode: Partial<RootNodeType | ContentNodeType | ParentNodeType>) => {
            setState(prevState => {
                const newMap = new Map(prevState.nodeMap);
                const node = newMap.get(key);
                if (node) {
                    if (isContentNodeType(node)) {
                        newMap.set(key, { ...node, ...updateNode } as ContentNodeType);
                    } else if (isParentContentNodeType(node)) {
                        newMap.set(key, { ...node, ...updateNode } as ParentNodeType);
                    } else if (isRootNodeType(node)) {
                        newMap.set(key, { ...node, ...updateNode } as RootNodeType);
                    }
                }

                return {
                    ...prevState,
                    nodeMap: newMap,
                };
            });
        },
        []
    );

    const handleClick = useCallback(
        (e: Event) => {
            const target = e.target as HTMLElement;
            if (!state.nodeMap.get(MAIN_DIV_ID)) {
                const newMap = new Map(createInitialNodeMap());
                setState(prev => ({
                    ...prev,
                    nodeMap: newMap,
                }));
                target.dispatchEvent(createEvent('updateState', { bubbles: true }));
            } else {
                state.editor.current?.focus();
            }
        },
        [setLastUpdate, state.editor, state.nodeMap]
    );

    const handleInputDiv = useCallback(
        (target: HTMLDivElement) => {
            const content = target.textContent || undefined;
            const key = `node-${Date.now()}`;
            const newNode: ContentNodeType = {
                key,
                parent: target.id,
                content,
                type: 'p',
                prev: null,
                next: null,
            };
            addNode(newNode, target.id);
            setLastUpdate({
                key: target.id,
                child: newNode,
                typeUpdate: 'addChildren',
            });
            target.dispatchEvent(createEvent('updateState', { bubbles: true }));
        },
        [addNode, setLastUpdate, state]
    );

    const handleInputP = useCallback(
        (target: HTMLParagraphElement) => {
            const content = target.textContent || '';
            const updatedNode = state.nodeMap.get(target.id);
            if (updatedNode) {
                const newNode = {
                    ...updatedNode,
                    content,
                };
                updateNode(target.id, newNode);
                setLastUpdate({
                    key: target.id,
                    typeUpdate: 'updateContent',
                    newContent: target.textContent || undefined,
                });
            }
            target.dispatchEvent(createEvent('updateState', { bubbles: true }));
        },
        [setLastUpdate, updateNode, state]
    );

    const handleInput = useCallback(
        (e: Event) => {
            const target = e.target as HTMLElement;
            switch (target.tagName) {
                case 'DIV':
                    handleInputDiv(target as HTMLDivElement);
                    break;
                case 'P':
                    handleInputP(target as HTMLParagraphElement);
                    break;
            }
        },
        [handleInputDiv, state]
    );

    useEffect(() => {
        state.editor.current?.addEventListener('clickEditorEvent', handleClick);
        return () => state.editor.current?.removeEventListener('clickEditorEvent', handleClick);
    }, [handleClick, state.editor]);

    useEffect(() => {
        state.editor.current?.addEventListener('inputEditor', handleInput);

        return () => state.editor.current?.removeEventListener('inputEditor', handleInput);
    }, [handleInput, state.editor]);

    const editorContextValue: IEditorContextProps = useMemo(
        () => ({
            state,
            setState,
            addNode,
            removeNode,
            getNode,
            getChildren,
            updateNode,
        }),
        [state, addNode, removeNode, getNode, getChildren, updateNode]
    );

    return <EditorContext.Provider value={editorContextValue}>{children}</EditorContext.Provider>;
};
