/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react-refresh/only-export-components */
import {
    FC,
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { NodeKey } from '../../classes/LexicalNode/types';
import { EMPTY_FOR_SELECT } from '../../utils/constants';
import { getStyleState } from '../../utils/styleUtils';
import { useEditor } from '../LexicalContext';
import { StyleProps } from '../ToolbarContext';

export type HistoryItem = {
    id: string;
    type: 'add' | 'delete' | 'update' | 'style' | 'input';
    before?: any;
    after?: any;
    style?: Record<string, string>;
    parent: NodeKey;
};

type HistoryContextProps = {
    history: HistoryItem[];
    currentIndex: number;
    pushToHistoryTextItem: (state: HistoryItem) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    handleDecorateParent: (style: StyleProps) => void;
    handleInput: (node: Node | null) => void;
    handleDecorate: (style: StyleProps) => void;
};

type Props = PropsWithChildren<{ etitable?: boolean }>;
const HistoryContext = createContext<HistoryContextProps | null>(null);

export const HistoryProvider: FC<Props> = ({ children }) => {
    const { editor } = useEditor();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [prevTextState, setPrevTextState] = useState<string>(EMPTY_FOR_SELECT); // Состояние текста до изменения
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    const pushToHistoryTextItem = useCallback(
        (state: HistoryItem) => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }

            timeoutIdRef.current = setTimeout(() => {
                setHistory(prevHistory => {
                    const newHistory = prevHistory.slice(0, currentIndex + 1);
                    newHistory.push(state);
                    return newHistory;
                });
                setCurrentIndex(prevIndex => prevIndex + 1);
                setPrevTextState(state.after || EMPTY_FOR_SELECT);
            }, 1000);
        },
        [currentIndex]
    );

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
            setPrevTextState(history[currentIndex - 1].before || EMPTY_FOR_SELECT);
            editor.triggerHandleUndo(history[currentIndex]);
        } else if (currentIndex === 0) {
            setCurrentIndex(-1);
            setPrevTextState(EMPTY_FOR_SELECT);
            editor.triggerHandleUndo(history[0]);
        }
    }, [currentIndex, editor, history]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            setPrevTextState(history[currentIndex + 1].after || EMPTY_FOR_SELECT);
            editor.triggerHandleRedo(history[currentIndex + 1]);
        }
    }, [currentIndex, editor, history]);

    const canUndo = currentIndex >= 0;
    const canRedo = currentIndex < history.length - 1;

    const handleInput = useCallback(
        (node: Node | null) => {
            if (!node) return;
            const nodeElement = (node as HTMLElement).parentElement;
            const { id, textContent } = nodeElement as HTMLSpanElement;
            const parent = nodeElement?.parentElement as HTMLElement;
            const historyItem: HistoryItem = {
                id,
                type: 'input',
                before: prevTextState, // Используем prevTextState как before
                after: textContent as string,
                style: {},
                parent: parent?.id as NodeKey,
            };

            pushToHistoryTextItem(historyItem);
        },
        [prevTextState, pushToHistoryTextItem]
    );

    const handleDecorateParent = useCallback((style: StyleProps) => {}, []);
    const handleDecorate = useCallback((style: StyleProps) => {}, []);

    const context = useMemo(
        () => ({
            history,
            currentIndex,
            pushToHistoryTextItem,
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
            history,
            canUndo,
            currentIndex,
            handleDecorate,
            handleDecorateParent,
            handleInput,
            pushToHistoryTextItem,
            redo,
            undo,
        ]
    );

    useLayoutEffect(() => {
        editor.registerObserver('handleInput', context);
        editor.registerObserver('handleDecorateParent', context);
        editor.registerObserver('handleDecorate', context);
    }, [context, editor]);

    useEffect(() => {
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);

    return <HistoryContext.Provider value={context}>{children}</HistoryContext.Provider>;
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useEditorState must be used within an LexicalProvider');
    }
    return context;
};
