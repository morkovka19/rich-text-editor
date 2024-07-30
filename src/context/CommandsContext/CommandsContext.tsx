/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useListeners } from '../EventListenersContext/EventListenersContext';
import { ICommand, ICommandContextProps } from './CommandContext.types';

const CommandsContext = createContext<ICommandContextProps | undefined>(undefined);

export const CommandsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [commands, setCommands] = useState<Map<string, ICommand>>(new Map());

    const { addEventListener: documentAddListener, removeEventListener: documentRemoveListener } = useListeners();
    const eventListeners = useRef<{ [key: string]: ((event: Event) => void)[] }>({});

    const addCommand = useCallback((command: ICommand) => {
        setCommands(prevState => {
            const newMap = new Map(prevState);
            newMap.set(command.name, command);
            return newMap;
        });
    }, []);

    const executeCommand = useCallback(
        (name: string, ...args: any[]) => {
            const command = commands.get(name);
            if (command) {
                command.execute(...args);
            }
        },
        [commands]
    );

    const addEventListener = useCallback(
        (eventType: string, callback: (event: Event) => void) => {
            if (!eventListeners.current[eventType]) {
                eventListeners.current[eventType] = [];
            }
            eventListeners.current[eventType].push(callback);
            documentAddListener(eventType, callback);
        },
        [documentAddListener]
    );

    const removeEventListener = useCallback(
        (eventType: string, callback: (event: Event) => void) => {
            if (eventListeners.current[eventType]) {
                eventListeners.current[eventType] = eventListeners.current[eventType].filter(c => c !== callback);
                documentRemoveListener(eventType, callback);
            }
        },
        [documentRemoveListener]
    );

    const commandContextValues = useMemo(
        () => ({
            commands,
            addCommand,
            addEventListener,
            removeEventListener,
            executeCommand,
        }),
        [addCommand, addEventListener, commands, executeCommand, removeEventListener]
    );

    useEffect(
        () =>
            Object.keys(eventListeners.current).forEach(eventType => {
                eventListeners.current[eventType].forEach(callback => {
                    documentRemoveListener(eventType, callback);
                });
            }),
        []
    );

    return <CommandsContext.Provider value={commandContextValues}>{children}</CommandsContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCommands = () => {
    const context = useContext(CommandsContext);
    if (context === undefined) {
        throw new Error('useCommands must be used within CommandsProvider');
    }
    return context;
};
