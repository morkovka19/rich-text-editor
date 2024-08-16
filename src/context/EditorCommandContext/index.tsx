import { createContext, useCallback, useMemo } from 'react';
import { FC, ReactNode, useContext } from 'react';

import { NodeKeyType, ParentNodeType, RootNodeType } from '../../components/nodes/Nodes.types';
import { useDomCommand } from '../DomCommandContext';
import { useEditor } from '../EditorContext';
import { IEditorCommandContextProps } from './EditorCommandContext.types';

const EditorCommandContext = createContext<IEditorCommandContextProps | undefined>(undefined);

export const EditorCommandProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { addNode } = useEditor();
    const { createP, createRootDiv } = useDomCommand();

    const addParagraph = useCallback(
        (elKey: NodeKeyType, parent: NodeKeyType) => {
            const node: ParentNodeType = {
                type: 'paragraph',
                key: elKey,
                prev: null,
                next: null,
                children: [],
                parent: parent,
            };
            addNode(node, parent);
            createP(elKey, parent);
        },
        [addNode, createP]
    );
    const addDivRoot = useCallback(() => {
        const node: RootNodeType = {
            type: 'body',
            key: 'root',
            prev: null,
            next: null,
            children: [],
        };
        addNode(node);
        createRootDiv();
    }, [addNode, createRootDiv]);

    const editorCommandValues: IEditorCommandContextProps = useMemo(
        () => ({
            addParagraph,
            addDivRoot,
        }),
        [addParagraph, addDivRoot]
    );

    return <EditorCommandContext.Provider value={editorCommandValues}>{children}</EditorCommandContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEditorCommand = () => {
    const context = useContext(EditorCommandContext);
    if (context === undefined) {
        throw new Error('useEditor must bu used whithin a EditorProvier');
    }
    return context;
};
