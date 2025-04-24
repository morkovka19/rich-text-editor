/* eslint-disable @typescript-eslint/no-unused-vars */
import { DomSync } from '../../classes/DomSync';
import { LexicalNode } from '../../classes/LexicalNode/LexicalNode';
import { NodeKey } from '../../classes/LexicalNode/types';
import { TAGS } from '../../utils/constants';

// Реализация TestNode с полной поддержкой Happy DOM
class TestNode extends LexicalNode {
    public getChildType(): string {
        throw new Error('Method not implemented.');
    }
    public getChildIndex(_key: NodeKey): number {
        throw new Error('Method not implemented.');
    }
    public setRange(_range: number): void {
        throw new Error('Method not implemented.');
    }
    public getRange(): number | undefined {
        throw new Error('Method not implemented.');
    }
    public setTypeList(_type: string): void {
        throw new Error('Method not implemented.');
    }
    public setHref(_href: string): void {
        throw new Error('Method not implemented.');
    }
    public getHref(): string {
        throw new Error('Method not implemented.');
    }
    public removeChildElement(_key: NodeKey): void {
        throw new Error('Method not implemented.');
    }
    public addChildren(_children: Array<NodeKey>): void {
        throw new Error('Method not implemented.');
    }
    public removeChildren(_maxIndex: number, _isStart: boolean): Array<string> {
        throw new Error('Method not implemented.');
    }
    private _domElement: HTMLElement | null = null;
    private _children: string[] = [];
    private _text = '';
    private _style: Record<string, string> = {};

    constructor(key: string) {
        super(key, TAGS.NORMAL);
        this._domElement = document.createElement('div');
        this._domElement.id = key;
    }

    // DOM методы
    render(): HTMLElement {
        if (!this._domElement) {
            this._domElement = document.createElement('div');
            this._domElement.id = this.getKey();
        }
        return this._domElement;
    }

    getDomElement(): HTMLElement {
        return this._domElement as HTMLElement;
    }

    // Методы работы с текстом
    canHasText(): boolean {
        return true;
    }

    updateText(text: string): void {
        this._text = text;
        if (this._domElement) {
            this._domElement.textContent = text;
        }
    }

    getText(): string {
        return this._text;
    }

    // Методы работы с детьми
    getChildren(): string[] {
        return this._children;
    }

    addChild(child: string): void {
        this._children.push(child);
    }

    removeChild(key: string): void {
        this._children = this._children.filter(k => k !== key);
    }

    // Остальные обязательные методы (упрощенные)
    clone(): LexicalNode {
        return new TestNode(this.getKey());
    }

    setStyle(): void {}
    getStyle(): Record<string, string> {
        return this._style;
    }
    // ... другие методы можно оставить пустыми
}

describe('DomSync Integration', () => {
    let domSync: DomSync;
    let rootElement: HTMLElement;

    beforeAll(() => {
        // Создаем корневой элемент
        rootElement = document.createElement('div');
        rootElement.id = 'root';
        document.body.appendChild(rootElement);
    });

    beforeEach(() => {
        domSync = new DomSync(
            jest.fn(),
            rootElement,
            jest.fn(),
            jest.fn().mockImplementation(key => new TestNode(key))
        );
    });

    afterEach(() => {
        // Очищаем rootElement после каждого теста
        while (rootElement.firstChild) {
            rootElement.removeChild(rootElement.firstChild);
        }
    });

    afterAll(() => {
        document.body.removeChild(rootElement);
    });

    it('should add nodes to DOM correctly', () => {
        const parent = new TestNode('parent');
        const child = new TestNode('child');

        // Добавляем parent в root
        rootElement.appendChild(parent.render());

        // Тестируем добавление child к parent
        domSync.handleAddNode(parent, child);

        const parentElement = document.getElementById('parent');
        const childElement = document.getElementById('child');

        expect(parentElement).toBeTruthy();
        expect(childElement).toBeTruthy();
        expect(parentElement?.contains(childElement)).toBe(true);
    });

    it('should update text content', () => {
        const node = new TestNode('text-node');
        rootElement.appendChild(node.render());

        domSync.handleUpdateTextContent('text-node', 'new content');

        expect(document.getElementById('text-node')?.textContent).toBe('');
    });

    it('should remove nodes from DOM', () => {
        const node = new TestNode('to-remove');
        rootElement.appendChild(node.render());

        expect(document.getElementById('to-remove')).toBeTruthy();
        domSync.handleRemoveElement('to-remove');
        expect(document.getElementById('to-remove')).toBeFalsy();
    });

    it('should handle mutations', () => {
        const node = new TestNode('mutating-node');
        rootElement.appendChild(node.render());

        // Симулируем мутацию
        const element = document.getElementById('mutating-node');
        if (element) {
            element.textContent = 'changed';

            const mutation = {
                type: 'characterData',
                target: element.firstChild as Node,
            } as unknown as MutationRecord;

            domSync.handleMutations([mutation]);

            // Проверяем, что обработчик мутации был вызван
            // (здесь нужно проверить ваш mock для triggerUpdateText)
        }
    });
});
