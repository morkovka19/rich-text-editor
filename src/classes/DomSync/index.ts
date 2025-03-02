import { LexicalState } from '../LexicalState';

export class DomSync {
    _state: LexicalState;
    _rootElement: HTMLElement | null;

    constructor(state: LexicalState) {
        this._state = state;
        this._rootElement = null;
    }

    render(container: HTMLElement) {
        const rootElement = this._state.getNodeByKey('root')?.render() as HTMLElement;
        container.appendChild(rootElement);
        this._rootElement = rootElement;
        this.setupMutationObserver();
        return this._rootElement;
    }

    private setupMutationObserver() {
        const observer = new MutationObserver(mutations => this.handleMutations(mutations));
        if (this._rootElement !== null)
            observer.observe(this._rootElement, {
                childList: true,
                subtree: true,
                characterData: true,
            });
    }

    handleMutations(mutations: MutationRecord[]) {
        mutations.forEach(mutation => {
            if (mutation.type === 'characterData') {
                const target = mutation.target.parentElement as HTMLElement;
                const key = target?.id;
                if (key) {
                    const text = target.textContent;
                    this._state.updateNodeText(key, text || '');
                }
            } else if (mutation.type === 'childList') {
                mutation.removedNodes.forEach(element => {
                    const key = (element as HTMLElement)?.id;
                    const node = this._state.getNodeByKey(key);
                    if (key && node) {
                        this._state.removeNode(node);
                    }
                });
            }
        });
    }
}
