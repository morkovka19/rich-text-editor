/* eslint-disable react-hooks/exhaustive-deps */
import { FC, ReactNode, createContext, useCallback, useEffect } from 'react';

import { useEditor } from '../hooks/useEditor';
import { ICustomEventsListenersProps } from './CustomEventsListeners.types';
import { onUpdateState } from './callbacks';

export const CustomEventsListenersContext = createContext<ICustomEventsListenersProps | undefined>(undefined);

export const CustomEventsListeners: FC<{ children: ReactNode; editor: React.RefObject<HTMLDivElement> }> = ({
    children,
    editor,
}) => {
    const { state } = useEditor();

    const handleUpdateState = useCallback(() => onUpdateState(state), [state]);

    useEffect(() => {
        editor.current?.addEventListener('updateState', handleUpdateState);

        return () => editor.current?.removeEventListener('updateState', handleUpdateState);
    }, [editor, handleUpdateState]);

    return <CustomEventsListenersContext.Provider value={undefined}>{children}</CustomEventsListenersContext.Provider>;
};
