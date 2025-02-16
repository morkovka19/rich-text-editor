/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';

import { NodeKeyType } from '../../../types/nodes';

export enum HistoryTypeEnum {
    STYLE = 'style',
    TEXT = 'text',
    BLOCK = 'block',
    REMOVE_BLOCK = 'removeBlock',
}

export interface IHistoryQueueItem {
    type: HistoryTypeEnum;
    key: NodeKeyType;
    lastState: {
        last?: any;
        new?: any;
        parent?: NodeKeyType;
    };
}

export interface IHistoryState {
    index: number;
    historyQueue: IHistoryQueueItem[];
    side?: 'undo' | 'redo';
}

export const MAX_HISTORY_LENGTH = 10;

export const useHistory = () => {
    const [history, setHistory] = useState<IHistoryState>({
        index: 0,
        historyQueue: [],
    });

    const isUndoDisabled = !(history.historyQueue.length > 0 && history.index < history.historyQueue.length);
    const isRedoDisabled = !(history.historyQueue.length > 0 && history.index > 0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getQueueWithoutLastState = useCallback(() => history.historyQueue.slice(1), [history.historyQueue]);
    const getQueueCopy = useCallback(() => history.historyQueue, [history.historyQueue]);
    const addToHistoryText = useCallback(
        (newState: IHistoryQueueItem) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                const queue = history.index === MAX_HISTORY_LENGTH ? getQueueWithoutLastState() : getQueueCopy();
                queue.unshift(newState);
                setHistory(prevState => ({ ...prevState, historyQueue: queue }));
            }, 100);
        },
        [getQueueCopy, getQueueWithoutLastState, history]
    );

    const addToHistoryNotText = useCallback(
        (newState: IHistoryQueueItem) => {
            const queue = history.index === MAX_HISTORY_LENGTH ? getQueueWithoutLastState() : getQueueCopy();
            queue.unshift(newState);
            setHistory(prevState => ({ ...prevState, historyQueue: queue }));
        },
        [getQueueCopy, getQueueWithoutLastState, history]
    );

    const undo = () => setHistory(prevState => ({ ...prevState, index: prevState.index + 1, side: 'undo' }));

    const redo = () => setHistory(prevState => ({ ...prevState, index: prevState.index - 1, side: 'redo' }));

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        history,
        isUndoDisabled,
        isRedoDisabled,
        addToHistoryText,
        undo,
        addToHistoryNotText,
        redo,
    };
};
