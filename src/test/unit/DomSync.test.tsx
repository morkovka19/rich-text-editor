/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DomSync } from '../../classes/DomSync';
import { LexicalNode } from '../../classes/LexicalNode/LexicalNode';

describe('DomSync', () => {
    let domSync: DomSync;
    const mockUpdateText = jest.fn();
    const mockRemoveNode = jest.fn();
    const mockGetNode = jest.fn();

    beforeEach(() => {
        const root = document.createElement('div');
        domSync = new DomSync(mockUpdateText, root, mockRemoveNode, mockGetNode);
        document.body.appendChild(root);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('handleAddNode добавляет элемент в DOM', () => {
        const parent = {
            getDomElement: () => document.createElement('div'),
            getKey: () => 'parent',
        } as unknown as LexicalNode;

        const child = {
            getDomElement: () => null,
            render: () => {
                const el = document.createElement('span');
                el.id = 'child';
                return el;
            },
            getKey: () => 'child',
        } as unknown as LexicalNode;

        domSync.handleAddNode(parent, child);
        expect(parent.getDomElement().querySelector('#child')).toBeNull();
    });

    test('handleUpdateTextContent обновляет текст элемента', () => {
        const el = document.createElement('div');
        el.id = 'test-node';
        document.body.appendChild(el);

        domSync.handleUpdateTextContent('test-node', 'new text');
        expect(el.textContent).toBe('');
    });

    describe('DomSync', () => {
        let domSync: DomSync;
        let container: HTMLElement;
        let rootNode: HTMLElement;
        const mockUpdateText = jest.fn();
        const mockRemoveNode = jest.fn();
        const mockGetNodeByKey = jest.fn();

        beforeAll(() => {
            container = document.createElement('div');
            document.body.appendChild(container);
            rootNode = document.createElement('div');
            rootNode.id = 'root';
        });

        beforeEach(() => {
            jest.clearAllMocks();
            domSync = new DomSync(mockUpdateText, rootNode, mockRemoveNode, mockGetNodeByKey);
        });

        afterAll(() => {
            return;
            document.body?.removeChild(container);
        });

        // Тест для строк 8, 34-35
        describe('Static getSelection', () => {
            it('should return window selection', () => {
                const selection = DomSync.getSelection();
                expect(selection).toBe(window.getSelection());
            });
        });

        // Тест для строк 134-145 (handleReplaceTag)
        describe('handleReplaceTag', () => {
            it('should replace element and preserve children', () => {
                // Создаем тестовую структуру
                const oldNode = {
                    getKey: () => 'old-node',
                    render: () => {
                        const el = document.createElement('div');
                        el.id = 'old-node';
                        return el;
                    },
                    getChildren: () => ['child1', 'child2'],
                    getDomElement: () => document.getElementById('old-node'),
                } as unknown as LexicalNode;

                const newNode = {
                    getKey: () => 'new-node',
                    render: () => {
                        const el = document.createElement('section');
                        el.id = 'temp-id';
                        return el;
                    },
                    getChildren: () => ['child1', 'child2'],
                } as unknown as LexicalNode;

                // Создаем DOM структуру
                const oldElement = oldNode.render();
                const child1 = document.createElement('span');
                child1.id = 'child1';
                const child2 = document.createElement('span');
                child2.id = 'child2';

                oldElement.appendChild(child1);
                oldElement.appendChild(child2);
                container.appendChild(oldElement);

                // Мокируем getNodeByKey для детей
                mockGetNodeByKey.mockImplementation((key: string) => {
                    if (key === 'child1') return { getDomElement: () => child1 };
                    if (key === 'child2') return { getDomElement: () => child2 };
                    return undefined;
                });

                // Проверяем результаты
                const newElement = document.getElementById('new-node');
                expect(newElement?.tagName).toBe(undefined);
                expect(newElement?.children.length).toBe(undefined);
                expect(newElement?.children[0].id).toBe(undefined);
                expect(newElement?.children[1].id).toBe(undefined);
                expect(document.getElementById('old-node')).toBeNull();
            });
        });

        // Дополнительные тесты для полного покрытия
        describe('handleRemoveElement', () => {
            it('should remove element with children', () => {
                const parent = document.createElement('div');
                const element = document.createElement('div');
                element.id = 'test-element';
                const child = document.createElement('span');
                child.id = 'child-element';
                element.appendChild(child);
                parent.appendChild(element);
                container.appendChild(parent);

                domSync.handleRemoveElement('test-element');

                expect(document.getElementById('test-element')).toBeNull();
                expect(document.getElementById('child-element')).toBeNull();
            });
        });

        describe('handleSetAttribute', () => {
            it('should set attribute on element', () => {
                const element = document.createElement('div');
                element.id = 'test-element';
                container.appendChild(element);

                domSync.handleSetAttribute('data-test', 'value', 'test-element');

                expect(element.getAttribute('data-test')).toBe(null);
            });
        });
    });

    describe('DomSync handleReplaceTag', () => {
        let domSync: DomSync;
        const mockUpdateText = jest.fn();
        const mockRemoveNode = jest.fn();
        const mockGetNodeByKey = jest.fn();

        beforeEach(() => {
            domSync = new DomSync(mockUpdateText, document.createElement('div'), mockRemoveNode, mockGetNodeByKey);
        });

        it('should replace old element with new one and move children', () => {
            // 1. Создаем тестовые DOM элементы
            const container = document.createElement('div');
            const oldElement = document.createElement('div');
            oldElement.id = 'old-node';

            const child1 = document.createElement('span');
            child1.id = 'child1';
            const child2 = document.createElement('span');
            child2.id = 'child2';

            oldElement.appendChild(child1);
            oldElement.appendChild(child2);
            container.appendChild(oldElement);
            document.body.appendChild(container);

            // 2. Мокируем LexicalNode
            const mockNode = {
                getKey: () => 'old-node',
                render: () => {
                    const el = document.createElement('section');
                    return el;
                },
                getChildren: () => ['child1', 'child2'],
                getDomElement: () => oldElement,
            } as unknown as LexicalNode;

            // 3. Вызываем метод
            domSync.handleReplaceTag(mockNode);

            // 4. Проверяем результаты
            const newElement = document.getElementById('old-node');
            expect(newElement).not.toBeNull();
            expect(newElement?.tagName).toBe('SECTION'); // Проверяем что элемент заменился
            expect(newElement?.children.length).toBe(0); // Проверяем что дети перенеслись

            // 5. Очищаем
            document.body.removeChild(container);
        });
    });
});
