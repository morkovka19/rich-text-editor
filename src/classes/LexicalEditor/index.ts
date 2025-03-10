/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleProps } from '../../context/ToolbarContext';
import { NodeKey } from '../LexicalNode/types';
import { LexicalState } from '../LexicalState';

export class LexicalEditor {
    _state: LexicalState;
    _container: HTMLElement | null;
    _handleIsOpenLinkEditor: null | React.Dispatch<React.SetStateAction<boolean>>;
    _inputObservers: Array<any>;
    _clickObservers: Array<any>;
    _styleObservers: Array<any>;
    _tagUpdateObserver: Array<any>;
    _linkEditorObservers: Array<any>;
    _selectionObservers: Array<any>;
    _clickContextMenuObservers: Array<any>;
    _decorateParentObservers: Array<any>;
    constructor() {
        this._state = new LexicalState();
        this._container = null;
        this._handleIsOpenLinkEditor = null;
        this._inputObservers = [];
        this._clickObservers = [];
        this._styleObservers = [];
        this._tagUpdateObserver = [];
        this._linkEditorObservers = [];
        this._selectionObservers = [];
        this._clickContextMenuObservers = [];
        this._decorateParentObservers = [];
    }

    start(container: HTMLElement) {
        this._container = container;
        this._state.start(container);
        this.setBaseEventListeners();
        this.setBaseEventObservers();
        this.handleUpdateSelect();
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
        this.registerSelectObserver(this._state);
        this.registerTagUpdateObserver(this._state);
        this.registerStyleObserver(this._state);
        this.registerClickObserver(this._state);
        this.registerDecorateParentObserver(this._state);
    };

    registerKeydownListener() {
        this._container?.addEventListener('keydown', this.handleKeydown);
        return () => this._container?.removeEventListener('keydown', this.handleKeydown);
    }

    handleKeydown = (e: KeyboardEvent) => {
        const key = e.key;
        switch (key) {
            case 'Enter':
                this.handleEnter(e);
                break;
            case 'Backspace':
                this.handleBackspace(e);
        }
    };

    handleEnter = (e: KeyboardEvent) => {
        e.preventDefault();
        this._state.triggerHandleEnter();
    };

    handleBackspace(e: KeyboardEvent) {
        this._state.triggerHandleBackspace(e);
    }

    registerClickListener() {
        this._container?.addEventListener('click', this.triggerHandleClick);
        return () => this._container?.removeEventListener('click', this.triggerHandleClick);
    }

    registerInputListener() {
        this._container?.addEventListener('input', this.handleInput);
        return () => this._container?.removeEventListener('input', this.handleInput);
    }

    registerSelectStartListener() {
        this._container?.addEventListener('selectstart', this.handleUpdateSelect);
        return () => this._container?.removeEventListener('selectstart', this.handleUpdateSelect);
    }

    handleUpdateSelect = () => {
        const selection = window.getSelection() as Selection;
        this._selectionObservers.forEach(observer => observer.handleUpdateSelect(selection));
    };

    triggerHandleClick = (e: Event) => {
        this._clickObservers.forEach(observer => observer.handleClick(e));
    };

    registerClickContextMenuListener() {
        this._container?.addEventListener('contextmenu', this.handleClickContextMenu);
        return () => this._container?.removeEventListener('contextmenu', this.handleClickContextMenu);
    }

    handleClickContextMenu = (e: Event) => {
        this._clickContextMenuObservers.forEach(observer => observer.handleClickContextMenu(e));
    };

    handleInput = () => {
        this._inputObservers.forEach(observer => observer.handleInput(getSelection()?.focusNode));
    };

    triggerDecoratedUpdate = (style: StyleProps) => {
        this._styleObservers.forEach(observer => observer.updateStyle(style));
    };

    triggerTagUpdate(tag: string) {
        this._tagUpdateObserver.forEach(observer => observer.updateTag(tag));
    }

    triggerLinkEditor(key: NodeKey, href?: string) {
        this._linkEditorObservers.forEach(observer => observer.triggerLinkAction(key, href));
    }

    triggerDecorateParent(style: StyleProps) {
        this._decorateParentObservers.forEach(observer => observer.handleDecorateParent(style));
    }

    registerStyleObserver(observer: any) {
        this._styleObservers.push(observer);
    }

    registerTagUpdateObserver(observer: any) {
        this._tagUpdateObserver.push(observer);
    }

    registerClickObserver(observer: any) {
        this._clickObservers.push(observer);
    }

    registerLinkEditorObservers() {
        this._linkEditorObservers.push(this._state);
    }

    registerInputObserver(observer: any) {
        this._inputObservers.push(observer);
    }

    registerSelectObserver(observer: any) {
        this._selectionObservers.push(observer);
    }

    registerClickContextMenuObserver(observer: any) {
        this._clickContextMenuObservers.push(observer);
    }

    registerDecorateParentObserver(observer: any) {
        this._decorateParentObservers.push(observer);
    }
}
