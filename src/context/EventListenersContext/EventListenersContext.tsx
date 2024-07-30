import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useRef } from 'react';

import { IEventListenersContextProps } from './EventListenerts.types';

export const EventListenersContext = createContext<IEventListenersContextProps | undefined>(undefined);

export const ListenersProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const eventListeners = useRef<{ [key: string]: ((event: Event) => void)[] }>({});

    const addEventListener = useCallback((eventType: string, callback: (event: Event) => void) => {
        if (!eventListeners.current[eventType]) {
            eventListeners.current[eventType] = [];
        }
        eventListeners.current[eventType].push(callback);
        document.addEventListener(eventType, callback);
    }, []);

    const removeEventListener = useCallback((eventType: string, callback: (event: Event) => void) => {
        if (eventListeners.current[eventType]) {
            eventListeners.current[eventType] = eventListeners.current[eventType].filter(cb => cb !== callback);
            document.removeEventListener(eventType, callback);
        }
    }, []);

    useEffect(() => {
        return () => {
            Object.keys(eventListeners.current).forEach(eventType => {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                eventListeners.current[eventType].forEach(callback => {
                    document.removeEventListener(eventType, callback);
                });
            });
        };
    }, []);

    return (
        <EventListenersContext.Provider value={{ addEventListener, removeEventListener }}>
            {children}
        </EventListenersContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useListeners = () => {
    const context = useContext(EventListenersContext);
    if (!context) {
        throw new Error('useListenets must bu used whithin a ListenersProvier');
    }
    return context;
};
