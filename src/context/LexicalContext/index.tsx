/* eslint-disable react-refresh/only-export-components */
import { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react';

import { LexicalEditor } from '../../classes/LexicalEditor';

type LexicalContextProps = {
    editor: LexicalEditor;
};

type Props = PropsWithChildren<{ etitable?: boolean }>;
const LexicalContext = createContext<LexicalContextProps | null>(null);

export const LexicalProvider: FC<Props> = ({ children }) => {
    const context = useMemo(() => {
        const editor = new LexicalEditor();
        return { editor };
    }, []);

    return <LexicalContext.Provider value={context}>{children}</LexicalContext.Provider>;
};

export const useEditor = () => {
    const context = useContext(LexicalContext);
    if (!context) {
        throw new Error('useEditorState must be used within an LexicalProvider');
    }
    return context;
};
