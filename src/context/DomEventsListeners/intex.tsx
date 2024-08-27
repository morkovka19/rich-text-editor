/* eslint-disable react-hooks/exhaustive-deps */
import { FC, ReactNode, createContext, useCallback, useEffect, useMemo } from 'react';

import { IDomEventsListenersProps } from './DomEventsListeners.types';
import { onClickEditor } from './callbacks/onClick';
import { onInput } from './callbacks/onInput';

const DomEventsListenersContext = createContext<IDomEventsListenersProps | undefined>(undefined);

export const DomEventsListeners: FC<{ children: ReactNode; editor: React.RefObject<HTMLDivElement> }> = ({
    children,
    editor,
}) => {
    const handleClick = useCallback((e: Event) => onClickEditor(e, editor), [editor]);

    const handleInput = useCallback((e: Event) => onInput(e, editor), []);

    useEffect(() => {
        editor?.current?.addEventListener('click', handleClick);

        return () => editor?.current?.removeEventListener('click', handleClick);
    }, [editor, handleClick]);

    const values = useMemo(
        () => ({
            onClickEditor: handleClick,
            handleInputEditor: handleInput,
        }),
        [handleClick]
    );
    return <DomEventsListenersContext.Provider value={values}>{children}</DomEventsListenersContext.Provider>;
};
