import { createContext } from 'react';
import { FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { IEditorState } from '../../components/EditorState/EditorState.types';
import { ILexicalNode, NodeKeyType } from '../../components/nodes/LexicalNode.types';
import { IEditorContextProps } from './EditorContext.types';

const EditorContext = createContext<IEditorContextProps | undefined>(undefined);

export const EditorProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<IEditorState>({
        nodeMap: new Map(),
        selection: null,
        flushSync: false,
        readOnly: false,
    });

    const addNode = useCallback((node: ILexicalNode, parentKey?: NodeKeyType) => {
        setState(prevState => {
            const newMap = new Map(prevState.nodeMap);
            newMap.set(node.key, node);
            if (parentKey) {
                const parentNode = newMap.get(parentKey);
                if (parentNode) {
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
            if (node) {
                if (node?.parent) {
                    const parentNode = newMap.get(node.parent);
                    if (parentNode) {
                        parentNode.children = parentNode.children.filter(childKey => childKey !== key);
                    }
                }
            }

            return {
                ...prevState,
                newMap,
            };
        });
    }, []);

    const getNode = useCallback((key: string) => state.nodeMap.get(key), [state.nodeMap]);

    const getChildren = useCallback(
        (key: string) => {
            const parentNode = state.nodeMap.get(key);
            if (parentNode?.children) {
                return parentNode.children.map(child => state.nodeMap.get(child)).filter(Boolean) as ILexicalNode[];
            }
            return [];
        },
        [state]
    );

    const updateNode = useCallback((key: string, updateNode: Partial<ILexicalNode>) => {
        setState(prevState => {
            const newMap = new Map(prevState.nodeMap);
            const node = newMap.get(key);

            if (node) {
                newMap.set(key, { ...node, ...updateNode });
            }
            return {
                ...prevState,
                nodeMap: newMap,
            };
        });
    }, []);

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
        throw new Error('useEditor must bu used whithin a EditorProvier');
    }
    return context;
};
