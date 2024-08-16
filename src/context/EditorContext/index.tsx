import { createContext } from 'react';
import { FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { IEditorState } from '../../components/EditorState/EditorState.types';
import { createInitialNodeMap } from '../../components/EditorState/getInitialState';
import {
    ContentNodeType,
    LexicalNodeType,
    NodeKeyType,
    ParentNodeType,
    RootNodeType,
} from '../../components/nodes/Nodes.types';
import { isContentNodeType, isParentContentNodeType, isRootNodeType } from '../../components/nodes/scripts';
import { IEditorContextProps } from './EditorContext.types';

const EditorContext = createContext<IEditorContextProps | undefined>(undefined);

export const EditorProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<IEditorState>({
        nodeMap: createInitialNodeMap(),
        selection: null,
        flushSync: false,
        readOnly: false,
    });

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
            console.log(state);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useEditor = () => {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error('useEditor must be used within a EditorProvider');
    }
    return context;
};
