import { HistoryItem } from '../../context/HistoryContext';
import { StyleProps } from '../../context/StylesContext';
import { NodeKey } from '../LexicalNode/types';

export type ActionsType = {
    handleInput: (node: Node | null) => void;
    handleClick: (e: Event) => void;
    handleDecorate: (style: StyleProps) => void;
    handleUpdateTag: (tag: string) => void;
    handleLinkAction: (key: NodeKey, href?: string) => void;
    handleSelect: (selection: Selection) => void;
    handleClickContextMenu: (e: Event) => void;
    handleDecorateParent: (style: StyleProps) => void;
    handleRedo: (historyState: HistoryItem) => void;
    handleUndo: (historyState: HistoryItem) => void;
};

export type Observer<T extends keyof ActionsType> = {
    action: T;
    callback: ActionsType[T];
};
