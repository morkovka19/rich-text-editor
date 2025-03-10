/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react-refresh/only-export-components */
import {
    FC,
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react';

import { useEditor } from '../LexicalContext';
import { StyleProps } from '../ToolbarContext';

type HistoryItem = {
    id: string;
    type: 'add' | 'delete' | 'update' | 'style';
    before?: any;
    after?: any;
    styles?: Record<string, string>;
    timestamp?: number;
    handleDecorateParent: (style: StyleProps) => void;
    handleInput: (node: Node | null) => void;
    handleDecorate: (style: StyleProps) => void;
};

type HistoryContextProps = {
    history: HistoryItem[];
    currentIndex: number;
    pushToHistory: (state: HistoryItem) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
};

type Props = PropsWithChildren<{ etitable?: boolean }>;
const HistoryContext = createContext<HistoryContextProps | null>(null);

export const HistoryProvider: FC<Props> = ({ children }) => {
    const { editor } = useEditor();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const pushToHistory = useCallback(
        (state: HistoryItem) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            const newTimeoutId = setTimeout(() => {
                setHistory(prevHistory => {
                    const newHistory = prevHistory.slice(0, currentIndex + 1);
                    newHistory.push(state);
                    return newHistory;
                });
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, 1000);

            setTimeoutId(newTimeoutId);
        },
        [currentIndex, timeoutId]
    );

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    }, [currentIndex]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
    }, [currentIndex, history.length]);

    const canUndo = currentIndex > 0;
    const canRedo = currentIndex < history.length - 1;

    const handleInput = useCallback((node: Node | null) => {}, []);

    const handleDecorateParent = useCallback((style: StyleProps) => {}, []);
    const handleDecorate = useCallback((style: StyleProps) => {}, []);

    const context = useMemo(
        () => ({
            history,
            currentIndex,
            pushToHistory,
            handleInput,
            undo,
            redo,
            canUndo,
            canRedo,
            handleDecorateParent,
            handleDecorate,
        }),
        [
            canRedo,
            canUndo,
            currentIndex,
            handleDecorate,
            handleDecorateParent,
            handleInput,
            history,
            pushToHistory,
            redo,
            undo,
        ]
    );

    useLayoutEffect(() => {
        editor.registerObserver('handleInput', context);
        editor.registerObserver('handleDecorateParent', context);
        editor.registerObserver('handleDecorate', context);
    }, [context, editor]);

    return <HistoryContext.Provider value={context}>{children}</HistoryContext.Provider>;
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useEditorState must be used within an LexicalProvider');
    }
    return context;
};
