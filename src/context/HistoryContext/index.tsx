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

import { LexicalNode } from '../../classes/LexicalNode/LexicalNode';
import { NodeKey } from '../../classes/LexicalNode/types';
import { EMPTY_FOR_SELECT, TAGS } from '../../utils/constants';
import { useEditor } from '../LexicalContext';
import { StyleProps } from '../StylesContext';

export type HistoryItem = {
    id: string;
    type: 'input';
    before?: any;
    after?: any;
    style?: Record<string, string>;
    branch: Map<NodeKey, LexicalNode>;
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
            }, 500);
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

    const getStateWithId = useCallback(
        (id: string) => (history.filter(item => item.id === id) || []).at(-1),
        [history]
    );

    const getBranchForNode = useCallback(
        (key: string) => {
            const nodeMap = editor.getCopyNodeMap();
            const branch: Map<string, LexicalNode> = new Map();
            const returnBranch = (id: string, canGoLeaves = false) => {
                const node = nodeMap.get(id);
                if (!node) return;
                if (node?.getChildren() && node.getChildren()?.length > 0 && canGoLeaves) {
                    node?.getChildren().forEach(item => returnBranch(item, true));
                }
                branch.set(node?.getKey() as NodeKey, node);
                if (id === TAGS.ROOT) {
                    return;
                }
                const parentKey = node.getParent();
                if (!parentKey) return;
                returnBranch(parentKey, false);
            };
            returnBranch(key);
            return branch;
        },
        [editor]
    );

    const handleInput = useCallback(
        (node: Node | null) => {
            if (!node) return;
            const nodeElement = (node as HTMLElement).parentElement;
            const { id, textContent } = nodeElement as HTMLSpanElement;
            const actualState = history[currentIndex];
            const actualId = (actualState && actualState?.id) || '';
            const historyItem: HistoryItem = {
                id,
                type: 'input',
                before: actualId === id ? prevTextState : getStateWithId(id)?.after ? getStateWithId(id)?.after : '', // при записи изменения в новой узле нужно сбросить befor, иначе берем prevTextState как before
                after: textContent as string,
                branch: getBranchForNode(id),
            };

            pushToHistoryTextItem(historyItem);
        },
        [currentIndex, getBranchForNode, getStateWithId, history, prevTextState, pushToHistoryTextItem]
    );

    const handleDecorateParent = useCallback((_style: StyleProps) => {}, []);
    const handleDecorate = useCallback((_style: StyleProps) => {}, []);

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
