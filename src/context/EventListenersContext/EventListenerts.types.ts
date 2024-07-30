/* eslint-disable @typescript-eslint/no-explicit-any */
export type EventListenerType = (event: any) => void;

export type EventListenersType = Map<string, EventListenerType[]>;

export interface IEventListenersContextProps {
    addEventListener: (eventType: string, callback: EventListenerType) => void;
    removeEventListener: (eventType: string, callback: EventListenerType) => void;
}
