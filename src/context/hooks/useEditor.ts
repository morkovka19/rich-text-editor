import { useContext } from 'react';

import { EditorContext } from '../EditorContext';

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error('useEditor must be used within a EditorProvider');
    }
    return context;
};
