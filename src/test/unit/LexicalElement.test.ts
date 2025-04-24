/* eslint-disable @typescript-eslint/no-unused-vars */
import { LexicalElement } from '../../classes/LexicalNode/LexicalElement';
import { LexicalNode } from '../../classes/LexicalNode/LexicalNode';
import { StyleProps } from '../../context/StylesContext';
import { TAGS } from '../../utils/constants';

// Конкретная реализация для тестирования абстрактного класса
class TestableElement extends LexicalElement {
    public render(): HTMLElement {
        throw new Error('Method not implemented.');
    }
    public getChildType(): string {
        throw new Error('Method not implemented.');
    }
    public clone(_key?: string): LexicalNode {
        throw new Error('Method not implemented.');
    }
    constructor(key: string) {
        super(key, TAGS.DIV);
    }

    // Реализация абстрактных методов
    getText(): string {
        return 'test-text';
    }

    updateText(text: string): HTMLElement {
        const el = document.createElement('div');
        el.textContent = text;
        return el;
    }

    getRange(): number | undefined {
        return 1;
    }

    setRange(_range: number): void {}

    setTypeList(_type: string): void {}

    setHref(_href: string): void {}

    getHref(): string {
        return 'test-href';
    }
}

describe('LexicalElement', () => {
    let element: TestableElement;
    const testKey = 'test-key';

    beforeAll(() => {
        // Инициализация перед всеми тестами
        element = new TestableElement(testKey);
    });

    beforeEach(() => {
        // Сброс состояния перед каждым тестом
        while (element.getChildren().length > 0) {
            element.removeChild(element.getChildren()[0]);
        }
        element.setStyle({});
    });

    test('initialization', () => {
        expect(element.getKey()).toBe(testKey);
        expect(element.getChildren()).toEqual([]);
        expect(element.getStyle()).toEqual({});
    });

    test('adding and removing children', () => {
        // Добавление
        element.addChild('child1');
        expect(element.getChildren()).toEqual(['child1']);

        // Добавление с позицией
        element.addChild('child0', 0);
        expect(element.getChildren()).toEqual(['child1', 'child0']);

        // Удаление
        element.removeChild('child0');
        expect(element.getChildren()).toEqual(['child1']);

        // Удаление несуществующего
        element.removeChild('non-existent');
        expect(element.getChildren()).toEqual(['child1']);
    });

    test('style management', () => {
        const style: StyleProps = {
            color: 'red',
            fontSize: '16px',
        };

        element.setStyle(style);
        expect(element.getStyle()).toEqual(style);

        element.setStyle({});
        expect(element.getStyle()).toEqual({});
    });

    test('text and other abstract methods', () => {
        expect(element.getText()).toBe('test-text');
        expect(element.updateText('new').textContent).toBe('new');
        expect(element.getRange()).toBe(1);
        expect(element.getHref()).toBe('test-href');
    });

    test('edge cases', () => {
        // Пустые операции
        expect(element.removeChildren(0, true)).toEqual([]);
        expect(element.getChildren()).toEqual([]);

        // Несуществующие позиции
        element.addChild('child1', 100);
        expect(element.getChildren()).toEqual(['child1']);
    });
});
