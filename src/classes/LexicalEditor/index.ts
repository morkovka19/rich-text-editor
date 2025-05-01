import { StyleProps } from '../../context/FormattingContext';
import { HistoryItem } from '../../context/HistoryContext';
import { LexicalNode } from '../LexicalNode/LexicalNode';
import { NodeKey } from '../LexicalNode/types';
import { LexicalState } from '../LexicalState';
import { ActionsType, Observer } from './types';

export class LexicalEditor {
    private _observers: {
        [K in keyof ActionsType]?: Array<Observer<K>>;
    } = {};

    _state: LexicalState;
    _container: HTMLElement | null;
    _copyNodeMap: Map<string, LexicalNode>;
    constructor() {
        this._state = new LexicalState();
        this._container = null;
        this._copyNodeMap = new Map(this._state.getNodeMap());
    }

    start(container: HTMLElement) {
        this._container = container;
        this._state.start(container);
        this.setBaseEventListeners();
        this.setBaseEventObservers();
        this.triggerSelect();
    }

    setBaseEventListeners() {
        if (this._container) {
            this.registerSelectStartListener();
            this.registerKeydownListener();
            this.registerClickListener();
            this.registerInputListener();
            this.registerClickContextMenuListener();
        }
    }

    setBaseEventObservers = () => {
        this.registerObserver('handleSelect', this._state);
        this.registerObserver('handleUpdateTag', this._state);
        this.registerObserver('handleDecorate', this._state);
        this.registerObserver('handleDecorateParent', this._state);
        this.registerObserver('handleClick', this._state);
        this.registerObserver('handleUndo', this._state);
        this.registerObserver('handleRedo', this._state);
    };

    registerKeydownListener() {
        this._container?.addEventListener('keydown', this.triggerHandleKeydown);
        return () => this._container?.removeEventListener('keydown', this.triggerHandleKeydown);
    }

    registerClickListener() {
        this._container?.addEventListener('click', this.triggerHandleClick);
        return () => this._container?.removeEventListener('click', this.triggerHandleClick);
    }

    registerInputListener() {
        this._container?.addEventListener('input', this.triggerHandleInput);
        return () => this._container?.removeEventListener('input', this.triggerHandleInput);
    }

    registerSelectStartListener() {
        this._container?.addEventListener('selectstart', this.triggerSelect);
        return () => this._container?.removeEventListener('selectstart', this.triggerSelect);
    }

    registerClickContextMenuListener() {
        this._container?.addEventListener('contextmenu', this.triggerHandleClickContextMenu);
        return () => this._container?.removeEventListener('contextmenu', this.triggerHandleClickContextMenu);
    }

    triggerHandleKeydown = (e: KeyboardEvent) => {
        const key = e.key;
        switch (key) {
            case 'Enter':
                this.triggerHandleEnter(e);
                break;
            case 'Backspace':
                this.triggerHandleBackspace(e);
        }
    };

    triggerHandleEnter = (e: KeyboardEvent) => {
        e.preventDefault();
        this._state.triggerHandleEnter();
    };

    triggerHandleBackspace(e: KeyboardEvent) {
        this._state.triggerHandleBackspace(e);
    }

    triggerSelect = () => {
        const selection = document.getSelection() as Selection;
        this._observers['handleSelect']?.forEach(observer => observer.callback(selection));
    };

    triggerHandleClick = (e: Event) => {
        this._observers['handleClick']?.forEach(observer => observer.callback(e));
    };

    triggerHandleClickContextMenu = (e: Event) => {
        this._observers['handleClickContextMenu']?.forEach(observer => observer.callback(e));
    };

    triggerHandleUndo = (state: HistoryItem) => {
        this._observers['handleUndo']?.forEach(observer => observer.callback(state));
    };

    triggerHandleRedo = (state: HistoryItem) => {
        this._observers['handleRedo']?.forEach(observer => observer.callback(state));
    };

    triggerHandleInput = () => {
        this._copyNodeMap = this._state.getNodeMap();
        this._observers['handleInput']?.forEach(observer => observer.callback(getSelection()?.focusNode || null));
    };

    triggerDecoratedUpdate = (style: StyleProps) => {
        this._observers['handleDecorate']?.forEach(observer => observer.callback(style));
    };

    triggerTagUpdate(tag: string) {
        this._observers['handleUpdateTag']?.forEach(observer => observer.callback(tag));
    }

    triggerLinkEditor(key: NodeKey, href?: string) {
        this._observers['handleLinkAction']?.forEach(observer => observer.callback(key, href));
    }

    triggerDecorateParent(style: StyleProps) {
        this._observers['handleDecorateParent']?.forEach(observer => observer.callback(style));
    }

    registerObserver<T extends keyof ActionsType>(action: T, observer: { [K in T]: ActionsType[K] }) {
        if (!this._observers[action]) {
            this._observers[action] = [];
        }
        this._observers[action]?.push({ action, callback: observer[action] });
    }

    triggerObservers<T extends keyof ActionsType>(action: T, ...args: Parameters<ActionsType[T]>) {
        this._observers[action]?.forEach(observer => {
            (observer.callback as (...args: Parameters<ActionsType[T]>) => void)(...args);
        });
    }

    registerLinkEditorObservers() {
        this.registerObserver('handleLinkAction', this._state);
    }

    getCopyNodeMap = () => new Map<NodeKey, LexicalNode>(this._copyNodeMap);
}
