/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleProps } from '../../context/ToolbarContext';
// import { ActionWithTag } from '../../utils/constants';
// import { NodeKey } from '../LexicalNode/types';
import { LexicalState } from '../LexicalState';

export class LexicalEditor {
    _state: LexicalState;
    _container: HTMLElement | null;
    _handleIsOpenLinkEditor: null | React.Dispatch<React.SetStateAction<boolean>>;
    _inputObservers: Array<any>;
    _clickObservers: Array<any>;
    _styleObservers: Array<any>;
    _tagUpdateObserver: Array<any>;

    constructor() {
        this._state = new LexicalState();
        this._container = null;
        this._handleIsOpenLinkEditor = null;
        this._inputObservers = [];
        this._clickObservers = [];
        this._styleObservers = [];
        this._tagUpdateObserver = [];
    }

    start(container: HTMLElement) {
        this._container = container;
        this._state.start(container);
        this.setBaseEventListeners();
        this.setBaseEventObservers();
    }

    setBaseEventListeners() {
        if (this._container) {
            this.registerSelectListener();
            this.registerKeydownListener();
            // this.registerClickListener();
            // this.registerClickContextMenu();
        }
    }

    setBaseEventObservers = () => {
        // this.registerClickObserver(this._state);
        // this.registerClickObserver(this._selection);
        this.registerTagUpdateObserver(this._state);
        this.registerStyleObserver(this._state);
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

    // registerClickListener() {
    //     this._container?.addEventListener('click', this.handleClick);
    //     return () => this._container?.removeEventListener('click', this.handleClick);
    // }

    registerSelectListener() {
        this._container?.addEventListener('selectstart', this.handleUpdateSelect);
        return () => this._container?.removeEventListener('selectstart', this.handleUpdateSelect);
    }

    handleUpdateSelect = () => {
        const selection = window.getSelection() as Selection;
        this._state?.setSelection(selection);
    };

    // handleClick = (e: Event) => {

    // };

    registerClickContextMenu() {
        this._container?.addEventListener('contextmenu', this.handleClickContextMenu);
        return () => this._container?.removeEventListener('contextmenu', this.handleClickContextMenu);
    }

    handleClickContextMenu(e: Event) {
        e.preventDefault();
        if (this._handleIsOpenLinkEditor) this._handleIsOpenLinkEditor(true);
    }

    // triggerAddNewTagElement(tag: string) {
    //     this._state.addNewTag(tag);
    // }
    // triggerEditLinkTag(action: ActionWithTag, key: NodeKey, href?: string) {
    //     this._state.triggerActionWithLink(action, key, href)
    // }

    triggerDecoratedUpdate(style: StyleProps) {
        this._styleObservers.forEach(observer => observer.updateStyle(style));
    }

    triggerTagUpdate(tag: string) {
        this._styleObservers.forEach(observer => observer.updateTag(tag));
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

    registerInputObserver(observer: any) {
        this._inputObservers.push(observer);
    }
}
