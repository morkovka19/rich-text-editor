import { DomSync } from '../DomSync';
import { NodeKey } from '../LexicalNode/types';
import { LexicalState } from '../LexicalState';
import { SelectionManager } from '../SelectionManager';

export class LexicalEditor {
    _state: LexicalState;
    _dom: DomSync;
    _container: HTMLElement | null;
    _rootElement: HTMLElement | null;
    _selection: SelectionManager;

    constructor() {
        this._selection = new SelectionManager();
        this._state = new LexicalState(this._selection);
        this._rootElement = null;
        this._container = null;
        this._dom = new DomSync(this._state);
    }

    start(container: HTMLElement) {
        this._container = container;
        const rootElement = this._dom.render(container);
        this._rootElement = rootElement;
        this.setBaseEventListeners();
    }

    registerKeydownListener() {
        this._container?.addEventListener('keydown', this.handleKeydown, true);
        return () => this._container?.removeEventListener('keydown', this.handleKeydown);
    }

    private handleKeydown = (e: KeyboardEvent) => {
        const key = e.key;
        switch (key) {
            case 'Enter':
                this.handleEnter(e);
        }
    };

    private handleEnter = (e: KeyboardEvent) => {
        e.preventDefault();
        const selection = this._selection.getDefSelection();
        const anchorNode = selection?.anchorNode as HTMLElement;
        const focusNode = selection?.focusNode as HTMLElement;
        if (anchorNode!.id === focusNode!.id && anchorNode.nodeType !== 3) {
            this._state.handleSimpleEnter(anchorNode.id);
        } else if (selection?.isCollapsed) {
            this._state.handleEnterInText(anchorNode.parentElement!.id as NodeKey, selection.anchorOffset as number);
        }
    };

    setBaseEventListeners() {
        if (this._container) {
            this.registerKeydownListener();
        }
    }
}
