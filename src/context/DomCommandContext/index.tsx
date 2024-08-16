import { createContext, useCallback } from 'react';
import { FC, ReactNode, useContext, useMemo } from 'react';

import { ContentNodeType, NodeKeyType } from '../../components/nodes/Nodes.types';
import { useEditor } from '../EditorContext';
import { IDomCommandContextProps } from './DomCommandContext.types';

const EditorDOMCommandContext = createContext<IDomCommandContextProps | undefined>(undefined);

export const DomCommandProvider: FC<{ children: ReactNode; editorRef: React.RefObject<HTMLDivElement> }> = ({
    children,
    editorRef,
}) => {
    const { getChildren, updateNode, addNode } = useEditor();

    const createRootDiv = useCallback(() => {
        const root = document.createElement('div');
        root.id = 'root';
        editorRef.current?.appendChild(root);
    }, [editorRef]);

    const createContextNode = useCallback(
        ({ parent, elKey, content = '' }: { parent: NodeKeyType; elKey: NodeKeyType; content?: string }) => {
            const context: ContentNodeType = {
                parent,
                type: 'text',
                content,
                key: elKey,
                prev: '',
                next: '',
            };

            addNode(context, parent);
        },
        [addNode]
    );

    const createP = useCallback(
        (elKey: NodeKeyType, parentKey: NodeKeyType) => {
            const parent = document.getElementById(parentKey);
            const p = document.createElement('p');
            p.id = elKey;
            parent?.appendChild(p);

            const observer = new MutationObserver(async (mutationList: MutationRecord[]) => {
                mutationList.forEach(mutation => {
                    if (mutation.type === 'characterData') {
                        const text = mutation.target.nodeValue || '';

                        const child: NodeKeyType[] | undefined = getChildren(elKey);

                        if (!child || !child.length) {
                            const contentKey = `node-${Date.now()}`;
                            createContextNode({ parent: elKey, elKey: contentKey, content: text });
                        } else {
                            updateNode(child[0], {
                                ...child,
                                content: text,
                            });
                        }
                    }
                });
            });

            observer.observe(p as HTMLElement, {
                characterData: true,
                subtree: true,
            });
        },
        [createContextNode, getChildren, updateNode]
    );

    const domCommandContextProps: IDomCommandContextProps = useMemo(
        () => ({
            createP,
            createRootDiv,
        }),
        [createP, createRootDiv]
    );
    return (
        <EditorDOMCommandContext.Provider value={domCommandContextProps}>{children}</EditorDOMCommandContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDomCommand = () => {
    const context = useContext(EditorDOMCommandContext);
    if (context === undefined) {
        throw new Error('useEditor must bu used whithin a EditorProvier');
    }
    return context;
};
